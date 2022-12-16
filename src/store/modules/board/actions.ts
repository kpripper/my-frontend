import config from '../../../common/constants/api'
import { Dispatch } from 'redux'
import { BoardsServerResponse } from '../../../common/interfaces/BoardsServerResponse'
import instance from '../../../api/request'
import { useDispatch, useSelector } from 'react-redux'
import api from '../../../common/constants/api'
import { getBoards } from '../boards/actions'
import store from '../../store'

export const getBoard = (id: number) => async (dispatch: Dispatch) => {
  console.log('getBoard')

  try {
    const boardInGet = await instance.get('/board/' + id)
    console.log('await get board', boardInGet)
    console.log('state before disp', store.getState())
    dispatch({ type: 'UPDATE_BOARD', payload: boardInGet })
    console.log('state after disp', store.getState())
    return boardInGet
  } catch (e) {
    console.log(e, 'E UPDATE_BOARD')
    dispatch({ type: 'ERROR_ACTION_TYPE' })
  }
}

export const editBoardTitle =
  (boardTitleNew: string, id: number) => async (dispatch: Dispatch) => {
    console.log('dispatch  editBoardTitle', boardTitleNew)

    try {
      console.log('try editBoardTitle')
      const awResp: { result: string; id: number } = await instance.put(
        config.boards + '/' + id,
        { title: boardTitleNew }
      )
      if (awResp.result === 'Updated') {
        console.log('board Updated')

        dispatch<any>(getBoards())
        dispatch<any>(getBoard(id))
      }
    } catch (e) {
      console.log(boardTitleNew, 'e editBoardTitle', e)
    }
  }

//export const createBoard = (titleName: string): ThunkActionType => async (dispatch): Promise<void> => {
//без ThunkActionType не рендерить дошки
export const createBoard =
  (boardTitle: string) => async (dispatch: Dispatch) => {
    console.log('dispatch  createBoard', dispatch)

    try {
      console.log('try createBoard')
      const awResp: { result: string; id: number } = await instance.post(
        config.boards,
        { title: boardTitle }
      )
      console.log('awResp', awResp)
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
//const useAppDispatch: () => AppDispatch = useDispatch

export const deleteBoard = (boardId: string) => async (dispatch: Dispatch) => {
  // console.log('dispatch  deleteBoard', dispatch)
  try {
    const resDelete = await instance.delete(config.boards + '/' + boardId)
    //  console.log(resDelete)
    // console.log('deleteBoard ', config.boards+ '/' + boardId)
    dispatch<any>(getBoards())
  } catch (e) {
    console.log('e  deleteBoard ', e)
  }
}

export const createList =
  (listTitle: string, boardId: number) => async (dispatch: Dispatch) => {
    console.log(
      'createList',
      config.boards + '/' + boardId + '/ listTitle' + listTitle
    )
    try {
      const currentBoard: { lists: [] } = await instance.get(
        '/board/' + boardId
      )
      //console.log(currentBoard, "currentBoard")
      const rescreateList = await instance.post(
        config.boards + '/' + boardId + '/list',
        { title: listTitle, position: currentBoard.lists.length }
      )
      console.log(rescreateList)
      console.log(
        'rescreateList ',
        config.boards + '/' + boardId + '/' + listTitle
      )
      dispatch<any>(getBoard(boardId))
    } catch (e) {
      //  alert(e)
      console.log('e createList ', e)
    }
  }

export const deleteList =
  (boardId: string, listId: number) => async (dispatch: Dispatch) => {
    console.log(' deleteList ')

    try {
      const resDelete = await instance.delete(
        config.boards + '/' + boardId + '/list/' + listId
      )
      console.log('resDelete  deleteList ', resDelete)
      dispatch<any>(getBoard(+boardId))
      dispatch<any>(getBoards())
    } catch (e) {
      console.log('e  deleteList ', e)
    }
  }
