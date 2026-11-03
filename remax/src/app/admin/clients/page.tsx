'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Plus, Search, Pencil, Trash2, Phone, Mail, ExternalLink, Upload, Download } from 'lucide-react'

interface Client {
  id: string
  created_at: string
  name: string
  email: string | null
  phone: string | null
  source: string
  status: string
  interest: string | null
  notes: string | null
  property_slug: string | null
  last_contacted: string | null
}

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-500',
}
const INTEREST_STYLES: Record<string, string> = {
  buying: 'bg-amber-100 text-amber-700',
  selling: 'bg-purple-100 text-purple-700',
  cbi: 'bg-teal-100 text-teal-700',
  other: 'bg-gray-100 text-gray-600',
}
const SOURCE_LABELS: Record<string, string> = {
  manual: 'Manual',
  contact_form: 'Contact Form',
  schedule_form: 'Booking Form',
  ghl_import: 'GHL Import',
  csv_import: 'CSV Import',
}

// ── GHL CSV parser ────────────────────────────────────────────────────────────
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') { inQuotes = !inQuotes }
    else if (ch === ',' && !inQuotes) { result.push(current); current = '' }
    else { current += ch }
  }
  result.push(current)
  return result
}

function parseGHLCsv(text: string): Omit<Client, 'id' | 'created_at'>[] {
  const lines = text.split('\n').filter(l => l.trim())
  const headers = parseCSVLine(lines[0]).map(h => h.trim())

  return lines.slice(1).map(line => {
    const cols = parseCSVLine(line)
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h] = (cols[i] || '').trim() })

    const firstName = row['First Name'] || ''
    const lastName = row['Last Name'] || ''
    const name = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown'
    const tags = (row['Tags'] || '').split(',').map(t => t.trim()).filter(Boolean)

    // Source from tags
    let source = 'ghl_import'
    if (tags.includes('contact-form')) source = 'contact_form'
    else if (tags.some(t => t.startsWith('property showing'))) source = 'schedule_form'

    // Interest
    let interest = 'buying'
    if (tags.includes('selling') || tags.includes('sell')) interest = 'selling'
    if (tags.includes('cbi') || tags.includes('citizenship')) interest = 'cbi'

    // Property slug: pick interest-* tag without a date suffix
    const interestTag = tags.find(t =>
      t.startsWith('interest-') && !/\d{4}-\d{2}-\d{2}/.test(t)
    )
    const property_slug = interestTag
      ? interestTag.replace(/^interest-/, '').replace(/-an$/, '').replace(/-a$/, '')
      : null

    // Notes: preserve GHL tags
    const showings = tags.filter(t => t.startsWith('property showing:'))
    let notes: string | null = null
    if (tags.length > 0) {
      notes = `GHL Tags: ${tags.join(', ')}`
      if (showings.length > 0) {
        notes += `\nShowings: ${showings.map(t => t.replace('property showing: ', '')).join(', ')}`
      }
    }

    return {
      name,
      email: row['Email'] || null,
      phone: row['Phone'] || null,
      source,
      status: 'new',
      interest,
      notes,
      property_slug,
      last_contacted: null,
    }
  }).filter(c => c.name !== 'Unknown' || c.email || c.phone)
}

