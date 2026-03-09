'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, CheckCircle2, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Matches the GHL JSON structure
interface GHLProperty {
  title: string
  price: string
  priceValue: number
  type: string
  bedrooms: number
  bathrooms: number
  sqft: string
  lot_sqft: string
  featured: string
  withdrawn: string
  image: string
  url: string
}

interface ImportResult {
  title: string
  status: 'success' | 'skipped' | 'error'
  reason?: string
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function mapType(type: string): string {
  const t = type.toLowerCase().trim()
  if (t === 'villa') return 'Villa'
  if (t === 'condo') return 'Condo'
  if (t === 'land') return 'Land'
  if (t === 'commercial') return 'Commercial'
  if (t === 'townhouse') return 'House' // closest match in our schema
  // house, sold, under offer, under contract, price drop, etc → House
  return 'House'
}

function mapStatus(type: string, withdrawn: string): 'active' | 'sold' | 'pending' {
  if (withdrawn === 'yes') return 'pending'
  const t = type.toLowerCase().trim()
  if (t === 'sold') return 'sold'
  if (t === 'under offer' || t === 'under contract') return 'pending'
  return 'active'
}

function parseNumber(val: string | number): number | null {
  if (!val || val === '' || val === '0' || val === 0) return null
  const n = parseInt(String(val).replace(/,/g, '').trim())
  return isNaN(n) || n === 0 ? null : n
}

function parseDecimal(val: string | number): number | null {
  if (!val || val === '' || val === '0' || val === 0) return null
  const n = parseFloat(String(val).replace(/,/g, '').trim())
  return isNaN(n) || n === 0 ? null : n
}

export default function ImportPage() {
  const router = useRouter()
  const [jsonText, setJsonText] = useState('')
  const [parsed, setParsed] = useState<GHLProperty[] | null>(null)
  const [parseError, setParseError] = useState('')
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState<ImportResult[]>([])
  const [done, setDone] = useState(false)

  const handleParse = () => {
    setParseError('')
    setParsed(null)
    try {
      let text = jsonText.trim()

      // Step 1: Try to extract PROPERTIES array from full HTML/JS file
      const fullMatch = text.match(/const PROPERTIES\s*=\s*([\s\S]*?);\s*\n\s*\n/)
      if (fullMatch) {
        text = fullMatch[1].trim()
      }

      // Step 2: Wrap in array brackets if not already an array
      if (!text.startsWith('[')) {
        text = '[' + text + ']'
      }

      // Step 3: Remove trailing commas before } or ] (JS allows, JSON doesn't)
      text = text.replace(/,\s*([}\]])/g, '$1')

      // Step 4: Quote unquoted object keys  title: -> "title":
      text = text.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')

      // Step 5: Parse
      const data = JSON.parse(text)
      if (!Array.isArray(data)) throw new Error('Expected a JSON array')
      setParsed(data)
    } catch (e) {
      setParseError(e instanceof Error ? e.message : 'Invalid format — make sure you pasted the full JS array or object list')
    }
  }

  const handleImport = async () => {
    if (!parsed) return
    setImporting(true)
    setResults([])

    const resultsList: ImportResult[] = []

    for (const p of parsed) {
      // Skip withdrawn
      if (p.withdrawn === 'yes') {
        resultsList.push({ title: p.title, status: 'skipped', reason: 'Withdrawn' })
        continue
      }

      const slug = slugify(p.title)

      const payload = {
        title: p.title,
        slug,
        price: p.priceValue,
        currency: 'USD',
        property_type: mapType(p.type),
        bedrooms: p.bedrooms > 0 ? p.bedrooms : null,
        bathrooms: parseDecimal(p.bathrooms),
        sqft: parseNumber(p.sqft),
        lot_sqft: parseNumber(p.lot_sqft),
        description: p.title, // placeholder — can be updated later in admin
        short_description: null,
        location: extractLocation(p.title),
        area: null,
        images: p.image ? [p.image] : [],
        featured: p.featured === 'yes',
        status: mapStatus(p.type, p.withdrawn),
        amenities: [],
      }

      try {
        const res = await fetch('/api/admin/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (res.status === 409) {
          resultsList.push({ title: p.title, status: 'skipped', reason: 'Already exists (duplicate slug)' })
        } else if (!res.ok) {
          const data = await res.json()
          resultsList.push({ title: p.title, status: 'error', reason: data.error || 'Unknown error' })
        } else {
          resultsList.push({ title: p.title, status: 'success' })
        }
      } catch (e) {
        resultsList.push({ title: p.title, status: 'error', reason: 'Network error' })
      }

      // Update results live as each property is processed
      setResults([...resultsList])
    }

    setImporting(false)
    setDone(true)
  }

  const successCount = results.filter(r => r.status === 'success').length
  const skippedCount = results.filter(r => r.status === 'skipped').length
  const errorCount = results.filter(r => r.status === 'error').length

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/admin/properties" className="text-gray-400 hover:text-navy-700 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-2xl font-bold text-navy-700">Import Properties</h1>
      </div>
      <p className="text-gray-500 text-sm mb-8 ml-8">
        Paste your GHL property JSON array below to bulk-import into Supabase.
      </p>

      {!done && (
        <>
          {/* Step 1: Paste JSON */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-5">
            <h2 className="font-semibold text-navy-700 mb-1">Step 1 — Paste your JSON</h2>
            <p className="text-gray-400 text-xs mb-4">
              Paste either the raw array <code className="bg-gray-100 px-1 rounded">[ ... ]</code> or the entire HTML file — we'll extract the array automatically.
            </p>
            <textarea
              rows={12}
              value={jsonText}
              onChange={e => { setJsonText(e.target.value); setParsed(null); setParseError('') }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-navy-500 resize-none"
              placeholder='[{ "title": "...", "price": "$375,000", ... }]'
            />
            {parseError && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <XCircle size={14} /> {parseError}
              </p>
            )}
            <button
              onClick={handleParse}
              disabled={!jsonText.trim()}
              className="mt-3 bg-navy-700 hover:bg-navy-800 disabled:opacity-40 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              Parse JSON
            </button>
          </div>

          {/* Step 2: Preview */}
          {parsed && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-5">
              <h2 className="font-semibold text-navy-700 mb-4">
                Step 2 — Preview ({parsed.length} properties found)
              </h2>

              <div className="overflow-x-auto mb-5">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400">
                      <th className="text-left py-2 pr-4 font-medium">Title</th>
                      <th className="text-left py-2 pr-4 font-medium">Price</th>
                      <th className="text-left py-2 pr-4 font-medium">Type → Mapped</th>
                      <th className="text-left py-2 pr-4 font-medium">Status</th>
                      <th className="text-left py-2 pr-4 font-medium">Beds/Baths</th>
                      <th className="text-left py-2 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.map((p, i) => {
                      const willSkip = p.withdrawn === 'yes'
                      return (
                        <tr key={i} className={`border-b border-gray-50 ${willSkip ? 'opacity-40' : ''}`}>
                          <td className="py-2 pr-4 font-medium text-navy-700 max-w-[200px] truncate">{p.title}</td>
                          <td className="py-2 pr-4 text-green-600 font-semibold">{p.price}</td>
                          <td className="py-2 pr-4 text-gray-500">
                            <span className="line-through mr-1">{p.type}</span>
                            <span className="text-navy-600 font-medium">→ {mapType(p.type)}</span>
                          </td>
                          <td className="py-2 pr-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              mapStatus(p.type, p.withdrawn) === 'active' ? 'bg-green-100 text-green-700' :
                              mapStatus(p.type, p.withdrawn) === 'sold' ? 'bg-red-100 text-red-600' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {mapStatus(p.type, p.withdrawn)}
                            </span>
                          </td>
                          <td className="py-2 pr-4 text-gray-500">
                            {p.bedrooms > 0 ? `${p.bedrooms}bd` : '—'} / {p.bathrooms > 0 ? `${p.bathrooms}ba` : '—'}
                          </td>
                          <td className="py-2">
                            {willSkip
                              ? <span className="text-gray-400 italic">skip (withdrawn)</span>
                              : <span className="text-green-600">import</span>
                            }
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-green-600">{parsed.filter(p => p.withdrawn !== 'yes').length}</span> will import,{' '}
                  <span className="font-semibold text-gray-400">{parsed.filter(p => p.withdrawn === 'yes').length}</span> will be skipped
                </div>
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="ml-auto flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  <Upload size={15} />
                  {importing ? 'Importing...' : 'Import All'}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-semibold text-navy-700 mb-4">
            {done ? 'Import Complete' : 'Importing...'} — {results.length} / {parsed?.length}
          </h2>

          {done && (
            <div className="flex gap-5 mb-5 text-sm">
              <span className="flex items-center gap-1.5 text-green-600 font-semibold">
                <CheckCircle2 size={15} /> {successCount} imported
              </span>
              <span className="flex items-center gap-1.5 text-yellow-600 font-semibold">
                <AlertTriangle size={15} /> {skippedCount} skipped
              </span>
              <span className="flex items-center gap-1.5 text-red-500 font-semibold">
                <XCircle size={15} /> {errorCount} errors
              </span>
            </div>
          )}

          <div className="space-y-1.5 max-h-96 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 text-sm py-1.5 border-b border-gray-50">
                {r.status === 'success' && <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />}
                {r.status === 'skipped' && <AlertTriangle size={14} className="text-yellow-500 flex-shrink-0" />}
                {r.status === 'error' && <XCircle size={14} className="text-red-500 flex-shrink-0" />}
                <span className="text-gray-700 flex-1">{r.title}</span>
                {r.reason && <span className="text-gray-400 text-xs">{r.reason}</span>}
              </div>
            ))}
          </div>

          {done && (
            <div className="flex gap-3 mt-5">
              <Link
                href="/admin/properties"
                className="flex-1 text-center bg-navy-700 hover:bg-navy-800 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                View All Properties →
              </Link>
              <button
                onClick={() => { setDone(false); setResults([]); setParsed(null); setJsonText('') }}
                className="border-2 border-gray-200 text-gray-600 px-5 py-3 rounded-xl font-semibold text-sm hover:border-navy-300 transition-colors"
              >
                Import More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Extract a clean location from the property title
// e.g. "Flamboyant House, Valley Church, Antigua" → "Valley Church, Antigua"
function extractLocation(title: string): string {
  const parts = title.split(',')
  if (parts.length >= 2) {
    return parts.slice(1).join(',').trim()
  }
  return 'Antigua'
}