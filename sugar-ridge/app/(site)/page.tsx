import Link from 'next/link'
import { Leaf, Shield, Waves, Sparkles, Mountain, ArrowRight } from 'lucide-react'

const values = [
  { icon: Sparkles, label: 'Quality', desc: 'Premium materials and expert craftsmanship in every detail.' },
  { icon: Mountain, label: 'Elegance', desc: 'Refined architectural design that stands apart.' },
  { icon: Leaf, label: 'Eco-Friendly', desc: 'Sustainable systems including solar and rainwater harvesting.' },
  { icon: Shield, label: 'Secure', desc: 'Fully gated community with controlled access.' },
  { icon: Waves, label: 'Tranquil', desc: 'A peaceful haven above Antigua\'s stunning west coast.' },
]

const propertyCategories = [
  {
    href: '/villas',
    title: 'Villas',
    desc: 'Luxurious, spacious living with breathtaking views and privacy.',
    count: '2 Available',
    bg: 'from-[#3d0000]/80 to-[#3d0000]/40',
  },
  {
    href: '/condos',
    title: 'Condos',
    desc: 'Modern comfort meets exclusive community convenience.',
    count: '28 Units',
    bg: 'from-[#19130b]/80 to-[#19130b]/40',
  },
  {
    href: '/lots',
    title: 'Lots',
    desc: 'Prime land for your custom-built Caribbean dream home.',
    count: '12 Available',
    bg: 'from-[#7BC9BF]/80 to-[#7BC9BF]/40',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[600px] lg:h-[700px] bg-gradient-to-br from-[#19130b] via-[#3d0000] to-[#19130b] flex items-center overflow-hidden">
        {/* Decorative overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, #7BC9BF 0%, transparent 60%), radial-gradient(circle at 80% 20%, #7BC9BF 0%, transparent 40%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <p className="text-[#7BC9BF] text-sm font-semibold tracking-widest uppercase mb-4">
            Antigua &amp; Barbuda • West Coast
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-3xl">
            Exclusive Luxury Living in The Heart of Antigua
          </h1>
          <p className="text-white/70 text-lg max-w-xl mb-8 leading-relaxed">
            Nestled across forty-three lush acres on Antigua&apos;s west coast, Sugar Ridge is a
            treasured haven of bespoke homes with breathtaking Caribbean Sea views.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#7BC9BF] text-[#19130b] px-6 py-3 rounded font-semibold hover:bg-[#5aada3] transition-colors"
            >
              Request a Viewing
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/villas"
              className="inline-flex items-center gap-2 border border-white/40 text-white px-6 py-3 rounded font-semibold hover:bg-white/10 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            {values.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="group">
                <div className="w-14 h-14 rounded-full bg-[#3d0000]/8 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#3d0000]/15 transition-colors">
                  <Icon size={24} className="text-[#3d0000]" />
                </div>
                <h3 className="font-serif font-bold text-[#19130b] mb-1">{label}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About intro */}
      <section className="bg-[#f8f5f0] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[#7BC9BF] text-sm font-semibold tracking-widest uppercase mb-3">
              The Community
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl text-[#19130b] mb-6 leading-snug">
              A Treasured Haven on Antigua&apos;s West Coast
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Nestled across forty-three lush acres, Sugar Ridge is a gated community where
              exceptional design meets the natural splendour of the Caribbean. Each home is
              positioned to maximise panoramic sea views while maintaining the privacy and
              tranquillity our residents cherish.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Whether you seek a bespoke villa, a contemporary condo with resort amenities, or
              a prime lot to build your dream home, Sugar Ridge offers an unparalleled lifestyle
              on one of the Caribbean&apos;s most beautiful islands.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-[#3d0000] font-semibold hover:gap-3 transition-all"
            >
              Learn more about us <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Property Categories */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#7BC9BF] text-sm font-semibold tracking-widest uppercase mb-3">
              Browse Properties
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl text-[#19130b]">
              Find Your Perfect Home
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {propertyCategories.map(({ href, title, desc, count, bg }) => (
              <Link
                key={href}
                href={href}
                className="group relative h-72 rounded-xl overflow-hidden block"
              >
                <div className={`absolute inset-0 bg-gradient-to-t ${bg}`} />
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <span className="text-xs font-semibold text-white/70 mb-1">{count}</span>
                  <h3 className="font-serif text-2xl font-bold mb-1 group-hover:text-[#7BC9BF] transition-colors">{title}</h3>
                  <p className="text-sm text-white/80">{desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#7BC9BF] group-hover:gap-2 transition-all">
                    View all <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dual Benefit */}
      <section className="bg-[#3d0000] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-[#7BC9BF] text-sm font-semibold tracking-widest uppercase mb-3">Premium Living</p>
              <h2 className="font-serif text-3xl font-bold mb-4">Your Caribbean Dream Home</h2>
              <p className="text-white/70 leading-relaxed">
                Every property at Sugar Ridge is designed to the highest standards — bespoke
                architecture, panoramic views, eco-friendly systems, and resort-style amenities.
                This is more than a home; it&apos;s a lifestyle.
              </p>
            </div>
            <div>
              <p className="text-[#7BC9BF] text-sm font-semibold tracking-widest uppercase mb-3">Citizenship by Investment</p>
              <h2 className="font-serif text-3xl font-bold mb-4">Invest. Live. Belong.</h2>
              <p className="text-white/70 leading-relaxed mb-4">
                Qualifying purchases at Sugar Ridge provide access to Antigua &amp; Barbuda&apos;s
                Citizenship by Investment Programme — granting visa-free access to over 150 countries
                for you and your family.
              </p>
              <Link
                href="/citizenship"
                className="inline-flex items-center gap-2 text-[#7BC9BF] font-semibold hover:gap-3 transition-all"
              >
                Learn about citizenship <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f8f5f0] py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-serif text-3xl lg:text-4xl text-[#19130b] mb-4">
            Ready to Discover Sugar Ridge?
          </h2>
          <p className="text-gray-600 mb-8">
            Contact us today to schedule a private viewing and explore your future at Sugar Ridge.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#3d0000] text-white px-8 py-3 rounded font-semibold hover:bg-[#6b0000] transition-colors"
          >
            Request a Viewing <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}
