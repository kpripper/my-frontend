import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { List } from './components/List/List'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import './board.scss'
import '../../index.css'
import { IBoard } from '../../common/interfaces/IBoard'
import {
  createList,
  editBoardTitle,
  getBoard,
} from '../../store/modules/board/actions'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
// import { title } from 'process'
import { connect } from 'react-redux'
import store from '../../store/store'
import { Dispatch } from 'redux'
import instance from '../../api/request'
import { idText } from 'typescript'
import { RootState, AppState } from '../../store/store'
import { AxiosResponse } from 'axios'
import { newNameValidation } from '../../common/functions/functions'


// const sampleBoardState = {
//   title: 'My Board',
//   lists: [
//     {
//       id: 1,
//       title: 'To Do',
//       cards: [
//         { id: 1, title: 'wash the cat' },
//         { id: 2, title: 'make soup' },
//         { id: 3, title: 'go to the store' },
//       ],
//     },
//     {
//       id: 2,
//       title: 'Doing',
//       cards: [{ id: 4, title: 'watch the series' }],
//     },
//     {
//       id: 3,
//       title: 'Done',
//       cards: [
//         { id: 5, title: 'do homework' },
//         { id: 6, title: 'walk the dog' },
//       ],
//     },
//   ],
// }

interface BoardProps {
  getBoard: (id: number) => Promise<AxiosResponse<any, any> | undefined>
  boardTitle: string
  boardLists: []
}

