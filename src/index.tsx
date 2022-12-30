import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Board } from './pages/Board/Board' // Import a component from another file
import { Provider } from 'react-redux'
import store from './store/store'
import {
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import ErrorPage from './pages/ErrorRouterPage/error-page'

import './index.css'
import './iconfont/iconsfont.css'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'

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
  //BUG
  //  <React.StrictMode>
  //     <Provider store={store}>
  //         <App/>
  //     </Provider>,
  //  </React.StrictMode>
  //  utils.ts:781 Uncaught Error: useRoutes() may be used only in the context of a <Router> component.
  //  at invariant (utils.ts:781:1)
  //  at useRoutes (hooks.tsx:306:1)
  //  at Routes (components.tsx:383:1)
  //  at renderWithHooks (react-dom.development.js:16305:1)
  //  at mountIndeterminateComponent (react-dom.development.js:20074:1)
  //  at beginWork (react-dom.development.js:21587:1)
  //  at HTMLUnknownElement.callCallback (react-dom.development.js:4164:1)
  //  at Object.invokeGuardedCallbackDev (react-dom.development.js:4213:1)
  //  at invokeGuardedCallback (react-dom.development.js:4277:1)
  //  at beginWork$1 (react-dom.development.js:27451:1)
  // invariant @ utils.ts:781
  // useRoutes @ hooks.tsx:306
  // Routes @ components.tsx:383
  // renderWithHooks @ react-dom.development.js:16305
  // mountIndeterminateComponent @ react-dom.development.js:20074
  // beginWork @ react-dom.development.js:21587
  // callCallback @ react-dom.development.js:4164
  // invokeGuardedCallbackDev @ react-dom.development.js:4213
  // invokeGuardedCallback @ react-dom.development.js:4277
  // beginWork$1 @ react-dom.development.js:27451
  // performUnitOfWork @ react-dom.development.js:26557
  // workLoopSync @ react-dom.development.js:26466
  // renderRootSync @ react-dom.development.js:26434
  // recoverFromConcurrentError @ react-dom.development.js:25850
  // performConcurrentWorkOnRoot @ react-dom.development.js:25750
  // workLoop @ scheduler.development.js:266
  // flushWork @ scheduler.development.js:239
  // performWorkUntilDeadline @ scheduler.development.js:533
  // react-dom.development.js:18687 The above error occurred in the <Routes> component:

  //  at Routes (http://localhost:3000/static/js/bundle.js:44913:5)
  //  at App
  //  at Provider (http://localhost:3000/static/js/bundle.js:40572:5)

  <React.StrictMode>
    <Provider store={store}>
      {/* Без <BrowserRouter> - Error: useRoutes() may be used only in the context of a <Router> component */}
      {/* <BrowserRouter>
        <App />
      </BrowserRouter> */}

      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
