import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/global.css'
import ImageProfile from './pages/ImageProfile/ImageProfile'
import Files from './pages/Files/Files'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ImageProfile />} />
        <Route path="/files" element={<Files onBack={() => window.history.back()} />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