const BoardComponent = (props: BoardProps) => {
  console.log('board props', props)

  const listsSelector = useSelector(
    (state: AppState) => state.board.lists,
    shallowEqual
  )

  //console.log('listsSelector', listsSelector)

  const [loading, setLoading] = useState(true)
  const [settedBoard, setBoardTitle] = useState<string | null>(null)
  //const [settedBoardLists, setBoardLists] = useState<[]>([])

  let { id } = useParams()
  // console.log(typeof id)

  if (typeof id !== 'undefined') {
    //var for visibility in getBoard(idNumber)
    var idNumber: number = +id
    //  dispatch<any>(getBoard(idNumber))
    //console.log(' getBoard(idNumber)')
    // props.getBoard(idNumber)
  }

  async function fetchData() {
    const response = await instance.get('/board/' + id)
    // @ts-ignore
    setBoardTitle(response.title)
    // @ts-ignore
    let lists = response.lists
    // setBoardLists(lists)
    console.log('fetchData lists', lists)
  }

  const dispatch = useDispatch()
  console.log('Board useParams ', useParams())
  const getstate = store.getState()
  console.log('Board store.getState() ', getstate)

  // const boardsFromState = useSelector((state: RootState) => state.boards.boards)
  // console.log('boardsFromState', boardsFromState) // []

  // let currentBoardTitle = boardsFromState.find(boardObj => {
  //   return boardObj.id === 6
  // })

  let location = useLocation()

  useEffect(() => {
    fetchData()
    props.getBoard(+id!)
    setLoading(false)
  }, []) // Or [] if effect doesn't need props or state

  console.log('settedBoard', settedBoard)

  const editBoardTitleToggle = () => {
    const elemH1 = document.querySelector('.board-h1') as HTMLElement
    const elemInput = document.querySelector('.inp-board-title') as HTMLElement

    if (elemH1.style.display !== 'none') {
      console.log(
        "editBoardTitleToggle if elemH1.style.display !== 'none",
        elemH1.style.display,
        elemInput.style.display
      )
      elemH1.style.display = 'none'
      elemInput.style.display = 'block'
      //elemInput. = elemH1.textContent
      console.log(
        "editBoardTitleToggle if elemH1.style.display !== 'none switch",
        elemH1.style.display,
        elemInput.style.display
      )
      elemInput.focus()
    } else {
      elemInput.blur()
      console.log(
        'editBoardTitleToggle else',
        elemH1.style.display,
        elemInput.style.display
      )
      elemH1.style.display = 'block'
      elemInput.style.display = 'none'
      console.log(
        'editBoardTitleToggle else switch',
        elemH1.style.display,
        elemInput.style.display
      )
    }
  }

  const inputKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('ev target', (ev.target as HTMLInputElement).value)
    if (ev.key === 'Enter') {
      if (newNameValidation((ev.target as HTMLInputElement).value)) {
        // alert('Name good key!')
        dispatch<any>(
          editBoardTitle((ev.target as HTMLInputElement).value, idNumber)
        )
        dispatch<any>(getBoard(idNumber))
        setBoardTitle((ev.target as HTMLInputElement).value)
        editBoardTitleToggle()
      } else {
        alert('Name not valid inputKeyDown!')
        editBoardTitleToggle()
      }
    }
  }

  const inputOnBlur = (ev: React.FocusEvent<HTMLInputElement>) => {
    if (newNameValidation(ev.target.value)) {
      //  alert('Name good blur!')
      dispatch<any>(editBoardTitle(ev.target.value, idNumber))
      dispatch<any>(getBoard(idNumber))
      console.log('try setBoard', ev.target.value)
      setBoardTitle(ev.target.value)
      console.log('setBoard', getstate.board.title)
      editBoardTitleToggle()
    } else {
      // alert('Name not valid inputOnBlur!')
      editBoardTitleToggle()
    }
  }

  const addListOnEnter = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      if (newNameValidation((ev.target as HTMLInputElement).value)) {
        closeAddListForm()
        dispatch<any>(
          createList((ev.target as HTMLInputElement).value, idNumber)
        )
        dispatch<any>(getBoard(idNumber))
      } else {
        alert('Name not valid!')
      }
    }
  }

  const addListOnButton = (ev: React.MouseEvent<HTMLButtonElement>) => {
    const elemInpListTitle = document.querySelector(
      '.inp-list-title'
    ) as HTMLInputElement

    if (newNameValidation(elemInpListTitle.value)) {
      closeAddListForm()
      dispatch<any>(createList(elemInpListTitle.value, idNumber))
      dispatch<any>(getBoard(idNumber))
    } else {
      alert('Name not valid!')
    }
  }


  const closeAddListForm = () => {
    ;(document.querySelector('.add-list-form') as HTMLElement).style.display =
      'none'
    ;(document.querySelector('.open-add-list') as HTMLElement).style.display =
      'flex'
  }

  const enterListTitle = () => {
    const elemOpenAddList = document.querySelector(
      '.open-add-list'
    ) as HTMLElement
    // const elemAddListControls = document.querySelector(
    //   '.add-list-controls'
    // ) as HTMLElement
    // const elemAddSpan = document.querySelector('.add-list-span') as HTMLElement
    const elemInpListTitle = document.querySelector(
      '.inp-list-title'
    ) as HTMLElement
    // const elemListAddButton = document.querySelector(
    //   '.list-add-button'
    // ) as HTMLElement
    const elemAddListForm = document.querySelector(
      '.add-list-form'
    ) as HTMLElement
    const elemList = document.querySelector('.list') as HTMLElement

    if (elemOpenAddList.style.display !== 'none') {
      elemOpenAddList.style.display = 'none'
      elemAddListForm.style.display = 'flex'
      elemInpListTitle.focus()
      elemList.classList.add('active-list')
    } else {
      elemInpListTitle.blur()
      elemOpenAddList.style.display = 'flex'
      elemAddListForm.style.display = 'none'
      elemList.classList.remove('active-list')
    }
  }

  if (loading) {
    return <h1>Loading...</h1>
  }

  if (settedBoard) {
    console.log('try render')

    return (
      <div
        // onClick={myFunction}
        className={`${location.pathname !== '/' ? 'boards' : ''}`}
      >
        {/* <div>state - {JSON.stringify(state)}</div>
      <div>props - {JSON.stringify(props)}</div> */}
        <div className="header-container">
          <Link className="" to="/">
            Main
          </Link>
        </div>

        <div className="board-header">
          <h1 className="board-h1" onClick={editBoardTitleToggle}>
            {settedBoard}

            {/* {gotStateBoard.title} */}
            {/* {id} */}
          </h1>
          <input
            className="inp-board-title"
            type="text"
            //коли додав пусти плейсхолдер, то при появі інпута там поточна назва дошки
            placeholder=""
            onKeyDown={inputKeyDown}
            onBlur={inputOnBlur}
          />
        </div>

        <SimpleBar className="simplebar" direction="rtl" autoHide={false}>
          <div className="board-content">
            {listsSelector.map(
              ({
                id,
                title,
                cards,
              }: {
                id: number
                title: string
                cards: []
              }) => (
                <List id={id} title={title} cards={cards} />
              )
            )}
            <div className="list">
              <div className="open-add-list" onClick={enterListTitle}>
                <span className="icon-plus"></span>
                <span className="add-list-span">Add new list</span>
              </div>
              <div className="add-list-form">
                {/* //TODO якщо перемістити цей інпут в форму add-list-form, то тоді значення передається
                //TODO але перестає працювати відправка назви по ентеру */}
                <input
                  className="inp-list-title"
                  type="text"
                  name="newlist"
                  onKeyDown={addListOnEnter}
                  placeholder="Enter list title..."
                />
                <div className="add-list-controls">
                  <button className="list-add-button" onClick={addListOnButton}>
                    Add list
                  </button>
                  <span
                    onClick={closeAddListForm}
                    className="icon-close icon-close-addlist"
                  ></span>
                  
                </div>
              </div>

              {/* <span id="demo">focus</span> */}
            </div>
          </div>
        </SimpleBar>
      </div>
    )
  }

  return null
}

//запускається щоразу при зміні store і повертає щось компоненту
//unknown не підходить
const mapStateToProps = (state: any) => {
  console.log('board state bef', state)
  const { title: boardTitle, lists: boardLists } = state
  console.log('board state', state)
  return { boardTitle, boardLists }
  //return state
}

//передає в пропси компонента Home ті дані, які повернув mapStateToProps, другий параметр - методи
//якщо другий параметр в фігурних дужках - то це екшнкріейтор
//якщо ні, то щось таке
// const mapDispatchToProps = (dispatch) => {
//   return {
//     // dispatching plain actions
//     increment: () => dispatch({ type: 'INCREMENT' }),
//     decrement: () => dispatch({ type: 'DECREMENT' }),
//     reset: () => dispatch({ type: 'RESET' }),
//   }

//export default Board = connect(mapStateToProps, { getBoard })(Board)

export const Board = connect(mapStateToProps, { getBoard })(BoardComponent)
