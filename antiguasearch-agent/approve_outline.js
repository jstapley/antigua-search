#!/usr/bin/env node
/**
 * AntiguaSearch - Approve outline and trigger full post writing
 * Run: node approve_outline.js [SESSION_ID]
 * Or with custom feedback: node approve_outline.js [SESSION_ID] "change section 3 to cover..."
 */

import Anthropic from "@anthropic-ai/sdk";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const sessionId = process.argv[2];
const feedback = process.argv[3] || "Approved";

if (!sessionId) {
  console.error("Usage: node approve_outline.js SESSION_ID [optional feedback]");
  process.exit(1);
}

const client = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
  defaultHeaders: {
    "anthropic-beta": "managed-agents-2026-04-01",
  },
});

async function approveOutline() {
  console.log(`Sending to session: ${sessionId}`);
  console.log(`Message: "${feedback}"\n`);

  await client.beta.sessions.events.send(sessionId, {
    events: [
      {
        type: "user.message",
        content: [{ type: "text", text: feedback }],
      },
    ],
  });

  console.log("Agent is writing the full post...\n");
  console.log("=".repeat(60));

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
      console.log("Post is ready.");
      console.log(`\nTo publish, run:`);
      console.log(`node approve_outline.js ${sessionId} "Publish"`);
      break;
    }
  }
}

approveOutline().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});