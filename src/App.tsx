import { Routes, Route, Navigate } from 'react-router-dom'
import './App.scss'
import { Board } from './pages/Board/Board'
import Home from './pages/Home/Home'
import NotFoundPage from './pages/ErrorPages/NotFoundPage'
import 'simplebar-react/dist/simplebar.min.css'
import { ProgressBar } from './pages/ProgressBar/ProgressBar'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'
import { CardModal } from './pages/Board/components/CardModal/CardModal'
import LoginForm from './pages/LoginForm/LoginForm'
import RegisterForm from './pages/RegisterForm/RegisterForm'
import { useEffect, useState } from 'react'

function App() {
  const loadingState = useSelector((state: RootState) => state.loading)

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);
  
  // const isAuthenticated = !!localStorage.getItem('token')
  console.log('isAuthenticated', isAuthenticated, localStorage.getItem('token'))

  return (
    <>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Home setIsAuthenticated={setIsAuthenticated}/>} />
            <Route path="/board/:id" element={<Board />}>
              <Route path="/board/:id/card/:cardId/" element={<CardModal />} />
            </Route>
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/register" element={<Navigate to="/" />} />
            <Route path="/*" element={<Navigate to="/" />} /> 
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<RegisterForm />} />
            {/* <Route path="/*" element={<Navigate to="/login" />} /> */}
          </>
        )}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {loadingState.loading ? <ProgressBar /> : ''}
    </>
  )
}

export default App
