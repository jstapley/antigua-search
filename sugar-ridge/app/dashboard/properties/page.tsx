import { createClient } from '@/lib/supabase/server'
import type { Property } from '@/types'
import PropertiesClient from './PropertiesClient'

export default async function PropertiesPage() {
  const supabase = await createClient()
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .order('type')
    .order('sort_order')

  return <PropertiesClient properties={(properties ?? []) as Property[]} />
}
