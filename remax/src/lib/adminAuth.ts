import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function isAdmin(): Promise<boolean> {
  const cookieStore = cookies()

  // Legacy cookie fallback
  const legacy = cookieStore.get('admin_session')
  if (legacy?.value === process.env.ADMIN_PASSWORD) return true

  // Supabase SSR
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll() {},
        },
      }
    )
    const { data: { user } } = await supabase.auth.getUser()
    return !!user
  } catch {
    return false
  }
}