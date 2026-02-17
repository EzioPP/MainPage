import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStorageUsage, type StorageUsage } from '../../services/file'
import './Dashboard.css'

interface DashboardProps {
  onLogout: () => void
}

function Dashboard({ onLogout }: DashboardProps) {
  const navigate = useNavigate()
  const [usage, setUsage] = useState<StorageUsage | null>(null)

  useEffect(() => {
    const loadUsage = async () => {
      try {
        const data = await getStorageUsage()
        setUsage(data)
      } catch (error) {
        console.error('Failed to load storage usage:', error)
      }
    }
    loadUsage()
  }, [])

  return (
    <div className="dashboard">
      <div className="dashboard__bg" />
      <div className="dashboard__grain" />
      <div className="dashboard__content">
        <header className="dashboard__header">
          <div>
            <p className="dashboard__eyebrow">Painel</p>
            <h1 className="dashboard__title">Bem vindo de volta</h1>
            <p className="dashboard__subtitle">Placeholder do dashboard - em construcao.</p>
          </div>
          <button className="dashboard__logout" type="button" onClick={onLogout}>
            Sair
          </button>
        </header>

        <section className="dashboard__grid">
          <article className="dashboard__card dashboard__card--storage">
            <h2>Armazenamento</h2>
            {usage ? (
              <>
                <p className="dashboard__storage-value">
                  {usage.usage.toFixed(2)} MB / {usage.total.toFixed(2)} MB
                </p>
                <div className="dashboard__storage-bar">
                  <div
                    className="dashboard__storage-fill"
                    style={{ width: `${(usage.usage / usage.total) * 100}%` }}
                  />
                </div>
              </>
            ) : (
              <p>Carregando...</p>
            )}
          </article>
          <article className="dashboard__card">
            <h2>Status</h2>
            <p>Conexao segura ativa.</p>
          </article>
          <article className="dashboard__card">
            <h2>Atividade</h2>
            <p>Nenhuma notificacao recente.</p>
          </article>
          <article className="dashboard__card dashboard__card--clickable" onClick={() => navigate('/files')}>
            <h2>Arquivos</h2>
            <p>Ver e gerenciar seus arquivos.</p>
          </article>
        </section>

        <section className="dashboard__footer">
          <div>
            <h3>Atalhos</h3>
            <p>Em breve voce podera personalizar este painel.</p>
          </div>
          <button className="dashboard__primary" type="button" onClick={() => navigate('/files')}>
            Gerenciar arquivos
          </button>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
