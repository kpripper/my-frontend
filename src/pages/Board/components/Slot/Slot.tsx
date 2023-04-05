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
  listId: string
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
  cards,
}: SlotProps) => {
  return (
    <div
      key={card!.id}
      className="slot"
      onDragOver={enableDropping}
      onDrop={(e) => {
        //NOTE не знаю що з цих треба, і чи треба обидва
        e.preventDefault()
        // e.stopPropagation()
        setShowFirstSlot(false)
        setShowSlot(false)
        console.log('setShowSlot(false) onDragLeave below')
        setSlotIndex(-1)
        const idDropped = e.dataTransfer.getData('card id')
        console.log(
          `Dropped in list ${listId} in slotPosition ${slotPosition} slotIndex:${slotIndex} a cardId: ${idDropped}  posit: {index}
          `
        )
        let dataTransferCardId = +e.dataTransfer.getData('card id')



        if (slotPosition === 'below') {          
          console.log('handle drop in Slot below', nextCard, card, 'dataTransferCardId', dataTransferCardId)

          if (dataTransferCardId === +card!.id!) {
            console.log('same below dataTransferCardId === +card!.id!', dataTransferCardId, +card!.id!)
          } else {
            console.log('drop below. try disp')
            store.dispatch(
              editCards(
                boardId,
                e.dataTransfer.getData('initial list'),
                e.dataTransfer.getData('initial cards'),
                e.dataTransfer.getData('dragged off position'),
                listId,
                cards,
                slotIndex + 2,
                idDropped
              )
            )
          }
        }

        //не робимо діспатч, якщо дроп на слот самої ж картки
        // if (slotPosition === 'below') {          
        //   console.log('handle drop in Slot below', nextCard, card, 'dataTransferCardId', dataTransferCardId)

        //   if (!nextCard && +e.dataTransfer.getData('card id') === +card!.id!) {
        //     console.log('same card case1')
        //   } else if (
        //     nextCard &&
        //     +e.dataTransfer.getData('card id') === +nextCard.id!
        //   ) {
        //     console.log('same card case2')
        //   } else {
        //     console.log('drop. try disp')
        //     store.dispatch(
        //       editCards(
        //         boardId,
        //         e.dataTransfer.getData('initial list'),
        //         e.dataTransfer.getData('initial cards'),
        //         e.dataTransfer.getData('dragged off position'),
        //         listId,
        //         cards,
        //         slotIndex + 2,
        //         idDropped
        //       )
        //     )
        //   }
        // }

        if (slotPosition === 'above') {   
          console.log('handle drop in Slot above', nextCard, card, 'dataTransferCardId', dataTransferCardId)


          if ( dataTransferCardId === +card!.id!) {
              console.log('same above dataTransferCardId === +card!.id!', dataTransferCardId, +card!.id!)
          } else {
            console.log('not same above')
                store.dispatch(
                  editCards(
                    boardId,
                    e.dataTransfer.getData('initial list'),
                    e.dataTransfer.getData('initial cards'),
                    e.dataTransfer.getData('dragged off position'),
                    listId,
                    cards,
                    1,
                    idDropped
                  )
                )
          }

          // if (nextCard) {
          //   if (
          //     dataTransferCardId !== +nextCard.id! ||
          //     dataTransferCardId !== +card!.id!
          //   ) {
          //     console.log('not same above')
          //     store.dispatch(
          //       editCards(
          //         boardId,
          //         e.dataTransfer.getData('initial list'),
          //         e.dataTransfer.getData('initial cards'),
          //         e.dataTransfer.getData('dragged off position'),
          //         listId,
          //         cards,
          //         1,
          //         idDropped
          //       )
          //     )
          //   } else {
          //     console.log('same above')
          //   }
          // } else {
          //   if (dataTransferCardId !== +card!.id!) {
          //     console.log('not same above')
          //     store.dispatch(
          //       editCards(
          //         boardId,
          //         e.dataTransfer.getData('initial list'),
          //         e.dataTransfer.getData('initial cards'),
          //         e.dataTransfer.getData('dragged off position'),
          //         listId,
          //         cards,
          //         1,
          //         idDropped
          //       )
          //     )
          //   } else {
          //     console.log('same above')
          //   }
          // }



          // if (nextCard) {
          //   if (
          //     dataTransferCardId === +nextCard.id! ||
          //     dataTransferCardId === +card!.id!
          //   ) {
          //     console.log('same above nextcard or card')
          //   } else {
          //     console.log('not same above')
          //     store.dispatch(
          //       editCards(
          //         boardId,
          //         e.dataTransfer.getData('initial list'),
          //         e.dataTransfer.getData('initial cards'),
          //         e.dataTransfer.getData('dragged off position'),
          //         listId,
          //         cards,
          //         1,
          //         idDropped
          //       )
          //     )
          //   }
          // } else {
          //   if (dataTransferCardId === +card!.id!) {
          //     console.log('same above card')

          //   } else {
          //     console.log('not same above')
          //     store.dispatch(
          //       editCards(
          //         boardId,
          //         e.dataTransfer.getData('initial list'),
          //         e.dataTransfer.getData('initial cards'),
          //         e.dataTransfer.getData('dragged off position'),
          //         listId,
          //         cards,
          //         1,
          //         idDropped
          //       )
          //     )
          //   }
          // }
        }
      }}
    >
      slotPosition {slotPosition}, slotInd {slotIndex} <br/>
       for card {card!.id}
    </div>
  )
}
