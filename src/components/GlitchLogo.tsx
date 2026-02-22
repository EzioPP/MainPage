import './GlitchLogo.css'

interface GlitchLogoProps {
  size?: number
  className?: string
}

function GlitchLogo({ size = 70, className = '' }: GlitchLogoProps) {
  return (
    <div
      className={`glitch-logo ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Base layer */}
      <svg className="glitch-logo__layer glitch-logo__layer--base" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="68" height="68" rx="12" stroke="#a78bfa" strokeOpacity="0.2" strokeWidth="1.5"/>
        <path d="M22 16 L11 35 L22 54" stroke="#a78bfa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M48 16 L59 35 L48 54" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="35" cy="35" r="3" fill="#a78bfa" opacity="0.9"/>
      </svg>

      {/* Cyan ghost */}
      <svg className="glitch-logo__layer glitch-logo__layer--cyan" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 16 L11 35 L22 54" stroke="#0ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M48 16 L59 35 L48 54" stroke="#0ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="35" cy="35" r="3" fill="#0ff"/>
      </svg>

      {/* Magenta ghost */}
      <svg className="glitch-logo__layer glitch-logo__layer--magenta" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 16 L11 35 L22 54" stroke="#f0f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M48 16 L59 35 L48 54" stroke="#f0f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="35" cy="35" r="3" fill="#f0f"/>
      </svg>
    </div>
  )
}

export default GlitchLogo
