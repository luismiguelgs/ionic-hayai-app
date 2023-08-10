import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevoPedidoPage } from './nuevo-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: NuevoPedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevoPedidoPageRoutingModule {}
