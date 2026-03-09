import { FileText, Star, Building2 } from 'lucide-react'

const reasons = [
  {
    icon: FileText,
    title: 'CITIZENSHIP BY INVESTMENT',
    description: "Antigua offers one of the Caribbean's most attractive citizenship-by-investment programs.",
  },
  {
    icon: Star,
    title: 'STRONG ECONOMY',
    description: 'The island attracts over 1.2 million visitors annually with its 365 beaches, luxury resorts, and year-round tropical climates and direct flights several major North American and European cities.',
  },
  {
    icon: Building2,
    title: 'TAX ADVANTAGES',
    description: 'Antigua has no capital gains tax, inheritance tax, or wealth tax for residents. Non-residents also benefit from favorable tax treatment on rental income.',
  },
]

export default function WhyInvestSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://yhblxzdydirndlprmnan.supabase.co/storage/v1/object/public/media/why-buy-in-antigua.jpeg')` }}
      />
      {/* Dark overlay matching screenshot */}
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <h2 className="text-white font-display font-bold text-3xl md:text-4xl text-center mb-2">
          Why Invest in Antigua?
        </h2>
        {/* Gold divider line */}
        <div className="w-24 h-0.5 bg-amber-400 mx-auto mb-16" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {reasons.map((r, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              {/* Gold circle icon */}
              <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center mb-5 shadow-lg">
                <r.icon size={26} className="text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-3">
                {r.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">{r.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
