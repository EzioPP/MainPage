const DEV_FILES_BASE = 'http://localhost:3000/files'
const PROD_FILES_BASE = 'https://api.guronaive.com/files'

const getFilesBase = () => (import.meta.env.DEV ? DEV_FILES_BASE : PROD_FILES_BASE)

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return {
    Authorization: `Bearer ${token}`,
  }
}

export interface FileRecord {
  id: number
  filename: string
  path: string
  created_at: Date
  size: number
  is_public: boolean
  user_id: number
}

export interface StorageUsage {
  usage: number
  total: number
}

export interface UploadResponse {
  id: number
  filename: string
  remainingStorage: number
}

export interface PaginatedFiles {
  files: FileRecord[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export const getStorageUsage = async (): Promise<StorageUsage> => {
  const response = await fetch(`${getFilesBase()}/usage`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch storage usage')
  }

  const data = (await response.json()) as { usage: StorageUsage }
  return data.usage
}

export const getUserFiles = async (
  page = 1,
  pageSize = 20,
): Promise<PaginatedFiles> => {
  const response = await fetch(
    `${getFilesBase()}/myfiles?page=${page}&pageSize=${pageSize}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    },
  )

  if (!response.ok) {
    throw new Error('Failed to fetch files')
  }

  return (await response.json()) as PaginatedFiles
}

export const uploadFile = async (
  file: File,
  isPublic = false,
): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('isPublic', String(isPublic))

  const response = await fetch(`${getFilesBase()}/upload`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  })

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { message?: string }
    const message = typeof data.message === 'string'
      ? data.message
      : 'Falha ao enviar arquivo.'
    throw new Error(message)
  }

  return (await response.json()) as UploadResponse
}

export const downloadFile = (fileId: number, filename: string) => {
  const token = localStorage.getItem('authToken')
  const url = `${getFilesBase()}/${fileId}?token=${encodeURIComponent(token ?? '')}`
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
}

export const updateFile = async (
  fileId: number,
  updates: { filename?: string; is_public?: boolean },
): Promise<FileRecord> => {
  const response = await fetch(`${getFilesBase()}/${fileId}`, {
    method: 'PATCH',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { message?: string }
    const message = typeof data.message === 'string'
      ? data.message
      : 'Falha ao atualizar arquivo.'
    throw new Error(message)
  }

  return (await response.json()) as FileRecord
}

export const deleteFile = async (fileId: number): Promise<void> => {
  const response = await fetch(`${getFilesBase()}/${fileId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { message?: string }
    const message = typeof data.message === 'string'
      ? data.message
      : 'Falha ao deletar arquivo.'
    throw new Error(message)
  }
}
