import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

function applyInitialTheme() {
  try {
    const stored = localStorage.getItem('darkMode');
    if (stored === 'true') document.documentElement.classList.add('dark');
    else if (stored === 'false') document.documentElement.classList.remove('dark');
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }

    
    window.addEventListener('storage', (e) => {
      if (e.key === 'darkMode') {
        if (e.newValue === 'true') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      }
    });
  } catch (e) {
    
    console.error('Theme init error', e);
  }
}

applyInitialTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
