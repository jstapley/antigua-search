#!/usr/bin/env node
/**
 * AntiguaSearch Content Writer - Session Trigger
 * Run: node run_content_writer.js <topic-index>
 *   e.g. node run_content_writer.js 0
 * Run with no args to list available topics.
 */

import Anthropic from "@anthropic-ai/sdk";
import { TOPICS, listTopics } from "./topic-queue.js";

const ANTHROPIC_API_KEY = "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";
const ENVIRONMENT_ID = "env_01F4Q94t6HUjMgzoWSZAWvci";
const AGENT_ID = "agent_011CZycB68wWHhGjVwEUg8jX";

const client = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
  defaultHeaders: {
    "anthropic-beta": "managed-agents-2026-04-01",
  },
});

const topicIndex = parseInt(process.argv[2], 10);

if (process.argv[2] === undefined || isNaN(topicIndex)) {
  listTopics();
  process.exit(0);
}

if (topicIndex < 0 || topicIndex >= TOPICS.length) {
  console.error(`Error: topic index ${topicIndex} out of range (0-${TOPICS.length - 1}).`);
  listTopics();
  process.exit(1);
}

const topic = TOPICS[topicIndex];

async function runContentWriter() {
  console.log(`\nTopic [${topicIndex}]: ${topic.title}`);
  console.log("Creating Content Writer session...");

  const session = await client.beta.sessions.create({
    agent: AGENT_ID,
    environment_id: ENVIRONMENT_ID,
    title: topic.session_title,
  });

  const sessionId = session.id;
  console.log(`Session created: ${sessionId}`);
  console.log("Sending topic brief...\n");

  await client.beta.sessions.events.send(sessionId, {
    events: [
      {
        type: "user.message",
        content: [
          {
            type: "text",
            text: topic.brief,
          },
        ],
      },
    ],
  });

  console.log("Agent is working... streaming output:\n");
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
      console.log("Agent paused - awaiting your outline approval.");
      console.log(`\nTopic:      ${topic.title}`);
      console.log(`Session ID: ${sessionId}`);
      console.log(`\nTo approve the outline, run:`);
      console.log(`node approve_outline.js ${sessionId}`);
      break;
    }
  }
}

runContentWriter().catch((err) => {
  console.error("Error:", err.message);
  if (err.status) console.error("Status:", err.status);
  if (err.error) console.error("Details:", JSON.stringify(err.error, null, 2));
  process.exit(1);
});