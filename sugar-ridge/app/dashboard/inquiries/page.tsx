import { createClient } from '@/lib/supabase/server'
import type { Inquiry } from '@/types'
import InquiryActions from './InquiryActions'

const statusStyles: Record<string, string> = {
  new: 'bg-emerald-100 text-emerald-700',
  contacted: 'bg-blue-100 text-blue-700',
  closed: 'bg-gray-100 text-gray-500',
}

export default async function InquiriesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  const inquiries: Inquiry[] = data ?? []
  const newCount = inquiries.filter(i => i.status === 'new').length

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-[#19130b]">Inquiries</h1>
        <p className="text-gray-500 text-sm mt-1">
          {inquiries.length} total · <span className="text-emerald-600 font-medium">{newCount} new</span>
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#e8dfd0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f8f5f0] border-b border-[#e8dfd0]">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Contact</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Property</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Message</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Date</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-[#e8dfd0] last:border-0 hover:bg-[#f8f5f0]/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-[#19130b]">{inquiry.name}</p>
                    <a href={`mailto:${inquiry.email}`} className="text-xs text-gray-400 hover:text-[#3d0000]">
                      {inquiry.email}
                    </a>
                    {inquiry.phone && (
                      <a href={`tel:${inquiry.phone}`} className="block text-xs text-gray-400 hover:text-[#3d0000]">
                        {inquiry.phone}
                      </a>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {inquiry.property_name ?? <span className="text-gray-300">General</span>}
                  </td>
                  <td className="px-5 py-4 text-gray-500 max-w-xs">
                    <p className="line-clamp-2 text-xs">{inquiry.message ?? '—'}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-400 whitespace-nowrap text-xs">
                    {new Date(inquiry.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[inquiry.status]}`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <InquiryActions inquiryId={inquiry.id} currentStatus={inquiry.status} />
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    No inquiries yet. They&apos;ll appear here when visitors submit the contact form.
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
