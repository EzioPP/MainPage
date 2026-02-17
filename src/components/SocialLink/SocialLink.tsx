import './SocialLink.css'

interface SocialLinkProps {
  href: string
  icon: string
  label: string
  variant?: 'glass' | 'image'
}

function SocialLink({ href, icon, label, variant = 'glass' }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`social-link social-link--${variant}`}
      aria-label={label}
    >
      <img src={icon} alt={label} className="social-link__icon" />
    </a>
  )
}

export default SocialLink
