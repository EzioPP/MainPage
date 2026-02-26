import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

const FEATURES = [
  {
    icon: '👋',
    title: 'Mensagens de Boas-vindas',
    desc: 'Receba novos membros automaticamente com mensagens personalizadas. Defina o tom do grupo desde o início — sempre, sem esforço nenhum.',
  },
  {
    icon: '⚠️',
    title: 'Moderação Automática & Avisos',
    desc: 'Rastreie infrações, emita avisos progressivos e remova reincidentes. Sem mais contar advertências manualmente.',
  },
  {
    icon: '📅',
    title: 'Avisos Agendados',
    desc: 'Programe mensagens para o horário certo. Lembretes diários, atualizações semanais, alertas de eventos — tudo no piloto automático.',
  },
  {
    icon: '🔐',
    title: 'Restrição de Admin por Horário',
    desc: 'Deixe o grupo somente para admins durante certos horários. Trava à noite, abre de manhã — de forma automática.',
  },
  {
    icon: '📋',
    title: 'Gestão de Regras',
    desc: 'Defina e aplique regras personalizadas no grupo. O GuroZord mantém o regulamento visível e age sobre infrações em tempo real.',
  },
  {
    icon: '👁️',
    title: 'Sempre de Olho',
    desc: 'Você dorme, o GuroZord não. Ele monitora a atividade 24 horas por dia para manter seu grupo em ordem — esteja você online ou não.',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Solicite acesso',
    desc: 'O GuroZord é por convite apenas. Entre na lista de espera e você será notificado assim que uma vaga abrir.',
  },
  {
    num: '02',
    title: 'Adicione ao seu grupo',
    desc: 'Após aprovado, você receberá um link para adicionar o GuroZord ao seu grupo do WhatsApp. Sem instalação, sem app — só adicionar e pronto.',
  },
  {
    num: '03',
    title: 'Configure suas regras',
    desc: 'Use comandos simples para configurar mensagens de boas-vindas, agendamentos, horários de admin e limites de moderação. Totalmente personalizável.',
  },
  {
    num: '04',
    title: 'Deixa rolar',
    desc: 'O GuroZord cuida do resto. Relaxa enquanto seu grupo fica limpo, ativo e dentro das regras — automaticamente.',
  },
]

