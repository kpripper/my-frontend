import {
  Routes,
  Route
} from 'react-router-dom'
import './App.scss'
import { Board } from './pages/Board/Board' 
import Home from './pages/Home/Home'
import NotFoundPage from './pages/ErrorPages/NotFoundPage'
import 'simplebar-react/dist/simplebar.min.css'
import { ProgressBar } from './pages/ProgressBar/ProgressBar'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'

function App() {
  const loadingState = useSelector((state: RootState) => state.loading)

  return (
    <>
      <Routes>
        <Route path="/*" element={<Home boards={[]} />} />
        <Route path="/board/:id" element={<Board />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {loadingState.loading ? <ProgressBar /> : ''}
    </>
  )
}

export default App
