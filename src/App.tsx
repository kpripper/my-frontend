import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import logo from './logo.svg'
import './App.scss'
import {Board} from './pages/Board/Board' // Import a component from another file
import Home from './pages/Home/Home'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'
import { Link } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/board/:id" element={<Board />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>

    // <div className="App">
    //   {/* text in <Home>text</Home> will not displayed. Return only */}
    //        <Home></Home>
    // </div>
  )
}

export default App
