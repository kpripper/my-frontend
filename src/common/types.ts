import { AxiosResponse } from 'axios'
import React, { DetailedHTMLProps, HTMLAttributes } from 'react'

export type BoardType = {
  id: number
  title: string
  lists: ListType[]
}

export type BoardResponse = {
  title: string
  lists: ListType[]
}

export type BoardProps = {
  getBoard: (id: string) => Promise<AxiosResponse<any, any> | undefined>
  boardTitle: string
  boardLists: []
}

export type Boards = BoardType[]

export type BoardState = {
  title: string
}

export type BoardArray = BoardType[]

export type CardRequest = {
  title: string
  list_id: number
  description?: string
}

export type CardType = {
  id?: string
  title?: string
  position: string
  boardid: string
  listId: number
  index: number
  description?: string
  users?: []
  created_at?: number
  setSlotPosition?: (e: React.DragEvent<HTMLDivElement>, index: number) => void
  handleDragStart?: (e: React.DragEvent<HTMLDivElement>, index: number) => void
  handleDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export type changeCardGroup = {
  id: string
  position: number
  list_id: number
}

export interface IGroupCard {
  id: string
  position: number
  list_id: string
}

export type ListType = {
  id: number
  title: string
  position: string
  cards: CardType[]
}

export type propsHomeType = {
  getBoards: () => Promise<void>
  boards: { id: number; title: string }[]
}

export type SlotProps = {
  card: CardType
  nextCard: CardType
  setShowSlot: (arg0: boolean) => void
  setShowFirstSlot: (arg0: boolean) => void
  setSlotIndex: (arg0: number) => void
  slotIndex: number
  boardId: string
  listId: number
  cards: CardType[]
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export type stateType = {
  boards: []
}
