import instance from '../../../api/request'
import { Dispatch } from 'redux'
import { BoardsServerResponse } from '../../../common/interfaces/BoardsServerResponse'
import store, { RootState } from '../../store'
import { handleAxiosError } from '../errorHandlers/actions'
import { useSelector } from 'react-redux'

export const getBoards = () => async () => {
  try {
    // const { boards }: BoardsServerResponse = await instance.get('/board')
    // console.log('getBoards', boards)
    const BoardsServerResponse: BoardsServerResponse = await instance.get('/board')
    console.log('getBoards', BoardsServerResponse)
    store.dispatch({ type: 'UPDATE_BOARDS', payload: BoardsServerResponse.boards })
  } catch (e) {
    handleAxiosError(e)
  }
}
