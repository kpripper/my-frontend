import rootReducer from './reducer'
import { configureStore } from '@reduxjs/toolkit'
import { ISimpleCard } from '../common/interfaces/ISimpleCard'
import { BoardType } from '../common/types'

const store = configureStore({
  reducer: rootReducer,
})

// export type RootState = ReturnType<typeof store.getState>

export type RootState = {
  // boards: Board[]

  boards: BoardType[]

  board:
    | {
        title: any
        lists: any
      }
    | {
        modalIsOpen: any
        title: string
        lists: {
          id: number
          title: string
          cards: ISimpleCard[]
        }[]
      }
  error: {
    isError: boolean
    errorText: string
  }
  loading: {
    loading: boolean
  }
  user: {}
}

export default store
