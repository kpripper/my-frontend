import { Routes, Route, Link } from 'react-router-dom'
import { Board } from '../../../Board/Board'
import './boardhome.scss'
import { deleteBoard } from '../../../../store/modules/board/actions'
import store from '../../../../store/store'
import { useState } from 'react'

export default function BoardHome(props: { id: number; title: string }) {
  const direction = Math.round(Math.random() * 360)
  const hue = Math.floor(Math.random() * 360)
  const randomAlpha = Math.round(Math.random() * 20) / 10
  const style = {
    background: `linear-gradient(${direction}deg, hsla(${hue}, 50%, 50%,${randomAlpha}), hsla(${
      hue + 60
    }, 50%, 50%,${randomAlpha}))`,
  }

  const [color, setColor] = useState(style)

  return (
    <div key={props.id} style={color} className={`board-home id${props.id}`}>
      <Link
        className="board-link"
        to={{ pathname: '/board/' + props.id }}
        state={{ id: props.id }}
      >
        <div className="board-fade">
          <h2 className="board-title">{props.title}</h2>
          <div
            className="delete-board"
            id={String(props.id)}
            onClick={(e) => {
              e.preventDefault()
              try {
                const target = e.target as HTMLElement
                if (target.id !== String(props.id)) {
                  return
                }
              } catch (err) {
                console.log(err)
              }
              store.dispatch(deleteBoard(String(props.id)))
            }}
          >
            Delete board
          </div>
        </div>
      </Link>
      <Routes>
        <Route path="/board/:id" element={<Board />} />
      </Routes>
    </div>
  )
}
