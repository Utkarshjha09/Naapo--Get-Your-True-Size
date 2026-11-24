import React from 'react'
import ReactDOM from 'react-dom/client'
import { LazyMotion, domMax } from 'motion/react'
import App from './App'
// fonts are served with the site (latin subset), so nothing waits on a third-party font host
// Archivo (weight + width axes) for headlines, Geist for everything else; browsers fetch only the latin file
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/geist/wght.css'
import 'lenis/dist/lenis.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LazyMotion features={domMax} strict>
      <App />
    </LazyMotion>
  </React.StrictMode>,
)
