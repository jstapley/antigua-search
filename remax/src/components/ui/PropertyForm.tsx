'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Property } from '@/types'
import { X, Plus } from 'lucide-react'
import ImageUploader from './ImageUploader'
import MapPicker from './MapPicker'

type FormData = Omit<Property, 'id' | 'created_at'>

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
  status: 'active',
  amenities: [],
  video_url: null,
  map_embed: null,
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function PropertyForm({ property }: { property?: Property }) {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(property || defaultForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [amenityInput, setAmenityInput] = useState('')

  const isEdit = !!property
  const set = (key: keyof FormData, value: unknown) => setForm(f => ({ ...f, [key]: value }))

  const handleTitleChange = (title: string) => {
    setForm(f => ({ ...f, title, slug: isEdit ? f.slug : slugify(title) }))
  }

  const addAmenity = () => {
    if (amenityInput.trim()) {
      set('amenities', [...(form.amenities || []), amenityInput.trim()])
      setAmenityInput('')
    }
  }

  const removeAmenity = (i: number) => set('amenities', form.amenities.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const url = isEdit ? `/api/admin/properties/${property!.id}` : '/api/admin/properties'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save')
      }
      router.push('/admin/properties')
      router.refresh()
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

      {/* Photos — drag & drop uploader */}
      <div className={sectionClass}>
        <h2 className="font-semibold text-[#0c2749] mb-1">
          Photos <span className="text-gray-400 font-normal text-xs">(up to 15)</span>
        </h2>
        <p className="text-gray-400 text-xs mb-4">
          Drag and drop images or click to browse. The first image is the cover photo shown on listings. Hover thumbnails to reorder or remove.
        </p>
        <ImageUploader
          images={form.images}
          onChange={imgs => set('images', imgs)}
          maxImages={15}
        />
      </div>

      {/* Video */}
      <div className={sectionClass}>
        <h2 className="font-semibold text-[#0c2749] mb-1">
          Property Video <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </h2>
        <p className="text-gray-400 text-xs mb-3">
          YouTube: Share → Embed → copy the <code className="bg-gray-100 px-1 rounded">src</code> URL (starts with https://www.youtube.com/embed/...)
        </p>
        <input
          value={form.video_url || ''}
          onChange={e => set('video_url', e.target.value || null)}
          className={inputClass}
          placeholder="https://www.youtube.com/embed/VIDEO_ID"
        />
        {form.video_url && (
          <div className="mt-3 relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
            <iframe src={form.video_url} className="absolute inset-0 w-full h-full" allowFullScreen title="Video preview" />
          </div>
        )}
      </div>

      {/* Map */}
      <div className={sectionClass}>
        <h2 className="font-semibold text-[#0c2749] mb-1">
          Property Location <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </h2>
        <p className="text-gray-400 text-xs mb-4">
          Search for the property address or click directly on the map to drop a pin. You can drag the pin to fine-tune the exact location.
        </p>
        <MapPicker
          value={form.map_embed}
          onChange={url => set('map_embed', url)}
        />
      </div>

      {/* Amenities */}
      <div className={sectionClass}>
        <h2 className="font-semibold text-[#0c2749] mb-4">Amenities</h2>
        <div className="flex gap-2 mb-3">
          <input
            value={amenityInput}
            onChange={e => setAmenityInput(e.target.value)}
            className={inputClass}
            placeholder="e.g. Swimming Pool"
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
          />
          <button type="button" onClick={addAmenity} className="flex items-center gap-1 px-4 py-2.5 bg-[#0c2749] text-white rounded-xl text-sm font-medium whitespace-nowrap">
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.amenities.map((a, i) => (
            <span key={i} className="bg-blue-50 text-[#0c2749] px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5">
              {a}
              <button type="button" onClick={() => removeAmenity(i)} className="text-gray-400 hover:text-red-500"><X size={12} /></button>
            </span>
          ))}
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
              <option value="pending">Pending / Under Offer</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pb-0.5">
            <input type="checkbox" id="featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-5 h-5 rounded accent-[#0c2749]" />
            <label htmlFor="featured" className="font-medium text-gray-700 text-sm cursor-pointer">Featured on homepage</label>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-100">{error}</p>
      )}

      <div className="flex gap-3 pb-8">
        <button type="button" onClick={() => router.back()} className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:border-[#0c2749] transition-colors text-sm">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="flex-1 bg-[#0c2749] hover:bg-[#0a1f3a] disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors text-sm">
          {saving ? 'Saving...' : isEdit ? 'Update Property' : 'Create Property'}
        </button>
      </div>
    </form>
  )
}
