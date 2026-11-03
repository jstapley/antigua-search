import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ClientForm from '@/components/ui/ClientForm'

export default function NewClientPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/admin/clients" className="text-gray-400 hover:text-[#0c2749] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-2xl font-bold text-[#0c2749]">Add Client</h1>
      </div>
      <p className="text-gray-500 text-sm mb-8 ml-8">Manually add a new client to your database.</p>
      <ClientForm />
    </div>
  )
}
