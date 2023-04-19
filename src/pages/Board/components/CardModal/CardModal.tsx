import { useLocation, useNavigate, useParams } from 'react-router-dom'
import './cardModal.scss'
import store, { RootState } from '../../../../store/store'
import { shallowEqual, useSelector } from 'react-redux'
import { BoardType } from '../../../../common/types'
import { useEffect, useRef, useState } from 'react'
import { newNameValidation } from '../../../../common/functions/functions'
import { edCard, getBoard } from '../../../../store/modules/board/actions'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import parse from 'html-react-parser'
import { toggleState } from '../../../../common/functions/functions'
import {CardModalActions} from '../CardModalActions/CardModalActons'


export const CardModal = () => {
  const navigate = useNavigate()
  const { board_id, card_id } = useParams()
  const selectBoard = useSelector(
    (state: RootState) => state.board,
    shallowEqual
  )
  // console.log('state.board', selectBoard)

  const [isInputCardTitle, setInputCardTitleVisibity] = useState(false)
  const [isCardDescEditing, setCardDescEditing] = useState(false)
  const [ isCardModalActions, setCardModalActions] = useState(false) 
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

    console.log('board.lists', board.lists)
    // console.log('board.lists', typeof board.lists[0].id)

    for (let list of board.lists) {
      for (let card of list.cards) {
        if (+card.id! === id) {
          console.log('list.id', list.id)
          setList_id(list.id)
          setListTitle(list.title)
          setCardTitle(card.title!)
          if (card.description) setTextAreaValue(card.description)
          console.log('listTitle', listTitle, list_id, cardTitle)
        }
      }
    }
  }

  useEffect(() => {
    console.log(' cardModal useEffect')
    getCardData(selectBoard, +card_id!)
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
        edCard(board_id!, list_id, card_id!, cardTitle, textAreaValue)
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
        store.dispatch(edCard(board_id!, list_id, card_id!, cardTitle))
        // store.dispatch(getBoard(board_id!))
      } else {
        setErrorCardValidationOpen(false)
      }
    }
  }

  const handleBlurCardTitle = () => {
    if (newNameValidation(cardTitle)) {
      setInputCardTitleVisibity(false)
      store.dispatch(edCard(board_id!, list_id, card_id!, cardTitle))
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
          <h1 onClick={()=>{toggleState(setInputCardTitleVisibity)}}>
            {cardTitle} :{card_id}
          </h1>
        )}
        <button
          className="close-button"
          onClick={() => {
            navigate(-1)
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
                  <p onClick={()=>toggleState(setCardDescEditing)}> {parse(textAreaValue)}</p>
                )}
              </div>
            </div>
            <div className="right-content">
              <h3>Actions</h3>
              <button onClick={()=>toggleState(setCardModalActions)}>Copy</button>
              <button>Move</button>
              <button className="red-button">Archive</button>
            </div>
          </div>
        </div>
        {isCardModalActions && (<CardModalActions title="My Modal"
          onClose={()=>toggleState(setCardModalActions)} />) }
      </div>
    </div>
  )
}
