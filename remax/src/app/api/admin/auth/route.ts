import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServiceSupabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  
  const supabase = getServiceSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  
  if (error || !data.session) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  return NextResponse.json({ success: true, user: data.user })
}

export async function DELETE() {
  // Legacy logout support
  const cookieStore = cookies()
  cookieStore.delete('admin_session')
  return NextResponse.json({ success: true })
}
