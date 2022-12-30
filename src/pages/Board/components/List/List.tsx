import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ICard } from '../../../../common/interfaces/ICard'
import { ISimpleCard } from '../../../../common/interfaces/ISimpleCard'
import {
  addCard,
  delCard,
  deleteList,
  edCard,
} from '../../../../store/modules/board/actions'
import './list.scss'
import instance from '../../../../api/request'
import config from '../../../../common/constants/api'
import { connect, shallowEqual, useDispatch, useSelector } from 'react-redux'
import { getBoard } from '../../../../store/modules/board/actions'
import { AxiosResponse } from 'axios'
import { newNameValidation } from '../../../../common/functions/functions'
import { createNoSubstitutionTemplateLiteral } from 'typescript'


export const List = (props: {
  id: number
  title: string
  cards: ISimpleCard[]
  //getBoard: (id: number) => Promise<AxiosResponse<any, any> | undefined>
}) => {
  const { id: boardId } = useParams()

  console.log('cards', props.cards)

  const [listActionsShown, setListActionsShown] = useState(false)
  const [addCardActionsShown, setAddCardActionsShown] = useState(false)
  const [editCardShown, setEditCardShown] = useState(false)
  const [addCardShown, setAddCardShown] = useState(true)

  useEffect(() => {}, [props.cards])

  const handleListActions = () => {
    setListActionsShown((current) => !current)
    // setListActionsShown(true);
  }

  const handleAddCardActions = () => {
    setAddCardActionsShown((current) => !current)
    setAddCardShown((current) => !current)
  }

  const handleEditCard = (cardID: string) => {
    console.log('cardID', cardID)
    ;(document.getElementById(cardID) as HTMLElement).setAttribute(
      'contenteditable',
      'true'
    )
    ;(document.getElementById(cardID) as HTMLElement).focus()

    let cardTitle = document.activeElement?.firstChild?.textContent as string
    console.log(cardTitle)

    // ;(document.querySelector('icon-edit') as HTMLElement).style.display = 'none'
    ;(document.getElementById(cardID) as HTMLInputElement).addEventListener(
      'input',
      (e) => {
        cardTitle = (e.target as HTMLInputElement).firstChild?.textContent as string
        console.log(`${cardID} change ${cardTitle}`)
      }
    )

    const save = document.createElement('input')
    save.classList.add('save-card-edit')
    save.setAttribute('value', 'Save')
    save.setAttribute('type', 'submit')
    ;(document.getElementById(cardID) as HTMLElement).after(save)
    save.addEventListener('click', () => {
      editCard(cardID, cardTitle)
    })

    const deleteCard = document.createElement('input')
    deleteCard.classList.add('delete-card')
    deleteCard.setAttribute('value', 'Delete')
    deleteCard.setAttribute('type', 'submit')
    ;(document.getElementById(cardID) as HTMLElement).after(deleteCard)
    deleteCard.addEventListener('click', () => {
      deleteCardOnAPI(cardID)
    })
  }

  const editCard = (cardID: string, title: string) => {
    ;(document.querySelector('.save-card-edit') as HTMLElement).remove()
    ;(document.querySelector('.delete-card') as HTMLElement).remove()
    ;(document.getElementById(cardID) as HTMLElement).removeAttribute(
      'contenteditable'
    )
    dispatch<any>(edCard(boardId!, props.id, cardID, title))
  }

  const deleteCardOnAPI = (cardID: string) => {
    ;(document.querySelector('.save-card-edit') as HTMLElement).remove()
    ;(document.querySelector('.delete-card') as HTMLElement).remove()
    ;(document.getElementById(cardID) as HTMLElement).removeAttribute(
      'contenteditable'
    )
    dispatch<any>(delCard(boardId!, cardID))
  }

  const dispatch = useDispatch()

  // const editCardTitleToggle = () => {
  //   //TODO - показувати модальне вікно в конкретному листі або в координатах кліка
  //   const elemH1 = document.querySelector('.add-card-title') as HTMLElement
  //   const elemInput = document.querySelector('.inp-card-title') as HTMLElement

  //   if (elemH1.style.display !== 'none') {
  //     console.log(
  //       "editBoardTitleToggle if elemH1.style.display !== 'none",
  //       elemH1.style.display,
  //       elemInput.style.display
  //     )
  //     elemH1.style.display = 'none'
  //     elemInput.style.display = 'block'
  //     //elemInput. = elemH1.textContent
  //     console.log(
  //       "editBoardTitleToggle if elemH1.style.display !== 'none switch",
  //       elemH1.style.display,
  //       elemInput.style.display
  //     )
  //     elemInput.focus()
  //   } else {
  //     elemInput.blur()
  //     console.log(
  //       'editBoardTitleToggle else',
  //       elemH1.style.display,
  //       elemInput.style.display
  //     )
  //     elemH1.style.display = 'block'
  //     elemInput.style.display = 'none'
  //     console.log(
  //       'editBoardTitleToggle else switch',
  //       elemH1.style.display,
  //       elemInput.style.display
  //     )
  //   }
  // }

  // const inputKeyDownCard = (ev: React.KeyboardEvent<HTMLInputElement>) => {
  //   console.log('ev target', (ev.target as HTMLInputElement).value)
  //   if (ev.key === 'Enter') {
  //     if (newNameValidation((ev.target as HTMLInputElement).value)) {
  //       // alert('Name good key!')
  //       dispatch<any>(
  //         addCard(
  //           (ev.target as HTMLInputElement).value,
  //           Number(boardId),
  //           props.id,
  //           props.cards.length + 1
  //         )
  //       )
  //       dispatch<any>(getBoard(Number(boardId)))

  //       editCardTitleToggle()
  //     } else {
  //       alert('Name not valid inputKeyDown!')
  //       editCardTitleToggle()
  //     }
  //   }
  // }

  // const inputOnBlurCard = (ev: React.FocusEvent<HTMLInputElement>) => {
  //   if (newNameValidation(ev.target.value)) {
  //     //  alert('Name good blur!')

  //     dispatch<any>(getBoard(Number(boardId)))

  //     editCardTitleToggle()
  //   } else {
  //     // alert('Name not valid inputOnBlur!')
  //     editCardTitleToggle()
  //   }
  // }

  // const getCardTitleToEdit = (id: number, title: string) => {
  //   console.log('card to edit', id)
  // }

  return (
    <div key={props.title} className="list" id="">
      <div className="list-header">
        <h2 className="list-title">{props.title}</h2>
        <div
          className="list-menu icon-dots-three"
          onClick={handleListActions}
        ></div>
      </div>

      {props.cards.map((card, index) => (
        <li key={index} className="list-card" id={String(card.id)}>
          <div className="card-title">{card.title}</div>
          <div
            className="icon-edit icon-card-edit"
            id={String(card.id)}
            onClick={() => {
              handleEditCard(String(card.id))
              //  getCardTitleToEdit(card.id, card.title)
            }}
          ></div>
        </li>
      ))}

      {addCardShown && (
        <li className="add-card">
          <span className="icon-plus"></span>
          <span className="add-card-title" onClick={handleAddCardActions}>
            Add a card
          </span>
        </li>
      )}

      {listActionsShown && (
        <ListActions
          handler={handleListActions}
          id={props.id}
          boardId={boardId!}
        />
      )}

      {addCardActionsShown && (
        <AddCardActions
          handler={handleAddCardActions}
          boardId={boardId!}
          listID={props.id}
          position={props.cards.length + 1}
        />
      )}

      {/* {editCardShown && (
        <EditCard
          handler={handleEditCard}
          // boardId={boardId!}
          // listID={props.id}
          // position={props.cards.length + 1}
          title=
        />
      )} */}
    </div>
  )
}
// function ListActions(handler) { - дає помилку
//  Expected `onClick` listener to be a function, instead got a value of `object` type.
// відповідь - отримати ключ з цього об'єкта
//  https://stackoverflow.com/questions/71262683/react-expected-onclick-listener-to-be-a-function-instead-got-a-value-of-obj
function ListActions({
  handler,
  boardId,
  id: listID,
}: {
  handler: () => void
  boardId: string
  id: number
}) {
  const dispatch = useDispatch()

  return (
    <div className="list-actions">
      <div className="list-actions-header">
        <h2 className="list-actions-title">List Actions</h2>
        <div className="icon-close" onClick={handler}></div>
      </div>
      <div className="list-list-actions">
        <ul>
          {/* <li onClick={() => delList(boardId, id)}>Delete list</li> */}
          <li
            onClick={(e) => {
              dispatch<any>(deleteList(boardId, listID))
              handler()
            }}
          >
            Delete list
          </li>
        </ul>
      </div>
    </div>
  )
}

