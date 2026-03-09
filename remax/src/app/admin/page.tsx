import Link from 'next/link'
import { Building2, Plus } from 'lucide-react'
import { getServiceSupabase } from '@/lib/supabase'

export const revalidate = 0  // never cache this page

async function getStats() {
  const supabase = getServiceSupabase()
  const { count: total } = await supabase.from('properties').select('*', { count: 'exact', head: true })
  const { count: active } = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'active')
  const { count: featured } = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('featured', true)
  return { total: total || 0, active: active || 0, featured: featured || 0 }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0c2749]">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back to RE/MAX 365 Admin</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 bg-[#0c2749] hover:bg-[#0a1f3a] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
        >
          <Plus size={16} /> Add Property
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Total Properties</p>
          <p className="text-3xl font-bold bg-blue-50 text-blue-700 rounded-lg inline-block px-3 py-0.5">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Active Listings</p>
          <p className="text-3xl font-bold bg-green-50 text-green-700 rounded-lg inline-block px-3 py-0.5">{stats.active}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Featured</p>
          <p className="text-3xl font-bold bg-amber-50 text-amber-600 rounded-lg inline-block px-3 py-0.5">{stats.featured}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h2 className="font-semibold text-[#0c2749] mb-4">Quick Actions</h2>
        <div className="flex gap-3">
          <Link href="/admin/properties" className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm hover:border-[#0c2749] transition-colors">
            <Building2 size={15} /> Manage Properties
          </Link>
          <Link href="/" target="_blank" className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm hover:border-[#0c2749] transition-colors">
            View Live Site ↗
          </Link>
        </div>
      </div>
    </div>
  )
}
