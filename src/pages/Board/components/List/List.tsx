import {
  DetailedHTMLProps,
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import {
  addCard,
  delCard,
  deleteList,
  editCards,
  editListTitle,
} from '../../../../store/modules/board/actions'
import './list.scss'
import { shallowEqual, useSelector } from 'react-redux'
import { newNameValidation } from '../../../../common/functions/functions'
import store, { RootState } from '../../../../store/store'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { clearError } from '../../../../store/modules/errorHandlers/actions'
import { CardType, ListType, SlotProps } from '../../../../common/types'
import { Card } from '../Card/Card'
import { AddInput } from '../../AddInput'
import { setSyntheticLeadingComments } from 'typescript'
import { borderRadius } from '@mui/system'
import React from 'react'
import { Slot } from '../Slot/Slot'
import PropTypes from 'prop-types'

type SetCards = {
  setCards: (value: CardType[]) => void
}

export const List = (props: ListType & SetCards) => {
  //console.log('props list ', props.title, ' cards', props.cards)
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

  const inputRef = useCallback((input: HTMLInputElement) => {
    if (input) {
      input.focus()
      input.select()
      // input.scrollIntoView({
      //   behavior: 'smooth',
      // })
      // input.scrollTop = 250

      var headerOffset = 45
      var elementPosition = input.getBoundingClientRect().top
      var offsetPosition = elementPosition + window.pageYOffset - headerOffset

      console.log('offsetPosition', offsetPosition)

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
        console.log(listName, boardId, props.position, props.id)

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
    console.log('handleblur list')
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
            props.cards.length
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
        addCard(elemInpCardTitle.value, boardId, props.id, props.cards.length)
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
    store.dispatch(addCard(cardName, boardId, props.id, props.cards.length + 1))
  }

  //for ondragover="enableDropping(e)"
  // const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
  //   event.preventDefault()
  // }

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    // console.log('onDragLeave list', e.target)
    console.log('onDragLeave list related', e.relatedTarget)
    console.log('onDragLeave e', e)

    // ;(e.target as HTMLDivElement).classList.add('red-bg')
    // ;(e.target as HTMLDivElement).classList.remove('green-bg')

    if (
      (e.relatedTarget as HTMLDivElement).className === 'board-content' ||
      (e.relatedTarget as HTMLDivElement).className === 'boards' ||
      (e.relatedTarget as HTMLDivElement).className === 'board-header'
      // (e.relatedTarget as HTMLDivElement).className === 'list'
      // (e.relatedTarget as HTMLDivElement).className === 'cards-container'
    ) {
      setShowSlot(false)
      console.log('setShowSlot(false) onDragLeave')
      // setShowFirstSlot(false)
      // setShowSingleSlot(false)
      setSlotIndex(-1)
    }

    if (
      (e.relatedTarget as HTMLDivElement).className === 'board-content' ||
      (e.relatedTarget as HTMLDivElement).className === 'boards' ||
      (e.relatedTarget as HTMLDivElement).className === 'board-header'
    ) {
      setShowFirstSlot(false)
      setShowSingleSlot(false)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    //prevent the default behavior of the browser (which is to not allow drops)
    e.preventDefault()

    //сам лист console.log(`handleDragOver list e.currentTarget`, e.currentTarget)

    console.log(
      'handleDragOver (e.target as HTMLDivElement).classList.value',
      (e.target as HTMLDivElement).classList.value
    )

    // console.log('drag data', e.dataTransfer.getData('card id'))

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
        // setShowSlot(false)
      }
    }

    if (
      // (e.target as HTMLDivElement).classList.value === 'slot' ||
      (e.target as HTMLDivElement).classList.value === 'list-card card' ||
      (e.target as HTMLDivElement).classList.value === 'cards-container' ||
      (e.target as HTMLDivElement).classList.value === 'self-card' ||
      (e.target as HTMLDivElement).classList.value ===
        'list-menu icon-dots-three'
    ) {
      // console.log(
      //   'handleDragOver list, showslot',
      //   (e.target as HTMLDivElement).classList.value
      // )
      // console.log('cards length', props.cards.length)
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

    //сам лист console.log(`handleDragOver list e.currentTarget`, e.currentTarget)

    console.log(
      'onDragLeaveTarget',
      e.target as HTMLDivElement,
      e.relatedTarget as HTMLDivElement
    )

    if (e.relatedTarget && e.relatedTarget instanceof HTMLDivElement) {
      if ((e.relatedTarget as HTMLDivElement).className === 'open-add-list') {
        setShowSingleSlot(false)
        setSlotIndex(-1)
      } else if (
        (e.relatedTarget as HTMLDivElement).className === 'board-content' ||
        (e.relatedTarget as HTMLDivElement).className === 'board-header'
      ) {
        console.log('all to false')
        allToFalse()
      }
    } else {
      console.log('all to false')
      allToFalse()
    }
  }

  const setSlotPosition = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    //з e.preventDefault() не показується перетягувана картка

    console.log('set slot props', e, index)
    if (showSingleSlot === false) {
      console.log(' setSlotPosition showslot')
      setShowSlot(true)
      setShowFirstSlot(false)
    }

    // console.log('setShowSlot setSlotPosition')

    const cardBounds = (e.target as HTMLDivElement).getBoundingClientRect()

    console.log('setSlotPosition e.client', e.target as HTMLDivElement)

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
      console.log(`below`)
      setSlotIndex(index)
    }

    if (above && index !== 0) {
      console.log(`below`)
      setSlotIndex(index - 1)
    }

    // console.log(`final slotIndex`, slotIndex)
  }

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    cardPosition: number
  ) => {
    //якщо остання картка - показуэмо слот на її місці
    //BUG - setSlotIndex(position - 1) веде до глюків при дропі на слот своєї картки
    //треба прив'язати до below останньої картки

    if (cardPosition === props.cards.length) {
      // setShowSlot(true)
      setSlotIndex(props.cards.length - 1)
      // setSlotPosition(e, position - 1)
      console.log('last position')
    }

    e.dataTransfer.setData('initial list', props.id.toString())
    e.dataTransfer.setData('initial cards', JSON.stringify(props.cards))
    e.dataTransfer.setData('dragged off position', JSON.stringify(cardPosition))
    e.dataTransfer.setData('card id', e.currentTarget.id)

    // e.dataTransfer.setData('name', e.currentTarget.innerText)
    e.dataTransfer.setData('pos', String(cardPosition))

    console.log('e.dataTransfer card id', e.dataTransfer.getData('card id'))
    // console.log('e.dataTransfer pos', e.dataTransfer.getData('pos'))

    setTimeout(() => {
      console.log('list handleDragStart index', cardPosition)
      if (cardPosition === 1) {
        setShowFirstSlot(true)
      } else {
        console.log('handleDragStart showslot')
        setShowSlot(true)
      }
    }, 0)

    // setSlotPosition(e, index)
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) =>
    // e: React.DragEvent<HTMLDivElement>,
    // index: number
    {
      console.log('handleDragEnd', e)
      setShowFirstSlot(false)
      setShowSlot(false)
    }


  const allToFalse = () => {
    setShowFirstSlot(false)
    setShowSingleSlot(false)
    setShowSlot(false)
    setSlotIndex(-1)
  }

  useEffect(() => {
    // console.log('useEffect updated slotIndex', slotIndex)
  }, [slotIndex])

  const location = useLocation();

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
                 {/* <br />
                {props.id} <br />
                slotInd {slotIndex} <br />
                showSlot {showSlot ? 'true' : 'false'} <br />
                showFirstSlot {showFirstSlot ? 'true' : 'false'} <br />
                showSingleSlot {showSingleSlot ? 'true' : 'false'} */}
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
           // <> //NOTE Warning: Each child in a list should have a unique "key" prop.
              <div key={card!.id}>
                {index === 0 && showFirstSlot && (
                  <Slot slotPosition="above" {...slotProps} />
                )}

                <Link
                  to={`/board/${boardId}/card/${card.id}/`}                 
                  state={{ background: location }}
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
                  //without this condition, the slots under all cards are shown
                  index === slotIndex && showSlot && !showFirstSlot && (
                    <Slot slotPosition="below" {...slotProps} />
                  )
                }
              </div>
         //  </>
          )
        })}
      </div>
      {/* showSingleSlot {showSingleSlot ? 'true' : 'false'} <br /> */}

      {showSingleSlot && (
        <div
          className="single-slot"
          onDrop={(e) => {
            let idDropped = e.dataTransfer.getData('card id')
            console.log('drop', idDropped, props.id, props.cards)
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
        //onDragLeave={onDragLeave}
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
                    showListActions()
                  }}
                  className="invisible-button"
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
              ref={inputRef}
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
      {/* <Outlet />  */}
    </div>
  )
}
