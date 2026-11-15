import React from 'react'
import ReactDOM from 'react-dom/client'
import { LazyMotion, domMax } from 'motion/react'
import App from './App'
// fonts are served with the site (latin subset), so nothing waits on a third-party font host
import '@fontsource/instrument-sans/latin-400.css'
import '@fontsource/instrument-sans/latin-500.css'
import '@fontsource/instrument-sans/latin-600.css'
import '@fontsource/instrument-serif/latin-400.css'
import '@fontsource/instrument-serif/latin-400-italic.css'
import 'lenis/dist/lenis.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LazyMotion features={domMax} strict>
      <App />
    </LazyMotion>
  </React.StrictMode>,
)
