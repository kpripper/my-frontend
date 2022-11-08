import React from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import BoardHome from './components/BoardHome/BoardHome'
import 'simplebar-react/dist/simplebar.min.css'
import './home.scss'
import '../../index.css'
import {Board} from '../Board/Board'

const state = {
  boards: [
    { id: 1, title: 'Покупки' },
    { id: 2, title: 'Подготовка к свадьбе' },
    { id: 3, title: 'Разработка интернет-магазинаfff' },
    { id: 4, title: 'Курс по продвижению в соцсетях' },
  ],
}

export default class Home extends React.Component {
  render() {
    return (
      <>
        <div className={window.location.pathname === '/' ? 'home' : ''}>
          <div className="header-container">
            <a href="/">Home</a>
          </div>
          <div className="boards-header">
            <div className="boards-header-item">
              <span className="fa-solid fa-table"></span>
              <span>Your boards</span>
            </div>
          </div>
          {/* <div>
          <Link to="/board">board</Link>
        </div>
         */}

          <div className="all-boards">
            {state.boards.map((elem) => BoardHome(elem))}
            <div className="add-board">
              <div className="add-board-button">
                <span className="fa-solid fa-plus"></span>
                <span className="">Add board</span>
              </div>
            </div>
          </div>
          {/* <div>{window.location.pathname}</div> */}
        </div>
      </>
    )
  }
}
