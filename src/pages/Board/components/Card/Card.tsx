import { Alert, Snackbar } from '@mui/material'
import { useCallback, useState } from 'react'
import { newNameValidation } from '../../../../common/functions/functions'
import { CardType } from '../../../../common/types'
import { edCard, delCard } from '../../../../store/modules/board/actions'
import store from '../../../../store/store'
import { AddInput } from '../../AddInput'
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

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.style.display = 'none'
    event.dataTransfer.setData('text', event.currentTarget.id)
    event.dataTransfer.setDragImage(event.currentTarget, 0, 0)
    event.currentTarget.style.width = '100px'
  }

  return (
    <div>
      <div
        id={id}
        className="card"
        draggable="true"
        onDragStart={handleDragStart}
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
          />
        ) : (
          <div className="list-card" id={id}>
            <div className="card-title">{cardName}</div>
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
