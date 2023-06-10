import { DetailedHTMLProps, HTMLAttributes } from 'react'
import { CardType } from '../../../../common/types'
import { editCards } from '../../../../store/modules/board/actions'
import store from '../../../../store/store'
import './slot.scss'

//for ondragover="enableDropping(e)"
const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault()
}

type SlotProps = {
  slotPosition: 'above' | 'below'
  card: CardType
  nextCard: CardType
  setShowSlot: (arg0: boolean) => void
  setShowFirstSlot: (arg0: boolean) => void
  setSlotIndex: (arg0: number) => void
  slotIndex: number
  boardId: string
  listId: number
  cards: CardType[]
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export const Slot = ({
  slotPosition,
  card,
  nextCard,
  setShowSlot,
  setShowFirstSlot,
  setSlotIndex,
  slotIndex,
  boardId,
  listId,
  cards: cardsInInitialList,
}: SlotProps) => {
  return (
    <div
      key={card!.id}
      className="slot"
      onDragOver={enableDropping}
      onDrop={e => {
        e.preventDefault()
        setShowFirstSlot(false)
        setShowSlot(false)
        console.log('setShowSlot(false) onDragLeave below')
        setSlotIndex(-1)
        const idDropped = e.dataTransfer.getData('card id')
        let dataTransferCardId = +e.dataTransfer.getData('card id')

        if (slotPosition === 'below') {
          if (dataTransferCardId === +card!.id!) {
            console.log('same below')
          } else {
            store.dispatch(
              editCards(
                boardId,
                e.dataTransfer.getData('initial list'),
                e.dataTransfer.getData('initial cards'),
                e.dataTransfer.getData('dragged off position'),
                listId,
                cardsInInitialList,
                slotIndex + 2,
                idDropped,
              ),
            )
          }
        }

        if (slotPosition === 'above') {
          if (dataTransferCardId === +card!.id!) {
            console.log('same above')
          } else {
            store.dispatch(
              editCards(
                boardId,
                e.dataTransfer.getData('initial list'),
                e.dataTransfer.getData('initial cards'),
                e.dataTransfer.getData('dragged off position'),
                listId,
                cardsInInitialList,
                1,
                idDropped,
              ),
            )
          }
        }
      }}
    ></div>
  )
}
