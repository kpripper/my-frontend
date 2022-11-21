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
import { getBoards } from './store/modules/boards/actions'

const props = {
  boards: [],
 // getBoards: () => Promise<void>,
}
const state = {}

function App() {
  return (
    <Routes>
      {/* NOTE які дані передавати в Home //{props, state}  */}
      {/* BUG що передавати в параметр Home boards?
      with React Router v6, since you're in charge
      of creating the element, you just pass a prop to the component
       as you normally would. 
       <Route path="/dashboard" element={<Dashboard authed={true} />} />
       */}

      <Route  path="/" element={ <Home boards={[]}  />}  />
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
