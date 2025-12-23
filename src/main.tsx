import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import GlobalBackground from './components/GlobalBackground'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalBackground />
    <App />
  </React.StrictMode>,
)

