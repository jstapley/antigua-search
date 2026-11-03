'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Search, Plus, X } from 'lucide-react'

interface Client { id: string; name: string; email: string | null; phone: string | null; address: string | null }
interface Property { id: string; title: string; price: number | null; currency: string; location: string | null }

const initialForm = {
  seller_name: '', seller_address: '', seller_telephone: '', seller_email: '',
  seller2_name: '',
  buyer_name: '', buyer_address: '', buyer_telephone: '', buyer_email: '',
  buyer2_name: '',
  reg_parcel: '', block: '', section: '',
  purchase_price: '', closing_date: '', conditions: '',
  // Seller signature fields
  seller_witness: '', seller_date: '',
  seller2_witness: '', seller2_sig_date: '',
  // Buyer signature fields
  purchaser_witness: '', purchaser_date: '',
  buyer2_witness: '', buyer2_sig_date: '',
}

export default function LetterOfIntentForm() {
  const router = useRouter()
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showSeller2, setShowSeller2] = useState(false)
  const [showBuyer2, setShowBuyer2] = useState(false)

  const [clients, setClients] = useState<Client[]>([])
  const [properties, setProperties] = useState<Property[]>([])

  // Buyer search
  const [buyerSearch, setBuyerSearch] = useState('')
  const [buyerOpen, setBuyerOpen] = useState(false)
  const [selectedBuyer, setSelectedBuyer] = useState<Client | null>(null)

  // Seller search
  const [sellerSearch, setSellerSearch] = useState('')
  const [sellerOpen, setSellerOpen] = useState(false)
  const [selectedSeller, setSelectedSeller] = useState<Client | null>(null)

  // Property search
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

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  const fillBuyer = (c: Client) => {
    setForm(f => ({
      ...f,
      buyer_name: c.name,
      buyer_email: c.email || '',
      buyer_telephone: c.phone || '',
      buyer_address: c.address || '',
    }))
    setSelectedBuyer(c); setBuyerSearch(''); setBuyerOpen(false)
  }

  const fillSeller = (c: Client) => {
    setForm(f => ({
      ...f,
      seller_name: c.name,
      seller_email: c.email || '',
      seller_telephone: c.phone || '',
      seller_address: c.address || '',
    }))
    setSelectedSeller(c); setSellerSearch(''); setSellerOpen(false)
  }

  const fillProperty = (p: Property) => {
    setForm(f => ({ ...f, purchase_price: p.price ? `${p.price}` : '' }))
    setSelectedProperty(p); setPropSearch(''); setPropOpen(false)
  }

  const filteredBuyers = clients.filter(c =>
    !buyerSearch || c.name.toLowerCase().includes(buyerSearch.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(buyerSearch.toLowerCase())
  )

  const filteredSellers = clients.filter(c =>
    !sellerSearch || c.name.toLowerCase().includes(sellerSearch.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(sellerSearch.toLowerCase())
  )

  const filteredProps = properties.filter(p =>
    !propSearch || p.title.toLowerCase().includes(propSearch.toLowerCase())
  )

  // Auto-calculate deposit and balance
  const priceNum = parseFloat(form.purchase_price.replace(/[^0-9.]/g, '')) || 0
  const deposit = priceNum > 0 ? (priceNum * 0.10).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''
  const balance = priceNum > 0 ? (priceNum * 0.90).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.buyer_name || !form.seller_name) { setError('Buyer and seller names are required'); return }
    setSaving(true); setError('')
    const buyerLabel = [form.buyer_name, form.buyer2_name].filter(Boolean).join(' & ')
    const sellerLabel = [form.seller_name, form.seller2_name].filter(Boolean).join(' & ')
    try {
      const res = await fetch('/api/admin/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_type: 'letter-of-intent',
          form_title: `Letter of Intent — ${buyerLabel} → ${sellerLabel}`,
          form_data: { ...form, deposit_10pct: deposit, balance_90pct: balance },
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
  const calcCls = 'w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-500'
  const readonlyCls = 'w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-500'

  const SearchChip = ({ selected, label, sublabel, onClear }: { selected: boolean; label: string; sublabel?: string; onClear: () => void }) =>
    selected ? (
      <div className="flex items-center justify-between border border-green-300 bg-green-50 rounded-xl px-4 py-2.5">
        <div>
          <p className="text-sm font-semibold text-green-800">{label}</p>
          {sublabel && <p className="text-xs text-green-600">{sublabel}</p>}
        </div>
        <button type="button" onClick={onClear} className="text-xs text-green-600 hover:text-red-500 transition-colors ml-3">Change</button>
      </div>
    ) : null

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/admin/forms" className="text-gray-400 hover:text-[#0c2749] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-2xl font-bold text-[#0c2749]">Letter of Intent — Interest to Purchase</h1>
      </div>
      <p className="text-gray-400 text-sm mb-8 ml-8">Purchase offer with price, 10% deposit, and closing terms. Commission: 5% + 17% ABST.</p>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Auto-fill */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-4">Auto-fill from Database</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Buyer search */}
            <div>
              <label className={labelCls}>Buyer from CRM</label>
              {selectedBuyer ? (
                <SearchChip selected label={selectedBuyer.name} sublabel={selectedBuyer.email || undefined}
                  onClear={() => { setSelectedBuyer(null); setForm(f => ({ ...f, buyer_name: '', buyer_email: '', buyer_telephone: '', buyer_address: '' })) }} />
              ) : (
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input type="text" placeholder="Search buyer…" value={buyerSearch}
                    onChange={e => { setBuyerSearch(e.target.value); setBuyerOpen(true) }}
                    onFocus={() => setBuyerOpen(true)}
                    onBlur={() => setTimeout(() => setBuyerOpen(false), 150)}
                    className={inputCls + ' pl-9'} />
                  {buyerOpen && filteredBuyers.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {filteredBuyers.slice(0, 20).map(c => (
                        <button key={c.id} type="button" onMouseDown={e => { e.preventDefault(); fillBuyer(c) }}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                          <p className="text-sm font-medium">{c.name}</p>
                          {c.email && <p className="text-xs text-gray-400">{c.email}</p>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Seller search */}
            <div>
              <label className={labelCls}>Seller from CRM</label>
              {selectedSeller ? (
                <SearchChip selected label={selectedSeller.name} sublabel={selectedSeller.email || undefined}
                  onClear={() => { setSelectedSeller(null); setForm(f => ({ ...f, seller_name: '', seller_email: '', seller_telephone: '', seller_address: '' })) }} />
              ) : (
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input type="text" placeholder="Search seller…" value={sellerSearch}
                    onChange={e => { setSellerSearch(e.target.value); setSellerOpen(true) }}
                    onFocus={() => setSellerOpen(true)}
                    onBlur={() => setTimeout(() => setSellerOpen(false), 150)}
                    className={inputCls + ' pl-9'} />
                  {sellerOpen && filteredSellers.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {filteredSellers.slice(0, 20).map(c => (
                        <button key={c.id} type="button" onMouseDown={e => { e.preventDefault(); fillSeller(c) }}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                          <p className="text-sm font-medium">{c.name}</p>
                          {c.email && <p className="text-xs text-gray-400">{c.email}</p>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Property search */}
            <div>
              <label className={labelCls}>Price from listings</label>
              {selectedProperty ? (
                <SearchChip selected label={selectedProperty.title}
                  sublabel={selectedProperty.price ? `${selectedProperty.currency} ${selectedProperty.price.toLocaleString()}` : undefined}
                  onClear={() => { setSelectedProperty(null); setForm(f => ({ ...f, purchase_price: '' })) }} />
              ) : (
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input type="text" placeholder="Search property…" value={propSearch}
                    onChange={e => { setPropSearch(e.target.value); setPropOpen(true) }}
                    onFocus={() => setPropOpen(true)}
                    onBlur={() => setTimeout(() => setPropOpen(false), 150)}
                    className={inputCls + ' pl-9'} />
                  {propOpen && filteredProps.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {filteredProps.slice(0, 20).map(p => (
                        <button key={p.id} type="button" onMouseDown={e => { e.preventDefault(); fillProperty(p) }}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                          <p className="text-sm font-medium">{p.title}</p>
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

        {/* Seller */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-5">Seller</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Seller 1 Name *</label>
              <input type="text" value={form.seller_name} onChange={e => set('seller_name', e.target.value)} className={inputCls} required />
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

          {/* Second seller */}
          {!showSeller2 ? (
            <button type="button"
              onClick={() => setShowSeller2(true)}
              className="mt-4 flex items-center gap-1.5 text-sm text-[#0c2749] hover:underline font-medium">
              <Plus size={14} /> Add second seller
            </button>
          ) : (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Seller 2</p>
                <button type="button" onClick={() => { setShowSeller2(false); set('seller2_name', '') }}
                  className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1">
                  <X size={12} /> Remove
                </button>
              </div>
              <div>
                <label className={labelCls}>Seller 2 Name</label>
                <input type="text" value={form.seller2_name} onChange={e => set('seller2_name', e.target.value)}
                  placeholder="Full name" autoFocus className={inputCls} />
              </div>
            </div>
          )}
        </div>

        {/* Buyer */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-5">Buyer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Buyer 1 Name *</label>
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

          {/* Second buyer */}
          {!showBuyer2 ? (
            <button type="button"
              onClick={() => setShowBuyer2(true)}
              className="mt-4 flex items-center gap-1.5 text-sm text-[#0c2749] hover:underline font-medium">
              <Plus size={14} /> Add second buyer
            </button>
          ) : (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Buyer 2</p>
                <button type="button" onClick={() => { setShowBuyer2(false); set('buyer2_name', '') }}
                  className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1">
                  <X size={12} /> Remove
                </button>
              </div>
              <div>
                <label className={labelCls}>Buyer 2 Name</label>
                <input type="text" value={form.buyer2_name} onChange={e => set('buyer2_name', e.target.value)}
                  placeholder="Full name" autoFocus className={inputCls} />
              </div>
            </div>
          )}
        </div>

        {/* Property */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-5">The Property</h2>
          <p className="text-xs text-gray-400 mb-4">Registered in the Register of Lands of Antigua and Barbuda.</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Registration Parcels</label>
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
          </div>
        </div>

        {/* Financial terms */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-5">Financial Terms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Purchase Price (USD)</label>
              <input type="text" value={form.purchase_price}
                onChange={e => set('purchase_price', e.target.value)}
                className={inputCls} placeholder="e.g. 850000" />
              <p className="text-xs text-gray-400 mt-1">Auto-filled from listing — edit to reflect the negotiated price.</p>
            </div>
            <div>
              <label className={labelCls}>10% Deposit (auto-calculated)</label>
              <input type="text" value={deposit ? `US$ ${deposit}` : ''} readOnly className={calcCls} placeholder="Auto" />
            </div>
            <div>
              <label className={labelCls}>Balance (auto-calculated)</label>
              <input type="text" value={balance ? `US$ ${balance}` : ''} readOnly className={calcCls} placeholder="Auto" />
            </div>
            <div>
              <label className={labelCls}>Closing Date</label>
              <input type="date" value={form.closing_date} onChange={e => set('closing_date', e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="mt-4">
            <label className={labelCls}>Conditions of Offer</label>
            <textarea rows={4} value={form.conditions} onChange={e => set('conditions', e.target.value)}
              className={inputCls + ' resize-none'} placeholder="Any conditions or contingencies…" />
          </div>
        </div>

        {/* Signatures */}
        <div className={sectionCls}>
          <h2 className="font-semibold text-[#0c2749] mb-5">Signatures</h2>
          <div className="space-y-6">

            {/* Seller 1 */}
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Seller 1</p>
              <div className="mb-3">
                <label className={labelCls}>Name</label>
                <input type="text" value={form.seller_name} readOnly className={readonlyCls} placeholder="Auto-filled from Seller section" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Witness</label>
                  <input type="text" value={form.seller_witness} onChange={e => set('seller_witness', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Date</label>
                  <input type="date" value={form.seller_date} onChange={e => set('seller_date', e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>

            {/* Seller 2 — only if shown and name entered */}
            {showSeller2 && form.seller2_name && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Seller 2</p>
                <div className="mb-3">
                  <label className={labelCls}>Name</label>
                  <input type="text" value={form.seller2_name} readOnly className={readonlyCls} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Witness</label>
                    <input type="text" value={form.seller2_witness} onChange={e => set('seller2_witness', e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Date</label>
                    <input type="date" value={form.seller2_sig_date} onChange={e => set('seller2_sig_date', e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>
            )}

            {/* Buyer 1 */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Buyer 1</p>
              <div className="mb-3">
                <label className={labelCls}>Name</label>
                <input type="text" value={form.buyer_name} readOnly className={readonlyCls} placeholder="Auto-filled from Buyer section" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Witness</label>
                  <input type="text" value={form.purchaser_witness} onChange={e => set('purchaser_witness', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Date</label>
                  <input type="date" value={form.purchaser_date} onChange={e => set('purchaser_date', e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>

            {/* Buyer 2 — only if shown and name entered */}
            {showBuyer2 && form.buyer2_name && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Buyer 2</p>
                <div className="mb-3">
                  <label className={labelCls}>Name</label>
                  <input type="text" value={form.buyer2_name} readOnly className={readonlyCls} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Witness</label>
                    <input type="text" value={form.buyer2_witness} onChange={e => set('buyer2_witness', e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Date</label>
                    <input type="date" value={form.buyer2_sig_date} onChange={e => set('buyer2_sig_date', e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
            By accepting this offer, the Seller agrees to pay a commission of <strong>5%</strong> to SAMSARA Ltd., trading as RE/MAX 365, plus <strong>17% ABST</strong>.
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
