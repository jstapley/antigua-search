'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

interface Client { id: string; name: string; email: string | null; phone: string | null }
interface Agent { id: string; name: string; email: string }

const AGENT_ADDRESS = 'Jolly Harbour Commercial Center, Antigua'
const AGENT_PHONES: Record<string, string> = {
  'michelglass@remax-365-antigua.com': '+1-268-724-9308',
  'luka@remax-365-antigua.com': '+1-268-717-6720',
  'ron@remax-365-antigua.com': '+1-268-720-4504',
  'Stephanie@remax-365-antigua.com': '+1-570-877-4259',
}

const initialForm = {
  agreement_date: '',
  buyer_name: '', buyer_address: '', buyer_telephone: '', buyer_email: '',
  start_date: '', end_date: '',
  post_termination_months: '',
  buyer1_name: '', buyer1_date: '',
  buyer2_name: '', buyer2_date: '',
  agent_date: '',
}

export default function BuyerRepresentationForm() {
  const router = useRouter()
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [clients, setClients] = useState<Client[]>([])
  const [clientSearch, setClientSearch] = useState('')
  const [clientOpen, setClientOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  useEffect(() => {
    fetch('/api/admin/clients').then(r => r.ok ? r.json() : []).then(data => {
      setClients(Array.isArray(data) ? data : [])
    })
    fetch('/api/admin/agents').then(r => r.ok ? r.json() : []).then(data => {
      setAgents(Array.isArray(data) ? data.filter((a: Agent) => a.email !== 'jeff@stapleyinc.com') : [])
    })
  }, [])

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  const fillFromClient = (c: Client) => {
    setForm(f => ({ ...f, buyer_name: c.name, buyer_email: c.email || '', buyer_telephone: c.phone || '', buyer1_name: c.name }))
    setSelectedClient(c); setClientSearch(''); setClientOpen(false)
  }

  const filteredClients = clients.filter(c =>
    !clientSearch || c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(clientSearch.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.buyer_name) { setError('Buyer name is required'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/admin/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_type: 'buyer-representation',
          form_title: `Buyer Representation — ${form.buyer_name}`,
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
        <h1 className="font-display text-2xl font-bold text-[#0c2749]">Buyer Representation Agreement</h1>
      </div>
      <p className="text-gray-400 text-sm mb-8 ml-8">Exclusive agreement appointing RE/MAX 365 as the buyer&apos;s agent.</p>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Auto-fill */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-4">Auto-fill from Database</h2>
          <div>
            <label className={labelCls}>Fill buyer details from CRM</label>
            {selectedClient ? (
              <div className="flex items-center justify-between border border-green-300 bg-green-50 rounded-xl px-4 py-2.5">
                <div>
                  <p className="text-sm font-semibold text-green-800">{selectedClient.name}</p>
                  {selectedClient.email && <p className="text-xs text-green-600">{selectedClient.email}</p>}
                </div>
                <button type="button" onClick={() => { setSelectedClient(null); setForm(f => ({ ...f, buyer_name: '', buyer_email: '', buyer_telephone: '', buyer1_name: '' })) }}
                  className="text-xs text-green-600 hover:text-red-500 transition-colors ml-3">Change</button>
              </div>
            ) : (
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="text" placeholder="Search client by name or email…"
                  value={clientSearch}
                  onChange={e => { setClientSearch(e.target.value); setClientOpen(true) }}
                  onFocus={() => setClientOpen(true)}
                  onBlur={() => setTimeout(() => setClientOpen(false), 150)}
                  className={inputCls + ' pl-9'} />
                {clientOpen && filteredClients.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {filteredClients.slice(0, 20).map(c => (
                      <button key={c.id} type="button" onMouseDown={e => { e.preventDefault(); fillFromClient(c) }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                        <p className="text-sm font-medium text-gray-800">{c.name}</p>
                        {c.email && <p className="text-xs text-gray-400">{c.email}</p>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Agreement date */}
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
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Buyer</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelCls}>Full Name *</label>
                <input type="text" value={form.buyer_name} onChange={e => set('buyer_name', e.target.value)} className={inputCls} required />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Address</label>
                <input type="text" value={form.buyer_address} onChange={e => set('buyer_address', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Telephone</label>
                <input type="tel" value={form.buyer_telephone} onChange={e => set('buyer_telephone', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" value={form.buyer_email} onChange={e => set('buyer_email', e.target.value)} className={inputCls} />
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

        {/* Term */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-5">3 — Term of Agreement</h2>
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
          <h2 className="font-semibold text-[#0c2749] mb-5">7 — Commission & Fees</h2>
          <p className="text-sm text-gray-500 mb-4">Commission rate: <strong>2%</strong> of the purchase price, due upon successful completion.</p>
          <div className="max-w-xs">
            <label className={labelCls}>Post-termination protection period (months)</label>
            <input type="number" min="0" value={form.post_termination_months} onChange={e => set('post_termination_months', e.target.value)} className={inputCls} placeholder="e.g. 6" />
          </div>
        </div>

        {/* Signatures */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-5">13 — Signatures</h2>
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Buyer 1</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Name (typed signature)</label>
                  <input type="text" value={form.buyer1_name} onChange={e => set('buyer1_name', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Date</label>
                  <input type="date" value={form.buyer1_date} onChange={e => set('buyer1_date', e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Buyer 2 (if applicable)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Name (typed signature)</label>
                  <input type="text" value={form.buyer2_name} onChange={e => set('buyer2_name', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Date</label>
                  <input type="date" value={form.buyer2_date} onChange={e => set('buyer2_date', e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Agent</h3>
              <div className="max-w-xs">
                <label className={labelCls}>Date</label>
                <input type="date" value={form.agent_date} onChange={e => set('agent_date', e.target.value)} className={inputCls} />
              </div>
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
