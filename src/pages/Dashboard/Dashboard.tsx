import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStorageUsage, type StorageUsage } from '../../services/file'
import { getSystemStats, type SystemStats } from '../../services/stats'
import './Dashboard.css'

interface DashboardProps {
  onLogout: () => void
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function Dashboard({ onLogout }: DashboardProps) {
  const navigate = useNavigate()
  const [usage, setUsage] = useState<StorageUsage | null>(null)
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [statsError, setStatsError] = useState(false)

  useEffect(() => {
    const loadUsage = async () => {
      try {
        const data = await getStorageUsage()
        setUsage(data)
      } catch (error) {
        console.error('Failed to load storage usage:', error)
      }
    }
    const loadStats = async () => {
      try {
        const data = await getSystemStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to load system stats:', error)
        setStatsError(true)
      }
    }
    loadUsage()
    loadStats()
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

        <section className="dashboard__stats">
          <h2 className="dashboard__stats-title">Estatisticas do Sistema</h2>
          {statsError ? (
            <p className="dashboard__stats-error">Falha ao carregar estatisticas.</p>
          ) : !stats ? (
            <p className="dashboard__stats-loading">Carregando...</p>
          ) : (
            <div className="dashboard__stats-grid">
              <article className="dashboard__stat-card">
                <h3>Host</h3>
                <p className="dashboard__stat-value">{stats.hostname}</p>
                <p className="dashboard__stat-meta">{stats.platform} / {stats.arch}</p>
              </article>

              <article className="dashboard__stat-card">
                <h3>CPU</h3>
                <p className="dashboard__stat-value">{stats.cpu.usage.toFixed(1)}%</p>
                <div className="dashboard__stat-bar">
                  <div className="dashboard__stat-fill" style={{ width: `${stats.cpu.usage}%` }} />
                </div>
                <p className="dashboard__stat-meta">{stats.cpu.model} &middot; {stats.cpu.cores} cores</p>
              </article>

              <article className="dashboard__stat-card">
                <h3>Memoria</h3>
                <p className="dashboard__stat-value">{stats.memory.usagePercent.toFixed(1)}%</p>
                <div className="dashboard__stat-bar">
                  <div className="dashboard__stat-fill" style={{ width: `${stats.memory.usagePercent}%` }} />
                </div>
                <p className="dashboard__stat-meta">
                  {stats.memory.usedMB.toFixed(0)} MB / {stats.memory.totalMB.toFixed(0)} MB
                </p>
              </article>

              <article className="dashboard__stat-card">
                <h3>Disco</h3>
                <p className="dashboard__stat-value">{stats.disk.usagePercent.toFixed(1)}%</p>
                <div className="dashboard__stat-bar">
                  <div className="dashboard__stat-fill" style={{ width: `${stats.disk.usagePercent}%` }} />
                </div>
                <p className="dashboard__stat-meta">
                  {stats.disk.usedGB.toFixed(1)} GB / {stats.disk.totalGB.toFixed(1)} GB
                </p>
              </article>

              <article className="dashboard__stat-card">
                <h3>Uptime</h3>
                <p className="dashboard__stat-value">{formatUptime(stats.uptime.os)}</p>
                <p className="dashboard__stat-meta">Processo: {formatUptime(stats.uptime.process)}</p>
              </article>

              <article className="dashboard__stat-card">
                <h3>Load Average</h3>
                <p className="dashboard__stat-value">{stats.load.map(l => l.toFixed(2)).join(' / ')}</p>
                <p className="dashboard__stat-meta">Node {stats.nodeVersion} &middot; {stats.processMemoryMB.toFixed(0)} MB</p>
              </article>
            </div>
          )}
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
