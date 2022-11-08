import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {Board} from './pages/Board/Board' // Import a component from another file
import { Provider } from 'react-redux';
import store from "./store/store";


import './index.css'
import './css/iconsfont.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(

//   TODO 2.4
//  и заменяем на такую запись:
//  <React.StrictMode>
//     <Provider store={store}>
//         <App/>
//     </Provider>,
//  </React.StrictMode>
  
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
