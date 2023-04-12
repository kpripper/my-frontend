import { useLocation, useNavigate, useParams } from 'react-router-dom'
import './cardModal.scss'
import store, { RootState } from '../../../../store/store'
import { shallowEqual, useSelector } from 'react-redux'
import { BoardType } from '../../../../common/types'
import { useEffect, useState } from 'react'
import { newNameValidation } from '../../../../common/functions/functions'
import { edCard } from '../../../../store/modules/board/actions'

type CardModalProps = {}

export const CardModal = () => {
  
  const navigate = useNavigate()
  const { board_id, card_id } = useParams()
  const selectBoard = useSelector(
    (state: RootState) => state.board,
    shallowEqual
  )
  // console.log('state.board', selectBoard)

  const [isInputCardTitle, setInputCardTitleVisibity] = useState(false)
  let [cardTitle, setCardTitle] = useState('')
  let [listTitle, setListTitle] = useState('')
  const [isErrorCardValidation, setErrorCardValidationOpen] = useState(false)

  let list_id = ''
  //let listTitle = ''

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
          console.log('typeof list.id', typeof list.id)
          listTitle = list.title
          list_id = list.id
        //  cardTitle = card.title!
          setListTitle(card.title!)
          setCardTitle(card.title!)
          console.log('listTitle', listTitle, list_id, cardTitle)
        }
      }
    }
  }

  useEffect(() => {
    console.log(' cardModal useEffect')
    getCardData(selectBoard, +card_id!)

    
  }, [])

  const toggleInputCardTitle = () => {
    setInputCardTitleVisibity(!isInputCardTitle)
  }

  const handleChangeCardTitle = (ev: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleChangeCardTitle', ev.target.value)
    setCardTitle(ev.target.value)
  }

  const handleKeyDownCardTitle = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      if (newNameValidation(cardTitle)) {
        setCardTitle(cardTitle)
        setInputCardTitleVisibity(false)
        store.dispatch(edCard(board_id!, list_id, card_id!, cardTitle))
      } else {
        setErrorCardValidationOpen(false)
      }
    }
  }

  const handleBlurCardTitle = () => {
    if (newNameValidation(cardTitle)) {
      // store.dispatch(editBoardTitle(boardName, boardId))
    }
  }

  return (
    <div className="modalDiv">
      <div className="my-component modal">
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
          <h1 onClick={toggleInputCardTitle}>
            {cardTitle}:{card_id}
          </h1>
        )}
        {/* <h1>{cardTitle}</h1> */}
        <button
          className="close-button"
          onClick={() => {
            navigate(-1)
          }}
        ></button>
        <div>
          <h2>
            List: {listTitle}:{list_id}
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
                <button>Edit</button>
              </div>
              <div className="card-description">
                <p>Card descrition</p>
              </div>
            </div>
            <div className="right-content">
              <h3>Actions</h3>
              <button>Copy</button>
              <button>Move</button>
              <button className="red-button">Archive</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
