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
      // input.scrollIntoView({
      //   behavior: 'smooth',
      // })
      // input.scrollTop = 250

      var headerOffset = 45
      var elementPosition = input.getBoundingClientRect().top
      var offsetPosition = elementPosition + window.pageYOffset - headerOffset

      console.log('offsetPosition', offsetPosition)

      // window.scrollTo({
      //   top: offsetPosition,
      //   behavior: 'smooth',
      // })
    }
  }, [])

  const [isSaveDelete, setIsSaveDelete] = useState(false)
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
    setIsSaveDelete(!isSaveDelete)
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
        setIsSaveDelete(false)
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
    blurTimer = setTimeout(handleBlur, 1000)
  }

  const handleSave = () => {
    clearTimeout(blurTimer!)
    store.dispatch(edCard(boardId, listId, id, cardName!))
    setInputCardNameVisibity(false)
    setIsSaveDelete(false)
  }

  const handleDelete = () => {
    console.log('card handleDelete')
    clearTimeout(blurTimer!)
    store.dispatch(delCard(boardId, id))
    setInputCardNameVisibity(false)
    setIsSaveDelete(false)
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

  const handleDragOverCard = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault()
    // console.log(`handleDragOverCard`, index)
    // без таймаута не показуэться перетягувана картка
    setTimeout(() => {
      props.setSlotPosition!(e, props.index)
    }, 0)
  }

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('card enter, index', props.index)

    console.log('onDragEnter list', props.index)
    ;(e.target as HTMLDivElement).classList.add('green-bg')
    ;(e.target as HTMLDivElement).classList.remove('red-bg')

    props.setSlotPosition!(e, props.index)
    // setShowSlot(true)
    // console.log(`onDragEnter list slotIndex`, slotIndex)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
      }}
    >
      <div
      // id={id}
      // data-index={props.index}
      // className={`card ${onHold ? 'hidden-card' : ''}`}
      // draggable="true"
      // onDragStart={(e) => {
      //   props.handleDragStart!(e, props.index)
      //   setTimeout(() => {
      //     setOnHold(true)
      //   }, 0)
      // }}
      // onDragOver={(e) => handleDragOverCard(e, props.index)}

      //   onDragOver={(e) => props.setSlotPosition! (e, props.index)}
      // onDragEnter={onDragEnter}
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
            // onDragOver={(e) => {
            //   e.preventDefault()
            // }}
          />
        ) : (
          <div
            {...props}
            // index={props.index}
            // className="list-card"
            id={id}
            data-index={props.position}
            className={`list-card card ${onHold ? 'hidden-card' : ''}`}
            // className={`list-card card`}
            draggable="true"
            onDragStart={(e) => {
              props.handleDragStart!(e, props.index)
              setTimeout(() => {
                setOnHold(true)
              }, 0)
            }}
            onDragEnd={() => {
              //TODO ховати слот коли закінчився драг в межах листа без дропа, коли слот ще видно
              console.log('dragend card')
              // props.handleDragEnd!()
              setOnHold(false)
            }}
            onDragOver={(e) => handleDragOverCard(e, props.index)}

            // onDragStart={() => {
            //   return false
            // }}

            // onDrop={(e) => {
            //   e.preventDefault()
            // }}
            // onDragOver={(e) => {
            //   e.preventDefault()
            // }}
          >
            ind {props.index} pos {props.position} name {cardName}
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
