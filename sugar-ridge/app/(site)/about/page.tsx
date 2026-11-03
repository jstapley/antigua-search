import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Sugar Ridge Homes — the story behind Antigua\'s most exclusive luxury residential development.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#19130b] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#7BC9BF] text-sm font-semibold tracking-widest uppercase mb-3">Our Story</p>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold">About Sugar Ridge</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-3xl text-[#19130b] mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                Sugar Ridge was born from a vision to create Antigua&apos;s most distinguished
                residential community — a place where exceptional architecture meets the
                natural splendour of the Caribbean. Set across 43 lush acres on the island&apos;s
                picturesque west coast, every element of Sugar Ridge has been thoughtfully
                designed to harmonise with its breathtaking surroundings.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-3xl text-[#19130b] mb-4">The Development</h2>
              <p className="text-gray-600 leading-relaxed">
                Our community features a curated collection of bespoke villas, a luxury condo
                building, and prime lots for custom homes. Each property is designed by
                award-winning architects with an emphasis on indoor-outdoor living, sustainability,
                and capturing the island&apos;s spectacular sunset views.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-3xl text-[#19130b] mb-4">Our Commitment</h2>
              <p className="text-gray-600 leading-relaxed">
                We are committed to delivering properties of the highest quality, using premium
                materials, sustainable systems, and expert craftsmanship. Our team is dedicated
                to guiding you through every step of the purchase process with transparency
                and care.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                ['43', 'Acres of lush land'],
                ['28', 'Luxury condo units'],
                ['2', 'Bespoke villas'],
                ['150+', 'Countries — CBI access'],
              ].map(([value, label]) => (
                <div key={label} className="bg-[#3d0000] text-white rounded-xl p-6 text-center">
                  <p className="font-serif text-4xl font-bold text-[#7BC9BF] mb-1">{value}</p>
                  <p className="text-white/70 text-sm">{label}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#f8f5f0] rounded-xl p-8">
              <h3 className="font-serif text-xl text-[#19130b] mb-3">Contact Our Team</h3>
              <p className="text-gray-500 text-sm mb-4">
                Our experienced sales team is available to answer your questions and
                arrange private viewings at your convenience.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#3d0000] text-white px-5 py-2.5 rounded font-semibold hover:bg-[#6b0000] transition-colors text-sm"
              >
                Get in Touch <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
