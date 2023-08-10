import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevoPedidoPageRoutingModule } from './nuevo-pedido-routing.module';

import { NuevoPedidoPage } from './nuevo-pedido.page';
import { ProductosComponent } from './productos/productos.component';
import { ClientesComponent } from './clientes/clientes.component';
import { CheckoutComponent } from './checkout/checkout.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevoPedidoPageRoutingModule
  ],
  declarations: [
    NuevoPedidoPage,
    ProductosComponent,
    ClientesComponent,
    CheckoutComponent,
  ],
  entryComponents:[
    CheckoutComponent
  ]
})
export class NuevoPedidoPageModule {}
