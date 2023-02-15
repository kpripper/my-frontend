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

interface SetCards {
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
  //const [slotPosition, setSlotPosition] = useState('above')
  const handleDragOverStart = () => setDragOver(true)
  const handleDragOverEnd = () => setDragOver(false)
  const [lastDropTarget, setLastDropTarget] = useState(null)
  const [isOver, setIsOver] = useState(false)
  const [slot, setSlot] = useState<null | number>(null)
  const [showSlot, setShowSlot] = useState(false)
  const [showFirstSlot, setShowFirstSlot] = useState(false)
  const [slotIndex, setSlotIndex] = useState(-1)
  const listRef = useRef<HTMLDivElement>(null)
  const [slotIndexSimple, setSlotIndexSimple] = useState(-1)

  //for ondragover="enableDropping(e)"
  const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    setShowSlot(false)
    const id = event.dataTransfer.getData('text')
    const dragCardName = event.dataTransfer.getData('name')
    console.log(`Dropped in list ${props.id} a card: ${id} : ${dragCardName}`)

    // store.dispatch(addCard(dragCardName, boardId, props.id, props.position))
    // store.dispatch(delCard(boardId, id))

    //setDragOver(false)
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('onDragOver', e.target)

    e.preventDefault()
    setIsOver(true)
    setSlot(e.clientY)
  }

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('onDragLeave list', e.target)
    // ;(e.target as HTMLDivElement).classList.add('red-bg')
    // ;(e.target as HTMLDivElement).classList.remove('green-bg')

    if ((e.target as HTMLDivElement).className === 'list-card') {
      setTimeout(function () {
        setShowSlot(false)
      }, 1000) // 5 seconds
    }
  }

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    //@ts-ignore
    console.log('onDragEnter list', (e.target as HTMLDivElement).index)
    // ;(e.target as HTMLDivElement).classList.add('green-bg')
    // ;(e.target as HTMLDivElement).classList.remove('red-bg')
    //@ts-ignore
    setSlotPos(e, (e.target as HTMLDivElement).index)
    setShowSlot(true)
    console.log(`onDragEnter list slotIndex`, slotIndex)
  }

  // const setSlotPos = (
  //   e: React.DragEvent<HTMLDivElement>,
  //   index: number
  // ) => {
  //   e.preventDefault()
  //   console.log(`setSlotPos target`, e.target)
  //   //@ts-ignore
  //   console.log(`setSlotPos target index`, index)

  //   const cardBounds = e.currentTarget.getBoundingClientRect()
  //   const y = e.clientY - cardBounds.top

  //   if (y < cardBounds.height / 2) {
  //     setSlotIndex(index)
  //   } else {
  //     setSlotIndex(index + 1)
  //   }
  //   console.log(`setSlotPos set slotIndex`, slotIndex)
  // }

  const handleDragExit = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('handleDragExit list', e.target)
    setShowSlot(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text')
    const dragCardName = e.dataTransfer.getData('name')
    enableDropping(e)
    const targetElement = document.elementFromPoint(e.clientX, e.clientY)

    console.log(`handleDragOver list e.currentTarget`, e.currentTarget)
    console.log(`handleDragOver list targetElement`, e.currentTarget)
  }

  const handleDragOverCard = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault()
    console.log(`handleDragOverCard`, index)

    // setShowSlot(true)

    const cardBounds = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - cardBounds.top

    console.log(`handleDragOverCard y`, y)

    // if (y < cardBounds.height / 2) {
    //   setSlotIndex(index + 1)
    // } else {
    //   setSlotIndex(index - 1)
    // }

    // setSlotIndex(index)
  }

  const setSlotPosition = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    //з e.preventDefault() не показується перетягувана картка
    console.log(`setSlotPosition target`, e.target)
    console.log(`setSlotPosition e.currentTarget`, e.currentTarget)
    console.log(`setSlotPosition card index`, index)
    console.log(`setSlotPosition start slotIndex`, slotIndex)
    // setTimeout(function () {
    //   setShowSlot(true)
    // }, 500)
    setShowSlot(true)

    // const cardBounds = e.currentTarget.getBoundingClientRect()
    const cardBounds = (e.target as HTMLDivElement).getBoundingClientRect()

    const above = e.clientY - cardBounds.top < cardBounds.height / 2
    const below = e.clientY - cardBounds.top > cardBounds.height / 2

    if (above && index === 0) {
    //  console.log(`1 above 0 slotIndex`, slotIndex)
      setShowFirstSlot(true)
      // const newCards = [...props.cards];
      // props.cards.forEach((card, i) => {
      //   if (i >= index) {
      //     card.index = i + 1;
      //   }
      // });
      // setSlotIndex(0)

    //  console.log(`above 0 slotIndex`, slotIndex)
    }

    if (above && slotIndex === -1) {
      setSlotIndex(index - 1)
      setTimeout(() => {
        console.log(index, `1 above setted slotIndex`, slotIndex)
      }, 0)
    }

    if (below && slotIndex < index) {
      console.log('below')
      setShowFirstSlot(false)
      setSlotIndex(index)
      setTimeout(() => {
        console.log(index, `2 below setted slotIndex`, slotIndex)
      }, 0)
    }

    if (below && slotIndex === index) {
      setShowFirstSlot(false)
      setSlotIndex(index)
     // console.log(index, `3 below setted slotIndex`, slotIndex)
    }

    if (above && slotIndex === index && index > 0) {
      setShowFirstSlot(false)
      setSlotIndex(index - 1)
     // console.log(index, `4 above setted slotIndex`, slotIndex)
    }

    if (above && slotIndex > index) {
      setShowFirstSlot(false)
      setSlotIndex(index - 1)
     // console.log(index, `5 above setted slotIndex`, slotIndex)
    }
  }

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.dataTransfer.setData('text', e.currentTarget.id)
    e.dataTransfer.setData('name', e.currentTarget.innerText)
    console.log('e', e.target)
    setTimeout(() => {
      console.log('list handleDragStart index', index)
    }, 0)

   // setSlotPosition(e, index)
    setShowSlot(true)
  }

  return (
    <div
      // key={props.id}
      id={props.id}
      className="list"
      // onDragOver={(e) => enableDropping(e)}
      ref={listRef}
      // onDragOver={handleDragOver}
      //onDragLeave={onDragLeave}
      // onDragEnter={onDragEnter}
      // onDragExit={handleDragExit}
      // onDrop={handleDrop}
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
                {listName} <br />
                slotInd {slotIndex} <br />
                showSlot {showSlot ? 'true' : 'false'}
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
        <div key={card.id}>
          {index === slotIndex && showFirstSlot && (
            <div
              className="slot"
              onDragOver={enableDropping}
              onDrop={(e) => {    
                e.preventDefault()
                //два слота, того що в процесі тягання обидва могли включитися
                setShowFirstSlot(false)
                setShowSlot(false)
                const id = e.dataTransfer.getData('text')
                const dragCardName = e.dataTransfer.getData('name')
                console.log(
                  `Dropped in list ${props.id} in slot ${slotIndex} a card: ${id} : ${dragCardName}`
                )
              }}
            >
              ind {index}, First Slot {slotIndex}
            </div>
          )}

          <Card
            {...card}
            index={index}
            boardId={boardId}
            listId={props.id}
            setSlotPosition={setSlotPosition}
            handleDragStart={handleDragStart}
          />

          {index === slotIndex && showSlot && !showFirstSlot && (
            <div
              className="slot"
              onDragOver={enableDropping}
              onDrop={(e) => {
                e.preventDefault()
                setShowFirstSlot(false)
                setShowSlot(false)
                const id = e.dataTransfer.getData('text')
                const dragCardName = e.dataTransfer.getData('name')
                console.log(
                  `Dropped in list ${props.id} in slot ${slotIndex} a card: ${id} : ${dragCardName}`
                )
              }}
            >
              ind {index}, slotInd {slotIndex}
            </div>
          )}
        </div>
      ))}

      <AddInput handleSave={handleSave} defaultValue={''} source={'card'} />

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
