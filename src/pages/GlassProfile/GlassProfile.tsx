import ProfileName from '../../components/ProfileName/ProfileName'
import SocialLink from '../../components/SocialLink/SocialLink'
import AccentLine from '../../components/AccentLine'
import Vignette from '../../components/Vignette'
import './GlassProfile.css'

function GlassProfile() {
  return (
    <div className="glass-profile">
      {/* Ambient floating orbs */}
      <div className="glass-profile__orb glass-profile__orb--1" />
      <div className="glass-profile__orb glass-profile__orb--2" />
      <div className="glass-profile__orb glass-profile__orb--3" />

      {/* Moving light particles (behind glass) */}
      <div className="glass-profile__particles">
        {Array.from({ length: 20 }).map((_, i) => {
          const size = 20 + Math.random() * 40
          const driftClass = `glass-profile__particle--path-${(i % 4) + 1}`
          return (
            <div
              key={i}
              className={`glass-profile__particle ${driftClass}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDuration: `${10 + Math.random() * 20}s`,
                animationDelay: `${-Math.random() * 20}s`,
                opacity: 0.3 + Math.random() * 0.5,
              }}
            />
          )
        })}
      </div>

      {/* Fullscreen frosted glass */}
      <div className="glass-profile__glass">
        <Vignette />
        <ProfileName variant="glass" />
        <AccentLine />
        <SocialLink
          href="https://steamcommunity.com/id/GuroNaive/"
          icon="/steam-svgrepo-com.svg"
          label="Steam"
          variant="glass"
        />
      </div>
    </div>
  )
}

export default GlassProfile
