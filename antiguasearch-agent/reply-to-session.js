#!/usr/bin/env node
/**
 * AntiguaSearch - Reply to existing agent session
 * Run: node reply_to_session.js
 */

import Anthropic from "@anthropic-ai/sdk";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// The session that just delivered the content briefs
const SESSION_ID = "sesn_011CZybLUgeEii571gYQfGNq";

const client = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
  defaultHeaders: {
    "anthropic-beta": "managed-agents-2026-04-01",
  },
});

async function replyToSession(message) {
  console.log(`Sending to session ${SESSION_ID}:`);
  console.log(`> ${message}\n`);

  // Send the approval message
  await client.beta.sessions.events.send(SESSION_ID, {
    events: [
      {
        type: "user.message",
        content: [
          {
            type: "text",
            text: message,
          },
        ],
      },
    ],
  });

  console.log("Streaming agent response...\n");
  console.log("=".repeat(60));

  // Stream the response
  const stream = await client.beta.sessions.events.stream(SESSION_ID);

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
      console.log("Done.");
      break;
    }
  }
}

// Approve Topic 1 - Sailing Week
replyToSession("Approve 1").catch((err) => {
  console.error("Error:", err.message);
  if (err.status) console.error("Status:", err.status);
  process.exit(1);
});