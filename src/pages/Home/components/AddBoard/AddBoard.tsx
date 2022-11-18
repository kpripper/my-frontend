import { useState } from 'react'
import Modal from 'react-modal'
import ModalAddBoard from '../ModalAddBoard/ModalAddBoard'
import './addboard.scss'

// const addNewBoard = () => {
//   alert('addNewBoard')
// }



export default function AddBoard() {
  // console.log('Modal ')

  const [modalIsOpen, setModalIsOpen] = useState(false)

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
