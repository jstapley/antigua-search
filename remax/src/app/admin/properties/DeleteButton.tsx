'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Delete this property? This cannot be undone.')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      } else {
        alert('Failed to delete property')
      }
    } catch {
      alert('Network error — please try again')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="p-2 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
    >
      <Trash2 size={15} />
    </button>
  )
}
