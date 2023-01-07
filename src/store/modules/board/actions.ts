import config from '../../../common/constants/api'
import { Dispatch } from 'redux'
import instance from '../../../api/request'
import { getBoards } from '../boards/actions'
import store from '../../store'
import { handleAxiosError } from '../errorHandlers/actions'

export const getBoard = (id: string) => async (dispatch: Dispatch) => {
  try {
    const boardInGet = await instance.get('/board/' + id)
    dispatch({ type: 'UPDATE_BOARD', payload: boardInGet })
    return boardInGet
  } catch (e) {
    handleAxiosError(e)
  }
}

export const editBoardTitle =
  (boardTitleNew: string, id: string) => async (dispatch: Dispatch) => {
    try {
      const awResp: { result: string; id: number } = await instance.put(
        config.boards + "/" + id,
        { title: boardTitleNew}
      )
      if (awResp.result === 'Updated') {
        store.dispatch(getBoards())
        store.dispatch(getBoard(id))
      }
    } catch (e) {
      handleAxiosError(e)
    }
  }

export const editListTitle =
  (listName: string, boardId: string, position: string) =>
  async (dispatch: Dispatch) => {
    try {
      const editListTitleResp: { result: string; id: number } =
        await instance.put(config.boards + '/' + boardId + '/list', {
          title: listName,
          position: position,
        })  
      if (editListTitleResp.result === 'Updated') {
        store.dispatch(getBoard(boardId))
      }
    } catch (e) {
      handleAxiosError(e) 
    }
  }

export const createBoard =
  (boardTitle: string) => async (dispatch: Dispatch) => {
    try {
      const awResp: { result: string; id: number } = await instance.post(
        config.boards,
        { title: boardTitle }
      )
      if (awResp.result === 'Created') {
        store.dispatch(getBoards())
      }
    } catch (e) {
      handleAxiosError(e)
    }
  }

export const deleteBoard = (boardId: string) => async (dispatch: Dispatch) => {
  try {
    await instance.delete(config.boards + '/' + boardId)
    store.dispatch(getBoards())
  } catch (e) {
    handleAxiosError(e)
  }
}

export const createList =
  (listTitle: string, boardId: string) => async (dispatch: Dispatch) => {
    try {
      const currentBoard: { lists: [] } = await instance.get(
        '/board/' + boardId
      )
      const rescreateList = await instance.post(
        config.boards + '/' + boardId + '/list',
        { title: listTitle, position: currentBoard.lists.length }
      )
      store.dispatch(getBoard(boardId))
    } catch (e) {
      handleAxiosError(e)
    }
  }

export const addCard =
  (cardTitle: string, boardId: string, listID: string, position: string) =>
  async (dispatch: Dispatch) => {
    try {
      const addCardResp: { result: string; id: number } = await instance.post(
        config.boards + '/' + boardId + '/card',
        { title: cardTitle, list_id: listID, position: position }
      )

      if (addCardResp.result === 'Created') {
        store.dispatch(getBoard(boardId))
      }
    } catch (e) {
      handleAxiosError(e)
    }
  }

export const delCard =
  (boardId: string, cardID: string) => async (dispatch: Dispatch) => {
    try {
      const delCardResp: { result: string } = await instance.delete(
        config.boards + '/' + boardId + '/card/' + cardID
      )
      if (delCardResp.result === 'Deleted') {       
        store.dispatch(getBoard(boardId))
      }
    } catch (e) {
      handleAxiosError(e)
    }
  }

// add to config for error test const errorTest = 'error string'

export const edCard =
  (boardId: string, listID: string, cardID: string, cardTitle: string) =>
  async (dispatch: Dispatch) => {
    console.log( config.boards + '/' + boardId + '/card/' + cardID,
    { title: cardTitle, list_id: listID });   
    
    try {
      const edCardResp: { result: string } = await instance.put(
        config.boards + '/' + boardId + '/card/' + cardID,
        { title: cardTitle, list_id: listID }
      )
      if (edCardResp.result === 'Updated') {
        store.dispatch(getBoard(boardId))
      }
    } catch (e) {
      handleAxiosError(e)
    }
  }

export const deleteList =
  (boardId: string, listId: string) => async (dispatch: Dispatch) => {
    try {
      const resDelete = await instance.delete(
        config.boards + '/' + boardId + '/list/' + listId
      )
      store.dispatch(getBoard(boardId))
      store.dispatch(getBoards())
    } catch (e) {
      handleAxiosError(e)
    }
  }
