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
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'
import { Link } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import { getBoards } from './store/modules/boards/actions'
import { ProgressBar } from './pages/ProgressBar/ProgressBar'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'

const props = {
  boards: [],
  // getBoards: () => Promise<void>,
}

function App() {
  const loadingState = useSelector((state: RootState) => state.loading)
  const errorState = useSelector((state: RootState) => state.error.errorText)
  //const [loading, setLoading] = useState(false)

  // console.log("loading before Useeffect", loading)
  console.log('loadingState', loadingState)

  //якщо без useEffect - to many re-renders
  // useEffect(() => {
  //   setLoading(loadingState)
  // }, [loadingState])

  {
    /* @ts-ignore */
  }
  console.log('loadingState', loadingState.loading)

  // const keys = Object.keys(loadingState);

  return (
    <>
      <Routes>
        {/* NOTE які дані передавати в Home //{props, state}  */}
        {/* BUG що передавати в параметр Home boards?
      with React Router v6, since you're in charge
      of creating the element, you just pass a prop to the component
       as you normally would. 
       <Route path="/dashboard" element={<Dashboard authed={true} />} />
       */}

        <Route path="/*" element={<Home boards={[]} />} />
        <Route path="/board/:id" element={<Board />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {/* @ts-ignore */}
      {loadingState.loading ? <ProgressBar /> : ''}

      {/* {loadingState ? 
     
        Object.entries(loading).map((key,value) => 
          <div value={value} id={key}> {typeof key}</div>
      )
         : ''}   */}
    </>
  )
}

export default App
