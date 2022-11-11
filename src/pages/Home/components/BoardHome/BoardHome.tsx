import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Board } from '../../../Board/Board'
import './boardhome.scss'

export default function BoardHome(props: { id: number; title: string }) {
  //props are displayed correctly
  console.log(BoardHome)
  console.log(props)

  return (
    <div className="board-home">
      <Link
        className="board-link"
        to={{ pathname: '/board/' + props.id }}
        state={{ id: props.id }}
      >
        <div className="board-fade">
          <h2 className="board-title">{props.title}</h2>
        </div>
      </Link>

      <Routes>
        <Route path="/board/:id" element={<Board />} />
      </Routes>
    </div>
  )
}
