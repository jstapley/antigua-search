'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Upload, FileText, Trash2, Download, FolderOpen, Plus, Eye, Clock } from 'lucide-react'

const RESOURCE_CATEGORIES = [
  'Listing Agreements',
  'Buyer Forms',
  'Owner Forms',
  'Contracts',
  'Legal Documents',
  'Marketing Materials',
  'Other',
]

interface Resource {
  id: string
  name: string
  category: string
  file_path: string
  file_size: number | null
  uploaded_by: string | null
  created_at: string
}

function formatFileSize(bytes: number | null) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const FORM_LABELS: Record<string, string> = {
  'client-information': 'Client Information Form',
  'buyer-representation': 'Buyer Representation Agreement',
  'exclusive-seller': 'Exclusive Seller Agreement',
  'letter-of-intent': 'Letter of Intent',
  'non-exclusive-seller': 'Non-Exclusive Seller Agreement',
}

interface FormSubmission {
  id: string
  form_type: string
  form_title: string
  created_by: string | null
  created_at: string
}

export default function AgentResourcesPage() {
  const [activeTab, setActiveTab] = useState<'documents' | 'forms'>('documents')
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState(RESOURCE_CATEGORIES[0])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [submissionsLoading, setSubmissionsLoading] = useState(false)

  useEffect(() => {
    loadResources()
  }, [])

  useEffect(() => {
    if (activeTab === 'forms' && submissions.length === 0) {
      setSubmissionsLoading(true)
      fetch('/api/admin/form-submissions')
        .then(r => r.json())
        .then(data => { setSubmissions(Array.isArray(data) ? data : []); setSubmissionsLoading(false) })
        .catch(() => setSubmissionsLoading(false))
    }
  }, [activeTab])

  const loadResources = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/agent-resources')
      const data = await res.json()
      setResources(Array.isArray(data) ? data : [])
    } catch {
      setError('Failed to load resources')
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
      formData.append('category', selectedCategory)
      formData.append('name', file.name)

      const res = await fetch('/api/admin/agent-resources', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload failed')
      }

      setSuccess('Resource uploaded successfully')
      loadResources()
      if (fileInputRef.current) fileInputRef.current.value = ''
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (resource: Resource) => {
    setDownloading(resource.id)
    try {
      const res = await fetch(`/api/admin/agent-resources/download?id=${resource.id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Download failed')
      window.open(data.url, '_blank')
    } catch {
      setError('Failed to generate download link')
    } finally {
      setDownloading(null)
    }
  }

  const handleDelete = async (resource: Resource) => {
    if (!confirm(`Delete "${resource.name}"?`)) return
    try {
      const res = await fetch(`/api/admin/agent-resources/${resource.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setResources(prev => prev.filter(r => r.id !== resource.id))
    } catch {
      setError('Failed to delete resource')
    }
  }

  const grouped = RESOURCE_CATEGORIES.reduce((acc, cat) => {
    const docs = resources.filter(r => r.category === cat)
    if (docs.length > 0) acc[cat] = docs
    return acc
  }, {} as Record<string, Resource[]>)

  const totalSize = resources.reduce((sum, r) => sum + (r.file_size || 0), 0)

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[#0c2749]">Resources</h1>
        <p className="text-gray-400 text-sm mt-0.5">Shared documents and completed forms for all agents.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
        {(['documents', 'forms'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeTab === tab ? 'bg-white text-[#0c2749] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'documents' ? 'Documents' : 'Form Submissions'}
          </button>
        ))}
      </div>

      {activeTab === 'forms' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{submissions.length} submitted form{submissions.length !== 1 ? 's' : ''}</p>
            <Link href="/admin/forms"
              className="flex items-center gap-2 bg-[#0c2749] hover:bg-[#0a1f3a] text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors">
              <Plus size={14} /> Fill Out a Form
            </Link>
          </div>
          {submissionsLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-[#0c2749] rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
              <FileText size={32} className="mx-auto mb-3 text-gray-200" />
              <p className="text-sm">No forms submitted yet.</p>
              <Link href="/admin/forms" className="text-[#0c2749] font-medium hover:underline text-sm mt-2 inline-block">
                Fill out a form →
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {submissions.map((s, i) => (
                <div key={s.id}
                  className={`flex items-center gap-4 px-5 py-4 ${i < submissions.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="w-8 h-8 rounded-lg bg-[#0c2749]/5 flex items-center justify-center flex-shrink-0">
                    <FileText size={15} className="text-[#0c2749]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{s.form_title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {FORM_LABELS[s.form_type] || s.form_type}
                      {' · '}
                      <span className="inline-flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </p>
                  </div>
                  <Link href={`/admin/forms/view/${s.id}`}
                    className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#0c2749] transition-colors" title="View / Print">
                    <Eye size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'documents' && (
        <>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <FileText size={18} className="text-[#0c2749]" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Files</p>
            <p className="font-semibold text-[#0c2749]">{resources.length} documents</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <FolderOpen size={18} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Size</p>
            <p className="font-semibold text-[#0c2749]">{formatFileSize(totalSize)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-[#0c2749] mb-4 flex items-center gap-2">
          <Plus size={16} /> Upload New Resource
        </h2>
        <div className="flex gap-3 flex-wrap">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="flex-1 min-w-[200px] border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] bg-white"
          >
            {RESOURCE_CATEGORIES.map(cat => (
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-[#0c2749] mb-5">All Resources</h2>
        {loading ? (
          <div className="text-center py-8 text-gray-400">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-[#0c2749] rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <FolderOpen size={36} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm">No resources uploaded yet</p>
            <p className="text-xs mt-1">Upload listing agreements, forms, and other shared documents</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([category, docs]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{category}</h3>
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
        </>
      )}
    </div>
  )
}