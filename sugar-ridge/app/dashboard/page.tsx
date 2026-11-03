import { createClient } from '@/lib/supabase/server'
import StatCard from '@/components/dashboard/StatCard'
import { DollarSign, Home, TrendingUp, Building, MapPin, Target } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Property, Sale } from '@/types'

const REVENUE_TARGET = 275_000_000

function typeRevenue(sales: Sale[], type: string) {
  return sales.filter(s => s.property_type === type).reduce((sum, s) => sum + Number(s.sale_price), 0)
}

function typeTarget(props: Property[]) {
  return props.reduce((sum, p) => sum + (p.price ?? 0), 0)
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const [propertiesRes, salesRes] = await Promise.all([
    supabase.from('properties').select('*'),
    supabase.from('sales').select('*').order('sold_at', { ascending: false }),
  ])

  const properties: Property[] = propertiesRes.data ?? []
  const sales: Sale[] = salesRes.data ?? []

  const villas = properties.filter(p => p.type === 'villa')
  const condos = properties.filter(p => p.type === 'condo')
  const lots   = properties.filter(p => p.type === 'lot')

  const soldCount = properties.filter(p => p.status === 'sold').length
  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.sale_price), 0)
  const avgSalePrice = sales.length > 0 ? totalRevenue / sales.length : 0
  const revenueTargetPct = Math.min(100, (totalRevenue / REVENUE_TARGET) * 100)
  const recentSales = sales.slice(0, 5)

  // Per-type revenue metrics
  const villaSales   = typeRevenue(sales, 'villa')
  const condoSales   = typeRevenue(sales, 'condo')
  const lotSales     = typeRevenue(sales, 'lot')
  const villaTarget  = typeTarget(villas)
  const condoTarget  = typeTarget(condos)
  const lotTarget    = typeTarget(lots)

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-[#19130b]">Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Sugar Ridge Homes — Sales & Inventory Dashboard</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Revenue"
          value={formatPrice(totalRevenue)}
          subtext={`${sales.length} completed sales`}
          icon={DollarSign}
          variant="highlight"
        />
        <StatCard
          label="Units Sold"
          value={soldCount}
          subtext="Across all property types"
          icon={TrendingUp}
        />
        <StatCard
          label="Avg. Sale Price"
          value={formatPrice(avgSalePrice)}
          subtext="Across all sales"
          icon={DollarSign}
        />
      </div>

      {/* Revenue Target Widget */}
      <div className="bg-white rounded-xl border border-[#e8dfd0] p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Target size={16} className="text-[#3d0000]" />
          <h2 className="font-semibold text-[#19130b]">Revenue Target</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-5">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Target</p>
            <p className="font-serif text-2xl font-bold text-[#19130b]">{formatPrice(REVENUE_TARGET)}</p>
            <p className="text-xs text-gray-400 mt-1">Total portfolio target</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Collected</p>
            <p className="font-serif text-2xl font-bold text-emerald-600">{formatPrice(totalRevenue)}</p>
            <p className="text-xs text-gray-400 mt-1">From {sales.length} completed sales</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Remaining</p>
            <p className="font-serif text-2xl font-bold text-[#3d0000]">{formatPrice(REVENUE_TARGET - totalRevenue)}</p>
            <p className="text-xs text-gray-400 mt-1">To reach target</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>{revenueTargetPct.toFixed(1)}% of target reached</span>
            <span>{formatPrice(REVENUE_TARGET)}</span>
          </div>
          <div className="h-4 bg-[#e8dfd0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3d0000] rounded-full transition-all"
              style={{ width: `${revenueTargetPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Inventory breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <InventoryCard
          icon={<Building size={18} className="text-[#3d0000]" />}
          label="Villas"
          properties={villas}
          revenueToDate={villaSales}
          revenueTarget={villaTarget}
        />
        <InventoryCard
          icon={<Home size={18} className="text-[#3d0000]" />}
          label="Condos"
          properties={condos}
          revenueToDate={condoSales}
          revenueTarget={condoTarget}
        />
        <InventoryCard
          icon={<MapPin size={18} className="text-[#3d0000]" />}
          label="Lots"
          properties={lots}
          revenueToDate={lotSales}
          revenueTarget={lotTarget}
        />
      </div>

      {/* Recent Sales — full width */}
      <div className="bg-white rounded-xl border border-[#e8dfd0] p-6">
        <h2 className="font-semibold text-[#19130b] mb-4">Recent Sales</h2>
        {recentSales.length > 0 ? (
          <div className="space-y-3">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between py-2.5 border-b border-[#e8dfd0] last:border-0">
                <div>
                  <p className="font-medium text-sm text-[#19130b]">{sale.property_name}</p>
                  <p className="text-xs text-gray-400 capitalize">
                    {sale.property_type} · {new Date(sale.sold_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <span className="font-bold text-[#3d0000] text-sm">{formatPrice(sale.sale_price)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm py-4 text-center">No sales recorded yet.</p>
        )}
      </div>
    </div>
  )
}

function InventoryCard({
  icon, label, properties, revenueToDate, revenueTarget,
}: {
  icon: React.ReactNode
  label: string
  properties: Property[]
  revenueToDate: number
  revenueTarget: number
}) {
  const sold = properties.filter(p => p.status === 'sold').length
  const available = properties.filter(p => p.status === 'available').length
  const underOffer = properties.filter(p => p.status === 'reserved').length
  const soldPct = properties.length > 0 ? Math.round((sold / properties.length) * 100) : 0
  const outstanding = revenueTarget - revenueToDate

  return (
    <div className="bg-white rounded-xl border border-[#e8dfd0] p-5">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h2 className="font-semibold text-[#19130b]">{label}</h2>
      </div>

      {/* Unit counts */}
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Total</span>
          <span className="font-semibold">{properties.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-emerald-600">Available</span>
          <span className="font-semibold text-emerald-600">{available}</span>
        </div>
        {underOffer > 0 && (
          <div className="flex justify-between">
            <span className="text-amber-600">Under Offer</span>
            <span className="font-semibold text-amber-600">{underOffer}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-400">Sold</span>
          <span className="font-semibold">{sold}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-[#e8dfd0] rounded-full h-2 mb-1">
        <div className="bg-[#3d0000] h-2 rounded-full" style={{ width: `${soldPct}%` }} />
      </div>
      <p className="text-xs text-gray-400 mb-4">{soldPct}% sold</p>

      {/* Revenue metrics */}
      <div className="border-t border-[#e8dfd0] pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Revenue Target</span>
          <span className="font-semibold text-[#19130b]">{formatPrice(revenueTarget)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Revenue to Date</span>
          <span className="font-semibold text-emerald-600">{formatPrice(revenueToDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Outstanding</span>
          <span className="font-semibold text-[#3d0000]">{formatPrice(outstanding)}</span>
        </div>
      </div>
    </div>
  )
}
