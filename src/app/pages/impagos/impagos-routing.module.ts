import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImpagosPage } from './impagos.page';

const routes: Routes = [
  {
    path: '',
    component: ImpagosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImpagosPageRoutingModule {}
