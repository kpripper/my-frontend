import React, { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import './cardModalActions.scss'

interface CardModalActions {
  title: string
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const CardModalActions = (props: CardModalActions) => {
  const [text, setText] = useState('')
  const [option, setOption] = useState('')
  const [leftOption, setLeftOption] = useState('')
  const [rightOption, setRightOption] = useState('')

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
  }

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOption(event.target.value)
  }

  const handleLeftOptionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLeftOption(event.target.value)
  }

  const handleRightOptionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRightOption(event.target.value)
  }

  const handleSubmit = (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <div className="center-draggable">
      <Draggable >
        <div className="modal-actions">
          <div className="modal-actions-header">
            <h2>{props.title}</h2>
            <button className="close-button" onClick={props.onClose}>
              X
            </button>
          </div>
          <div className="modal-actions-body">
            <textarea placeholder="Enter some text" />
            <div>Copy to…</div>
            <select className="one-select">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
            <div className="two-selects">
              <select className="list-select">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
              <select className="card-select">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>
            <button>Submit</button>
          </div>
        </div>
      </Draggable>
    </div>
  )
}
