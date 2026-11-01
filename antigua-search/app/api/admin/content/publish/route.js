// app/api/admin/content/publish/route.js
// Pushes the saved draft into blog_posts as a draft post.
// The admin reviews and publishes it from the Blog tab.
// Status flow: draft_ready → published

import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function POST(request) {
  const { topic_id } = await request.json()
  if (!topic_id) return Response.json({ error: 'topic_id required' }, { status: 400 })

  const supabase = getSupabase()

  const { data: topic, error: topicError } = await supabase
    .from('content_topics')
    .select('*')
    .eq('id', topic_id)
    .single()

  if (topicError || !topic) {
    return Response.json({ error: 'Topic not found' }, { status: 404 })
  }

  if (!topic.draft) {
    return Response.json({ error: 'No draft content — approve the outline first' }, { status: 400 })
  }

  const slug = generateSlug(topic.title)
  const now = new Date().toISOString()

  // Insert into blog_posts as a draft for final review in the Blog tab
  const { data: post, error: insertError } = await supabase
    .from('blog_posts')
    .insert([{
      title: topic.title,
      slug,
      content: topic.draft,
      author: 'AntiguaSearch Team',
      status: 'draft',
      tags: [],
      created_at: now,
      updated_at: now,
    }])
    .select()
    .single()

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500 })
  }

  // Mark the topic as published
  await supabase.from('content_topics').update({
    status: 'published',
    updated_at: now,
  }).eq('id', topic_id)

  return Response.json({ ok: true, post_id: post.id, slug })
}
