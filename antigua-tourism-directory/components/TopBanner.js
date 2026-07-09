// components/TopBanner.js
'use client'

import Link from 'next/link'
import { MONTHLY_VISITOR_COUNT } from '@/lib/constants'

export default function TopBanner() {
  return (
    <div className="bg-brand-600 text-white py-3 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <span className="font-semibold">{MONTHLY_VISITOR_COUNT.toLocaleString()} people browsing this month</span>
          </div>
          <Link
            href="/advertise"
            className="text-yellow-300 font-semibold hover:text-yellow-200 transition text-sm md:text-base"
          >
            Own a business? Get premium visibility
          </Link>
        </div>
      </div>
    </div>
  )
}