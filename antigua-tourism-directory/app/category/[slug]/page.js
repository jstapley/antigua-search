import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import CategoryPageClient from './CategoryPageClient'

export const revalidate = 3600

export async function generateStaticParams() {
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')
  
  return categories?.map((category) => ({
    slug: category.slug,
  })) || []
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const { data: category } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!category) {
    return {
      title: 'Category Not Found'
    }
  }

  // Get listing count for this category
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
      canonical: `https://www.antiguasearch.com/category/${resolvedParams.slug}`,
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

async function getListings(categoryId) {
  const { data: listings } = await supabase
    .from('listings')
    .select(`
      *,
      parish:parishes(name, slug)
    `)
    .eq('category_id', categoryId)
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
  
  return listings || []
}

async function getParishes(categoryId) {
  const { data: parishes } = await supabase
    .from('listings')
    .select('parish:parishes(id, name, slug)')
    .eq('category_id', categoryId)
    .eq('status', 'active')
  
  // Get unique parishes
  const uniqueParishes = {}
  parishes?.forEach(item => {
    if (item.parish) {
      uniqueParishes[item.parish.id] = item.parish
    }
  })
  
  return Object.values(uniqueParishes)
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await params
  const category = await getCategory(resolvedParams.slug)
  
  if (!category) {
    notFound()
  }
  
  const listings = await getListings(category.id)
  const parishes = await getParishes(category.id)

  return (
    <CategoryPageClient 
      category={category} 
      listings={listings} 
      parishes={parishes} 
    />
  )
}