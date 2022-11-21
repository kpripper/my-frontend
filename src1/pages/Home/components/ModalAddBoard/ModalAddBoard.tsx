import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { isNullishCoalesce } from 'typescript'
import {
  createBoard,
  getBoards,
} from '../../../../store/modules/boards/actions'
import './modaladdboard.scss'
import { Dispatch } from 'redux'
import { thunkDispatch } from '../../../../asyncActions/asyncAction'

export default function ModalAddBoard() {
  const [text, setText] = useState('')

  const newBoardValidation = (board: string) => {
    const pattern = /^[A-Z0-9 _\-.]*$/
    return pattern.test(board)
  }

  const dispatch = useDispatch()

  const inputRef = useRef<HTMLInputElement>(null)

  const createNewBoard = (): void => {
    //non-null assertion operator
    // https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-
    if (newBoardValidation(inputRef.current!.value)) {
      console.log(inputRef.current?.value, '))')
      dispatch<any>(createBoard(inputRef.current!.value))
    } else {
      alert('Name not valid!')
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
