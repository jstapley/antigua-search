import { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { FAQ } from '@/types'
import FAQList from '@/components/ui/FAQList'

export const metadata: Metadata = {
  title: 'FAQ — Buying & Selling Property in Antigua',
  description: 'Frequently asked questions about buying and selling property in Antigua & Barbuda. Learn about costs, the Non-Citizens Landholding Licence, legal process, and more.',
  keywords: [
    'Antigua real estate FAQ',
    'buying property Antigua questions',
    'Non-Citizens Landholding Licence Antigua',
    'Antigua property costs',
    'how to buy property Antigua',
  ],
  alternates: {
    canonical: 'https://www.remax-365-antigua.com/faq',
  },
  openGraph: {
    title: 'FAQ — Buying & Selling Property in Antigua | RE/MAX 365',
    description: 'Frequently asked questions about buying and selling property in Antigua & Barbuda.',
    url: 'https://www.remax-365-antigua.com/faq',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'RE/MAX 365 Antigua — Real Estate' }],
  },
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

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="pt-20 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="bg-navy-700 py-16 text-center text-white mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Frequently Asked Questions</h1>
        <p className="text-gray-300">Everything you need to know about buying property in Antigua</p>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <FAQList faqs={faqs} />

        {/* CTA */}
        <div className="mt-16 bg-navy-700 rounded-2xl p-8 text-center text-white">
          <h2 className="font-display text-2xl font-bold mb-2">Still have questions?</h2>
          <p className="text-gray-300 text-sm mb-6">Our agents are happy to walk you through the buying process in Antigua.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact"
              className="inline-block bg-white text-navy-700 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
              Contact Us
            </Link>
            <Link href="/properties"
              className="inline-block border-2 border-white text-white hover:bg-white hover:text-navy-700 px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
              Browse Properties
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}