function AddCardActions({
  handler,
  boardId,
  listID,
  position,
}: {
  handler: () => void
  boardId: string
  listID: number
  position: number
}) {
  const dispatch = useDispatch()

  const addCardOnEnter = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      if (newNameValidation((ev.target as HTMLInputElement).value)) {
        dispatch<any>(
          addCard(
            (ev.target as HTMLInputElement).value,
            Number(boardId),
            listID,
            position
          )
        )
        handler()
      } else {
        alert('Name not valid!')
      }
    }
  }

  const addCardOnButton = () => {
    const elemInpCardTitle = document.querySelector(
      '.inp-cardtitle'
    ) as HTMLInputElement

    elemInpCardTitle.focus()

    if (newNameValidation(elemInpCardTitle.value)) {
      console.log('elemInpCardTitle.value', elemInpCardTitle.value)

      dispatch<any>(
        addCard(elemInpCardTitle.value, Number(boardId), listID, position)
      )
      handler()
    } else {
      alert('Name not valid!')
    }
  }

  return (
    <div className="add-cardtitle-form">
      <input
        className="inp-cardtitle"
        type="text"
        name="new-card"
        onKeyDown={addCardOnEnter}
        placeholder="Enter card title..."
        autoFocus
      />
      <div className="add-cardtitle-controls">
        <button className="cardtitle-add-button" onClick={addCardOnButton}>
          Add card title
        </button>
        <span
          onClick={handler}
          className="icon-close icon-close-cardtitle"
        ></span>
      </div>
    </div>
  )
}

