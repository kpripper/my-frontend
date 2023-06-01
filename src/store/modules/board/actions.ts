import config from '../../../common/constants/api'
import { Dispatch } from 'redux'
import instance from '../../../api/request'
import { getBoards } from '../boards/actions'
import store from '../../store'
import { handleAxiosError } from '../errorHandlers/actions'
import {
  BoardType,
  CardRequest,
  CardType,
  changeCardGroup,
} from '../../../common/types'

export const getBoard = (id: string) => async (dispatch: Dispatch) => {
  try {
    const board = await instance.get('/board/' + id)

    //BUG з включеним консоль логом на дошці без списків показуються списки попередньо відкритої дошки
    // console.log('id type', typeof board.lists[0].id)

    dispatch({ type: 'UPDATE_BOARD', payload: { ...board, id: id } })

    return board
  } catch (e) {
    handleAxiosError(e, 'getBoard')
  }
}

export const editBoardTitle =
  (boardTitleNew: string, id: string) => async () => {
    try {
      await instance.put(config.boards + '/' + id, { title: boardTitleNew })
      store.dispatch(getBoards())
      store.dispatch(getBoard(id))
    } catch (e) {
      handleAxiosError(e, 'editBoardTitle')
    }
  }

export const editListTitle =
  (listName: string, boardId: string, position: string, listId: number) =>
  async () => {
    try {
      await instance.put(config.boards + '/' + boardId + '/list/' + listId, {
        title: listName,
        position: position,
      })
      store.dispatch(getBoard(boardId))
    } catch (e) {
      handleAxiosError(e, 'editListTitle')
    }
  }

export const createBoard = (boardTitle: string) => async () => {
  console.log(instance)

  try {
    await instance.post(config.boards, { title: boardTitle })
    store.dispatch(getBoards())
  } catch (e) {
    handleAxiosError(e, 'createBoard')
  }
}

export const deleteBoard = (boardId: string) => async (dispatch: Dispatch) => {
  try {
    await instance.delete(config.boards + '/' + boardId)
    store.dispatch(getBoards())
  } catch (e) {
    handleAxiosError(e, 'deleteBoard')
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
      handleAxiosError(e, 'createList')
    }
  }

export const addCard =
  (
    cardTitle: string,
    boardId: string,
    listID: number,
    cardsLength: number,
    boardToGetBoard: string,
    cardDescription?: string
  ) =>
  async () => {
    try {
      let res: { result: string; id: number } = await instance.post(
        config.boards + '/' + boardId + '/card',
        {
          title: cardTitle,
          list_id: listID,
          position: cardsLength,
          description: cardDescription,
        }
      )

      //якщо додаємо картку на іншу дошку, то беремо поточну, щоб не відобразилася таргет-дошка
      boardId === boardToGetBoard
        ? store.dispatch(getBoard(boardToGetBoard))
        : store.dispatch(getBoard(boardId))

      return res.id
    } catch (e) {
      handleAxiosError(e, 'addCard')
    }
    const board = await instance.get('/board/' + boardId)
  }

export const normalizeCardsPositions =
  (boardId: string, listId: number) => async (dispatch: Dispatch) => {
    let normalizedCards: changeCardGroup[] = []

    const board: BoardType = await instance.get('/board/' + boardId)

    board.lists.forEach((list) => {
      if (list.id === listId) {
        normalizedCards = list.cards.map((card, index) => {
          delete card.users
          delete card.created_at
          delete card.title
          card.position = String(index + 1)
          return {
            id: card.id!,
            position: parseInt(card.position),
            list_id: list.id,
          }
        })
      }
    })

    try {
      let resPut = await instance.put(
        config.boards + '/' + boardId + '/card',
        normalizedCards
      )
      store.dispatch(getBoard(boardId))
    } catch (e) {
      handleAxiosError(e, 'normalizeCardsPositions')
    }
  }

export const delCard =
  (boardId: string, cardID: string) => async (dispatch: Dispatch) => {

    try {
      let res = await instance.delete(
        config.boards + '/' + boardId + '/card/' + cardID
      )

      store.dispatch(getBoard(boardId))
    } catch (e) {
      handleAxiosError(e, 'delCard')
    }
  }

