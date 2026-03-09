'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Bed, Bath, Square, Maximize2 } from 'lucide-react'
import { Property } from '@/types'
import { formatPrice, formatNumber } from '@/lib/utils'

export default function PropertyCard({ property }: { property: Property }) {
  const heroImage = property.images?.[0] || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={heroImage}
          alt={property.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
        />
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-indigo-500" />
      </div>
      <div className="p-6">
        <h3 className="font-display font-semibold text-xl text-gray-800 mb-2">{property.title}</h3>
        <p className="text-blue-600 font-bold text-xl mb-3">
          {formatPrice(property.price, property.currency)}
        </p>
        <div className="mb-4">
          <span className="bg-[#0c2749] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            {property.property_type}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-gray-500 text-sm mb-2">
          {property.bedrooms && (
            <span className="flex items-center gap-1.5">
              <Bed size={14} className="text-gray-400" /> {property.bedrooms} beds
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1.5">
              <Bath size={14} className="text-gray-400" /> {property.bathrooms} baths
            </span>
          )}
          {property.sqft && (
            <span className="flex items-center gap-1.5">
              <Square size={14} className="text-gray-400" /> {formatNumber(property.sqft)} sqft
            </span>
          )}
        </div>
        {property.lot_sqft && (
          <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
            <Maximize2 size={14} className="text-gray-400" />
            {formatNumber(property.lot_sqft)} lot sqft
          </div>
        )}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-5">
          {property.short_description || property.description}
        </p>
        <Link
          href={`/properties/${property.slug}`}
          className="block w-full text-center bg-[#0c2749] hover:bg-[#0a1f3a] text-white py-3.5 rounded-xl font-semibold text-sm transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}
