const DEV_STATS_URL = 'http://localhost:3000/system/stats'
const PROD_STATS_URL = 'https://api.guronaive.com/system/stats'

const getStatsUrl = () => (import.meta.env.DEV ? DEV_STATS_URL : PROD_STATS_URL)

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return {
    Authorization: `Bearer ${token}`,
  }
}

export type SystemStats = {
  hostname: string
  platform: string
  arch: string
  uptime: {
    os: number
    process: number
  }
  cpu: {
    model: string
    cores: number
    usage: number
  }
  memory: {
    totalMB: number
    usedMB: number
    freeMB: number
    usagePercent: number
  }
  disk: {
    totalGB: number
    usedGB: number
    freeGB: number
    usagePercent: number
  }
  load: number[]
  nodeVersion: string
  processMemoryMB: number
}

export const getSystemStats = async (): Promise<SystemStats> => {
  const response = await fetch(getStatsUrl(), {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch system stats')
  }

  return (await response.json()) as SystemStats
}
