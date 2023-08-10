import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { Producto } from 'src/app/models/producto.model';
import { LoadingController, IonItemSliding, AlertController } from '@ionic/angular';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.scss'],
})
export class EditarProductoComponent implements OnInit {

  tipos: any;
  unidades: any;
  tiempos: any;
  form:FormGroup;
  editar = false;
  @Input() item: Producto;
  @Input() slidingItem: IonItemSliding;
  @Output() cerrar = new EventEmitter<boolean>();

  constructor(
    private utilService: UtilService,
    private loadingCtrl: LoadingController,
    private itemsService: ProductosService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() 
  {
    this.tipos = this.utilService.familias;
    this.unidades = this.utilService.unidades;
    this.tiempos = this.utilService.tiempos;
    this.form = new FormGroup({
      tipo: new FormControl(this.item.tipo, {updateOn:'blur', validators: [Validators.required]}),
      nombre: new FormControl(this.item.nombre, {updateOn:'blur', validators: [Validators.required]}),
      unidad: new FormControl(this.item.unidad, {updateOn:'blur', validators: [Validators.required]}),
      tiempo: new FormControl(this.item.tiempo, {updateOn:'blur', validators: [Validators.required]}),
      precio: new FormControl(this.item.precio, {updateOn:'blur', validators: [Validators.required]}),
    });
  }
  onEdit()
  {
    this.editar = true;
  }
  onCancel()
  {
    this.editar = false;
  }
  onDelete(itemId: string)
  {
    if(this.slidingItem){
      this.slidingItem.close();
    }
    this.alertCtrl.create({
      header: 'Borrar Elemento',
      message: '¿Esta serguro de borrar este elemento?',
      buttons:[
        {
          text: 'Aceptar',
          handler: ()=>{
            this.loadingCtrl.create({ message: 'Borrando...' }).then(loadingEl => {
              loadingEl.present();
              this.itemsService.deleteItem(itemId).subscribe(() => {
                loadingEl.dismiss();
              });
            });
          }
        },
        {
          text:'Cancelar',
          role: 'cancel'
        }
      ]
    }).then(alertEl =>{
      alertEl.present();
    });
    
    
  }
  onSave()
  {
    if(!this.form.valid)
    {
      return;
    }
    this.loadingCtrl.create({
      message: 'Guardando Producto...'
    }).then(loadingEl => {
      loadingEl.present();
      let nuevoProducto = new Producto(
        this.item.id,
        this.form.value.nombre,
        this.form.value.precio,
        this.form.value.tipo,
        this.form.value.unidad,
        this.form.value.tiempo,
        null,
        this.item.creado,
        null
      );
      this.itemsService.updateItem(nuevoProducto).subscribe(()=>{
        this.loadingCtrl.dismiss();
        this.onClose();
      });
    });
  }
  onClose()
  {
    this.form.reset();
    this.cerrar.emit(false);
  }

}
