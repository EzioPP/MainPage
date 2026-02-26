import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import SocialLink from '../../components/SocialLink/SocialLink'
import AccentLine from '../../components/AccentLine'
import Vignette from '../../components/Vignette'
import GlitchLogo from '../../components/GlitchLogo'
import LoginPopover from '../../components/LoginPopover/LoginPopover'
import Dashboard from '../Dashboard/Dashboard'
import './GlassProfile.css'

interface Particle {
  id: number
  size: number
  left: number
  top: number
  duration: number
  delay: number
  opacity: number
  driftClass: string
}

// ── GuroZord inline SVG icon (eye only, no background) ──────────────
function GuroZordIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gp-ig" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="10.25"
        stroke="url(#gp-ig)" strokeOpacity="0.35" strokeWidth="1.5" />
      <path d="M10 32 Q32 14 54 32 Q32 50 10 32 Z"
        stroke="url(#gp-ig)" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <circle cx="32" cy="32" r="8"  stroke="url(#gp-ig)" strokeWidth="2" fill="none" />
      <circle cx="32" cy="32" r="3"  fill="url(#gp-ig)" />
    </svg>
  )
}

function GlassProfile() {
  const navigate = useNavigate()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem('authToken')))

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        size: 20 + Math.random() * 40,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 10 + Math.random() * 20,
        delay: -Math.random() * 20,
        opacity: 0.3 + Math.random() * 0.3,
        driftClass: `glass-profile__particle--path-${(i % 4) + 1}`,
      })),
    []
  )

  if (isLoggedIn) {
    return (
      <Dashboard
        onLogout={() => {
          localStorage.removeItem('authToken')
          setIsLoggedIn(false)
        }}
      />
    )
  }

  return (
    <div className="glass-profile">
      {/* Ambient floating orbs */}
      <div className="glass-profile__orb glass-profile__orb--1" />
      <div className="glass-profile__orb glass-profile__orb--2" />
      <div className="glass-profile__orb glass-profile__orb--3" />

      {/* Moving light particles (behind glass) */}
      <div className="glass-profile__particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className={`glass-profile__particle ${p.driftClass}`}
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* Fullscreen frosted glass */}
      <div className="glass-profile__glass">
        <Vignette />

        {/* Login button — top-right corner */}
        <button
          className="glass-profile__login"
          type="button"
          onClick={() => setIsLoginOpen(true)}
        >
          Login
        </button>

        {/* Lockup: icon left, wordmark right */}
        <div className="glass-profile__lockup">
          <GlitchLogo size={140} className="glass-profile__logo" />

          <div className="glass-profile__wordmark">
            <div className="glass-profile__glitch-wrap" aria-label="GuroNaive">
              <span
                className="glass-profile__glitch-text"
                data-text="GuroNaive"
                aria-hidden="true"
              >
                GuroNaive
              </span>
            </div>

            <AccentLine />

            <p className="glass-profile__tagline">
              <span className="glass-profile__tagline-accent">Da simplicidade</span>{' '}
              vem a clareza
            </p>
          </div>
        </div>

        {/* Social links */}
        <nav aria-label="Social links" style={{ display: 'flex', gap: '12px' }}>
          <SocialLink
            href="https://steamcommunity.com/id/GuroNaive/"
            icon="/steam-svgrepo-com.svg"
            label="Steam"
            variant="glass"
          />
          <SocialLink
            href="https://discord.com/users/977736458565713970"
            icon="/discord.svg"
            label="Discord"
            variant="glass"
          />
        </nav>

        {/* ── Meus Produtos ── */}
        <div className="glass-profile__products">
          <p className="glass-profile__products-label">Meus Produtos</p>
          <button
            className="glass-profile__product-card"
            type="button"
            onClick={() => navigate('/gurozord')}
          >
            <GuroZordIcon size={22} />
            <div className="glass-profile__product-info">
              <span className="glass-profile__product-name">GuroZord</span>
              <span className="glass-profile__product-desc">Bot de gestão de grupos no WhatsApp</span>
            </div>
            <svg className="glass-profile__product-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <LoginPopover
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={() => setIsLoggedIn(true)}
      />
    </div>
  )
}

export default GlassProfile