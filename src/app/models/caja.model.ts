export class Caja{  
    constructor(
        public id:string,
        public saldo: number,
        public abierto: boolean,
        public fechaAbierta: Date,
        public fechaCerrada?: Date,
    ){}
}