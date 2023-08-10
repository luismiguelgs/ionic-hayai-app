import { Component, OnInit, Input } from '@angular/core';
import { Pedido } from 'src/app/models/pedido.model';
import { AlertController, LoadingController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import { CajaService } from 'src/app/services/caja.service';
import { MovimientoCaja } from 'src/app/models/movimientocaja.model';

@Component({
  selector: 'app-item-impago',
  templateUrl: './item-impago.component.html',
  styleUrls: ['./item-impago.component.scss'],
})
export class ItemImpagoComponent implements OnInit {

  @Input() item: Pedido;
  pagar= false;
  ultimoPago: number;

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private itemsService: CartService,
    private utilService: UtilService,
    private cajaService: CajaService
  ) { }

  ngOnInit() {
    
  }
  async updatePay(tipo:string)
  {
    console.log(this.item)
    this.item.metodoPago = tipo;
    const alert = await this.alertCtrl.create({
      header: 'Actualizar Pago',
      inputs:[
        {
          name: 'cantidad',
          type: 'number',
          value: this.item.total - this.item.pago,
          placeholder: 'Ingresar cantidad',
          min: 1,
        },
      ],
      buttons:[
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler:(alertData) =>{
            this.ultimoPago = +alertData.cantidad;
            this.saveItem(tipo);
          }
        }
      ]
    });
    alert.present();
  }
  saveItem(tipo:string)
  {
    this.loadingCtrl.create({message: 'Cargando...'}).then(loadingEl =>{
      loadingEl.present();
      this.item.pago = this.item.pago + this.ultimoPago;
      if(this.item.pago == this.item.total){
        this.item.estado = 'PAGADO'
      }
      this.itemsService.updateItem(this.item.id, this.item).then(()=>{
        if(tipo == 'EFECTIVO'){
          this.updateCash();
        }
        loadingEl.dismiss();
      });
    });
  }
  updateCash()
  {
    //actualizar caja
    if(this.ultimoPago != 0)
    {
      try {
        const fecha = this.utilService.fechaActual;
        this.cajaService.getItem(fecha).subscribe(doc=>{
          let saldo = +doc.data()["saldo"];
          let mov: MovimientoCaja = new MovimientoCaja(null, 'I', this.ultimoPago, saldo + this.ultimoPago, 'pedido:' + this.item.id);
          this.cajaService.createItemDetalle(fecha, mov).then(()=>{
              //ajustar saldo caja
              this.cajaService.updateSaldo(fecha, saldo + this.ultimoPago);
          });
        });
      }catch(e){
        console.log(e);
      }
    }
  }
}
