export interface Lote {

    id: number;
    nome: string;
    preco: number;
    dataInicio?: Date;
    dataFim?: Date;
    qunatidade: number;
    eventoId: number;
}
