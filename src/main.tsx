import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/global.css'
import Files from './pages/Files/Files'
import RequireAuth from './components/RequireAuth'
import GlassProfile from './pages/GlassProfile/GlassProfile'
import LandingPage from './pages/GuroZord/LandingPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GlassProfile />} />
        <Route path="/gurozord" element={<LandingPage />} />
        <Route path="/files" element={
          <RequireAuth>
            <Files onBack={() => window.history.back()} />
          </RequireAuth>
        } />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
