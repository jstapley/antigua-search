import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Bed, Bath, Square, Maximize2, MapPin, Phone, Calendar, Mail } from 'lucide-react'
import { supabase, getServiceSupabase } from '@/lib/supabase'
import { Property } from '@/types'
import { formatPrice, formatNumber } from '@/lib/utils'
import ImageSlider from '@/components/ui/ImageSlider'
import { EnquiryButton } from '@/components/ui/PropertyTracker'

export const revalidate = 0

interface Props { params: { slug: string } }

interface Agent {
  id: string
  name: string
  email: string
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  under_offer: 'Under Offer',
  under_contract: 'Under Contract',
  sold: 'Sold',
}

const STATUS_BADGE: Record<string, string> = {
  under_offer: 'bg-yellow-100 text-yellow-700',
  under_contract: 'bg-orange-100 text-orange-700',
  sold: 'bg-red-100 text-red-600',
}

const STATUS_TEXT: Record<string, string> = {
  active: 'text-green-600',
  under_offer: 'text-yellow-600',
  under_contract: 'text-orange-600',
  sold: 'text-red-500',
}

// Agent photos stored in Supabase
const AGENT_PHOTOS: Record<string, string> = {
  'michelglass@remax-365-antigua.com': 'https://yhblxzdydirndlprmnan.supabase.co/storage/v1/object/public/media/Michel-scaled.jpg',
  'luka@remax-365-antigua.com': 'https://yhblxzdydirndlprmnan.supabase.co/storage/v1/object/public/media/luka-bruschi.jpeg',
  'ron@remax-365-antigua.com': 'https://yhblxzdydirndlprmnan.supabase.co/storage/v1/object/public/media/ron.webp',
}

const AGENT_PHONES: Record<string, string> = {
  'michelglass@remax-365-antigua.com': '+1 268-724-9308',
  'luka@remax-365-antigua.com': '+1 (268) 717-6720',
  'ron@remax-365-antigua.com': '+1 268-720-4504',
  'Stephanie@remax-365-antigua.com': '+1 570-877-4259',
}

const AGENT_WHATSAPP: Record<string, string> = {
  'michelglass@remax-365-antigua.com': 'https://wa.me/12687249308?text=Hi%20Michel%2C%20I%27m%20interested%20in%20a%20property%20on%20your%20website',
  'luka@remax-365-antigua.com': 'https://wa.me/12687176720?text=Hi%20Luka%2C%20I%27m%20interested%20in%20a%20property%20on%20your%20website',
  'ron@remax-365-antigua.com': 'https://wa.me/12687204505?text=Hello%20I%27m%20interested%20in%20one%20of%20your%20listings',
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function getVideoEmbedUrl(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be')
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : url.split('v=')[1]?.split('&')[0]
    if (videoId) return `https://www.youtube.com/embed/${videoId}`
  }
  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
    if (videoId) return `https://player.vimeo.com/video/${videoId}`
  }
  return url
}

function getSocialEmbedUrl(url: string): string | null {
  if (!url) return null
  if (url.includes('tiktok.com')) {
    const videoId = url.split('/video/')[1]?.split('?')[0]
    if (videoId) return `https://www.tiktok.com/embed/v2/${videoId}`
  }
  if (url.includes('instagram.com/reel') || url.includes('instagram.com/p/')) {
    const shortcode = url.split('/reel/')[1]?.split('/')[0] || url.split('/p/')[1]?.split('/')[0]
    if (shortcode) return `https://www.instagram.com/p/${shortcode}/embed`
  }
  if (url.includes('youtube.com/shorts/') || url.includes('youtu.be/')) {
    const videoId = url.includes('shorts/')
      ? url.split('shorts/')[1]?.split('?')[0]
      : url.split('youtu.be/')[1]?.split('?')[0]
    if (videoId) return `https://www.youtube.com/embed/${videoId}`
  }
  return null
}

async function getProperty(slug: string): Promise<Property | null> {
  const { data, error } = await supabase.from('properties').select('*').eq('slug', slug).single()
  if (error || !data) return null
  return data as Property
}

