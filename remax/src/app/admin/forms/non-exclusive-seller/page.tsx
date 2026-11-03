'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

interface Property { id: string; title: string; price: number | null; currency: string; location: string | null }
interface Agent { id: string; name: string; email: string }

const AGENT_ADDRESS = 'Jolly Harbour Commercial Center, St. Mary, Antigua'
const AGENT_PHONES: Record<string, string> = {
  'michelglass@remax-365-antigua.com': '+1-268-724-9308',
  'luka@remax-365-antigua.com': '+1-268-717-6720',
  'ron@remax-365-antigua.com': '+1-268-720-4504',
  'Stephanie@remax-365-antigua.com': '+1-570-877-4259',
}

const initialForm = {
  agreement_date: '',
  seller1_name: '', seller2_name: '',
  seller_address: '', seller_telephone: '', seller_email: '',
  sale_price: '',
  property_address: '', reg_parcel: '', block: '', section: '', other_details: '',
  start_date: '', end_date: '',
  seller1_sig_name: '', seller1_sig_date: '',
  seller2_sig_name: '', seller2_sig_date: '',
  agent_sig_date: '',
}

export default function NonExclusiveSellerForm() {
  const router = useRouter()
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [properties, setProperties] = useState<Property[]>([])
  const [propSearch, setPropSearch] = useState('')
  const [propOpen, setPropOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  useEffect(() => {
    fetch('/api/admin/properties').then(r => r.ok ? r.json() : []).then(data => {
      setProperties(Array.isArray(data) ? data : [])
    })
    fetch('/api/admin/agents').then(r => r.ok ? r.json() : []).then(data => {
      setAgents(Array.isArray(data) ? data.filter((a: Agent) => a.email !== 'jeff@stapleyinc.com') : [])
    })
  }, [])

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  const fillFromProperty = (p: Property) => {
    setForm(f => ({
      ...f,
      sale_price: p.price ? `${p.price}` : '',
      property_address: p.location || '',
    }))
    setSelectedProperty(p); setPropSearch(''); setPropOpen(false)
  }

  const filteredProps = properties.filter(p =>
    !propSearch || p.title.toLowerCase().includes(propSearch.toLowerCase()) ||
    (p.location || '').toLowerCase().includes(propSearch.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.seller1_name) { setError('Seller name is required'); return }
    setSaving(true); setError('')
    const sellerNames = [form.seller1_name, form.seller2_name].filter(Boolean).join(' & ')
    try {
      const res = await fetch('/api/admin/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_type: 'non-exclusive-seller',
          form_title: `Non-Exclusive Seller — ${sellerNames}${form.property_address ? ` · ${form.property_address}` : ''}`,
          form_data: {
            ...form,
            agent: selectedAgent ? {
              name: selectedAgent.name,
              address: AGENT_ADDRESS,
              telephone: AGENT_PHONES[selectedAgent.email] || '',
              email: selectedAgent.email,
            } : null,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      router.push(`/admin/forms/view/${data.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save')
      setSaving(false)
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] bg-white'
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5'
  const sectionCls = 'bg-white rounded-2xl border border-gray-100 shadow-sm p-6'
  const readonlyCls = 'w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-500'

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/admin/forms" className="text-gray-400 hover:text-[#0c2749] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-2xl font-bold text-[#0c2749]">Non-Exclusive Seller Representation Agreement</h1>
      </div>
      <p className="text-gray-400 text-sm mb-8 ml-8">Non-exclusive listing agreement — seller retains right to use other agents. 5% commission + ABST.</p>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Auto-fill */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-4">Auto-fill from Database</h2>
          <div>
            <label className={labelCls}>Fill property details from listings</label>
            {selectedProperty ? (
              <div className="flex items-center justify-between border border-green-300 bg-green-50 rounded-xl px-4 py-2.5">
                <div>
                  <p className="text-sm font-semibold text-green-800">{selectedProperty.title}</p>
                  {selectedProperty.location && <p className="text-xs text-green-600">{selectedProperty.location}</p>}
                </div>
                <button type="button" onClick={() => { setSelectedProperty(null); setForm(f => ({ ...f, sale_price: '', property_address: '' })) }}
                  className="text-xs text-green-600 hover:text-red-500 transition-colors ml-3">Change</button>
              </div>
            ) : (
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="text" placeholder="Search property by name or location…"
                  value={propSearch}
                  onChange={e => { setPropSearch(e.target.value); setPropOpen(true) }}
                  onFocus={() => setPropOpen(true)}
                  onBlur={() => setTimeout(() => setPropOpen(false), 150)}
                  className={inputCls + ' pl-9'} />
                {propOpen && filteredProps.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {filteredProps.slice(0, 20).map(p => (
                      <button key={p.id} type="button" onMouseDown={e => { e.preventDefault(); fillFromProperty(p) }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                        <p className="text-sm font-medium">{p.title}</p>
                        {p.location && <p className="text-xs text-gray-400">{p.location}</p>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Date */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-5">Agreement Date</h2>
          <div className="max-w-xs">
            <label className={labelCls}>Date of Agreement</label>
            <input type="date" value={form.agreement_date} onChange={e => set('agreement_date', e.target.value)} className={inputCls} />
          </div>
        </div>

        {/* Parties */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-5">1 — Parties to the Agreement</h2>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Seller(s)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Seller 1 Name *</label>
                <input type="text" value={form.seller1_name} onChange={e => set('seller1_name', e.target.value)} className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Seller 2 Name (if applicable)</label>
                <input type="text" value={form.seller2_name} onChange={e => set('seller2_name', e.target.value)} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Address</label>
                <input type="text" value={form.seller_address} onChange={e => set('seller_address', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Telephone</label>
                <input type="tel" value={form.seller_telephone} onChange={e => set('seller_telephone', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" value={form.seller_email} onChange={e => set('seller_email', e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Agent / Real Estate Brokerage</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelCls}>Agent *</label>
                <select
                  value={selectedAgent?.id || ''}
                  onChange={e => setSelectedAgent(agents.find(a => a.id === e.target.value) || null)}
                  className={inputCls}
                  required
                >
                  <option value="">Select agent…</option>
                  {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Address</label>
                <input type="text" value={AGENT_ADDRESS} readOnly className={readonlyCls} />
              </div>
              <div>
                <label className={labelCls}>Telephone</label>
                <input type="text" value={selectedAgent ? (AGENT_PHONES[selectedAgent.email] || '') : ''} readOnly className={readonlyCls} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="text" value={selectedAgent?.email || ''} readOnly className={readonlyCls} />
              </div>
            </div>
          </div>
        </div>

        {/* Sale price */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-5">Sale Price</h2>
          <div className="max-w-xs">
            <label className={labelCls}>Sale Price (USD)</label>
            <input type="text" value={form.sale_price} onChange={e => set('sale_price', e.target.value)} className={inputCls} placeholder="e.g. 750000" />
          </div>
        </div>

        {/* Property */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-5">3 — Property Description</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Property Address</label>
              <input type="text" value={form.property_address} onChange={e => set('property_address', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Registration Parcel</label>
              <input type="text" value={form.reg_parcel} onChange={e => set('reg_parcel', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Block</label>
              <input type="text" value={form.block} onChange={e => set('block', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Section</label>
              <input type="text" value={form.section} onChange={e => set('section', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Other Details</label>
              <input type="text" value={form.other_details} onChange={e => set('other_details', e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Term */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-5">4 — Term of Agreement</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Start Date</label>
              <input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Expiry Date</label>
              <input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Commission */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-3">7 — Commission & Fees</h2>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
            <strong>5% commission + ABST</strong> — only payable if buyer was introduced by the agent.
            No commission owed if property sold independently or through another agent.
            Protection period: 12 months post-expiry for agent-introduced buyers.
          </div>
        </div>

        {/* Signatures */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-5">Signatures</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Seller 1 — Name (typed signature)</label>
              <input type="text" value={form.seller1_sig_name} onChange={e => set('seller1_sig_name', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Seller 1 — Date</label>
              <input type="date" value={form.seller1_sig_date} onChange={e => set('seller1_sig_date', e.target.value)} className={inputCls} />
            </div>
            {form.seller2_name && (
              <>
                <div>
                  <label className={labelCls}>Seller 2 — Name (typed signature)</label>
                  <input type="text" value={form.seller2_sig_name} onChange={e => set('seller2_sig_name', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Seller 2 — Date</label>
                  <input type="date" value={form.seller2_sig_date} onChange={e => set('seller2_sig_date', e.target.value)} className={inputCls} />
                </div>
              </>
            )}
            <div>
              <label className={labelCls}>Agent (Michel Glass Lamdan) — Date</label>
              <input type="date" value={form.agent_sig_date} onChange={e => set('agent_sig_date', e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-100">{error}</p>}

        <div className="flex gap-3 pb-8">
          <Link href="/admin/forms" className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:border-[#0c2749] transition-colors text-sm text-center">
            Cancel
          </Link>
          <button type="submit" disabled={saving}
            className="flex-1 bg-[#0c2749] hover:bg-[#0a1f3a] disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors text-sm">
            {saving ? 'Saving…' : 'Save Form'}
          </button>
        </div>
      </form>
    </div>
  )
}
