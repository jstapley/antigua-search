'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts'
import { Clock, TrendingDown, TrendingUp, Target, AlertCircle, CheckCircle } from 'lucide-react'

interface MonthlyDataPoint {
  key: string
  label: string
  sold: number
  revenue: number
  listed: number
}

interface ActiveListing {
  name: string
  type: string
  daysActive: number
  listed_at: string
}

interface Props {
  avgDOM: number | null
  minDOM: number | null
  maxDOM: number | null
  totalProperties: number
  soldCount: number
  remainingCount: number
  targetMonths: number
  targetStartDate: string
  targetEndDate: string | null
  monthsElapsed: number
  monthsRemaining: number
  requiredMonthlyPace: number
  projectedMonthsToSell: number | null
  monthlyData: MonthlyDataPoint[]
  avgDOMByType: { type: string; avg: number | null; count: number }[]
  activeListings: ActiveListing[]
}

const BURGUNDY = '#3d0000'
const TEAL = '#7BC9BF'
const SAND = '#e8dfd0'

// Parse YYYY-MM-DD strings at local noon to avoid UTC-to-local rollback
function parseDate(s: string) {
  return new Date(s + 'T12:00:00')
}

function fmtMonth(s: string) {
  return parseDate(s).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function MetricsClient({
  avgDOM, minDOM, maxDOM,
  totalProperties, soldCount, remainingCount,
  targetMonths, targetStartDate, targetEndDate, monthsElapsed, monthsRemaining,
  requiredMonthlyPace, projectedMonthsToSell,
  monthlyData, avgDOMByType, activeListings,
}: Props) {

  const progressPct = Math.min(100, Math.round((soldCount / totalProperties) * 100))
  const onTrack = projectedMonthsToSell !== null && projectedMonthsToSell <= monthsRemaining

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white border border-[#e8dfd0] rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold text-[#19130b] mb-2">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {p.name === 'Revenue' ? fmt(p.value) : p.value}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl text-[#19130b]">Metrics</h1>
        <p className="text-gray-500 text-sm mt-1">Sales performance, days on market, and 30-month sell-through target</p>
      </div>

      {/* ── Days on Market KPIs ─────────────────────────────────────────── */}
      <section>
        <h2 className="font-semibold text-[#19130b] mb-3 flex items-center gap-2">
          <Clock size={16} className="text-[#3d0000]" /> Days on Market
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Kpi label="Average DOM" value={avgDOM !== null ? `${avgDOM} days` : '—'} sub="Across all sold properties" />
          <Kpi label="Fastest Sale" value={minDOM !== null ? `${minDOM} days` : '—'} sub="Shortest time to sell" />
          <Kpi label="Longest Sale" value={maxDOM !== null ? `${maxDOM} days` : '—'} sub="Longest time to sell" />
        </div>
      </section>

      {/* ── DOM by type ─────────────────────────────────────────────────── */}
      {avgDOMByType.some(d => d.avg !== null) && (
        <section>
          <h2 className="font-semibold text-[#19130b] mb-3">Average DOM by Property Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {avgDOMByType.map(({ type, avg, count }) => (
              <div key={type} className="bg-white rounded-xl border border-[#e8dfd0] p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 capitalize">{type}s</p>
                <p className="font-serif text-2xl font-bold text-[#19130b]">
                  {avg !== null ? `${avg} days` : '—'}
                </p>
                <p className="text-xs text-gray-400 mt-1">{count} {count === 1 ? 'sale' : 'sales'} recorded</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 30-month target ─────────────────────────────────────────────── */}
      <section>
        <h2 className="font-semibold text-[#19130b] mb-3 flex items-center gap-2">
          <Target size={16} className="text-[#3d0000]" /> 30-Month Sell-Through Target
        </h2>
        <div className="bg-white rounded-xl border border-[#e8dfd0] p-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 mb-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Properties</p>
              <p className="font-serif text-2xl font-bold text-[#19130b]">{totalProperties}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Sold</p>
              <p className="font-serif text-2xl font-bold text-emerald-600">{soldCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Remaining</p>
              <p className="font-serif text-2xl font-bold text-[#3d0000]">{remainingCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Target Start</p>
              <p className="font-serif text-lg font-bold text-[#19130b]">
                {fmtMonth(targetStartDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Target End</p>
              <p className="font-serif text-lg font-bold text-[#19130b]">
                {targetEndDate ? fmtMonth(targetEndDate) : '—'}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>{soldCount} sold ({progressPct}%)</span>
              <span>{totalProperties} total</span>
            </div>
            <div className="h-3 bg-[#e8dfd0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3d0000] rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Time progress */}
          {targetEndDate && (
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>{monthsElapsed} months elapsed</span>
                <span>{targetMonths} month target</span>
              </div>
              <div className="h-2 bg-[#e8dfd0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7BC9BF] rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.round((monthsElapsed / targetMonths) * 100))}%` }}
                />
              </div>
            </div>
          )}

          {/* Pace analysis */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#f8f5f0] rounded-lg p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Required Pace</p>
              <p className="font-serif text-xl font-bold text-[#19130b]">
                {requiredMonthlyPace > 0 ? `${requiredMonthlyPace.toFixed(1)}/mo` : '—'}
              </p>
              <p className="text-xs text-gray-400">to hit 30-month target</p>
            </div>
            <div className="bg-[#f8f5f0] rounded-lg p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Projected Completion</p>
              <p className="font-serif text-xl font-bold text-[#19130b]">
                {projectedMonthsToSell !== null
                  ? projectedMonthsToSell === 0
                    ? 'Complete'
                    : `${projectedMonthsToSell} more months`
                  : '—'}
              </p>
              <p className="text-xs text-gray-400">at current pace</p>
            </div>
            <div className={`rounded-lg p-4 flex items-center gap-3 ${onTrack ? 'bg-emerald-50' : 'bg-amber-50'}`}>
              {onTrack
                ? <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                : <AlertCircle size={20} className="text-amber-500 shrink-0" />}
              <div>
                <p className={`font-semibold text-sm ${onTrack ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {onTrack ? 'On Track' : 'Behind Target'}
                </p>
                <p className="text-xs text-gray-500">
                  {monthsRemaining} months remaining
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Monthly sales chart ──────────────────────────────────────────── */}
      <section>
        <h2 className="font-semibold text-[#19130b] mb-3 flex items-center gap-2">
          <TrendingUp size={16} className="text-[#3d0000]" /> Month-to-Month Sales Activity
        </h2>
        <div className="bg-white rounded-xl border border-[#e8dfd0] p-6">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={SAND} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                interval={2}
              />
              <YAxis
                yAxisId="count"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={24}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
                formatter={(value) => <span className="text-gray-500">{value}</span>}
              />
              <ReferenceLine
                yAxisId="count"
                y={Math.ceil(requiredMonthlyPace)}
                stroke="#f59e0b"
                strokeDasharray="5 3"
                label={{ value: 'Target pace', position: 'insideTopRight', fontSize: 11, fill: '#f59e0b' }}
              />
              <Bar yAxisId="count" dataKey="sold" name="Properties Sold" fill={BURGUNDY} radius={[3, 3, 0, 0]} maxBarSize={40} />
              <Bar yAxisId="count" dataKey="listed" name="Properties Listed" fill={TEAL} radius={[3, 3, 0, 0]} maxBarSize={40} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 text-center mt-2">Last 24 months · Dashed line = required monthly pace to hit 30-month target</p>
        </div>
      </section>

      {/* ── Monthly revenue chart ────────────────────────────────────────── */}
      <section>
        <h2 className="font-semibold text-[#19130b] mb-3 flex items-center gap-2">
          <TrendingDown size={16} className="text-[#3d0000]" /> Monthly Revenue
        </h2>
        <div className="bg-white rounded-xl border border-[#e8dfd0] p-6">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={SAND} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                interval={2}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`}
                width={52}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue" fill={TEAL} radius={[3, 3, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── Active listings — days on market ─────────────────────────────── */}
      {activeListings.length > 0 && (
        <section>
          <h2 className="font-semibold text-[#19130b] mb-3 flex items-center gap-2">
            <Clock size={16} className="text-[#3d0000]" /> Active Listings — Current Days on Market
          </h2>
          <div className="bg-white rounded-xl border border-[#e8dfd0] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f8f5f0] border-b border-[#e8dfd0]">
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Property</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Type</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Listed</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Days Active</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {activeListings.map((l) => {
                  const warn = l.daysActive > 365
                  return (
                    <tr key={l.name} className="border-b border-[#e8dfd0] last:border-0">
                      <td className="px-5 py-3 font-medium text-[#19130b]">{l.name}</td>
                      <td className="px-5 py-3 text-gray-500 capitalize">{l.type}</td>
                      <td className="px-5 py-3 text-gray-500">
                        {parseDate(l.listed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`font-semibold ${warn ? 'text-amber-600' : 'text-[#19130b]'}`}>
                          {l.daysActive} days
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {warn && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                            Long-listed
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

function Kpi({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#e8dfd0] p-5">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="font-serif text-2xl font-bold text-[#19130b]">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  )
}
