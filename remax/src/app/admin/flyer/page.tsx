'use client'

import { useState, useEffect } from 'react'
import { Search, FileDown, Eye } from 'lucide-react'

interface Property {
  id: string
  title: string
  slug: string
  price: number
  currency: string
  property_type: string
  bedrooms: number | null
  bathrooms: number | null
  sqft: number | null
  lot_sqft: number | null
  location: string
  short_description: string | null
  description: string
  images: string[]
  agent_id: string | null
}

interface Agent {
  id: string
  name: string
  email: string
}

export default function FlyerPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [selected, setSelected] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/properties').then(r => r.json()),
      fetch('/api/admin/agents').then(r => r.json()),
    ]).then(([props, agts]) => {
      setProperties(Array.isArray(props) ? props.filter((p: Property) => p.title) : [])
      setAgents(Array.isArray(agts) ? agts : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = properties.filter(p =>
    !search.trim() ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  )

  const getAgent = (property: Property): Agent => {
    if (property.agent_id) {
      const found = agents.find(a => a.id === property.agent_id)
      if (found) return found
    }
    return agents.find(a => a.email.includes('michelglass')) || agents[0]
  }

  const handleExport = () => {
    if (!selected) return
    const agent = getAgent(selected)
    const params = new URLSearchParams({
      id: selected.id,
      agentName: agent?.name || 'Michel Glass',
      agentEmail: agent?.email || 'michelglass@remax-365-antigua.com',
    })
    window.open(`/admin/flyer/print?${params.toString()}`, '_blank')
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[#0c2749]">Create Flyer</h1>
        <p className="text-gray-400 text-sm mt-0.5">Generate a print-ready property flyer for your storefront.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left — selector */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-[#0c2749] mb-4">Select Property</h2>

            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder={loading ? 'Loading...' : `Search ${properties.length} properties...`}
                value={search}
                onChange={e => { setSearch(e.target.value); setSearchOpen(true) }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                disabled={loading}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749]"
              />
              {searchOpen && filtered.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                  {filtered.slice(0, 30).map(p => (
                    <button key={p.id} type="button"
                      onMouseDown={() => { setSelected(p); setSearch(''); setSearchOpen(false) }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                      <p className="text-sm font-medium text-gray-800">{p.title}</p>
                      <p className="text-xs text-gray-400">{p.location}{p.price ? ` · $${p.price.toLocaleString()}` : ''}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selected && (
              <div className="border border-[#0c2749] rounded-xl px-4 py-3 bg-blue-50/40">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-[#0c2749] text-sm">{selected.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{selected.location}</p>
                    <p className="text-xs text-blue-600 font-semibold mt-1">{selected.currency} ${selected.price.toLocaleString()}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-red-400 text-xs transition-colors">Change</button>
                </div>
                {selected.images?.[0] && (
                  <img src={selected.images[0]} alt={selected.title}
                    className="w-full h-32 object-cover rounded-lg mt-3" />
                )}
              </div>
            )}
          </div>

          {selected && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-[#0c2749] mb-3">Agent</h2>
              {(() => {
                const agent = getAgent(selected)
                return (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#0c2749] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">
                        {agent?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0c2749]">{agent?.name}</p>
                      <p className="text-xs text-gray-400">{agent?.email}</p>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {selected && (
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 bg-[#0c2749] hover:bg-[#0a1f3a] text-white py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              <Eye size={15} /> Preview & Export PDF
            </button>
          )}
        </div>

        {/* Right — mini preview */}
        <div>
          {selected ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-[#0c2749] px-4 py-2 flex items-center justify-between">
                <p className="text-white text-xs font-medium">Flyer Preview</p>
                <p className="text-white/40 text-xs">Click "Preview & Export PDF" for full size</p>
              </div>
              <div className="p-4">
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                  {/* Header */}
                  <div className="bg-[#0c2749] py-3 text-center">
                    <img src="/logo-white.png" alt="RE/MAX 365 Antigua" className="h-8 mx-auto" />
                  </div>
                  {/* Hero image */}
                  {selected.images?.[0] && (
                    <img src={selected.images[0]} alt={selected.title}
                      className="w-full object-cover" style={{ height: '160px' }} />
                  )}
                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2 gap-3">
                      <div className="min-w-0">
                        <h2 className="font-bold text-[#0c2749] text-sm leading-tight">{selected.title}</h2>
                        <p className="text-gray-500 text-xs mt-0.5">{selected.location}</p>
                      </div>
                      <div className="bg-[#0c2749] text-white px-2.5 py-1.5 rounded-lg text-right flex-shrink-0">
                        <p className="font-bold text-sm">${selected.price.toLocaleString()}</p>
                        <p className="text-xs text-white/70">{selected.currency}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-500 mb-2">
                      {selected.bedrooms && <span>🛏 {selected.bedrooms} Bed</span>}
                      {selected.bathrooms && <span>🚿 {selected.bathrooms} Bath</span>}
                      {selected.sqft && <span>📐 {selected.sqft.toLocaleString()} Sq Ft</span>}
                    </div>
                    <p className="text-gray-600 text-xs line-clamp-2">
                      {selected.short_description || selected.description?.substring(0, 120)}
                    </p>
                    {/* Thumbnails in preview */}
                    {selected.images?.length > 1 && (
                      <div className="flex gap-1.5 mt-2">
                        {selected.images.slice(1, 3).map((img: string, i: number) => (
                          <img key={i} src={img} alt=""
                            className="flex-1 object-cover rounded-lg"
                            style={{ height: '56px' }} />
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Footer */}
                  <div className="bg-[#0c2749] px-4 py-2.5 flex items-center justify-between">
                    <div>
                      <p className="text-white text-xs font-semibold">{getAgent(selected)?.name}</p>
                      <p className="text-white/50 text-xs">{getAgent(selected)?.email}</p>
                    </div>
                    <p className="text-white/50 text-xs">+1 268-724-9308</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-64 flex items-center justify-center">
              <div className="text-center text-gray-300">
                <FileDown size={40} className="mx-auto mb-3" />
                <p className="text-sm text-gray-400">Select a property to preview the flyer</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}