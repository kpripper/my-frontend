import React, { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
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

export const Board = () => {
  let boardId = useParams().id as string

  const selectError = useSelector(
    (state: RootState) => state.error,
    shallowEqual
  )

  const backGroundStyles = useBackgroundColor()
  const [boardName, setBoardName] = useState('')
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
    setInputListNameVisibity((prev) => !prev)
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
      if (!newNameValidation((ev.target as HTMLInputElement).value)) {
        setErrorText(
          'List name ' + (ev.target as HTMLInputElement).value + ' is not valid'
        )
        setErrorListValidationOpen(true)
      }
      setInputListNameVisibity(false)
      store.dispatch(createList((ev.target as HTMLInputElement).value, boardId))
      // store.dispatch(getBoard(boardId))
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

  const handleSave = (listName: string) => {
    // console.log('handleSave', listName)

    if (!newNameValidation(listName)) {
      setErrorListValidationOpen(true)
      return
    }

    store.dispatch(createList(listName, boardId))
    store.dispatch(getBoard(boardId))
  }

  // const handleBlurNew = () => {
  //   if (newNameValidation(boardName)) {
  //     setBoardName(boardName)
  //     setInputBoardNameVisibity(false)
  //     store.dispatch(editBoardTitle(boardName, boardId))
  //   } else {
  //     setErrorValidationOpen(true)
  //   }
  // }

  const handleBlur = () => {
    if (newNameValidation(boardName)) {
      store.dispatch(editBoardTitle(boardName, boardId))
    }
  }

  // const handleListBlur = () => {
  //   if (newNameValidation(listName)) {
  //     setListName(listName)
  //     setInputListNameVisibity(false)
  //     store.dispatch(createList(listName, boardId))
  //     store.dispatch(getBoard(boardId))
  //   } else {
  //     setErrorListValidationOpen(true)
  //   }
  // }

  const showSnackbar =
    selectError.isError || isErrorValidation || isErrorListValidation

  useEffect(() => {
    if (selectError.isError) {
      setErrorText('Error: ' + selectError.errorText)
    }
  }, [selectError.isError])

  // Get all elements with the class "drag"
  const draggableElements = document.getElementsByClassName(
    'list-card'
  ) as HTMLCollectionOf<HTMLElement>

  // Attach the dragstart event to each element
  for (let i = 0; i < draggableElements.length; i++) {
    draggableElements[i].addEventListener('dragstart', (event: DragEvent) => {
      // Create a clone of the element
      const clone = (event.target as HTMLElement).cloneNode(true) as HTMLElement
      // Add the clone to the body
      document.body.appendChild(clone)
      clone.style.opacity = '1.0 !important'
      clone.style.width = '100px'
      console.log('clone', clone.style)
      event.dataTransfer!.setDragImage(clone, 0, 0)
    })
  }

  // let draggedItem = null

  // function dragDrop() {
  //   const listsItems = listsSelector
  //   const listsItemsJS = document.querySelectorAll('.list')
  //   const cardItems = document.querySelectorAll('.list-card')

  //   for (let i = 0; i < cardItems.length; i++) {
  //     // let draggedItem
  //     const item = cardItems[i]

  //     item.addEventListener('dragstart', (e) => {
  //       // (e.currentTarget as HTMLDivElement | HTMLLIElement).style.pointerEvents = "none";
  //       const clone = (e.target as HTMLElement).cloneNode(true) as HTMLElement
  //       document.body.appendChild(clone)
  //       clone.style.opacity = "1.0";
  //       draggedItem = item
  //       ;(e.currentTarget as HTMLLIElement).style.opacity = '1'
  //       console.log('item', item)
  //     })
  //   }
  // }

  // dragDrop()

  return (
    <div
      style={backGroundStyles}
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
          {listsSelector.map((list: ListType) => (
            <List {...list} />
          ))}

          <div className="list">
            <AddInput
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
      </SimpleBar>
      {selectLoadingState.loading && <ProgressBar />}
    </div>
  )
}
