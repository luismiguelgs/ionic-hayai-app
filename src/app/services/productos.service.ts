import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Producto, ProductoData } from '../models/producto.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductosService
{
    private _productos = new BehaviorSubject<Producto[]>([]);
    private  url = environment.firebaseConfig.databaseURL;

    get productos()
    {
        return this._productos.asObservable();
    }
  
    constructor(private http: HttpClient) { }

    fetchItems()
    {
        return this.http.get<{[key:string]: ProductoData}>(this.url + '/productos.json').pipe(
            take(1),
            map(resData => {
                const items = [];
                for(const key in resData)
                {
                  if(resData.hasOwnProperty(key))
                  {
                    items.push(new Producto(
                      key,
                      resData[key].nombre,
                      resData[key].precio,
                      resData[key].tipo,
                      resData[key].unidad,
                      resData[key].tiempo,
                      resData[key].imagenUrl,
                      new Date(resData[key].creado),
                      new Date(resData[key].modificado),
                    ));
                  }
                }
                return items;
            }),
            tap(items => {
                this._productos.next(items);
            })
        );
    }
    addItem(item: Producto)
    {
        let id: string;
        let nuevoItem: Producto;
        nuevoItem = new Producto(
            null,
            item.nombre,
            item.precio,
            item.tipo,
            item.unidad,
            item.tiempo,
            item.imagenUrl,
            new Date(),
            new Date()
        );
        return this.http.post<{id:string}>(this.url + '/productos.json', {...nuevoItem}).pipe(
            take(1),
            switchMap(resData =>{
                id = resData.id;
                return this.productos;
            }),
            take(1),
            tap(items => {
                nuevoItem.id = id;
                this._productos.next(items.concat(nuevoItem));
            })
        );
    }
    updateItem(item: Producto)
    {
        let updatedItems: Producto[];
        return this.productos.pipe(
            take(1),
            switchMap(items => {
                const updatedItemIndex = items.findIndex(_item => _item.id === item.id);
                updatedItems = [...items];
                const oldItem = updatedItems[updatedItemIndex];
                updatedItems[updatedItemIndex] = new Producto(
                    item.id,
                    item.nombre,
                    item.precio,
                    item.tipo,
                    item.unidad,
                    item.tiempo,
                    item.imagenUrl,
                    item.creado,
                    new Date()
                );
                return this.http.put(this.url + `/productos/${item.id}.json`, {...updatedItems[updatedItemIndex], id:null});
            }),
            tap(() => {
                this._productos.next(updatedItems);
            })
        );
    }
    getItem(id: string)
    {
        return this.http.get<ProductoData>(this.url + `/productos/${id}.json`).pipe(
            map(data=>{
                return new Producto(
                    id,
                    data.nombre,
                    data.precio,
                    data.tipo,
                    data.unidad,
                    data.tiempo,
                    data.imagenUrl,
                    new Date(data.creado),
                    new Date(data.modificado)
                );
            })
        );
    }
    deleteItem(id:string)
    {
        return this.http.delete(this.url + `/productos/${id}.json`).pipe(
            take(1),
            switchMap(() => {
                return this.productos
            }),
            take(1),
            tap(items =>{
                this._productos.next(items.filter(b => b.id !== id));
            })
        );
    }
}