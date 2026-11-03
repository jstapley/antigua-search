import type { Metadata } from 'next'
import { Leaf, Shield, Waves, Sparkles, Mountain, Sun, Home, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Why Sugar Ridge',
  description: 'Discover why Sugar Ridge is Antigua\'s most sought-after luxury residential community.',
}

const reasons = [
  {
    icon: Sparkles,
    title: 'Uncompromising Quality',
    desc: 'Premium materials sourced from around the world, European kitchen fittings, Quartz countertops, rain showers, and high-end finishes throughout.',
  },
  {
    icon: Mountain,
    title: 'Architectural Excellence',
    desc: 'Designed by award-winning architects to maximise views, natural light, and indoor-outdoor living. Every home is a masterpiece.',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly Design',
    desc: 'Solar power systems, rainwater harvesting, tankless water heaters, and cisterns. Luxury living with minimal environmental impact.',
  },
  {
    icon: Shield,
    title: 'Secure Gated Community',
    desc: 'Fully enclosed with remote-controlled access, 24/7 security, and backup systems — your safety and privacy are paramount.',
  },
  {
    icon: Waves,
    title: 'Caribbean Sea Views',
    desc: 'Positioned on Antigua\'s west coast, every property enjoys panoramic views of the Caribbean Sea and spectacular daily sunsets.',
  },
  {
    icon: Sun,
    title: 'Year-Round Sunshine',
    desc: 'Antigua enjoys over 365 days of sunshine per year with a warm tropical climate. The island lifestyle at its finest.',
  },
  {
    icon: Home,
    title: 'Prime Location',
    desc: 'Minutes from Jolly Harbour marina, beaches, restaurants, and Antigua\'s international airport. Convenient without compromising tranquillity.',
  },
  {
    icon: Globe,
    title: 'Investment Value',
    desc: 'Caribbean real estate continues to appreciate. Sugar Ridge properties offer both lifestyle value and strong investment returns.',
  },
]

export default function WhySugarRidgePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#3d0000] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#7BC9BF] text-sm font-semibold tracking-widest uppercase mb-3">The Advantage</p>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4">Why Sugar Ridge?</h1>
          <p className="text-white/70 max-w-xl leading-relaxed">
            Eight compelling reasons why discerning buyers choose Sugar Ridge as their
            Caribbean home.
          </p>
        </div>
      </div>

      {/* Reasons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reasons.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="flex gap-5 p-6 bg-white rounded-xl border border-[#e8dfd0]">
              <div className="w-12 h-12 rounded-full bg-[#3d0000]/8 flex items-center justify-center shrink-0">
                <Icon size={22} className="text-[#3d0000]" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#19130b] mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
