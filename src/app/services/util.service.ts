import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    private _distritos: any[] = [
        {value: 'BREÑA', nombre:'BREÑA'},
        {value: 'BELLAVISTA', nombre:'BELLAVISTA'},
        {value: 'CALLAO', nombre:'CALLAO'},
        {value: 'JESUS MARIA', nombre:'JESUS MARIA'},
        {value: 'LA PERLA', nombre:'LA PERLA'},
        {value: 'LA PUNTA', nombre:'LA PUNTA'},
        {value: 'MAGDALENA', nombre:'MAGDALENA'},
        {value: 'MIRAFLORES', nombre:'MIRAFLORES'},
        {value: 'PUEBLO LIBRE', nombre:'PUEBLO LIBRE'},
        {value: 'SAN MIGUEL', nombre:'SAN MIGUEL'},
        {value: 'SAN ISIDRO', nombre:'SAN ISIDRO'},
        {value: 'SANTIAGO DE SURCO', nombre:'SANTIAGO DE SURCO'}
      ];
    private _familias: any[] = [
        {value: 'TINTORERIA', nombre:'Tintorería'},
        {value: 'LAVANDERIA', nombre:'Lavandería'},
        {value: 'PLANCHADO', nombre:'Planchado'},
        {value: 'OTRO', nombre:'Otro'},
    ];
    private _unidades: any[]=[
        {value: 'UNIDAD', nombre:'Unidad'},
        {value: 'KG', nombre:'Kilogramo'},
        {value: 'M2', nombre:'m2'},
        {value: 'M', nombre:'m'},
    ];
    private _tiempos: any[]=[
        {value: 24, nombre:'24H'},
        {value: 48, nombre:'48H'},
        {value: 72, nombre:'72H'},
        {value: 96, nombre:'96H'},
        {value: 120, nombre:'120H'},
        {value: 288, nombre:'288H'},
        {value: 360, nombre:'360H'},
    ];
    private _estados: any[] = [
        {value: 'P', nombre: 'REGISTRADO'},
        {value: 'E', nombre: 'EN CAMINO'},
        {value: 'C', nombre: 'ENTREGADO'},
    ]
    constructor() {}

    get distritos()
    {
        return this._distritos;
    }
    get familias()
    {
        return this._familias;
    }
    get estados()
    {
        return this._estados;
    }
    get unidades()
    {
        return this._unidades;
    }
    get tiempos()
    {
        return this._tiempos;
    }
    get fechaActual()
    {
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);
        return localISOTime;
    }
    redondear2dec(n: number): number
    {
        return Math.ceil(n*10)/10;
    }
}