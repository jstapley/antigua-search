'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, FileText, Trash2, Download, FolderOpen } from 'lucide-react'

const DOCUMENT_CATEGORIES = [
  'Listing Agreement',
  'Owner Passport',
  'Certification Registration',
  'Survey Map',
  'Owner Information Form',
  'Letter of Intent',
  'Buyer Information Form',
  'Buyer Passport',
  'Contract',
  'Additional Info',
]

interface Document {
  id: string
  name: string
  category: string
  file_path: string
  file_size: number | null
  uploaded_by: string | null
  created_at: string
}

interface Props {
  propertyId: string
  propertyTitle: string
}

function formatFileSize(bytes: number | null) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function PropertyDocuments({ propertyId, propertyTitle }: Props) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState(DOCUMENT_CATEGORIES[0])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadDocuments()
  }, [propertyId])

  const loadDocuments = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/property-documents?propertyId=${propertyId}`)
      const data = await res.json()
      setDocuments(Array.isArray(data) ? data : [])
    } catch {
      setError('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be under 50MB')
      return
    }

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('propertyId', propertyId)
      formData.append('category', selectedCategory)
      formData.append('name', file.name)

      const res = await fetch('/api/admin/property-documents', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload failed')
      }

      setSuccess('Document uploaded successfully')
      loadDocuments()
      if (fileInputRef.current) fileInputRef.current.value = ''
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (doc: Document) => {
    setDownloading(doc.id)
    try {
      const res = await fetch(`/api/admin/property-documents/download?id=${doc.id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Download failed')
      window.open(data.url, '_blank')
    } catch {
      setError('Failed to generate download link')
    } finally {
      setDownloading(null)
    }
  }

  const handleDelete = async (doc: Document) => {
    if (!confirm(`Delete "${doc.name}"?`)) return
    try {
      const res = await fetch(`/api/admin/property-documents/${doc.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setDocuments(prev => prev.filter(d => d.id !== doc.id))
    } catch {
      setError('Failed to delete document')
    }
  }

  const grouped = DOCUMENT_CATEGORIES.reduce((acc, cat) => {
    const docs = documents.filter(d => d.category === cat)
    if (docs.length > 0) acc[cat] = docs
    return acc
  }, {} as Record<string, Document[]>)

  const otherDocs = documents.filter(d => !DOCUMENT_CATEGORIES.includes(d.category))
  if (otherDocs.length > 0) grouped['Other'] = otherDocs

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <FolderOpen size={18} className="text-[#0c2749]" />
        <h2 className="font-semibold text-[#0c2749] text-lg">Property Documents</h2>
        <span className="text-xs text-gray-400 ml-auto">{documents.length} file{documents.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Upload Document</h3>
        <div className="flex gap-3 flex-wrap">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="flex-1 min-w-[200px] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] bg-white"
          >
            {DOCUMENT_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-[#0c2749] hover:bg-[#0a1f3a] disabled:opacity-60 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
          >
            <Upload size={15} />
            {uploading ? 'Uploading...' : 'Choose File'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
            onChange={handleUpload}
            className="hidden"
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">PDF, Word, or image files up to 50MB</p>
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-100 mb-4">{error}</p>}
      {success && <p className="text-green-700 text-sm bg-green-50 px-4 py-3 rounded-xl border border-green-100 mb-4">✓ {success}</p>}

      {loading ? (
        <div className="text-center py-8 text-gray-400">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-[#0c2749] rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm">Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <FileText size={36} className="mx-auto mb-3 text-gray-200" />
          <p className="text-sm">No documents uploaded yet</p>
          <p className="text-xs mt-1">Upload listing agreements, passports, contracts and more</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, docs]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{category}</h4>
              <div className="space-y-2">
                {docs.map(doc => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                    <FileText size={16} className="text-[#0c2749] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{doc.name}</p>
                      <p className="text-xs text-gray-400">
                        {formatFileSize(doc.file_size)}
                        {doc.uploaded_by ? ` · ${doc.uploaded_by}` : ''}
                        {' · '}{new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDownload(doc)}
                        disabled={downloading === doc.id}
                        className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#0c2749] transition-colors disabled:opacity-40"
                        title="Download"
                      >
                        <Download size={14} className={downloading === doc.id ? 'animate-pulse' : ''} />
                      </button>
                      <button
                        onClick={() => handleDelete(doc)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}