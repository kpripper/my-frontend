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

function App() {
  const loadingState = useSelector((state: RootState) => state.loading)

  return (
    <>
      <Routes>
        {localStorage.getItem('isAuthentificated') === 'true' ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/board/:id" element={<Board />}>
              <Route path="/board/:id/card/:cardId/" element={<CardModal />} />
            </Route>
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/register" element={<Navigate to="/" />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
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
