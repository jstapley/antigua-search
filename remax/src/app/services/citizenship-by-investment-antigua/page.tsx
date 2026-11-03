import { Metadata } from 'next'
import { getServiceSupabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { Bed, Bath, Square, MapPin } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Citizenship by Investment in Antigua',
  description: 'Obtain Antigua & Barbuda citizenship through real estate investment. RE/MAX 365 guides you through the CBI programme — qualifying properties, costs, and process.',
  keywords: [
    'citizenship by investment Antigua',
    'Antigua CBI programme',
    'Antigua passport investment',
    'real estate citizenship Antigua',
    'Antigua Barbuda citizenship',
    'RE/MAX 365 Antigua',
  ],
  alternates: {
    canonical: 'https://www.remax-365-antigua.com/services/citizenship-by-investment-antigua',
  },
  openGraph: {
    title: 'Citizenship by Investment in Antigua | RE/MAX 365 Antigua',
    description: 'Obtain Antigua & Barbuda citizenship through qualifying real estate investment.',
    url: 'https://www.remax-365-antigua.com/services/citizenship-by-investment-antigua',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'RE/MAX 365 Antigua — Real Estate' }],
  },
}

interface Property {
  id: string
  title: string
  slug: string
  price: number
  currency: string
  property_type: string
  bedrooms: number | null
  bathrooms: number | null
  sqft: number | null
  location: string
  images: string[]
  short_description: string | null
}

async function getCBIProperties(): Promise<Property[]> {
  const db = getServiceSupabase()
  const { data, error } = await db
    .from('properties')
    .select('id, title, slug, price, currency, property_type, bedrooms, bathrooms, sqft, location, images, short_description')
    .eq('cbi_eligible', true)
    .eq('status', 'active')
    .order('price', { ascending: false })
  if (error) return []
  return data as Property[]
}

export default async function CBIPage() {
  const cbiProperties = await getCBIProperties()

  return (
    <div className="pt-20 pb-20">

      {/* ── Hero ── */}
      <div className="bg-navy-700 py-16 text-center text-white mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Citizenship by Investment (CBI) in Antigua & Barbuda</h1>
        <p className="text-gray-300">Obtain a second passport through qualifying real estate investment</p>
      </div>

      {/* ── Content + Video ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Video */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
            <iframe src="https://www.youtube.com/embed/huZvG23zBEE?si=JwRKwZWkKjsM7Gg8"
              title="Citizenship by Investment Antigua" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen className="absolute inset-0 w-full h-full" />
          </div>

          {/* Content */}
          <div className="space-y-5 text-gray-700">
            <p className="leading-relaxed">
              Antigua & Barbuda's CBI program offers a pathway to second citizenship through an approved real estate purchase. The minimum property investment is <strong>US $300,000</strong>. In addition, applicants pay government, due diligence, and legal fees. If you're buying a home in Antigua, check to see if it qualifies for Citizenship by Investment.
            </p>
            <div>
              <p className="font-semibold text-navy-700 mb-2">Typical associated costs (excluding investment):</p>
              <ul className="space-y-1.5 text-sm">
                <li>— US $30,000+ government fees (family of 4)</li>
                <li>— US $7,500 due diligence – main applicant</li>
                <li>— US $7,500 due diligence – spouse</li>
                <li>— US $2,000 per child under 18 (higher for adult dependents)</li>
                <li>— Legal and processing fees</li>
              </ul>
            </div>
            <p className="text-sm text-gray-500">
              Total associated costs: usually <strong>US $50,000–70,000</strong>, depending on family size.
            </p>
            <p className="leading-relaxed text-sm italic text-gray-500">
              And at the end of it all — you'll not only own a piece of paradise, but you'll also get a passport that pairs perfectly with flip-flops and island sunsets.
            </p>
            <Link href="/contact"
              className="inline-block bg-[#0c2749] hover:bg-[#0a1f3a] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
              Speak to an Agent
            </Link>
          </div>
        </div>
      </div>

      {/* ── CBI Qualifying Properties ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-navy-700 text-center mb-3">CBI Qualifying Properties</h2>
        <p className="text-gray-500 text-center mb-10">
          These approved developments qualify for the Antigua & Barbuda Citizenship by Investment Programme.
        </p>
        {cbiProperties.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">No CBI properties listed at this time. <Link href="/contact" className="text-[#0c2749] font-semibold hover:underline">Contact us</Link> to learn about available opportunities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cbiProperties.map(property => (
              <Link key={property.id} href={`/properties/${property.slug}`}
                className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-52 bg-gray-100">
                  {property.images?.[0] ? (
                    <Image
                      src={property.images[0]}
                      alt={`${property.title} — CBI qualifying property in Antigua`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-amber-400 text-[#0c2749] text-xs font-bold px-2.5 py-1 rounded-full">
                      CBI Eligible
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[#0c2749] mb-1 group-hover:underline">{property.title}</h3>
                  <p className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                    <MapPin size={11} /> {property.location}
                  </p>
                  {property.short_description && (
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{property.short_description}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                    {property.bedrooms && <span className="flex items-center gap-1"><Bed size={12} /> {property.bedrooms} bed</span>}
                    {property.bathrooms && <span className="flex items-center gap-1"><Bath size={12} /> {property.bathrooms} bath</span>}
                    {property.sqft && <span className="flex items-center gap-1"><Square size={12} /> {property.sqft.toLocaleString()} sqft</span>}
                  </div>
                  <p className="text-blue-600 font-bold">{formatPrice(property.price, property.currency)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link href="/contact"
            className="inline-block bg-[#0c2749] hover:bg-[#0a1f3a] text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-colors">
            Enquire About CBI Properties
          </Link>
        </div>
      </div>

    </div>
  )
}