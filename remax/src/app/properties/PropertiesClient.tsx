'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import PropertyCard from '@/components/ui/PropertyCard'
import { Property } from '@/types'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'under_offer', label: 'Under Offer' },
  { value: 'under_contract', label: 'Under Contract' },
  { value: 'sold', label: 'Sold' },
]

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'House', label: 'House' },
  { value: 'Villa', label: 'Villa' },
  { value: 'Condo', label: 'Condo' },
  { value: 'Land', label: 'Land' },
  { value: 'Commercial', label: 'Commercial' },
]

export default function PropertiesClient({ properties }: { properties: Property[] }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [sort, setSort] = useState('newest')

  const filtered = properties
    .filter(p => {
      const matchSearch = !search.trim() ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase())
      const matchStatus = !status || p.status === status
      const matchType = !type || p.property_type === type
      return matchSearch && matchStatus && matchType
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  const hasFilters = search || status || type || sort !== 'newest'

  const clearFilters = () => {
    setSearch('')
    setStatus('')
    setType('')
    setSort('newest')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 bg-white"
          />
        </div>

        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-500/20 bg-white text-gray-700"
        >
          {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-500/20 bg-white text-gray-700"
        >
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-500/20 bg-white text-gray-700"
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl bg-white transition-colors"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-400 mb-6">
        {filtered.length} {filtered.length === 1 ? 'property' : 'properties'} found
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <SlidersHorizontal size={40} className="mx-auto mb-4 text-gray-200" />
          <p className="text-gray-500 font-medium mb-1">No properties match your search</p>
          <button onClick={clearFilters} className="text-navy-700 font-semibold hover:underline text-sm mt-2">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
          {filtered.map(p => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  )
}
