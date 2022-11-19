import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducer';

export interface AppState {
    boards: [];
    modal: boolean;
  }

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

