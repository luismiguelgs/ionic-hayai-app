import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {

  pago: number;
  metodoPago: string;
  precio: number;
  estado: string;

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() 
  {
    this.pago = this.precio;
  }
  onChange()
  {
    switch(this.metodoPago)
    {
      case 'IMPAGO':
        this.pago = 0;
        break;
      case 'EFECTIVO':
        if(this.pago == 0){
          this.pago = this.precio;
        }
        break;
      case 'TVP':
        if(this.pago == 0){
          this.pago = this.precio;
        }
        break;  
    }
    if(this.pago > this.precio){
      this.pago = this.precio;
    }
  }
  onSeleccionar()
  {
    if(this.pago < this.precio){
      this.estado = 'IMPAGO'
    }
    else if(this.pago == this.precio){
      this.estado = 'PAGADO'
    }
    const itemSelect = {pago: this.pago, metodoPago: this.metodoPago, estado:this.estado};
    this.modalCtrl.dismiss(itemSelect);
  }
  onCancel()
  {
    this.modalCtrl.dismiss();
  }
}
