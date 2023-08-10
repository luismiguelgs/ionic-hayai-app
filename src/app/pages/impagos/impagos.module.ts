import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImpagosPageRoutingModule } from './impagos-routing.module';

import { ImpagosPage } from './impagos.page';
import { ItemImpagoComponent } from './item-impago/item-impago.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImpagosPageRoutingModule
  ],
  declarations: [
    ImpagosPage,
    ItemImpagoComponent
  ]
})
export class ImpagosPageModule {}
