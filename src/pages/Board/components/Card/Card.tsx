import { Alert, Snackbar } from '@mui/material'
import { DetailedHTMLProps, HTMLAttributes, useCallback, useState } from 'react'
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
    }
  }, [])

  const [isSaveDelete, setIsSaveDelete] = useState(false)
  const [cardName, setCardName] = useState(props.title)
  const [initCardName, setInitCardName] = useState('')
  const [isInputCardName, setInputCardNameVisibity] = useState(false)
  const [isErrorValidation, setErrorValidationOpen] = useState(false)
  const [onHold, setOnHold] = useState(false)
  const [onOver, setOnOver] = useState(false)
  const [draggedCard, setDraggedCard] = useState(false)

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
    listId: string
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // console.log('handleKeyDown', cardName)

    if (event.key === 'Enter') {
      if (newNameValidation(cardName!)) {
        setCardName(cardName)
        setInputCardNameVisibity(false)
        setIsSaveDelete(false)
        store.dispatch(edCard(boardid!, listId, props.id!, cardName!))
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

  const handleSave = () => {
    clearTimeout(blurTimer!)
    store.dispatch(edCard(boardid, listId, id, cardName!))
    setInputCardNameVisibity(false)
    setIsSaveDelete(false)
  }

  const handleDelete = () => {
    console.log('card handleDelete')
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
    // console.log(`handleDragOverCard`, index)\
    // без таймаута не показуэться перетягувана картка
    setTimeout(() => {
      console.log('call setSlotPosition', +props.position - 1)
      props.setSlotPosition!(e, +props.position - 1)
    }, 0)
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
            onKeyDown={handleKeyDown}
            onBlur={newOnBlur}
          />
        ) : (
          <div
            id={id}
            data-index={props.position}
            className={`list-card card
             ${onHold ? 'hidden-card' : ''}`}
            
            onDragStart={(e) => {
              props.handleDragStart!(e, +props.position)
              setTimeout(() => {
                setOnHold(true)
              }, 0)
            }}
            onDragEnd={(e) => {
               setOnHold(false)
              // props.handleDragEnd!(e)
            }}
            onDragOver={(e) => {
                    handleDragOverCard(e, props.index)
            }}
          >
            <div className="self-card" draggable="true">
              {/* ind {props.index} pos {props.position} name  */}
              {props.id!} pos {props.position}
              <div
                className="icon-edit icon-card-edit"
                onClick={toggleInputCardName}
              ></div>
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
