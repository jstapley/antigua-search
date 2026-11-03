#!/usr/bin/env node
/**
 * AntiguaSearch Topic Discovery - Session Trigger
 * Run: node run_topic_discovery.js
 * Requires: npm install @anthropic-ai/sdk
 */

import Anthropic from "@anthropic-ai/sdk";

// Your Anthropic API key - get from console.anthropic.com -> API Keys
const ANTHROPIC_API_KEY = "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";

// Agent and environment IDs from Claude Console
const AGENT_ID = "agent_011CZxg4zsxySGfHHEpPDU4J";
const ENVIRONMENT_ID = "env_01F4Q94t6HUjMgzoWSZAWvci";

const client = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
  defaultHeaders: {
    "anthropic-beta": "managed-agents-2026-04-01",
  },
});

async function runTopicDiscovery() {
  console.log("Creating new Topic Discovery session...");

  // Create a new session
  const session = await client.beta.sessions.create({
    agent: AGENT_ID,
    environment_id: ENVIRONMENT_ID,
    title: "Topic Discovery - Weekly Run",
  });

  const sessionId = session.id;
  console.log(`Session created: ${sessionId}`);
  console.log("Sending trigger message...");

  // Send the trigger message
  await client.beta.sessions.events.send(sessionId, {
    events: [
      {
        type: "user.message",
        content: [
          {
            type: "text",
            text: "Run the full topic discovery workflow now. Start by fetching the GSC credentials from Supabase, then pull search data, score opportunities, and deliver the top 5 content briefs.",
          },
        ],
      },
    ],
  });

  console.log("Agent is running... streaming output:\n");
  console.log("=".repeat(60));

  // Stream the results
  const stream = await client.beta.sessions.events.stream(sessionId);

  for await (const event of stream) {
    if (event.type === "agent.message") {
      if (event.content) {
        for (const block of event.content) {
          if (block.type === "text") {
            process.stdout.write(block.text);
          }
        }
      }
    } else if (event.type === "agent.tool_use") {
      console.log(`\n[Tool: ${event.name || "unknown"}]`);
    } else if (event.type === "session.status_idle") {
      console.log("\n" + "=".repeat(60));
      console.log("Agent finished.");
      break;
    }
  }

  console.log(`\nSession ID: ${sessionId}`);
  console.log(
    `View in Console: https://platform.claude.com/sessions/${sessionId}`
  );
}

runTopicDiscovery().catch((err) => {
  console.error("Error:", err.message);
  if (err.status) console.error("Status:", err.status);
  if (err.error) console.error("Details:", JSON.stringify(err.error, null, 2));
  process.exit(1);
});
