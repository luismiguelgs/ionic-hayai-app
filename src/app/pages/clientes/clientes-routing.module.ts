import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientesPage } from './clientes.page';

const routes: Routes = [
  {
    path: '',
    component: ClientesPage
  },
  {
    path: 'editar/:id',
    loadChildren: () => import('./editar-cliente/editar-cliente.module').then( m => m.EditarClientePageModule)
  },
  {
    path: 'nuevo',
    loadChildren: () => import('./nuevo-cliente/nuevo-cliente.module').then( m => m.NuevoClientePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientesPageRoutingModule {}
