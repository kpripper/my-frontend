import React from 'react'
import { AnyAction, Dispatch } from 'redux'
import { Routes, Route, Link } from 'react-router-dom'
import {Board} from '../../../Board/Board'
import './boardhome.scss'
import { deleteBoard } from '../../../../store/modules/board/actions'
import { useDispatch } from 'react-redux'

export default function BoardHome(props: { id: number; title: string }) {
   console.log('BoardHome ', props)

  const dispatch = useDispatch()

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
                // you said this does not work but you still need this because it works both ways parent -> child, child->parent
                // e.stopPropagation()
                const target = e.target as HTMLElement
                if (target.id !== String(props.id)) {
                  return
                }
                // then execute delete logic
              } catch (err) {
                alert(err)
              }
             
              dispatch<any>(
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
