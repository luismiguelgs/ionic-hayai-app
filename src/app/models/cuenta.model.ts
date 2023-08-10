import { Ubicacion } from './ubicacion.model';

export class Cuenta {
    constructor(
        public id: string,
        public nombre: string,
        public apellido: string,
        public telefono: string,
        public email?: string,
        public direccion?: string,
        public distrito?: string,
        public ruc?: string,
        public puntos?: number,
        public ubicacion?: Ubicacion,
        public creado?: Date,
        public modificado?: Date,
    ) {}
}
export interface CuentaData{
    nombre: string;
    apellido: string;
    telefono: string;
    email?: string;
    direccion?: string;
    distrito?: string;
    ruc?: string;
    puntos?: number;
    ubicacion?: Ubicacion;
    creado?: string;
    modificado?: string;
}