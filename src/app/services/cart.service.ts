import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Pedido } from '../models/pedido.model';
import { DetallePedido } from '../models/detallepedido.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

    private _cart = [];
    private _collection = 'shopping-cart';
    private _cartItemCount = new BehaviorSubject(0);

    constructor(private firestore: AngularFirestore) {}

    getCart()
    {
        return this._cart;
    }
    deleteCart()
    {
        this._cart = [];
    }
    getCartItemCount()
    {
        return this._cartItemCount;
    }
    addProduct(item: DetallePedido)
    {
        let added = false;
        for(let p of this._cart)
        {
            if(p.idProducto === item.idProducto)
            {
              p.cantidad += 1;
              added = true;
              break;
            }
        }
        if(!added)
        {
            item.cantidad = 1; //user cart
            this._cart.push(item);
        }
        this._cartItemCount.next(this._cartItemCount.value + 1);
    }
    decreaseProduct(item: DetallePedido)
    {
        for(let[index, p] of this._cart.entries())
        {
            if(p.idProducto === item.idProducto)
            {
                p.cantidad -= 1;
                if(p.cantidad == 0)
                {
                    this._cart.splice(index, 1);
                }
            }
        }
        this._cartItemCount.next(this._cartItemCount.value -1);
    }
    removeProduct(item: DetallePedido)
    {
        for(let[index, p] of this._cart.entries())
        {
            if(p.id === item.idProducto)
            {
                this._cartItemCount.next(this._cartItemCount.value - p.cantidad);
                this._cart.splice(index, 1);
            }
        }
    }
    setQuant(item:DetallePedido)
    {
        for(let[index, p] of this._cart.entries())
        {
            if(p.id === item.idProducto)
            {
                p.cantidad = item.cantidad;
                break;
            }
        }
    }
    //FIRESTORE *******************************************************************************************************************************************
    getItems() 
    {
        return this.firestore.collection(this._collection, ref=> ref.orderBy('fechaEntrega', 'desc')).snapshotChanges();
    }
    fetchItems(estado: string)
    {
        return this.firestore.collection(this._collection, ref=> ref.where('estado', '==', estado).orderBy('fechaEntrega')).snapshotChanges();
    }
    addItem(pedido: Pedido)
    {
        return this.firestore.collection(this._collection).add(pedido);
    }
    updateItem(id: string, pedido: Pedido)
    {
        return this.firestore.collection(this._collection).doc(id).update(
          {
            fechaEntrega: new Date(pedido.fechaEntrega),
            metodoPago: pedido.metodoPago,
            pago: pedido.pago,
            estado: pedido.estado,
            modificado: new Date()
          }
        );
    }
    updateState(id:string, estado:string)
    {
        return this.firestore.collection(this._collection).doc(id).update(
            {
              estado: estado,
              modificado: new Date()
            }
        );
    }
    getItem(id:string)
    {
      return this.firestore.collection(this._collection).doc(id).get();
    }
    deleteItem(id: string)
    {
        return this.firestore.collection(this._collection).doc(id).delete();
    }
    //Item Detalle
    addItemDetalle(id:string, detalle: DetallePedido)
    {
        return this.firestore.collection(this._collection).doc(id).collection('items').add({
            idProducto: detalle.idProducto,
            nombreProducto: detalle.nombreProducto,
            cantidad: detalle.cantidad,
            precio: detalle.precio,
            monto: detalle.cantidad * detalle.precio
        });
    }
    getItemDetalle(id: string)
    {
        return this.firestore.collection(this._collection).doc(id).collection('items').snapshotChanges();
    }
    
}
