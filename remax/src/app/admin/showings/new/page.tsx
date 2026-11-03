'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

interface Client { id: string; name: string; email: string | null; phone: string | null }
interface Property { id: string; title: string; slug: string; location: string | null; price: number | null }
interface Agent { id: string; name: string; email: string }

const TIME_SLOTS = [
  '8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM',
  '11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM',
  '2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM',
  '5:00 PM','5:30 PM','6:00 PM',
]

// Jeff's ID — excluded from agent dropdown
const JEFF_ID = 'ed382898-4009-45e4-9370-93c4064f8fec'

export default function LogShowingPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Client selector
  const [clientSearch, setClientSearch] = useState('')
  const [clientOpen, setClientOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  // Property selector
  const [propertyMode, setPropertyMode] = useState<'database' | 'manual'>('database')
  const [propertySearch, setPropertySearch] = useState('')
  const [propertyOpen, setPropertyOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [manualPropertyName, setManualPropertyName] = useState('')

  // Showing details
  const [showingDate, setShowingDate] = useState('')
  const [showingTime, setShowingTime] = useState('')
  const [outcome, setOutcome] = useState('pending')
  const [agentNotes, setAgentNotes] = useState('')
  const [selectedAgentId, setSelectedAgentId] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/clients').then(r => r.ok ? r.json() : []),
      fetch('/api/admin/properties').then(r => r.ok ? r.json() : []),
      fetch('/api/admin/agents').then(r => r.ok ? r.json() : []),
    ]).then(([c, p, a]) => {
      setClients(Array.isArray(c) ? c : [])
      setProperties((Array.isArray(p) ? p : []).filter((x: Property) => x && x.title))
      setAgents((Array.isArray(a) ? a : []).filter((ag: Agent) => ag.id !== JEFF_ID))
      setLoadingData(false)
    }).catch(() => setLoadingData(false))
  }, [])

  const filteredClients = clients.filter(c =>
    !clientSearch || c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(clientSearch.toLowerCase())
  )

  const filteredProperties = properties.filter(p =>
    !propertySearch || p.title.toLowerCase().includes(propertySearch.toLowerCase()) ||
    (p.slug || '').toLowerCase().includes(propertySearch.toLowerCase()) ||
    (p.location || '').toLowerCase().includes(propertySearch.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClient) { setError('Please select a client.'); return }
    if (propertyMode === 'database' && !selectedProperty) { setError('Please select a property.'); return }
    if (propertyMode === 'manual' && !manualPropertyName.trim()) { setError('Please enter a property name.'); return }
    if (!showingDate) { setError('Please select a date.'); return }
    if (!showingTime) { setError('Please select a time.'); return }

    setSaving(true)
    setError('')
    try {
      const propertyPayload = propertyMode === 'database'
        ? {
            property_id: selectedProperty!.id,
            property_name: selectedProperty!.title,
            property_slug: selectedProperty!.slug,
          }
        : {
            property_id: null,
            property_name: manualPropertyName.trim(),
            property_slug: null,
          }

      const selectedAgent = agents.find(a => a.id === selectedAgentId)

      const res = await fetch('/api/admin/showings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: selectedClient.id,
          client_name: selectedClient.name,
          ...propertyPayload,
          showing_date: showingDate,
          showing_time: showingTime,
          outcome,
          agent_notes: agentNotes.trim() || null,
          agent_id: selectedAgentId || null,
          logged_by: selectedAgent?.name || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      router.push('/admin/showings')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save showing')
      setSaving(false)
    }
  }

  const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] transition-colors bg-white'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'
  const sectionClass = 'bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/admin/showings" className="text-gray-400 hover:text-[#0c2749] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-2xl font-bold text-[#0c2749]">Log a Showing</h1>
      </div>
      <p className="text-gray-400 text-sm mb-8 ml-8">Record a property showing and capture client feedback.</p>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">

        {/* ── Client selector ── */}
        <div className={sectionClass}>
          <h2 className="font-semibold text-[#0c2749] mb-5">Client</h2>
          <div className="relative">
            <label className={labelClass}>Select Client *</label>
            {selectedClient ? (
              <div className="flex items-center justify-between border border-[#0c2749] rounded-xl px-4 py-2.5 bg-blue-50/40">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#0c2749] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {selectedClient.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0c2749]">{selectedClient.name}</p>
                    {selectedClient.email && <p className="text-xs text-gray-400">{selectedClient.email}</p>}
                  </div>
                </div>
                <button type="button" onClick={() => setSelectedClient(null)}
                  className="text-gray-400 hover:text-red-400 text-xs transition-colors">Change</button>
              </div>
            ) : (
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="text"
                  placeholder={loadingData ? 'Loading clients…' : 'Search by name or email…'}
                  value={clientSearch}
                  onChange={e => { setClientSearch(e.target.value); setClientOpen(true) }}
                  onFocus={() => setClientOpen(true)}
                  onBlur={() => setTimeout(() => setClientOpen(false), 150)}
                  className={inputClass + ' pl-9'}
                  disabled={loadingData} />
                {clientOpen && filteredClients.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                    {filteredClients.slice(0, 30).map(c => (
                      <button key={c.id} type="button"
                        onMouseDown={() => { setSelectedClient(c); setClientSearch(''); setClientOpen(false) }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-0">
                        <div className="w-7 h-7 rounded-full bg-[#0c2749] flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {c.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{c.name}</p>
                          {c.email && <p className="text-xs text-gray-400">{c.email}</p>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Property selector ── */}
        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[#0c2749]">Property</h2>
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 text-xs font-medium">
              <button type="button"
                onClick={() => { setPropertyMode('database'); setManualPropertyName(''); setSelectedProperty(null) }}
                className={`px-3 py-1.5 rounded-md transition-colors ${propertyMode === 'database' ? 'bg-white text-[#0c2749] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                From Database
              </button>
              <button type="button"
                onClick={() => { setPropertyMode('manual'); setSelectedProperty(null); setPropertySearch('') }}
                className={`px-3 py-1.5 rounded-md transition-colors ${propertyMode === 'manual' ? 'bg-white text-[#0c2749] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                Enter Manually
              </button>
            </div>
          </div>

          {propertyMode === 'database' ? (
            <div className="relative">
              <label className={labelClass}>Select Property *</label>
              {selectedProperty ? (
                <div className="flex items-center justify-between border border-[#0c2749] rounded-xl px-4 py-2.5 bg-blue-50/40">
                  <div>
                    <p className="text-sm font-medium text-[#0c2749]">{selectedProperty.title}</p>
                    <p className="text-xs text-gray-400">{selectedProperty.slug}{selectedProperty.price ? ` · $${selectedProperty.price.toLocaleString()}` : ''}</p>
                  </div>
                  <button type="button" onClick={() => setSelectedProperty(null)}
                    className="text-gray-400 hover:text-red-400 text-xs transition-colors">Change</button>
                </div>
              ) : (
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input type="text"
                    placeholder={loadingData ? 'Loading properties…' : 'Search by name or location…'}
                    value={propertySearch}
                    onChange={e => { setPropertySearch(e.target.value); setPropertyOpen(true) }}
                    onFocus={() => setPropertyOpen(true)}
                    onBlur={() => setTimeout(() => setPropertyOpen(false), 150)}
                    className={inputClass + ' pl-9'}
                    disabled={loadingData} />
                  {propertyOpen && filteredProperties.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                      {filteredProperties.slice(0, 30).map(p => (
                        <button key={p.id} type="button"
                          onMouseDown={() => { setSelectedProperty(p); setPropertySearch(''); setPropertyOpen(false) }}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                          <p className="text-sm font-medium text-gray-800">{p.title}</p>
                          <p className="text-xs text-gray-400">{p.slug}{p.price ? ` · $${p.price.toLocaleString()}` : ''}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className={labelClass}>Property Name *</label>
              <input type="text"
                value={manualPropertyName}
                onChange={e => setManualPropertyName(e.target.value)}
                placeholder="e.g. 12 Ocean Drive, English Harbour"
                className={inputClass} />
              <p className="text-xs text-gray-400 mt-1.5">Use this for properties not listed in the database.</p>
            </div>
          )}
        </div>

        {/* ── Date, Time, Agent ── */}
        <div className={sectionClass}>
          <h2 className="font-semibold text-[#0c2749] mb-5">Showing Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Date *</label>
              <input type="date" value={showingDate} min={today}
                onChange={e => setShowingDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Time *</label>
              <select value={showingTime} onChange={e => setShowingTime(e.target.value)} className={inputClass}>
                <option value="">— Select time —</option>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Agent</label>
              <select
                value={selectedAgentId}
                onChange={e => setSelectedAgentId(e.target.value)}
                className={inputClass}
              >
                <option value="">— Select agent —</option>
                {agents.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Outcome + Feedback ── */}
        <div className={sectionClass}>
          <h2 className="font-semibold text-[#0c2749] mb-5">Client Feedback</h2>
          <div className="mb-5">
            <label className={labelClass}>Outcome</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'interested', label: '👍 Interested', active: 'border-green-500 bg-green-50 text-green-700' },
                { value: 'not_interested', label: '👎 Not Interested', active: 'border-red-400 bg-red-50 text-red-600' },
                { value: 'pending', label: '🤔 Undecided', active: 'border-[#0c2749] bg-blue-50 text-[#0c2749]' },
              ].map(opt => (
                <button key={opt.value} type="button" onClick={() => setOutcome(opt.value)}
                  className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-colors text-center
                    ${outcome === opt.value ? opt.active : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Client Feedback <span className="text-gray-400 font-normal">(notes from the showing)</span></label>
            <textarea rows={5} value={agentNotes} onChange={e => setAgentNotes(e.target.value)}
              placeholder="What did the client say? What did they like or dislike? Any follow-up needed?"
              className={inputClass + ' resize-none'} />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-100">{error}</p>
        )}

        <div className="flex gap-3 pb-8">
          <button type="button" onClick={() => router.back()}
            className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:border-[#0c2749] transition-colors text-sm">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 bg-[#0c2749] hover:bg-[#0a1f3a] disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors text-sm">
            {saving ? 'Saving…' : 'Log Showing'}
          </button>
        </div>
      </form>
    </div>
  )
}