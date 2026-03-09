import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getServiceSupabase } from '@/lib/supabase'
import { Property } from '@/types'
import { formatPrice } from '@/lib/utils'
import DeleteButton from './DeleteButton'

export const revalidate = 0  // never cache this page

async function getProperties(): Promise<Property[]> {
  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) console.error('Supabase error:', error)
  return (data as Property[]) || []
}

export default async function AdminPropertiesPage() {
  const properties = await getProperties()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0c2749]">Properties</h1>
          <p className="text-gray-500 text-sm">{properties.length} total listings</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 bg-[#0c2749] hover:bg-[#0a1f3a] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
        >
          <Plus size={16} /> Add Property
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500">
              <th className="text-left px-5 py-3 font-medium">Property</th>
              <th className="text-left px-5 py-3 font-medium">Price</th>
              <th className="text-left px-5 py-3 font-medium">Type</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Featured</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div>
                    <p className="font-medium text-[#0c2749]">{p.title}</p>
                    <p className="text-gray-400 text-xs">{p.location}</p>
                  </div>
                </td>
                <td className="px-5 py-3 text-blue-600 font-semibold">{formatPrice(p.price, p.currency)}</td>
                <td className="px-5 py-3 text-gray-600">{p.property_type}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    p.status === 'active' ? 'bg-green-100 text-green-700' :
                    p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  {p.featured && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/admin/properties/${p.id}`}
                      className="p-2 hover:bg-blue-50 rounded-lg text-[#0c2749] transition-colors"
                    >
                      ✏️
                    </Link>
                    <DeleteButton id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {properties.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="mb-3">No properties yet</p>
            <Link href="/admin/properties/new" className="text-[#0c2749] font-medium hover:underline">
              Add your first property →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
