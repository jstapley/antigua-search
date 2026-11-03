import { getServiceSupabase } from '@/lib/supabase'
import PropertiesClient from './PropertiesClient'

export const revalidate = 0

export default async function PropertiesPage() {
  const supabase = getServiceSupabase()
  const { data } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-navy-700 py-16 text-center text-white mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Properties for Sale</h1>
        <p className="text-gray-300">Discover your dream home in Antigua</p>
      </div>

      <PropertiesClient properties={data || []} />
    </div>
  )
}
