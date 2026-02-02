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

  return {
    title: `${category.name} in Antigua - ANTIGUA SEARCH`,
    description: category.description || `Discover the best ${category.name.toLowerCase()} in Antigua & Barbuda`,
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