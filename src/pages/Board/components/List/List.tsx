import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  addCard,
  delCard,
  deleteList,
  editListTitle,
} from '../../../../store/modules/board/actions'
import './list.scss'
import { shallowEqual, useSelector } from 'react-redux'
import { newNameValidation } from '../../../../common/functions/functions'
import store, { RootState } from '../../../../store/store'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { clearError } from '../../../../store/modules/errorHandlers/actions'
import { CardType, ListType } from '../../../../common/types'
import { Card } from '../Card/Card'
import { AddInput } from '../../AddInput'
import { setSyntheticLeadingComments } from 'typescript'
import { borderRadius } from '@mui/system'
import React from 'react'

export const List = (props: ListType) => {
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
            props.position
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
        addCard(elemInpCardTitle.value, boardId, props.id, props.position)
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
    store.dispatch(addCard(cardName, boardId, props.id, props.position))
  }

  const [dragOver, setDragOver] = useState(false)
  const [slotPosition, setSlotPosition] = useState('above')
  const handleDragOverStart = () => setDragOver(true)
  const handleDragOverEnd = () => setDragOver(false)
  const [lastDropTarget, setLastDropTarget] = useState(null);

  const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    setShowSlot(false)
    const id = event.dataTransfer.getData('text')
    const dragCardName = event.dataTransfer.getData('name')
    console.log(
      `Dropped in list on ${props.id} an element: ${id} : ${dragCardName}`
    )

    store.dispatch(addCard(dragCardName, boardId, props.id, props.position))
    store.dispatch(delCard(boardId, id))

    setDragOver(false)
  }

  const [isOver, setIsOver] = useState(false)
  const [slot, setSlot] = useState<null | number>(null)

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('onDragOver', e.target)

    e.preventDefault()
    setIsOver(true)
    setSlot(e.clientY)
  }

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('onDragLeave list', e.target)

   // setShowSlot(false)
  }

  const handleDragExit = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('handleDragExit list', e.target)
    setShowSlot(false)
  }

  const [showSlot, setShowSlot] = useState(false)

  const [slotIndex, setSlotIndex] = useState(-1)
  const listRef = useRef<HTMLDivElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text')
    const dragCardName = e.dataTransfer.getData('name')

    // console.log(
    //   `handleDragOver on ${props.id} an element: ${id} : ${dragCardName} : ${showSlot}`
    // )
    setShowSlot(true)

    const listRect = listRef.current?.getBoundingClientRect()
    if (!listRect) return

    const listHeight = listRect.bottom - listRect.top

   // console.log(`listHeight : ${listHeight}`)

    const mousePos = e.clientY - listRect.top

   // console.log(`mousePos : ${mousePos}`)

    const slotIndex = Math.floor((mousePos / listHeight) * props.cards.length)

   // console.log(`slotIndex : ${slotIndex}`)

    setSlotIndex(slotIndex - 1)
  }

  const handleDragOverCard = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()

    const cardBounds = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - cardBounds.top

    if (y < cardBounds.height / 2) {
      setSlotPosition("above")
    } else {
      setSlotPosition("below")
    }

    setSlotIndex(index)
    setShowSlot(true)
  }

  return (
    <div
      id={props.id}
      className="list"
      // onDragOver={enableDropping}

      ref={listRef}
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDragExit={handleDragExit}
      onDrop={handleDrop}
      // style={ondragover ? { fontWeight: 'bold', background: 'red' } : {}}
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

      {props.cards.map((card, index) => (
        <>
          <Card
            {...card}
            index={index}
            key={card.id}
            boardId={boardId}
            listId={props.id}
            draggable
            onDragOver={(e) => handleDragOverCard (e, index)}
          />

          {index === slotIndex && showSlot && (
            <div
              className="slot"
              style={{
                top: slotPosition === 'above' ? '-30px' : '30px',
              }}
              onDrop={(e) => {
                e.preventDefault()
              }}
              onDragOver={(e) => {
                e.preventDefault()
              }}
            >
              {index}
            </div>
          )}
        </>
      ))}

      <AddInput  handleSave={handleSave} defaultValue={''} source={'card'} />

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
    </div>
  )
}
