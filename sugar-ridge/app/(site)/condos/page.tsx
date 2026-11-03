import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import PropertyCard from '@/components/site/PropertyCard'
import type { Property } from '@/types'

export const metadata: Metadata = {
  title: 'Luxury Condos',
  description: 'Modern 2-bedroom condos with Caribbean Sea views in Sugar Ridge\'s 5-storey building with pool, fitness center, and resort amenities.',
}

const amenities = [
  'Swimming pool',
  'Fitness center',
  'Café & restaurant',
  'Yoga pavilion',
  'Secure gated community',
  'Concierge services',
]

export default async function CondosPage() {
  const supabase = await createClient()
  const { data: condos } = await supabase
    .from('properties')
    .select('*')
    .eq('type', 'condo')
    .order('sort_order')

  const available = condos?.filter((c: Property) => c.status === 'available').length ?? 0

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#19130b] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#7BC9BF] text-sm font-semibold tracking-widest uppercase mb-3">Properties</p>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4">Luxury Condos</h1>
          <p className="text-white/70 max-w-xl leading-relaxed">
            Modern comfort meets exclusive community convenience. Our 5-storey condo building
            offers 28 two-bedroom units with private terraces, Caribbean views, and resort amenities.
          </p>
        </div>
      </div>

      {/* Overview */}
      <div className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-[#7BC9BF] text-sm font-semibold tracking-widest uppercase mb-3">The Building</p>
              <h2 className="font-serif text-3xl text-[#19130b] mb-4">28 Exclusive Units</h2>
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                {[
                  ['28 Units', 'Total in building'],
                  [`${available} Available`, 'Units remaining'],
                  ['5 Storeys', 'Building height'],
                  ['1,200 sq.ft.', 'Per unit'],
                  ['2 Bed / 2 Bath', 'Layout'],
                  ['10ft+', 'Ceiling height'],
                ].map(([value, label]) => (
                  <div key={label} className="bg-[#f8f5f0] rounded-lg p-4">
                    <p className="font-serif font-bold text-[#3d0000] text-lg">{value}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed">
                West-facing with open-concept living areas, private terraces, and ultra-modern
                finishes. Each unit features air conditioning, built-in work-from-home desk
                stations, and access to all resort amenities.
              </p>
            </div>

            <div>
              <p className="text-[#7BC9BF] text-sm font-semibold tracking-widest uppercase mb-3">Community Amenities</p>
              <h2 className="font-serif text-3xl text-[#19130b] mb-6">Resort-Style Living</h2>
              <ul className="space-y-3">
                {amenities.map((a) => (
                  <li key={a} className="flex items-center gap-3 text-gray-600">
                    <CheckCircle size={18} className="text-[#7BC9BF] shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/contact?type=condo"
                  className="inline-flex items-center gap-2 bg-[#3d0000] text-white px-6 py-3 rounded font-semibold hover:bg-[#6b0000] transition-colors"
                >
                  Request Investor Package <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Individual units */}
      {condos && condos.length > 0 && (
        <div className="bg-[#f8f5f0] py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl text-[#19130b] mb-8">Available Units</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {condos.map((condo: Property) => (
                <PropertyCard key={condo.id} property={condo} href={`/condos/${condo.slug}`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
