import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ListingDetailClient from './ListingDetailClient'

export const revalidate = 3600

export async function generateStaticParams() {
  const { data: listings } = await supabase
    .from('listings')
    .select('slug')
    .eq('status', 'active')
  
  return listings?.map((listing) => ({
    slug: listing.slug,
  })) || []
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const { data: listing } = await supabase
    .from('listings')
    .select('business_name, short_description, meta_title, meta_description')
    .eq('slug', resolvedParams.slug)
    .eq('status', 'active')
    .single()

  if (!listing) {
    return {
      title: 'Business Not Found'
    }
  }

  return {
    title: listing.meta_title || `${listing.business_name} - Antigua Search`,
    description: listing.meta_description || listing.short_description || `Discover ${listing.business_name} in Antigua & Barbuda`,
  }
}

async function getListing(slug) {
  const { data: listing } = await supabase
    .from('listings')
    .select(`
      *,
      category:categories(id, name, slug, icon_emoji),
      parish:parishes(id, name, slug)
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .single()
  
  return listing
}

async function checkIfClaimed(listingId) {
  const { data, error } = await supabase
    .from('claimed_listings')
    .select('id')
    .eq('listing_id', listingId)
  
  return data && data.length > 0
}

async function getRelatedListings(categoryId, parishId, currentListingId) {
  const { data: listings } = await supabase
    .from('listings')
    .select(`
      *,
      category:categories(name, icon_emoji),
      parish:parishes(name, slug)
    `)
    .eq('status', 'active')
    .neq('id', currentListingId)
    .or(`category_id.eq.${categoryId},parish_id.eq.${parishId}`)
    .order('featured', { ascending: false })
    .limit(3)
  
  return listings || []
}

export default async function ListingPage({ params }) {
  const resolvedParams = await params
  const listing = await getListing(resolvedParams.slug)
  
  if (!listing) {
    notFound()
  }
  
  const isClaimed = await checkIfClaimed(listing.id)
  const relatedListings = await getRelatedListings(
    listing.category?.id,
    listing.parish?.id,
    listing.id
  )

  return (
    <ListingDetailClient 
      listing={listing}
      isClaimed={isClaimed}
      relatedListings={relatedListings}
    />
  )
}