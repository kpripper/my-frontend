import React, { useEffect, useRef } from 'react'
import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import BoardHome from './components/BoardHome/BoardHome'
import 'simplebar-react/dist/simplebar.min.css'
import './home.scss'
import '../../index.css'
import {Board} from '../Board/Board'
import { connect } from 'react-redux'
import { getBoards } from '../../store/modules/boards/actions'
import AddBoard from './components/AddBoard/AddBoard'
import store from '../../store/store'

type propsType = {
  getBoards: () => Promise<void>
  boards: { id: number; title: string }[]
}
type stateType = {
  boards: []
}

// const state = {
//   boards: [
//     { id: 1, title: 'Покупки' },
//     { id: 2, title: 'Подготовка к свадьбе' },
//     { id: 3, title: 'Разработка интернет-магазинаfff' },
//     { id: 4, title: 'Курс по продвижению в соцсетях' },
//   ],
// }

// class Home extends React.Component <propsType, stateType> {

//   //без цього рендерять просто дужки {}
//    componentDidMount() {
//     console.log('componentDidMount')

//     // getBoards нічого не повертає, undefined
//      this.props.getBoards()

//   }

//   render() {
//     // NOTE          return (<div>{JSON.stringify(this.props)}</div>);

//     //   {
//     //     "boards": {
//     //         "boards": [
//     //             {
//     //                 "id": 1668032236310,
//     //                 "title": "todos",
//     //                 "custom": {
//     //                     "description": "desc"
//     //                 }
//     //             },
//     //             {
//     //                 "id": 1668068755851,
//     //                 "title": "Level 2.6 - CRUD",
//     //                 "custom": {
//     //                     "description": "Make a board creation..."
//     //                 }
//     //             }
//     //         ]
//     //     }
//     // }
//     console.log(this.props)

//     //об'єкт з одним ключом boards значенням якого є масив також з назвою boards
//    // console.log(boards)

//     return (
//       <>
//         <div>{JSON.stringify(this.props)}</div>
//         <div>{JSON.stringify(this.props.boards)}</div>
//         <div>{JSON.stringify(this.state)}</div>
//         <div className={window.location.pathname === '/' ? 'home' : ''}>
//           <div className="header-container">
//             <Link to="/">Home</Link>
//           </div>
//           <div className="boards-header">
//             <div className="boards-header-item">
//               <span className="fa-solid fa-table"></span>
//               <span>Your boards</span>
//             </div>
//           </div>
//           {/* <div>
//           <Link to="/board">board</Link>
//         </div>
//          */}

//           <div className="all-boards">
//           <div>{this.props.boards.map(({ id, title }) => <BoardHome id={id} title={title} />)}</div>
//              {/* <div className="all-boards">{this.props.boards.map((elem) => BoardHome(elem))}</div>   */}
//                        <div className="add-board">
//               <div className="add-board-button">
//                 <span className="fa-solid fa-plus"></span>
//                 <span className="">Add board</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     )
//   }
// }

const Home = (props: propsType) => {
  // console.log('Home useParams ', useParams())
  console.log('Home store.getState ', store.getState())

  const { boards } = props

  const { current: currentBoards } = useRef(boards)

  //виконується після рендеру компонента
  useEffect(() => {
    props.getBoards()
  }, [currentBoards])

  // console.log('props.getBoards()', props.getBoards());

  return (
    <>
      {/* <div>{JSON.stringify(props.boards)}</div> */}
      {/* <div>state - {JSON.stringify(state)}</div> */}

      {/* <div>{JSON.stringify(state)}</div> */}
      <div
      // className={window.location.pathname === '/' ? 'home' : ''}
      >
        <div className="header-container">
          <Link to="/">Home</Link>
        </div>
        <div className="boards-header">
          <div className="boards-header-item">
            <span className="icon-boards"></span>
            <span className="your-boards">Your boards</span>
          </div>
        </div>
        {/* <div>
        <Link to="/board">board</Link>
      </div>
       */}

        <div className="all-boards">
          {props.boards.map(({ id, title }) => (
            <BoardHome key={id} id={id} title={title} />
          ))}
          <AddBoard />
        </div>
      </div>
    </>
  )
}



//запускається щоразу при зміні store і повертає щось компоненту
const mapStateToProps = (state: stateType) => ({  
  ...state.boards,
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

export default connect(mapStateToProps, { getBoards })(Home)
