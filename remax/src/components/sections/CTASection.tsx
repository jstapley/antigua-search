import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="py-20 bg-navy-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Find Your Piece of Paradise?
        </h2>
        <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
          Schedule a free consultation with our expert agents. We'll help you navigate the Antigua real estate market and find the perfect property for your needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact?type=schedule"
            className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200 shadow-lg"
          >
            Schedule a Meeting
          </Link>
          <Link
            href="/properties"
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    </section>
  )
}
