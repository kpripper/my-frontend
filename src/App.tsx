import React, { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigation,
  useNavigate,
} from 'react-router-dom'
import logo from './logo.svg'
import './App.scss'
import { Board } from './pages/Board/Board' // Import a component from another file
import Home from './pages/Home/Home'
import NotFoundPage from './pages/ErrorPages/NotFoundPage'
import { Link } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import { getBoards } from './store/modules/boards/actions'
import { ProgressBar } from './pages/ProgressBar/ProgressBar'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'

function App() {
  const loadingState = useSelector((state: RootState) => state.loading)
  const errorState = useSelector((state: RootState) => state.error.errorText)
  //const [loading, setLoading] = useState(false)

  return (
    <>
      <Routes>
        <Route path="/*" element={<Home boards={[]} />} />
        <Route path="/board/:id" element={<Board />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {/* @ts-ignore */}
      {loadingState.loading ? <ProgressBar /> : ''}
    </>
  )
}

export default App
