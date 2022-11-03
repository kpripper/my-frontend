import React from 'react'
import logo from './logo.svg'
import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Board from './pages/Board/Board' // Import a component from another file
import { Link } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

function App() {
  return (
    <div className="App">
      <div className="header-container">header-container</div>
      <Link to="/board">/board</Link>
      <SimpleBar direction='rtl'  forceVisible="y" autoHide={false} style={{ maxHeight: 300 }}>
         {[...Array(50)].map((x, i) => (<p>{i}</p>))}
      </SimpleBar>
    </div>
  )
}

export default App
