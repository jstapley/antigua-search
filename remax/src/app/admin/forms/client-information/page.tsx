'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

interface Client { id: string; name: string; email: string | null; phone: string | null }
interface Property { id: string; title: string; price: number | null; currency: string }

const initialForm = {
  // Section A
  property_name: '', listing_amount: '', reason: '',
  // Section B
  full_name: '', aliases: '', place_of_birth: '', nationality: '',
  marital_status: '', pep: '', pep_affiliation: '',
  physical_address: '', telephone: '', email: '', occupation: '', employer: '',
  // Section C
  id_type: 'passport', id_other: '', country_of_issue: '', document_number: '',
  signature_name: '', authorized_rep_name: '', signature_date: '',
  // Section F
  office_id: false, office_poo: false, office_poa: false, office_sof: false,
  transaction_accepted: false, transaction_declined: false, passport_attached: false,
  prepared_by: '', reviewed_by: '',
  // Section G
  notes_date: '', notes: '',
}

export default function ClientInformationForm() {
  const router = useRouter()
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Client lookup
  const [clients, setClients] = useState<Client[]>([])
  const [clientSearch, setClientSearch] = useState('')
  const [clientOpen, setClientOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  // Property lookup
  const [properties, setProperties] = useState<Property[]>([])
  const [propSearch, setPropSearch] = useState('')
  const [propOpen, setPropOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/clients').then(r => r.ok ? r.json() : []),
      fetch('/api/admin/properties').then(r => r.ok ? r.json() : []),
    ]).then(([c, p]) => {
      setClients(Array.isArray(c) ? c : [])
      setProperties(Array.isArray(p) ? p : [])
    })
  }, [])

  const set = (field: string, value: unknown) => setForm(f => ({ ...f, [field]: value }))

  const fillFromClient = (c: Client) => {
    setForm(f => ({ ...f, full_name: c.name, email: c.email || '', telephone: c.phone || '' }))
    setSelectedClient(c); setClientSearch(''); setClientOpen(false)
  }

  const fillFromProperty = (p: Property) => {
    setForm(f => ({ ...f, property_name: p.title, listing_amount: p.price ? `${p.currency} ${p.price.toLocaleString()}` : '' }))
    setSelectedProperty(p); setPropSearch(''); setPropOpen(false)
  }

  const filteredClients = clients.filter(c =>
    !clientSearch || c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(clientSearch.toLowerCase())
  )

  const filteredProps = properties.filter(p =>
    !propSearch || p.title.toLowerCase().includes(propSearch.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.full_name) { setError('Full name is required'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/admin/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_type: 'client-information',
          form_title: `Client Information — ${form.full_name}`,
          form_data: form,
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
  const checkCls = 'w-4 h-4 rounded border-gray-300 text-[#0c2749] focus:ring-[#0c2749]/20'

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/admin/forms" className="text-gray-400 hover:text-[#0c2749] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-2xl font-bold text-[#0c2749]">Client Information Form</h1>
      </div>
      <p className="text-gray-400 text-sm mb-8 ml-8">KYC form — personal details, identification, and transaction information.</p>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Auto-fill helpers */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-4">Auto-fill from Database</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Fill client details from CRM</label>
              {selectedClient ? (
                <div className="flex items-center justify-between border border-green-300 bg-green-50 rounded-xl px-4 py-2.5">
                  <div>
                    <p className="text-sm font-semibold text-green-800">{selectedClient.name}</p>
                    {selectedClient.email && <p className="text-xs text-green-600">{selectedClient.email}</p>}
                  </div>
                  <button type="button" onClick={() => { setSelectedClient(null); setForm(f => ({ ...f, full_name: '', email: '', telephone: '' })) }}
                    className="text-xs text-green-600 hover:text-red-500 transition-colors ml-3">Change</button>
                </div>
              ) : (
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text" placeholder="Search client by name or email…"
                    value={clientSearch}
                    onChange={e => { setClientSearch(e.target.value); setClientOpen(true) }}
                    onFocus={() => setClientOpen(true)}
                    onBlur={() => setTimeout(() => setClientOpen(false), 150)}
                    className={inputCls + ' pl-9'}
                  />
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
            <div>
              <label className={labelCls}>Fill property details from listings</label>
              {selectedProperty ? (
                <div className="flex items-center justify-between border border-green-300 bg-green-50 rounded-xl px-4 py-2.5">
                  <div>
                    <p className="text-sm font-semibold text-green-800">{selectedProperty.title}</p>
                    {selectedProperty.price && <p className="text-xs text-green-600">{selectedProperty.currency} {selectedProperty.price.toLocaleString()}</p>}
                  </div>
                  <button type="button" onClick={() => { setSelectedProperty(null); setForm(f => ({ ...f, property_name: '', listing_amount: '' })) }}
                    className="text-xs text-green-600 hover:text-red-500 transition-colors ml-3">Change</button>
                </div>
              ) : (
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text" placeholder="Search property by name…"
                    value={propSearch}
                    onChange={e => { setPropSearch(e.target.value); setPropOpen(true) }}
                    onFocus={() => setPropOpen(true)}
                    onBlur={() => setTimeout(() => setPropOpen(false), 150)}
                    className={inputCls + ' pl-9'}
                  />
                  {propOpen && filteredProps.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {filteredProps.slice(0, 20).map(p => (
                        <button key={p.id} type="button" onMouseDown={e => { e.preventDefault(); fillFromProperty(p) }}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                          <p className="text-sm font-medium text-gray-800">{p.title}</p>
                          {p.price && <p className="text-xs text-gray-400">{p.currency} {p.price.toLocaleString()}</p>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section A */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-5">Section A — Property & Transaction Details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Property Name</label>
                <input type="text" value={form.property_name} onChange={e => set('property_name', e.target.value)} className={inputCls} placeholder="e.g. Ocean View Villa" />
              </div>
              <div>
                <label className={labelCls}>Listing Amount</label>
                <input type="text" value={form.listing_amount} onChange={e => set('listing_amount', e.target.value)} className={inputCls} placeholder="e.g. USD 850,000" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Reason for Selling / Purchasing</label>
              <textarea rows={3} value={form.reason} onChange={e => set('reason', e.target.value)} className={inputCls + ' resize-none'} placeholder="Reason for the transaction…" />
            </div>
          </div>
        </div>

        {/* Section B */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-5">Section B — Client Personal Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelCls}>Full Name *</label>
                <input type="text" value={form.full_name} onChange={e => set('full_name', e.target.value)} className={inputCls} placeholder="Legal full name" required />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Other Names or Aliases</label>
                <input type="text" value={form.aliases} onChange={e => set('aliases', e.target.value)} className={inputCls} placeholder="Any other names used" />
              </div>
              <div>
                <label className={labelCls}>Place of Birth</label>
                <input type="text" value={form.place_of_birth} onChange={e => set('place_of_birth', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Nationality</label>
                <input type="text" value={form.nationality} onChange={e => set('nationality', e.target.value)} className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Marital Status</label>
              <div className="flex flex-wrap gap-4">
                {['Single', 'Married', 'Divorced', 'Common Law'].map(s => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="marital_status" value={s.toLowerCase().replace(' ', '_')}
                      checked={form.marital_status === s.toLowerCase().replace(' ', '_')}
                      onChange={e => set('marital_status', e.target.value)}
                      className="w-4 h-4 text-[#0c2749]" />
                    <span className="text-sm text-gray-700">{s}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>PEP (Politically Exposed Person)</label>
              <div className="flex gap-6">
                {['yes', 'no'].map(v => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="pep" value={v}
                      checked={form.pep === v}
                      onChange={e => set('pep', e.target.value)}
                      className="w-4 h-4 text-[#0c2749]" />
                    <span className="text-sm text-gray-700 capitalize">{v}</span>
                  </label>
                ))}
              </div>
              {form.pep === 'yes' && (
                <div className="mt-3">
                  <label className={labelCls}>State Affiliation</label>
                  <input type="text" value={form.pep_affiliation} onChange={e => set('pep_affiliation', e.target.value)} className={inputCls} placeholder="Describe PEP affiliation…" />
                </div>
              )}
            </div>

            <div>
              <label className={labelCls}>Physical Address</label>
              <textarea rows={2} value={form.physical_address} onChange={e => set('physical_address', e.target.value)} className={inputCls + ' resize-none'} placeholder="Street address, city, country" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Telephone Number</label>
                <input type="tel" value={form.telephone} onChange={e => set('telephone', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email Address</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Occupation / Principal Business Activity</label>
                <input type="text" value={form.occupation} onChange={e => set('occupation', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Employer Name / Business Name</label>
                <input type="text" value={form.employer} onChange={e => set('employer', e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>
        </div>

        {/* Section C */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-5">Section C — Identification Details</h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Identification Document</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="id_type" value="passport"
                    checked={form.id_type === 'passport'}
                    onChange={e => set('id_type', e.target.value)}
                    className="w-4 h-4 text-[#0c2749]" />
                  <span className="text-sm text-gray-700">Passport</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="id_type" value="other"
                    checked={form.id_type === 'other'}
                    onChange={e => set('id_type', e.target.value)}
                    className="w-4 h-4 text-[#0c2749]" />
                  <span className="text-sm text-gray-700">Other</span>
                </label>
              </div>
              {form.id_type === 'other' && (
                <input type="text" value={form.id_other} onChange={e => set('id_other', e.target.value)}
                  className={inputCls + ' mt-3'} placeholder="Specify document type" />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Country of Issue</label>
                <input type="text" value={form.country_of_issue} onChange={e => set('country_of_issue', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Document Number</label>
                <input type="text" value={form.document_number} onChange={e => set('document_number', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Signature of Client / Authorised Representative</label>
                <input type="text" value={form.signature_name} onChange={e => set('signature_name', e.target.value)} className={inputCls} placeholder="Type full name as signature" />
              </div>
              <div>
                <label className={labelCls}>Name of Authorised Representative (if applicable)</label>
                <input type="text" value={form.authorized_rep_name} onChange={e => set('authorized_rep_name', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Date</label>
                <input type="date" value={form.signature_date} onChange={e => set('signature_date', e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>
        </div>

        {/* Section F */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-5">Section F — Office Use Only</h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Documents Provided</label>
              <div className="space-y-2">
                {[
                  ['office_id', 'ID'],
                  ['office_poo', 'Proof of Ownership (POO)'],
                  ['office_poa', 'Proof of Address (POA)'],
                  ['office_sof', 'Source of Funds (SOF)'],
                  ['passport_attached', 'Passport/ID Attached'],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form[key as keyof typeof form] as boolean}
                      onChange={e => set(key, e.target.checked)} className={checkCls} />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Transaction Decision</label>
              <div className="space-y-2">
                {[
                  ['transaction_accepted', 'Transaction Accepted'],
                  ['transaction_declined', 'Transaction Declined'],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form[key as keyof typeof form] as boolean}
                      onChange={e => set(key, e.target.checked)} className={checkCls} />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Prepared by</label>
                <input type="text" value={form.prepared_by} onChange={e => set('prepared_by', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Reviewed by</label>
                <input type="text" value={form.reviewed_by} onChange={e => set('reviewed_by', e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>
        </div>

        {/* Section G */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-5">Section G — Notes</h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Date</label>
              <input type="date" value={form.notes_date} onChange={e => set('notes_date', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Notes</label>
              <textarea rows={4} value={form.notes} onChange={e => set('notes', e.target.value)} className={inputCls + ' resize-none'} />
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
