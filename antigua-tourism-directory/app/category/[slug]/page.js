import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import CategoryPageClient from './CategoryPageClient'

export const revalidate = 3600

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return createClient(url, key)
}

export async function generateStaticParams() {
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')
  return categories?.map((category) => ({ slug: category.slug })) || []
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const serverSupabase = getServerSupabase()

  const { data: category, error: catError } = await serverSupabase
    .from('categories')
    .select('id, name, description')
    .eq('slug', resolvedParams.slug)
    .single()

  if (catError || !category) {
    console.error('generateMetadata category error:', catError)
    return { title: 'Category Not Found' }
  }

  const { count, error: countError } = await serverSupabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', category.id)
    .eq('status', 'active')

  if (countError) {
    console.error('generateMetadata count error:', countError)
  }

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
    .select(`*, parish:parishes(name, slug)`)
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
  
  const uniqueParishes = {}
  parishes?.forEach(item => {
    if (item.parish) uniqueParishes[item.parish.id] = item.parish
  })
  return Object.values(uniqueParishes)
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await params
  const category = await getCategory(resolvedParams.slug)
  if (!category) notFound()
  
  const listings = await getListings(category.id)
  const parishes = await getParishes(category.id)

  return <CategoryPageClient category={category} listings={listings} parishes={parishes} />
}