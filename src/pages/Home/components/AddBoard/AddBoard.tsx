import { getStaticContextFromError } from '@remix-run/router'
import { useReducer, useState } from 'react'
import Modal from 'react-modal'
import ModalAddBoard from '../ModalAddBoard/ModalAddBoard'
import './addboard.scss'
import store from '../../../../store/store'
import { ThunkAction } from 'redux-thunk';
import reducer from '../../../../store/reducer'

// const addNewBoard = () => {
//   alert('addNewBoard')
// }



export default function AddBoard() {

  const stateInit = store.getState()

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
  const [state, dispatch] = useReducer(reducer,stateInit);
  

 console.log("state AddBoard2", state)

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
        <ModalAddBoard />
      </Modal>
    </div>
  )
}
