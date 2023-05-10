import React, { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import './cardModalActions.scss'
import { useParams } from 'react-router-dom'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import store, { RootState } from '../../../../store/store'
import { getBoards } from '../../../../store/modules/boards/actions'
import { BoardType, ListType, CardType } from '../../../../common/types'
import { addCard, getBoard } from '../../../../store/modules/board/actions'
import instance from '../../../../api/request'

interface ICardModalActions {
  cardTitle: string
  title: string
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const CardModalActions = (props: ICardModalActions) => {
  //all others, including useParams<{id: string, cardId: string }>(), returns  string | undefined 
  const { id: board_id, cardId } = useParams() as {id: string, cardId: string }

  //console.log('typeof cardId', typeof cardId) //string
  // console.log('CardModalActions useParams()', useParams())  // {id: '1682354609232', cardId: '1682948047924'}

  const boardSelectRef = useRef<HTMLSelectElement>(null)
  const listSelectRef = useRef<HTMLSelectElement>(null)
  const cardSelectRef = useRef<HTMLSelectElement>(null)

  // id title дощок
  const selectBoards = useSelector(
    (state: RootState) => state.boards,
    shallowEqual
  )
  console.log('selectBoards', selectBoards)

  const selectBoard = useSelector(
    (state: RootState) => state.board,
    shallowEqual
  )
  console.log('selectBoard', selectBoard)

  const [isOpenBoardSelect, setIsOpenBoardSelect] = useState(false)
  const [isOpenListSelect, setIsOpenListSelect] = useState(false)
  const [isOpenCardSelect, setIsOpenCardSelect] = useState(false)
  let [displayedBoard, setDisplayedBoard] = useState<BoardType>({
    id: 0,
    title: '',
    lists: [],
  })
  let [displayedList, setDisplayedList] = useState<ListType>({
    id: 0,
    title: '',
    position:'',
    cards: [],
  })
  let [displayedCard, setDisplayedCard] = useState<CardType>({
    position: '',
    boardid: '',
    listId: 0,
    index: 0,
  })
  // let [currentBoard, setCurrentBoard] = useState<BoardType>(selectBoard)
  let [currentList, setCurrentList] = useState<ListType>()
  //let [allBoards, setAllBoards] = useState<BoardType[]>()
  const [selectedBoard, setSelectedBoard] = useState('')

  // let allBoards: BoardType[] = []

  const [allBoards, setAllBoards] = useState<BoardType[]>([])

  let currentBoardtitle = selectBoards.find(
    (board) => board.id === +board_id!
  )?.title

  async function getAllBoards(selectBoards: any) {
    console.log('getAllBoards get')

    const result: BoardType[] = []

    for (let [index, board] of selectBoards.entries()) {
      const b: BoardType = await instance.get('/board/' + board.id)
      console.log(index, 'b', b)
      console.log('currentBoardtitle', currentBoardtitle)
      if (b.title === currentBoardtitle) {
        console.log('try display board', b)
        setDisplayedBoard(b)
      }
      result.push(b)
    }

    setAllBoards(result)
  }

  useEffect(() => {
    if (selectBoards && selectBoards.length > 0) {
      getAllBoards(selectBoards)
    }
    setCurrentListByCardId(selectBoard.lists, cardId!)
  }, [selectBoards])

  function setCurrentListByCardId(lists: ListType[], cardId: string) {
    for (const list of lists) {
      const card = list.cards.find((card) => String(card.id) === cardId)
      if (card) {
        //  return list
        // console.log('list', list)
        setDisplayedList(list)
        setDisplayedCard(card)
        setCurrentList(list)
        // console.log('currentList', currentList)
      }
    }
  }

  function findCurrentBoard(): BoardType {
    return selectBoards.find((board) => board.id === +board_id) as BoardType
  }

  let currentBoard: BoardType = findCurrentBoard()

  console.log('currentList', currentList)
  console.log('currentBoard', currentBoard)
  console.log('displayedBoard', displayedBoard)
  console.log('displayedList', displayedList)
  console.log('  allBoards', allBoards)

  function findCardByCardId(lists: ListType[], cardId: string) {
    for (const list of lists) {
      const card = list.cards.find((card) => String(card.id) === cardId)
      if (card) {
        return card
      }
    }

    // return null; // якщо карта з заданим id не знайдена в жодному елементі списку
  }

  let currentCard = findCardByCardId(selectBoard.lists, cardId!)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        boardSelectRef.current &&
        (event.target as HTMLElement).className !== 'copy-to-inner-span-board'
      ) {
        setIsOpenBoardSelect(false)
      }
      if (
        listSelectRef.current &&
        (event.target as HTMLElement).className !== 'copy-to-inner-span-list'
      ) {
        setIsOpenListSelect(false)
      }
      if (
        cardSelectRef.current &&
        (event.target as HTMLElement).className !== 'copy-to-inner-span-card'
      ) {
        setIsOpenCardSelect(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [boardSelectRef, listSelectRef, cardSelectRef])

  function doModalAction(
    action: string,
    board: BoardType,
    list: ListType,
    card: CardType,
  ) {
    if (action === 'Copy') {
      store.dispatch(addCard(card.title!, String(board.id), list.id, +card.position))
    }
    if (action === 'Move') {
    }
  }

  return (
    <div className="center-draggable">
      <Draggable>
        <div className="modal-actions">
          <div className="modal-actions-header">
            <h2>{props.title}</h2>
            <button className="close-button" onClick={props.onClose}>
              X
            </button>
          </div>
          <div className="modal-actions-body">
            <div>Title</div>
            <textarea placeholder={props.cardTitle} />
            <div>Copy to…</div>
            {/* isOpenBoardSelect: {isOpenBoardSelect ? 'true' : 'false'}
            currentList: {currentList?.title}
            displayedList: {displayedList?.title}
            displayedBoard: {displayedBoard?.title}
            displayedCard {displayedCard?.position} */}
            <div
              className="copy-to-inner"
              onClick={() => {
                setIsOpenBoardSelect(!isOpenBoardSelect)
                setIsOpenListSelect(false)
              }}
            >
              <span className="copy-to-inner-span-board">Board</span>
              <span className="copy-to-inner-span-board">
                {displayedBoard?.title ?? currentBoard!.title}
              </span>
            </div>
            {isOpenBoardSelect && (
              <select
                ref={boardSelectRef}
                className="board-select"
                size={allBoards.length}
              >
                {currentBoard && (
                  <option
                    key={currentBoard.id}
                    className="option-select"
                    value={currentBoard.title}
                    onClick={() => {
                      console.log(
                        'try set board',
                        allBoards.find((b) => b.title === currentBoard.title)
                      )
                      setDisplayedBoard(
                        allBoards.find((b) => b.title === currentBoard.title) as BoardType
                      )
                      setDisplayedList(
                        allBoards.find((b) => b.title === currentBoard.title)?.lists[0] as ListType
                      )
                      setDisplayedCard(
                        allBoards.find((b) => b.title === currentBoard.title)?.lists[0].cards[0] as CardType
                      )
                      setIsOpenBoardSelect(!isOpenBoardSelect)
                    }}
                  >
                    {currentBoard.title} (Current)
                  </option>
                )}
                {allBoards
                  .filter((board) => board.title !== currentBoard!.title)
                  .map((board) => (
                    <option
                      className="option-select"
                      key={board.id}
                      value={board.title}
                      onClick={() => {
                        console.log('try set board', board)
                        setDisplayedBoard(board)
                        setDisplayedList(board.lists[0])
                        setDisplayedCard(board.lists[0].cards[0])
                        setCurrentList(undefined)
                        setIsOpenBoardSelect(false)
                      }}
                    >
                      {board.title}
                    </option>
                  ))}
              </select>
            )}
            <div className="two-selects">
              <div
                className="copy-to-list copy-to-inner"
                onClick={() => setIsOpenListSelect(!isOpenListSelect)}
              >
                <span className="copy-to-inner-span-list">
                  List{' '}
                  {
                    //  currentList?.title ||
                    displayedList?.title
                  }
                </span>
                <span className="copy-to-inner-span-list">
                  {
                    //   currentList?.title ||
                    displayedList?.title
                  }
                </span>

                {isOpenListSelect && (
                  <select
                    ref={listSelectRef}
                    className="list-select"
                    size={displayedBoard?.lists.length}
                  >
                    {displayedBoard?.lists.map((list) => (
                      <option
                        className="option-select"
                        key={list.id}
                        value={list.title}
                        onClick={() => {
                          setDisplayedList(list)
                          setDisplayedCard(list.cards[0])
                        }}
                      >
                        {/* {displayedBoard?.title}                           */}
                        {list.title === currentList?.title
                          ? list.title + ' (Current)'
                          : list.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div
                className="copy-to-card copy-to-inner"
                onClick={() => setIsOpenCardSelect(!isOpenCardSelect)}
              >
                <span className="copy-to-inner-span-card">Position</span>
                <span className="copy-to-inner-span-card">
                  {displayedCard.position}
                </span>
                {isOpenCardSelect && (
                  <select
                    ref={cardSelectRef}
                    className="card-select"
                    size={displayedList!.cards.length}
                  >
                    {displayedList!.cards.map((card) => (
                      <option
                        className="option-select"
                        key={card.position}
                        value={card.position}
                        onClick={() => setDisplayedCard(card)}
                      >
                        {card.position === currentCard?.position
                          ? card.position + ' (Current)'
                          : card.position}
                        {/* {displayedCard!.position} */}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <button
              onClick={()=> (doModalAction(
                props.title,
                displayedBoard,
                displayedList,
                displayedCard)
              )}
            >
              {props.title} card
            </button>
          </div>
        </div>
      </Draggable>
    </div>
  )
}
