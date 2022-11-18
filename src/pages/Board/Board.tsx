import React, { useEffect } from 'react'
import { Link, useParams, RouteProps, useLocation } from 'react-router-dom'
import List from './components/List/List'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import './board.scss'
import '../../index.css'
import { IBoard } from '../../common/interfaces/IBoard'

const state = {
  title: 'My Board',
  lists: [
    {
      id: 1,
      title: 'To Do',
      cards: [
        { id: 1, title: 'помыть кота' },
        { id: 2, title: 'приготовить суп' },
        { id: 3, title: 'сходить в магазин' },
      ],
    },
    {
      id: 2,
      title: 'Doing',
      cards: [{ id: 4, title: 'посмотреть сериал' }],
    },
    {
      id: 3,
      title: 'Done',
      cards: [
        { id: 5, title: 'сделать домашку' },
        { id: 6, title: 'погулять с собакой' },
      ],
    },
  ],
}

interface BoardState {
  // id: number
}

interface BoardProps {
  // id?: number
}

export const Board = (props: any) => {
  console.log('Board useParams ', useParams())

  let { id } = useParams()
  // console.log(id + ' id')  

  let location = useLocation()
  console.log('location ', location);
  

  return (
    <div className={`${location.pathname !== '/' ? 'boards' : ''}`}>
  
     
      <div>state - {JSON.stringify(state)}</div>
      <div>props - {JSON.stringify(props)}</div>
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
          {state.lists.map(({title, cards, id}) => <List key={id} title={title} cards={cards} />)}
          <div className="add-list">
            <span className="fa-solid fa-plus"></span>
            <span>Add list</span>
          </div>
        </div>
      </SimpleBar>
    </div>
  )
}

// export default class ClassBoard extends React.Component {
//   // constructor(props) {
//   //   super(props);
//   //   const {board_id} = this.props.match.params;

//   // }

//   render() {
//     // console.log(this.props)
//     // console.log(this.state)

//     return (
//       <div >
//         {/* <div className="header-container">
//           <Link className="" to="/">
//             Main
//           </Link>
//           <Board />
//           <div> pathname board.tsx {window.location.pathname} </div>
//         </div>

//         <div className="board-header">
//           <h1 className="board-h1">{state.title}</h1>
//         </div>

//         <SimpleBar
//           className="simplebar"
//           direction="rtl"
//           // forceVisible="y"
//           autoHide={false}
//           // style={position: 300 }}
//         >
//           <div className="board-content">
//             {state.lists.map((list) => List(list))}
//             <div className="add-list">
//               <span className="fa-solid fa-plus"></span>
//               <span>Add list</span>
//             </div>
//           </div>
//         </SimpleBar> */}
//       </div>
//     )
//   }
// }
