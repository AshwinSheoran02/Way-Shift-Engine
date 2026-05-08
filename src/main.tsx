import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary'
import './index.css'
import App from './App'
import { initAnalytics } from './services/analyticsService'

// Initialize Firebase Analytics
initAnalytics()

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
