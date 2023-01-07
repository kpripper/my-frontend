import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Board } from './pages/Board/Board' 
import { Provider } from 'react-redux'
import store from './store/store'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import ErrorPage from './pages/ErrorPages/error-page'
import './index.css'
import './iconfont/iconsfont.css'
import NotFoundPage from './pages/ErrorPages/NotFoundPage'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/board/:id',
    element: <Board />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)


