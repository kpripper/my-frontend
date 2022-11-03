import { ICard } from '../../../../common/interfaces/ICard'
import './list.scss'

export default function List(props: { title: string; cards: ICard[] }) {
  return (
    <div className="list">
      <h2 className="list-title">{props.title}</h2>
      {props.cards.map((card) => (
        <li className="list-card">{card.title}</li>
      ))}
      <li className="add-card">
        <span className="fa-solid fa-plus"></span>
        <span className="">Add a card</span>
      </li>
    </div>
  )
}
