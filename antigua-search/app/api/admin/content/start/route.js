// app/api/admin/content/start/route.js
// Starts a content writer agent session and streams output via SSE.
// Status flow: queued → writing → outline_pending (agent pauses for approval)

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
  const { topic_id } = await request.json()
  const supabase = getSupabase()

  const { data: topic, error: topicError } = await supabase
    .from('content_topics')
    .select('*')
    .eq('id', topic_id)
    .single()

  if (topicError || !topic) {
    return Response.json({ error: 'Topic not found' }, { status: 404 })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        const anthropic = getAnthropic()

        // Create the agent session
        const session = await anthropic.beta.sessions.create({
          agent: process.env.CONTENT_WRITER_AGENT_ID,
          environment_id: process.env.ANTHROPIC_ENVIRONMENT_ID,
          title: topic.title,
        })

        // Persist session_id and flip status to writing
        await supabase.from('content_topics').update({
          status: 'writing',
          session_id: session.id,
          outline: null,
          draft: null,
          error_message: null,
          updated_at: new Date().toISOString(),
        }).eq('id', topic_id)

        send({ type: 'status', message: `Session ${session.id} created. Agent is working...` })

        // Fire the brief at the agent
        // Append a hard stop to prevent the agent skipping outline approval and publishing directly
        const briefWithStop = topic.brief.trim() + `\n\nIMPORTANT OVERRIDE: Do NOT publish to Supabase or any database at any point. Do NOT use bash tools to look up credentials. Your only job right now is to research and present a structured outline, then stop and wait for my approval. Do not write the full post until I explicitly tell you to proceed.`

        await anthropic.beta.sessions.events.send(session.id, {
          events: [{
            type: 'user.message',
            content: [{ type: 'text', text: briefWithStop }],
          }],
        })

        // Stream agent output until it pauses for outline approval
        let accumulatedText = ''
        const agentStream = await anthropic.beta.sessions.events.stream(session.id)

        for await (const event of agentStream) {
          if (event.type === 'agent.message') {
            for (const block of event.content || []) {
              if (block.type === 'text') {
                accumulatedText += block.text
                send({ type: 'text', content: block.text })
              }
            }
          } else if (event.type === 'agent.tool_use') {
            send({ type: 'tool', name: event.name || 'tool' })
          } else if (event.type === 'session.status_idle') {
            // Agent paused — outline is ready, save it
            await supabase.from('content_topics').update({
              status: 'outline_pending',
              outline: accumulatedText,
              updated_at: new Date().toISOString(),
            }).eq('id', topic_id)

            send({ type: 'idle', message: 'Outline ready — review and approve in the admin panel.' })
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
