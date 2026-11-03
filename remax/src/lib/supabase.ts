import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Public client (anon key) — for public pages + client-side auth
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role — for admin API routes
export const getServiceSupabase = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

// Browser client for admin auth (client components)
export const getAuthClient = () => createClient(supabaseUrl, supabaseAnonKey)
