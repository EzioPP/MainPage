import { useState, useMemo } from 'react'
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

function GlassProfile() {
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