import { Suspense } from 'react'
import SearchClient from './SearchClient'

export const metadata = {
  title: 'Search Businesses in Antigua & Barbuda | AntiguaSearch.com',
  description: 'Search 200+ local businesses across Antigua & Barbuda. Find restaurants, hotels, tours, shops and services by name, category or parish.',
  alternates: {
    canonical: 'https://www.antiguasearch.com/search',
  },
  openGraph: {
    title: 'Search Businesses in Antigua & Barbuda | AntiguaSearch.com',
    description: 'Search 200+ local businesses across Antigua & Barbuda. Find restaurants, hotels, tours, shops and services by name, category or parish.',
    url: 'https://www.antiguasearch.com/search',
    siteName: 'AntiguaSearch.com',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.antiguasearch.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Search Businesses in Antigua & Barbuda | AntiguaSearch.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search Businesses in Antigua & Barbuda | AntiguaSearch.com',
    description: 'Search 200+ local businesses across Antigua & Barbuda.',
    images: ['https://www.antiguasearch.com/og-image.jpg'],
  },
}

export default function SearchPage() {
  return (
    <>
      <h1 className="sr-only">Search Businesses in Antigua & Barbuda</h1>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading search...</p>
          </div>
        </div>
      }>
        <SearchClient />
      </Suspense>
    </>
  )
}