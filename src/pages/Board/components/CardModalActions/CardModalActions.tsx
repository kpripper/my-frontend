import React, { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import './cardModalActions.scss'
import { useNavigate, useParams } from 'react-router-dom'
import { shallowEqual, useSelector } from 'react-redux'
import store, { RootState } from '../../../../store/store'
import { BoardType, ListType, CardType } from '../../../../common/types'
import {
  addCard,
  delCard,
  normalizeCardsPositions,
} from '../../../../store/modules/board/actions'
import instance from '../../../../api/request'

interface ICardModalActions {
  cardTitle: string
  cardDescription: string
  cardId: string
  title: string
  position: string
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const CardModalActions = (props: ICardModalActions) => {
  const { id: board_id, cardId } = useParams() as { id: string; cardId: string }
  const navigate = useNavigate()
  const boardSelectRef = useRef<HTMLSelectElement>(null)
  const listSelectRef = useRef<HTMLSelectElement>(null)
  const cardSelectRef = useRef<HTMLSelectElement>(null)

  const selectBoards = useSelector(
    (state: RootState) => state.boards,
    shallowEqual,
  )

  const selectBoard = useSelector(
    (state: RootState) => state.board,
    shallowEqual,
  )

  const [textAreaCardTitle, setTextAreaCardTitle] = useState(props.cardTitle)
  const [isOpenBoardSelect, setIsOpenBoardSelect] = useState(false)
  const [isOpenListSelect, setIsOpenListSelect] = useState(false)
  const [isOpenCardSelect, setIsOpenCardSelect] = useState(false)
  let [desiredPosition, setDesiredPosition] = useState(0)

  let [displayedBoard, setDisplayedBoard] = useState<BoardType>({
    id: 0,
    title: '',
    lists: [] as ListType[],
  })
  let [displayedList, setDisplayedList] = useState<ListType>({
    id: 0,
    title: '',
    position: '',
    cards: [] as CardType[],
  })
  let [displayedCard, setDisplayedCard] = useState<CardType>({
    position: '',
    boardid: '',
    listId: 0,
    index: 0,
  })

  let [currentList, setCurrentList] = useState<ListType>({
    id: 0,
    title: '',
    position: '',
    cards: [],
  })

  const [allBoards, setAllBoards] = useState<BoardType[]>([])

  let currentBoardtitle = selectBoards.find(
    board => board.id === +board_id!,
  )?.title

  async function getAllBoards(selectBoards: any) {
    const result: BoardType[] = []

    for (let [index, board] of selectBoards.entries()) {
      const boardFromAPI: BoardType = await instance.get('/board/' + board.id)
      if (boardFromAPI.title === currentBoardtitle) {
        boardFromAPI.id = board.id
        setDisplayedBoard(boardFromAPI)
      }
      boardFromAPI.id = board.id

      result.push(boardFromAPI)
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
      const card = list.cards.find(card => String(card.id) === cardId)
      if (card) {
        setDisplayedList(list)
        setDisplayedCard(card)
        setCurrentList(list)
      }
    }
  }

  function findCurrentBoard(): BoardType {
    return selectBoards.find(board => board.id === +board_id) as BoardType
  }

  let currentBoard: BoardType = findCurrentBoard()

  function findCardByCardId(lists: ListType[], cardId: string) {
    for (const list of lists) {
      const card = list.cards.find(card => String(card.id) === cardId)
      if (card) {
        return card
      }
    }
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

  async function doModalAction(
    action: string,
    targetBoard: BoardType,
    targetList: ListType,
    desiredPosition: number,
    textAreaCardTitle: string,
    cardDescription: string,
  ) {
    if (targetList === undefined) {
      // handleAxiosError('No lists in target board', 'doModalAction')
      return
    }

    if (action === 'Copy') {
      try {
        store.dispatch(
          addCard(
            textAreaCardTitle,
            String(targetBoard.id),
            targetList.id,
            desiredPosition,
            board_id,
            cardDescription,
          ),
        )
      } catch (error) {
        console.log(error)
      }

      setTimeout(() => {
        store.dispatch(
          normalizeCardsPositions(String(targetBoard.id), targetList.id),
        )
      }, 1000)
    }
    if (action === 'Move') {
      const createdCardId = await store.dispatch(
        addCard(
          textAreaCardTitle,
          String(targetBoard.id),
          targetList.id,
          desiredPosition,
          board_id,
          cardDescription,
        ),
      )

      if (+board_id !== targetBoard.id) {
        navigate(`/board/${board_id}`)
      } else {
        navigate(`/board/${board_id}/card/${createdCardId}`)
      }

      setTimeout(() => {
        store.dispatch(delCard(board_id, currentCard!.id!))
      }, 500)

      setTimeout(() => {
        store.dispatch(
          normalizeCardsPositions(String(targetBoard.id), targetList.id),
        )
      }, 1000)

      setTimeout(() => {
        store.dispatch(normalizeCardsPositions(board_id, currentList.id))
      }, 1500)
    }
  }

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTextAreaCardTitle(event.target.value)
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
            <textarea
              value={textAreaCardTitle}
              placeholder={textAreaCardTitle}
              onChange={handleTextAreaChange}
            />
            <div>Copy to…</div>
            <div
              className="copy-to-inner"
              onClick={() => {
                setIsOpenBoardSelect(!isOpenBoardSelect)
                setIsOpenListSelect(false)
              }}
            >
              <span className="copy-to-inner-span-board">Board</span>
              <span className="copy-to-inner-span-board">
                {displayedBoard.title}
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
                        allBoards.find(b => b.title === currentBoard.title),
                      )
                      setDisplayedBoard(
                        allBoards.find(
                          b => b.title === currentBoard.title,
                        ) as BoardType,
                      )

                      //тернарник без варіанту у випадку фолс
                      const foundBoard = allBoards.find(
                        b => b.title === currentBoard.title,
                      )

                      if (foundBoard) {
                        setDisplayedList(foundBoard.lists[0] as ListType)
                      }

                      setDisplayedCard(
                        allBoards.find(b => b.title === currentBoard.title)
                          ?.lists[0].cards[0] as CardType,
                      )
                      setIsOpenBoardSelect(!isOpenBoardSelect)
                    }}
                  >
                    {currentBoard.title} (Current)
                  </option>
                )}
                {allBoards
                  .filter(board => board.title !== currentBoard!.title)
                  .map(board => (
                    <option
                      className="option-select"
                      key={board.id}
                      value={board.title}
                      onClick={() => {
                        setDisplayedBoard(board)
                        setDisplayedList(board.lists[0])
                        if (displayedList.cards.length > 0) {
                          setDisplayedCard(displayedList.cards[0])
                        } else {
                          setDisplayedCard({
                            position: '1',
                            boardid: String(displayedBoard.id),
                            listId: displayedList.id,
                            index: 1,
                          })
                        }
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
                <span className="copy-to-inner-span-list">List</span>
                <span className="copy-to-inner-span-list">
                  {displayedList?.title ? displayedList?.title : 'No lists'}
                </span>

                {isOpenListSelect && (
                  <select
                    ref={listSelectRef}
                    className="list-select"
                    size={displayedBoard?.lists.length}
                  >
                    {displayedBoard?.lists.map(list => (
                      <option
                        className="option-select"
                        key={list.id}
                        value={list.title}
                        onClick={() => {
                          setDisplayedList(list)
                          if (displayedList.cards.length > 0) {
                            setDisplayedCard(displayedList.cards[0])
                          } else {
                            setDisplayedCard({
                              position: '1',
                              boardid: String(displayedBoard.id),
                              listId: list.id,
                              index: 1,
                            })
                          }
                        }}
                      >
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
                  {displayedList?.title
                    ? desiredPosition === 0
                      ? displayedCard?.position
                      : desiredPosition
                    : ''}
                </span>
                {isOpenCardSelect && (
                  <select
                    ref={cardSelectRef}
                    className="card-select"
                    size={displayedList!.cards.length + 1}
                  >
                    {displayedList!.cards.map(card => (
                      <option
                        className="option-select"
                        key={card.position}
                        value={card.position}
                        onClick={() => setDisplayedCard(card)}
                      >
                        {displayedList.title === currentList?.title &&
                        card.position === props.position
                          ? card.position + ' (Current)'
                          : card.position}
                      </option>
                    ))}
                    {/* ще одна опція селекта для додавання однієї позиції після існуючих карток */}
                    <option
                      className="option-select"
                      value={displayedList!.cards.length + 1}
                      onClick={() => {
                        setDesiredPosition(displayedList.cards.length + 1)
                      }}
                    >
                      {displayedList!.cards.length + 1}
                    </option>
                  </select>
                )}
              </div>
            </div>
            <button
              onClick={() =>
                doModalAction(
                  props.title, //action
                  displayedBoard,
                  displayedList,
                  desiredPosition,
                  textAreaCardTitle,
                  currentCard?.description!,
                )
              }
            >
              {props.title} card
            </button>
          </div>
        </div>
      </Draggable>
    </div>
  )
}
