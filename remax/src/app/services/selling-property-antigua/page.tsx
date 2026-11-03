import { Metadata } from 'next'
import Link from 'next/link'
import FeaturedPropertiesSection from '@/components/sections/FeaturedPropertiesSection'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Selling a Property in Antigua',
  description: 'Looking to sell your property in Antigua? RE/MAX 365 Antigua offers expert guidance, professional marketing, and a network of qualified buyers to get you the best price.',
  keywords: [
    'selling property Antigua',
    'sell house Antigua',
    'real estate agent Antigua',
    'property valuation Antigua',
    'RE/MAX 365 Antigua',
  ],
  alternates: {
    canonical: 'https://www.remax-365-antigua.com/services/selling-property-antigua',
  },
  openGraph: {
    title: 'Selling a Property in Antigua | RE/MAX 365 Antigua',
    description: 'Expert guidance to sell your property in Antigua & Barbuda with RE/MAX 365.',
    url: 'https://www.remax-365-antigua.com/services/selling-property-antigua',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'RE/MAX 365 Antigua — Real Estate' }],
  },
}

export default function SellingPropertyPage() {
  return (
    <div className="pt-20 pb-20">

      {/* ── Hero ── */}
      <div className="bg-navy-700 py-16 text-center text-white mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Selling a House in Antigua & Barbuda</h1>
        <p className="text-gray-300">Let RE/MAX 365 Antigua guide you through every step</p>
      </div>

      {/* ── Content + Video ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Video */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.youtube.com/embed/99xrhjqrE8k?si=k3IPbdyDKRMyn2Vg"
              title="Selling Property in Antigua"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Content */}
          <div className="space-y-5 text-gray-700">
            <p className="leading-relaxed">
              Selling your property in Antigua doesn't have to be complicated. With RE/MAX 365 Antigua, the process is clear and handled step by step. Your trusted agent will create your marketing materials, showcase your home, manage all viewings, and negotiate offers on your behalf. Once you've accepted an offer, your lawyer (we can recommend several excellent options if needed) prepares the sale agreement and manages the paperwork. The transaction typically moves forward in tandem with the buyer's Non-Citizens Landholding License, which usually takes 3–6 months to process before the sale closes and you receive your funds.
            </p>
            <div>
              <p className="font-semibold text-navy-700 mb-2">When selling, your main costs are:</p>
              <ul className="space-y-1.5 text-sm">
                <li>— 7.5% government transfer tax</li>
                <li>— 1–2% legal fees</li>
                <li>— 5% agent commission (standard in Antigua)</li>
                <li>— ** 5% capital gains tax — only applies to non-citizens on profit made from the sale</li>
              </ul>
            </div>
            <p className="leading-relaxed text-sm italic text-gray-500">
              And that's it — no extra hidden charges. Once the paperwork is complete, the transfer is finalized, and you walk away with funds in hand.
            </p>
            <Link href="/contact"
              className="inline-block bg-[#0c2749] hover:bg-[#0a1f3a] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
              Speak to an Agent
            </Link>
          </div>
        </div>
      </div>

      {/* ── Featured Properties ── */}
      <FeaturedPropertiesSection />

    </div>
  )
}