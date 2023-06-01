export const updateCardPosition = (cardId: string, newPosition: number) => ({
  type: 'UPDATE_CARD_POSITION',
  payload: { cardId, newPosition },
})
