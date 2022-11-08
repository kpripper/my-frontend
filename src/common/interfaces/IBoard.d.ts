export interface IBoard {  
    title: string,
    lists: Array<{ id: number; title: string; cards: ICard[] }>;   
}