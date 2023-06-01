import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  addCard,
  deleteList,
  editCards,
  editListTitle,
  getBoard,
} from '../../../../store/modules/board/actions'
import { shallowEqual, useSelector } from 'react-redux'
import { newNameValidation } from '../../../../common/functions/functions'
import store, { RootState } from '../../../../store/store'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { clearError } from '../../../../store/modules/errorHandlers/actions'
import { CardType, ListType, SlotProps } from '../../../../common/types'
import { Card } from '../Card/Card'
import { AddInput } from '../../AddInput'
import React from 'react'
import { Slot } from '../Slot/Slot'
import './list.scss'

type SetCards = {
  setCards: (value: CardType[]) => void
}

export const List = (props: ListType & SetCards) => {
  let boardId = useParams().id as string

  const selectError = useSelector(
    (state: RootState) => state.error,
    shallowEqual
  )

  //For display changes after deleting the list
  useEffect(() => {}, [props])

  const [listActionsShown, setListActionsShown] = useState(false)
  const [addCardActionsShown, setAddCardActionsShown] = useState(false)
  const [addCardShown, setAddCardShown] = useState(true)
  const [listName, setListName] = useState(props.title)
  const [initListName, setInitListName] = useState('')
  const [isEditListName, setEditListNameVisibity] = useState(false)
  const [isErrorValidation, setErrorValidationOpen] = useState(false)
  const [isErrorCardValidation, setErrorCardValidationOpen] = useState(false)
  const [errorText, setErrorText] = useState('Error: ' + selectError.errorText)
  const [showSlot, setShowSlot] = useState(false)
  const [showFirstSlot, setShowFirstSlot] = useState(false)
  const [showSingleSlot, setShowSingleSlot] = useState(false)

  let [slotIndex, setSlotIndex] = useState(-1)
  const listRef = useRef<HTMLDivElement>(null)

  const inputAddCardRef = useCallback((input: HTMLInputElement) => {
    if (input) {
      input.focus()
      input.select()

      var headerOffset = 45
      var elementPosition = input.getBoundingClientRect().top
      var offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }, [])

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setListName(ev.target.value)
  }

  const toggleListName = () => {
    setInitListName(listName!)
    setEditListNameVisibity(!isEditListName)
  }

  const showListActions = () => {
    setListActionsShown(!listActionsShown)
  }

  const showAddCardActions = () => {
    setAddCardActionsShown(!addCardActionsShown)
    setAddCardShown(!addCardShown)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (newNameValidation(listName)) {
        setListName(listName)
        setEditListNameVisibity(false)
        store.dispatch(
          editListTitle(listName, boardId, props.position, props.id)
        )
      } else {
        setEditListNameVisibity(false)
        setListName(initListName)
        setErrorText('List name ' + listName + ' is not valid')
        setErrorValidationOpen(true)
      }
    }
  }

  const handleBlur = () => {
    if (newNameValidation(listName)) {
      setEditListNameVisibity(false)
    } else {
      setErrorText('List name ' + listName + ' is not valid')
      setErrorValidationOpen(true)
    }
  }

  const handleSnackbarClose = () => {
    setErrorValidationOpen(false)
    setErrorCardValidationOpen(false)
    store.dispatch(clearError())
  }

  const addCardOnEnter = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      if (newNameValidation((ev.target as HTMLInputElement).value)) {
        store.dispatch(
          addCard(
            (ev.target as HTMLInputElement).value,
            boardId,
            props.id,
            props.cards.length,
            boardId
          )
        )
        showAddCardActions()
      } else {
        setErrorText(
          'Card name ' + (ev.target as HTMLInputElement).value + ' is not valid'
        )
        setErrorCardValidationOpen(true)
      }
    }
  }

  const addCardOnButton = () => {
    const elemInpCardTitle = document.querySelector(
      '.inp-cardtitle'
    ) as HTMLInputElement

    if (newNameValidation(elemInpCardTitle.value)) {
      store.dispatch(
        addCard(
          elemInpCardTitle.value,
          boardId,
          props.id,
          props.cards.length,
          boardId
        )
      )
      showAddCardActions()
    } else {
      setErrorText('Card name ' + elemInpCardTitle.value + ' is not valid')
      setErrorCardValidationOpen(true)
    }
  }

  const showSnackbar =
    selectError.isError || isErrorValidation || isErrorCardValidation

  useEffect(() => {
    if (selectError.isError) {
      setErrorText('Error: ' + selectError.errorText)
    }
  }, [selectError.isError])

  const handleSave = (cardName: string) => {
    if (!newNameValidation(cardName)) {
      setErrorText('Card name ' + cardName + ' is not valid')
      setErrorCardValidationOpen(true)
      return
    }
    store.dispatch(
      addCard(cardName, boardId, props.id, props.cards.length + 1, boardId)
    )
  }

  // const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault()
  //   // console.log('onDragLeave list', e.target)
  //   console.log('onDragLeave list related', e.relatedTarget)
  //   console.log('onDragLeave e', e)

  //   if (
  //     (e.relatedTarget as HTMLDivElement).className === 'board-content' ||
  //     (e.relatedTarget as HTMLDivElement).className === 'boards' ||
  //     (e.relatedTarget as HTMLDivElement).className === 'board-header'
  //   ) {
  //     setShowSlot(false)
  //     setSlotIndex(-1)
  //   }

  //   if (
  //     (e.relatedTarget as HTMLDivElement).className === 'board-content' ||
  //     (e.relatedTarget as HTMLDivElement).className === 'boards' ||
  //     (e.relatedTarget as HTMLDivElement).className === 'board-header'
  //   ) {
  //     setShowFirstSlot(false)
  //     setShowSingleSlot(false)
  //   }
  // }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    //prevent the default behavior of the browser (which is to not allow drops)
    e.preventDefault()

    if (
      (e.target as HTMLDivElement).classList.value === 'list-title' ||
      (e.target as HTMLDivElement).classList.value ===
        'list-menu icon-dots-three' ||
      (e.target as HTMLDivElement).classList.value ===
        'list-header-container' ||
      (e.target as HTMLDivElement).classList.value === 'list-header'
    ) {
      if (props.cards.length > 0) {
        setShowFirstSlot(true)
        setShowSlot(false)
      }
      if (props.cards.length === 0) {
        setShowSingleSlot(true)
      }
    }

    if (
      (e.target as HTMLDivElement).classList.value === 'list-card card' ||
      (e.target as HTMLDivElement).classList.value === 'cards-container' ||
      (e.target as HTMLDivElement).classList.value === 'self-card' ||
      (e.target as HTMLDivElement).classList.value ===
        'list-menu icon-dots-three'
    ) {
      if (props.cards.length === 0) {
        setShowSingleSlot(true)
        setShowSlot(false)
      } else {
        setShowSingleSlot(false)
        setShowSlot(true)
        console.log(
          'handleDragOver showslot',
          (e.target as HTMLDivElement).classList.value
        )
      }
    }

    if ((e.target as HTMLDivElement).classList.value === 'open-add-list') {
      if (props.cards.length === 0) {
        setShowSlot(false)
        setShowSingleSlot(true)
      } else {
        setShowSlot(true)
        setSlotIndex(props.cards.length - 1)
      }
    }
  }

  const onDragLeaveTarget = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    if (e.relatedTarget && e.relatedTarget instanceof HTMLDivElement) {
      if ((e.relatedTarget as HTMLDivElement).className === 'open-add-list') {
        setShowSingleSlot(false)
        setSlotIndex(-1)
      } else if (
        (e.relatedTarget as HTMLDivElement).className === 'board-content' ||
        (e.relatedTarget as HTMLDivElement).className === 'board-header'
      ) {
        allToFalse()
      }
    } else {
      allToFalse()
    }
  }

  const setSlotPosition = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    //з e.preventDefault() не показується перетягувана картка

    if (showSingleSlot === false) {
      setShowSlot(true)
      setShowFirstSlot(false)
    }

    const cardBounds = (e.target as HTMLDivElement).getBoundingClientRect()

    const above = e.clientY - cardBounds.top < cardBounds.height / 2
    const below = e.clientY - cardBounds.top > cardBounds.height / 2

    //first card
    if (above && index === 0) {
      setShowSlot(false)
      setShowFirstSlot(true)
    }
    if (below && index === 0) {
      console.log(`below && index === 0`, slotIndex)
      setShowFirstSlot(false)
      setSlotIndex(index)
    }

    //card 2 and further
    if (below) {
      setSlotIndex(index)
    }

    if (above && index !== 0) {
      setSlotIndex(index - 1)
    }
  }

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    cardPosition: number
  ) => {
    if (cardPosition === props.cards.length) {
      setSlotIndex(props.cards.length - 1)
    }

    e.dataTransfer.setData('initial list', props.id.toString())
    e.dataTransfer.setData('initial cards', JSON.stringify(props.cards))
    e.dataTransfer.setData('dragged off position', JSON.stringify(cardPosition))
    e.dataTransfer.setData('card id', e.currentTarget.id)
    e.dataTransfer.setData('card title', e.currentTarget.title)
    e.dataTransfer.setData('pos', String(cardPosition))

    setTimeout(() => {
      if (cardPosition === 1) {
        setShowFirstSlot(true)
      } else {
        setShowSlot(true)
      }
    }, 0)
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setShowFirstSlot(false)
    setShowSlot(false)
  }

  const allToFalse = () => {
    setShowFirstSlot(false)
    setShowSingleSlot(false)
    setShowSlot(false)
    setSlotIndex(-1)
  }

  return (
    <div
      className="list"
      id={String(props.id)}
      ref={listRef}
      onDragOver={handleDragOver}
      onDrop={allToFalse}
      onDragLeave={onDragLeaveTarget}
    >
      <div className="list-header-container">
        <div className="input-container">
          {isEditListName ? (
            <input
              className="input-list-title"
              type="text"
              value={listName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              autoFocus
            />
          ) : (
            <div className="list-header">
              <h2 className="list-title" onClick={toggleListName}>
                {listName}
              </h2>
              <div
                className="list-menu icon-dots-three"
                onClick={showListActions}
              ></div>
            </div>
          )}
        </div>
      </div>

      <div className="cards-container">
        {props.cards.map((card: CardType, index, arr: CardType[]) => {
          let nextCard: CardType
          nextCard = arr[index + 1]

          const slotProps: SlotProps = {
            card: card,
            nextCard: nextCard,
            setShowSlot: setShowSlot,
            setShowFirstSlot: setShowFirstSlot,
            setSlotIndex: setSlotIndex,
            slotIndex: slotIndex,
            boardId: boardId,
            listId: props.id,
            cards: props.cards,
          }

          return (
            <div key={card!.id}>
              {index === 0 && showFirstSlot && (
                <Slot slotPosition="above" {...slotProps} />
              )}

              <Link
                className="link-no-underline"
                to={`/board/${boardId}/card/${card.id}/`}
              >
                <Card
                  {...card}
                  index={+props.position}
                  boardid={boardId}
                  listId={props.id}
                  setSlotPosition={setSlotPosition}
                  handleDragStart={handleDragStart}
                  handleDragEnd={handleDragEnd}
                />
              </Link>
              {
                //without this condition, the slots under every card are shown
                index === slotIndex && showSlot && !showFirstSlot && (
                  <Slot slotPosition="below" {...slotProps} />
                )
              }
            </div>
          )
        })}
      </div>

      {showSingleSlot && (
        <div
          className="single-slot"
          onDrop={(e) => {
            let idDropped = e.dataTransfer.getData('card id')
            setShowSingleSlot(false)
            store.dispatch(
              editCards(
                boardId,
                e.dataTransfer.getData('initial list'),
                e.dataTransfer.getData('initial cards'),
                e.dataTransfer.getData('dragged off position'),
                props.id,
                props.cards,
                1,
                idDropped
              )
            )
          }}
        ></div>
      )}

      <div
        className="addinput-container"
        onDragOver={handleDragOver}
        onDragLeave={onDragLeaveTarget}
      >
        <AddInput handleSave={handleSave} defaultValue={''} source={'card'} />
      </div>

      {listActionsShown && (
        <div className="list-actions">
          <div className="list-actions-header">
            <h2 className="list-actions-title">List Actions</h2>
            <div
              className="icon-close-list icon-close"
              onClick={showListActions}
            ></div>
          </div>
          <div className="list-list-actions">
            <ul>
              <li>
                <button
                  onClick={(e) => {
                    store.dispatch(deleteList(boardId, props.id))
                    store.dispatch(getBoard(boardId))
                    setListActionsShown(!listActionsShown)
                  }}
                  className="list-delete-button"
                >
                  Delete list
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      {addCardActionsShown && (
        <>
          <div className="add-cardtitle-form">
            <input
              className="inp-cardtitle"
              type="text"
              name="new-card"
              onKeyDown={addCardOnEnter}
              placeholder="Enter card title..."
              ref={inputAddCardRef}
            />
            <div className="add-cardtitle-controls">
              <button
                className="cardtitle-add-button"
                onClick={addCardOnButton}
              >
                Add card title
              </button>
              <span
                onClick={showAddCardActions}
                className="icon-close icon-close-cardtitle"
              ></span>
            </div>
          </div>
        </>
      )}

      <Snackbar open={showSnackbar} message={errorText}>
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorText}
        </Alert>
      </Snackbar>
    </div>
  )
}
