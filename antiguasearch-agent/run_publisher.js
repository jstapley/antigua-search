#!/usr/bin/env node
/**
 * AntiguaSearch Publisher Agent - Trigger Script
 * Pushes the Sailing Week post to Supabase as a draft
 * Run: node run_publisher.js
 */

import Anthropic from "@anthropic-ai/sdk";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ENVIRONMENT_ID = "env_01F4Q94t6HUjMgzoWSZAWvci";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJobGtldG5wamF6Yndwemlya2V3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTIzMTU5MywiZXhwIjoyMDg0ODA3NTkzfQ.bWLUlhQOExCHbjTcaLzJ_psQor8moOk-DLwNVSByWNE";

// Agent 3 ID - paste after creating in Console
const AGENT_ID = "agent_011CZyde75s89eg4aBKYeb3d";

const client = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
  defaultHeaders: {
    "anthropic-beta": "managed-agents-2026-04-01",
  },
});

// Publisher payload from the Content Writing Agent output
const PUBLISHER_PAYLOAD = {
  title: "Antigua Sailing Week 2026: The Spectator's Complete Guide",
  slug: "antigua-sailing-week-2026-spectator-guide",
  excerpt: "Plan your visit to Antigua Sailing Week 2026 (April 22\u201326). Best spectator spots, beach festivals, English Harbour bar scene, and where to stay near Nelson\u2019s Dockyard.",
  featured_image: "https://rhlketnpjazbwpzirkew.supabase.co/storage/v1/object/public/listing-images/blog-images/antigua-sailing-week.jpg",
  author: "AntiguaSearch Team",
  status: "draft",
  meta_title: "Antigua Sailing Week 2026 Spectator Guide | AntiguaSearch",
  meta_description: "Antigua Sailing Week 2026 runs April 22\u201326. Best spectator spots, beach festivals, English Harbour bar scene, and where to stay near Nelson\u2019s Dockyard.",
  tags: ["Sailing Week", "English Harbour", "Antigua Events", "St. Paul", "Boating Antigua", "Caribbean Sailing", "Things To Do Antigua"],
  faq_schema: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "When are the exact dates for Antigua Sailing Week 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The 57th Antigua Sailing Week runs April 22\u201326, 2026. Registration and the welcome celebration take place on April 22 at Nelson's Dockyard in English Harbour, St. Paul. The pre-event Reggae in the Park concert runs the evening of April 21. The final awards ceremony is held on April 26 as the fleet returns to Nelson's Dockyard."
        }
      },
      {
        "@type": "Question",
        name: "Do I need to be a sailor to enjoy Antigua Sailing Week?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Not at all. Around 5,000 spectators attend Antigua Sailing Week every year, the vast majority land-based. Vantage points at Shirley Heights, Fort Charlotte, and along the south coast are free and accessible to all. The Riddim & Tides beach festival at Ffryes Beach on April 25 is a free, all-day public event."
        }
      },
      {
        "@type": "Question",
        name: "What is the new format for Antigua Sailing Week in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The 2026 edition is reimagined as a 4-day destination sailing experience. The fleet completes a point-to-point circumnavigation of Antigua rather than racing the same south coast course each day. Stops include Nonsuch Bay on April 23, Maiden Island Little Jumby on April 24, Ffryes Beach on April 25, and Nelson's Dockyard on April 26."
        }
      },
      {
        "@type": "Question",
        name: "What are the best free things to do during Sailing Week as a spectator?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The vantage points along Antigua's south coast including Shirley Heights, Fort Charlotte, Windward Beach, Rendezvous Beach, Carlisle Bay, and Morris Bay are all free. The Riddim & Tides beach festival at Ffryes Beach on April 25 is free and open to the public. The Middle Ground Trail hike from Nelson's Dockyard to Fort Berkley is free with exceptional harbour views."
        }
      },
      {
        "@type": "Question",
        name: "How far in advance should I book accommodation for Antigua Sailing Week?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As early as possible. English Harbour accommodation sells out months before the event every year. Properties inside or closest to Nelson's Dockyard, including Admiral's Inn, The Inn at English Harbour, and South Point, typically book up first."
        }
      }
    ]
  }
};

