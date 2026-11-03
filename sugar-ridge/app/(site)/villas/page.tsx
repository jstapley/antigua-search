import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import PropertyCard from '@/components/site/PropertyCard'
import type { Property } from '@/types'

export const metadata: Metadata = {
  title: 'Luxury Villas',
  description: 'Explore Sugar Ridge\'s bespoke luxury villas on Antigua\'s west coast with breathtaking Caribbean Sea views.',
}

export default async function VillasPage() {
  const supabase = await createClient()
  const { data: villas } = await supabase
    .from('properties')
    .select('*')
    .eq('type', 'villa')
    .order('sort_order')

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#3d0000] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#7BC9BF] text-sm font-semibold tracking-widest uppercase mb-3">Properties</p>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4">Luxury Villas</h1>
          <p className="text-white/70 max-w-xl leading-relaxed">
            Luxurious, spacious living with breathtaking views and privacy. Each villa is an
            architectural masterpiece designed to capture the essence of Caribbean luxury.
          </p>
        </div>
      </div>

      {/* Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {villas && villas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {villas.map((villa: Property) => (
              <PropertyCard key={villa.id} property={villa} href={`/villas/${villa.slug}`} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-20">No villas found. Check back soon.</p>
        )}
      </div>
    </div>
  )
}
