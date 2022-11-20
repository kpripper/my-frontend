import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { isNullishCoalesce } from 'typescript'
import {
  createBoard,
  getBoards,
  showNotificationWithTimeout
} from '../../../../store/modules/boards/actions'
import './modaladdboard.scss'
import { AnyAction, Dispatch } from 'redux'
import { thunkDispatch } from '../../../../asyncActions/asyncAction'

import { ThunkAction } from 'redux-thunk';
import store from "../../../../../src/store/store"


interface AppState {
  boards: [];
  modal: boolean;
}

type ThunkActionType = ThunkAction<Promise<void>, AppState, unknown, AnyAction>;

export default function ModalAddBoard() {
  const [text, setText] = useState('')

  const newBoardValidation = (board: string) => {
    const pattern = /^[A-Z0-9 _\-.]*$/
    return pattern.test(board)
  }

 // const dispatch = useDispatch()

 type AppDispatch = typeof store.dispatch
 const useAppDispatch = () => useDispatch<AppDispatch>
 //const dispatch = useAppDispatch()

 const dispatch = useDispatch()

  const inputRef = useRef<HTMLInputElement>(null)

  dispatch<any>(showNotificationWithTimeout("rerer"))

  const createNewBoard = (): void => {
    //non-null assertion operator
    // https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-
    if (newBoardValidation(inputRef.current!.value)) {
      console.log(inputRef.current?.value, '))')
      dispatch<any> (createBoard(inputRef.current?.value))
      dispatch({ type: 'MODAL_IS_OPEN', payload: false });
    }
  }



  // const onChangeInput = (e: { target: { value: any } }): void => {
  //   const inputText = e.target.value;
  //   if (newBoardValidation(inputText)) {
  //     setText(inputText);
  //   }
  // };

  return (
    <div className="">
      <div className="add-board-input-container">
        <input
          ref={inputRef}
          id="addBoardInput"
          type="text"
          placeholder="Name of new board"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
          }}
        />
        <button className="create-new-board" onClick={createNewBoard}>
          Create board
        </button>
        {/* <button onClick={() => dispatch(({ type: 'CREATE_BOARD', payload: inputRef.current?.value }))}>thunkDispatch</button> */}
      </div>
    </div>
  )
}
