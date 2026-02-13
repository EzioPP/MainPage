/* eslint-disable react-hooks/purity */
import './App.css'

function App() {
  return (
    <div className="profile-container">
      {/* Ambient floating orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Moving light sources (behind glass) */}
      <div className="particles">
        {Array.from({ length: 20 }).map((_, i) => {
          const size = 20 + Math.random() * 40;
          const driftClass = `particle-path-${(i % 4) + 1}`;
          return (
            <div key={i} className={`particle ${driftClass}`} style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDuration: `${10 + Math.random() * 20}s`,
              animationDelay: `${-Math.random() * 20}s`,
              opacity: 0.3 + Math.random() * 0.5,
            }} />
          );
        })}
      </div>

      {/* Fullscreen frosted glass */}
      <div className="glass-fullscreen">
        {/* Vignette overlay */}
        <div className="vignette" />
        <h1 className="profile-name">
          <span className="name-guro">Guro</span>
          <span className="name-naive">Naive</span>
        </h1>
        <div className="accent-line" />
        <a href="https://steamcommunity.com/id/GuroNaive/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Steam">
          <img src="/steam-svgrepo-com.svg" alt="Steam" className="social-icon" />
        </a>
      </div>
    </div>
  )
}

export default App
