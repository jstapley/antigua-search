'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

interface Showing {
  id: string
  client_name: string
  property_name: string
  property_slug: string | null
  showing_date: string
  showing_time: string
  outcome: string
  agent_notes: string | null
  logged_by: string | null
}

interface PropertyEvent {
  id: string
  created_at: string
  event_type: string
}

interface Property {
  id: string
  title: string
  slug: string
  location: string | null
  price: number | null
  status: string
}

interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  status: string
  interest: string | null
}

const OUTCOME_LABELS: Record<string, string> = {
  interested: 'Interested',
  not_interested: 'Not Interested',
  pending: 'Undecided',
}

function PrintContent() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') // 'property' | 'client'
  const id = searchParams.get('id')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Property report data
  const [property, setProperty] = useState<Property | null>(null)
  const [showings, setShowings] = useState<Showing[]>([])
  const [events, setEvents] = useState<PropertyEvent[]>([])

  // Client report data
  const [client, setClient] = useState<Client | null>(null)
  const [clientShowings, setClientShowings] = useState<Showing[]>([])

  useEffect(() => {
    if (!id || !type) { setError('Missing parameters'); setLoading(false); return }

    const fetchData = async () => {
      try {
        const [showingsRes, propertiesRes, clientsRes] = await Promise.all([
          fetch('/api/admin/showings').then(r => r.ok ? r.json() : []),
          fetch('/api/admin/properties').then(r => r.ok ? r.json() : []),
          fetch('/api/admin/clients').then(r => r.ok ? r.json() : []),
        ])

        const allShowings: Showing[] = Array.isArray(showingsRes) ? showingsRes : []
        const allProperties: Property[] = Array.isArray(propertiesRes) ? propertiesRes : []
        const allClients: Client[] = Array.isArray(clientsRes) ? clientsRes : []

        if (type === 'property') {
          const prop = allProperties.find(p => p.id === id)
          if (!prop) { setError('Property not found'); setLoading(false); return }
          setProperty(prop)
          const propShowings = allShowings.filter(s => {
            const raw = s as any
            return raw.property_id === id || s.property_slug === prop.slug
          })
          setShowings(propShowings)

          // Fetch events
          const eventsRes = await fetch(`/api/admin/events?slug=${prop.slug}`).then(r => r.ok ? r.json() : [])
          setEvents(Array.isArray(eventsRes) ? eventsRes : [])
        } else {
          const cl = allClients.find(c => c.id === id)
          if (!cl) { setError('Client not found'); setLoading(false); return }
          setClient(cl)
          const clShowings = allShowings.filter(s => {
            const raw = s as any
            return raw.client_id === id || s.client_name === cl.name
          })
          setClientShowings(clShowings)
        }

        setLoading(false)
      } catch (e) {
        setError('Failed to load data')
        setLoading(false)
      }
    }

    fetchData()
  }, [id, type])

  useEffect(() => {
    if (!loading && !error) {
      setTimeout(() => window.print(), 800)
    }
  }, [loading, error])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-400">Preparing report…</p>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-400">{error}</p>
    </div>
  )

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  // ── Property report ──
  if (type === 'property' && property) {
    const interested = showings.filter(s => s.outcome === 'interested')
    const notInterested = showings.filter(s => s.outcome === 'not_interested')
    const undecided = showings.filter(s => s.outcome === 'pending')
    const interestRate = showings.length > 0 ? Math.round((interested.length / showings.length) * 100) : 0
    const totalViews = events.filter(e => e.event_type === 'view').length
    const enquiryClicks = events.filter(e => e.event_type === 'enquiry_click').length
    const withFeedback = showings.filter(s => s.agent_notes?.trim())

    return (
      <div className="max-w-3xl mx-auto p-8 font-sans text-gray-800">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-[#0c2749]">
          <div>
            <h1 className="text-2xl font-bold text-[#0c2749]">Property Report</h1>
            <h2 className="text-lg font-semibold mt-1">{property.title}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {property.location} · {property.status}
              {property.price ? ` · $${property.price.toLocaleString()}` : ''}
            </p>
          </div>
          <div className="text-right">
            <img src="https://yhblxzdydirndlprmnan.supabase.co/storage/v1/object/public/media/website-logo.png"
              alt="RE/MAX 365 Antigua" className="h-12 w-auto ml-auto mb-1" />
            <p className="text-xs text-gray-400">Generated {today}</p>
          </div>
        </div>

        {/* Online stats */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-[#0c2749] uppercase tracking-wide mb-3">Online Engagement</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Page Views', value: totalViews },
              { label: 'Enquiry Clicks', value: enquiryClicks },
              { label: 'Click-through Rate', value: totalViews > 0 ? `${Math.round((enquiryClicks / totalViews) * 100)}%` : '0%' },
            ].map(s => (
              <div key={s.label} className="border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-[#0c2749]">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Showing stats */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-[#0c2749] uppercase tracking-wide mb-3">Showing Summary</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Showings', value: showings.length },
              { label: 'Interested', value: interested.length },
              { label: 'Not Interested', value: notInterested.length },
              { label: 'Undecided', value: undecided.length },
            ].map(s => (
              <div key={s.label} className="border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-[#0c2749]">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          {showings.length > 0 && (
            <div className="mt-3 flex items-center gap-3">
              <span className="text-sm text-gray-600">Interest Rate:</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{
                  width: `${interestRate}%`,
                  background: interestRate >= 60 ? '#16a34a' : interestRate >= 30 ? '#f59e0b' : '#ef4444'
                }} />
              </div>
              <span className="text-sm font-bold text-[#0c2749]">{interestRate}%</span>
            </div>
          )}
        </div>

        {/* Feedback */}
        {withFeedback.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-[#0c2749] uppercase tracking-wide mb-3">Client Feedback</h3>
            <div className="space-y-3">
              {withFeedback.map(s => (
                <div key={s.id} className="border-l-4 border-[#0c2749] pl-4 py-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold">{s.client_name}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-400">{OUTCOME_LABELS[s.outcome]}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-400">
                      {new Date(s.showing_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{s.agent_notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Showing history */}
        {showings.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-[#0c2749] uppercase tracking-wide mb-3">Showing History</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-[#0c2749]">
                  <th className="text-left py-2 text-xs font-semibold text-[#0c2749]">Client</th>
                  <th className="text-left py-2 text-xs font-semibold text-[#0c2749]">Date</th>
                  <th className="text-left py-2 text-xs font-semibold text-[#0c2749]">Time</th>
                  <th className="text-left py-2 text-xs font-semibold text-[#0c2749]">Agent</th>
                  <th className="text-left py-2 text-xs font-semibold text-[#0c2749]">Outcome</th>
                </tr>
              </thead>
              <tbody>
                {showings.map((s, i) => (
                  <tr key={s.id} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-2 px-1">{s.client_name}</td>
                    <td className="py-2 px-1">
                      {new Date(s.showing_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-2 px-1">{s.showing_time}</td>
                    <td className="py-2 px-1">{s.logged_by || '—'}</td>
                    <td className="py-2 px-1">{OUTCOME_LABELS[s.outcome]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-4 border-t border-gray-200 text-xs text-gray-400 text-center">
          RE/MAX 365 Antigua · Confidential · Generated {today}
        </div>
      </div>
    )
  }

  // ── Client report ──
  if (type === 'client' && client) {
    const interested = clientShowings.filter(s => s.outcome === 'interested')
    const notInterested = clientShowings.filter(s => s.outcome === 'not_interested')
    const withFeedback = clientShowings.filter(s => s.agent_notes?.trim())

    return (
      <div className="max-w-3xl mx-auto p-8 font-sans text-gray-800">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-[#0c2749]">
          <div>
            <h1 className="text-2xl font-bold text-[#0c2749]">Client Report</h1>
            <h2 className="text-lg font-semibold mt-1">{client.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {client.email}{client.phone ? ` · ${client.phone}` : ''}
              {client.interest ? ` · Interest: ${client.interest}` : ''}
            </p>
          </div>
          <div className="text-right">
            <img src="https://yhblxzdydirndlprmnan.supabase.co/storage/v1/object/public/media/website-logo.png"
              alt="RE/MAX 365 Antigua" className="h-12 w-auto ml-auto mb-1" />
            <p className="text-xs text-gray-400">Generated {today}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-[#0c2749] uppercase tracking-wide mb-3">Showing Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Showings', value: clientShowings.length },
              { label: 'Interested', value: interested.length },
              { label: 'Not Interested', value: notInterested.length },
            ].map(s => (
              <div key={s.label} className="border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-[#0c2749]">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Properties shown */}
        {clientShowings.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-[#0c2749] uppercase tracking-wide mb-3">Properties Shown</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-[#0c2749]">
                  <th className="text-left py-2 text-xs font-semibold text-[#0c2749]">Property</th>
                  <th className="text-left py-2 text-xs font-semibold text-[#0c2749]">Date</th>
                  <th className="text-left py-2 text-xs font-semibold text-[#0c2749]">Agent</th>
                  <th className="text-left py-2 text-xs font-semibold text-[#0c2749]">Outcome</th>
                </tr>
              </thead>
              <tbody>
                {clientShowings.map((s, i) => (
                  <tr key={s.id} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-2 px-1">
                      <p>{s.property_name}</p>
                      {s.property_slug && <p className="text-xs text-gray-400 font-mono">{s.property_slug}</p>}
                    </td>
                    <td className="py-2 px-1">
                      {new Date(s.showing_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-2 px-1">{s.logged_by || '—'}</td>
                    <td className="py-2 px-1">{OUTCOME_LABELS[s.outcome]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Feedback */}
        {withFeedback.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-[#0c2749] uppercase tracking-wide mb-3">Feedback Notes</h3>
            <div className="space-y-3">
              {withFeedback.map(s => (
                <div key={s.id} className="border-l-4 border-[#0c2749] pl-4 py-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold">{s.property_name}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-400">{OUTCOME_LABELS[s.outcome]}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-400">
                      {new Date(s.showing_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{s.agent_notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-4 border-t border-gray-200 text-xs text-gray-400 text-center">
          RE/MAX 365 Antigua · Confidential · Generated {today}
        </div>
      </div>
    )
  }

  return null
}

export default function PrintPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p className="text-gray-400">Loading…</p></div>}>
      <PrintContent />
    </Suspense>
  )
}
