import { useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
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

// ── Scroll-hint chevron ─────────────────────────────────────────────
function ScrollHint() {
  return (
    <motion.div
      className="glass-profile__scroll-hint"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    >
      <div className="glass-profile__scroll-line" />
      <span>Role</span>
    </motion.div>
  )
}

function GlassProfile() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem('authToken')))
  const prefersReduced = useReducedMotion()

  const { scrollYProgress } = useScroll({ container: containerRef })

  // Parallax: orbs move at ~40% speed, particles at ~60%
  const orbY = useTransform(scrollYProgress, [0, 1], prefersReduced ? [0, 0] : [0, -180])
  const particleY = useTransform(scrollYProgress, [0, 1], prefersReduced ? [0, 0] : [0, -100])
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

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

  const fadeUp = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 40 } as const,
        whileInView: { opacity: 1, y: 0 } as const,
        viewport: { once: true, amount: 0.3 as const },
        transition: { duration: 0.7, ease: 'easeOut' as const },
      }

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
    <div className="glass-profile" ref={containerRef}>
      {/* Ambient floating orbs — slowest layer */}
      <motion.div className="glass-profile__bg-layer" style={{ y: orbY }}>
        <div className="glass-profile__orb glass-profile__orb--1" />
        <div className="glass-profile__orb glass-profile__orb--2" />
        <div className="glass-profile__orb glass-profile__orb--3" />
      </motion.div>

      {/* Moving light particles — mid layer */}
      <motion.div className="glass-profile__particles" style={{ y: particleY }}>
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
      </motion.div>

      {/* Fullscreen frosted glass — foreground (scrolls at 1x) */}
      <div className="glass-profile__glass">
        <Vignette />

        {/* Login button — top-right corner (fixed) */}
        <button
          className="glass-profile__login"
          type="button"
          onClick={() => setIsLoginOpen(true)}
        >
          Login
        </button>

        {/* ── Zone 1: Hero (first viewport) ── */}
        <div className="glass-profile__zone glass-profile__zone--hero">
          <motion.div
            className="glass-profile__lockup"
            {...fadeUp}
          >
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
          </motion.div>

          {/* Social links — stay in hero */}
          <motion.nav
            aria-label="Social links"
            style={{ display: 'flex', gap: '12px' }}
            {...fadeUp}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          >
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
          </motion.nav>

          <motion.div style={{ opacity: scrollHintOpacity }}>
            <ScrollHint />
          </motion.div>
        </div>

        {/* ── Zone 2: Meus Produtos showcase ── */}
        <div className="glass-profile__zone glass-profile__zone--below">
          <motion.div
            className="glass-profile__section-header"
            {...fadeUp}
          >
            <span className="glass-profile__section-eyebrow">Projetos</span>
            <h2 className="glass-profile__section-title">Meus Produtos</h2>
            <p className="glass-profile__section-sub">
              Ferramentas que eu construí pra resolver problemas reais.
            </p>
          </motion.div>

          <motion.button
            className="glass-profile__product-card"
            type="button"
            onClick={() => navigate('/gurozord')}
            {...fadeUp}
            whileHover={prefersReduced ? {} : { y: -6, scale: 1.015 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            <div className="glass-profile__product-icon-wrap">
              <GuroZordIcon size={36} />
            </div>
            <div className="glass-profile__product-body">
              <div className="glass-profile__product-top">
                <span className="glass-profile__product-name">GuroZord</span>
                <span className="glass-profile__product-badge">Bot</span>
              </div>
              <span className="glass-profile__product-desc">
                Bot de gestão de grupos no WhatsApp. Moderação automática, agendamentos,
                controle de admin por horário e muito mais — 24/7, sem esforço.
              </span>
              <span className="glass-profile__product-cta">
                Ver mais
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </motion.button>
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