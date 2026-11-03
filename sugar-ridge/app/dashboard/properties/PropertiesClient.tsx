'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, ExternalLink, Pencil } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Property } from '@/types'
import PropertyModal from './PropertyModal'

const statusStyles: Record<string, string> = {
  available: 'bg-emerald-100 text-emerald-700',
  reserved: 'bg-amber-100 text-amber-700',
  sold: 'bg-gray-100 text-gray-500',
}

const statusLabels: Record<string, string> = {
  available: 'Available',
  reserved: 'Under Offer',
  sold: 'Sold',
}

const typeIcons: Record<string, string> = {
  villa: '🏡',
  condo: '🏢',
  lot: '📍',
}

interface Props {
  properties: Property[]
}

export default function PropertiesClient({ properties }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Property | null>(null)

  function openAdd() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(property: Property) {
    setEditing(property)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditing(null)
  }

  const grouped = {
    villa: properties.filter(p => p.type === 'villa'),
    condo: properties.filter(p => p.type === 'condo'),
    lot: properties.filter(p => p.type === 'lot'),
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl text-[#19130b]">Properties</h1>
          <p className="text-gray-500 text-sm mt-1">{properties.length} total properties</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#3d0000] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#6b0000] transition-colors"
        >
          <Plus size={16} /> Add Property
        </button>
      </div>

      <div className="space-y-8">
        {(['villa', 'condo', 'lot'] as const).map((type) => (
          <div key={type}>
            <h2 className="font-semibold text-[#19130b] mb-3 capitalize flex items-center gap-2">
              <span>{typeIcons[type]}</span>
              {type}s
              <span className="text-sm text-gray-400 font-normal">({grouped[type].length})</span>
            </h2>

            <div className="bg-white rounded-xl border border-[#e8dfd0] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#f8f5f0] border-b border-[#e8dfd0]">
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Name</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Price</th>
                      {type !== 'lot' && (
                        <>
                          <th className="text-left px-5 py-3 font-medium text-gray-500">Beds</th>
                          <th className="text-left px-5 py-3 font-medium text-gray-500">Baths</th>
                          <th className="text-left px-5 py-3 font-medium text-gray-500">Sqft</th>
                        </>
                      )}
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grouped[type].map((p) => (
                      <tr key={p.id} className="border-b border-[#e8dfd0] last:border-0 hover:bg-[#f8f5f0]/50 transition-colors">
                        <td className="px-5 py-3 font-medium text-[#19130b]">{p.name}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[p.status]}`}>
                            {statusLabels[p.status] ?? p.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-medium text-[#3d0000]">{formatPrice(p.price)}</td>
                        {type !== 'lot' && (
                          <>
                            <td className="px-5 py-3 text-gray-500">{p.bedrooms ?? '—'}</td>
                            <td className="px-5 py-3 text-gray-500">{p.bathrooms ?? '—'}</td>
                            <td className="px-5 py-3 text-gray-500">
                              {p.interior_sqft ? `${p.interior_sqft.toLocaleString()} sqft` : '—'}
                            </td>
                          </>
                        )}
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openEdit(p)}
                              className="inline-flex items-center gap-1 text-[#3d0000] hover:underline text-xs font-medium"
                            >
                              <Pencil size={12} /> Edit
                            </button>
                            <Link
                              href={`/${type === 'villa' ? 'villas' : type === 'condo' ? 'condos' : 'lots'}/${p.slug}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 text-gray-400 hover:text-gray-600 hover:underline text-xs"
                            >
                              <ExternalLink size={12} /> View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {grouped[type].length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                          No {type}s found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PropertyModal
        open={modalOpen}
        onClose={closeModal}
        property={editing}
      />
    </>
  )
}
