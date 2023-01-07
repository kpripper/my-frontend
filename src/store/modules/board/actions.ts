import React from 'react'
import config from '../../../common/constants/api'
import { Dispatch } from 'redux'
import { BoardsServerResponse } from '../../../common/interfaces/BoardsServerResponse'
import instance from '../../../api/request'
import { useDispatch, useSelector } from 'react-redux'
import api from '../../../common/constants/api'
import { getBoards } from '../boards/actions'
import store from '../../store'
import { ProgressBar } from '../../../pages/ProgressBar/ProgressBar'
import { clearError } from '../errorHandlers/actions'

export const getBoard = (id: string) => async (dispatch: Dispatch) => {
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
      console.log(boardTitleNew, 'e editBoardTitle', e)
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
        // store.dispatch(getBoards())
        store.dispatch(getBoard(boardId))
      }
    } catch (e) {
            console.log('e editListTitle', e)         
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
      console.log('e createBoard', e)
    }
  }

export const deleteBoard = (boardId: string) => async (dispatch: Dispatch) => {
  try {
    await instance.delete(config.boards + '/' + boardId)
    store.dispatch(getBoards())
  } catch (e) {
    console.log('e  deleteBoard ', e)
  }
}

export const createList =
  (listTitle: string, boardId: string) => async (dispatch: Dispatch) => {
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
      console.log('e addCard', e)
    }
  }

export const delCard =
  (boardId: string, cardID: string) => async (dispatch: Dispatch) => {
    try {
      const delCardResp: { result: string } = await instance.delete(
        config.boards + '/' + boardId + '/card/' + cardID
      )
      if (delCardResp.result === 'Deleted') {
        console.log("delCard", delCardResp.result);
        
        store.dispatch(getBoard(boardId))
      }
    } catch (e) {
      console.log('e delCard', e)
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
      console.log("edCard cardTitle ", cardTitle);
      console.log('e edCard', e)
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
      console.log('e  deleteList ', e)
    }
  }
