import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request) {
  try {
    const { path } = await request.json()
    revalidatePath(path)
    return NextResponse.json({ revalidated: true, path })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}