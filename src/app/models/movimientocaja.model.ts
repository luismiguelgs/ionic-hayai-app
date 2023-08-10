export class MovimientoCaja{  
    constructor(
        public id:string,
        public movimiento: string,
        public monto: number,
        public saldo: number,
        public comentario?: string,
        public timestamp?: number
    ){}
}