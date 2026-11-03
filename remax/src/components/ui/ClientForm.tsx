'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ClientFields {
  name: string
  email: string
  phone: string
  source: string
  status: string
  interest: string
  notes: string
  property_slug: string
}

interface ClientRecord extends ClientFields {
  id: string
  created_at?: string
  last_contacted?: string | null
}

const defaultForm: ClientFields = {
  name: '',
  email: '',
  phone: '',
  source: 'manual',
  status: 'new',
  interest: '',
  notes: '',
  property_slug: '',
}

// Convert DB record (nulls) → controlled form state (strings only)
function normalize(client?: ClientRecord): ClientFields {
  if (!client) return defaultForm
  return {
    name: client.name || '',
    email: client.email || '',
    phone: client.phone || '',
    source: client.source || 'manual',
    status: client.status || 'new',
    interest: client.interest || '',
    notes: client.notes || '',
    property_slug: client.property_slug || '',
  }
}

export default function ClientForm({ client }: { client?: ClientRecord }) {
  const router = useRouter()
  const [form, setForm] = useState<ClientFields>(() => normalize(client))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const isEdit = !!client?.id
  const set = (key: keyof ClientFields, value: string) =>
    setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const url = isEdit ? `/api/admin/clients/${client!.id}` : '/api/admin/clients'
      const method = isEdit ? 'PUT' : 'POST'

      // Empty strings → null for DB; never send id/created_at
      const payload: Record<string, string | null> = {}
      for (const [k, v] of Object.entries(form)) {
        payload[k] = v.trim() === '' ? null : v.trim()
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')

      if (isEdit) {
        setForm(normalize(data))
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        router.push('/admin/clients')
        router.refresh()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save client')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] transition-colors'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'
  const sectionClass = 'bg-white rounded-2xl border border-gray-100 p-6 shadow-sm'

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">

      <div className={sectionClass}>
        <h2 className="font-semibold text-[#0c2749] mb-5">Client Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className={labelClass}>Full Name *</label>
            <input required value={form.name} onChange={e => set('name', e.target.value)}
              className={inputClass} placeholder="Jane Smith" />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
              className={inputClass} placeholder="jane@example.com" />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
              className={inputClass} placeholder="+1 268-555-0000" />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="font-semibold text-[#0c2749] mb-5">Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)} className={inputClass}>
              <option value="new">New</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Interest</label>
            <select value={form.interest} onChange={e => set('interest', e.target.value)} className={inputClass}>
              <option value="">— Select —</option>
              <option value="buying">Buying</option>
              <option value="selling">Selling</option>
              <option value="cbi">CBI</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Source</label>
            <select value={form.source} onChange={e => set('source', e.target.value)} className={inputClass}>
              <option value="manual">Manual</option>
              <option value="contact_form">Contact Form</option>
              <option value="schedule_form">Booking Form</option>
              <option value="ghl_import">GHL Import</option>
            </select>
          </div>
        </div>
        <div className="mt-5">
          <label className={labelClass}>Property of Interest <span className="text-gray-400 font-normal">(slug)</span></label>
          <input value={form.property_slug} onChange={e => set('property_slug', e.target.value)}
            className={inputClass} placeholder="driftwood-villa" />
        </div>
        <div className="mt-5">
          <label className={labelClass}>Notes</label>
          <textarea rows={4} value={form.notes} onChange={e => set('notes', e.target.value)}
            className={inputClass + ' resize-none'} placeholder="Any relevant notes about this client..." />
        </div>
      </div>

      {saved && (
        <div className="text-green-700 text-sm bg-green-50 px-4 py-3 rounded-xl border border-green-200">
          ✓ Client saved successfully!
        </div>
      )}
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
          {saving ? 'Saving…' : saved ? '✓ Saved!' : isEdit ? 'Update Client' : 'Add Client'}
        </button>
      </div>
    </form>
  )
}
