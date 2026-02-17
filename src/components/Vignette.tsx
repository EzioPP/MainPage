interface VignetteProps {
  /** How far from center the transparent area extends (default 40%) */
  spread?: number
  /** How dark the edges get (default 0.6) */
  intensity?: number
  className?: string
}

function Vignette({ spread = 40, intensity = 0.6, className }: VignetteProps) {
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at center, transparent ${spread}%, rgba(0, 0, 0, ${intensity}) 100%)`,
        pointerEvents: 'none',
      }}
    />
  )
}

export default Vignette
