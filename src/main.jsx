import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext' // <-- Import

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider> {/* <-- On enveloppe l'App */}
      <App />
    </ThemeProvider>
  </StrictMode>,
)