function EditCard({
  handler,
  // boardId,
  // listID,
  // position,
  title,
}: {
  handler: () => void
  // boardId: string
  // listID: number
  // position: number
  title: string
}) {
  const dispatch = useDispatch()

  const addCardOnEnter = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      if (newNameValidation((ev.target as HTMLInputElement).value)) {
        // dispatch<any>(
        //   addCard(
        //     (ev.target as HTMLInputElement).value,
        //     Number(boardId),
        //     listID,
        //     position
        //   )
        // )
        handler()
      } else {
        alert('Name not valid!')
      }
    }
  }

  const addCardOnButton = () => {
    const elemInpCardTitle = document.querySelector(
      '.inp-cardtitle'
    ) as HTMLInputElement

    elemInpCardTitle.focus()

    if (newNameValidation(elemInpCardTitle.value)) {
      console.log('elemInpCardTitle.value', elemInpCardTitle.value)

      // dispatch<any>(
      //   addCard(elemInpCardTitle.value, Number(boardId), listID, position)
      // )
      handler()
    } else {
      alert('Name not valid!')
    }
  }

  return (
    <div className="add-cardtitle-form">
      <input
        className="inp-cardtitle"
        type="text"
        name="new-card"
        onKeyDown={addCardOnEnter}
        placeholder={title}
        autoFocus
      />
      <div className="add-cardtitle-controls">
        <button className="cardtitle-add-button" onClick={addCardOnButton}>
          Save
        </button>
        <span
          onClick={handler}
          className="icon-close icon-close-cardtitle"
        ></span>
      </div>
    </div>
  )
}
