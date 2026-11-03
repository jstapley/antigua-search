'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Clock, Trash2, Eye, ChevronRight } from 'lucide-react'

const FORM_TYPES = [
  {
    slug: 'client-information',
    label: 'Client Information Form',
    description: 'KYC form with personal details, ID, and transaction info.',
    color: 'bg-blue-50 text-blue-700 border-blue-100',
    icon: '📋',
  },
  {
    slug: 'buyer-representation',
    label: 'Buyer Representation Agreement',
    description: 'Exclusive agreement appointing RE/MAX 365 as buyer\'s agent.',
    color: 'bg-green-50 text-green-700 border-green-100',
    icon: '🤝',
  },
  {
    slug: 'exclusive-seller',
    label: 'Exclusive Seller Agreement',
    description: 'Exclusive listing agreement for seller representation.',
    color: 'bg-purple-50 text-purple-700 border-purple-100',
    icon: '🏠',
  },
  {
    slug: 'letter-of-intent',
    label: 'Letter of Intent',
    description: 'Interest to purchase with price, deposit, and closing terms.',
    color: 'bg-amber-50 text-amber-700 border-amber-100',
    icon: '📝',
  },
  {
    slug: 'non-exclusive-seller',
    label: 'Non-Exclusive Seller Agreement',
    description: 'Non-exclusive listing agreement for seller representation.',
    color: 'bg-rose-50 text-rose-700 border-rose-100',
    icon: '📄',
  },
]

const FORM_LABELS: Record<string, string> = {
  'client-information': 'Client Information Form',
  'buyer-representation': 'Buyer Representation Agreement',
  'exclusive-seller': 'Exclusive Seller Agreement',
  'letter-of-intent': 'Letter of Intent',
  'non-exclusive-seller': 'Non-Exclusive Seller Agreement',
}

interface Submission {
  id: string
  form_type: string
  form_title: string
  created_by: string | null
  created_at: string
}

export default function FormsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/form-submissions')
      .then(r => r.json())
      .then(data => { setSubmissions(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    setDeletingId(id)
    try {
      await fetch(`/api/admin/form-submissions/${id}`, { method: 'DELETE' })
      setSubmissions(prev => prev.filter(s => s.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-[#0c2749]">Forms</h1>
        <p className="text-gray-400 text-sm mt-0.5">Fill out and store RE/MAX 365 legal and administrative forms.</p>
      </div>

      {/* Form templates */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Select a Form to Fill Out</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FORM_TYPES.map(form => (
            <Link
              key={form.slug}
              href={`/admin/forms/${form.slug}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-gray-200 transition-all group"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{form.icon}</span>
                <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:text-[#0c2749] transition-colors mt-0.5" />
              </div>
              <p className="font-semibold text-[#0c2749] text-sm mb-1">{form.label}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{form.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Submitted forms */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Submitted Forms ({submissions.length})
        </h2>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-[#0c2749] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
            <FileText size={32} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm">No forms submitted yet.</p>
            <p className="text-xs mt-1">Fill out a form above to get started.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {submissions.map((s, i) => (
              <div
                key={s.id}
                className={`flex items-center gap-4 px-5 py-4 ${i < submissions.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#0c2749]/5 flex items-center justify-center flex-shrink-0">
                  <FileText size={15} className="text-[#0c2749]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{s.form_title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {FORM_LABELS[s.form_type] || s.form_type}
                    {s.created_by ? ` · ${s.created_by}` : ''}
                    {' · '}
                    <span className="inline-flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link
                    href={`/admin/forms/view/${s.id}`}
                    className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#0c2749] transition-colors"
                    title="View / Print"
                  >
                    <Eye size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(s.id, s.form_title)}
                    disabled={deletingId === s.id}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
