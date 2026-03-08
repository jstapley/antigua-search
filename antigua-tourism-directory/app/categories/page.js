import { supabase } from '@/lib/supabase'
import CategoriesPageClient from './CategoriesPageClient'

export const revalidate = 3600

export const metadata = {
  title: 'Browse All Categories | AntiguaSearch.com',
  description: 'Explore all business categories in Antigua & Barbuda - restaurants, hotels, tours, activities, shopping, and more.',
  alternates: {
    canonical: 'https://www.antiguasearch.com/categories',
  },
  openGraph: {
    title: 'Browse All Categories | AntiguaSearch.com',
    description: 'Explore all business categories in Antigua & Barbuda - restaurants, hotels, tours, activities, shopping, and more.',
    url: 'https://www.antiguasearch.com/categories',
    siteName: 'AntiguaSearch.com',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.antiguasearch.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AntiguaSearch.com - Business Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse All Categories | AntiguaSearch.com',
    description: 'Explore all business categories in Antigua & Barbuda.',
    images: ['https://www.antiguasearch.com/og-image.jpg'],
  },
}

async function getCategories() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('listing_count', { ascending: false })
  
  return categories || []
}

export default async function CategoriesPage() {
  const categories = await getCategories()
  return <CategoriesPageClient categories={categories} />
}