export const edCardDescription =
  (
    boardId: string,
    listID: number,
    cardID: string,
    cardTitle: string,
    description?: string
  ) =>
  async () => {
    let requestBody: CardRequest = {
      title: cardTitle,
      list_id: listID,
    }

    if (description) {
      requestBody = {
        ...requestBody,
        description: description,
      }
    }
    try {
      let res = await instance.put(
        config.boards + '/' + boardId + '/card/' + cardID,
        requestBody
      )
      store.dispatch(getBoard(boardId))
    } catch (e) {
      handleAxiosError(e, 'edCardDescription')
    }
  }

export const updateCardPosition = (cardId: string, newPosition: number) => ({
  type: 'UPDATE_CARD_POSITION',
  payload: { cardId, newPosition },
})

export const editCards =
  (
    targetBoardId: string,
    initialListId: string,
    initialCardsString: string,
    draggedOffPosition: string,
    targetListId: number,
    targetListCards: CardType[],
    addCardInPosition: number,
    placedCardId: string
  ) =>
  async () => {
    let newCard: changeCardGroup = {
      id: placedCardId,
      position: addCardInPosition,
      list_id: targetListId,
    }

    let cardsToPutAfterInserting: changeCardGroup[] = []

    //картки початкового списку
    let cardsToDelete: CardType[] = JSON.parse(initialCardsString)

    //видаляємо перетягувану картку
    cardsToDelete.splice(+draggedOffPosition - 1, 1)

    //копія щоб не було мутації стейту
    let targetListCardsCopy = targetListCards.map((card) => {
      const { title, users, created_at, ...rest } = card
      return rest
    })

    if (targetListCardsCopy.length === 0) {
      cardsToPutAfterInserting[0] = newCard
    } else {
      targetListCardsCopy.forEach((card, index) => {
        if (
          +card.position >= addCardInPosition &&
          +card.id! !== +placedCardId //на випадок, якщо переміщення в межах одного списку?
        ) {
          //карткам нижче вставленої збільшуємо позицію на 1
          cardsToPutAfterInserting[index + 1] = {
            id: card.id!,
            position: +card.position + 1,
            list_id: targetListId,
          }
        } else if (+card.id! !== +placedCardId) {
          //інашке карткам вище вставленої не міняємо позицію
          console.log('card pos =', card)
          cardsToPutAfterInserting[index] = {
            id: card.id!,
            position: +card.position,
            list_id: targetListId,
          }
        }      
      })

      cardsToPutAfterInserting[addCardInPosition - 1] = newCard
    }


    //нормалізація позиції після переміщення в межах списку, бо може бути 1,3,4
    const insertedCardsToPut = cardsToPutAfterInserting
      .filter((value) => value !== null)
      .map((item: any, index: number) => ({ ...item, position: index + 1 }))

    try {
      let resPut = await instance.put(
        config.boards + '/' + targetBoardId + '/card',
        insertedCardsToPut
      )


      //видаляємо драгнуту картку з початкового списку
      if (+initialListId !== +targetListId) {
        console.log('initialListId !== list_id', initialListId, targetListId)
        const updatedCardsMinus = cardsToDelete.map((card, index) => {
          // ці поля треба видалити, ынакше instance.put поверне Error: Wrong data
          delete card.users
          delete card.created_at
          delete card.title
          delete card.description
          card.position = String(index + 2)
          return {
            ...card,
            position: parseInt(card.position),
            list_id: initialListId,
          }
        })

        for (let i = 0; i < updatedCardsMinus.length; i++) {
          updatedCardsMinus[i].position = i + 1
        }

        let resDel = await instance.put(
          config.boards + '/' + targetBoardId + '/card',
          updatedCardsMinus
        )
      }

      store.dispatch(getBoard(targetBoardId))
    } catch (e) {
      handleAxiosError(e, 'editCards')
    }
  }

export const deleteList =
  (boardId: string, listId: number) => async () => {
    try {
      await instance.delete(config.boards + '/' + boardId + '/list/' + listId)
      store.dispatch(getBoard(boardId))
      store.dispatch(getBoards())
    } catch (e) {
      handleAxiosError(e, 'deleteList')
    }
  }
