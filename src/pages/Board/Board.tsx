import React, { SetStateAction, useEffect, useState } from 'react'
import {
  Link,
  useParams,
  useLocation,
  Outlet,
  useNavigate,
} from 'react-router-dom'
import { List } from './components/List/List'
import 'simplebar-react/dist/simplebar.min.css'
import './board.scss'
import {
  createList,
  editBoardTitle,
  getBoard,
} from '../../store/modules/board/actions'
import { shallowEqual, useSelector } from 'react-redux'
import store from '../../store/store'
import instance from '../../api/request'
import { RootState } from '../../store/store'
import { newNameValidation } from '../../common/functions/functions'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import { Alert, Snackbar } from '@mui/material'
import { BoardType, ListType } from '../../common/types'
import { clearError } from '../../store/modules/errorHandlers/actions'
import { AddInput } from './AddInput'
import { signOut } from '../../store/modules/user/actions'

export const Board = () => {
  let boardId = useParams().id as string

  const location = useLocation()
  const navigate = useNavigate()
  const selectError = useSelector(
    (state: RootState) => state.error,
    shallowEqual,
  )

  const [boardName, setBoardName] = useState('')
  const [lists, setLists] = useState<ListType[]>([])

  const [isInputBoardName, setInputBoardNameVisibity] = useState(false)
  const [isInputListName, setInputListNameVisibity] = useState(false)
  const [isErrorValidation, setErrorValidationOpen] = useState(false)
  const [isErrorListValidation, setErrorListValidationOpen] = useState(false)
  const [errorText, setErrorText] = useState('Error: ' + selectError.errorText)
  const [cards, setCards] = useState([])

  function handleSetCards(newCards: any) {
    setCards(newCards)
  }

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setBoardName(ev.target.value)
  }

  const toggleInputBoardName = () => {
    setInputBoardNameVisibity(!isInputBoardName)
  }

  const handleSnackbarClose = () => {
    store.dispatch(clearError())
    setErrorValidationOpen(false)
    setErrorListValidationOpen(false)
    fetchData()
    setInputBoardNameVisibity(false)
    setInputListNameVisibity(false)
  }

  const listsSelector: ListType[] = useSelector(
    (state: RootState) => state.board.lists,
    shallowEqual,
  )

  const selectLoadingState = useSelector((state: RootState) => state.loading)

  async function fetchData() {
    const response: BoardType = await instance.get('/board/' + boardId)
    setBoardName(response.title)
    setLists(response.lists)
  }

  useEffect(() => {
    fetchData()
    store.dispatch(getBoard(boardId))
  }, [])

  useEffect(() => {
    fetchData()
  }, [listsSelector])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (newNameValidation(boardName)) {
        setBoardName(boardName)
        setInputBoardNameVisibity(false)
        store.dispatch(editBoardTitle(boardName, boardId))
      } else {
        setErrorValidationOpen(false)
      }
    }
  }

  const handleSave = (listName: string) => {
    if (!newNameValidation(listName)) {
      setErrorListValidationOpen(true)
      return
    }
    store.dispatch(createList(listName, boardId))
    store.dispatch(getBoard(boardId))
  }

  const handleBlur = () => {
    if (newNameValidation(boardName)) {
      store.dispatch(editBoardTitle(boardName, boardId))
    }
  }

  const showSnackbar =
    selectError.isError || isErrorValidation || isErrorListValidation

  useEffect(() => {
    if (selectError.isError) {
      setErrorText('Error: ' + selectError.errorText)
    }
  }, [selectError.isError])

  return (
    <div className={`${location.pathname !== '/' ? 'boards' : ''}`}>
      <div className="header-container">
        <Link className="" to="/">
          Main
        </Link>
        <Link
          className="sign-out"
          to="/"
          onClick={() => {
            store.dispatch(signOut())
            navigate('/login')
          }}
        >
          Sign out
        </Link>
      </div>

      <div className="board-header">
        <div>
          {isInputBoardName ? (
            <input
              className="input-board-title"
              type="text"
              value={boardName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              autoFocus
            />
          ) : (
            <h1 className="board-h1" onClick={toggleInputBoardName}>
              {boardName}
            </h1>
          )}
        </div>
      </div>

      <div className="board-content">
        {lists.map((list: ListType) => (
          <List
            key={list.id}
            id={list.id}
            title={list.title}
            position={list.position}
            cards={list.cards}
            setCards={handleSetCards}
          />
        ))}

        <div className="list">
          <AddInput handleSave={handleSave} defaultValue={''} source={'list'} />
        </div>
      </div>
      <Snackbar open={showSnackbar} message={errorText}>
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorText}
        </Alert>
      </Snackbar>

      <Snackbar open={isErrorValidation}>
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: '100%' }}
        >
          {'Board name ' + boardName + ' is not valid'}
        </Alert>
      </Snackbar>
      {selectLoadingState.loading && <ProgressBar />}
      <Outlet />
    </div>
  )
}
