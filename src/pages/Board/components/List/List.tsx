import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ICard } from '../../../../common/interfaces/ICard'
import { ISimpleCard } from '../../../../common/interfaces/ISimpleCard'
import { deleteList } from '../../../../store/modules/board/actions'
import './list.scss'
import instance from '../../../../api/request'
import config from '../../../../common/constants/api'
import { connect, useDispatch } from 'react-redux'
import { getBoard } from '../../../../store/modules/board/actions'
import { AxiosResponse } from 'axios'

export const List = (props: {
  id: number
  title: string
  cards: ISimpleCard[]
  //getBoard: (id: number) => Promise<AxiosResponse<any, any> | undefined>
}) => {
  // console.log(props)
  //console.log('list useParams ', useParams())

  const { id: boardId } = useParams()

  const [listActionsShown, setListActionsShown] = useState(false)

  const handleListActionsClick = () => {
    // 👇️ toggle shown state
    setListActionsShown((current) => !current)

    // 👇️ or simply set it to true
    // setListActionsShown(true);
  }

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch<any>(getBoard(props.id))
  }, [])

  return (
    <div key={props.title} className="list">
      <div className="list-header">
        <h2 className="list-title">{props.title}</h2>
        <div
          className="list-menu icon-dots-three"
          onClick={handleListActionsClick}
        ></div>
      </div>

      {props.cards.map((card, index) => (
        <li key={index} className="list-card">
          {card.title}
        </li>
      ))}
      <li className="add-card">
        <span className="icon-plus"></span>
        <span className="">Add a card</span>
      </li>
      {/* 👇️ show component on click */}
      {listActionsShown && (
        <ListActions
          handler={handleListActionsClick}
          id={props.id}
          boardId={boardId!}
        />
      )}
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
  id,
}: {
  handler: () => void
  boardId: string
  id: number
}) {
  const dispatch = useDispatch()

  const delList = async (boardId: string, id: number) => {
    try {
      const resDelete = await instance.delete(
        config.boards + '/' + boardId + '/list/' + id
      )
      console.log('resDelete  delList ', resDelete)
      dispatch<any>(getBoard(+boardId))
    } catch (e) {
      console.log('e  delList ', e)
    }
  }

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
              dispatch<any>(deleteList(boardId, id))
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

// const mapStateToProps = (state: any) => {
//   console.log('list state', state)
//   const { id, title, cards } = state
//   console.log('List is state to props', title)

//   return state
//   //return state
// }

// export const List = connect( mapStateToProps, { getBoard })(ListComponent)
