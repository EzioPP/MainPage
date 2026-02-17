import { useEffect, useState } from 'react'
import {
  getStorageUsage,
  getUserFiles,
  uploadFile,
  downloadFile,
  updateFile,
  deleteFile,
  type FileRecord,
  type StorageUsage,
} from '../../services/file'
import './Files.css'

interface FilesProps {
  onBack: () => void
}

function Files({ onBack }: FilesProps) {
  const [usage, setUsage] = useState<StorageUsage | null>(null)
  const [files, setFiles] = useState<FileRecord[]>([])
  const [pagination, setPagination] = useState<{
    page: number
    pageSize: number
    total: number
    totalPages: number
  }>({ page: 1, pageSize: 20, total: 0, totalPages: 0 })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [editingFile, setEditingFile] = useState<FileRecord | null>(null)
  const [editName, setEditName] = useState('')
  const [editPublic, setEditPublic] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const loadData = async (page = pagination.page) => {
    try {
      const [usageData, filesData] = await Promise.all([
        getStorageUsage(),
        getUserFiles(page, pagination.pageSize),
      ])
      setUsage(usageData)
      setFiles(filesData.files)
      setPagination({
        page: filesData.page,
        pageSize: filesData.pageSize,
        total: filesData.total,
        totalPages: filesData.totalPages,
      })
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  useEffect(() => {
    const load = async () => {
      try {
        const [usageData, filesData] = await Promise.all([
          getStorageUsage(),
          getUserFiles(1, 20),
        ])
        setUsage(usageData)
        setFiles(filesData.files)
        setPagination({
          page: filesData.page,
          pageSize: filesData.pageSize,
          total: filesData.total,
          totalPages: filesData.totalPages,
        })
      } catch (error) {
        console.error('Failed to load data:', error)
      }
    }
    load()
  }, [])

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadError('')
    setIsUploading(true)

    try {
      const result = await uploadFile(file, isPublic)
      await loadData()
      console.log('Upload successful:', result)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao enviar arquivo.'
      setUploadError(message)
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  const handleDownload = (file: FileRecord) => {
    downloadFile(file.id, file.filename)
  }

  const handleEdit = (file: FileRecord) => {
    setEditingFile(file)
    setEditName(file.filename)
    setEditPublic(file.is_public)
  }

  const handleSaveEdit = async () => {
    if (!editingFile) return

    try {
      await updateFile(editingFile.id, {
        filename: editName !== editingFile.filename ? editName : undefined,
        is_public: editPublic !== editingFile.is_public ? editPublic : undefined,
      })
      setEditingFile(null)
      await loadData()
    } catch (error) {
      console.error('Failed to update file:', error)
      alert(error instanceof Error ? error.message : 'Falha ao atualizar arquivo.')
    }
  }

  const handleDelete = async (fileId: number) => {
    if (deleteConfirm !== fileId) {
      setDeleteConfirm(fileId)
      return
    }

    try {
      await deleteFile(fileId)
      setDeleteConfirm(null)
      await loadData()
    } catch (error) {
      console.error('Failed to delete file:', error)
      alert(error instanceof Error ? error.message : 'Falha ao deletar arquivo.')
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  const usagePercent = usage ? (usage.usage / usage.total) * 100 : 0

  return (
    <div className="files">
      <div className="files__bg" />
      <div className="files__grain" />
      <div className="files__content">
        <header className="files__header">
          <div>
            <button className="files__back" type="button" onClick={onBack}>
              ← Voltar
            </button>
            <h1 className="files__title">Meus Arquivos</h1>
          </div>
        </header>

        <section className="files__storage">
          <div className="files__storage-info">
            <p className="files__storage-label">Armazenamento</p>
            <p className="files__storage-value">
              {usage ? `${usage.usage.toFixed(2)} MB / ${usage.total.toFixed(2)} MB` : 'Carregando...'}
            </p>
          </div>
          <div className="files__storage-bar">
            <div
              className="files__storage-fill"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </section>

        <section className="files__upload">
          <label className="files__upload-btn">
            <input
              type="file"
              onChange={handleUpload}
              disabled={isUploading}
              hidden
            />
            {isUploading ? 'Enviando...' : '+ Enviar arquivo'}
          </label>
          <label className="files__public-toggle">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Publico
          </label>
          {uploadError && (
            <p className="files__error" role="alert">
              {uploadError}
            </p>
          )}
        </section>

        <section className="files__list">
          {files.length === 0 && <p className="files__empty">Nenhum arquivo ainda.</p>}
          {files.map((file) => (
            <article key={file.id} className="files__item">
              <div className="files__item-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                  <polyline points="13 2 13 9 20 9"/>
                </svg>
              </div>
              <div className="files__item-content">
                <p className="files__item-name" title={file.filename}>{file.filename}</p>
                <p className="files__item-size">{formatBytes(file.size)}</p>
                <p className="files__item-meta">
                  {file.is_public ? 'Publico' : 'Privado'} • {new Date(file.created_at).toLocaleDateString()}
                </p>
                <div className="files__item-actions">
                  <button
                    className="files__item-btn files__item-btn--download"
                    type="button"
                    onClick={() => handleDownload(file)}
                  >
                    Baixar
                  </button>
                  <button
                    className="files__item-btn files__item-btn--edit"
                    type="button"
                    onClick={() => handleEdit(file)}
                  >
                    Editar
                  </button>
                  <button
                    className="files__item-btn files__item-btn--delete"
                    type="button"
                    onClick={() => handleDelete(file.id)}
                  >
                    {deleteConfirm === file.id ? 'Confirmar?' : 'Deletar'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {editingFile && (
          <div className="files__modal" onClick={() => setEditingFile(null)}>
            <div className="files__modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Editar arquivo</h2>
              <label className="files__modal-label">
                Nome do arquivo
                <input
                  className="files__modal-input"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </label>
              <label className="files__modal-toggle">
                <input
                  type="checkbox"
                  checked={editPublic}
                  onChange={(e) => setEditPublic(e.target.checked)}
                />
                Publico
              </label>
              <div className="files__modal-actions">
                <button
                  className="files__modal-btn files__modal-btn--cancel"
                  type="button"
                  onClick={() => setEditingFile(null)}
                >
                  Cancelar
                </button>
                <button
                  className="files__modal-btn files__modal-btn--save"
                  type="button"
                  onClick={handleSaveEdit}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <section className="files__pagination">
            <button
              className="files__page-btn"
              type="button"
              disabled={pagination.page === 1}
              onClick={() => loadData(pagination.page - 1)}
            >
              ← Anterior
            </button>
            <span className="files__page-info">
              Pagina {pagination.page} de {pagination.totalPages} • {pagination.total} arquivo{pagination.total !== 1 ? 's' : ''}
            </span>
            <button
              className="files__page-btn"
              type="button"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => loadData(pagination.page + 1)}
            >
              Proximo →
            </button>
          </section>
        )}
      </div>
    </div>
  )
}

export default Files
