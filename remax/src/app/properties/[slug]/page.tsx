import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Bed, Bath, Square, Maximize2, MapPin, Phone, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Property } from '@/types'
import { formatPrice, formatNumber } from '@/lib/utils'
import ImageSlider from '@/components/ui/ImageSlider'

export const revalidate = 0

interface Props { params: { slug: string } }

async function getProperty(slug: string): Promise<Property | null> {
  const { data, error } = await supabase.from('properties').select('*').eq('slug', slug).single()
  if (error || !data) return null
  return data as Property
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getProperty(params.slug)
  if (!property) return { title: 'Property Not Found' }
  return {
    title: `${property.title} | RE/MAX 365 Antigua`,
    description: property.short_description || property.description.substring(0, 155),
    openGraph: { images: property.images?.[0] ? [property.images[0]] : [] },
  }
}

export default async function PropertyPage({ params }: Props) {
  const property = await getProperty(params.slug)
  if (!property) notFound()

  return (
    <div className="pt-20 pb-20 bg-white">

      {/* ── Title / price / specs — constrained to left 2/3 to avoid dead space ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <div className="mb-5">
          <Link href="/properties" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#0c2749] transition-colors">
            ← Back to all properties
          </Link>
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-[#0c2749] leading-tight mb-4">
          {property.title}
        </h1>

        {/* Price + full-width specs bar */}
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-3 flex-shrink-0">
            <p className="text-blue-600 font-bold text-3xl">
              {formatPrice(property.price, property.currency)}
            </p>
            {property.status !== 'active' && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                property.status === 'sold' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {property.status === 'sold' ? 'Sold' : 'Under Offer'}
              </span>
            )}
          </div>

          {(property.bedrooms || property.bathrooms || property.sqft || property.lot_sqft) && (
            <div className="flex-1 flex items-stretch divide-x divide-gray-200 bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
              {property.bedrooms && (
                <div className="flex flex-1 items-center justify-center gap-2 px-4 py-3">
                  <Bed size={17} className="text-[#0c2749] flex-shrink-0" />
                  <div>
                    <p className="font-bold text-[#0c2749] text-sm leading-none">{property.bedrooms}</p>
                    <p className="text-gray-400 text-xs mt-0.5">Beds</p>
                  </div>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex flex-1 items-center justify-center gap-2 px-4 py-3">
                  <Bath size={17} className="text-[#0c2749] flex-shrink-0" />
                  <div>
                    <p className="font-bold text-[#0c2749] text-sm leading-none">{property.bathrooms}</p>
                    <p className="text-gray-400 text-xs mt-0.5">Baths</p>
                  </div>
                </div>
              )}
              {property.sqft && (
                <div className="flex flex-1 items-center justify-center gap-2 px-4 py-3">
                  <Square size={17} className="text-[#0c2749] flex-shrink-0" />
                  <div>
                    <p className="font-bold text-[#0c2749] text-sm leading-none">{formatNumber(property.sqft)}</p>
                    <p className="text-gray-400 text-xs mt-0.5">Interior sqft</p>
                  </div>
                </div>
              )}
              {property.lot_sqft && (
                <div className="flex flex-1 items-center justify-center gap-2 px-4 py-3">
                  <Maximize2 size={17} className="text-[#0c2749] flex-shrink-0" />
                  <div>
                    <p className="font-bold text-[#0c2749] text-sm leading-none">{formatNumber(property.lot_sqft)}</p>
                    <p className="text-gray-400 text-xs mt-0.5">Lot sqft</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Full-width image slider ── */}
      {property.images?.length > 0 && (
        <ImageSlider images={property.images} title={property.title} />
      )}

      {/* ── Content below slider ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#0c2749] mb-4">Property Description</h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</div>
            </div>

            {property.amenities?.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0c2749] mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-gray-700 text-sm bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.video_url && (
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0c2749] mb-4">Property Video</h2>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md">
                  <iframe src={property.video_url} title={`${property.title} video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen className="absolute inset-0 w-full h-full" />
                </div>
              </div>
            )}

            {property.map_embed && (
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0c2749] mb-4">Location</h2>
                <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-md border border-gray-100">
                  <iframe src={property.map_embed} title={`${property.title} map`}
                    loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full" />
                </div>
                <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
                  <MapPin size={11} /> {property.location}
                </p>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
                <h3 className="font-display text-xl font-bold text-[#0c2749] mb-1">Interested in this property?</h3>
                <p className="text-gray-500 text-sm mb-5">Contact us for more information or to schedule a viewing.</p>
                <Link href={`/contact?property=${property.slug}&title=${encodeURIComponent(property.title)}`}
                  className="flex items-center justify-center gap-2 w-full bg-[#0c2749] hover:bg-[#0a1f3a] text-white py-3 rounded-xl font-semibold text-sm mb-3 transition-colors">
                  Send Enquiry
                </Link>
                <Link href="/contact/schedule"
                  className="flex items-center justify-center gap-2 w-full border-2 border-amber-400 text-amber-600 hover:bg-amber-400 hover:text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                  <Calendar size={15} /> Schedule a Viewing
                </Link>
                <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-center gap-2">
                  <Phone size={15} className="text-[#0c2749]" />
                  <a href="tel:+12687249308" className="text-[#0c2749] font-semibold hover:text-blue-600 transition-colors text-sm">
                    +1 268-724-9308
                  </a>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <h4 className="font-semibold text-[#0c2749] text-sm mb-3">Property Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium text-gray-800">{property.property_type}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Status</span>
                    <span className={`font-medium capitalize ${property.status === 'active' ? 'text-green-600' : property.status === 'sold' ? 'text-red-500' : 'text-yellow-600'}`}>{property.status}</span>
                  </div>
                  {property.bedrooms && <div className="flex justify-between"><span className="text-gray-500">Bedrooms</span><span className="font-medium text-gray-800">{property.bedrooms}</span></div>}
                  {property.bathrooms && <div className="flex justify-between"><span className="text-gray-500">Bathrooms</span><span className="font-medium text-gray-800">{property.bathrooms}</span></div>}
                  {property.sqft && <div className="flex justify-between"><span className="text-gray-500">Interior</span><span className="font-medium text-gray-800">{formatNumber(property.sqft)} sqft</span></div>}
                  {property.lot_sqft && <div className="flex justify-between"><span className="text-gray-500">Lot size</span><span className="font-medium text-gray-800">{formatNumber(property.lot_sqft)} sqft</span></div>}
                  <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                    <span className="text-gray-500">Price</span>
                    <span className="font-bold text-blue-600">{formatPrice(property.price, property.currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