// ── CSV exporter ──────────────────────────────────────────────────────────────
function exportToCSV(clients: Client[]) {
  const headers = ['Name', 'Email', 'Phone', 'Status', 'Interest', 'Source', 'Property', 'Notes', 'Added']
  const rows = clients.map(c => [
    c.name,
    c.email || '',
    c.phone || '',
    c.status,
    c.interest || '',
    SOURCE_LABELS[c.source] || c.source,
    c.property_slug || '',
    (c.notes || '').replace(/\n/g, ' | '),
    new Date(c.created_at).toLocaleDateString(),
  ])
  const csv = [headers, ...rows]
    .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `remax365-clients-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterInterest, setFilterInterest] = useState('all')
  const [filterSource, setFilterSource] = useState('all')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number } | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadClients = () =>
    fetch('/api/admin/clients')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setClients(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))

  useEffect(() => { loadClients() }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete client "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    await fetch(`/api/admin/clients/${id}`, { method: 'DELETE' })
    setClients(c => c.filter(x => x.id !== id))
    setDeleting(null)
  }

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/admin/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setClients(c => c.map(x => x.id === id ? { ...x, status } : x))
    setEditingId(null)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    setImportResult(null)
    setImportError(null)
    try {
      const text = await file.text()
      const parsed = parseGHLCsv(text)
      if (parsed.length === 0) throw new Error('No valid rows found in this CSV file.')

      const res = await fetch('/api/admin/clients/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clients: parsed }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Import failed')
      setImportResult(result)
      await loadClients()
    } catch (err: unknown) {
      setImportError(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const filtered = clients.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      c.name.toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q)
    const matchStatus = filterStatus === 'all' || c.status === filterStatus
    const matchInterest = filterInterest === 'all' || c.interest === filterInterest
    const matchSource = filterSource === 'all' || c.source === filterSource
    return matchSearch && matchStatus && matchInterest && matchSource
  })

  const hasFilters = search || filterStatus !== 'all' || filterInterest !== 'all' || filterSource !== 'all'

  return (
    <div className="p-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0c2749]">Clients</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {loading ? 'Loading…' : `${filtered.length} of ${clients.length} clients`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => exportToCSV(filtered)}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-[#0c2749] hover:text-[#0c2749] px-4 py-2.5 rounded-xl font-medium text-sm transition-colors bg-white">
            <Download size={15} />
            Export {hasFilters ? `(${filtered.length})` : 'CSV'}
          </button>
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleImport} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} disabled={importing}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-[#0c2749] hover:text-[#0c2749] px-4 py-2.5 rounded-xl font-medium text-sm transition-colors bg-white disabled:opacity-50">
            <Upload size={15} />
            {importing ? 'Importing…' : 'Import GHL CSV'}
          </button>
          <Link href="/admin/clients/new"
            className="flex items-center gap-2 bg-[#0c2749] hover:bg-[#0a1f3a] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm">
            <Plus size={16} /> Add Client
          </Link>
        </div>
      </div>

      {/* ── Import feedback ── */}
      {importResult && (
        <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          <span>
            ✓ Imported <strong>{importResult.imported}</strong> clients
            {importResult.skipped > 0 && ` · ${importResult.skipped} skipped (already exist)`}
          </span>
          <button onClick={() => setImportResult(null)} className="text-green-500 hover:text-green-800 ml-4 text-lg leading-none">×</button>
        </div>
      )}
      {importError && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          <span>✗ {importError}</span>
          <button onClick={() => setImportError(null)} className="text-red-400 hover:text-red-700 ml-4 text-lg leading-none">×</button>
        </div>
      )}

      {/* ── Stats ── */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {([
            { label: 'Total', value: clients.length, color: 'text-[#0c2749]' },
            { label: 'New', value: clients.filter(c => c.status === 'new').length, color: 'text-blue-600' },
            { label: 'Active', value: clients.filter(c => c.status === 'active').length, color: 'text-green-600' },
            { label: 'Closed', value: clients.filter(c => c.status === 'closed').length, color: 'text-gray-400' },
          ] as const).map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input type="text" placeholder="Search by name, email or phone…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] bg-white" />
        </div>
        {([
          { value: filterStatus, set: setFilterStatus, options: [['all','All Statuses'],['new','New'],['active','Active'],['closed','Closed']] },
          { value: filterInterest, set: setFilterInterest, options: [['all','All Interests'],['buying','Buying'],['selling','Selling'],['cbi','CBI'],['other','Other']] },
          { value: filterSource, set: setFilterSource, options: [['all','All Sources'],['contact_form','Contact Form'],['schedule_form','Booking Form'],['ghl_import','GHL Import'],['manual','Manual']] },
        ] as const).map((f, i) => (
          <select key={i} value={f.value} onChange={e => f.set(e.target.value as never)}
            className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 bg-white text-gray-700">
            {f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}
        {hasFilters && (
          <button onClick={() => { setSearch(''); setFilterStatus('all'); setFilterInterest('all'); setFilterSource('all') }}
            className="px-4 py-2.5 text-sm text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl bg-white transition-colors">
            Clear
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide">
              <th className="text-left px-5 py-3 font-medium">Client</th>
              <th className="text-left px-5 py-3 font-medium">Contact</th>
              <th className="text-left px-5 py-3 font-medium">Interest</th>
              <th className="text-left px-5 py-3 font-medium">Source</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Added</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse w-20" /></td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-gray-400">
                  {clients.length === 0 ? (
                    <div className="space-y-2">
                      <p>No clients yet.</p>
                      <div className="flex items-center justify-center gap-4 text-sm">
                        <button onClick={() => fileInputRef.current?.click()} className="text-[#0c2749] font-medium hover:underline">
                          Import from GHL →
                        </button>
                        <span className="text-gray-300">or</span>
                        <Link href="/admin/clients/new" className="text-[#0c2749] font-medium hover:underline">
                          Add manually →
                        </Link>
                      </div>
                    </div>
                  ) : <p>No clients match your filters.</p>}
                </td>
              </tr>
            ) : (
              filtered.map(client => (
                <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0c2749] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {client.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <Link href={`/admin/clients/${client.id}`} className="font-medium text-[#0c2749] hover:underline underline-offset-2">{client.name}</Link>
                        {client.property_slug && (
                          <Link href={`/properties/${client.property_slug}`} target="_blank"
                            className="text-xs text-gray-400 hover:text-[#0c2749] flex items-center gap-1 mt-0.5">
                            <ExternalLink size={10} />
                            <span className="truncate max-w-[140px]">{client.property_slug}</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="space-y-1">
                      {client.email && (
                        <a href={`mailto:${client.email}`} className="flex items-center gap-1.5 text-gray-500 hover:text-[#0c2749] text-xs transition-colors">
                          <Mail size={11} /><span className="truncate max-w-[160px]">{client.email}</span>
                        </a>
                      )}
                      {client.phone && (
                        <a href={`tel:${client.phone}`} className="flex items-center gap-1.5 text-gray-500 hover:text-[#0c2749] text-xs transition-colors">
                          <Phone size={11} />{client.phone}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {client.interest && (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${INTEREST_STYLES[client.interest] || 'bg-gray-100 text-gray-600'}`}>
                        {client.interest === 'cbi' ? 'CBI' : client.interest}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {SOURCE_LABELS[client.source] || client.source}
                  </td>
                  <td className="px-5 py-3">
                    {editingId === client.id ? (
                      <select autoFocus defaultValue={client.status}
                        onChange={e => handleStatusChange(client.id, e.target.value)}
                        onBlur={() => setEditingId(null)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-[#0c2749]">
                        <option value="new">New</option>
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                      </select>
                    ) : (
                      <button onClick={() => setEditingId(client.id)}
                        title="Click to change status"
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer hover:opacity-75 transition-opacity ${STATUS_STYLES[client.status] || 'bg-gray-100 text-gray-600'}`}>
                        {client.status}
                      </button>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(client.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link href={`/admin/clients/${client.id}`}
                        className="p-2 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#0c2749] transition-colors">
                        <Pencil size={14} />
                      </Link>
                      <button onClick={() => handleDelete(client.id, client.name)}
                        disabled={deleting === client.id}
                        className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Table footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400 flex items-center justify-between">
            <span>Showing {filtered.length} of {clients.length} clients</span>
            {hasFilters && (
              <span className="text-[#0c2749] font-medium">Filtered view — Export CSV exports only visible rows</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
