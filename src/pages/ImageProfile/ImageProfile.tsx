import { useState } from 'react'
import ProfileName from '../../components/ProfileName/ProfileName'
import SocialLink from '../../components/SocialLink/SocialLink'
import AccentLine from '../../components/AccentLine'
import Vignette from '../../components/Vignette'
import LoginPopover from '../../components/LoginPopover/LoginPopover'
import Dashboard from '../Dashboard/Dashboard'
import bgImage from '../../assets/images/background.png'
import './ImageProfile.css'

const phrases = ['Bem vindo']

function ImageProfile() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem('authToken')))
  const [phrase] = useState(() => phrases[Math.floor(Math.random() * phrases.length)])

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
    <div className="image-profile">
      {/* Background image */}
      <div
        className="image-profile__bg"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Dark overlay */}
      <div className="image-profile__overlay" />

      {/* Vignette */}
      <Vignette spread={30} intensity={0.7} className="image-profile__vignette" />

      <button
        className="image-profile__login"
        type="button"
        onClick={() => setIsLoginOpen(true)}
      >
        Login
      </button>

      {/* Content */}
      <div className="image-profile__content">
        <ProfileName variant="image" />
        <AccentLine />
        <p className="image-profile__tagline">{phrase}</p>
        <SocialLink
          href="https://steamcommunity.com/id/GuroNaive/"
          icon="/steam-svgrepo-com.svg"
          label="Steam"
          variant="image"
        />
      </div>
      <LoginPopover
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={() => setIsLoggedIn(true)}
      />
    </div>
  )
}

export default ImageProfile
