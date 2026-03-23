import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import CategoryPageClient from './CategoryPageClient'

export const revalidate = 3600
export const dynamicParams = true

const LISTINGS_PER_PAGE = 24

export async function generateStaticParams() {
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')
  return categories?.map((category) => ({ slug: category.slug })) || []
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const slug = resolvedParams?.slug

  if (!slug) return { title: 'Category Not Found' }

  const { data: category } = await supabase
    .from('categories')
    .select('id, name, description')
    .eq('slug', slug)
    .single()

  if (!category) return { title: 'Category Not Found' }

  const { count } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', category.id)
    .eq('status', 'active')

  const listingCount = count || 0
  const description = `Browse ${listingCount} verified ${category.name.toLowerCase()} in Antigua & Barbuda. Find contact details, locations, and reviews across all parishes. List your business free on AntiguaSearch.com.`

  return {
    title: `${category.name} in Antigua & Barbuda (${listingCount} Listings) - AntiguaSearch.com`,
    description,
    alternates: {
      canonical: `https://www.antiguasearch.com/category/${slug}`,
    },
  }
}

async function getCategory(slug) {
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
  return category
}

async function getListings(categoryId, page = 1) {
  const from = (page - 1) * LISTINGS_PER_PAGE
  const to = from + LISTINGS_PER_PAGE - 1

  const { data: listings, count } = await supabase
    .from('listings')
    .select(`*, parish:parishes(name, slug)`, { count: 'exact' })
    .eq('category_id', categoryId)
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

async function getParishes(categoryId) {
  const { data: parishes } = await supabase
    .from('listings')
    .select('parish:parishes(id, name, slug)')
    .eq('category_id', categoryId)
    .eq('status', 'active')

  const uniqueParishes = {}
  parishes?.forEach(item => {
    if (item.parish) uniqueParishes[item.parish.id] = item.parish
  })
  return Object.values(uniqueParishes)
}

export default async function CategoryPage({ params, searchParams }) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const category = await getCategory(resolvedParams.slug)
  if (!category) notFound()

  const page = parseInt(resolvedSearchParams?.page || '1', 10)
  const { listings, totalCount, totalPages, currentPage } = await getListings(category.id, page)
  const parishes = await getParishes(category.id)

  return (
    <CategoryPageClient
      category={category}
      listings={listings}
      parishes={parishes}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  )
}