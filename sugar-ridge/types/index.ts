export type PropertyType = 'villa' | 'condo' | 'lot'
export type PropertyStatus = 'available' | 'reserved' | 'sold'
export type InquiryStatus = 'new' | 'contacted' | 'closed'

export interface Property {
  id: string
  name: string
  slug: string
  type: PropertyType
  status: PropertyStatus
  price: number | null
  bedrooms: number | null
  bathrooms: number | null
  interior_sqft: number | null
  total_sqft: number | null
  lot_sqft: number | null
  lot_number: string | null
  completion_date: string | null
  description: string | null
  features: string[] | null
  images: string[] | null
  listed_at: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Inquiry {
  id: string
  name: string
  email: string
  phone: string | null
  property_id: string | null
  property_name: string | null
  message: string | null
  status: InquiryStatus
  created_at: string
}

export interface Sale {
  id: string
  property_id: string | null
  property_name: string
  property_type: PropertyType
  sale_price: number
  list_price: number | null
  sold_at: string
  buyer_name: string | null
  notes: string | null
  created_at: string
}

export interface DashboardStats {
  totalRevenue: number
  unitsSold: number
  avgSalePrice: number
  availableVillas: number
  availableCondos: number
  availableLots: number
  totalVillas: number
  totalCondos: number
  totalLots: number
  newInquiries: number
  recentSales: Sale[]
  recentInquiries: Inquiry[]
}
