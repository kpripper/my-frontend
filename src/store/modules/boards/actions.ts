import instance from '../../../api/request'
import { Dispatch } from 'redux'
import { BoardsServerResponse } from '../../../common/interfaces/BoardsServerResponse'
import store from '../../store'
import { handleAxiosError } from '../errorHandlers/actions'

export const getBoards = () => async (dispatch: Dispatch) => {
  try {
    const boardsInGet: BoardsServerResponse = await instance.get('/board')
    store.dispatch({ type: 'UPDATE_BOARDS', payload: boardsInGet.boards })
  } catch (e) {
    handleAxiosError(e)
  }
}


