import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreadoPedidoPageRoutingModule } from './creado-pedido-routing.module';

import { CreadoPedidoPage } from './creado-pedido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreadoPedidoPageRoutingModule
  ],
  declarations: [CreadoPedidoPage]
})
export class CreadoPedidoPageModule {}
