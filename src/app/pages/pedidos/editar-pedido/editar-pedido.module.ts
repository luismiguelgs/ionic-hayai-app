import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarPedidoPageRoutingModule } from './editar-pedido-routing.module';

import { EditarPedidoPage } from './editar-pedido.page';
import { EditarPagoComponent } from './editar-pago/editar-pago.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarPedidoPageRoutingModule,
  ],
  declarations: [
    EditarPedidoPage,
    EditarPagoComponent
  ],
  entryComponents: [
    EditarPagoComponent
  ]
})
export class EditarPedidoPageModule {}
