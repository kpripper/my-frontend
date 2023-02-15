import { AlertTitleClassKey } from '@mui/material'
import { AxiosResponse } from 'axios'
import React, { DetailedHTMLProps, HTMLAttributes } from 'react'

export type BoardType = {
  id: string
  title: string
}

export type BoardResponse = {
  title: string
  users: []
  lists: []
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

// export type BoardArray = {
//   [index: number]: BoardType;
// }

export type BoardArray = BoardType[]

export type CardType = {
  id?: string
  title?: string
  position: string
  boardId: string
  listId: string
  index: number
  // draggable?: boolean
  setSlotPosition?: (e: React.DragEvent<HTMLDivElement>, index: number) => void
  handleDragStart?: (e: React.DragEvent<HTMLDivElement>, index: number) => void
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export type ListType = {
  id: string
  title: string
  position: string
  cards: CardType[]
}

export type propsHomeType = {
  getBoards: () => Promise<void>
  boards: { id: number; title: string }[]
}

export type stateType = {
  boards: []
}
