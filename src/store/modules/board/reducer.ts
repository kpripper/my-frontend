import { IBoard } from '../../../common/interfaces/IBoard'
import { createBoard } from '../board/actions'

export interface BoardState {
  title: string
}

const initialState: IBoard = {
  title: '',
  lists: [],
}

export default function reducer(
  state = initialState,
  action: { type: string; payload?: any }
) {
  switch (action.type) {
    case 'UPDATE_BOARD':
      console.log('UPDATE_BOARD', action.payload)

      return {
        ...state,
        title: action.payload.title,
        // users: action.payload.users,
        lists: action.payload.lists,
      }

    case 'CREATE_BOARD':
      console.log('CREATE_BOARD', action.payload)

      //  createBoard(action.payload)

      return {
        ...state,
        title: action.payload,
      }

    case 'MODAL_IS_OPEN':
      console.log('MODAL_IS_OPEN', action.payload)

      return {
        ...state,
        modalIsOpen: action.payload,
      }

    default: {
      //return { ...state, ...action.payload }
      return { ...state }
      //якщо так зробити, то board буде мати тип never
      //return {state}
    }
  }
}
