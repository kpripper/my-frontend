import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  addCard,
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

  return (
    <div key={props.title} className="list" >
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

      {props.cards.map((card: CardType, index) => (
        <Card {...card} boardId={boardId} listId={props.id} />
      ))}

      <AddInput handleSave={handleSave} defaultValue={''} source={'card'} />

      {listActionsShown && (
        <div className="list-actions">
          <div className="list-actions-header">
            <h2 className="list-actions-title">List Actions</h2>
            <div className="icon-close-list icon-close" onClick={showListActions}></div>
          </div>
          <div className="list-list-actions">
            <ul>
              <li >
                <button   onClick={(e) => {
                  store.dispatch(deleteList(boardId, props.id))
                  showListActions()
                }} className="invisible-button">Delete list</button>
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
