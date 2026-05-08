import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary'
import './index.css'
import App from './App'

// Ensure any stale dark mode class from previous sessions is removed
document.documentElement.classList.remove('dark')
localStorage.removeItem('wayshift-theme')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
