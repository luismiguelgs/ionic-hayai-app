import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { CajaService } from '../../services/caja.service';
import { Observable, Subscription } from 'rxjs';
import { MovimientoCaja } from 'src/app/models/movimientocaja.model';
import { Caja } from 'src/app/models/caja.model';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.page.html',
  styleUrls: ['./caja.page.scss'],
})
export class CajaPage implements OnInit, OnDestroy{

  sub$: Subscription;
  fecha:string;
  abierto=false;
  saldo: number;
  
  selItem: Caja;
  movimiento: MovimientoCaja;
  movimientos: any[];

  constructor(
    private alertCtrl: AlertController,
    private itemService: CajaService,
    private loadingCtrl: LoadingController,
    private utilService: UtilService
  ) { }

  ngOnInit() {
  }
  getMovimientos(caja:Caja){
    this.selItem = caja;
    this.saldo = caja.saldo;
    this.abierto = caja.abierto;
    this.fecha = caja.id;
    this.loadingCtrl.create({message:'Cargando'}).then(loadingEl=>{
      loadingEl.present();
      this.itemService.getItemDetalle(caja.id).subscribe(data =>{
        this.movimientos = data.map(e => {
          return {
            id: e.payload.doc.id,
            movimiento: e.payload.doc.data()["movimiento"],
            monto: e.payload.doc.data()["monto"],
            saldo: e.payload.doc.data()["saldo"],
            comentario: e.payload.doc.data()["comentario"],
          }
        });
        loadingEl.dismiss();
      });
    });
  }
  async setearMovimiento(tipo:string){
    let h:string;
    if(tipo=='I'){
      h = 'Ingreso';
    }else{
      h = 'Salida';
    }
    const alert = await this.alertCtrl.create({
      header: h,
      inputs:[
        {
          name: 'cantidad',
          type: 'number',
          placeholder: 'Ingresar cantidad',
          min: 1,
        },
        {
          name: 'comentario',
          type: 'text',
          placeholder: 'Ingresar comentario',
        }
      ],
      buttons:[
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler:(alertData) =>{
            let cantidad = +alertData.cantidad
            if(tipo=='I'){
              this.saldo = this.saldo + cantidad;
            }else{
              this.saldo = this.saldo - cantidad;
            }
            console.log(this.saldo)
            let mov: MovimientoCaja = new MovimientoCaja(null, tipo, cantidad,this.saldo,alertData.comentario);
            this.itemService.createItemDetalle(this.fecha, mov).then(()=>{
              //ajustar saldo caja
              this.itemService.updateSaldo(this.fecha, this.saldo)
            });
          }
        }
      ]
    });
    alert.present();
  }
  cerrarCaja()
  {
    let mov: MovimientoCaja = new MovimientoCaja(null, 'C', 0, this.utilService.redondear2dec(this.selItem.saldo), null);
    this.itemService.createItemDetalle(this.selItem.id, mov).then(()=>{
      this.itemService.updateState(this.selItem.id, false).then(()=>{
        this.getMovimientos(this.selItem);
        this.abierto = false;
      })
    })
  }
  ngOnDestroy()
  {
    if(this.sub$){
      this.sub$.unsubscribe();
    }
  }
}
