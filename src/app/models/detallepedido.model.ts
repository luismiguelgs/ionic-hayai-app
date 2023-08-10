export class DetallePedido{  
    constructor(
        public id:string,
        public idProducto:string,
        public nombreProducto: string,
        public cantidad: number,
        public precio: number,
        public monto: string,
    ){}
}