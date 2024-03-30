import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store } from './store/store.jsx'
import { Provider } from 'react-redux'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import HomePage from './Pages/HomePage.jsx'
import CreateAccount from './Pages/CreateAccount.jsx'
import MainPage from './Pages/MainPage.jsx'


  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage/>,    
    },
    {
        path:"/signup",
        element : <CreateAccount/>

    },
    {
        path:"/main",
        element : <MainPage/>

    },
    {
      path: "/app",
      element: <App></App>,
      
    },
  ]);

ReactDOM.createRoot(document.getElementById('root')).render(

    <Provider store={store}>
       <RouterProvider router={router} />
    </Provider>,

)
