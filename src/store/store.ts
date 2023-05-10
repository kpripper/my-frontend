import rootReducer from './reducer'
import { configureStore } from '@reduxjs/toolkit'
import { ISimpleCard } from '../common/interfaces/ISimpleCard'
import { BoardType } from '../common/types'

const store = configureStore({
  reducer: rootReducer,
})

 export type RootState = ReturnType<typeof store.getState>

// export type RootState = {
//   boards: BoardType[]
//   board: BoardType
//   error: {
//     isError: boolean
//     errorText: string
//   }
//   loading: {
//     loading: boolean
//   }
//   user: {}
// }

export default store
