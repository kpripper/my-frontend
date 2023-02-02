import { BoardType } from '../../../common/types'

interface InitialState {
  boards: BoardType[]
}

interface BoardArray {
  [index: number]: BoardType;
}

const initialState: InitialState = {boards: []}

//const initialState: BoardArray = []

export default function reducer(
  state = initialState,
  action: { type: string; payload: any }
) {
  switch (action.type) {
    case 'UPDATE_BOARDS':
      console.log('UPDATE_BOARDS', action.payload);
      
      return {       
        boards: action.payload,
      }

    default: {
      return { ...state }
    }
  }
}
