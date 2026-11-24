import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { lazy, Suspense } from 'react'
import './index.css'

const isAdminRoute = window.location.pathname.replace(/\/+$/, '') === '/admin'
const Page = isAdminRoute
  ? lazy(() => import('./Admin.tsx'))
  : lazy(() => import('./App.tsx'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  </StrictMode>,
)
