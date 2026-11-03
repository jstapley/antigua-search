import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    // Extract text fields
    const fields = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string || null,
      email: formData.get('email') as string || null,
      phone: formData.get('phone') as string || null,
      street_address: formData.get('street_address') as string || null,
      city: formData.get('city') as string || null,
      state: formData.get('state') as string || null,
      country: formData.get('country') as string || null,
      postal_code: formData.get('postal_code') as string || null,
      nationality: formData.get('nationality') as string || null,
      marital_status: formData.get('marital_status') as string || null,
      pep: formData.get('pep') === 'true',
      pep_affiliation: formData.get('pep_affiliation') as string || null,
      occupation: formData.get('occupation') as string || null,
      employer: formData.get('employer') as string || null,
      preferences: (formData.get('preferences') as string || '').split(',').filter(Boolean),
      budget: formData.get('budget') as string || null,
      notes: formData.get('notes') as string || null,
    }

    if (!fields.first_name) {
      return NextResponse.json({ error: 'First name is required' }, { status: 400 })
    }

    const supabase = getServiceSupabase()
    let passport_path = null

    // Handle passport upload to private bucket
    const passportFile = formData.get('passport') as File | null
    if (passportFile && passportFile.size > 0) {
      const ext = passportFile.name.split('.').pop()?.toLowerCase() || 'pdf'
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const arrayBuffer = await passportFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('passports')
        .upload(filename, buffer, {
          contentType: passportFile.type,
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Passport upload error:', uploadError.message)
        // Continue without passport rather than failing the whole submission
      } else {
        passport_path = uploadData.path
      }
    }

    const { data, error } = await supabase
      .from('onboarding_submissions')
      .insert({ ...fields, passport_path })
      .select('id')
      .single()

    if (error) {
      console.error('Onboarding insert error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error('Onboarding error:', err)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}
