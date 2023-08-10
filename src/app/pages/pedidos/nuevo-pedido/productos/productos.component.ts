import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';
import { Subscription } from 'rxjs';
import { ProductosService } from 'src/app/services/productos.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit, OnDestroy {

  items: Producto[];
  goalItems: Producto[];
  private sub$: Subscription;
  @Output() selItem  = new EventEmitter<Producto>();

  constructor(
    private itemsService: ProductosService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.sub$ = this.itemsService.fetchItems().subscribe(res =>{
      this.items = res;
      this.goalItems = res;
    });
  }
  addItem(item: Producto)
  {
    this.selItem.emit(item);
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
