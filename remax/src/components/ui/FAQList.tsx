'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { FAQ } from '@/types'
import { cn } from '@/lib/utils'

function FAQItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-navy-700 text-base">{faq.question}</span>
        <ChevronDown
          size={18}
          className={cn('flex-shrink-0 text-gray-400 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div className="pb-5 text-gray-600 leading-relaxed text-sm pr-8">
          {faq.answer}
        </div>
      )}
    </div>
  )
}

export default function FAQList({ faqs }: { faqs: FAQ[] }) {
  return (
    <div className="divide-y divide-gray-200 border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm">
      {faqs.map((faq) => (
        <FAQItem key={faq.id} faq={faq} />
      ))}
    </div>
  )
}
