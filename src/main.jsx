import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import {GoogleOAuthProvider } from '@react-oauth/google'
import { AppContext, AppContextProvider } from './context/AppContext.jsx'
import AppRouter from './router/router.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppContextProvider>
      <GoogleOAuthProvider clientId='486532263409-od38jpq2prg94q12p3v59p5d82vovrf0.apps.googleusercontent.com'>
        <AppRouter></AppRouter>
        
      </GoogleOAuthProvider>
    </AppContextProvider>
  </React.StrictMode>,
)
