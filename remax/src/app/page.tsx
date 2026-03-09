import HeroSection from '@/components/sections/HeroSection'
import WhyInvestSection from '@/components/sections/WhyInvestSection'
import FeaturedPropertiesSection from '@/components/sections/FeaturedPropertiesSection'
import ReviewsSection from '@/components/sections/ReviewsSection'
import FAQSection from '@/components/sections/FAQSection'
import CTASection from '@/components/sections/CTASection'

export const revalidate = 0

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
