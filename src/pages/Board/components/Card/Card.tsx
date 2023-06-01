import { Alert, Snackbar } from '@mui/material'
import { useCallback, useState } from 'react'
import { newNameValidation } from '../../../../common/functions/functions'
import { CardType } from '../../../../common/types'
import {
  edCardDescription,
  delCard,
} from '../../../../store/modules/board/actions'
import store from '../../../../store/store'
import './card.scss'

export const Card = (props: CardType) => {
  const inputRef = useCallback((input: HTMLInputElement) => {
    if (input) {
      input.focus()
      input.select()
    }
  }, [])

  const [isSaveDelete, setIsSaveDelete] = useState(false)
  const [cardName, setCardName] = useState('')
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
    setIsSaveDelete(!isSaveDelete)
  }

  const { id, boardid, listId } = props as {
    id: string
    boardid: string
    listId: number
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (newNameValidation(cardName!)) {
        setCardName(cardName)
        setInputCardNameVisibity(false)
        setIsSaveDelete(false)
        store.dispatch(
          edCardDescription(boardid!, listId, props.id!, cardName!)
        )
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
    blurTimer = setTimeout(handleBlur, 1000)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    clearTimeout(blurTimer!)
    store.dispatch(edCardDescription(boardid, listId, id, cardName!))
    setInputCardNameVisibity(false)
    setIsSaveDelete(false)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    clearTimeout(blurTimer!)
    store.dispatch(delCard(boardid, id))
    setInputCardNameVisibity(false)
    setIsSaveDelete(false)
  }

  const handleSnackbarClose = () => {
    setErrorValidationOpen(false)
    toggleInputCardName()
  }

  const handleDragOverCard = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault()
    setTimeout(() => {
      props.setSlotPosition!(e, +props.position - 1)
    }, 0)
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
      }}
    >
      <div>
        {isInputCardName ? (
          <input
            ref={inputRef}
            className="input-card-title"
            type="text"
            value={cardName}
            onChange={handleChange}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onBlur={newOnBlur}
          />
        ) : (
          <div
            id={id}
            data-index={props.position}
            className={`list-card card ${onHold ? 'hidden-card' : ''}`}
            onDragStart={(e) => {
              props.handleDragStart!(e, +props.position)
              setTimeout(() => {
                setOnHold(true)
              }, 0)
            }}
            onDragEnd={(e) => {
              setOnHold(false)
              props.handleDragEnd!(e)
            }}
            onDragOver={(e) => {
              handleDragOverCard(e, props.index)
            }}
          >
            <div className="self-card" draggable="true">
              {props.title}
              <p
                className="icon-edit icon-card-edit"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleInputCardName()
                }}
              ></p>
            </div>
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
