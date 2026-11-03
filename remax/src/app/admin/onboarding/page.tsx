'use client'

import { useState, useEffect } from 'react'
import { FileText, Eye, Check, X, User, Phone, Mail, MapPin, Briefcase, Home } from 'lucide-react'

interface Submission {
  id: string
  created_at: string
  first_name: string
  last_name: string | null
  email: string | null
  phone: string | null
  street_address: string | null
  city: string | null
  state: string | null
  country: string | null
  postal_code: string | null
  nationality: string | null
  marital_status: string | null
  pep: boolean
  pep_affiliation: string | null
  occupation: string | null
  employer: string | null
  preferences: string[]
  budget: string | null
  notes: string | null
  passport_path: string | null
  status: string
}

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-amber-100 text-amber-700',
  converted: 'bg-green-100 text-green-700',
}

export default function OnboardingSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Submission | null>(null)
  const [passportUrl, setPassportUrl] = useState<string | null>(null)
  const [loadingPassport, setLoadingPassport] = useState(false)

  useEffect(() => {
    fetch('/api/admin/onboarding')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setSubmissions(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const openSubmission = async (sub: Submission) => {
    setSelected(sub)
    setPassportUrl(null)
    if (sub.passport_path) {
      setLoadingPassport(true)
      try {
        const res = await fetch(`/api/admin/onboarding/passport?path=${encodeURIComponent(sub.passport_path)}`)
        const data = await res.json()
        if (data.url) setPassportUrl(data.url)
      } catch {}
      setLoadingPassport(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/onboarding/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setSubmissions(s => s.map(x => x.id === id ? { ...x, status } : x))
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : s)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0c2749]">Onboarding Submissions</h1>
          <p className="text-gray-400 text-sm mt-0.5">{loading ? 'Loading…' : `${submissions.length} submissions`}</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* List */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-5 py-4 border-b border-gray-50 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-40 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-24" />
                </div>
              ))
            ) : submissions.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <FileText size={32} className="mx-auto mb-3 text-gray-200" />
                <p className="text-sm">No submissions yet.</p>
                <a href="/onboarding" target="_blank" className="text-[#0c2749] text-sm font-medium hover:underline mt-2 inline-block">
                  View onboarding form →
                </a>
              </div>
            ) : submissions.map(sub => (
              <button key={sub.id} onClick={() => openSubmission(sub)}
                className={`w-full text-left px-5 py-4 border-b border-gray-50 hover:bg-gray-50/60 transition-colors flex items-center gap-4 ${selected?.id === sub.id ? 'bg-blue-50/40' : ''}`}>
                <div className="w-9 h-9 rounded-full bg-[#0c2749] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">
                    {[sub.first_name, sub.last_name].filter(Boolean).map(n => n![0]).join('').slice(0,2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {[sub.first_name, sub.last_name].filter(Boolean).join(' ')}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{sub.email || 'No email'}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {sub.passport_path && <FileText size={13} className="text-gray-300" />}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[sub.status] || 'bg-gray-100 text-gray-500'}`}>
                    {sub.status}
                  </span>
                  <span className="text-xs text-gray-300">
                    {new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-[#0c2749] text-lg">
                    {[selected.first_name, selected.last_name].filter(Boolean).join(' ')}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Submitted {new Date(selected.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Status */}
              <div className="flex gap-2 mb-5">
                {['new', 'reviewed', 'converted'].map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${selected.status === s ? STATUS_STYLES[s] : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                    {s}
                  </button>
                ))}
              </div>

              <div className="space-y-4 text-sm">
                {/* Contact */}
                <div className="space-y-1.5">
                  {selected.email && <div className="flex items-center gap-2 text-gray-600"><Mail size={13} className="text-gray-400" />{selected.email}</div>}
                  {selected.phone && <div className="flex items-center gap-2 text-gray-600"><Phone size={13} className="text-gray-400" />{selected.phone}</div>}
                </div>

                {/* Address */}
                {(selected.city || selected.country) && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Address</p>
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <span>
                        {[selected.street_address, selected.city, selected.state, selected.country, selected.postal_code].filter(Boolean).join(', ')}
                      </span>
                    </div>
                    {selected.nationality && <p className="text-gray-500 mt-1 ml-5">Nationality: {selected.nationality}</p>}
                    {selected.marital_status && <p className="text-gray-500 mt-0.5 ml-5">Marital Status: {selected.marital_status}</p>}
                  </div>
                )}

                {/* Background */}
                {(selected.occupation || selected.employer || selected.pep) && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Background</p>
                    {selected.occupation && <div className="flex items-center gap-2 text-gray-600"><Briefcase size={13} className="text-gray-400" />{selected.occupation}</div>}
                    {selected.employer && <p className="text-gray-500 ml-5 mt-0.5">{selected.employer}</p>}
                    {selected.pep && (
                      <p className="text-amber-600 text-xs mt-1.5 bg-amber-50 px-3 py-1.5 rounded-lg">
                        ⚠ PEP Affiliated{selected.pep_affiliation ? `: ${selected.pep_affiliation}` : ''}
                      </p>
                    )}
                  </div>
                )}

                {/* Preferences */}
                {selected.preferences?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Preferences</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.preferences.map(p => (
                        <span key={p} className="px-2 py-0.5 bg-[#0c2749]/10 text-[#0c2749] rounded-full text-xs font-medium">{p}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Budget */}
                {selected.budget && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Budget</p>
                    <p className="text-gray-600">{selected.budget}</p>
                  </div>
                )}

                {/* Notes */}
                {selected.notes && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Notes</p>
                    <p className="text-gray-600 text-xs leading-relaxed">{selected.notes}</p>
                  </div>
                )}

                {/* Passport */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Passport</p>
                  {selected.passport_path ? (
                    loadingPassport ? (
                      <p className="text-xs text-gray-400">Loading secure link…</p>
                    ) : passportUrl ? (
                      <a href={passportUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#0c2749] font-medium text-xs hover:underline">
                        <FileText size={14} /> View Passport Document →
                      </a>
                    ) : (
                      <p className="text-xs text-gray-400">Unable to load document.</p>
                    )
                  ) : (
                    <p className="text-xs text-gray-400 italic">No passport uploaded.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
