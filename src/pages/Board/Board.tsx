import React from 'react'
import { Link } from 'react-router-dom'
import List from './components/List/List'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import './board.scss'
import '../../index.css'

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

export default class Board extends React.Component {
  render() {
    return (
      <div className="board">
        <div className="header-container">
          <Link className="" to="/">
            Main
          </Link>
        </div>

        <div className="board-header">
          <h1 className="board-h1">{state.title}</h1>
        </div>

        <SimpleBar className="simplebar"
          direction="rtl"
          // forceVisible="y"
          autoHide={false}
         // style={position: 300 }}
        >
          <div className="board-content">
            {state.lists.map((list) => List(list))}
            <div className="add-list">
              <span className="fa-solid fa-plus"></span><span>Add list</span>
            </div>
          </div>
        </SimpleBar>
      </div>
    )
  }
}
