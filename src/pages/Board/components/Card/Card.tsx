import { Alert, Snackbar } from '@mui/material'
import { useCallback, useState } from 'react'
import { newNameValidation } from '../../../../common/functions/functions'
import { CardType } from '../../../../common/types'
import { edCard, delCard } from '../../../../store/modules/board/actions'
import store from '../../../../store/store'
import { AddInput } from '../../AddInput'
import { useCardOver } from '../../useCardOver'
import './card.scss'

export const Card = (props: CardType) => {
  // console.log(props)

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

  const [isSaveDelete, setIsEditing] = useState(false)
  const [cardName, setCardName] = useState(props.title)
  const [initCardName, setInitCardName] = useState('')
  const [isInputCardName, setInputCardNameVisibity] = useState(false)
  const [isErrorValidation, setErrorValidationOpen] = useState(false)
  const [onHold, setOnHold] = useState(false)

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setCardName(ev.target.value)
  }

  const toggleInputCardName = () => {
    setInitCardName(cardName!)
    setInputCardNameVisibity(!isInputCardName)
    setIsEditing(!isSaveDelete)
  }

  const { id, boardId, listId } = props as {
    id: string
    boardId: string
    listId: string
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // console.log('handleKeyDown', cardName)

    if (event.key === 'Enter') {
      if (newNameValidation(cardName!)) {
        setCardName(cardName)
        setInputCardNameVisibity(false)
        store.dispatch(edCard(boardId!, listId, props.id!, cardName!))
      } else {
        setErrorValidationOpen(true)
      }
    }
  }

  const handleSaveNew = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (newNameValidation(cardName!)) {
        setCardName(cardName)
        setInputCardNameVisibity(false)
        store.dispatch(edCard(boardId!, listId, props.id!, cardName!))
      } else {
        setErrorValidationOpen(true)
      }
    }
  }

  const handleBlur = () => {
    if (isInputCardName) {
      setCardName(initCardName)
      toggleInputCardName()
    }
  }

  var blurTimer: NodeJS.Timeout | null = null

  function newOnBlur() {
    blurTimer = setTimeout(handleBlur, 100)
  }

  const handleSave = () => {
    clearTimeout(blurTimer!)
    store.dispatch(edCard(boardId, listId, id, cardName!))
    setInputCardNameVisibity(false)
    setIsEditing(false)
  }

  const handleDelete = () => {
    clearTimeout(blurTimer!)
    store.dispatch(delCard(boardId, id))
    setInputCardNameVisibity(false)
    setIsEditing(false)
  }

  const handleSnackbarClose = () => {
    setErrorValidationOpen(false)
    toggleInputCardName()
  }

  // let draggedItem = null

  const [isOver, setIsOver] = useState(false)
  const [slotOld, setSlot] = useState<null | number>(null)

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    // if (e.target.className === "card") {
    //   setTimeout(() => {
    //     e.target.className = "card anotherCardOnTop";
    //   }, 0);
    // }
    setIsOver(true)
    setSlot(e.clientY)
  }

  const dragEndHandler = () => {
    setOnHold(false)
  }

  const dropHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    // store.dispatch(dropCard(boardID));
    //setSlot(null);
  }

  const { handleCardOver, ref, slot } = useCardOver()

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const [isDragging, setIsDragging] = useState(false)

  function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
    // setIsDragging(true);
    //  ;(e.target as HTMLDivElement).className += ' hidden-card'
    setTimeout(() => {
      setOnHold(true)
    }, 0)
    console.log(e.currentTarget.id, e.currentTarget.innerText)

    e.dataTransfer.setData('text', e.currentTarget.id)
    e.dataTransfer.setData('name', e.currentTarget.innerText)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
      }}
    >
      <div
        id={id}
        className={`card ${onHold ? 'hidden-card' : ''}`}
        draggable="true"
        onDragStart={handleDragStart}
        //  onDragOver={handleDragOver}
        //  ref={ref}
        //  onDragEnd={dragEndHandler}
        //  onDrop={dropHandler}
      >
        {isInputCardName ? (
          <input
            ref={inputRef}
            className="input-card-title"
            type="text"
            value={cardName}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={newOnBlur}
            onDragOver={(e) => {
              e.preventDefault()
            }}
          />
        ) : (
          <div
            className="list-card"
            id={id}
            onDrop={(e) => {
              e.preventDefault()
            }}
            onDragOver={(e) => {
              e.preventDefault()
            }}
          >
            <div
              onDragOver={(e) => {
                e.preventDefault()
              }}
              className="card-title"
            >
              {cardName}
            </div>
            <div
              className="icon-edit icon-card-edit"
              onClick={toggleInputCardName}
            ></div>
          </div>
        )}
      </div>

      {isSaveDelete && (
        <>
          {' '}
          <div className="edit-buttons">
            <button className="save-card-edit" onClick={handleSave}>
              Save
            </button>
            <button className="delete-card" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </>
      )}
      <Snackbar open={isErrorValidation}>
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: '100%' }}
        >
          {'Card name ' + cardName + ' is not valid'}
        </Alert>
      </Snackbar>
    </div>
  )
}
