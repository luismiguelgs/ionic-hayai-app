import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductosPageRoutingModule } from './productos-routing.module';

import { ProductosPage } from './productos.page';
import { NuevoProductoComponent } from './nuevo-producto/nuevo-producto.component';
import { EditarProductoComponent } from './editar-producto/editar-producto.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ProductosPageRoutingModule
  ],
  declarations: [
    ProductosPage,
    NuevoProductoComponent,
    EditarProductoComponent
  ]
})
export class ProductosPageModule {}
