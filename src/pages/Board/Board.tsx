import React, { FormEvent, useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import List from './components/List/List'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import './board.scss'
import '../../index.css'
import { IBoard } from '../../common/interfaces/IBoard'
import { createList, editBoardTitle, getBoard } from '../../store/modules/board/actions'
import { useDispatch, useSelector } from 'react-redux'
// import { title } from 'process'
import { connect } from 'react-redux'
import store from '../../store/store'
import { Dispatch } from 'redux'
import instance from '../../api/request'
import { idText } from 'typescript'
import { RootState } from '../../store/store'

const sampleBoardState = {
  title: 'My Board',
  lists: [
    {
      id: 1,
      title: 'To Do',
      cards: [
        { id: 1, title: 'wash the cat' },
        { id: 2, title: 'make soup' },
        { id: 3, title: 'go to the store' },
      ],
    },
    {
      id: 2,
      title: 'Doing',
      cards: [{ id: 4, title: 'watch the series' }],
    },
    {
      id: 3,
      title: 'Done',
      cards: [
        { id: 5, title: 'do homework' },
        { id: 6, title: 'walk the dog' },
      ],
    },
  ],
}

interface BoardState {
  // id: number
}

interface BoardProps {
  getBoard: () => Promise<void>
  lists: []
}

//const BoardComponent = () => {
export const Board = () => {

  function myFunction() {
    const element = document.activeElement!.tagName;
    document.getElementById("demo")!.innerHTML = element;
  }

  let lists: any[] = []

  let { id } = useParams()
  // console.log(typeof id)

  if (typeof id !== 'undefined') {
    //var for visibility in getBoard(idNumber)
    var idNumber: number = +id
    //  dispatch<any>(getBoard(idNumber))
    console.log(' getBoard(idNumber)')

    //  getBoard(idNumber)
  }

  async function fetchData() {
    // You can await here
    const response = await instance.get('/board/' + id)
    // ...
    console.log('fetchData response', response)
    // @ts-ignore
    console.log('fetchData response', response.title)
    // @ts-ignore
    setBoard(response.title)
    // @ts-ignore
    lists = response.lists
  }

  fetchData()

  const [loading, setLoading] = useState(true)
  const [settedBoard, setBoard] = useState<string | null>(null)

  const dispatch = useDispatch()
  console.log('Board useParams ', useParams())
  const getstate = store.getState()
  console.log('Board getstate ', getstate)

  const boardsFromState = useSelector((state: RootState) => state.boards.boards)
  console.log('boardsFromState', boardsFromState)

  // let currentBoardTitle = boardsFromState.find(boardObj => {
  //   return boardObj.id === 6
  // })

  let location = useLocation()
  console.log('Board useLocation ', location)

  // const stateUseSelectorBoardTitle = useSelector((state: IBoard) => state.title)
  // const gotStateBoard = useSelector((state: IBoard) => state)

  // console.log('stateUseSelectorBoardTitle', stateUseSelectorBoardTitle)

  // const gotBoard = (): void => {
  //    getBoard(id)
  //  }

  // console.log('gotBoard', gotBoard)

  useEffect(() => {
    fetchData()
    setLoading(false)
  }, []) // Or [] if effect doesn't need props or state

  console.log('settedBoard', settedBoard)

  // let [name, setname] = useState('')
  /* The handleChange() function to set a new state for input */
  // const handleChange = (event: {
  //   target: { value: React.SetStateAction<string> }
  // }) => {
  //   setname(event.target.value)
  // }

  const newBoardValidation = (board: string) => {
    const pattern = /^[A-Za-z0-9 _\-.]*$/
    return pattern.test(board)
  }

  // const editBoardTitleOpen = () => {
  //   const elemH1 = document.querySelector('.board-h1') as HTMLElement
  //   elemH1.style.display = 'none'
  //   const elemInput = document.querySelector('.inp-board-title') as HTMLElement
  //   elemInput.style.display = 'block'
  //   elemInput.focus()
  // }

  const editBoardTitleToggle = () => {
    const elemH1 = document.querySelector('.board-h1') as HTMLElement
    const elemInput = document.querySelector('.inp-board-title') as HTMLElement

    
    

    if (elemH1.style.display !== 'none') {
      console.log("editBoardTitleToggle if elemH1.style.display !== 'none", elemH1.style.display, elemInput.style.display);
      elemH1.style.display = 'none'
      elemInput.style.display = 'block'
      console.log("editBoardTitleToggle if elemH1.style.display !== 'none switch", elemH1.style.display, elemInput.style.display);
      elemInput.focus()
    } else {
      elemInput.blur()
      console.log("editBoardTitleToggle else", elemH1.style.display, elemInput.style.display);
      elemH1.style.display = 'block'
      elemInput.style.display = 'none'
      console.log("editBoardTitleToggle else switch", elemH1.style.display, elemInput.style.display);
      
    }
  }

  const inputKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {

    console.log('ev target', (ev.target as HTMLInputElement).value)
   if (ev.key === 'Enter') {
      if (newBoardValidation((ev.target as HTMLInputElement).value)) {
        dispatch<any>(
          editBoardTitle((ev.target as HTMLInputElement).value, idNumber)
        )
        dispatch<any>(getBoard(idNumber))
        setBoard((ev.target as HTMLInputElement).value)
        editBoardTitleToggle()
      } else {
        alert('Name not valid!')
      }
    }
  }

  const inputOnBlur = (ev: React.FocusEvent<HTMLInputElement>) => {
    if (newBoardValidation(ev.target.value)) {
      dispatch<any>(editBoardTitle(ev.target.value, idNumber))
      dispatch<any>(getBoard(idNumber))

      console.log('try setBoard', ev.target.value)
      setBoard(ev.target.value)
      console.log('setBoard', getstate.board.title)
      editBoardTitleToggle()
    } else {
      alert('Name not valid!')
    }
  }

  const addListOnEnter = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      if (newBoardValidation((ev.target as HTMLInputElement).value)) {
        dispatch<any>(
          createList((ev.target as HTMLInputElement).value, idNumber)
        )
        dispatch<any>(getBoard(idNumber))
      } else {
        alert('Name not valid!')
      }
    }
  }

  const addList = (ev: FormEvent<HTMLFormElement>) => {
    
      if (newBoardValidation((ev.target as HTMLInputElement).value)) {
        dispatch<any>(
          createList((ev.target as HTMLInputElement).value, idNumber)
        )
        dispatch<any>(getBoard(idNumber))
      } else {
        alert('Name not valid!')
      }
    
  }

  const closeAddListForm = () => {
    ;(document.querySelector('.add-list-form') as HTMLElement).style.display =
      'none'
    ;(document.querySelector('.open-add-list') as HTMLElement).style.display =
      'inline-block'
  }

  const toggleAddListForm = () => {
    ;(document.querySelector('.add-list-form') as HTMLElement).style.display =
      'none'
  }

  const enterListTitle = () => {
    const elemOpenAddList = document.querySelector(
      '.open-add-list'
    ) as HTMLElement
    const elemAddListControls = document.querySelector(
      '.add-list-controls'
    ) as HTMLElement
    const elemAddSpan = document.querySelector('.add-list-span') as HTMLElement
    const elemInpListTitle = document.querySelector(
      '.inp-list-title'
    ) as HTMLElement
    const elemListAddButton = document.querySelector(
      '.list-add-button'
    ) as HTMLElement
    const elemAddListForm = document.querySelector(
      '.add-list-form'
    ) as HTMLElement
    const elemList = document.querySelector(
      '.list'
    ) as HTMLElement

    if (elemOpenAddList.style.display !== 'none') {
      elemOpenAddList.style.display = 'none'
      elemAddListForm.style.display = 'flex'
      elemInpListTitle.focus()
      elemList.classList.add('active-list');
    } else {
      elemInpListTitle.blur()
      elemOpenAddList.style.display = 'inline-block'
      elemAddListForm.style.display = 'none'
      elemList.classList.remove('active-list');
    }
  }

  if (loading) {
    return <h1>Loading...</h1>
  }

  if (settedBoard) {
    console.log('try render')

    return (
      <div
        onClick={myFunction}
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
            {/* чомусь нічого не виводить
           {getstate.board.title} */}
            {settedBoard}

            {/* {gotStateBoard.title} */}
            {/* {id} */}
          </h1>
          <input
            className="inp-board-title"
            type="text"
            onKeyDown={inputKeyDown}
            onBlur={inputOnBlur}
          />
        </div>

        <SimpleBar
          className="simplebar"
          direction="rtl"
          // forceVisible="y"
          autoHide={false}
          // style={position: 300 }}
        >
          <div className="board-content">
            {/* {state.lists.map((list) => List(list))} */}

            {
              // gotStateBoard.lists.map(({ id, title, cards }) => (
              //   <List key={id} title={title} cards={cards} />
              // ))
              lists.map(({ id, title, cards }) => (
                <List key={id} title={title} cards={cards} />
              ))
            }
            <div className="list">
              <div className="open-add-list" onClick={enterListTitle}>
                <span className="fa-solid fa-plus"></span>
                <span className="add-list-span">Add list</span>
              </div>
              <div className="add-list-form">
                <input
                  className="inp-list-title"
                  type="text"
                  onKeyDown={addListOnEnter}
                  placeholder='Enter list title...'
                />
                <div className="add-list-controls">
                  <form onSubmit={addList}>
                    <input
                      className="list-add-button"
                      type="submit"
                      value="Add list"                      
                    ></input>
                  </form>
                  <span
                    onClick={closeAddListForm}
                    className="fa-solid fa-xmark"
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
const mapStateToProps = (state: IBoard) => ({
  ...state.lists,
})

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