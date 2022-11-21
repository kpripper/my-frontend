import config from '../../../common/constants/api'
import { Dispatch } from 'redux'
import { BoardsServerResponse } from '../../../common/interfaces/BoardsServerResponse'
import instance from '../../../api/request'

export const getBoard = (id: number) => async (dispatch: Dispatch) => {
  console.log('getBoard')

  try {
    const boardInGet = await instance.get('/board/' + id)
    console.log('await get board', boardInGet)
    dispatch({ type: 'UPDATE_BOARD', payload: boardInGet })
  } catch (e) {
    console.log(e, 'E UPDATE_BOARD')
    dispatch({ type: 'ERROR_ACTION_TYPE' })
  }
}
