import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getServiceSupabase } from '@/lib/supabase'
import { Property } from '@/types'
import PropertyForm from '@/components/ui/PropertyForm'

async function getProperty(id: string): Promise<Property | null> {
  const supabase = getServiceSupabase()
  const { data, error } = await supabase.from('properties').select('*').eq('id', id).single()
  if (error || !data) return null
  return data as Property
}

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id)
  if (!property) notFound()

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/admin/properties" className="text-gray-400 hover:text-[#0c2749] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-2xl font-bold text-[#0c2749]">Edit Property</h1>
      </div>
      <p className="text-gray-500 text-sm mb-8 ml-8">{property.title}</p>
      <PropertyForm property={property} />
    </div>
  )
}
