'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Property, PropertyType } from '@/types'

const schema = z.object({
  name: z.string().min(1, 'Required'),
  slug: z.string().min(1, 'Required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
  type: z.enum(['villa', 'condo', 'lot']),
  status: z.enum(['available', 'reserved', 'sold']),
  price: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  interior_sqft: z.string().optional(),
  total_sqft: z.string().optional(),
  lot_sqft: z.string().optional(),
  lot_number: z.string().optional(),
  completion_date: z.string().optional(),
  listed_at: z.string().optional(),
  sold_date: z.string().optional(), // read from sales table, shown read-only
  description: z.string().optional(),
  features: z.string().optional(), // newline-separated
})

type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
  property?: Property | null // null = add mode
}

function toNum(v: string | undefined) {
  if (!v || v.trim() === '') return null
  const n = Number(v)
  return isNaN(n) ? null : n
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function PropertyModal({ open, onClose, property }: Props) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const isEdit = !!property

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  // Populate form when editing
  useEffect(() => {
    if (open) {
      if (property) {
        reset({
          name: property.name,
          slug: property.slug,
          type: property.type,
          status: property.status,
          price: property.price?.toString() ?? '',
          bedrooms: property.bedrooms?.toString() ?? '',
          bathrooms: property.bathrooms?.toString() ?? '',
          interior_sqft: property.interior_sqft?.toString() ?? '',
          total_sqft: property.total_sqft?.toString() ?? '',
          lot_sqft: property.lot_sqft?.toString() ?? '',
          lot_number: property.lot_number ?? '',
          completion_date: property.completion_date ?? '',
          listed_at: property.listed_at?.slice(0, 10) ?? '',
          sold_date: '',
          description: property.description ?? '',
          features: property.features?.join('\n') ?? '',
        })
      } else {
        reset({
          type: 'villa',
          status: 'available',
          name: '', slug: '', price: '', bedrooms: '', bathrooms: '',
          interior_sqft: '', total_sqft: '', lot_sqft: '', lot_number: '',
          completion_date: '', listed_at: '', sold_date: '', description: '', features: '',
        })
      }
      setServerError(null)
    }
  }, [open, property, reset])

  // Auto-generate slug from name in add mode
  const nameValue = watch('name')
  useEffect(() => {
    if (!isEdit && nameValue) {
      setValue('slug', slugify(nameValue), { shouldValidate: false })
    }
  }, [isEdit, nameValue, setValue])

  const propertyType = watch('type')

  async function onSubmit(data: FormData) {
    setServerError(null)
    const supabase = createClient()

    const payload = {
      name: data.name,
      slug: data.slug,
      type: data.type as PropertyType,
      status: data.status,
      price: toNum(data.price),
      bedrooms: toNum(data.bedrooms),
      bathrooms: toNum(data.bathrooms),
      interior_sqft: toNum(data.interior_sqft),
      total_sqft: toNum(data.total_sqft),
      lot_sqft: toNum(data.lot_sqft),
      lot_number: data.lot_number || null,
      completion_date: data.completion_date || null,
      listed_at: data.listed_at || null,
      description: data.description || null,
      features: data.features
        ? data.features.split('\n').map(f => f.trim()).filter(Boolean)
        : null,
    }

    let savedId: string | null = isEdit ? property!.id : null

    if (isEdit) {
      const { error } = await supabase.from('properties').update(payload).eq('id', property!.id)
      if (error) { setServerError(error.message); return }
    } else {
      const { data: inserted, error } = await supabase.from('properties').insert(payload).select('id').single()
      if (error) { setServerError(error.message); return }
      savedId = inserted?.id ?? null
    }

    // Keep the sales ledger in sync when a sold property has a price
    if (data.status === 'sold' && toNum(data.price) !== null && savedId) {
      const salePrice = toNum(data.price)!
      // Upsert: update existing sale for this property, or insert if none exists
      const { data: existing } = await supabase
        .from('sales')
        .select('id')
        .eq('property_id', savedId)
        .order('sold_at', { ascending: false })
        .limit(1)
        .single()

      if (existing?.id) {
        await supabase.from('sales').update({ sale_price: salePrice, property_name: data.name, property_type: data.type }).eq('id', existing.id)
      } else {
        await supabase.from('sales').insert({
          property_id: savedId,
          property_name: data.name,
          property_type: data.type,
          sale_price: salePrice,
          list_price: salePrice,
          sold_at: new Date().toISOString().slice(0, 10),
        })
      }
    }

    router.refresh()
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8dfd0] shrink-0">
          <h2 className="font-serif text-xl text-[#19130b]">
            {isEdit ? `Edit — ${property!.name}` : 'Add Property'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable form */}
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Row: name + slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Property Name *" error={errors.name?.message}>
              <input {...register('name')} className={input} placeholder="e.g. Sea La Vie" />
            </Field>
            <Field label="URL Slug *" error={errors.slug?.message}>
              <input {...register('slug')} className={input} placeholder="e.g. sea-la-vie" />
            </Field>
          </div>

          {/* Row: type + status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Type *" error={errors.type?.message}>
              <select {...register('type')} className={input}>
                <option value="villa">Villa</option>
                <option value="condo">Condo</option>
                <option value="lot">Lot</option>
              </select>
            </Field>
            <Field label="Status *" error={errors.status?.message}>
              <select {...register('status')} className={input}>
                <option value="available">Available</option>
                <option value="reserved">Under Offer</option>
                <option value="sold">Sold</option>
              </select>
            </Field>
          </div>

          {/* Row: price + completion date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Price (USD)">
              <input {...register('price')} className={input} type="number" placeholder="e.g. 2600000" />
            </Field>
            <Field label="Completion / Status">
              <input {...register('completion_date')} className={input} placeholder="e.g. Completed, Q1 2025" />
            </Field>
          </div>

          {/* Row: listing date + sold date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Listing Date">
              <input {...register('listed_at')} className={input} type="date" />
            </Field>
            <Field label="Sold Date (via Sales ledger)">
              <input
                {...register('sold_date')}
                className={`${input} bg-gray-50 text-gray-400 cursor-not-allowed`}
                type="date"
                disabled
                placeholder="Set via Sales page"
              />
              <p className="text-xs text-gray-400 mt-1">Update sold date on the Sales page</p>
            </Field>
          </div>

          {/* Beds / Baths / Sqft — only for non-lots */}
          {propertyType !== 'lot' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Bedrooms">
                <input {...register('bedrooms')} className={input} type="number" placeholder="4" />
              </Field>
              <Field label="Bathrooms">
                <input {...register('bathrooms')} className={input} type="number" placeholder="4" />
              </Field>
              <Field label="Interior Sqft">
                <input {...register('interior_sqft')} className={input} type="number" placeholder="2229" />
              </Field>
              <Field label="Total Sqft (incl. outdoor)">
                <input {...register('total_sqft')} className={input} type="number" placeholder="4415" />
              </Field>
              <Field label="Lot Sqft">
                <input {...register('lot_sqft')} className={input} type="number" placeholder="11975" />
              </Field>
            </div>
          )}

          {/* Lot number — for lots */}
          {propertyType === 'lot' && (
            <Field label="Lot Number">
              <input {...register('lot_number')} className={input} placeholder="e.g. 10" />
            </Field>
          )}

          {/* Description */}
          <Field label="Description">
            <textarea
              {...register('description')}
              className={`${input} resize-none`}
              rows={3}
              placeholder="Property description..."
            />
          </Field>

          {/* Features */}
          <Field label="Features (one per line)">
            <textarea
              {...register('features')}
              className={`${input} resize-none`}
              rows={5}
              placeholder={`Infinity pool with swim-up bar\nEuropean kitchen\nSolar power system`}
            />
          </Field>

          {serverError && (
            <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-100">
              {serverError}
            </p>
          )}
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#e8dfd0] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-[#e8dfd0] text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form=""
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex-1 bg-[#3d0000] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#6b0000] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Property'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Helpers
const input = 'w-full border border-[#e8dfd0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d0000]/20 focus:border-[#3d0000] bg-white'

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#19130b] mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
