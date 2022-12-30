import { combineReducers } from 'redux'
import boardReducer from './modules/board/reducer'
import boardsReducer from './modules/boards/reducer'
import userReducer from './modules/user/reducer'
import loadingReducer from './modules/loading/reducer'
import errorReducer from './modules/handlers/reducer'

export default combineReducers({
  boards: boardsReducer,
  board: boardReducer,
  error: errorReducer,
  loading: loadingReducer,
  user: userReducer,
})
