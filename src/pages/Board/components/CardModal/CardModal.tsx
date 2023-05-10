import { useLocation, useNavigate, useParams } from 'react-router-dom'
import './cardModal.scss'
import store, { RootState } from '../../../../store/store'
import { shallowEqual, useSelector } from 'react-redux'
import { BoardType } from '../../../../common/types'
import { useEffect, useRef, useState } from 'react'
import { newNameValidation } from '../../../../common/functions/functions'
import {
  delCard,
  edCardDescription,
  getBoard,
} from '../../../../store/modules/board/actions'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import parse from 'html-react-parser'
import { toggleState } from '../../../../common/functions/functions'
import { CardModalActions } from '../CardModalActions/CardModalActions'
import { getBoards } from '../../../../store/modules/boards/actions'

export const CardModal = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id: board_id, cardId } = useParams() as { id: string; cardId: string }
  const selectBoard = useSelector(
    (state: RootState) => state.board,
    shallowEqual
  )
  // console.log('state.board', selectBoard)

  useEffect(() => {
    store.dispatch(getBoards())
  }, [])

  const [isInputCardTitle, setInputCardTitleVisibity] = useState(false)
  const [isCardDescEditing, setCardDescEditing] = useState(false)
  const [isCardModalActions, setCardModalActions] = useState({
    isOpen: false,
    title: '',
  })
  let [cardTitle, setCardTitle] = useState('')
  let [listTitle, setListTitle] = useState('')
  let [textAreaValue, setTextAreaValue] = useState('')
  let [list_id, setList_id] = useState(0)
  const [isErrorCardValidation, setErrorCardValidationOpen] = useState(false)
  const quillRef = useRef<ReactQuill>(null)

  //
  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.focus()
    }
  }, [isCardDescEditing])

  const getCardData = (board: BoardType, id: number) => {
    // const result = {
    //   listTitle: '',
    //   cardTitle: '',
    //   list_id: '',
    // }

    console.log('getCardData board.lists', board.lists)
    // console.log('board.lists', typeof board.lists[0].id)

    for (let list of board.lists) {
      for (let card of list.cards) {
        if (+card.id! === id) {
          //   console.log('list.id', list.id)
          setList_id(list.id)
          setListTitle(list.title)
          setCardTitle(card.title!)
          if (card.description) setTextAreaValue(card.description)
          //  console.log('listTitle', listTitle, list_id, cardTitle)
        }
      }
    }
  }

  useEffect(() => {
    //  console.log(selectBoard, ' cardModal useEffect', cardId)
    getCardData(selectBoard, +cardId!)
  }, [selectBoard])

  // const toggleInputCardTitle = () => {
  //   setInputCardTitleVisibity(!isInputCardTitle)
  // }

  // const toggleCardDescEditing = () => {
  //   setCardDescEditing(!isCardDescEditing)
  // }

  const handleChangeCardTitle = (ev: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleChangeCardTitle', ev.target.value)
    setCardTitle(ev.target.value)
  }

  // const handleChangeTextarea = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setTextAreaValue(ev.target.value)
  //   ev.target.style.height = 'auto'
  //   ev.target.style.height = `${ev.target.scrollHeight}px`
  // }

  // const handleChangeQuill = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const newValue = ev.target.value
  //   setTextAreaValue(newValue)
  // }

  const handleKeyDownTextarea = (
    ev: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (ev.key === 'Enter') {
      console.log('Enter')
      toggleState(setCardDescEditing)
      // toggleCardDescEditing()
      store.dispatch(
        edCardDescription(board_id, list_id, cardId!, cardTitle, textAreaValue)
      )
    }
  }

  const handleKeyDownCardTitle = (
    ev: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (ev.key === 'Enter') {
      if (newNameValidation(cardTitle)) {
        setCardTitle(cardTitle)
        setInputCardTitleVisibity(false)
        store.dispatch(edCardDescription(board_id, list_id, cardId!, cardTitle))
        // store.dispatch(getBoard(board_id))
      } else {
        setErrorCardValidationOpen(false)
      }
    }
  }

  const handleBlurCardTitle = () => {
    if (newNameValidation(cardTitle)) {
      setInputCardTitleVisibity(false)
      store.dispatch(edCardDescription(board_id, list_id, cardId!, cardTitle))
    } else {
      setErrorCardValidationOpen(false)
    }
  }

  const handleBlurTextarea = (ev: React.FocusEvent<HTMLDivElement>) => {
    // console.log('ev.target', ev.target)
    // console.log('ev blur', ev)
    // console.log('ev.target.tagName', ev.target.tagName)
    if (ev.target.tagName !== 'INPUT' && ev.target.tagName !== 'BUTTON') {
      toggleState(setCardDescEditing)
    }
  }

  const handleEscapeKeyPress = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Escape') {
      setInputCardTitleVisibity(false)
      setCardDescEditing(false)
    }
  }

  return (
    <div className="modalDiv">
      <div className="my-component modal" onKeyDown={handleEscapeKeyPress}>
        {isInputCardTitle ? (
          <input
            className="input-card-title"
            type="text"
            value={cardTitle}
            onChange={handleChangeCardTitle}
            onKeyDown={handleKeyDownCardTitle}
            onBlur={handleBlurCardTitle}
            autoFocus
          />
        ) : (
          <h1
            onClick={() => {
              toggleState(setInputCardTitleVisibity)
            }}
          >
            {cardTitle} :{cardId}
          </h1>
        )}
        <button
          className="close-button"
          onClick={() => {
            console.log('location.pathname', location.pathname)
            navigate('/board/' + location.pathname.split('/')[2])
          }}
        ></button>
        <div>
          <h2>
            List: {listTitle}
            {/* :{list_id} */}
          </h2>
          <div className="main-content">
            <div className="left-content">
              <h3>Users</h3>
              <div className="participants">
                <div className="avatars">
                  <div className="avatar">
                    <span>A</span>
                  </div>
                  <div className="avatar">
                    <span>B</span>
                  </div>
                  <div className="avatar">
                    <span>C</span>
                  </div>
                  <div className="add-participant">
                    <span>+</span>
                  </div>
                </div>
                <button className="join-button">Join</button>
              </div>
              <div className="description">
                <h3>Description</h3>
                <button
                  onClick={() => {
                    toggleState(setCardDescEditing)
                  }}
                >
                  Edit
                </button>
                {isCardDescEditing ? <button>Save</button> : ''}
              </div>
              <div className="card-description">
                {isCardDescEditing ? (
                  <>
                    {/* <textarea
                      className="textarea-card-edit"
                      value={textAreaValue}
                      onChange={handleChangeTextarea}
                      onKeyDown={handleKeyDownTextarea}
                      onBlur={handleBlurTextarea}
                      autoFocus
                    /> */}

                    <div onBlur={handleBlurTextarea}>
                      <ReactQuill
                        theme="snow"
                        value={textAreaValue}
                        placeholder={'Content goes here...'}
                        onChange={(value) => {
                          setTextAreaValue(value)
                        }}
                        onKeyDown={handleKeyDownTextarea}
                        ref={quillRef}
                      />
                    </div>
                  </>
                ) : (
                  <div onClick={() => toggleState(setCardDescEditing)}>
                    {' '}
                    {parse(textAreaValue)}
                  </div>
                )}
              </div>
            </div>
            <div className="right-content">
              <h3>Actions</h3>
              <button
                onClick={() =>
                  setCardModalActions(() => ({
                    isOpen: true,
                    title: 'Copy',
                  }))
                }
              >
                Copy
              </button>
              <button
                onClick={() =>
                  setCardModalActions(() => ({
                    isOpen: true,
                    title: 'Move',
                  }))
                }
              >
                Move
              </button>
              <button
                className="red-button"
                onClick={() => {
                  store.dispatch(delCard(board_id, cardId))
                  navigate('/board/' + board_id)
                }}
              >
                Archive
              </button>
            </div>
          </div>
        </div>
        {isCardModalActions.isOpen && (
          <CardModalActions
            title={isCardModalActions.title}
            cardTitle={cardTitle}
            onClose={() => setCardModalActions({ isOpen: false, title: '' })}
          />
        )}
      </div>
    </div>
  )
}
