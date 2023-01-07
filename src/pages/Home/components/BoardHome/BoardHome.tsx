import { Routes, Route, Link } from 'react-router-dom'
import {Board} from '../../../Board/Board'
import './boardhome.scss'
import { deleteBoard } from '../../../../store/modules/board/actions'
import store from '../../../../store/store'

export default function BoardHome(props: { id: number; title: string }) {
  return (
    <div key={props.id} className={`board-home id${props.id}`}>
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
              store.dispatch(
                deleteBoard(String(props.id))
              )
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
