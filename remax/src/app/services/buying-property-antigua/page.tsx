import { Metadata } from 'next'
import Link from 'next/link'
import FeaturedPropertiesSection from '@/components/sections/FeaturedPropertiesSection'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Buying a Property in Antigua',
  description: 'Thinking of buying a property in Antigua? RE/MAX 365 guides you through buying a house or home in Antigua & Barbuda — costs, process, legal steps and more.',
  keywords: [
    'buying a property in Antigua',
    'buying a house in Antigua',
    'buying a home in Antigua',
    'Antigua real estate',
    'Non-Citizens Landholding Licence',
    'RE/MAX 365 Antigua',
  ],
  alternates: {
    canonical: 'https://www.remax-365-antigua.com/services/buying-property-antigua',
  },
  openGraph: {
    title: 'Buying a Property in Antigua | RE/MAX 365 Antigua',
    description: 'Your complete guide to buying a house or home in Antigua & Barbuda with RE/MAX 365.',
    url: 'https://www.remax-365-antigua.com/services/buying-property-antigua',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'RE/MAX 365 Antigua — Real Estate' }],
  },
}

export default function BuyingPropertyPage() {
  return (
    <div className="pt-20 pb-20">

      {/* ── Hero ── */}
      <div className="bg-navy-700 py-16 text-center text-white mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Buying a House in Antigua & Barbuda</h1>
        <p className="text-gray-300">Your guide to purchasing property in paradise</p>
      </div>

      {/* ── Content + Video ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Video */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.youtube.com/embed/yrl5z2grf-A?si=QHwzU7eBPmGuF_LV"
              title="Buying Property in Antigua"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Content */}
          <div className="space-y-5 text-gray-700">
            <p className="leading-relaxed">
              Buying a home in Antigua is a pretty straightforward process, especially with RE/MAX 365 Antigua guiding the way. Once you and the seller agree on a price, a purchase agreement is drawn up and your Antigua lawyer (we can recommend several trusted ones) will handle the due diligence. If you're not a citizen, you'll need a Non-Citizens Landholding Licence, which usually takes around 3–6 months to get approved, and closing happens right after.
            </p>
            <div>
              <p className="font-semibold text-navy-700 mb-2">Typical buyer costs include:</p>
              <ul className="space-y-1.5 text-sm">
                <li>— 7% Non-Citizens Landholding License fee</li>
                <li>— 2.5% purchaser's stamp duty</li>
                <li>— 1–2% legal and closing fees</li>
                <li>— 0.1–0.5% annually for property tax (based on assessed value)</li>
              </ul>
            </div>
            <p className="leading-relaxed text-sm italic text-gray-500">
              All in all, it's a clear process with predictable costs, and owning a slice of the island comes with the bonus of laid-back breezes and no annual surprises.
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