import { BoardType } from '../../../common/types'

const initialState: BoardType[] = []

export default function reducer(
  state = initialState,
  action: { type: string; payload: any }
) {
  switch (action.type) {
    case 'UPDATE_BOARDS':
      return {
        ...state,
        boards: action.payload,
      }

    default: {
      return { ...state }
    }
  }
}
