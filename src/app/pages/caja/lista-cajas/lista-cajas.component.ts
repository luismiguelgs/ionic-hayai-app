import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { CajaService } from 'src/app/services/caja.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { MovimientoCaja } from 'src/app/models/movimientocaja.model';
import { Caja } from 'src/app/models/caja.model';

@Component({
  selector: 'app-lista-cajas',
  templateUrl: './lista-cajas.component.html',
  styleUrls: ['./lista-cajas.component.scss'],
})
export class ListaCajasComponent implements OnInit {

  items: any[];
  itemSelect: Caja;
  fechaActual: string;
  saldo: number;
  abierto: boolean;
  @Output() movimientos = new EventEmitter<Caja>();

  constructor(
    private itemService: CajaService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.fechaActual = this.utilService.fechaActual;
    this.getItems();
  }
  getItems()
  {
    this.loadingCtrl.create({message:'Cargando'}).then(loadingEl=>{
      loadingEl.present();
      this.itemService.getItems().subscribe(data =>{
        this.items = data.map(e => {
          return {
            id: e.payload.doc.id,
            saldo: e.payload.doc.data()["saldo"],
            abierto: e.payload.doc.data()["abierto"],
            fechaAbierta: e.payload.doc.data()["fechaAbierta"].toDate(),
            fechaCerrada: e.payload.doc.data()["fechaCerrada"].toDate(),
          }
        });
        loadingEl.dismiss();
        this.initOptions();
      });
    });
  }
  initOptions()
  {
    //primera vez
    if(this.items.length == 0){
      console.log("primera vez");
      this.alertApertura();
    }
    //no creado
    else if(this.items[0].id != this.fechaActual){
      console.log("crear caja del dia");
      this.saldo = this.items[0].saldo;
      this.crearCaja();
    }
    //creado
    else{
      console.log("creado");
      this.saldo = this.items[0].saldo;
      //verificar si esta abierta o cerrada
      this.abierto = this.items[0].abierto;
      //abrir los items de la ultima caja
      this.getMovimientos();
    }
  }
  async alertApertura()
  {
    const alert = await this.alertCtrl.create({
      header:'Ingreso',
      inputs:[
        {
          name: 'cantidad',
          type: 'number',
          placeholder: 'cantidad',
          min: 1,
          value: 0,
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
            this.saldo = alertData.cantidad;
            this.crearCaja();
          }
        }
      ]
    });
    alert.present();
  }
  async crearCaja()
  {
    let loader = this.loadingCtrl.create({
      message: "Creando Caja..."
    });
    (await loader).present();
    //crear caja
    try {
      this.itemService.createItem(this.fechaActual, this.saldo).then(()=>{
        this.abierto = true;
        //crear primer item
        let movimiento = new MovimientoCaja(null,'A',0,this.saldo,null);
        this.itemService.createItemDetalle(this.fechaActual,movimiento).then(()=>{
          this.getMovimientos();
        });
      });
    }catch(e)
    {
      console.log(e);
    }
    //dissmis loader
    (await loader).dismiss();
  }
  abrirCaja()
  {
    let selItem = this.items[0];
    let mov: MovimientoCaja = new MovimientoCaja(null, 'A', 0, selItem.saldo, null);
    this.itemService.createItemDetalle(selItem.id, mov).then(()=>{
      this.itemService.updateState(selItem.id, true).then(()=>{
        this.getMovimientos();
        this.abierto = true;
      });
    });
  }
  getCaja(item:Caja)
  {
    this.movimientos.emit(item);
  }
  getMovimientos()
  {
    this.movimientos.emit(this.items[0]);
  }
}
