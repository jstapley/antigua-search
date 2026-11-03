'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, ChevronDown, ChevronUp, Trash2, Pencil } from 'lucide-react'

interface Showing {
  id: string
  client_name: string
  client_id: string | null
  property_name: string
  property_slug: string | null
  property_id: string | null
  showing_date: string
  showing_time: string
  outcome: string
  agent_notes: string | null
  logged_by: string | null
  agent_id: string | null
  created_at: string
}

const OUTCOME_STYLES: Record<string, string> = {
  interested: 'bg-green-100 text-green-700',
  not_interested: 'bg-red-100 text-red-600',
  pending: 'bg-amber-100 text-amber-700',
}

const OUTCOME_LABELS: Record<string, string> = {
  interested: '👍 Interested',
  not_interested: '👎 Not Interested',
  pending: '🤔 Undecided',
}

const OUTCOME_OPTIONS = [
  { value: 'interested', label: '👍 Interested' },
  { value: 'not_interested', label: '👎 Not Interested' },
  { value: 'pending', label: '🤔 Undecided' },
]

export default function ShowingsPage() {
  const [showings, setShowings] = useState<Showing[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterOutcome, setFilterOutcome] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/showings')
      .then(r => r.json())
      .then(data => { setShowings(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = showings.filter(s => {
    const q = search.toLowerCase().trim()
    const matchSearch = !q ||
      (s.client_name?.toLowerCase() || '').includes(q) ||
      (s.property_name?.toLowerCase() || '').includes(q) ||
      (s.logged_by?.toLowerCase() || '')  .includes(q)
    const matchOutcome = filterOutcome === 'all' || s.outcome === filterOutcome
    return matchSearch && matchOutcome
  })

  // Group by date
  const grouped = filtered.reduce((acc, s) => {
    const date = s.showing_date
    if (!acc[date]) acc[date] = []
    acc[date].push(s)
    return acc
  }, {} as Record<string, Showing[]>)

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  const stats = {
    total: showings.length,
    interested: showings.filter(s => s.outcome === 'interested').length,
    not_interested: showings.filter(s => s.outcome === 'not_interested').length,
    pending: showings.filter(s => s.outcome === 'pending').length,
  }

  const handleOutcomeChange = async (id: string, outcome: string) => {
    setUpdatingId(id)
    try {
      await fetch(`/api/admin/showings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outcome }),
      })
      setShowings(prev => prev.map(s => s.id === id ? { ...s, outcome } : s))
    } catch (e) {
      console.error('Failed to update outcome', e)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this showing?')) return
    setDeletingId(id)
    try {
      await fetch(`/api/admin/showings/${id}`, { method: 'DELETE' })
      setShowings(prev => prev.filter(s => s.id !== id))
    } catch (e) {
      console.error('Failed to delete showing', e)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0c2749]">Showings</h1>
          <p className="text-gray-400 text-sm mt-0.5">{showings.length} of {showings.length} showings</p>
        </div>
        <Link href="/admin/showings/new"
          className="flex items-center gap-2 bg-[#0c2749] hover:bg-[#0a1f3a] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm">
          <Plus size={16} /> Log Showing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'bg-blue-50 text-[#0c2749]' },
          { label: 'Interested', value: stats.interested, color: 'bg-green-50 text-green-700' },
          { label: 'Not Interested', value: stats.not_interested, color: 'bg-red-50 text-red-600' },
          { label: 'Undecided', value: stats.pending, color: 'bg-amber-50 text-amber-700' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <p className={`text-3xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
            <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search client, property or agent..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] bg-white"
          />
        </div>
        <select
          value={filterOutcome}
          onChange={e => setFilterOutcome(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 bg-white text-gray-700"
        >
          <option value="all">All Outcomes</option>
          {OUTCOME_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-[#0c2749] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Loading showings...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
          <p className="text-sm">No showings found.</p>
          <Link href="/admin/showings/new" className="text-[#0c2749] font-medium hover:underline text-sm mt-2 inline-block">
            Log the first showing →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                  <span className="text-[#0c2749]">
                    {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400">{grouped[date].length} showing{grouped[date].length !== 1 ? 's' : ''}</span>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {grouped[date].map((s, i) => (
                  <div key={s.id} className={i < grouped[date].length - 1 ? 'border-b border-gray-50' : ''}>
                    <div className="flex items-center gap-4 px-5 py-4">
                      {/* Time */}
                      <div className="text-xs text-gray-400 w-16 flex-shrink-0 flex items-center gap-1">
                        <span>🕐</span> {s.showing_time}
                      </div>

                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-[#0c2749] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {(s.client_name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{s.client_name}</p>
                        <p className="text-xs text-gray-400 truncate">
                          {s.property_name}
                          {s.logged_by ? ` · ${s.logged_by}` : ''}
                        </p>
                      </div>

                      {/* Outcome dropdown */}
                      <select
                        value={s.outcome}
                        onChange={e => handleOutcomeChange(s.id, e.target.value)}
                        disabled={updatingId === s.id}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 ${OUTCOME_STYLES[s.outcome] || 'bg-gray-100 text-gray-600'}`}
                      >
                        {OUTCOME_OPTIONS.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {s.agent_notes && (
                          <button
                            onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                          >
                            {expandedId === s.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        )}
                        <Link href={`/admin/showings/${s.id}/edit`}
                          className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#0c2749] transition-colors">
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(s.id)}
                          disabled={deletingId === s.id}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded notes */}
                    {expandedId === s.id && s.agent_notes && (
                      <div className="px-5 pb-4 bg-gray-50/50 border-t border-gray-50">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 pt-3">Client Feedback</p>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{s.agent_notes}</p>
                      </div>
                    )}
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