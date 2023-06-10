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
    shallowEqual,
  )

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
  let [cardPosition, setCardPosition] = useState('')
  let [listTitle, setListTitle] = useState('')
  let [textAreaValue, setTextAreaValue] = useState('')
  let [list_id, setList_id] = useState(0)
  const [isErrorCardValidation, setErrorCardValidationOpen] = useState(false)
  const quillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.focus()
    }
  }, [isCardDescEditing])

  const getCardData = (board: BoardType, cardId: number) => {
    for (let list of board.lists) {
      for (let card of list.cards) {
        if (+card.id! === cardId) {
          setList_id(list.id)
          setListTitle(list.title)
          setCardTitle(card.title!)
          setCardPosition(card.position)
          if (card.description) setTextAreaValue(card.description)
        }
      }
    }
  }

  useEffect(() => {
    getCardData(selectBoard, +cardId!)
  }, [selectBoard])

  const handleChangeCardTitle = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setCardTitle(ev.target.value)
  }

  const handleKeyDownTextarea = (
    ev: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (ev.key === 'Enter') {
      toggleState(setCardDescEditing)
      store.dispatch(
        edCardDescription(board_id, list_id, cardId!, cardTitle, textAreaValue),
      )
    }
  }

  const handleKeyDownCardTitle = (
    ev: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (ev.key === 'Enter') {
      if (newNameValidation(cardTitle)) {
        setCardTitle(cardTitle)
        setInputCardTitleVisibity(false)
        store.dispatch(edCardDescription(board_id, list_id, cardId!, cardTitle))
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
    if (!quillRef.current || !quillRef.current.contains(ev.relatedTarget)) {
      saveCardDescription(textAreaValue)
      toggleState(setCardDescEditing)
    }
  }

  const handleEscapeKeyPress = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Escape') {
      saveCardDescription(textAreaValue)
      setInputCardTitleVisibity(false)
      setCardDescEditing(false)
    }
  }

  const saveCardDescription = (textAreaValue: string) => {
    store.dispatch(
      edCardDescription(board_id, list_id, cardId!, cardTitle, textAreaValue),
    )
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
            {cardTitle}
          </h1>
        )}
        <button
          className="close-button"
          onClick={() => {
            navigate('/board/' + location.pathname.split('/')[2])
          }}
        ></button>
        <div>
          <h2>In list: {listTitle}</h2>
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
                {isCardDescEditing ? (
                  <button
                    onClick={() => {
                      saveCardDescription(textAreaValue)
                    }}
                  >
                    Save
                  </button>
                ) : (
                  ''
                )}
              </div>
              <div className="card-description">
                {isCardDescEditing ? (
                  <>
                    <div
                      className="quill-container"
                      ref={quillRef}
                      onBlur={handleBlurTextarea}
                    >
                      <ReactQuill
                        theme="snow"
                        value={textAreaValue}
                        placeholder={'Content goes here...'}
                        onChange={value => {
                          setTextAreaValue(value)
                        }}
                        onKeyDown={handleKeyDownTextarea}
                      />
                    </div>
                  </>
                ) : (
                  <div onClick={() => toggleState(setCardDescEditing)}>
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
            cardDescription={textAreaValue}
            cardId={cardId}
            position={cardPosition}
            onClose={() => setCardModalActions({ isOpen: false, title: '' })}
          />
        )}
      </div>
    </div>
  )
}
