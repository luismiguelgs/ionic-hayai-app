import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { Pedido } from 'src/app/models/pedido.model';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-creado-pedido',
  templateUrl: './creado-pedido.page.html',
  styleUrls: ['./creado-pedido.page.scss'],
})
export class CreadoPedidoPage implements OnInit {

  item:any;
  itemDetalle: any;
  itemId: string;
  private sub$: Subscription;
  years = [new Date().getFullYear(), new Date().getFullYear() + 1];
  estados: any[];

  constructor(
    private route: ActivatedRoute,
    private itemsService: CartService,
    private router:Router,
    private loadingCtrl:LoadingController,
    private alertCtrl: AlertController,
    private utilService: UtilService,
    private printService: PrintService,
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
          this.item.fechaEntrega = new Date(this.item.fechaEntrega.seconds*1000);
          this.item.fechaRecojo = new Date(this.item.fechaRecojo.seconds*1000);
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
  getTotal()
  {
    return this.itemDetalle.reduce((i,j) => i + j.precio * j.cantidad, 0);
  }
  onPrintInvoice()
  {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Ticket</title>
          <style>
          .ticket-card {
            padding: 4rem;
            width: 100%;
            border: 1px solid #ddd;
        }
        .ticket-column[data-v-7e2d4cec] {
            display: flex;
            flex-direction: column;
            flex: 1;
            margin-bottom: 1rem;
        }
          </style>
        </head>
      <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
  ngOnDestroy()
  {
    if(this.sub$)
    {
      this.sub$.unsubscribe();
    }
  }
}
