import Link from 'next/link'
import { Bed, Bath, Maximize, MapPin } from 'lucide-react'
import type { Property } from '@/types'
import { formatPrice, formatSqft } from '@/lib/utils'

interface PropertyCardProps {
  property: Property
  href: string
}

const statusStyles: Record<string, string> = {
  available: 'bg-emerald-100 text-emerald-800',
  reserved: 'bg-amber-100 text-amber-800',
  sold: 'bg-gray-100 text-gray-600',
}

const statusLabels: Record<string, string> = {
  available: 'Available',
  reserved: 'Under Offer',
  sold: 'Sold',
}

export default function PropertyCard({ property, href }: PropertyCardProps) {
  return (
    <Link
      href={href}
      className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[#e8dfd0]"
    >
      {/* Image placeholder */}
      <div className="relative h-52 bg-gradient-to-br from-[#3d0000]/10 to-[#7BC9BF]/20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin size={40} className="text-[#3d0000]/30" />
        </div>
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[property.status]}`}>
            {statusLabels[property.status]}
          </span>
        </div>
      </div>

      <div className="p-5">
        <p className="text-xs text-[#7BC9BF] font-semibold uppercase tracking-wider mb-1 capitalize">
          {property.type}
        </p>
        <h3 className="font-serif text-xl text-[#19130b] group-hover:text-[#3d0000] transition-colors mb-2">
          {property.name}
        </h3>

        {property.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{property.description}</p>
        )}

        {/* Stats */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
          {property.bedrooms && (
            <span className="flex items-center gap-1">
              <Bed size={14} /> {property.bedrooms} bed
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1">
              <Bath size={14} /> {property.bathrooms} bath
            </span>
          )}
          {property.interior_sqft && (
            <span className="flex items-center gap-1">
              <Maximize size={14} /> {formatSqft(property.interior_sqft)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#e8dfd0]">
          <span className="font-serif text-lg font-bold text-[#3d0000]">
            {formatPrice(property.price)}
          </span>
          <span className="text-xs text-[#3d0000] font-semibold group-hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  )
}
