'use client'

import Link from 'next/link'

export default function HeroSection() {
  return (
    <>
      {/* Full-width video hero */}
      <div className="w-full pt-16">
        <div className="relative w-full h-[480px] md:h-[580px] overflow-hidden bg-[#0c2749]">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="https://yhblxzdydirndlprmnan.supabase.co/storage/v1/object/public/media/why-buy-in-antigua.jpeg"
          >
            <source
              src="https://yhblxzdydirndlprmnan.supabase.co/storage/v1/object/public/media/remax-365-homepage-23mb.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>

      {/* Below-video headline section */}
      <div className="bg-white py-14 px-4 text-center">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-3">
          Want to Buy a House in Antigua?
        </h1>
        <p className="text-gray-600 text-base md:text-lg mb-2">
          Contact RE/MAX 365 Today - The Most Trusted Name in Real Estate
        </p>
        <p className="text-gray-500 text-sm max-w-2xl mx-auto mb-8 leading-relaxed">
          Our experienced agents specialize in Antigua&apos;s diverse property market, from beachfront
          villas to hillside retreats and rainforest hideaways. Contact us today for personalized
          guidance and exclusive listings that match your dream home vision.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-[#0c2749] hover:bg-[#0a1f3a] text-white px-8 py-3.5 rounded-lg font-semibold text-sm transition-colors duration-200 shadow-sm"
        >
          Contact Us
        </Link>
      </div>
    </>
  )
}
