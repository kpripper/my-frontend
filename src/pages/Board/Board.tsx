import React, { useEffect, useState } from 'react'
import { Link, useParams, useLocation, Outlet } from 'react-router-dom'
import { List } from './components/List/List'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import './board.scss'
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
import { clearError } from '../../store/modules/errorHandlers/actions'
import { useBackgroundColor } from './useBackgroundColor'
import { InputName } from '../../common/InputName'
import { AddInput } from './AddInput'
import { dragNdrop } from '../../common/dragNdrop'

export const Board = () => {
  let boardId = useParams().id as string

  const location = useLocation()

  const selectError = useSelector(
    (state: RootState) => state.error,
    shallowEqual
  )

  const backGroundStyles = useBackgroundColor()
  const [boardName, setBoardName] = useState('')
  // const [listName, setListName] = useState('')
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

  // const handleListChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
  //   setListName(ev.target.value)
  // }

  const toggleInputBoardName = () => {
    setInputBoardNameVisibity(!isInputBoardName)
  }

  // const toggleInputListName = () => {
  //   setInputListNameVisibity((prev) => !prev)
  // }

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
    shallowEqual
  )

  const selectLoadingState = useSelector((state: RootState) => state.loading)

  async function fetchData() {
    const response: any = await instance.get('/board/' + boardId)
    setBoardName(response.title)
  }

  useEffect(() => {
    fetchData()
    store.dispatch(getBoard(boardId))
    console.log('listsSelector', listsSelector)
  }, [])

  // const addListOnEnter = (ev: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (ev.key === 'Enter') {
  //     if (!newNameValidation((ev.target as HTMLInputElement).value)) {
  //       setErrorText(
  //         'List name ' + (ev.target as HTMLInputElement).value + ' is not valid'
  //       )
  //       setErrorListValidationOpen(true)
  //     }
  //     setInputListNameVisibity(false)
  //     store.dispatch(createList((ev.target as HTMLInputElement).value, boardId))
  //     // store.dispatch(getBoard(boardId))
  //   }
  // }

  // const addListOnButton = (ev: React.MouseEvent<HTMLButtonElement>) => {
  //   const elemInpListTitle = document.querySelector(
  //     '.input-list-title'
  //   ) as HTMLInputElement
  //   if (newNameValidation(elemInpListTitle.value)) {
  //     setInputListNameVisibity(false)
  //     store.dispatch(createList(elemInpListTitle.value, boardId))
  //     store.dispatch(getBoard(boardId))
  //   } else {
  //     setErrorText('List name ' + elemInpListTitle.value + ' is not valid')
  //     setErrorListValidationOpen(true)
  //   }
  // }

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
    // console.log('handleSave', listName)

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
    <div
      style={backGroundStyles}
      className={`${location.pathname !== '/' ? 'boards' : ''}`}
      // onDrag={(e) => console.log('dragging', e.currentTarget)}
      // onDragOver={(e:React.DragEvent)=>console.log('onDragOver board target', e.target )}
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

      {/* <SimpleBar className="simplebar" direction="rtl" autoHide={false}>  */}
      <div className="board-content">
        {listsSelector.map((list: ListType) => (
          <List key={list.id} {...list} setCards={handleSetCards} />
        ))}

        <div className="list">
          <AddInput
            // onDragOver={()=>{}}
            // onDragLeave={()=>{}}
            handleSave={handleSave}
            defaultValue={''}
            source={'list'}
          />
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

      {/* </SimpleBar>  */}
      {selectLoadingState.loading && <ProgressBar />}
      <Outlet />
    </div>
  )
}
