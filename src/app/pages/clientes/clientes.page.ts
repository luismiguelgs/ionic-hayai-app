import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cuenta } from 'src/app/models/cuenta.model';
import { Subscription } from 'rxjs';
import { CuentasService } from 'src/app/services/cuentas.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController, IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit, OnDestroy {

  items: Cuenta[];
  goalItems: Cuenta[];
  private sub$: Subscription;

  constructor(
    private itemsService: CuentasService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.sub$ = this.itemsService.cuentas.subscribe(items =>{
      this.items = items;
      this.goalItems = items;
    });
  }
  ionViewWillEnter()
  {
    this.loadingCtrl.create({
      message: 'Cargando...'
    }).then(loadingEl =>{
      loadingEl.present();
      this.itemsService.fetchItems().subscribe(()=>{
        loadingEl.dismiss();
      });
    });
  }
  onEditar(itemId: string, slidingItem?:IonItemSliding|null)
  {
    if(slidingItem){
      slidingItem.close();
    }
    this.router.navigate(['/','clientes','editar', itemId]);
  }
  onBorrar(itemId: string, slidingItem?:IonItemSliding|null)
  {
    if(slidingItem){
      slidingItem.close();
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
  initializeItems(): void
  {
    this.goalItems = this.items;
  }
  filterList(event: any)
  {
    this.initializeItems();
    const searchTerm = event.srcElement.value;
    if(!searchTerm)
    {
      return;
    }
    this.goalItems = this.goalItems.filter(currentGoal => {
      if(currentGoal.nombre && searchTerm){
        if(currentGoal.nombre.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
        {
          return true;
        }
        return false;
      }
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
