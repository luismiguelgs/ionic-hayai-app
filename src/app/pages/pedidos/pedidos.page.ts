import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { map } from 'rxjs/operators';
import { Pedido } from 'src/app/models/pedido.model';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {

  items: any;
  pedidos: Observable<any[]>;
  sortDirection = 0;

  constructor(
    private loadingCtrl: LoadingController,
    private itemsService: CartService,
  ) { }

  ngOnInit() 
  {
    this.getItems();
  }
  ionViewWillEnter()
  {
    
  }
  sortBy(item:string)
  {

  }
  onProcess()
  {}
  async getItems()
  {
    let loader = await this.loadingCtrl.create({
      message: "Cargando..."
    });
    loader.present();

    try{
      this.pedidos = this.itemsService.getItems().pipe(map(actions=>{
        return actions.map(a=>{
          const data = a.payload.doc.data() as any;
          data.fechaEntrega = new Date(data.fechaEntrega.seconds*1000);
          data.fechaRecojo = new Date(data.fechaRecojo.seconds*1000);
          const id = a.payload.doc.id;
          loader.dismiss()
          return { id, ...data};
        });
      }));
    }catch(e)
    {
      console.log(e);
    } 
  }
  async cancelItem(id: string)
  {
    let loader = await this.loadingCtrl.create({
      message: "Cargando..."
    });
    loader.present();
    this.itemsService.updateState(id, 'CANCELADO').then(()=>{
      loader.dismiss();
    });
  }
  deleteItem(id: string)
  {
    //show loader
    this.loadingCtrl.create({
      message: "Borrando..."
    }).then(loaderEl => {
      loaderEl.present();
      this.itemsService.deleteItem(id).then(()=>{
        loaderEl.dismiss();
      })
    });
  }
}
