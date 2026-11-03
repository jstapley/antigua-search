import { createClient } from '@/lib/supabase/server'
import type { Property, Sale } from '@/types'
import MetricsClient from './MetricsClient'

function daysBetween(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24))
}

function monthKey(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(key: string) {
  const [y, m] = key.split('-')
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

export default async function MetricsPage() {
  const supabase = await createClient()

  const [propertiesRes, salesRes] = await Promise.all([
    supabase.from('properties').select('*').order('listed_at', { ascending: true }),
    supabase.from('sales').select('*').order('sold_at', { ascending: true }),
  ])

  const properties: Property[] = propertiesRes.data ?? []
  const sales: Sale[] = salesRes.data ?? []

  // ── Days on market ────────────────────────────────────────────────────────
  const domValues: number[] = []
  for (const sale of sales) {
    const prop = properties.find(p => p.id === sale.property_id || p.name === sale.property_name)
    if (prop?.listed_at) {
      domValues.push(daysBetween(prop.listed_at, sale.sold_at))
    }
  }
  const avgDOM = domValues.length > 0 ? Math.round(domValues.reduce((a, b) => a + b, 0) / domValues.length) : null
  const minDOM = domValues.length > 0 ? Math.min(...domValues) : null
  const maxDOM = domValues.length > 0 ? Math.max(...domValues) : null

  // ── 30-month target ───────────────────────────────────────────────────────
  const TARGET_START = '2026-01-01'
  const TARGET_MONTHS = 30
  const totalProperties = properties.length
  const soldCount = properties.filter(p => p.status === 'sold').length
  const remainingCount = totalProperties - soldCount

  const start = new Date(TARGET_START)
  const targetEndDate = new Date(start.getFullYear(), start.getMonth() + TARGET_MONTHS, start.getDate()).toISOString().slice(0, 10)
  const now = new Date()
  const monthsElapsed = Math.max(0, (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()))
  const monthsRemaining = Math.max(0, TARGET_MONTHS - monthsElapsed)
  const requiredMonthlyPace = monthsRemaining > 0 ? remainingCount / monthsRemaining : remainingCount
  let projectedMonthsToSell: number | null = null

  {
    // Current pace: count sales that occurred on or after the target start date
    const salesInWindow = sales.filter(s => s.sold_at >= TARGET_START)
    const monthsActive = Math.max(1, monthsElapsed)
    if (salesInWindow.length > 0) {
      const actualPace = salesInWindow.length / monthsActive
      projectedMonthsToSell = remainingCount > 0 ? Math.ceil(remainingCount / actualPace) : 0
    }
  }

  // ── Monthly sales bar chart data ──────────────────────────────────────────
  // Build a 24-month window ending today
  const today = new Date()
  const windowStart = new Date(today.getFullYear(), today.getMonth() - 23, 1)

  const monthlyMap: Record<string, { key: string; label: string; sold: number; revenue: number; listed: number }> = {}

  for (let i = 0; i < 24; i++) {
    const d = new Date(windowStart.getFullYear(), windowStart.getMonth() + i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    monthlyMap[key] = { key, label: monthLabel(key), sold: 0, revenue: 0, listed: 0 }
  }

  for (const sale of sales) {
    const key = monthKey(sale.sold_at)
    if (monthlyMap[key]) {
      monthlyMap[key].sold += 1
      monthlyMap[key].revenue += Number(sale.sale_price)
    }
  }

  for (const prop of properties) {
    if (prop.listed_at) {
      const key = monthKey(prop.listed_at)
      if (monthlyMap[key]) {
        monthlyMap[key].listed += 1
      }
    }
  }

  const monthlyData = Object.values(monthlyMap)

  // ── DOM by property type ──────────────────────────────────────────────────
  const domByType: Record<string, number[]> = { villa: [], condo: [], lot: [] }
  for (const sale of sales) {
    const prop = properties.find(p => p.id === sale.property_id || p.name === sale.property_name)
    if (prop?.listed_at && prop.type in domByType) {
      domByType[prop.type].push(daysBetween(prop.listed_at, sale.sold_at))
    }
  }
  const avgDOMByType = Object.entries(domByType).map(([type, vals]) => ({
    type,
    avg: vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null,
    count: vals.length,
  }))

  // ── Currently listed properties (days active) ─────────────────────────────
  const activeListings = properties
    .filter(p => p.status !== 'sold' && p.listed_at)
    .map(p => ({
      name: p.name,
      type: p.type,
      daysActive: daysBetween(p.listed_at!, today.toISOString().slice(0, 10)),
      listed_at: p.listed_at!,
    }))
    .sort((a, b) => b.daysActive - a.daysActive)

  return (
    <MetricsClient
      avgDOM={avgDOM}
      minDOM={minDOM}
      maxDOM={maxDOM}
      totalProperties={totalProperties}
      soldCount={soldCount}
      remainingCount={remainingCount}
      targetMonths={TARGET_MONTHS}
      targetStartDate={TARGET_START}
      targetEndDate={targetEndDate}
      monthsElapsed={monthsElapsed}
      monthsRemaining={monthsRemaining}
      requiredMonthlyPace={requiredMonthlyPace}
      projectedMonthsToSell={projectedMonthsToSell}
      monthlyData={monthlyData}
      avgDOMByType={avgDOMByType}
      activeListings={activeListings}
    />
  )
}
