import { useState, type FormEvent } from 'react'
import { login } from '../../services/auth'
import './LoginPopover.css'

interface LoginPopoverProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

function LoginPopover({ isOpen, onClose, onSuccess }: LoginPopoverProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const data = await login({ username, password })
      if (typeof data?.token === 'string') {
        localStorage.setItem('authToken', data.token)
      }

      onSuccess?.()
      onClose()
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Falha ao autenticar. Tente novamente.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="login-popover" role="dialog" aria-modal="true">
      <button className="login-popover__backdrop" onClick={onClose} aria-label="Close" />
      <div className="login-popover__card">
        <button className="login-popover__close" onClick={onClose} aria-label="Close">
          +
        </button>
        <form className="login-popover__form" onSubmit={handleSubmit}>
          <label className="login-popover__label">
            Usuario
            <input
              className="login-popover__input"
              type="text"
              placeholder="seu_usuario"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="login-popover__label">
            Senha
            <input
              className="login-popover__input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {errorMessage && (
            <p className="login-popover__error" role="alert">{errorMessage}</p>
          )}
          <button className="login-popover__submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPopover
