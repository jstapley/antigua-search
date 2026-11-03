import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Bed, Bath, Maximize, CheckCircle, ArrowLeft, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatSqft } from '@/lib/utils'
import type { Property } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('properties').select('name, description').eq('slug', slug).single()
  if (!data) return { title: 'Villa Not Found' }
  return {
    title: data.name,
    description: data.description ?? undefined,
  }
}

const statusBadge: Record<string, { label: string; className: string }> = {
  available: { label: 'Available', className: 'bg-emerald-100 text-emerald-800' },
  reserved: { label: 'Under Offer', className: 'bg-amber-100 text-amber-800' },
  sold: { label: 'Sold', className: 'bg-gray-100 text-gray-600' },
}

export default async function VillaDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: villa } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .eq('type', 'villa')
    .single()

  if (!villa) notFound()

  const v = villa as Property
  const badge = statusBadge[v.status]

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      {/* Back nav */}
      <div className="bg-[#3d0000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/villas" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back to Villas
          </Link>
        </div>
      </div>

      {/* Image placeholder */}
      <div className="h-80 lg:h-[480px] bg-gradient-to-br from-[#3d0000]/20 to-[#7BC9BF]/30 flex items-center justify-center">
        <p className="text-[#3d0000]/40 font-serif text-xl">Property Photography Coming Soon</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[#7BC9BF] text-sm font-semibold uppercase tracking-wider">Villa</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.className}`}>
                {badge.label}
              </span>
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl text-[#19130b] mb-2">{v.name}</h1>
            {v.completion_date && (
              <p className="text-gray-500 text-sm mb-6">Status: {v.completion_date}</p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-6 py-6 border-y border-[#e8dfd0] mb-8">
              {v.bedrooms && (
                <div className="flex items-center gap-2 text-[#19130b]">
                  <Bed size={20} className="text-[#3d0000]" />
                  <span className="font-semibold">{v.bedrooms}</span>
                  <span className="text-gray-500 text-sm">Bedrooms</span>
                </div>
              )}
              {v.bathrooms && (
                <div className="flex items-center gap-2 text-[#19130b]">
                  <Bath size={20} className="text-[#3d0000]" />
                  <span className="font-semibold">{v.bathrooms}</span>
                  <span className="text-gray-500 text-sm">Bathrooms</span>
                </div>
              )}
              {v.interior_sqft && (
                <div className="flex items-center gap-2 text-[#19130b]">
                  <Maximize size={20} className="text-[#3d0000]" />
                  <span className="font-semibold">{formatSqft(v.interior_sqft)}</span>
                  <span className="text-gray-500 text-sm">Interior</span>
                </div>
              )}
              {v.total_sqft && (
                <div className="text-[#19130b]">
                  <span className="font-semibold">{formatSqft(v.total_sqft)}</span>
                  <span className="text-gray-500 text-sm ml-2">Total (incl. outdoor)</span>
                </div>
              )}
              {v.lot_sqft && (
                <div className="text-[#19130b]">
                  <span className="font-semibold">{formatSqft(v.lot_sqft)}</span>
                  <span className="text-gray-500 text-sm ml-2">Lot</span>
                </div>
              )}
            </div>

            {/* Description */}
            {v.description && (
              <div className="mb-8">
                <h2 className="font-serif text-2xl text-[#19130b] mb-3">About This Property</h2>
                <p className="text-gray-600 leading-relaxed">{v.description}</p>
              </div>
            )}

            {/* Features */}
            {v.features && v.features.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl text-[#19130b] mb-4">Key Features</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {v.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-gray-600">
                      <CheckCircle size={16} className="text-[#7BC9BF] mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e8dfd0] sticky top-24">
              <p className="text-gray-500 text-sm mb-1">Asking Price</p>
              <p className="font-serif text-3xl font-bold text-[#3d0000] mb-6">{formatPrice(v.price)}</p>

              <Link
                href={`/contact?property=${encodeURIComponent(v.name)}`}
                className="block w-full text-center bg-[#3d0000] text-white py-3 rounded font-semibold hover:bg-[#6b0000] transition-colors mb-3"
              >
                Request a Viewing
              </Link>
              <a
                href="tel:+12685627701"
                className="flex items-center justify-center gap-2 w-full border border-[#3d0000] text-[#3d0000] py-3 rounded font-semibold hover:bg-[#3d0000]/5 transition-colors"
              >
                <Phone size={16} />
                +1 (268) 562-7701
              </a>

              <div className="mt-6 pt-6 border-t border-[#e8dfd0] text-xs text-gray-400 text-center">
                Sugar Ridge, Antigua &amp; Barbuda
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
