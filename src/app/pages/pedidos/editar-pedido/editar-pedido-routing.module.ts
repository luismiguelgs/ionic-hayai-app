import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarPedidoPage } from './editar-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: EditarPedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarPedidoPageRoutingModule {}
