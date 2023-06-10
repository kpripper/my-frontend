import instance from '../../../api/request'
import { BoardsServerResponse } from '../../../common/interfaces/BoardsServerResponse'
import store from '../../store'
import { handleAxiosError } from '../errorHandlers/actions'

export const getBoards = () => async () => {
  try {
    const BoardsServerResponse: BoardsServerResponse = await instance.get(
      '/board',
    )
    store.dispatch({
      type: 'UPDATE_BOARDS',
      payload: BoardsServerResponse.boards,
    })
  } catch (e) {
    handleAxiosError(e, 'getBoards')
  }
}
