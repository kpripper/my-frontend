import { useState } from 'react'

interface AddInputProps {
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

  if (!isAdd) {
    return (
      <>
        <div className="open-add-list" onClick={() => setIsAdd(prev => !prev)}>
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
        onChange={e => setTitle(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={e => {
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
        <button className="invisible-button adding-close-button-parent">
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
