import rootReducer from './reducer'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>

export default store
