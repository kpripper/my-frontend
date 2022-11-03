export default function Card(props: { title: string}) {
    return (
      <div className="card">
        <h2 className="card-title">{props.title}!</h2>
      </div>
    )
  }