import React from 'react'
import { Link } from 'react-router-dom'
import '../../index.css'

export default class NotFoundPage extends React.Component {
  render() {
    return (
      <div>
        {' '}
        Not found
        <Link className="" to="/">
          Main
        </Link>
      </div>
    )
  }
}
