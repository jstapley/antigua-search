import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/adminAuth'

export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { clients } = await req.json()
  if (!Array.isArray(clients) || clients.length === 0)
    return NextResponse.json({ error: 'No clients provided' }, { status: 400 })

  const supabase = getServiceSupabase()
  const { data: existing } = await supabase.from('clients').select('email, phone')
  const existingEmails = new Set((existing || []).map(c => c.email).filter(Boolean))
  const existingPhones = new Set((existing || []).map(c => c.phone).filter(Boolean))

  const toInsert = clients.filter(c => {
    if (c.email && existingEmails.has(c.email)) return false
    if (!c.email && c.phone && existingPhones.has(c.phone)) return false
    return true
  })

  let imported = 0
  const skipped = clients.length - toInsert.length
  for (let i = 0; i < toInsert.length; i += 100) {
    const batch = toInsert.slice(i, i + 100)
    const { error } = await supabase.from('clients').insert(batch)
    if (!error) imported += batch.length
  }

  return NextResponse.json({ imported, skipped })
}