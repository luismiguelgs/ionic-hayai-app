import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto } from 'src/app/models/producto.model';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.scss'],
})
export class NuevoProductoComponent implements OnInit {

  tipos: any;
  unidades: any;
  tiempos: any;
  form:FormGroup;
  @Output() cerrar = new EventEmitter<boolean>();

  constructor(
    private utilService: UtilService,
    private loadingCtrl: LoadingController,
    private itemsService: ProductosService,
  ) { }

  ngOnInit() 
  {
    this.tipos = this.utilService.familias;
    this.unidades = this.utilService.unidades;
    this.tiempos = this.utilService.tiempos;
    this.form = new FormGroup({
      tipo: new FormControl(null, {updateOn:'blur', validators: [Validators.required]}),
      nombre: new FormControl(null, {updateOn:'blur', validators: [Validators.required]}),
      unidad: new FormControl(null, {updateOn:'blur', validators: [Validators.required]}),
      tiempo: new FormControl(null, {updateOn:'blur', validators: [Validators.required]}),
      precio: new FormControl(null, {updateOn:'blur', validators: [Validators.required]}),
    });
  }
  onCreate()
  {
    if(!this.form.valid)
    {
      return;
    }
    this.loadingCtrl.create({
      message: 'Creando Producto...'
    }).then(loadingEl => {
      loadingEl.present();
      let nuevoProducto = new Producto(
        null,
        this.form.value.nombre,
        this.form.value.precio,
        this.form.value.tipo,
        this.form.value.unidad,
        this.form.value.tiempo,
        null,
        null,
        null
      );
      console.log(nuevoProducto)
      this.itemsService.addItem(nuevoProducto).subscribe(()=>{
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
