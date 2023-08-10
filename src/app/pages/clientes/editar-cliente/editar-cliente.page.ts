import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cuenta } from 'src/app/models/cuenta.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CuentasService } from 'src/app/services/cuentas.service';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.page.html',
  styleUrls: ['./editar-cliente.page.scss'],
})
export class EditarClientePage implements OnInit, OnDestroy {

  item: Cuenta;
  form1: FormGroup;
  form2: FormGroup;
  itemId: string;
  private sub$: Subscription;
  isLoading = false;
  distritos: any;
  direccion: false;

  constructor(
    private route: ActivatedRoute,
    private itemsService: CuentasService,
    private router:Router,
    private loadingCtrl:LoadingController,
    private alertCtrl: AlertController,
    private utilService: UtilService,
    private modalCtrl: ModalController
  ) { 
    this.distritos = utilService.distritos;
  }

  ngOnInit() 
  {
    this.route.paramMap.subscribe(paramMap =>{
      if(!paramMap.has('id'))
      {
        this.router.navigate(['/clientes']);
        return;
      }
      this.itemId = paramMap.get('id');
      this.isLoading = true;
      this.loadingCtrl.create({message: 'Cargando...'}).then(loadingEl => {
        loadingEl.present();
        this.sub$ = this.itemsService.getItem(this.itemId).subscribe(item => {
          this.item = item;
          console.log(this.item)
          this.form1 = new FormGroup({
            nombre: new FormControl(item.nombre, {updateOn:'blur', validators: [Validators.required]}),
            apellido: new FormControl(item.apellido, {updateOn:'blur', validators: [Validators.required]}),
            email: new FormControl(item.email),
            telefono: new FormControl(item.telefono, {updateOn:'blur', validators: [Validators.required, Validators.maxLength(9),Validators.minLength(6)]}),
            ruc: new FormControl(item.ruc),
          });
          this.form2 = new FormGroup({
            direccion: new FormControl(item.direccion, {updateOn:'blur', validators: [Validators.required]}),
            distrito: new FormControl(item.distrito, {updateOn:'blur', validators: [Validators.required]}),
            ubicacion: new FormControl(item.ubicacion),
          });
          this.isLoading = false;
          loadingEl.dismiss();
        }, error=>{
          this.alertCtrl.create({
            header: 'Ha ocurrido un error!',
            message: 'La consulta no puede ser realizada, intente mas tarde',
            buttons:[{text: 'Aceptar', handler: ()=>{
              this.router.navigate(['/clientes']);
            }}]
          }).then(alertEl =>{
            alertEl.present();
          });
        });
      });
    });
  }
  onUpdateItem()
  {
    if(!this.form1.valid)
    {
      return;
    }
    this.loadingCtrl.create({
      message: 'Actualizando datos...'
    }).then(loadingEl => {
      loadingEl.present();
      let newItem = new Cuenta(
        this.itemId,
        this.form1.value.nombre,
        this.form1.value.apellido,
        this.form1.value.telefono,
        this.form1.value.email,
        this.form2.value.direccion,
        this.form2.value.distrito,
        this.form1.value.ruc,
        null,
        null,
        this.item.creado,
        null
      );
      this.itemsService.updateItem(newItem).subscribe(()=>{
        loadingEl.dismiss();
        this.form1.reset();
        this.form2.reset();
        this.router.navigate(['/clientes']);
      });
    });
  }
  ngOnDestroy()
  {
    if(this.sub$)
    {
      this.sub$.unsubscribe();
    }
  }


}
