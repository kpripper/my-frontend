import config from '../../../common/constants/api'
import { Dispatch } from 'redux'
import instance from '../../../api/request'
import { getBoards } from '../boards/actions'
import store from '../../store'
import { handleAxiosError } from '../errorHandlers/actions'
import {
  BoardType,
  CardType,
  changeCardGroup,
  IGroupCard,
} from '../../../common/types'

export const getBoard = (id: string) => async (dispatch: Dispatch) => {
  try {
    const board = await instance.get<BoardType>('/board/' + id)
    console.log('getBoard board', board)
    //@ts-ignore
    //BUG з включеним консоль логом на дошці без списків показуються списки попередньо відкритої дошки
    // console.log('id type', typeof board.lists[0].id)
    dispatch({ type: 'UPDATE_BOARD', payload: board })
    return board
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

export const createBoard = (boardTitle: string) => async () => {
  console.log(instance)

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
      const currentBoard: { lists: [] } = await instance.get(
        '/board/' + boardId
      )
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
  (cardTitle: string, boardId: string, listID: string, cardsLength: number) =>
  async (dispatch: Dispatch) => {
    console.log(`Try Create ${cardTitle} in position ${cardsLength}`)
    try {
      let res = await instance.post(config.boards + '/' + boardId + '/card', {
        title: cardTitle,
        list_id: listID,
        position: cardsLength,
      })

      console.log(`Create ${cardTitle} in ${listID} list`, res)

      store.dispatch(getBoard(boardId))
    } catch (e) {
      handleAxiosError(e)
    }
  }

export const delCard =
  (boardId: string, cardID: string) => async (dispatch: Dispatch) => {
    console.log(`Try delete ${cardID}`)
    try {
      let res = await instance.delete(
        config.boards + '/' + boardId + '/card/' + cardID
      )

      console.log(`Card ${cardID} deleted`, res)

      store.dispatch(getBoard(boardId))
    } catch (e) {
      handleAxiosError(e)
    }
  }

// add to config for error test const errorTest = 'error string'

export const edCard =
  (boardId: string, listID: string, cardID: string, cardTitle: string) =>
  async (dispatch: Dispatch) => {
   // console.log('edcard props', boardId, listID, typeof cardID, cardTitle)
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

export const updateCardPosition = (cardId: string, newPosition: number) => ({
  type: 'UPDATE_CARD_POSITION',
  payload: { cardId, newPosition },
})

export const editCards =
  (
    boardId: string,
    initialListId: string,
    initialCardsString: string,
    draggedOffPosition: string,
    list_id: string,
    cardsToInsert: CardType[],
    addCardInPosition: number,
    placedCardId: string
  ) =>
  async (dispatch: Dispatch) => {
    console.log(
      'editcards. placed:',
      placedCardId,
      ' in target pos:',
      addCardInPosition,
      cardsToInsert
      //  'initialCards', initialCards
    )

    let newCard: changeCardGroup = {
      id: placedCardId,
      position: addCardInPosition,
      list_id: list_id,
    }

    let cardsAfterInsert: changeCardGroup[] = []
    let newCardsDel: changeCardGroup[] = []

    console.log(
      'initialCards',
      JSON.parse(initialCardsString),
      'draggedOffPosition',
      draggedOffPosition
    )

    let cardsToDelete: CardType[] = JSON.parse(initialCardsString)

    cardsToDelete.splice(+draggedOffPosition - 1, 1)

    console.log('cardsToDelete aft splice', cardsToDelete)

    if (cardsToInsert.length === 0) {
      cardsAfterInsert[0] = newCard
    } else {
      cardsToInsert.forEach((card, index) => {
        delete card.users
        delete card.created_at
        delete card.title
        if (
          +card.position >= addCardInPosition &&
          +card.id! !== +placedCardId
        ) {
          console.log(
            'card.id',
            typeof card.id,
            typeof placedCardId,
            ' placedCardId'
          )
          console.log('card.id !== placedCardId', +card.id! !== +placedCardId)
          console.log('card pos+', card)
          cardsAfterInsert[index + 1] = {
            id: card.id!,
            position: +card.position + 1,
            list_id: list_id,
          }
          console.log(
            `cardsAfterInsert JSON ih foreach >addpos`,
            JSON.parse(JSON.stringify(cardsAfterInsert))
          )
        } else if (+card.id! !== +placedCardId) {
          console.log('card pos =', card)
          cardsAfterInsert[index] = {
            id: card.id!,
            position: +card.position,
            list_id: list_id,
          }
          console.log(
            `cardsAfterInsert JSON ih foreach`,
            JSON.parse(JSON.stringify(cardsAfterInsert))
          )
        }
        cardsAfterInsert[addCardInPosition - 1] = newCard
      })
    }

    console.log(
      `cardsAfterInsert JSON`,
      JSON.parse(JSON.stringify(cardsAfterInsert))
    )

    const insertedCardsToPut = cardsAfterInsert
      .filter((value) => value !== null)
      .map((item: any, index: number) => ({ ...item, position: index + 1 }))

    console.log('newArr', insertedCardsToPut)

    try {
      let resPut = await instance.put(
        config.boards + '/' + boardId + '/card',
        insertedCardsToPut
      )

      console.log(`editCards resPut`, resPut)

      if (+initialListId !== +list_id) {
        console.log('initialListId !== list_id', initialListId, list_id)
        const updatedCardsMinus = cardsToDelete.map((card, index) => {
          delete card.users
          delete card.created_at
          delete card.title
          card.position = String(index + 2)
          return {
            ...card,
            position: parseInt(card.position),
            list_id: initialListId,
          }
        })

        console.log('updatedCardsMinus bef splice', updatedCardsMinus)

        for (let i = 0; i < updatedCardsMinus.length; i++) {
          updatedCardsMinus[i].position = i + 1
        }

        console.log('updatedCardsMinus corrected position', updatedCardsMinus)

        console.log('updatedCardsMinus disp', updatedCardsMinus)

        let resDel = await instance.put(
          config.boards + '/' + boardId + '/card',
          updatedCardsMinus
        )

        console.log(`editCards resDel`, resDel)
      }

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
