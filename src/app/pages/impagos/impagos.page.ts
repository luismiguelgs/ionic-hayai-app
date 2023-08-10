import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/models/pedido.model';
import { Subscription, Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-impagos',
  templateUrl: './impagos.page.html',
  styleUrls: ['./impagos.page.scss'],
})
export class ImpagosPage implements OnInit {

  fechaI: string;
  fechaF: string;
  items: any[];
  goalItems: any[];
  private sub$: Subscription;
  pedidos: Observable<any[]>;

  constructor(
    private loadingCtrl: LoadingController,
    private itemsService: CartService
  ) { }

  ngOnInit() {
    this.getItems();
  }
  async getItems()
  {
    let loader = await this.loadingCtrl.create({
      message: "Cargando..."
    });
    loader.present();

    try{
      this.itemsService.fetchItems('IMPAGO').subscribe(data=>{
        this.items = data.map(e => {
          return {
            id: e.payload.doc.id,
            nombreCliente: e.payload.doc.data()["nombreCliente"],
            telefonoCliente: e.payload.doc.data()["telefonoCliente"],
            fechaEntrega: e.payload.doc.data()["fechaEntrega"].toDate(),
            fechaRecojo: e.payload.doc.data()["fechaRecojo"].toDate(),
            total: e.payload.doc.data()["total"],
            estado: e.payload.doc.data()["estado"],
            pago: e.payload.doc.data()["pago"],
            metodoPago: e.payload.doc.data()["metodoPago"],
            creado: e.payload.doc.data()["creado"].toDate(),
            modificado: e.payload.doc.data()["modificado"].toDate()
          }
        });
        this.goalItems = this.items;
        loader.dismiss();
      })
    }catch(e){
      console.log(e);
    }
    /*
    try{
      this.pedidos = this.itemsService.fetchItems('IMPAGO').pipe(map(actions=>{
        return actions.map(a=>{
          const data = a.payload.doc.data() as any;
          data.fechaEntrega = data.fechaEntrega.toDate();
          data.fechaRecojo = data.fechaRecojo.toDate();
          const id = a.payload.doc.id;
          loader.dismiss()
          return { id, ...data};
        });
      }));
    }catch(e)
    {
      console.log(e);
    } 
    */
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
      if(currentGoal.nombreCliente && searchTerm){
        if(currentGoal.nombreCliente.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
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
