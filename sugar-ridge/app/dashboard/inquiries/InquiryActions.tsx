'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { InquiryStatus } from '@/types'

interface Props {
  inquiryId: string
  currentStatus: InquiryStatus
}

const nextStatus: Record<InquiryStatus, InquiryStatus | null> = {
  new: 'contacted',
  contacted: 'closed',
  closed: null,
}

const labels: Record<InquiryStatus, string> = {
  new: 'Mark Contacted',
  contacted: 'Mark Closed',
  closed: '',
}

export default function InquiryActions({ inquiryId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const next = nextStatus[currentStatus]

  if (!next) return <span className="text-gray-300 text-xs">—</span>

  async function advance() {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('inquiries').update({ status: next }).eq('id', inquiryId)
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={advance}
      disabled={loading}
      className="text-xs text-[#3d0000] hover:underline disabled:opacity-50"
    >
      {loading ? '...' : labels[currentStatus]}
    </button>
  )
}
