import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Cuenta } from 'src/app/models/cuenta.model';
import { Subscription } from 'rxjs';
import { CuentasService } from 'src/app/services/cuentas.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit {

  items: Cuenta[];
  buscar=true;
  goalItems: Cuenta[];
  private sub$: Subscription;
  itemSelect: Cuenta;
  fechaRecojo: Date;
  fechaEntrega: Date;
  @Output() selItem  = new EventEmitter<any>();

  constructor(
    private itemsService: CuentasService,
  ) { }

  ngOnInit() {
    this.sub$ = this.itemsService.fetchItems().subscribe(res =>{
      this.items = res;
    });
  }
  
  addItem(item: Cuenta)
  {
    this.itemSelect = item;
    this.buscar=false;
    this.fechaRecojo = new Date();
    let fecha = new Date();
    this.fechaEntrega = new Date(fecha.setHours(fecha.getHours() + 24));
    this.selItem.emit({
      idCliente:item.id,
      nombreCliente:item.nombre + " " + item.apellido,
      telefonoCliente: item.telefono,
      fechaRecojo: this.fechaRecojo,
      fechaEntrega: this.fechaEntrega
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
