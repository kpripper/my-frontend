import { useRef, useState } from 'react'
import Modal from 'react-modal'
import './addboard.scss'
import { createBoard } from '../../../../store/modules/board/actions'
import { newNameValidation } from '../../../../common/functions/functions'
import { Alert, Snackbar } from '@mui/material'
import store from '../../../../store/store'

export default function AddBoard() {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [isErrorValidation, setErrorValidationOpen] = useState(false)
  const [boardName, setBoardName] = useState('')

  const setModalIsOpenToTrue = () => {
    setBoardName('')
    setModalIsOpen(true)
  }

  const setModalIsOpenToFalse = () => {
    setModalIsOpen(false)
  }

  const inputRef = useRef<HTMLInputElement>(null)

  const createNewBoard = (): void => {
    if (newNameValidation(inputRef.current!.value)) {
      store.dispatch(createBoard(inputRef.current!.value))
      setModalIsOpenToFalse()
    } else {      
      setErrorValidationOpen(true)
    }
  }

  const handleKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      if (newNameValidation((ev.target as HTMLInputElement).value)) {
        store.dispatch(createBoard(inputRef.current!.value))
        setModalIsOpenToFalse()
      } else {
        setErrorValidationOpen(true)
      }
    }
  }

  const handleSnackbarClose = () => {
    setErrorValidationOpen(false)    
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
        <span className="icon-plus"></span>
        <div className="add-board-new-board">Add board</div>
      </div>
      <Modal
        style={customModalStyles}
        appElement={document.getElementById('root') as HTMLElement}
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      >
        <div className="whole-modal">
          <div className="button-modal-close">
            <button
              className="icon-close"
              onClick={setModalIsOpenToFalse}
            ></button>
          </div>

          <div className="">
            <div className="add-board-input-container">
              <input
                ref={inputRef}
                id="addBoardInput"
                type="text"
                placeholder="Name of new board"
                value={boardName}
                onChange={(e) => {
                  setBoardName(e.target.value)
                }}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <button className="create-new-board" onClick={createNewBoard}>
                Create board
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Snackbar open={isErrorValidation}>
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: '100%' }}
        >
          {'Board name ' + boardName + ' is not valid'}
        </Alert>
      </Snackbar>
    </div>
  )
}
