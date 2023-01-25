import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { createList, getBoard } from '../store/modules/board/actions'
import store, { RootState } from '../store/store'
import { newNameValidation } from './functions/functions'

export const InputName = () => {
  let boardId = useParams().id as string

  const selectError = useSelector(
    (state: RootState) => state.error,
    shallowEqual
  )

  const [isInputListName, setInputListNameVisibity] = useState(false)
  const [listName, setListName] = useState('')
  const [isErrorListValidation, setErrorListValidationOpen] = useState(false)
  const [errorText, setErrorText] = useState('Error: ' + selectError.errorText)

  const handleListChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setListName(ev.target.value)
  }

  const addListOnEnter = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      if (!newNameValidation((ev.target as HTMLInputElement).value)) {
        setErrorText(
          'List name ' + (ev.target as HTMLInputElement).value + ' is not valid'
        )
        setErrorListValidationOpen(true)
        return
      }      
        setInputListNameVisibity(false)
        store.dispatch(
          createList((ev.target as HTMLInputElement).value, boardId)
        )
        // store.dispatch(getBoard(boardId))
    }
  }

  const handleListBlur = () => {
    if (!newNameValidation(listName)) {
      setErrorListValidationOpen(true)
      return
    } 
      setListName(listName)
      setInputListNameVisibity(false)
      store.dispatch(createList(listName, boardId))
      store.dispatch(getBoard(boardId))
  }

  const addListOnButton = (ev: React.MouseEvent<HTMLButtonElement>) => {
    if (!newNameValidation(listName)) {
      setErrorText('List name ' + listName + ' is not valid')
      setErrorListValidationOpen(true)
      return
    }     
      setInputListNameVisibity(false)
      store.dispatch(createList(listName, boardId))
      store.dispatch(getBoard(boardId))
  }

  const toggleInputListName = () => {
    setInputListNameVisibity((prev) => !prev)
  }

  return (
    <div>
      {isInputListName ? (
        <>
          <input
            className="input-list-title"
            type="text"
            value={listName}
            onChange={handleListChange}
            onKeyDown={addListOnEnter}
            onBlur={handleListBlur}
            autoFocus
          />
          <div className="add-list-controls">
            <button className="list-add-button" onClick={addListOnButton}>
              Add list
            </button>
            <button
              onClick={toggleInputListName}
              className="icon-close icon-close-addlist"
            ></button>
          </div>
        </>
      ) : (
        <div className="open-add-list" onClick={toggleInputListName}>
          <AddIcon />
          <span className="add-list-span">Add new list</span>
        </div>
      )}
    </div>
  )
}
