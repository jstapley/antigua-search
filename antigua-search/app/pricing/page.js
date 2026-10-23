import PricingClient from './PricingClient'

export const metadata = {
  title: 'Pricing - List Your Business Free | AntiguaSearch.com',
  description: 'List your Antigua & Barbuda business for free on AntiguaSearch.com. No hidden fees, no credit card required. Premium featured listings coming soon.',
  alternates: {
    canonical: 'https://www.antiguasearch.com/pricing',
  },
  openGraph: {
    title: 'Pricing - List Your Business Free | AntiguaSearch.com',
    description: 'List your Antigua & Barbuda business for free. No hidden fees, no credit card required. Premium featured listings coming soon.',
    url: 'https://www.antiguasearch.com/pricing',
    siteName: 'AntiguaSearch.com',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.antiguasearch.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AntiguaSearch.com - List Your Business Free',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'List Your Business Free | AntiguaSearch.com',
    description: 'List your Antigua & Barbuda business for free. No credit card required.',
    images: ['https://www.antiguasearch.com/og-image.jpg'],
  },
}

export default function PricingPage() {
  return <PricingClient />
}