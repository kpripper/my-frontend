import instance from '../../../api/request'
import { BoardsServerResponse } from '../../../common/interfaces/BoardsServerResponse'
import store from '../../store'
import { handleAxiosError } from '../errorHandlers/actions'

export const getBoards = () => async () => {
  try {
    console.log('BoardsServerResponse token', localStorage.getItem('token'))
    console.log('instance.defaults.headers', instance.defaults.headers.Authorization);
    //console.log('BoardsServerResponse instance headers', instance.headers)  //undefined
    const BoardsServerResponse: BoardsServerResponse = await instance.get(
      '/board',
    )
    console.log('BoardsServerResponse', BoardsServerResponse)
    store.dispatch({
      type: 'UPDATE_BOARDS',
      payload: BoardsServerResponse.boards,
    })
  } catch (e) {
    handleAxiosError(e, 'getBoards')
  }
}
