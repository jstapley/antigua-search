import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { Property } from '@/types'
import PropertyCard from '@/components/ui/PropertyCard'

export const metadata: Metadata = {
  title: 'Properties for Sale | RE/MAX 365 Antigua',
  description: 'Browse exclusive properties for sale in Antigua. Beachfront villas, luxury homes, and investment properties.',
}

async function getProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) return []
  return data as Property[]
}

export default async function PropertiesPage() {
  const properties = await getProperties()

  return (
    <div className="pt-24 pb-20">
      {/* Page header */}
      <div className="bg-navy-700 py-16 text-center text-white mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Properties for Sale</h1>
        <p className="text-gray-300">Discover your dream home in Antigua</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {properties.length === 0 ? (
          <p className="text-center text-gray-500 py-20">No properties available at this time.</p>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-8">{properties.length} properties found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
