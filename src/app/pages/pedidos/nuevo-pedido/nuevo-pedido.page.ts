import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { Pedido } from 'src/app/models/pedido.model';
import { DetallePedido } from 'src/app/models/detallepedido.model';
import { Cuenta } from 'src/app/models/cuenta.model';
import { CheckoutComponent } from './checkout/checkout.component';
import { MovimientoCaja } from 'src/app/models/movimientocaja.model';
import { CajaService } from 'src/app/services/caja.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-nuevo-pedido',
  templateUrl: './nuevo-pedido.page.html',
  styleUrls: ['./nuevo-pedido.page.scss'],
})
export class NuevoPedidoPage implements OnInit {

  cart = [];
  total: number;
  nuevoPedido = {} as Pedido;
  clientes = false;
  cliente: Cuenta;

  constructor(
    private cartService: CartService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private cajaService: CajaService,
    private utilService: UtilService
  ) { }

  ngOnInit() 
  {
    this.total = 0;
    this.cart = this.cartService.getCart();
  }
  addCartItem(data:Producto)
  {
    let detalle = new DetallePedido(
      null,
      data.id,
      data.nombre,
      null,
      data.precio,
      null
      );
    this.cartService.addProduct(detalle);
  }
  decreseCartItem(producto: DetallePedido)
  {
    this.cartService.decreaseProduct(producto);
  }
  increaseCartItem(producto: DetallePedido)
  {
    this.cartService.addProduct(producto);
  }
  removeCartItem(producto: DetallePedido)
  {
    this.cartService.removeProduct(producto);
  }
  async editQuant(item:DetallePedido)
  {
    const alert = await this.alertCtrl.create({
      header:'Ingresar Cantidad',
      inputs:[
        {
          name: 'cantidad',
          type: 'number',
          placeholder: 'cantidad',
          min: 1,
          value: item.cantidad,
        }
      ],
      buttons:[
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler:(alertData) =>{
            item.cantidad = +alertData.cantidad;
            this.cartService.setQuant(item);
          }
        }
      ]
    });
    await alert.present();
  }
  addCustomer(data:any)
  {
    this.nuevoPedido.idCliente = data.idCliente;
    this.nuevoPedido.nombreCliente = data.nombreCliente;
    this.nuevoPedido.telefonoCliente = data.telefonoCliente;
    this.nuevoPedido.fechaRecojo = data.fechaRecojo;
    this.nuevoPedido.fechaEntrega = data.fechaEntrega;
  }
  getTotal()
  {
    return Math.ceil(this.cart.reduce((i,j) => i + j.precio * j.cantidad, 0)*10)/10;
  }
  checkout()
  {
    this.modalCtrl.create({
      component: CheckoutComponent,
      componentProps: {
        precio: this.getTotal()
      }
    }).then(modalEl =>{
      modalEl.onDidDismiss().then(modalData => {
        if(!modalData.data)
        {
          return;
        }
        //Obtener los datos
        this.nuevoPedido.metodoPago = modalData.data.metodoPago;
        this.nuevoPedido.pago = modalData.data.pago;
        this.nuevoPedido.estado = modalData.data.estado;

        //guardar pedido
        this.crearItem();
      });
      modalEl.present();
    });
  }
  async crearItem()
  {
    let loader = this.loadingCtrl.create({
      message: "Creando Pedido..."
    });
    (await loader).present();

    //crear pedido
    this.nuevoPedido.creado = new Date();
    this.nuevoPedido.modificado = new Date();
    this.nuevoPedido.total = Math.ceil(this.getTotal()*100)/100;
    this.nuevoPedido.proceso = 'RECIBIDO';

    let itemId: string;
    
    try {
      itemId = (await this.cartService.addItem(this.nuevoPedido)).id;
    }catch(e)
    {
      console.log(e);
    }
    for(let i=0;i<this.cart.length; i++)
    {
      try{
        await this.cartService.addItemDetalle(itemId, this.cart[i]);
      }
      catch(e)
      {
        console.log(e);
      }
    }
    //actualizar caja
    if(this.nuevoPedido.metodoPago == "EFECTIVO" && this.nuevoPedido.pago != 0)
    {
      try {
        const fecha = this.utilService.fechaActual;
        this.cajaService.getItem(fecha).subscribe(doc=>{
          let saldo = +doc.data()["saldo"];
          console.log(this.nuevoPedido.pago);
          let mov: MovimientoCaja = new MovimientoCaja(null, 'I', this.nuevoPedido.pago, saldo + this.nuevoPedido.pago, 'pedido:' + itemId);
          this.cajaService.createItemDetalle(fecha, mov).then(()=>{
              //ajustar saldo caja
              console.log(mov)
              this.cajaService.updateSaldo(fecha, saldo + this.nuevoPedido.pago);
          });
        });
      }catch(e){
        console.log(e);
      }
    }
    //dissmis loader
    (await loader).dismiss();
    //resetear valores
    this.cartService.deleteCart();
    this.cart = [];
    //this.nuevoPedido = new Pedido(null,null,null,null,null,null,null,null);
    this.clientes = false;
    //redirect to home page
    this.router.navigate(['/','pedidos','creado', itemId],{queryParams:{nuevo:true}});
  }
}
