import { Metadata } from 'next'
import HeroSection from '@/components/sections/HeroSection'
import WhyInvestSection from '@/components/sections/WhyInvestSection'
import FeaturedPropertiesSection from '@/components/sections/FeaturedPropertiesSection'
import ReviewsSection from '@/components/sections/ReviewsSection'
import FAQSection from '@/components/sections/FAQSection'
import CTASection from '@/components/sections/CTASection'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'RE/MAX 365 Antigua | Buy & Sell Property in Antigua',
  description: 'The most trusted name in Antigua real estate. Browse exclusive listings, beachfront villas, luxury homes, and investment properties in Antigua & Barbuda.',
  alternates: {
    canonical: 'https://www.remax-365-antigua.com',
  },
  openGraph: {
    title: 'RE/MAX 365 Antigua | Buy & Sell Property in Antigua',
    description: 'The most trusted name in Antigua real estate. Browse exclusive listings, beachfront villas, luxury homes, and investment properties.',
    url: 'https://www.remax-365-antigua.com',
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhyInvestSection />
      <FeaturedPropertiesSection />
      <CTASection />
      <ReviewsSection />
      <FAQSection limit={8} />
    </>
  )
}