async function getAgent(agentId: string | null): Promise<Agent | null> {
  if (!agentId) return null
  const db = getServiceSupabase()
  const { data, error } = await db.from('agents').select('id, name, email').eq('id', agentId).single()
  if (error || !data) return null
  return data as Agent
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getProperty(params.slug)
  if (!property) return { title: 'Property Not Found' }
  const isSold = property.status === 'sold'
  return {
    title: `${property.title} — ${property.property_type} for Sale in Antigua`,
    description: property.short_description || property.description.substring(0, 155),
    ...(isSold ? { robots: { index: false, follow: false } } : {}),
    alternates: {
      canonical: `https://www.remax-365-antigua.com/properties/${property.slug}`,
    },
    openGraph: {
      title: `${property.title} | RE/MAX 365 Antigua`,
      description: property.short_description || property.description.substring(0, 155),
      url: `https://www.remax-365-antigua.com/properties/${property.slug}`,
      images: [
        property.images?.[0]
          ? { url: property.images[0], width: 1200, height: 630, alt: property.title }
          : { url: '/og-image.jpg', width: 1200, height: 630, alt: 'RE/MAX 365 Antigua — Real Estate' },
      ],
    },
  }
}

export default async function PropertyPage({ params }: Props) {
  const property = await getProperty(params.slug)
  if (!property) notFound()

  const agent = await getAgent((property as any).agent_id)

  // Fire view event
  try {
    const db = getServiceSupabase()
    await db.from('property_events').insert({
      property_id: property.id,
      property_slug: property.slug,
      event_type: 'view',
    })
  } catch (e) {}

  // Schema markup
  const propertySchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.short_description || property.description.substring(0, 300),
    url: `https://www.remax-365-antigua.com/properties/${property.slug}`,
    ...(property.images?.[0] ? { image: property.images[0] } : {}),
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: property.currency || 'USD',
      availability: property.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.location,
      addressCountry: 'AG',
    },
    ...(property.bedrooms ? { numberOfRooms: property.bedrooms } : {}),
    ...(property.sqft ? { floorSize: { '@type': 'QuantitativeValue', value: property.sqft, unitCode: 'FTK' } } : {}),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.remax-365-antigua.com' },
      { '@type': 'ListItem', position: 2, name: 'Properties', item: 'https://www.remax-365-antigua.com/properties' },
      { '@type': 'ListItem', position: 3, name: property.title, item: `https://www.remax-365-antigua.com/properties/${property.slug}` },
    ],
  }

  const agentPhone = agent ? AGENT_PHONES[agent.email] : null
  const agentWhatsapp = agent ? AGENT_WHATSAPP[agent.email] : null
  const agentPhoto = agent ? AGENT_PHOTOS[agent.email] : null
  const agentInitials = agent ? agent.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'RM'

  return (
    <div className="pt-20 pb-20 bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Title / price / specs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <div className="mb-5">
          <Link href="/properties" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#0c2749] transition-colors">
            ← Back to all properties
          </Link>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-[#0c2749] leading-tight mb-4">
          {property.title}
        </h1>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-3 flex-shrink-0">
            <p className="text-blue-600 font-bold text-3xl">{formatPrice(property.price, property.currency)}</p>
            {property.status !== 'active' && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${STATUS_BADGE[property.status] || 'bg-gray-100 text-gray-600'}`}>
                {STATUS_LABELS[property.status] || property.status}
              </span>
            )}
          </div>
          {(property.bedrooms || property.bathrooms || property.sqft || property.lot_sqft) && (
            <div className="flex-1 flex items-stretch divide-x divide-gray-200 bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
              {property.bedrooms != null && property.bedrooms > 0 && (
                <div className="flex flex-1 items-center justify-center gap-2 px-4 py-3">
                  <Bed size={17} className="text-[#0c2749] flex-shrink-0" />
                  <div><p className="font-bold text-[#0c2749] text-sm leading-none">{property.bedrooms}</p><p className="text-gray-400 text-xs mt-0.5">Beds</p></div>
                </div>
              )}
              {property.bathrooms != null && property.bathrooms > 0 && (
                <div className="flex flex-1 items-center justify-center gap-2 px-4 py-3">
                  <Bath size={17} className="text-[#0c2749] flex-shrink-0" />
                  <div><p className="font-bold text-[#0c2749] text-sm leading-none">{property.bathrooms}</p><p className="text-gray-400 text-xs mt-0.5">Baths</p></div>
                </div>
              )}
              {property.sqft != null && property.sqft > 0 && (
                <div className="flex flex-1 items-center justify-center gap-2 px-4 py-3">
                  <Square size={17} className="text-[#0c2749] flex-shrink-0" />
                  <div><p className="font-bold text-[#0c2749] text-sm leading-none">{formatNumber(property.sqft)}</p><p className="text-gray-400 text-xs mt-0.5">Interior sqft</p></div>
                </div>
              )}
              {property.lot_sqft != null && property.lot_sqft > 0 && (
                <div className="flex flex-1 items-center justify-center gap-2 px-4 py-3">
                  <Maximize2 size={17} className="text-[#0c2749] flex-shrink-0" />
                  <div><p className="font-bold text-[#0c2749] text-sm leading-none">{formatNumber(property.lot_sqft)}</p><p className="text-gray-400 text-xs mt-0.5">Lot sqft</p></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {property.images?.length > 0 && <ImageSlider images={property.images} title={property.title} />}

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
                      <span className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" />{a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(property.video_url || (property as any).tiktok_url) && (
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0c2749] mb-4">Property Video</h2>
                {property.video_url && (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md">
                    <iframe src={getVideoEmbedUrl(property.video_url)} title={`${property.title} video`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen className="absolute inset-0 w-full h-full" />
                  </div>
                )}
                {(property as any).tiktok_url && getSocialEmbedUrl((property as any).tiktok_url) && (
                  <div className="relative mx-auto rounded-2xl overflow-hidden shadow-md" style={{ width: '320px', aspectRatio: '9/16' }}>
                    <iframe src={getSocialEmbedUrl((property as any).tiktok_url)!}
                      title={`${property.title} video`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen className="absolute inset-0 w-full h-full" />
                  </div>
                )}
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
                <p className="text-gray-400 text-xs mt-2 flex items-center gap-1"><MapPin size={11} /> {property.location}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">

              {/* Enquiry card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
                <h3 className="font-display text-xl font-bold text-[#0c2749] mb-1">Interested in this property?</h3>
                <p className="text-gray-500 text-sm mb-5">Contact us for more information or to schedule a viewing.</p>
                <EnquiryButton
                  propertyId={property.id}
                  propertySlug={property.slug}
                  href={`/contact?property=${property.slug}&title=${encodeURIComponent(property.title)}`}>
                  Send Enquiry
                </EnquiryButton>
                <Link href="/contact/schedule"
                  className="mt-3 flex items-center justify-center gap-2 w-full border-2 border-amber-400 text-amber-600 hover:bg-amber-400 hover:text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                  <Calendar size={15} /> Schedule a Call
                </Link>
                <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-center gap-2">
                  <Phone size={15} className="text-[#0c2749]" />
                  <a href="tel:+12687249308" className="text-[#0c2749] font-semibold hover:text-blue-600 transition-colors text-sm">+1 268-724-9308</a>
                </div>
              </div>

              {/* Agent card */}
              {agent && (
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Listed by</p>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0">
                      {agentPhoto ? (
                        <Image src={agentPhoto} alt={agent.name} fill className="object-cover object-top" />
                      ) : (
                        <div className="w-full h-full bg-[#0c2749] flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{agentInitials}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0c2749]">{agent.name}</p>
                      <p className="text-gray-400 text-xs">RE/MAX 365 Antigua</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {agentPhone && (
                      <a href={`tel:${agentPhone.replace(/\D/g, '')}`}
                        className="flex items-center gap-2 text-gray-600 hover:text-[#0c2749] text-sm transition-colors">
                        <Phone size={13} className="text-[#0c2749] flex-shrink-0" /> {agentPhone}
                      </a>
                    )}
                    <a href={`mailto:${agent.email}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-[#0c2749] text-sm transition-colors truncate">
                      <Mail size={13} className="text-[#0c2749] flex-shrink-0" /> {agent.email}
                    </a>
                    {agentWhatsapp && (
                      <a href={agentWhatsapp} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-2.5 rounded-xl font-semibold text-xs transition-colors mt-3">
                        <WhatsAppIcon /> WhatsApp {agent.name.split(' ')[0]}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Property summary */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <h4 className="font-semibold text-[#0c2749] text-sm mb-3">Property Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type</span>
                    <span className="font-medium text-gray-800">{property.property_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className={`font-medium ${STATUS_TEXT[property.status] || 'text-gray-600'}`}>
                      {STATUS_LABELS[property.status] || property.status}
                    </span>
                  </div>
                  {property.bedrooms != null && property.bedrooms > 0 && (
                    <div className="flex justify-between"><span className="text-gray-500">Bedrooms</span><span className="font-medium text-gray-800">{property.bedrooms}</span></div>
                  )}
                  {property.bathrooms != null && property.bathrooms > 0 && (
                    <div className="flex justify-between"><span className="text-gray-500">Bathrooms</span><span className="font-medium text-gray-800">{property.bathrooms}</span></div>
                  )}
                  {property.sqft != null && property.sqft > 0 && (
                    <div className="flex justify-between"><span className="text-gray-500">Interior</span><span className="font-medium text-gray-800">{formatNumber(property.sqft)} sqft</span></div>
                  )}
                  {property.lot_sqft != null && property.lot_sqft > 0 && (
                    <div className="flex justify-between"><span className="text-gray-500">Lot size</span><span className="font-medium text-gray-800">{formatNumber(property.lot_sqft)} sqft</span></div>
                  )}
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