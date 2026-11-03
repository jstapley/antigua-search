'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ClientForm from '@/components/ui/ClientForm'

export default function EditClientPage() {
  const { id } = useParams<{ id: string }>()
  const [client, setClient] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/clients/${id}`)
      .then(r => {
        if (!r.ok) { setNotFound(true); return null }
        return r.json()
      })
      .then(data => {
        if (data) setClient(data)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin/clients" className="text-gray-400 hover:text-[#0c2749] transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="h-7 w-48 bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <div className="max-w-2xl space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-40 animate-pulse" />
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-64 animate-pulse" />
        </div>
      </div>
    )
  }

  if (notFound || !client) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p className="mb-3">Client not found.</p>
        <Link href="/admin/clients" className="text-[#0c2749] font-medium hover:underline text-sm">
          ← Back to Clients
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/admin/clients" className="text-gray-400 hover:text-[#0c2749] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-2xl font-bold text-[#0c2749]">Edit Client</h1>
      </div>
      <p className="text-gray-500 text-sm mb-8 ml-8">{client.name as string}</p>
      <ClientForm client={client as unknown as Parameters<typeof ClientForm>[0]['client']} />
    </div>
  )
}
