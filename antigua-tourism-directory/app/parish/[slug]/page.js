import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ParishPageClient from './ParishPageClient'

export const revalidate = 3600

export async function generateStaticParams() {
  const { data: parishes } = await supabase
    .from('parishes')
    .select('slug')
  
  return parishes?.map((parish) => ({
    slug: parish.slug,
  })) || []
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const { data: parish } = await supabase
    .from('parishes')
    .select('name, description')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!parish) {
    return {
      title: 'Parish Not Found'
    }
  }

  return {
    title: `${parish.name} - Antigua Search`,
    description: parish.description || `Discover businesses and attractions in ${parish.name}, Antigua & Barbuda`,
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
    .select(`
      *,
      category:categories(name, icon_emoji)
    `)
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
  
  // Get unique categories
  const uniqueCategories = {}
  categories?.forEach(item => {
    if (item.category) {
      uniqueCategories[item.category.id] = item.category
    }
  })
  
  return Object.values(uniqueCategories)
}

export default async function ParishPage({ params }) {
  const resolvedParams = await params
  const parish = await getParish(resolvedParams.slug)
  
  if (!parish) {
    notFound()
  }
  
  const listings = await getListings(parish.id)
  const categories = await getCategories(parish.id)

  return (
    <ParishPageClient 
      parish={parish} 
      listings={listings} 
      categories={categories} 
    />
  )
}