// Note: Full markdown content is passed separately due to length
// The agent will receive it as part of the message
const FULL_CONTENT = `TL;DR: The 57th Antigua Sailing Week runs April 22–26, 2026 in a brand-new format. Yachts circumnavigate the island, stopping at Nonsuch Bay, Little Jumby Bay, and Ffryes Beach before returning to Nelson's Dockyard. You don't need a boat. Vantage points, beach festivals, helicopter rides, and the legendary English Harbour bar scene make this the Caribbean's most spectacular week for spectators.

---

Every year, around 5,000 spectators descend on Antigua's south coast for Sailing Week. Most never touch a rope. They come for the colour, the buzz, the salty air, and parties that run until well past sunset. Antigua Sailing Week 2026 is the 57th edition of the Caribbean's most iconic regatta, running April 22–26 at English Harbour. And this year, everything is different.

For decades, races took place off the same stretch of south coast. Spectators clustered around Shirley Heights and the Dockyard. That model worked well. But the 2026 format blows it wide open. The fleet now sails a full coastal circumnavigation of Antigua, stopping at a different bay or beach each night. That means the action reaches every corner of the island.

Beach festivals, helicopter chases, hillside breakfasts, and the legendary English Harbour bar crawl all sit alongside world-class racing. Whether you're a lifelong sailing fan or simply looking for the best week of your Caribbean trip, this guide covers everything. Dates, vantage points, events, transport, and where to stay. All updated for 2026.

## What Is Antigua Sailing Week 2026 (And What's New This Year)?

**The 57th Antigua Sailing Week runs April 22–26, 2026 at English Harbour in St. Paul. This year marks the biggest format change in the event's history. Instead of racing the same south coast course each day, the fleet completes a 4-day point-to-point circumnavigation of Antigua, anchoring at a new destination every night.**

The history here is worth knowing. [Antigua Sailing Week started in 1968](https://sailingweek.com/the-race/our-history/) when local hoteliers and sailing enthusiasts organised a regatta to extend the Caribbean tourism season. What began with a handful of boats from the US, Canada, and the Caribbean grew into one of the world's most recognised regattas. It now draws an average of [100 yachts, 1,500 participants, and 5,000 spectators annually](https://en.wikipedia.org/wiki/Antigua_Sailing_Week).

For 2026, the organisers made a bold decision. [The event is now reimagined as a 4-day destination sailing experience tracing the coastline of Antigua](https://sailingweek.com/antigua-sailing-weeks-evolution-a-return-to-destination-sailing/). Competitors depart from English Harbour, sail anti-clockwise around the island, and return to Nelson's Dockyard on the final day.

The change opens the event up for everyone. Cruising yachts, charter boats, and liveaboards are encouraged to join alongside competitive racers. For spectators, the fleet now moves through bays, beaches, and headlands right around the island. You can watch from more places than ever before.

## The 2026 Route Day by Day: Where the Fleet Goes

This is the heart of the new format. Each day the fleet sails to a fresh destination with shoreside events at every stop.

**April 22: English Harbour (Welcome Day)**

The fleet gathers at Nelson's Dockyard for registration and briefings. The evening brings a cultural welcome celebration on the Dockyard lawn, including a complimentary rum hour from 5–6 pm for participants. This is the easiest day to mix with sailors before racing begins. Wander the Dockyard, watch yachts arriving, and settle into the atmosphere that will carry through the week.

This is also your best evening to get a restaurant reservation locked in. Dining spots in [St. Paul parish](https://www.antiguasearch.com/parish/st-paul) fill up fast once the fleet is in.

**April 23: Nonsuch Bay (East Coast Day)**

[The fleet sails along Antigua's eastern coastline, passing Indian Creek, Mamora Bay, and Willoughby Bay before heading north past Half Moon Bay and Green Island to Nonsuch Bay](https://sailingweek.com/antigua-sailing-week-a-new-way-to-experience-antiguas-stunning-destinations/). A welcome cocktail and beach barbecue hosted by Breeze at Nonsuch Bay follows. From land, Half Moon Bay is a superb place to watch the fleet round the headland. It is one of Antigua's famous 365 beaches, one for every day of the year.

**April 24: Maiden Island (Little Jumby)**

The fleet reaches northward from Nonsuch Bay to anchor off Maiden Island. The Hut at Little Jumby hosts a 3pm beach party with sundowners, music, and dining. The north coast offers stunning aerial views for those booking the Chase the Race helicopter experience.

**April 25: Ffryes Beach (West Coast Day + Riddim & Tides)**

This is the biggest land-based day of the entire week. [Yachts pass Dickenson Bay, St. John's Harbour, Five Islands, and Jolly Beach before anchoring off Ffryes Bay Beach](https://sailingweek.com/antigua-sailing-week-a-new-way-to-experience-antiguas-stunning-destinations/), one of Antigua's most celebrated stretches of white sand. The new Heineken Riddim & Tides beach festival runs all day here with live DJs, local food vendors, and an offshore boat tie-up. It is free and open to the public.

**April 26: Nelson's Dockyard (Final Day)**

[The fleet makes a memorable return sail into Nelson's Dockyard, a UNESCO World Heritage Site](https://sailingweek.com/antigua-sailing-week-a-new-way-to-experience-antiguas-stunning-destinations/). An optional morning hike sets the scene before the final awards ceremony and closing celebrations. Position yourself near the Dockyard entrance and watch the yachts come in one by one.

## What Are the Best Spectator Vantage Points for Antigua Sailing Week?

**Shirley Heights is the undisputed number one spot. It towers above English and Falmouth Harbours with a panoramic view of the south coast and the fleet streaming out to sea. But there are six other excellent vantage points along the coastline, all free and reachable on foot or by car.**

**Shirley Heights Lookout:** [On the opening race day, Shirley Heights hosts the famous ASW breakfast from 8am to 11am](https://sailingweek.com/spectators/race-vantage-points/), with local food, bush tea, and a front-row view as the first starts unfold.

**Fort Charlotte and Carpenters Rock:** [Some of the best views on the south coast come from Carpenters Rock, about 15 minutes along the headland from Galleon Beach](https://sailingweek.com/spectators/race-vantage-points/). Quieter than Shirley Heights with unobstructed sightlines.

**Fort Berkley and the Middle Ground Trail:** [The Middle Ground Trail runs from Nelson's Dockyard out to Fort Berkley with multiple natural viewing platforms](https://sailingweek.com/spectators/race-vantage-points/). Allow about 45 minutes each way and bring water.

**Ffryes Beach (April 25 only):** On April 25, Ffryes Beach is the best vantage point on the island. The fleet anchors directly offshore. The Riddim & Tides festival fills the beach with music and food. Nothing else comes close on that day.

## The Social Scene: Parties, Events, and the English Harbour Bar Trail

**Reggae in the Park (April 21):** [The 15th edition features Caribbean artist Luciano the Messenjah alongside Antigua's best reggae talent](https://antiguanewsroom.com/antigua-sailing-week-unveils-new-format-as-57th-regatta-adapts-to-modern-sailing-trends/). This is the traditional kick-off, drawing a huge local and visitor crowd.

**Riddim & Tides Beach Festival (April 25):** [Riddim & Tides blends sailing, music, beach vibes, and island tastes into one unforgettable afternoon on Ffryes Beach](https://sailingweek.com/best-of-asw-2026-beach-festivities-join-the-riddim-tides-celebration-at-ffryes-beach/). Live DJs, Antiguan entertainers, local food vendors, and a fleet of boats rafted offshore. Free and open to everyone.

**The English Harbour Bar Trail:** After racing, the streets of English Harbour light up. Cloggy's at the Antigua Yacht Club Marina is considered one of the greatest sailor's bars in the world. Trappas is always packed with locals and sailors. Abracadabra's fires up the DJ after dinner. Skullduggery Cafe is great for early evening espresso martinis.

Are you a bar, restaurant, or tour operator in English Harbour? Get in front of thousands of Sailing Week visitors by [adding your listing to AntiguaSearch.com](https://www.antiguasearch.com/add-listing).

Browse [restaurants and cafes near English Harbour](https://www.antiguasearch.com/category/restaurants-cafes) to plan your dining before you go.

## Can You Chase the Race Without a Boat?

**Yes. Two official Chase the Race experiences put non-sailors right in the middle of the action: a 30-minute helicopter tour above the fleet via CalvinAir, or a catamaran ride alongside it via Wadadli Cats. Both book out fast.**

Both options sell out early. Book via the [official ASW Chase the Race page](https://sailingweek.com/chase-the-race/) as soon as you confirm your dates. For additional on-water experiences, browse [boating and marine listings in Antigua](https://www.antiguasearch.com/category/boating-marine) and [tours and activities](https://www.antiguasearch.com/category/tours) on AntiguaSearch.

## Where to Stay Near English Harbour for Sailing Week

Accommodation in the English Harbour area sells out months in advance during ASW. Book early.

**The Inn at English Harbour (Luxury):** [Set on Freeman's Bay within Antigua's only national park, with a private beach, heated pool, spa, and two restaurants](https://www.theinnantigua.com/). Holds a TripAdvisor Travellers' Choice Award. The closest luxury option to the action.

**Admiral's Inn & Gunpowder Suites (Boutique, Historic):** Literally inside Nelson's Dockyard, this is the most atmospheric place to stay. [The restored buildings sit at the heart of the UNESCO World Heritage Site](https://www.booking.com/city/ag/english-harbour-town.html).

**Copper & Lumber Store Hotel (Boutique, Character):** Another historic property inside the Dockyard, occupying a converted Georgian warehouse dating to the 1780s.

**Antigua Yacht Club Marina Resort (Mid-Range, Social):** Bars, restaurants, and live music on the doorstep. Sits at the social centre of the English Harbour scene during Sailing Week.

Browse [accommodation options across Antigua](https://www.antiguasearch.com/category/accommodation) on AntiguaSearch to find the right fit.

## How Do I Get to English Harbour from the Airport?

**From V.C. Bird International Airport, English Harbour is 13 miles south. A taxi takes approximately 25 minutes and costs around $50–65 USD. It is the fastest, most practical option for most visitors.**

[Public minibuses can get you there for around $3 but take about 1 hour 38 minutes with two transfers](https://www.rome2rio.com/s/Antigua-Airport-ANU/English-Harbour). The smartest strategy for the full week is to rent a car. A car lets you reach Shirley Heights, Fort Charlotte, Rendezvous Beach, and Ffryes Beach on your own schedule.

## Antigua Sailing Week 2026 Is For Everyone

You don't need to know a mainsail from a mizzen to have the time of your life this April. Three things to remember. First, book accommodation now. Second, anchor your week around Shirley Heights on the morning of April 23 and Ffryes Beach on April 25 for Riddim & Tides. Third, give yourself at least one full evening in the English Harbour bar scene.

[Explore everything St. Paul parish has to offer during Sailing Week](https://www.antiguasearch.com/parish/st-paul), from restaurants and tours to accommodation and marine services.

---

## Frequently Asked Questions

**When are the exact dates for Antigua Sailing Week 2026?**

[The 57th Antigua Sailing Week runs April 22–26, 2026](https://sailingweek.com/about-asw-2026/). Registration and the welcome celebration take place on April 22 at Nelson's Dockyard in English Harbour. The pre-event Reggae in the Park concert runs the evening of April 21. The final awards ceremony is held on April 26 as the fleet returns to Nelson's Dockyard.

**Do I need to be a sailor to enjoy Antigua Sailing Week?**

Not at all. [Around 5,000 spectators attend Antigua Sailing Week every year](https://en.wikipedia.org/wiki/Antigua_Sailing_Week), the vast majority land-based. Vantage points at Shirley Heights and along the south coast are free and accessible to all. The Riddim & Tides beach festival at Ffryes Beach on April 25 is a free, all-day public event.

**What is the new format for Antigua Sailing Week in 2026?**

[The 2026 edition is reimagined as a 4-day destination sailing experience](https://sailingweek.com/antigua-sailing-weeks-evolution-a-return-to-destination-sailing/). The fleet completes a point-to-point circumnavigation of Antigua with stops at Nonsuch Bay (April 23), Maiden Island Little Jumby (April 24), Ffryes Beach (April 25), and Nelson's Dockyard (April 26).

**What are the best free things to do during Sailing Week as a spectator?**

[The vantage points along Antigua's south coast including Shirley Heights, Fort Charlotte, Windward Beach, and Rendezvous Beach are all free](https://sailingweek.com/spectators/race-vantage-points/). The Riddim & Tides beach festival at Ffryes Beach on April 25 is free and open to the public. The Middle Ground Trail hike delivers exceptional harbour views at no cost.

**How far in advance should I book accommodation for Antigua Sailing Week?**

As early as possible. English Harbour accommodation sells out months before the event. Properties inside or closest to Nelson's Dockyard, including Admiral's Inn, The Inn at English Harbour, and South Point, typically book up first. Treat accommodation booking as your very first priority.`;

