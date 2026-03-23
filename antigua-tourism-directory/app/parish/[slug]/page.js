import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ParishPageClient from './ParishPageClient'

export const revalidate = 3600
export const dynamicParams = true

const LISTINGS_PER_PAGE = 24

export async function generateStaticParams() {
  const { data: parishes } = await supabase
    .from('parishes')
    .select('slug')
  return parishes?.map((parish) => ({ slug: parish.slug })) || []
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const slug = resolvedParams?.slug

  if (!slug) return { title: 'Parish Not Found' }

  const { data: parish } = await supabase
    .from('parishes')
    .select('id, name, description')
    .eq('slug', slug)
    .single()

  if (!parish) return { title: 'Parish Not Found' }

  const { count } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('parish_id', parish.id)
    .eq('status', 'active')

  const listingCount = count || 0
  const description = `Browse ${listingCount} verified businesses in ${parish.name}, Grenada. Find hotels, restaurants, tours, and local services. Discover the best of ${parish.name} on GrenadaSearch.com.`

  return {
    title: `Businesses in ${parish.name}, Grenada (${listingCount} Listings) - GrenadaSearch.com`,
    description,
    alternates: {
      canonical: `https://www.grenadasearch.com/parish/${slug}`,
    },
  }
}

async function getParish(slug) {
  const { data: parish } = await supabase
    .from('parishes')
    .select('*')
    .eq('slug', slug)
    .single()
  return parish
}

async function getListings(parishId, page = 1) {
  const from = (page - 1) * LISTINGS_PER_PAGE
  const to = from + LISTINGS_PER_PAGE - 1

  const { data: listings, count } = await supabase
    .from('listings')
    .select(`*, category:categories(name, icon)`, { count: 'exact' })
    .eq('parish_id', parishId)
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to)

  return {
    listings: listings || [],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / LISTINGS_PER_PAGE),
    currentPage: page,
  }
}

async function getCategories(parishId) {
  const { data: categories } = await supabase
    .from('listings')
    .select('category:categories(id, name, slug, icon)')
    .eq('parish_id', parishId)
    .eq('status', 'active')

  const uniqueCategories = {}
  categories?.forEach(item => {
    if (item.category) uniqueCategories[item.category.id] = item.category
  })
  return Object.values(uniqueCategories)
}

export default async function ParishPage({ params, searchParams }) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const parish = await getParish(resolvedParams.slug)
  if (!parish) notFound()

  const page = parseInt(resolvedSearchParams?.page || '1', 10)
  const { listings, totalCount, totalPages, currentPage } = await getListings(parish.id, page)
  const categories = await getCategories(parish.id)

  return (
    <ParishPageClient
      parish={parish}
      listings={listings}
      categories={categories}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  )
}