import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidosPage } from './pedidos.page';

const routes: Routes = [
  {
    path: '',
    component: PedidosPage
  },
  {
    path: 'nuevo',
    loadChildren: () => import('./nuevo-pedido/nuevo-pedido.module').then( m => m.NuevoPedidoPageModule)
  },
  {
    path: 'editar/:id',
    loadChildren: () => import('./editar-pedido/editar-pedido.module').then( m => m.EditarPedidoPageModule)
  },
  {
    path: 'creado/:id',
    loadChildren: () => import('./creado-pedido/creado-pedido.module').then( m => m.CreadoPedidoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidosPageRoutingModule {}
