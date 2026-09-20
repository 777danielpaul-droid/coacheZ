import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import { AiSettingsProvider } from './context/AiSettingsContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AiSettingsProvider>
        <App />
      </AiSettingsProvider>
    </ThemeProvider>
  </StrictMode>,
)