async function runPublisher() {
  console.log("Creating Publisher session...");

  const session = await client.beta.sessions.create({
    agent: AGENT_ID,
    environment_id: ENVIRONMENT_ID,
    title: "Publish Sailing Week 2026 Post",
  });

  const sessionId = session.id;
  console.log(`Session created: ${sessionId}`);
  console.log("Sending publisher payload...\n");

  const message = `Please publish the following blog post to AntiguaSearch.com as a draft.

The Supabase service role key is: ${SUPABASE_SERVICE_ROLE_KEY}

Use this key directly for all Supabase API calls. Store it as SERVICE_KEY.

Here is the publisher payload:

TITLE: ${PUBLISHER_PAYLOAD.title}
SLUG: ${PUBLISHER_PAYLOAD.slug}
EXCERPT: ${PUBLISHER_PAYLOAD.excerpt}
FEATURED_IMAGE: ${PUBLISHER_PAYLOAD.featured_image}
AUTHOR: ${PUBLISHER_PAYLOAD.author}
STATUS: draft
META_TITLE: ${PUBLISHER_PAYLOAD.meta_title}
META_DESCRIPTION: ${PUBLISHER_PAYLOAD.meta_description}
TAGS: ${JSON.stringify(PUBLISHER_PAYLOAD.tags)}

CONTENT:
${FULL_CONTENT}

FAQ_SCHEMA:
${JSON.stringify(PUBLISHER_PAYLOAD.faq_schema, null, 2)}

Run the pre-flight checks first, then insert into the blog_posts table.`;

  await client.beta.sessions.events.send(sessionId, {
    events: [{
      type: "user.message",
      content: [{ type: "text", text: message }],
    }],
  });

  console.log("Publisher agent running...\n");
  console.log("=".repeat(60));

  let attempt = 0;
  const maxRetries = 5;

  while (attempt < maxRetries) {
    try {
      if (attempt > 0) console.log(`\nReconnecting (attempt ${attempt + 1})...`);
      const stream = await client.beta.sessions.events.stream(sessionId);

      for await (const event of stream) {
        if (event.type === "agent.message") {
          for (const block of event.content || []) {
            if (block.type === "text") process.stdout.write(block.text);
          }
        } else if (event.type === "agent.tool_use") {
          console.log(`\n[Tool: ${event.name || "unknown"}]`);
        } else if (event.type === "session.status_idle") {
          console.log("\n" + "=".repeat(60));
          console.log("Publisher finished.");
          console.log(`\nFull transcript: https://platform.claude.com/sessions/${sessionId}`);
          return;
        }
      }
      attempt++;
      await new Promise(r => setTimeout(r, 3000));
    } catch (err) {
      attempt++;
      console.log(`\nConnection dropped. Retrying in 3s... (${attempt}/${maxRetries})`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log("\nCheck Console for output:");
  console.log(`https://platform.claude.com/sessions/${sessionId}`);
}

runPublisher().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});