import React from 'react'
import {AnyAction, Dispatch} from "redux";
import { Routes, Route, Link } from 'react-router-dom'
import { Board } from '../../../Board/Board'
import './boardhome.scss'
import { deleteBoard } from '../../../../store/modules/boards/actions';


export default function BoardHome(props: { id: number; title: string }) {
 // console.log('BoardHome ', props)

  return (
    <div key={props.id} className={`board-home id${props.id}`}>
      <Link
        className="board-link"
        to={{ pathname: '/board/' + props.id }}
        state={{ id: props.id }}
      >
        <div className="board-fade">
          <h2 className="board-title">{props.title}</h2>
          <div className="delete-board" id={String(props.id)} onClick={(e) => {
            try {
              e.stopPropagation();
              alert('stopPropagation')
            }  catch(err) {
              alert(err)
            }
             
         //  (document.querySelector(`.id${props.id}`) as HTMLElement).style.pointerEvents = "none"
            deleteBoard((e.target as HTMLElement).getAttribute('id')!)
          }}>Delete board</div>
        </div>
      </Link>

      <Routes>
        <Route path="/board/:id" element={<Board />} />
      </Routes>
    </div>
  )
}
