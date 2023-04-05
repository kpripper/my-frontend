import { useState } from 'react'
import { Slot } from './components/Slot/Slot'
import { SlotProps } from '../../common/types'

interface AddInputProps {
  // onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  // onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
  handleSave: (value: string) => void
  defaultValue: string
  source: string
}

export const AddInput = ({
  handleSave,
  defaultValue,
  source,
}: AddInputProps) => {
  const [isAdd, setIsAdd] = useState(false)
  const [title, setTitle] = useState('')
  // const [isInputListName, setInputListNameVisibity] = useState(false)
  // const [isDragOver, setDragOver] = useState(false)

  if (!isAdd) {
    return (
      <>
        <div
          className="open-add-list"
          onClick={() => setIsAdd((prev) => !prev)}
        >
          <span className="icon-plus"></span>
          <span className="add-list-span">
            {source === 'list' ? 'Add new list' : 'Add card'}
          </span>
        </div>
      </>
    )
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave(event.currentTarget.value)
      setIsAdd(false)
      setTitle('')
    }
  }

  return (
    <div className="adding-list">
      <input
        className="input-list-title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={(e) => {
          if (e.target.value === '') {
            setIsAdd(false)
            setTitle(defaultValue)
          }
        }}
        autoFocus
      />
      <div className="add-list-controls">
        <button
          className="list-add-button"
          onClick={() => {
            handleSave(title)
            setIsAdd(!isAdd)
            setTitle('')
          }}
        >
          {source === 'list' ? 'Add list' : 'Add new card'}
        </button>
        <button className="invisible-button">
          <span
            className="icon-close icon-close-addlist"
            onClick={() => {
              setIsAdd(!isAdd)
            }}
          ></span>
        </button>
      </div>
    </div>
  )
}
