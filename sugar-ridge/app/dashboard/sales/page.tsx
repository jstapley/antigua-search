import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import type { Sale } from '@/types'
import AddSaleButton from './AddSaleButton'

export default async function SalesPage() {
  const supabase = await createClient()

  const [salesRes, propertiesRes] = await Promise.all([
    supabase.from('sales').select('*').order('sold_at', { ascending: false }),
    supabase.from('properties').select('id, name, type').order('name'),
  ])

  const sales: Sale[] = salesRes.data ?? []
  const properties = propertiesRes.data ?? []

  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.sale_price), 0)
  const avgPrice = sales.length > 0 ? totalRevenue / sales.length : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl text-[#19130b]">Sales</h1>
          <p className="text-gray-500 text-sm mt-1">{sales.length} completed sales</p>
        </div>
        <AddSaleButton properties={properties} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#3d0000] text-white rounded-xl p-5">
          <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Total Revenue</p>
          <p className="font-serif text-2xl font-bold text-[#7BC9BF]">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e8dfd0] p-5">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Units Sold</p>
          <p className="font-serif text-2xl font-bold text-[#19130b]">{sales.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e8dfd0] p-5">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Avg. Sale Price</p>
          <p className="font-serif text-2xl font-bold text-[#19130b]">{formatPrice(avgPrice)}</p>
        </div>
      </div>

      {/* Sales table */}
      <div className="bg-white rounded-xl border border-[#e8dfd0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f8f5f0] border-b border-[#e8dfd0]">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Property</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Type</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Sale Price</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">List Price</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Sold Date</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Buyer</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Notes</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="border-b border-[#e8dfd0] last:border-0 hover:bg-[#f8f5f0]/50">
                  <td className="px-5 py-3 font-medium text-[#19130b]">{sale.property_name}</td>
                  <td className="px-5 py-3 text-gray-500 capitalize">{sale.property_type}</td>
                  <td className="px-5 py-3 font-bold text-[#3d0000]">{formatPrice(sale.sale_price)}</td>
                  <td className="px-5 py-3 text-gray-500">{sale.list_price ? formatPrice(sale.list_price) : '—'}</td>
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(sale.sold_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{sale.buyer_name ?? '—'}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs max-w-xs">
                    <p className="line-clamp-2">{sale.notes ?? '—'}</p>
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                    No sales recorded yet. Use the button above to add a sale.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
