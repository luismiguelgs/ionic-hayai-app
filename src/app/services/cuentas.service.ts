import { Injectable } from '@angular/core';
import { Cuenta, CuentaData } from '../models/cuenta.model';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Ubicacion } from '../models/ubicacion.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CuentasService
{
    private _cuentas = new BehaviorSubject<Cuenta[]>([]);
    private  url = environment.firebaseConfig.databaseURL;

    get cuentas()
    {
        return this._cuentas.asObservable();
    }
  
    constructor(private http: HttpClient) { }

    fetchItems()
    {
        return this.http.get<{[key:string]: CuentaData}>(this.url + '/clientes.json').pipe(
            take(1),
            map(resData => {
                const cuentas = [];
                for(const key in resData)
                {
                  if(resData.hasOwnProperty(key))
                  {
                    cuentas.push(new Cuenta(
                      key,
                      resData[key].nombre,
                      resData[key].apellido,
                      resData[key].telefono,
                      resData[key].email,
                      resData[key].direccion,
                      resData[key].distrito,
                      resData[key].ruc,
                      resData[key].puntos,
                      resData[key].ubicacion,
                      new Date(resData[key].creado),
                      new Date(resData[key].modificado),
                    ));
                  }
                }
                return cuentas;
            }),
            tap(cuentas => {
                this._cuentas.next(cuentas);
            })
        );
    }
    addItem(item: Cuenta)
    {
        let id: string;
        let nuevaCuenta: Cuenta;
        nuevaCuenta = new Cuenta(
            null,
            item.nombre,
            item.apellido,
            item.telefono,
            item.email,
            item.direccion,
            item.distrito,
            item.ruc,
            item.puntos,
            item.ubicacion,
            new Date(),
            new Date()
        );
        return this.http.post<{id:string}>(this.url + '/clientes.json', {...nuevaCuenta}).pipe(
            take(1),
            switchMap(resData =>{
                id = resData.id;
                return this.cuentas;
            }),
            take(1),
            tap(cuentas => {
                nuevaCuenta.id = id;
                this._cuentas.next(cuentas.concat(nuevaCuenta));
            })
        );
    }
    updateItem(item: Cuenta)
    {
        let updatedItems: Cuenta[];
        return this.cuentas.pipe(
            take(1),
            switchMap(items => {
                const updatedItemIndex = items.findIndex(_item => _item.id === item.id);
                updatedItems = [...items];
                const oldItem = updatedItems[updatedItemIndex];
                updatedItems[updatedItemIndex] = new Cuenta(
                    item.id,
                    item.nombre,
                    item.apellido,
                    item.telefono,
                    item.email,
                    item.direccion,
                    item.distrito,
                    item.ruc,
                    item.puntos,
                    item.ubicacion,
                    item.creado,
                    new Date()
                );
                return this.http.put(this.url + `/clientes/${item.id}.json`, {...updatedItems[updatedItemIndex], id:null});
            }),
            tap(() => {
                this._cuentas.next(updatedItems);
            })
        );
    }
    getItem(id: string)
    {
        return this.http.get<CuentaData>(this.url + `/clientes/${id}.json`).pipe(
            map(data=>{
                return new Cuenta(
                    id,
                    data.nombre,
                    data.apellido,
                    data.telefono,
                    data.email,
                    data.direccion,
                    data.distrito,
                    data.ruc,
                    data.puntos,
                    data.ubicacion,
                    new Date(data.creado),
                    new Date(data.modificado)
                );
            })
        );
    }
    deleteItem(id:string)
    {
        return this.http.delete(this.url + `/clientes/${id}.json`).pipe(
            take(1),
            switchMap(() => {
                return this.cuentas
            }),
            take(1),
            tap(items =>{
                this._cuentas.next(items.filter(b => b.id !== id));
            })
        );
    }
}