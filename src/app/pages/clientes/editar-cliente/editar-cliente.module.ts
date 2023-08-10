import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarClientePageRoutingModule } from './editar-cliente-routing.module';

import { EditarClientePage } from './editar-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditarClientePageRoutingModule
  ],
  declarations: [EditarClientePage]
})
export class EditarClientePageModule {}
