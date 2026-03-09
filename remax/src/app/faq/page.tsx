import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { FAQ } from '@/types'
import FAQList from '@/components/ui/FAQList'

export const metadata: Metadata = {
  title: 'FAQ | RE/MAX 365 Antigua',
  description: 'Frequently asked questions about buying and selling property in Antigua.',
}

async function getFAQs(): Promise<FAQ[]> {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('order', { ascending: true })
  if (error) return []
  return data as FAQ[]
}

export default async function FAQPage() {
  const faqs = await getFAQs()

  return (
    <div className="pt-20 pb-20">
      <div className="bg-navy-700 py-16 text-center text-white mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Frequently Asked Questions</h1>
        <p className="text-gray-300">Everything you need to know about buying property in Antigua</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <FAQList faqs={faqs} />
      </div>
    </div>
  )
}
