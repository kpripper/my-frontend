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

  //https://github.com/kpripper/trello-priv/blob/cd1be25a107d250adc78315364cca1dfa13cc14b/src/App.tsx
  // return (
  //   <Routes>
  //     {/* NOTE які дані передавати в Home //{props, state}  */}
  //     {/* BUG що передавати в параметр Home boards?
  //     with React Router v6, since you're in charge
  //     of creating the element, you just pass a prop to the component
  //      as you normally would.
  //      <Route path="/dashboard" element={<Dashboard authed={true} />} />
  //      */}

  //     <Route  path="/" element={ <Home />}  />
  //     <Route path="/board/:id" element={<Board />} />
  //     <Route path="*" element={<NotFoundPage />} />
  //   </Routes>

  //   // <div className="App">
  //   //   {/* text in <Home>text</Home> will not displayed. Return only */}
  //   //        <Home></Home>
  //   // </div>
  // )

  const location = useLocation()
  const background = location.state && location.state.background



  return (
    <>
      {/* <Routes location={background || location}>
        <Route path="/*" element={<Home />} />
        <Route path="/board/:id" element={<Board />} />
        <Route path="/board/:board_id/card/:cardId/" element={<CardModal />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path="/board/:board_id/card/:card_id/"
            element={<CardModal />}
          />
        </Routes>
      )} */}

      <Routes>
        <Route path="/" element={<Home />} />
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
