import Link from 'next/link'
import Image from 'next/image'
import { Bed, Bath, Square, Maximize2, MapPin } from 'lucide-react'
import { Property } from '@/types'
import { formatPrice, formatNumber } from '@/lib/utils'

export default function PropertyCard({ property }: { property: Property }) {
  const heroImage = property.images?.[0] || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'

  return (
    <Link
        href={`/properties/${property.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
      >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={heroImage}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
        />
        {/* Status badge — only show if not active */}
        {property.status !== 'active' && (
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
              property.status === 'sold' ? 'bg-red-500 text-white' :
              property.status === 'under_contract' ? 'bg-orange-500 text-white' :
              'bg-amber-400 text-white'
            }`}>
              {property.status === 'sold' ? 'Sold' :
               property.status === 'under_contract' ? 'Under Contract' :
               'Under Offer'}
            </span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0c2749]" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-semibold text-lg text-gray-800 leading-snug group-hover:text-[#0c2749] transition-colors">
            {property.title}
          </h3>
          <span className="flex-shrink-0 bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full mt-0.5">
            {property.property_type}
          </span>
        </div>

        {property.location && (
          <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
            <MapPin size={11} />
            <span>{property.location}</span>
          </div>
        )}

        <p className="text-blue-600 font-bold text-xl mb-3">
          {formatPrice(property.price, property.currency)}
        </p>

        {/* Specs — only show non-null, non-zero values */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-500 text-sm mb-3">
          {property.bedrooms != null && property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bed size={13} className="text-gray-400" /> {property.bedrooms} beds
            </span>
          )}
          {property.bathrooms != null && property.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath size={13} className="text-gray-400" /> {property.bathrooms} baths
            </span>
          )}
          {property.sqft != null && property.sqft > 0 && (
            <span className="flex items-center gap-1.5">
              <Square size={13} className="text-gray-400" /> {formatNumber(property.sqft)} sqft
            </span>
          )}
          {property.lot_sqft != null && property.lot_sqft > 0 && (
            <span className="flex items-center gap-1.5">
              <Maximize2 size={13} className="text-gray-400" /> {formatNumber(property.lot_sqft)} lot sqft
            </span>
          )}
        </div>

        {(property.short_description || property.description) && (
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
            {property.short_description || property.description}
          </p>
        )}

        {/* View Details button */}
        <div className="mt-4 pt-4 border-t border-gray-50">
          <div className="block w-full text-center bg-[#0c2749] group-hover:bg-[#0a1f3a] text-white py-3.5 rounded-xl font-semibold text-sm transition-colors duration-200">
            View Details
          </div>
        </div>
      </div>
    </Link>
  )
}