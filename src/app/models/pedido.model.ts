export class Pedido{  
    id: string;
    idCliente: string;
    nombreCliente: string;
    telefonoCliente: string;
    fechaRecojo: Date
    fechaEntrega: Date;
    total: number;
    estado: string;
    proceso: string;
    pago: number;
    metodoPago: string;
    creado: Date;
    modificado: Date;

    constructor(
        id:string,
        idCliente:string,
        nombreCliente: string,
        fechaEntrega: string,
        total: number,
        estado: string,
        creado: Date,
        modificado: Date
    ){}
}