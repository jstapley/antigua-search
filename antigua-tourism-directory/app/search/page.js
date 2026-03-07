import { Suspense } from 'react'
import SearchClient from './SearchClient'

export const metadata = {
  title: 'Search Businesses in Antigua & Barbuda | AntiguaSearch.com',
  description: 'Search 200+ local businesses across Antigua & Barbuda. Find restaurants, hotels, tours, shops and services by name, category or parish.',
  alternates: {
    canonical: 'https://www.antiguasearch.com/search',
  },
}

export default function SearchPage() {
  return (
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
  )
}