'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  property_name: z.string().min(1, 'Required'),
  property_type: z.enum(['villa', 'condo', 'lot']),
  sale_price: z.string().min(1, 'Required').refine(v => !isNaN(Number(v)) && Number(v) > 0, 'Must be a positive number'),
  list_price: z.string().optional(),
  sold_at: z.string().min(1, 'Required'),
  buyer_name: z.string().optional(),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  properties: { id: string; name: string; type: string }[]
}

export default function AddSaleButton({ properties }: Props) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { sold_at: new Date().toISOString().slice(0, 10) },
  })

  function handlePropertyChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = properties.find(p => p.name === e.target.value)
    if (selected) {
      setValue('property_name', selected.name)
      setValue('property_type', selected.type as 'villa' | 'condo' | 'lot')
    }
  }

  async function onSubmit(data: FormData) {
    setError(null)
    const supabase = createClient()

    // Find property_id if it matches a known property
    const matched = properties.find(p => p.name === data.property_name)

    const { error: err } = await supabase.from('sales').insert({
      property_id: matched?.id ?? null,
      property_name: data.property_name,
      property_type: data.property_type,
      sale_price: Number(data.sale_price),
      list_price: data.list_price ? Number(data.list_price) : null,
      sold_at: data.sold_at,
      buyer_name: data.buyer_name || null,
      notes: data.notes || null,
    })

    if (err) {
      setError(err.message)
      return
    }

    // Also update property status to sold if matched
    if (matched) {
      await supabase.from('properties').update({ status: 'sold' }).eq('id', matched.id)
    }

    reset()
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-[#3d0000] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#6b0000] transition-colors"
      >
        <Plus size={16} /> Record Sale
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl text-[#19130b]">Record a Sale</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#19130b] mb-1.5">Property</label>
                <select
                  onChange={handlePropertyChange}
                  className="w-full border border-[#e8dfd0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d0000]/20 mb-1"
                >
                  <option value="">Select from existing...</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.name}>{p.name} ({p.type})</option>
                  ))}
                </select>
                <input
                  {...register('property_name')}
                  placeholder="Or type property name"
                  className="w-full border border-[#e8dfd0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d0000]/20"
                />
                {errors.property_name && <p className="text-red-500 text-xs mt-1">{errors.property_name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#19130b] mb-1.5">Type</label>
                  <select
                    {...register('property_type')}
                    className="w-full border border-[#e8dfd0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d0000]/20"
                  >
                    <option value="villa">Villa</option>
                    <option value="condo">Condo</option>
                    <option value="lot">Lot</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#19130b] mb-1.5">Sale Date</label>
                  <input
                    {...register('sold_at')}
                    type="date"
                    className="w-full border border-[#e8dfd0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d0000]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#19130b] mb-1.5">Sale Price ($)</label>
                  <input
                    {...register('sale_price')}
                    type="number"
                    placeholder="e.g. 2600000"
                    className="w-full border border-[#e8dfd0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d0000]/20"
                  />
                  {errors.sale_price && <p className="text-red-500 text-xs mt-1">{errors.sale_price.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#19130b] mb-1.5">List Price ($)</label>
                  <input
                    {...register('list_price')}
                    type="number"
                    placeholder="Optional"
                    className="w-full border border-[#e8dfd0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d0000]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#19130b] mb-1.5">Buyer Name (optional)</label>
                <input
                  {...register('buyer_name')}
                  className="w-full border border-[#e8dfd0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d0000]/20"
                  placeholder="Confidential if left blank"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#19130b] mb-1.5">Notes (optional)</label>
                <textarea
                  {...register('notes')}
                  rows={2}
                  className="w-full border border-[#e8dfd0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d0000]/20 resize-none"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 border border-[#e8dfd0] text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#3d0000] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#6b0000] transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : 'Record Sale'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
