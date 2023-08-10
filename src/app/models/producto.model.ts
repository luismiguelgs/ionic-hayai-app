export class Producto{
    constructor(
        public id: string,
        public nombre: string,
        public precio: number,
        public tipo: string,
        public unidad: string,
        public tiempo: number,
        public imagenUrl?: string,
        public creado?: Date,
        public modificado?: Date,
    ){}
}
export interface ProductoData{
    nombre: string,
    precio: number,
    tipo: string,
    unidad: string,
    tiempo: number,
    imagenUrl?: string,
    creado?: Date,
    modificado?: Date,
}