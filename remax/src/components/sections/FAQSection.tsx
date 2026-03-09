import { supabase } from '@/lib/supabase'
import { FAQ } from '@/types'
import FAQList from '@/components/ui/FAQList'

async function getFAQs(): Promise<FAQ[]> {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching FAQs:', error)
    return []
  }
  return data as FAQ[]
}

export default async function FAQSection({ limit }: { limit?: number }) {
  const faqs = await getFAQs()
  const displayed = limit ? faqs.slice(0, limit) : faqs

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="section-heading">Frequently Asked Questions</h2>
        <p className="text-center text-gray-500 mt-2 mb-3">RE/MAX 365 Antigua</p>
        <div className="section-divider" />
        <FAQList faqs={displayed} />
      </div>
    </section>
  )
}
