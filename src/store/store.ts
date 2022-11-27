import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducer';
import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

export interface AppState {
    boards: [];
    modal: boolean;
  }

// const store = createStore(rootReducer, applyMiddleware(thunk));

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
})


export type AppDispatch = typeof store.dispatch // you can use this Dispatch type in your thunks
export const useAppDispatch = () => useDispatch<AppDispatch>() // Export a hook that can be reused to resolve types

//https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-state-type
//for useSelector((state: RootState) => state.boards)
export type RootState = ReturnType<typeof store.getState>

export default store;

