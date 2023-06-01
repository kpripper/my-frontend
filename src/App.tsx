import { Routes, Route, useLocation } from 'react-router-dom'
import './App.scss'
import { Board } from './pages/Board/Board'
import Home from './pages/Home/Home'
import NotFoundPage from './pages/ErrorPages/NotFoundPage'
import 'simplebar-react/dist/simplebar.min.css'
import { ProgressBar } from './pages/ProgressBar/ProgressBar'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'
import { CardModal } from './pages/Board/components/CardModal/CardModal'

function App() {
  const loadingState = useSelector((state: RootState) => state.loading)

  return (
    <>
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/board/:id" element={<Board />}>
          <Route path="/board/:id/card/:cardId/" element={<CardModal />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {loadingState.loading ? <ProgressBar /> : ''}
    </>
  )
}

export default App
