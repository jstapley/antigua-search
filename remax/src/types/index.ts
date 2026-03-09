export interface Property {
  id: string
  created_at: string
  title: string
  price: number
  currency: string
  property_type: 'House' | 'Villa' | 'Condo' | 'Land' | 'Commercial'
  bedrooms: number | null
  bathrooms: number | null
  sqft: number | null
  lot_sqft: number | null
  description: string
  short_description: string | null
  location: string
  area: string | null
  images: string[]
  featured: boolean
  status: 'active' | 'sold' | 'pending'
  slug: string
  amenities: string[]
  video_url: string | null
  map_embed: string | null
}

export interface Review {
  id: string
  author_name: string
  rating: number
  text: string
  time: string
  profile_photo_url: string | null
  source: 'google' | 'manual'
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string | null
  order: number
}

export interface BookingSlot {
  date: string
  time: string
  available: boolean
}

export interface ContactForm {
  name: string
  email: string
  phone: string
  message: string
  property_id?: string
}
