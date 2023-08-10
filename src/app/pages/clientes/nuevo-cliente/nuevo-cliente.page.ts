import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CuentasService } from 'src/app/services/cuentas.service';
import { UtilService } from 'src/app/services/util.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Cuenta } from 'src/app/models/cuenta.model';

@Component({
  selector: 'app-nuevo-cliente',
  templateUrl: './nuevo-cliente.page.html',
  styleUrls: ['./nuevo-cliente.page.scss'],
})
export class NuevoClientePage implements OnInit {

  distritos: any;
  direccion = false;
  
  form1: FormGroup;
  form2: FormGroup;

  constructor(
    private itemsService: CuentasService,
    private utilService: UtilService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {
    this.distritos = utilService.distritos;
  }

  ngOnInit() 
  {
    this.form1 = new FormGroup({
      nombre: new FormControl(null, {updateOn:'blur', validators: [Validators.required]}),
      apellido: new FormControl(null, {updateOn:'blur', validators: [Validators.required]}),
      telefono: new FormControl(null, {updateOn:'blur', validators: [Validators.required, Validators.maxLength(9),Validators.minLength(6)]}),
      email: new FormControl(null),
      ruc: new FormControl(null),
    });
    this.form2 = new FormGroup({
      direccion: new FormControl(null),
      distrito: new FormControl(null),
      ubicacion: new FormControl(null),
    });
  }
  onCrearItem()
  {
    if(!this.form1.valid)
    {
      return;
    }
    this.loadingCtrl.create({
      message: 'Creando Cuenta...'
    }).then(loadingEl => {
      loadingEl.present();
      let _item = new Cuenta(
        null,
        this.form1.value.nombre,
        this.form1.value.apellido,
        this.form1.value.telefono,
        this.form1.value.email,
        this.form2.value.direccion,
        this.form2.value.distrito,
        this.form2.value.ruc,
        this.form2.value.puntos,
        this.form2.value.ubicacion,
        null,
        null);
      console.log(_item);
      this.itemsService.addItem(_item)
          .subscribe(()=>{
            this.form1.reset();
            this.form2.reset();
            this.loadingCtrl.dismiss();
            this.router.navigate(['/clientes']);
          });
      });
  }


}
