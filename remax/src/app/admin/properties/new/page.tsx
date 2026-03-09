import PropertyForm from '@/components/ui/PropertyForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewPropertyPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/admin/properties" className="text-gray-400 hover:text-[#0c2749] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-2xl font-bold text-[#0c2749]">Add New Property</h1>
      </div>
      <p className="text-gray-500 text-sm mb-8 ml-8">Fill in the details for the new property listing</p>
      <PropertyForm />
    </div>
  )
}
