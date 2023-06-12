import { BoardType } from '../../../common/types'

const initialState: BoardType[] = []
export default function reducer(
  state = initialState,
  action: { type: string; payload: BoardType[] },
) {
  switch (action.type) {
    case 'UPDATE_BOARDS':
      console.log('UPDATE_BOARDS', action.payload)
      console.log('UPDATE_BOARDS tok',  localStorage.getItem('token'))
      return action.payload

    default: {
      return state
    }
  }
}
