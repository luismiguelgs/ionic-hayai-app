import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CajaPageRoutingModule } from './caja-routing.module';

import { CajaPage } from './caja.page';
import { ListaCajasComponent } from './lista-cajas/lista-cajas.component';
import { SaldoCajaComponent } from './saldo-caja/saldo-caja.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CajaPageRoutingModule
  ],
  declarations: [
    CajaPage,
    ListaCajasComponent,
    SaldoCajaComponent
  ]
})
export class CajaPageModule {}
