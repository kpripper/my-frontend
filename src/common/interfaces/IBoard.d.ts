// import {  ICard } from './ ICard';
import { ISimpleCard } from './ ISimpleCard'

export interface IBoard {
  title: string
  lists: Array<{ id: number; title: string; cards: ISimpleCard[] }>
}
