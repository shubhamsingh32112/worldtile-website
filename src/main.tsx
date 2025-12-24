import React from 'react'
import ReactDOM from 'react-dom/client'
import gsap from 'gsap'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import App from './app/App'
import './styles/index.css'

// Register GSAP ScrollToPlugin
gsap.registerPlugin(ScrollToPlugin)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

