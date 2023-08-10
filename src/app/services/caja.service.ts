import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Caja } from '../models/caja.model';
import { MovimientoCaja } from '../models/movimientocaja.model';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

    private _cart = [];
    private _collection = 'caja';
    private _cartItemCount = new BehaviorSubject(0);

    constructor(private firestore: AngularFirestore) {}

    getItems() 
    {
        return this.firestore.collection(this._collection, ref=> ref.orderBy('fechaAbierta', 'desc').limit(20)).snapshotChanges();
    }
    createItem(fecha: string, saldo: number)
    {
        return this.firestore.collection(this._collection).doc(fecha).set({
            abierto: true,
            fechaAbierta: new Date(),
            fechaCerrada: new Date(),
            saldo: saldo
        });
    }
    updateSaldo(id: string, saldo:number)
    {
        return this.firestore.collection(this._collection).doc(id).update({
            saldo: saldo
        });
    }
    updateState(id:string, estado:boolean)
    {
        return this.firestore.collection(this._collection).doc(id).update({
            abierto: estado,
            fechaCerrada: new Date(),
        });
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
    createItemDetalle(id:string, detalle: MovimientoCaja)
    {
        const hora = new Date().toTimeString().slice(0,8);
        return this.firestore.collection(this._collection).doc(id).collection('items').doc(hora).set({
           movimiento: detalle.movimiento,
           monto: +detalle.monto,
           comentario: detalle.comentario,
           saldo: +detalle.saldo,
           timestamp: new Date().getTime()
        });
    }
    getItemDetalle(id: string)
    {
        return this.firestore.collection(this._collection).doc(id).collection('items', ref=> ref.orderBy('timestamp','desc')).snapshotChanges();
    }
}
