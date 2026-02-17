import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/global.css'
import ImageProfile from './pages/ImageProfile/ImageProfile'
import Files from './pages/Files/Files'
import RequireAuth from './components/RequireAuth'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ImageProfile />} />
        <Route path="/files" element={
          <RequireAuth>
            <Files onBack={() => window.history.back()} />
          </RequireAuth>
        } />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
