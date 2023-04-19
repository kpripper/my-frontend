import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Board } from './pages/Board/Board'
import { Provider } from 'react-redux'
import store from './store/store'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './pages/ErrorPages/error-page'
import './index.css'
import './iconfont/iconsfont.css'
import NotFoundPage from './pages/ErrorPages/NotFoundPage'
import Home from './pages/Home/Home'
import { useLocation } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <Provider store={store}>
    {/* Без <BrowserRouter> - Error: useRoutes() may be used only in the context of a <Router> component */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)

// const router = createBrowserRouter([
//   {
//     path: '/',
//    //element: <Home />,
//     element: <App />,
//     errorElement: <ErrorPage />,
//   },
//   {
//     path: '/board/:id',
//     element: <Board />,
//     children: [
//       {
//         path: '/board/:id/card/:cardId/',
//         element: <CardModal />,
//       },
//     ]
//   },
//   {
//     path: '*',
//     element: <NotFoundPage />,
//   },
// ])

// root.render(
//   // <React.StrictMode>
//     <Provider store={store}>
//       <RouterProvider router={router} />
//     </Provider>
//   // </React.StrictMode>
// )
