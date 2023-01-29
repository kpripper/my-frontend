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
  (boardTitleNew: string, id: string) => async () => {
    try {
      await instance.put(config.boards + '/' + id, { title: boardTitleNew })
      store.dispatch(getBoards())
      store.dispatch(getBoard(id))
    } catch (e) {
      handleAxiosError(e)
    }
  }

export const editListTitle =
  (listName: string, boardId: string, position: string, listId: string) =>
  async () => {
    try {
      await instance.put(config.boards + '/' + boardId + '/list/' + listId, {
        title: listName,
        position: position,
      })
      store.dispatch(getBoard(boardId))
    } catch (e) {
      handleAxiosError(e)
    }
  }

export const createBoard =
  (boardTitle: string) => async () => {
    console.log(instance);
    
    try {
      await instance.post(config.boards, { title: boardTitle })
      store.dispatch(getBoards())
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
      const currentBoard: { lists: [] } = await instance.get('/board/' + boardId)
      await instance.post(config.boards + '/' + boardId + '/list', {
        title: listTitle,
        position: currentBoard.lists.length,
      })
     store.dispatch(getBoard(boardId))
    } catch (e) {
      handleAxiosError(e)
    }
  }

export const addCard =
  (cardTitle: string, boardId: string, listID: string, position: string) =>
  async (dispatch: Dispatch) => {
    try {
      await instance.post(config.boards + '/' + boardId + '/card', {
        title: cardTitle,
        list_id: listID,
        position: position,
      })

      store.dispatch(getBoard(boardId))
    } catch (e) {
      handleAxiosError(e)
    }
  }

export const delCard =
  (boardId: string, cardID: string) => async (dispatch: Dispatch) => {
    try {
      await instance.delete(config.boards + '/' + boardId + '/card/' + cardID)

      store.dispatch(getBoard(boardId))
    } catch (e) {
      handleAxiosError(e)
    }
  }

// add to config for error test const errorTest = 'error string'

export const edCard =
  (boardId: string, listID: string, cardID: string, cardTitle: string) =>
  async (dispatch: Dispatch) => {
    console.log(config.boards + '/' + boardId + '/card/' + cardID, {
      title: cardTitle,
      list_id: listID,
    })

    try {
      await instance.put(config.boards + '/' + boardId + '/card/' + cardID, {
        title: cardTitle,
        list_id: listID,
      })

      store.dispatch(getBoard(boardId))
    } catch (e) {
      handleAxiosError(e)
    }
  }

export const deleteList =
  (boardId: string, listId: string) => async (dispatch: Dispatch) => {
    try {
      await instance.delete(config.boards + '/' + boardId + '/list/' + listId)
      store.dispatch(getBoard(boardId))
      store.dispatch(getBoards())
    } catch (e) {
      handleAxiosError(e)
    }
  }
