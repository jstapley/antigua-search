import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search Businesses in Antigua & Barbuda | AntiguaSearch.com',
  description: 'Search 170+ local businesses, hotels, restaurants, tours and services across all parishes in Antigua & Barbuda. Find exactly what you need.',
  keywords: 'search antigua businesses, find businesses antigua, antigua directory search, antigua hotels search, antigua restaurants search',
  alternates: {
    canonical: 'https://antiguasearch.com/search'
  },
  openGraph: {
    title: 'Search Antigua & Barbuda Businesses | AntiguaSearch.com',
    description: 'Search 170+ verified businesses across Antigua & Barbuda. Find hotels, restaurants, tours, and more.',
    url: 'https://antiguasearch.com/search',
    siteName: 'AntiguaSearch.com',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://antiguasearch.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Search AntiguaSearch.com'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search Antigua & Barbuda Businesses',
    description: 'Search 170+ verified businesses across Antigua & Barbuda.',
    images: ['https://antiguasearch.com/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}