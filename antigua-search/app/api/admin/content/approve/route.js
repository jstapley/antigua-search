// app/api/admin/content/approve/route.js
// Sends outline approval to the existing agent session, streams the full post,
// and saves it as a draft.
// Status flow: outline_pending → writing → draft_ready

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 300

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

function getAnthropic() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    defaultHeaders: { 'anthropic-beta': 'managed-agents-2026-04-01' },
  })
}

export async function POST(request) {
  const { topic_id, feedback } = await request.json()
  const supabase = getSupabase()

  const { data: topic, error: topicError } = await supabase
    .from('content_topics')
    .select('*')
    .eq('id', topic_id)
    .single()

  if (topicError || !topic) {
    return Response.json({ error: 'Topic not found' }, { status: 404 })
  }

  if (!topic.session_id) {
    return Response.json({ error: 'No active session for this topic' }, { status: 400 })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        const anthropic = getAnthropic()

        // Flip to writing so the UI shows the agent is active
        await supabase.from('content_topics').update({
          status: 'writing',
          updated_at: new Date().toISOString(),
        }).eq('id', topic_id)

        // Send approval (with optional feedback) to the paused session
        const approvalMessage = feedback?.trim()
          ? `The outline looks good with one change: ${feedback.trim()}. Please proceed and write the full blog post now.`
          : 'The outline looks great. Please proceed and write the full blog post now.'

        await anthropic.beta.sessions.events.send(topic.session_id, {
          events: [{
            type: 'user.message',
            content: [{ type: 'text', text: approvalMessage }],
          }],
        })

        send({ type: 'status', message: 'Outline approved — writing full post...' })

        // Stream the full post writing
        let draft = ''
        const agentStream = await anthropic.beta.sessions.events.stream(topic.session_id)

        for await (const event of agentStream) {
          if (event.type === 'agent.message') {
            for (const block of event.content || []) {
              if (block.type === 'text') {
                draft += block.text
                send({ type: 'text', content: block.text })
              }
            }
          } else if (event.type === 'agent.tool_use') {
            send({ type: 'tool', name: event.name || 'tool' })
          } else if (event.type === 'session.status_idle') {
            // Writing complete — save draft
            await supabase.from('content_topics').update({
              status: 'draft_ready',
              draft,
              updated_at: new Date().toISOString(),
            }).eq('id', topic_id)

            send({ type: 'complete', message: 'Draft ready — click "Send to Blog" to create a draft post.' })
            break
          }
        }
      } catch (err) {
        await supabase.from('content_topics').update({
          status: 'failed',
          error_message: err.message,
          updated_at: new Date().toISOString(),
        }).eq('id', topic_id)
        send({ type: 'error', message: err.message })
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