// ── Custom cursor ──────────────────────────────────────────────────
function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef   = useRef<HTMLDivElement>(null)
  const mouse     = useRef({ x: 0, y: 0 })
  const ring      = useRef({ x: 0, y: 0 })
  const raf       = useRef<number>(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    document.addEventListener('mousemove', onMove)

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.14
      ring.current.y += (mouse.current.y - ring.current.y) * 0.14

      if (cursorRef.current) {
        cursorRef.current.style.left = `${mouse.current.x}px`
        cursorRef.current.style.top  = `${mouse.current.y}px`
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`
        ringRef.current.style.top  = `${ring.current.y}px`
      }
      raf.current = requestAnimationFrame(animate)
    }
    raf.current = requestAnimationFrame(animate)

    const grow = () => {
      if (!ringRef.current) return
      ringRef.current.style.width       = '50px'
      ringRef.current.style.height      = '50px'
      ringRef.current.style.borderColor = 'rgba(196,181,253,0.7)'
    }
    const shrink = () => {
      if (!ringRef.current) return
      ringRef.current.style.width       = '32px'
      ringRef.current.style.height      = '32px'
      ringRef.current.style.borderColor = 'rgba(167,139,250,0.5)'
    }

    document.querySelectorAll('a, button, input').forEach(el => {
      el.addEventListener('mouseenter', grow)
      el.addEventListener('mouseleave', shrink)
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div className="lp-cursor"      ref={cursorRef} />
      <div className="lp-cursor-ring" ref={ringRef}   />
    </>
  )
}

// ── Scroll-reveal hook ─────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 },
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

// ── Logo SVG ───────────────────────────────────────────────────────
function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="ig" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="10.25"
        stroke="url(#ig)" strokeOpacity="0.4" strokeWidth="1.5" />
      <path d="M10 32 Q32 14 54 32 Q32 50 10 32 Z"
        stroke="url(#ig)" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <circle cx="32" cy="32" r="8"  stroke="url(#ig)" strokeWidth="2" fill="none" />
      <circle cx="32" cy="32" r="3"  fill="url(#ig)" />
    </svg>
  )
}

// ── Discord Icon SVG ───────────────────────────────────────────────
function DiscordIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  )
}

// ── Main component ─────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()
  useReveal()

  return (
    <div className="lp">
      <Cursor />

      {/* ── NAV ── */}
      <nav className="lp-nav">
        <button className="lp-nav__back" onClick={() => navigate('/')} aria-label="Voltar ao início">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Início
        </button>
        <a className="lp-nav__logo" href="#">
          <LogoIcon />
          <span className="lp-nav__wordmark">GuroZord</span>
        </a>
        <ul className="lp-nav__links">
          <li><a href="#features">Funcionalidades</a></li>
          <li><a href="#how">Como funciona</a></li>
          <li><a href="#waitlist">Lista de espera</a></li>
        </ul>
        <a href="#waitlist" className="lp-nav__cta">Solicitar Acesso</a>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero" id="hero">
        <div className="lp-hero__orb2" />
        <span className="lp-hero__badge">
          <span className="lp-hero__badge-dot" />
          Bot de Gestão de Grupos no WhatsApp
        </span>
        <h1 className="lp-hero__title">
          Do Caos<br />
          <span className="lp-hero__accent">Surgiu a Ordem.</span>
        </h1>
        <p className="lp-hero__sub">
          O GuroZord aplica as regras do seu grupo automaticamente — 24/7. Moderação,
          agendamentos, controles inteligentes de admin e muito mais. Feito pra você
          não precisar ficar babá do grupo.
        </p>
        <div className="lp-hero__actions">
          <a href="#waitlist" className="lp-btn-primary">Entrar na Lista de Espera</a>
          <a href="#features" className="lp-btn-ghost">Ver Funcionalidades</a>
        </div>
        <div className="lp-scroll-hint">
          <div className="lp-scroll-hint__line" />
          Role
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="lp-stats reveal">
        {[
          { num: '24/7', label: 'Sempre de olho'       },
          { num: '0ms',  label: 'Esforço manual'       },
          { num: '∞',    label: 'Regras do seu jeito'  },
          { num: '1',    label: 'Bot pra dominar tudo' },
        ].map(s => (
          <div key={s.label} className="lp-stats__item">
            <div className="lp-stats__num">{s.num}</div>
            <div className="lp-stats__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="lp-section">
        <div className="lp-section__inner">
          <p className="lp-eyebrow reveal">O que ele faz</p>
          <h2 className="lp-title reveal">
            Tudo que os admins do seu grupo<br />sempre quiseram ter.
          </h2>
          <p className="lp-desc reveal">
            O GuroZord roda silenciosamente em segundo plano, cuidando do que
            sempre escapa pelo vão dos dedos.
          </p>
          <div className="lp-features reveal">
            {FEATURES.map(f => (
              <div key={f.title} className="lp-feat">
                <div className="lp-feat__icon">{f.icon}</div>
                <div className="lp-feat__title">{f.title}</div>
                <div className="lp-feat__desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="lp-section lp-section--alt">
        <div className="lp-section__inner">
          <p className="lp-eyebrow reveal">Como funciona</p>
          <h2 className="lp-title reveal">Funcionando<br />em minutos.</h2>
          <div className="lp-steps">
            {STEPS.map(s => (
              <div key={s.num} className="lp-step reveal">
                <div className="lp-step__num">{s.num}</div>
                <div className="lp-step__body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAITLIST / DISCORD CTA ── */}
      <section id="waitlist" className="lp-section lp-section--cta">
        <div className="lp-cta-glow" />
        <div className="lp-section__inner lp-section__inner--center">
          <div className="lp-cta-box reveal">
            <p className="lp-eyebrow">Acesso antecipado</p>
            <h2 className="lp-title">Pronto pra restaurar a ordem?</h2>
            <p className="lp-desc lp-desc--center">
              Me chama no Discord e a gente resolve. Feito por{' '}
              <strong className="lp-highlight">GuroNaive</strong>.
            </p>
            <a
              href="https://discord.com/users/977736458565713970"
              target="_blank"
              rel="noopener noreferrer"
              className="lp-discord-btn"
            >
              <DiscordIcon size={22} />
              Me chama no Discord
            </a>
            <p className="lp-cta-note">
              Respondo rápido. Só mandar mensagem e a gente conversa.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer__left">
          <span className="lp-footer__brand">GuroZord</span>
          <span className="lp-footer__sub">From Chaos Came Order</span>
        </div>
        <div className="lp-footer__right">
          Feito por <a href="#">GuroNaive</a> &nbsp;·&nbsp; © 2026
        </div>
      </footer>
    </div>
  )
}