'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, TrendingUp, Eye, ThumbsUp, ThumbsDown, HelpCircle, MessageSquare, Calendar, ChevronDown, ChevronUp, MousePointerClick, User, Building2, Printer, UserCheck } from 'lucide-react'

interface PropertyEvent {
  id: string
  created_at: string
  event_type: string
  property_slug: string
}

interface Property { id: string; title: string; slug: string; location: string | null; price: number | null; status: string; currency?: string; agent_id?: string | null }
interface Showing {
  id: string
  client_name: string
  client_id: string | null
  property_name: string
  property_slug: string | null
  showing_date: string
  showing_time: string
  outcome: string
  agent_notes: string | null
  logged_by: string | null
  agent_id: string | null
}
interface Client { id: string; name: string; email: string | null; phone: string | null; status: string; interest: string | null }
interface Agent { id: string; name: string; email: string }

// Jeff's ID — excluded from agent report selector
const JEFF_ID = 'ed382898-4009-45e4-9370-93c4064f8fec'

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-[#0c2749]">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  )
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

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'property' | 'client' | 'agent'>('property')

  // ── Shared data ──
  const [properties, setProperties] = useState<Property[]>([])
  const [allShowings, setAllShowings] = useState<Showing[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [loadingProps, setLoadingProps] = useState(true)
  const [loadingShowings, setLoadingShowings] = useState(true)
  const [loadingClients, setLoadingClients] = useState(true)

  // ── Property report state ──
  const [propertySearch, setPropertySearch] = useState('')
  const [propertyOpen, setPropertyOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [expandedShowing, setExpandedShowing] = useState<string | null>(null)
  const [events, setEvents] = useState<PropertyEvent[]>([])

  // ── Client report state ──
  const [clientSearch, setClientSearch] = useState('')
  const [clientOpen, setClientOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [expandedClientShowing, setExpandedClientShowing] = useState<string | null>(null)

  // ── Agent report state ──
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [expandedAgentShowing, setExpandedAgentShowing] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/properties')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setProperties((Array.isArray(data) ? data : []).filter((p: Property) => p && p.title))
        setLoadingProps(false)
      })
      .catch(() => setLoadingProps(false))

    fetch('/api/admin/showings')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setAllShowings(Array.isArray(data) ? data : []); setLoadingShowings(false) })
      .catch(() => setLoadingShowings(false))

    fetch('/api/admin/clients')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setClients(Array.isArray(data) ? data : []); setLoadingClients(false) })
      .catch(() => setLoadingClients(false))

    fetch('/api/admin/agents')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setAgents((Array.isArray(data) ? data : []).filter((a: Agent) => a.id !== JEFF_ID))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedProperty) { setEvents([]); return }
    fetch(`/api/admin/events?slug=${selectedProperty.slug}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]))
  }, [selectedProperty])

  // ── Property report computed ──
  const filteredProps = properties.filter(p => {
    if (!p || !p.title) return false
    if (!propertySearch.trim()) return true
    const q = propertySearch.toLowerCase()
    return p.title.toLowerCase().includes(q) ||
      (p.slug || '').toLowerCase().includes(q) ||
      (p.location || '').toLowerCase().includes(q)
  })

  const propShowings = selectedProperty
    ? allShowings.filter(s => {
        return (s as any).property_id === selectedProperty.id || s.property_slug === selectedProperty.slug
      })
    : []

  const interested = propShowings.filter(s => s.outcome === 'interested')
  const notInterested = propShowings.filter(s => s.outcome === 'not_interested')
  const undecided = propShowings.filter(s => s.outcome === 'pending')
  const withFeedback = propShowings.filter(s => s.agent_notes && s.agent_notes.trim())
  const interestRate = propShowings.length > 0 ? Math.round((interested.length / propShowings.length) * 100) : 0

  const totalViews = events.filter(e => e.event_type === 'view').length
  const totalEnquiryClicks = events.filter(e => e.event_type === 'enquiry_click').length
  const enquiryConversionRate = totalViews > 0 ? Math.round((totalEnquiryClicks / totalViews) * 100) : 0
  const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentViews = events.filter(e => e.event_type === 'view' && new Date(e.created_at) >= sevenDaysAgo).length

  // ── Client report computed ──
  const filteredClients = clients.filter(c => {
    if (!c || !c.name) return false
    if (!clientSearch.trim()) return true
    const q = clientSearch.toLowerCase()
    return c.name.toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q)
  })

  const clientShowings = selectedClient
    ? allShowings.filter(s => s.client_id === selectedClient.id || s.client_name === selectedClient.name)
    : []

  const clientInterested = clientShowings.filter(s => s.outcome === 'interested')
  const clientNotInterested = clientShowings.filter(s => s.outcome === 'not_interested')
  const clientWithFeedback = clientShowings.filter(s => s.agent_notes && s.agent_notes.trim())

  // ── Agent report computed ──
  const agentShowings = selectedAgent
    ? allShowings.filter(s => s.agent_id === selectedAgent.id)
    : []
  const agentProperties = selectedAgent
    ? properties.filter(p => p.agent_id === selectedAgent.id)
    : []
  const agentInterested = agentShowings.filter(s => s.outcome === 'interested')
  const agentNotInterested = agentShowings.filter(s => s.outcome === 'not_interested')

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[#0c2749]">Reports</h1>
        <p className="text-gray-400 text-sm mt-0.5">Property performance and client showing history.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
        <button onClick={() => setActiveTab('property')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'property' ? 'bg-white text-[#0c2749] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <Building2 size={15} /> Property Report
        </button>
        <button onClick={() => setActiveTab('client')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'client' ? 'bg-white text-[#0c2749] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <User size={15} /> Client Report
        </button>
        <button onClick={() => setActiveTab('agent')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'agent' ? 'bg-white text-[#0c2749] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <UserCheck size={15} /> Agent Report
        </button>
      </div>

      {/* ════════════════════════════════════════
          PROPERTY REPORT TAB
      ════════════════════════════════════════ */}
      {activeTab === 'property' && (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Property</label>
            {selectedProperty ? (
              <div className="flex items-center justify-between border border-[#0c2749] rounded-xl px-4 py-3 bg-blue-50/40">
                <div>
                  <p className="font-semibold text-[#0c2749]">{selectedProperty.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedProperty.slug}{selectedProperty.price ? ` · $${selectedProperty.price.toLocaleString()}` : ''}{selectedProperty.status ? ` · ${selectedProperty.status}` : ''}
                  </p>
                </div>
                <button onClick={() => { setSelectedProperty(null); setPropertySearch('') }}
                  className="text-sm text-gray-400 hover:text-red-400 transition-colors ml-4">Change</button>
              </div>
            ) : (
              <div>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input type="text"
                    placeholder={loadingProps ? 'Loading properties…' : `Search from ${properties.length} properties…`}
                    value={propertySearch}
                    onChange={e => { setPropertySearch(e.target.value); setPropertyOpen(true) }}
                    onFocus={() => setPropertyOpen(true)}
                    onBlur={() => setTimeout(() => setPropertyOpen(false), 200)}
                    disabled={loadingProps}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] bg-white" />
                </div>
                {propertyOpen && filteredProps.length > 0 && (
                  <div className="mt-1 border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto bg-white">
                    {filteredProps.slice(0, 40).map(p => (
                      <button key={p.id} type="button"
                        onMouseDown={e => { e.preventDefault(); setSelectedProperty(p); setPropertySearch(''); setPropertyOpen(false) }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                        <p className="text-sm font-medium text-gray-800">{p.title}</p>
                        <p className="text-xs text-gray-400">{p.slug}{p.price ? ` · $${p.price.toLocaleString()}` : ''}{p.status ? ` · ${p.status}` : ''}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {!selectedProperty ? (
            <div className="text-center py-20 text-gray-400">
              <TrendingUp size={40} className="mx-auto mb-4 text-gray-200" />
              <p className="text-base font-medium text-gray-500 mb-1">Select a property above</p>
              <p className="text-sm">You'll see showing stats, interest levels, and client feedback.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => window.open(`/reports-print?type=property&id=${selectedProperty.id}`, '_blank')}
                  className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-[#0c2749] hover:text-[#0c2749] px-4 py-2 rounded-xl text-sm font-medium transition-colors bg-white">
                  <Printer size={15} /> Export PDF
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <StatCard icon={<Eye size={20} className="text-indigo-600" />} label="Total Page Views" value={totalViews} color="bg-indigo-50" />
                <StatCard icon={<Calendar size={20} className="text-blue-500" />} label="Views (Last 7 Days)" value={recentViews} color="bg-blue-50" />
                <StatCard icon={<MousePointerClick size={20} className="text-purple-600" />} label="Enquiry Clicks" value={totalEnquiryClicks} color="bg-purple-50" />
                <StatCard icon={<TrendingUp size={20} className="text-teal-600" />} label="Click-through Rate" value={`${enquiryConversionRate}%`} color="bg-teal-50" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <StatCard icon={<Eye size={20} className="text-[#0c2749]" />} label="Total Showings" value={propShowings.length} color="bg-blue-50" />
                <StatCard icon={<ThumbsUp size={20} className="text-green-600" />} label="Interested" value={interested.length} color="bg-green-50" />
                <StatCard icon={<ThumbsDown size={20} className="text-red-500" />} label="Not Interested" value={notInterested.length} color="bg-red-50" />
                <StatCard icon={<HelpCircle size={20} className="text-amber-500" />} label="Undecided" value={undecided.length} color="bg-amber-50" />
              </div>
              {propShowings.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-[#0c2749]">Interest Rate</p>
                    <span className="text-2xl font-bold text-[#0c2749]">{interestRate}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${interestRate}%`, background: interestRate >= 60 ? '#16a34a' : interestRate >= 30 ? '#f59e0b' : '#ef4444' }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>{interested.length} interested</span>
                    <span>{propShowings.length} total showings</span>
                  </div>
                </div>
              )}
              {withFeedback.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare size={16} className="text-[#0c2749]" />
                    <h2 className="font-semibold text-[#0c2749]">Client Feedback</h2>
                    <span className="text-xs text-gray-400 ml-auto">{withFeedback.length} response{withFeedback.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="space-y-4">
                    {withFeedback.map(s => (
                      <div key={s.id} className="border-l-2 border-[#0c2749]/20 pl-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${OUTCOME_STYLES[s.outcome]}`}>{OUTCOME_LABELS[s.outcome]}</span>
                          <span className="text-xs text-gray-400">{s.client_name}</span>
                          <span className="text-xs text-gray-300">·</span>
                          <span className="text-xs text-gray-400">{new Date(s.showing_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{s.agent_notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-50">
                  <Calendar size={15} className="text-[#0c2749]" />
                  <h2 className="font-semibold text-[#0c2749]">Showing History</h2>
                  <span className="text-xs text-gray-400 ml-auto">{propShowings.length} total</span>
                </div>
                {propShowings.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-sm">No showings logged for this property yet.</p>
                    <Link href="/admin/showings/new" className="text-[#0c2749] font-medium hover:underline text-sm mt-2 inline-block">Log the first showing →</Link>
                  </div>
                ) : (
                  propShowings.map((s, i) => (
                    <div key={s.id} className={i < propShowings.length - 1 ? 'border-b border-gray-50' : ''}>
                      <div className="flex items-center gap-4 px-6 py-3.5">
                        <div className="w-8 h-8 rounded-full bg-[#0c2749] flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">{s.client_name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{s.client_name}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(s.showing_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {s.showing_time}
                            {s.logged_by ? ` · ${s.logged_by}` : ''}
                          </p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${OUTCOME_STYLES[s.outcome]}`}>{OUTCOME_LABELS[s.outcome]}</span>
                        {s.agent_notes && (
                          <button onClick={() => setExpandedShowing(expandedShowing === s.id ? null : s.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors flex-shrink-0">
                            {expandedShowing === s.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        )}
                        {s.client_id && (
                          <Link href={`/admin/clients/${s.client_id}`} className="text-xs text-[#0c2749] hover:underline flex-shrink-0 hidden sm:block">View →</Link>
                        )}
                      </div>
                      {expandedShowing === s.id && s.agent_notes && (
                        <div className="px-6 pb-4 bg-gray-50/50 border-t border-gray-50">
                          <p className="text-sm text-gray-600 leading-relaxed pt-3 whitespace-pre-wrap">{s.agent_notes}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* ════════════════════════════════════════
          CLIENT REPORT TAB
      ════════════════════════════════════════ */}
      {activeTab === 'client' && (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Client</label>
            {selectedClient ? (
              <div className="flex items-center justify-between border border-[#0c2749] rounded-xl px-4 py-3 bg-blue-50/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0c2749] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{selectedClient.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0c2749]">{selectedClient.name}</p>
                    {selectedClient.email && <p className="text-xs text-gray-400">{selectedClient.email}</p>}
                  </div>
                </div>
                <button onClick={() => { setSelectedClient(null); setClientSearch('') }}
                  className="text-sm text-gray-400 hover:text-red-400 transition-colors ml-4">Change</button>
              </div>
            ) : (
              <div>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input type="text"
                    placeholder={loadingClients ? 'Loading clients…' : `Search from ${clients.length} clients…`}
                    value={clientSearch}
                    onChange={e => { setClientSearch(e.target.value); setClientOpen(true) }}
                    onFocus={() => setClientOpen(true)}
                    onBlur={() => setTimeout(() => setClientOpen(false), 200)}
                    disabled={loadingClients}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] bg-white" />
                </div>
                {clientOpen && filteredClients.length > 0 && (
                  <div className="mt-1 border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto bg-white">
                    {filteredClients.slice(0, 40).map(c => (
                      <button key={c.id} type="button"
                        onMouseDown={e => { e.preventDefault(); setSelectedClient(c); setClientSearch(''); setClientOpen(false) }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#0c2749] flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">{c.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}</span>
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

          {!selectedClient ? (
            <div className="text-center py-20 text-gray-400">
              <User size={40} className="mx-auto mb-4 text-gray-200" />
              <p className="text-base font-medium text-gray-500 mb-1">Select a client above</p>
              <p className="text-sm">You'll see all their showings, feedback, and property interests.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => window.open(`/reports-print?type=client&id=${selectedClient.id}`, '_blank')}
                  className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-[#0c2749] hover:text-[#0c2749] px-4 py-2 rounded-xl text-sm font-medium transition-colors bg-white">
                  <Printer size={15} /> Export PDF
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <StatCard icon={<Calendar size={20} className="text-[#0c2749]" />} label="Total Showings" value={clientShowings.length} color="bg-blue-50" />
                <StatCard icon={<ThumbsUp size={20} className="text-green-600" />} label="Interested" value={clientInterested.length} color="bg-green-50" />
                <StatCard icon={<ThumbsDown size={20} className="text-red-500" />} label="Not Interested" value={clientNotInterested.length} color="bg-red-50" />
                <StatCard icon={<MessageSquare size={20} className="text-purple-600" />} label="With Feedback" value={clientWithFeedback.length} color="bg-purple-50" />
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-semibold text-[#0c2749] text-lg">{selectedClient.name}</h2>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      {selectedClient.email && <span>✉ {selectedClient.email}</span>}
                      {selectedClient.interest && <span className="capitalize">🏠 Interest: {selectedClient.interest}</span>}
                      <span className="capitalize">● Status: {selectedClient.status}</span>
                    </div>
                  </div>
                  <Link href={`/admin/clients/${selectedClient.id}`} className="text-xs text-[#0c2749] font-medium hover:underline">Edit Profile →</Link>
                </div>
              </div>
              {clientShowings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
                  <p className="text-sm">No showings logged for this client yet.</p>
                  <Link href="/admin/showings/new" className="text-[#0c2749] font-medium hover:underline text-sm mt-2 inline-block">Log a showing →</Link>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-50">
                    <Building2 size={15} className="text-[#0c2749]" />
                    <h2 className="font-semibold text-[#0c2749]">Properties Shown</h2>
                    <span className="text-xs text-gray-400 ml-auto">{clientShowings.length} showing{clientShowings.length !== 1 ? 's' : ''}</span>
                  </div>
                  {clientShowings.map((s, i) => (
                    <div key={s.id} className={i < clientShowings.length - 1 ? 'border-b border-gray-50' : ''}>
                      <div className="flex items-center gap-4 px-6 py-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">{s.property_name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(s.showing_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                            {' · '}{s.showing_time}
                            {s.logged_by ? ` · Agent: ${s.logged_by}` : ''}
                          </p>
                          {s.property_slug && <p className="text-xs font-mono text-gray-300 mt-0.5">{s.property_slug}</p>}
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${OUTCOME_STYLES[s.outcome]}`}>{OUTCOME_LABELS[s.outcome]}</span>
                        {s.agent_notes && (
                          <button onClick={() => setExpandedClientShowing(expandedClientShowing === s.id ? null : s.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors flex-shrink-0">
                            {expandedClientShowing === s.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        )}
                      </div>
                      {expandedClientShowing === s.id && s.agent_notes && (
                        <div className="px-6 pb-4 bg-gray-50/50 border-t border-gray-50">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 pt-3">Client Feedback</p>
                          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{s.agent_notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ════════════════════════════════════════
          AGENT REPORT TAB
      ════════════════════════════════════════ */}
      {activeTab === 'agent' && (
        <>
          {/* Agent selector */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Agent</label>
            <div className="flex gap-3">
              {agents.map(a => (
                <button key={a.id} type="button"
                  onClick={() => setSelectedAgent(selectedAgent?.id === a.id ? null : a)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-colors flex-1 text-left ${selectedAgent?.id === a.id ? 'border-[#0c2749] bg-blue-50/40' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="w-8 h-8 rounded-full bg-[#0c2749] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{a.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0c2749]">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {!selectedAgent ? (
            <div className="text-center py-20 text-gray-400">
              <UserCheck size={40} className="mx-auto mb-4 text-gray-200" />
              <p className="text-base font-medium text-gray-500 mb-1">Select an agent above</p>
              <p className="text-sm">You'll see their assigned properties and showings conducted.</p>
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <StatCard icon={<Building2 size={20} className="text-[#0c2749]" />} label="Assigned Properties" value={agentProperties.length} color="bg-blue-50" />
                <StatCard icon={<Calendar size={20} className="text-purple-600" />} label="Showings Conducted" value={agentShowings.length} color="bg-purple-50" />
                <StatCard icon={<ThumbsUp size={20} className="text-green-600" />} label="Interested Clients" value={agentInterested.length} color="bg-green-50" />
                <StatCard icon={<ThumbsDown size={20} className="text-red-500" />} label="Not Interested" value={agentNotInterested.length} color="bg-red-50" />
              </div>

              {/* Assigned Properties */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-50">
                  <Building2 size={15} className="text-[#0c2749]" />
                  <h2 className="font-semibold text-[#0c2749]">Assigned Properties</h2>
                  <span className="text-xs text-gray-400 ml-auto">{agentProperties.length} total</span>
                </div>
                {agentProperties.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <p className="text-sm">No properties assigned to {selectedAgent.name} yet.</p>
                    <p className="text-xs mt-1">Assign properties via the Edit Property page.</p>
                  </div>
                ) : (
                  agentProperties.map((p, i) => (
                    <div key={p.id} className={`flex items-center gap-4 px-6 py-3.5 ${i < agentProperties.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{p.title}</p>
                        <p className="text-xs text-gray-400">{p.location}{p.price ? ` · $${p.price.toLocaleString()}` : ''}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${p.status === 'active' ? 'bg-green-100 text-green-700' : p.status === 'sold' ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-700'}`}>
                        {p.status}
                      </span>
                      <Link href={`/admin/properties/${p.id}`} className="text-xs text-[#0c2749] hover:underline flex-shrink-0">Edit →</Link>
                    </div>
                  ))
                )}
              </div>

              {/* Showings conducted */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-50">
                  <Calendar size={15} className="text-[#0c2749]" />
                  <h2 className="font-semibold text-[#0c2749]">Showings Conducted</h2>
                  <span className="text-xs text-gray-400 ml-auto">{agentShowings.length} total</span>
                </div>
                {agentShowings.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <p className="text-sm">No showings logged for {selectedAgent.name} yet.</p>
                  </div>
                ) : (
                  agentShowings.map((s, i) => (
                    <div key={s.id} className={i < agentShowings.length - 1 ? 'border-b border-gray-50' : ''}>
                      <div className="flex items-center gap-4 px-6 py-3.5">
                        <div className="w-8 h-8 rounded-full bg-[#0c2749] flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">{s.client_name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{s.client_name}</p>
                          <p className="text-xs text-gray-400">{s.property_name} · {new Date(s.showing_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {s.showing_time}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${OUTCOME_STYLES[s.outcome]}`}>{OUTCOME_LABELS[s.outcome]}</span>
                        {s.agent_notes && (
                          <button onClick={() => setExpandedAgentShowing(expandedAgentShowing === s.id ? null : s.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors flex-shrink-0">
                            {expandedAgentShowing === s.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        )}
                        {s.client_id && (
                          <Link href={`/admin/clients/${s.client_id}`} className="text-xs text-[#0c2749] hover:underline flex-shrink-0 hidden sm:block">View →</Link>
                        )}
                      </div>
                      {expandedAgentShowing === s.id && s.agent_notes && (
                        <div className="px-6 pb-4 bg-gray-50/50 border-t border-gray-50">
                          <p className="text-sm text-gray-600 leading-relaxed pt-3 whitespace-pre-wrap">{s.agent_notes}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}