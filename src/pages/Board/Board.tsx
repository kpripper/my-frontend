import React, { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { List } from './components/List/List'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import './board.scss'
import '../../index.css'
import {
  createList,
  editBoardTitle,
  getBoard,
} from '../../store/modules/board/actions'
import { shallowEqual, useSelector } from 'react-redux'
import { connect } from 'react-redux'
import store from '../../store/store'
import instance from '../../api/request'
import { RootState } from '../../store/store'
import { newNameValidation } from '../../common/functions/functions'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import { Alert, Snackbar } from '@mui/material'
import { BoardProps, BoardResponse, ListType } from '../../common/types'
import {} from '@mui/material'
import { clearError } from '../../store/modules/errorHandlers/actions'

const BoardComponent = (props: BoardProps) => {
  let boardId = useParams().id as string

  const selectError = useSelector(
    (state: RootState) => state.error,
    shallowEqual
  )

  const direction = Math.round(Math.random() * 360)
  const hue = Math.random() * (192 - 212) + 212;
  const randomAlpha = Math.random() * (0.6 - 0.4) + 0.8

  const style = {
    background: `linear-gradient(${direction}deg, hsla(192, 98%, 33%,${randomAlpha}), hsla(${
      hue 
    }, 50%, 50%,${randomAlpha}))`,
  }
  const [boardName, setBoardName] = useState('')
  const [color, setColor] = useState(style)
  const [listName, setListName] = useState('')
  const [isInputBoardName, setInputBoardNameVisibity] = useState(false)
  const [isInputListName, setInputListNameVisibity] = useState(false)
  const [isErrorValidation, setErrorValidationOpen] = useState(false)
  const [isErrorListValidation, setErrorListValidationOpen] = useState(false)
  const [errorText, setErrorText] = useState('Error: ' + selectError.errorText)

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setBoardName(ev.target.value)
  }

  const handleListChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setListName(ev.target.value)
  }

  const toggleInputBoardName = () => {
    setInputBoardNameVisibity(!isInputBoardName)
  }

  const toggleInputListName = () => {
    setInputListNameVisibity((prev) => (!prev))
  }

  const handleSnackbarClose = () => {
    store.dispatch(clearError())
    setErrorValidationOpen(false)
    setErrorListValidationOpen(false)
    fetchData()
    setInputBoardNameVisibity(false)
    setInputListNameVisibity(false)
  }

  const listsSelector = useSelector(
    (state: RootState) => state.board.lists,
    shallowEqual
  )

  const selectLoadingState = useSelector((state: RootState) => state.loading)

  async function fetchData() {
    const response: BoardResponse = await instance.get('/board/' + boardId)
    setBoardName(response.title)
  }

  let location = useLocation()

  useEffect(() => {
    fetchData()
    store.dispatch(getBoard(boardId))
  }, [])

  const addListOnEnter = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      if (newNameValidation((ev.target as HTMLInputElement).value)) {
        setInputListNameVisibity(false)
        store.dispatch(
          createList((ev.target as HTMLInputElement).value, boardId)
        )
        store.dispatch(getBoard(boardId))
      } else {
        setErrorText(
          'List name ' + (ev.target as HTMLInputElement).value + ' is not valid'
        )
        setErrorListValidationOpen(true)
      }
    }
  }

  const addListOnButton = (ev: React.MouseEvent<HTMLButtonElement>) => {
    const elemInpListTitle = document.querySelector(
      '.input-list-title'
    ) as HTMLInputElement
    if (newNameValidation(elemInpListTitle.value)) {
      setInputListNameVisibity(false)
      store.dispatch(createList(elemInpListTitle.value, boardId))
      store.dispatch(getBoard(boardId))
    } else {
      setErrorText('List name ' + elemInpListTitle.value + ' is not valid')
      setErrorListValidationOpen(true)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (newNameValidation(boardName)) {
        setBoardName(boardName)
        setInputBoardNameVisibity(false)
        store.dispatch(editBoardTitle(boardName, boardId))
      } else {
        setErrorValidationOpen(true)
      }
    }
  }

  const handleBlur = () => {  
      if (newNameValidation(boardName)) {
        setBoardName(boardName)
        setInputBoardNameVisibity(false)
        store.dispatch(editBoardTitle(boardName, boardId))
      } else {
        setErrorValidationOpen(true)
      }
  }

  const handleListBlur = () => {
    if (newNameValidation(listName)) {
      setListName(listName)
      setInputListNameVisibity(false)
      store.dispatch(createList(listName, boardId))
      store.dispatch(getBoard(boardId))
    } else {
      setErrorListValidationOpen(true)
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
    <div
      style={color}
      className={`${location.pathname !== '/' ? 'boards' : ''}`}
    >
      <div className="header-container">
        <Link className="" to="/">
          Main
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

      <SimpleBar className="simplebar" direction="rtl" autoHide={false}>
        <div className="board-content">
          {listsSelector.map((list: ListType, index: string) => (
            <List {...list} />
          ))}
          <div className="list">
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
                    <button
                      className="list-add-button"
                      onClick={addListOnButton}
                    >
                      Add list
                    </button>
                    <span
                      onClick={toggleInputListName}
                      className="icon-close icon-close-addlist"
                    ></span>
                  </div>
                </>
              ) : (
                <div className="open-add-list" onClick={toggleInputListName}>
                  <span className="icon-plus"></span>
                  <span className="add-list-span">Add new list</span>
                </div>
              )}
            </div>
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
      </SimpleBar>
      {selectLoadingState.loading && <ProgressBar />}
    </div>
  )
}

const mapStateToProps = (state: any) => {
  const { title: boardTitle, lists: boardLists } = state
  return { boardTitle, boardLists }
}

export const Board = connect(mapStateToProps, { getBoard })(BoardComponent)
