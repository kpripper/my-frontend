import { IBoard } from '../../../common/interfaces/IBoard'

const initialState: IBoard = {
  title: '',
  lists: [],
}

export default function reducer(
  state = initialState,
  action: { type: string; payload: any }
) {
  switch (action.type) {
    case 'UPDATE_BOARD':
      return {
        ...state,
        title: action.payload.title,
        lists: action.payload.lists,
      }

    case 'CREATE_BOARD':
      return {
        ...state,
        title: action.payload,
      }

    case 'MODAL_IS_OPEN':
      return {
        ...state,
        modalIsOpen: action.payload,
      }

    default: {
      return { ...state }
    }
  }
}
