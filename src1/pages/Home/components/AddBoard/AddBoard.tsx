import { getStaticContextFromError } from '@remix-run/router'
import { useRef, useState } from 'react'
import Modal from 'react-modal'
import ModalAddBoard from '../ModalAddBoard/ModalAddBoard'
import './addboard.scss'
import store from '../../../../store/store'
import { useDispatch } from 'react-redux'
import { createBoard } from '../../../../store/modules/boards/actions'

//   alert('addNewBoard')
// }

export default function AddBoard() {
  const state = store.getState()

  //видає жах

  //   {
  //     "board": {
  //         "0": {
  //             "id": 1668032236310,
  //             "title": "todos",
  //             "custom": {
  //                 "description": "desc"
  //             }
  //         },
  //         "1": {
  //             "id": 1668872728878,
  //             "title": "1"
  //         },
  //         "2": {
  //             "id": 1668872749112,
  //             "title": "2"
  //         }
  //     },
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
  //                 "id": 1668872728878,
  //                 "title": "1"
  //             },
  //             {
  //                 "id": 1668872749112,
  //                 "title": "2"
  //             }
  //         ]
  //     },
  //     "user": {
  //         "0": {
  //             "id": 1668032236310,
  //             "title": "todos",
  //             "custom": {
  //                 "description": "desc"
  //             }
  //         },
  //         "1": {
  //             "id": 1668872728878,
  //             "title": "1"
  //         },
  //         "2": {
  //             "id": 1668872749112,
  //             "title": "2"
  //         }
  //     }
  // }

  // console.log("state AddBoard", state)

  const [modalIsOpen, setModalIsOpen] = useState(false)

  console.log('state AddBoard2', state)

  const setModalIsOpenToTrue = () => {
    setModalIsOpen(true)
  }

  const setModalIsOpenToFalse = () => {
    setModalIsOpen(false)
  }

  const customModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgb(242, 242, 242)',
    },
  }

  const [text, setText] = useState('')

  const newBoardValidation = (board: string) => {
    const pattern = /^[A-Za-z0-9 _\-.]*$/
    return pattern.test(board)
  }

  const inputRef = useRef<HTMLInputElement>(null)

  const dispatch = useDispatch()

  const createNewBoard = (): void => {
    //non-null assertion operator
    // https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-
    if (newBoardValidation(inputRef.current!.value)) {
      console.log(inputRef.current?.value, '))')
      dispatch<any>(createBoard(inputRef.current!.value))
      setModalIsOpenToFalse()
    } else {
      alert('Name not valid!')
    }
  }

  

  return (
    <div className="add-board">
      <div className="add-board-button" onClick={setModalIsOpenToTrue}>
        <span className="fa-solid fa-plus"></span>
        {/* <span className="">Add board</span> */}
        <div className="add-board-new-board">Add board</div>
      </div>
      <Modal
        style={customModalStyles}
        appElement={document.getElementById('root') as HTMLElement}
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      >
        <button onClick={setModalIsOpenToFalse}>x</button>
        {/* <ModalAddBoard /> */}
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
      </Modal>
    </div>
  )
}
