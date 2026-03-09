import Link from 'next/link'
import { getServiceSupabase } from '@/lib/supabase'
import { Property } from '@/types'
import PropertyCard from '@/components/ui/PropertyCard'

export const revalidate = 0  // never cache — always fetch fresh from Supabase

async function getFeaturedProperties(): Promise<Property[]> {
  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('featured', true)
    .neq('status', 'sold')
    .order('created_at', { ascending: false })
    .limit(3)

  if (error) console.error('Error fetching featured properties:', error)
  return (data as Property[]) || []
}

export default async function FeaturedPropertiesSection() {
  const properties = await getFeaturedProperties()

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 text-center mb-2">
          Featured Properties
        </h2>
        <div className="w-20 h-0.5 bg-teal-500 mx-auto mb-12" />

        {properties.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            No featured properties listed yet. Mark properties as featured in the{' '}
            <Link href="/admin/properties" className="text-[#0c2749] underline">admin dashboard</Link>.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {properties.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            href="/properties"
            className="inline-block border-2 border-[#0c2749] text-[#0c2749] hover:bg-[#0c2749] hover:text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors duration-200"
          >
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  )
}
