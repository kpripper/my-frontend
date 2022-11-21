import React, { useEffect } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import List from './components/List/List'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import './board.scss'
import '../../index.css'
import { IBoard } from '../../common/interfaces/IBoard'
import { getBoard } from '../../store/modules/board/actions'
import { useDispatch } from 'react-redux'
// import { title } from 'process'
import { connect } from 'react-redux'
import store from '../../store/store'

const state = {
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

export const Board = () => {
  const dispatch = useDispatch()
  console.log('Board useParams ', useParams())
  const getstate = store.getState()
  console.log('Board getstate ',getstate)


  let { id } = useParams()
  // console.log(id + ' id')  

  if (typeof id !== 'undefined') {
    //var for visibility in getBoard(idNumber)
    var idNumber: number = +id;
    dispatch<any>(getBoard(idNumber))
  }
  

  let location = useLocation()
  console.log('Board useLocation ', location)

  

  // const gotBoard = (): void => {
     
  // }

  // console.log('gotBoard', gotBoard)

  useEffect(() => {
    console.log('useEffect board');   
    
  });


  return (
    <div className={`${location.pathname !== '/' ? 'boards' : ''}`}>
      {/* <div>state - {JSON.stringify(state)}</div>
      <div>props - {JSON.stringify(props)}</div> */}
      <div className="header-container">
        <Link className="" to="/">
          Main
        </Link>
      </div>

      <div className="board-header">
        <h1 className="board-h1">
          {state.title} {id}
        </h1>
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
          {state.lists.map(({ id, title, cards }) => (
            <List key={id} title={title} cards={cards} />
          ))}
          <div className="add-list">
            <span className="fa-solid fa-plus"></span>
            <span>Add list</span>
          </div>
        </div>
      </SimpleBar>
    </div>
  )
}

console.log("state Board", state);

//запускається щоразу при зміні store і повертає щось компоненту
const mapStateToProps = (state: IBoard) => ({    
   ...state.lists
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

//export default connect(mapStateToProps, { getBoard })(Board)