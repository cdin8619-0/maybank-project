import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot((globalThis as any).document?.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
