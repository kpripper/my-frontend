import React from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import BoardHome from './components/BoardHome/BoardHome'
import 'simplebar-react/dist/simplebar.min.css'
import './home.scss'
import '../../index.css'
import { Board } from '../Board/Board'
import { connect } from 'react-redux'
import { getBoards } from '../../store/modules/boards/actions'


type propsType = {
  boards: []
  getBoards: () => Promise<void>
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

// export default class Home extends React.Component {

class Home extends React.Component <propsType, stateType> {
  //без цього рендерять просто дужки {}
  async componentDidMount() {
    console.log('componentDidMount')

    // getBoards нічого не повертає, undefined
    await this.props.getBoards()
    
  }

  render() {
    // NOTE          return (<div>{JSON.stringify(this.props)}</div>);

    //   {
    //     "boards": {
    //         "boards": [
    //             {
    //                 "id": 1668032236310,
    //                 "title": "todos",
    //                 "custom": {
    //                     "description": "desc"
    //                 }
    //             },
    //             {
    //                 "id": 1668068755851,
    //                 "title": "Level 2.6 - CRUD",
    //                 "custom": {
    //                     "description": "Make a board creation..."
    //                 }
    //             }
    //         ]
    //     }
    // }
    console.log(this.props)



    //об'єкт з одним ключом boards значенням якого є масив також з назвою boards
   // console.log(boards)

    return (
      <>
        <div>{JSON.stringify(this.props)}</div>
        <div>{JSON.stringify(this.props.boards)}</div>
        <div>{JSON.stringify(this.state)}</div>
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
            <div>
              {/* {this.props.boards.boards.map(b => <div>{b}</div>)}                */}
            </div>
            <div>{this.props.boards.map((elem) => BoardHome(elem))}</div> 
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

//BUG TS7006: Parameter 'state' implicitly has an 'any' type.
//NOTE - додав :stateType до state - правильно?
//TS2339: Property 'boards' does not exist on type 'stateType'.

const mapStateToProps = (state: stateType) => ({
  ...state.boards,
})

export default connect(mapStateToProps, { getBoards })(Home)
