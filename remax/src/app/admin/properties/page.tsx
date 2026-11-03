'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface Property {
  id: string
  title: string
  location: string
  price: number
  currency: string
  property_type: string
  status: string
  featured: boolean
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  under_offer: 'bg-yellow-100 text-yellow-700',
  under_contract: 'bg-orange-100 text-orange-700',
  sold: 'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  under_offer: 'Under Offer',
  under_contract: 'Under Contract',
  sold: 'Sold',
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterFeatured, setFilterFeatured] = useState('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/properties')
      .then(r => r.json())
      .then(data => {
        setProperties(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' })
    setProperties(p => p.filter(x => x.id !== id))
    setDeleting(null)
  }

  const filtered = properties.filter(p => {
    const matchSearch = search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || p.status === filterStatus
    const matchType = filterType === 'all' || p.property_type === filterType
    const matchFeatured = filterFeatured === 'all' ||
      (filterFeatured === 'featured' && p.featured) ||
      (filterFeatured === 'not-featured' && !p.featured)
    return matchSearch && matchStatus && matchType && matchFeatured
  })

  const types = ['all', ...Array.from(new Set(properties.map(p => p.property_type))).sort()]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0c2749]">Properties</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {loading ? 'Loading...' : `${filtered.length} of ${properties.length} listings`}
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 bg-[#0c2749] hover:bg-[#0a1f3a] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Property
        </Link>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] bg-white"
          />
        </div>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] bg-white text-gray-700"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="under_offer">Under Offer</option>
          <option value="under_contract">Under Contract</option>
          <option value="sold">Sold</option>
        </select>

        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] bg-white text-gray-700"
        >
          {types.map(t => (
            <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>
          ))}
        </select>

        <select
          value={filterFeatured}
          onChange={e => setFilterFeatured(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] bg-white text-gray-700"
        >
          <option value="all">All</option>
          <option value="featured">Featured Only</option>
          <option value="not-featured">Not Featured</option>
        </select>

        {(search || filterStatus !== 'all' || filterType !== 'all' || filterFeatured !== 'all') && (
          <button
            onClick={() => { setSearch(''); setFilterStatus('all'); setFilterType('all'); setFilterFeatured('all') }}
            className="px-4 py-2.5 text-sm text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl bg-white transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide">
              <th className="text-left px-5 py-3 font-medium">Property</th>
              <th className="text-left px-5 py-3 font-medium">Price</th>
              <th className="text-left px-5 py-3 font-medium">Type</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Featured</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse w-48" /></td>
                  <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse w-24" /></td>
                  <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse w-16" /></td>
                  <td className="px-5 py-4"><div className="h-6 bg-gray-100 rounded-full animate-pulse w-16" /></td>
                  <td className="px-5 py-4" />
                  <td className="px-5 py-4" />
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-gray-400">
                  {properties.length === 0 ? (
                    <div>
                      <p className="mb-2">No properties yet</p>
                      <Link href="/admin/properties/new" className="text-[#0c2749] font-medium hover:underline text-sm">
                        Add your first property →
                      </Link>
                    </div>
                  ) : (
                    <p>No properties match your filters</p>
                  )}
                </td>
              </tr>
            ) : (
              filtered.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-[#0c2749]">{p.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{p.location}</p>
                  </td>
                  <td className="px-5 py-3 text-blue-600 font-semibold">{formatPrice(p.price, p.currency)}</td>
                  <td className="px-5 py-3 text-gray-600">{p.property_type}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[p.status] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[p.status] || p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {p.featured && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link href={`/admin/properties/${p.id}`}
                        className="p-2 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#0c2749] transition-colors">
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        disabled={deleting === p.id}
                        className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}