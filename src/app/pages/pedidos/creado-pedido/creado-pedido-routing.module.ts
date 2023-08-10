import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreadoPedidoPage } from './creado-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: CreadoPedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreadoPedidoPageRoutingModule {}
