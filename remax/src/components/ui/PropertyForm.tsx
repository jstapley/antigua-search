'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Property } from '@/types'
import ImageUploader from './ImageUploader'
import MapPicker from './MapPicker'

type FormData = Omit<Property, 'id' | 'created_at'> & { agent_id?: string | null }

const defaultForm: FormData = {
  title: '',
  slug: '',
  price: 0,
  currency: 'USD',
  property_type: 'House',
  bedrooms: null,
  bathrooms: null,
  sqft: null,
  lot_sqft: null,
  description: '',
  short_description: null,
  location: '',
  area: null,
  images: [],
  featured: false,
  cbi_eligible: false,
  status: 'active',
  amenities: [],
  video_url: null,
  tiktok_url: null,
  map_embed: null,
  agent_id: null,
}

const AMENITIES = [
  'Ocean View',            'Private Pool',       'Gated Community',
  'Air Conditioning',      'Ceiling Fans',       'Modern Kitchen',
  'Granite/Marble Countertops', 'Walk-in Closets', 'Covered Parking',
  'Garage',                '24/7 Security',      'Garden',
  'Balcony/Terrace',       'Sea Access',         'Beach Access',
  'Furnished',             'Unfurnished',        'Solar Panels',
  'Generator',             'Water Tank',         'Laundry Room',
  'Guest House',           'Office/Study',       'Gym',
  'Tennis Court',          'Boat Dock',     'Golf Course',
]

interface Agent { id: string; name: string; email: string }

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function getVideoEmbedUrl(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be')
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : url.split('v=')[1]?.split('&')[0]
    if (videoId) return `https://www.youtube.com/embed/${videoId}`
  }
  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
    if (videoId) return `https://player.vimeo.com/video/${videoId}`
  }
  return url
}

function getSocialEmbedUrl(url: string): string | null {
  if (!url) return null
  if (url.includes('tiktok.com')) {
    const videoId = url.split('/video/')[1]?.split('?')[0]
    if (videoId) return `https://www.tiktok.com/embed/v2/${videoId}`
  }
  if (url.includes('instagram.com/reel') || url.includes('instagram.com/p/')) {
    const shortcode = url.split('/reel/')[1]?.split('/')[0] || url.split('/p/')[1]?.split('/')[0]
    if (shortcode) return `https://www.instagram.com/p/${shortcode}/embed`
  }
  if (url.includes('youtube.com/shorts/') || url.includes('youtu.be/')) {
    const videoId = url.includes('shorts/')
      ? url.split('shorts/')[1]?.split('?')[0]
      : url.split('youtu.be/')[1]?.split('?')[0]
    if (videoId) return `https://www.youtube.com/embed/${videoId}`
  }
  return null
}

export default function PropertyForm({ property }: { property?: Property & { agent_id?: string | null } }) {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(property ? { ...defaultForm, ...property } : defaultForm)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [agents, setAgents] = useState<Agent[]>([])

  useEffect(() => {
    fetch('/api/admin/agents')
      .then(r => r.ok ? r.json() : [])
      .then(data => setAgents((Array.isArray(data) ? data : []).filter((a: Agent) => a.id !== 'ed382898-4009-45e4-9370-93c4064f8fec')))
      .catch(() => {})
  }, [])

  const isEdit = !!property
  const set = (key: keyof FormData, value: unknown) => setForm(f => ({ ...f, [key]: value }))

  const handleTitleChange = (title: string) => {
    setForm(f => ({ ...f, title, slug: isEdit ? f.slug : slugify(title) }))
  }

  const toggleAmenity = (amenity: string) => {
    const current = form.amenities || []
    set('amenities', current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const url = isEdit ? `/api/admin/properties/${property!.id}` : '/api/admin/properties'
      const method = isEdit ? 'PUT' : 'POST'

      const payload = { ...form } as FormData & { id?: string; created_at?: string }
      delete payload.id
      delete payload.created_at

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')

      if (isEdit) {
        setForm({ ...defaultForm, ...data })
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        router.push('/admin/properties')
        router.refresh()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save property')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] transition-colors"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5"
  const sectionClass = "bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Basic Info */}
      <div className={sectionClass}>
        <h2 className="font-semibold text-[#0c2749] mb-5">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className={labelClass}>Title *</label>
            <input required value={form.title} onChange={e => handleTitleChange(e.target.value)} className={inputClass} placeholder="Flamboyant House" />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input required value={form.slug} onChange={e => set('slug', e.target.value)} className={inputClass} placeholder="flamboyant-house" />
          </div>
          <div>
            <label className={labelClass}>Property Type *</label>
            <select required value={form.property_type} onChange={e => set('property_type', e.target.value as Property['property_type'])} className={inputClass}>
              {['House', 'Villa', 'Condo', 'Land', 'Commercial'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Price *</label>
            <input required type="number" value={form.price} onChange={e => set('price', Number(e.target.value))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Currency</label>
            <select value={form.currency} onChange={e => set('currency', e.target.value)} className={inputClass}>
              <option>USD</option><option>XCD</option><option>GBP</option><option>EUR</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Location *</label>
            <input required value={form.location} onChange={e => set('location', e.target.value)} className={inputClass} placeholder="West Coast, Antigua" />
          </div>
          <div>
            <label className={labelClass}>Area</label>
            <input value={form.area || ''} onChange={e => set('area', e.target.value || null)} className={inputClass} placeholder="West Coast" />
          </div>
          <div>
            <label className={labelClass}>Assigned Agent</label>
            <select
              value={form.agent_id || ''}
              onChange={e => set('agent_id', e.target.value || null)}
              className={inputClass}
            >
              <option value="">— Unassigned —</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Specs */}
      <div className={sectionClass}>
        <h2 className="font-semibold text-[#0c2749] mb-5">Property Specs</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {([['Bedrooms', 'bedrooms'], ['Bathrooms', 'bathrooms'], ['Interior sqft', 'sqft'], ['Lot sqft', 'lot_sqft']] as const).map(([label, key]) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input type="number" step="0.5" value={form[key] ?? ''} onChange={e => set(key, e.target.value ? Number(e.target.value) : null)} className={inputClass} />
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className={sectionClass}>
        <h2 className="font-semibold text-[#0c2749] mb-5">Description</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Short Description <span className="text-gray-400 font-normal">(shown on listing cards)</span></label>
            <input value={form.short_description || ''} onChange={e => set('short_description', e.target.value || null)} className={inputClass} placeholder="Brief one-line summary..." />
          </div>
          <div>
            <label className={labelClass}>Full Description *</label>
            <textarea required rows={7} value={form.description} onChange={e => set('description', e.target.value)} className={inputClass + ' resize-none'} placeholder="Full property description..." />
          </div>
        </div>
      </div>

      {/* Photos */}
      <div className={sectionClass}>
        <h2 className="font-semibold text-[#0c2749] mb-1">
          Photos <span className="text-gray-400 font-normal text-xs">(up to 15)</span>
        </h2>
        <p className="text-gray-400 text-xs mb-4">
          Drag and drop images or click to browse. The first image is the cover photo shown on listings.
        </p>
        <ImageUploader images={form.images} onChange={imgs => set('images', imgs)} maxImages={15} />
      </div>

      {/* Video */}
      <div className={sectionClass}>
        <h2 className="font-semibold text-[#0c2749] mb-1">
          Property Video <span className="text-gray-400 font-normal text-xs">(optional — add one or both)</span>
        </h2>

        <div className="space-y-5 mt-4">
          {/* Landscape */}
          <div>
            <label className={labelClass}>Landscape Video <span className="text-gray-400 font-normal">(YouTube or Vimeo)</span></label>
            <p className="text-gray-400 text-xs mb-2">Paste a standard YouTube or Vimeo share URL — it will be converted automatically.</p>
            <input
              value={form.video_url || ''}
              onChange={e => set('video_url', e.target.value || null)}
              className={inputClass}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {form.video_url && (
              <div className="mt-3 relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
                <iframe src={getVideoEmbedUrl(form.video_url)} className="absolute inset-0 w-full h-full" allowFullScreen title="Landscape video preview" />
              </div>
            )}
          </div>

          {/* Portrait */}
          <div>
            <label className={labelClass}>Portrait / Social Video <span className="text-gray-400 font-normal">(TikTok, Instagram Reels, YouTube Shorts)</span></label>
            <p className="text-gray-400 text-xs mb-2">Paste the share URL — displays at 9:16 aspect ratio on the listing.</p>
            <input
              value={form.tiktok_url || ''}
              onChange={e => set('tiktok_url', e.target.value || null)}
              className={inputClass}
              placeholder="https://www.tiktok.com/@user/video/... or Instagram Reel URL..."
            />
            {form.tiktok_url && getSocialEmbedUrl(form.tiktok_url) && (
              <div className="mt-3 relative mx-auto rounded-xl overflow-hidden bg-gray-100" style={{ width: '220px', aspectRatio: '9/16' }}>
                <iframe src={getSocialEmbedUrl(form.tiktok_url)!} className="absolute inset-0 w-full h-full" allowFullScreen title="Portrait video preview" />
              </div>
            )}
            {form.tiktok_url && !getSocialEmbedUrl(form.tiktok_url) && (
              <p className="mt-2 text-xs text-amber-600">Preview not available for this platform — the URL will still be saved and displayed on the listing.</p>
            )}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className={sectionClass}>
        <h2 className="font-semibold text-[#0c2749] mb-1">
          Property Location <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </h2>
        <p className="text-gray-400 text-xs mb-4">
          Search for the property address or click directly on the map to drop a pin.
        </p>
        <MapPicker value={form.map_embed} onChange={url => set('map_embed', url)} />
      </div>

      {/* Amenities */}
      <div className={sectionClass}>
        <h2 className="font-semibold text-[#0c2749] mb-5">Features & Amenities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3.5">
          {AMENITIES.map(amenity => {
            const checked = (form.amenities || []).includes(amenity)
            return (
              <label key={amenity} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAmenity(amenity)}
                  className="w-5 h-5 rounded border-gray-300 accent-amber-500 cursor-pointer flex-shrink-0"
                />
                <span className="text-sm text-gray-700 group-hover:text-[#0c2749] transition-colors">{amenity}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Settings */}
      <div className={sectionClass}>
        <h2 className="font-semibold text-[#0c2749] mb-5">Settings</h2>
        <div className="flex flex-wrap gap-8 items-end">
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value as Property['status'])} className={inputClass}>
              <option value="active">Active</option>
              <option value="under_offer">Under Offer</option>
              <option value="under_contract">Under Contract</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pb-0.5">
            <input type="checkbox" id="featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-5 h-5 rounded accent-[#0c2749]" />
            <label htmlFor="featured" className="font-medium text-gray-700 text-sm cursor-pointer">Featured on homepage</label>
          </div>
          <div className="flex items-center gap-3 pb-0.5">
            <input type="checkbox" id="cbi_eligible" checked={form.cbi_eligible || false} onChange={e => set('cbi_eligible', e.target.checked)} className="w-5 h-5 rounded accent-[#0c2749]" />
            <label htmlFor="cbi_eligible" className="font-medium text-gray-700 text-sm cursor-pointer">Citizenship by Investment (CBI) Eligible</label>
          </div>
        </div>
      </div>

      {saved && (
        <div className="text-green-700 text-sm bg-green-50 px-4 py-3 rounded-xl border border-green-200 flex items-center gap-2">
          <span>✓</span> Property saved successfully!
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-100">{error}</p>
      )}

      <div className="flex gap-3 pb-8">
        <button type="button" onClick={() => router.back()} className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:border-[#0c2749] transition-colors text-sm">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="flex-1 bg-[#0c2749] hover:bg-[#0a1f3a] disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors text-sm">
          {saving ? 'Saving...' : saved ? '✓ Saved!' : isEdit ? 'Update Property' : 'Create Property'}
        </button>
      </div>
    </form>
  )
}