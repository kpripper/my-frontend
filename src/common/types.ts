export type BoardResponse = {
  title: string
  users: []
  lists: []
}

export type CardType = {
  id?: string
  title?: string
  possition: string
  boardId: string
  listId: string
}

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

