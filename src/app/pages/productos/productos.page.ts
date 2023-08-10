import { Component, OnInit, OnDestroy } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';
import { Subscription } from 'rxjs';
import { ProductosService } from 'src/app/services/productos.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController, IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit, OnDestroy {

  items: Producto[];
  nuevoItem = false;
  editarItem = false;
  goalItems: Producto[];
  private sub$: Subscription;

  constructor(
    private itemsService: ProductosService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.sub$ = this.itemsService.productos.subscribe(items =>{
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
  cerrarNuevo(data: boolean)
  {
    this.nuevoItem = data;
  }
  onEditar(itemId: string, slidingItem:IonItemSliding|null)
  {
    if(slidingItem){
      slidingItem.close();
    }
    this.editarItem = true;
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
