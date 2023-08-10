import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-editar-pago',
  templateUrl: './editar-pago.component.html',
  styleUrls: ['./editar-pago.component.scss'],
})
export class EditarPagoComponent implements OnInit {

  saldo: number;
  pago: number;
  estado: string;

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.pago = 0;
  }
  onUpdatePay(metodo: string)
  {
    if(this.pago < this.saldo){
      this.estado = 'IMPAGO'
    }
    else if(this.pago == this.saldo){
      this.estado = 'PAGADO'
    }
    const itemSelect = {pago: this.pago, metodoPago: metodo, estado:this.estado};
    this.modalCtrl.dismiss(itemSelect);
  }
  onCancel()
  {
    this.modalCtrl.dismiss();
  }

}
