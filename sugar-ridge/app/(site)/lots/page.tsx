import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import type { Property } from '@/types'

export const metadata: Metadata = {
  title: 'Prime Lots',
  description: 'Purchase a prime lot at Sugar Ridge and build your custom Caribbean dream home on Antigua\'s west coast.',
}

export default async function LotsPage() {
  const supabase = await createClient()
  const { data: lots } = await supabase
    .from('properties')
    .select('*')
    .eq('type', 'lot')
    .order('lot_number')

  const available = lots?.filter((l: Property) => l.status === 'available') ?? []
  const sold = lots?.filter((l: Property) => l.status === 'sold') ?? []

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#3d0000] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#7BC9BF] text-sm font-semibold tracking-widest uppercase mb-3">Properties</p>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4">Prime Lots</h1>
          <p className="text-white/70 max-w-xl leading-relaxed">
            Secure your place in the Sugar Ridge community with a prime lot and build your custom
            Caribbean dream home. Each lot is carefully positioned to maximise views and privacy.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-[#e8dfd0] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-8 text-sm">
            <div>
              <span className="font-serif text-2xl font-bold text-[#3d0000]">{available.length}</span>
              <span className="text-gray-500 ml-2">Available</span>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold text-gray-400">{sold.length}</span>
              <span className="text-gray-500 ml-2">Sold</span>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold text-[#3d0000]">
                $595K – $995K
              </span>
              <span className="text-gray-500 ml-2">Price Range</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lots grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {available.length > 0 && (
          <>
            <h2 className="font-serif text-2xl text-[#19130b] mb-6">Available Lots</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
              {available.map((lot: Property) => (
                <LotCard key={lot.id} lot={lot} />
              ))}
            </div>
          </>
        )}

        {sold.length > 0 && (
          <>
            <h2 className="font-serif text-2xl text-[#19130b] mb-6 opacity-60">Sold Lots</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 opacity-60">
              {sold.map((lot: Property) => (
                <LotCard key={lot.id} lot={lot} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* CTA */}
      <div className="bg-[#f8f5f0] py-14 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="font-serif text-2xl text-[#19130b] mb-3">Interested in a Lot?</h2>
          <p className="text-gray-500 text-sm mb-6">
            Contact us for site plans, lot dimensions, and architectural guidelines.
          </p>
          <Link
            href="/contact?type=lot"
            className="inline-flex items-center gap-2 bg-[#3d0000] text-white px-6 py-3 rounded font-semibold hover:bg-[#6b0000] transition-colors"
          >
            Enquire Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}

const lotStatusStyles: Record<string, string> = {
  available: 'bg-emerald-100 text-emerald-800',
  reserved: 'bg-amber-100 text-amber-800',
  sold: 'bg-gray-100 text-gray-500',
}

const lotStatusLabels: Record<string, string> = {
  available: 'Available',
  reserved: 'Under Offer',
  sold: 'Sold',
}

function LotCard({ lot }: { lot: Property }) {
  return (
    <div className={`bg-white rounded-lg border border-[#e8dfd0] p-5 ${lot.status === 'sold' ? 'pointer-events-none' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-[#3d0000]/10 flex items-center justify-center">
          <MapPin size={18} className="text-[#3d0000]" />
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${lotStatusStyles[lot.status]}`}>
          {lotStatusLabels[lot.status] ?? lot.status}
        </span>
      </div>

      <h3 className="font-serif text-lg text-[#19130b] mb-1">{lot.name}</h3>
      {lot.description && (
        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{lot.description}</p>
      )}

      <div className="pt-3 border-t border-[#e8dfd0] flex items-center justify-between">
        <span className="font-bold text-[#3d0000]">{formatPrice(lot.price)}</span>
        {lot.status === 'available' && (
          <Link
            href={`/contact?property=${encodeURIComponent(lot.name)}`}
            className="text-xs text-[#3d0000] font-semibold hover:underline"
          >
            Enquire →
          </Link>
        )}
      </div>
    </div>
  )
}
