import instance from '../../../api/request'
import config from '../../../common/constants/api'
import { AnyAction, Dispatch } from 'redux'
import { BoardsServerResponse } from '../../../common/interfaces/BoardsServerResponse'
import api from '../../../api/request'
import { ThunkAction } from 'redux-thunk'
import { AppState } from '../../store'
import type { AppDispatch } from '../../store'
import { useDispatch } from 'react-redux'

//  ThunkAction <return, state, type of extraArguments, action type defined in application> extends Action

type ThunkActionType = ThunkAction<Promise<void>, AppState, unknown, AnyAction>

//це thunk, тому що виконує асинхронний діспатч

export const getBoards = () => async (dispatch: Dispatch) => {
  console.log('getBoards')
  try {
    //NOTE Katya               const boardsInGet  = await instance.get<{boards:[]}>("/board");

    //так тс свариться, але бачить поле boardsInGet.boards
    //  const {boardsInGet}  = await instance.get("/board");

    //так тс НЕ свариться, але НЕ бачить поле boardsInGet.boards
    //  const boardsInGet  = await instance.get("/board");

    //так працює з payload: boardsInGet.boards
    //const boardsInGet  = await instance.get("/board")  as { boards: IBoardArray };

    //NOTE https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions
    //  console.log("instance", instance)

    const boardsInGet: BoardsServerResponse = await instance.get('/board')

    console.log('await instance.get', boardsInGet)
    dispatch({ type: 'UPDATE_BOARDS', payload: boardsInGet.boards })
  } catch (e) {
    console.log(e)
    dispatch({ type: 'ERROR_ACTION_TYPE' })
  }
}

//export const createBoard = (titleName: string): ThunkActionType => async (dispatch): Promise<void> => {
//без ThunkActionType не рендерить дошки
export const createBoard =
  (boardTitle: string) =>
  // {

  //   console.log("boardTitle", boardTitle);
  //   console.log("config.boards", config.boards);
  //  return

  async (dispatch: Dispatch) => {
    console.log('dispatch  createBoard', dispatch)

    try {
      console.log('try createBoard')
      const awResp: { result: string; id: number } = await api.post(
        config.boards,
        { title: boardTitle }
      )
      if (awResp.result === 'Created') {
        console.log('Created')
        dispatch<any>(getBoards())
      }
    } catch (e) {
      console.log('e createBoard', e)
    }
  }

// }

// a hook that can be reused to resolve types
const useAppDispatch: () => AppDispatch = useDispatch


export const deleteBoard = (boardId: string) =>


  //alert("deleteBoard ");

  async (dispatch: Dispatch) => {
    console.log('dispatch  deleteBoard', dispatch)
    
   

    try {
      const resDelete = await api.delete(config.boards + '/' + boardId)
      console.log(resDelete)
      console.log('deleteBoard ', config.boards+ '/' + boardId)
      dispatch<any>(getBoards())
    } catch (e) {
      alert(e)
      console.log('e  deleteBoard ', e)
    }
  }
//}
