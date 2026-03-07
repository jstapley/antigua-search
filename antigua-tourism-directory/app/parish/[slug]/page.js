import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ParishPageClient from './ParishPageClient'

export const revalidate = 3600

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return createClient(url, key)
}

export async function generateStaticParams() {
  const { data: parishes } = await supabase
    .from('parishes')
    .select('slug')
  return parishes?.map((parish) => ({ slug: parish.slug })) || []
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const serverSupabase = getServerSupabase()

  const { data: parish, error: parishError } = await serverSupabase
    .from('parishes')
    .select('id, name, description')
    .eq('slug', resolvedParams.slug)
    .single()

  if (parishError || !parish) {
    console.error('generateMetadata parish error:', parishError)
    return { title: 'Parish Not Found' }
  }

  const { count, error: countError } = await serverSupabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('parish_id', parish.id)
    .eq('status', 'active')

  if (countError) {
    console.error('generateMetadata count error:', countError)
  }

  const listingCount = count || 0
  const description = `Browse ${listingCount} verified businesses in ${parish.name}, Antigua & Barbuda. Find hotels, restaurants, tours, and local services. Discover the best of ${parish.name} on AntiguaSearch.com.`

  return {
    title: `Businesses in ${parish.name}, Antigua (${listingCount} Listings) - AntiguaSearch.com`,
    description,
    alternates: {
      canonical: `https://www.antiguasearch.com/parish/${resolvedParams.slug}`,
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

async function getListings(parishId) {
  const { data: listings } = await supabase
    .from('listings')
    .select(`*, category:categories(name, icon_emoji)`)
    .eq('parish_id', parishId)
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
  return listings || []
}

async function getCategories(parishId) {
  const { data: categories } = await supabase
    .from('listings')
    .select('category:categories(id, name, slug, icon_emoji)')
    .eq('parish_id', parishId)
    .eq('status', 'active')
  
  const uniqueCategories = {}
  categories?.forEach(item => {
    if (item.category) uniqueCategories[item.category.id] = item.category
  })
  return Object.values(uniqueCategories)
}

export default async function ParishPage({ params }) {
  const resolvedParams = await params
  const parish = await getParish(resolvedParams.slug)
  if (!parish) notFound()
  
  const listings = await getListings(parish.id)
  const categories = await getCategories(parish.id)

  return <ParishPageClient parish={parish} listings={listings} categories={categories} />
}