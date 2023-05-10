import { IBoard } from '../../../common/interfaces/IBoard'
import { BoardType, ListType } from '../../../common/types'
import { AnyAction } from '@reduxjs/toolkit';

const initialState: BoardType = {
  id: 0,
  title: '',
  lists: [],  
}

export default function reducer(
  state = initialState,
  action: { type: string; payload: BoardType }
) {
  switch (action.type) {
    case 'UPDATE_BOARD':
      return {
        ...state,
        id: action.payload.id,
        title: action.payload.title,
        lists: action.payload.lists,
      }

    case 'CREATE_BOARD':
      return {
        ...state,
        title: action.payload.title,
      }

    // case 'MODAL_IS_OPEN':
    //   return {
    //     ...state,
    //     modalIsOpen: action.payload,
    //   }

    default: {
      return { ...state }
    }
  }
}
