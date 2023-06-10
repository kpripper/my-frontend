import { CardType } from '../../../common/types'

const initialState = {
  cards: [] as CardType[],
}

const reducer = (
  state = initialState,
  action: { type: string; payload: { cardId: string; newPosition: number } },
) => {
  switch (action.type) {
    case 'UPDATE_CARD_POSITION':
      const { cardId, newPosition } = action.payload
      const newCards = state.cards.map(card => {
        if (card.id === cardId) {
          return { ...card, position: newPosition }
        } else {
          return card
        }
      })
      return { ...state, cards: newCards }
    default:
      return state
  }
}

export default reducer
