import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/models/pedido.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { EditarPagoComponent } from './editar-pago/editar-pago.component';
import { CajaService } from 'src/app/services/caja.service';
import { MovimientoCaja } from 'src/app/models/movimientocaja.model';

@Component({
  selector: 'app-editar-pedido',
  templateUrl: './editar-pedido.page.html',
  styleUrls: ['./editar-pedido.page.scss'],
})
export class EditarPedidoPage implements OnInit {

  item:any;
  itemDetalle: any;
  itemId: string;
  private sub$: Subscription;
  editDate = true;
  estados: any[];
  ultimoPago: number;

  constructor(
    private route: ActivatedRoute,
    private itemsService: CartService,
    private router:Router,
    private loadingCtrl:LoadingController,
    private alertCtrl: AlertController,
    private utilService: UtilService,
    private modalCtrl: ModalController,
    private cajaService: CajaService
  ) { }

  ngOnInit() {
    this.estados = this.utilService.estados;
    this.route.paramMap.subscribe(paramMap=>{
      if(!paramMap.has('id'))
      {
        this.router.navigate(['/pedidos']);
        return;
      }
      this.itemId = paramMap.get('id');
      this.loadingCtrl.create({message: 'Cargando...'}).then(loadingEl =>{
        loadingEl.present();
        this.sub$ = this.itemsService.getItem(this.itemId).subscribe(item=> {
          this.item = item.data() as Pedido;
          this.item.fechaEntrega = new Date(this.item.fechaEntrega.seconds*1000).toISOString();
          this.item.fechaRecojo = new Date(this.item.fechaRecojo.seconds*1000).toISOString();
          //carger items
          try{
            this.itemsService.getItemDetalle(this.itemId).subscribe(data =>{
              this.itemDetalle = data.map(e => {
                return {
                  id: e.payload.doc.id,
                  idProducto: e.payload.doc.data()["idProducto"],
                  nombreProducto: e.payload.doc.data()["nombreProducto"],
                  cantidad: e.payload.doc.data()["cantidad"],
                  precio: e.payload.doc.data()["precio"],
                  monto: e.payload.doc.data()["monto"],
                }
              });
            });
          }catch(e)
          {
            console.log(e);
          } 
          loadingEl.dismiss();
        }, error=> {
          this.alertCtrl.create({
            header: 'Ha ocurrido un error!',
            message: 'La consulta no puede ser realizada, intente mas tarde',
            buttons:[{text: 'Aceptar', handler: ()=>{
              this.router.navigate(['/pedidos']);
            }}]
          }).then(alertEl =>{
            alertEl.present();
          });
        });
      });
    });
  }
  updatePay()
  {
    this.modalCtrl.create({
      component: EditarPagoComponent,
      componentProps: {
        saldo: this.item.total - this.item.pago
      }
    }).then(modalEl =>{
      modalEl.onDidDismiss().then(modalData => {
        if(!modalData.data)
        {
          return;
        }
        //Obtener los datos
        this.item.metodoPago = modalData.data.metodoPago;
        this.ultimoPago = modalData.data.pago;
        this.item.estado = modalData.data.estado;

        //guardar pedido
        this.saveItem();
      });
      modalEl.present();
    });
  }
  saveItem()
  {
    this.loadingCtrl.create({message: 'Cargando...'}).then(loadingEl =>{
      loadingEl.present();
      this.item.pago = this.item.pago + this.ultimoPago;
      this.itemsService.updateItem(this.itemId, this.item).then(()=>{
        this.updateCash();
        loadingEl.dismiss();
        this.router.navigate(['/pedidos']);
      });
    });
  }
  updateCash()
  {
    //actualizar caja
    if(this.item.metodoPago == "EFECTIVO" && this.ultimoPago != 0)
    {
      try {
        const fecha = this.utilService.fechaActual;
        this.cajaService.getItem(fecha).subscribe(doc=>{
          let saldo = +doc.data()["saldo"];
          let mov: MovimientoCaja = new MovimientoCaja(null, 'I', this.ultimoPago, saldo + this.ultimoPago, 'pedido:' + this.itemId);
          this.cajaService.createItemDetalle(fecha, mov).then(()=>{
              //ajustar saldo caja
              console.log(mov)
              this.cajaService.updateSaldo(fecha, saldo + this.ultimoPago);
          });
        });
      }catch(e){
        console.log(e);
      }
    }
  }
  getTotal()
  {
    return this.itemDetalle.reduce((i,j) => i + j.precio * j.cantidad, 0);
  }
  ngOnDestroy()
  {
    if(this.sub$)
    {
      this.sub$.unsubscribe();
    }
  }
}
