-- ============================================================
-- content_topics: AI content pipeline queue
-- Run this in Supabase SQL editor
-- ============================================================

CREATE TABLE IF NOT EXISTS "public"."content_topics" (
  "id"            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  "title"         text        NOT NULL,
  "brief"         text        NOT NULL,
  "urgency"       text        DEFAULT 'MEDIUM'  CHECK (urgency IN ('CRITICAL','HIGH','MEDIUM','LOW')),
  "status"        text        DEFAULT 'queued'  CHECK (status  IN ('queued','writing','outline_pending','draft_ready','published','failed')),
  "session_id"    text,
  "outline"       text,
  "draft"         text,
  "error_message" text,
  "created_at"    timestamptz DEFAULT now(),
  "updated_at"    timestamptz DEFAULT now()
);

ALTER TABLE "public"."content_topics" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access" ON "public"."content_topics"
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND   user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND   user_profiles.role = 'admin'
    )
  );

-- ============================================================
-- Seed: 10 topics from October 2026 GA analytics review
-- ============================================================

INSERT INTO "public"."content_topics" (title, brief, urgency) VALUES

(
  'Christmas Shopping in Antigua 2026: Markets, Malls & Local Finds',
  $$
APPROVED TOPIC BRIEF - Please begin the full writing workflow.

TOPIC: Christmas Shopping in Antigua 2026: Markets, Malls & Local Finds
PRIMARY KEYWORD: christmas shopping antigua
SUPPORTING KEYWORDS: antigua christmas market, twist mall antigua, woods centre christmas, antigua gifts local
TARGET CATEGORY: https://www.antiguasearch.com/category/shopping
TARGET PARISH: https://www.antiguasearch.com/parish/saint-johns
SEASONAL URGENCY: CRITICAL - Christmas is 8 weeks away. Searches for gift ideas, markets, and local shopping are ramping up now.
COMPETITOR GAP: No editorial guide exists covering all shopping options in one place — malls, markets, local craft vendors, and duty-free. Existing results are thin listicles or outdated.
SUGGESTED ANGLE: A practical gift-hunter's guide covering the major malls (Twist, Woods), the Heritage Quay duty-free strip, St. John's Public Market, pop-up craft markets, and tips for finding authentic local products (hot sauce, rum, art, pottery).
RECOMMENDED IMAGE: antigua-christmas-shopping.jpg
TRAFFIC POTENTIAL: High - peaks from mid-November through Christmas Eve.

Begin with Step 1 (sitemap scan), then research, then present the outline for my approval before writing anything.
$$,
  'CRITICAL'
),

(
  'New Year''s Eve in Antigua 2026: Best Events, Parties & Spots',
  $$
APPROVED TOPIC BRIEF - Please begin the full writing workflow.

TOPIC: New Year's Eve in Antigua 2026: Best Events, Parties & Spots
PRIMARY KEYWORD: new years eve antigua 2026
SUPPORTING KEYWORDS: antigua nye party, fireworks antigua 2026, new year antigua barbuda, english harbour nye
TARGET CATEGORY: https://www.antiguasearch.com/category/events-entertainment
TARGET PARISH: https://www.antiguasearch.com/parish/saint-johns
SEASONAL URGENCY: CRITICAL - NYE searches begin in earnest from mid-November. Tourists booking travel and locals planning nights out are actively searching now.
COMPETITOR GAP: Only tourism board pages and resort event listings exist. No independent editorial roundup covers beach parties, restaurant dinners, English Harbour events, and fireworks viewing spots in a single guide.
SUGGESTED ANGLE: Cover the full spectrum — upscale resort gala dinners, beach parties (Jolly Harbour, Dickenson Bay), English Harbour bar scene, best fireworks vantage points, and where locals actually go. Include practical tips: reservations needed, pricing expectations, transport options late at night.
RECOMMENDED IMAGE: antigua-new-years-eve.jpg
TRAFFIC POTENTIAL: High - converts well for accommodation and restaurant bookings.

Begin with Step 1 (sitemap scan), then research, then present the outline for my approval before writing anything.
$$,
  'CRITICAL'
),

(
  'Antigua in November & December 2026: What to Expect',
  $$
APPROVED TOPIC BRIEF - Please begin the full writing workflow.

TOPIC: Antigua in November & December 2026: What to Expect
PRIMARY KEYWORD: antigua november december
SUPPORTING KEYWORDS: antigua weather november, antigua december holidays, antigua peak season, antigua christmas
TARGET CATEGORY: https://www.antiguasearch.com/category/travel-tourism
TARGET PARISH: https://www.antiguasearch.com/parishes
SEASONAL URGENCY: CRITICAL - Peak tourist season begins. Visitors planning trips are searching for weather, events, and what to expect right now.
COMPETITOR GAP: Most existing content is thin weather pages. No guide covers the full picture: start of peak season, post-hurricane relief, fishing season, events calendar, and the unique Christmas atmosphere.
SUGGESTED ANGLE: Frame as an insider guide for first-time visitors deciding whether to visit in Nov vs Dec. Cover weather, crowds, prices, key events, beach conditions, and why locals consider this their favourite time of year.
RECOMMENDED IMAGE: antigua-november-december.jpg
TRAFFIC POTENTIAL: High - evergreen seasonal traffic each year.

Begin with Step 1 (sitemap scan), then research, then present the outline for my approval before writing anything.
$$,
  'CRITICAL'
),

(
  'Renting a Car in Antigua 2026: Complete Guide',
  $$
APPROVED TOPIC BRIEF - Please begin the full writing workflow.

TOPIC: Renting a Car in Antigua 2026: Complete Guide
PRIMARY KEYWORD: renting a car in antigua
SUPPORTING KEYWORDS: car hire antigua, antigua car rental requirements, driving in antigua, antigua international driving permit
TARGET CATEGORY: https://www.antiguasearch.com/category/car-rentals
TARGET PARISH: https://www.antiguasearch.com/parishes
SEASONAL URGENCY: HIGH - The "getting around Antigua" blog post doubled in sessions MoM (100 to 203). Transport is a clear content cluster opportunity.
COMPETITOR GAP: Only rental company homepages and generic travel advisory pages rank. No independent editorial guide covers the full process: local vs international licence requirements, left-hand driving, road conditions, where to rent, and typical costs.
SUGGESTED ANGLE: Practical guide for visiting drivers — local driving permit requirement, which companies to use, what roads are like, parking in St John's, and tips that only locals know.
RECOMMENDED IMAGE: car-rental-antigua.jpg
TRAFFIC POTENTIAL: High - evergreen, high commercial intent.

Begin with Step 1 (sitemap scan), then research, then present the outline for my approval before writing anything.
$$,
  'HIGH'
),

(
  'Antigua Taxi Services 2026: Rates, Apps & How to Get Around',
  $$
APPROVED TOPIC BRIEF - Please begin the full writing workflow.

TOPIC: Antigua Taxi Services 2026: Rates, Apps & How to Get Around
PRIMARY KEYWORD: antigua taxi
SUPPORTING KEYWORDS: antigua taxi rates, taxi from airport antigua, antigua taxi app, how to get around antigua without a car
TARGET CATEGORY: https://www.antiguasearch.com/category/transport
TARGET PARISH: https://www.antiguasearch.com/parishes
SEASONAL URGENCY: HIGH - Companion piece to the top-performing "getting around without a car" post. Targets people who found that article and want specific taxi information.
COMPETITOR GAP: Only cruise port taxi rate sheets and tourism board pages exist. No guide covers official rates, how to find taxis, whether apps work, shared minibus routes, and airport arrival logistics.
SUGGESTED ANGLE: Definitive taxi guide covering: official government rate card, how to hail a taxi, airport pickup process, minibus routes for budget travellers, whether Uber/Bolt exist (they don't), and recommended local taxi companies with contacts.
RECOMMENDED IMAGE: antigua-taxi-guide.jpg
TRAFFIC POTENTIAL: High - especially strong for arriving tourists.

Begin with Step 1 (sitemap scan), then research, then present the outline for my approval before writing anything.
$$,
  'HIGH'
),

(
  'Best Beaches in Antigua You Can Reach by Bus or Taxi (No Car Needed)',
  $$
APPROVED TOPIC BRIEF - Please begin the full writing workflow.

TOPIC: Best Beaches in Antigua You Can Reach by Bus or Taxi (No Car Needed)
PRIMARY KEYWORD: antigua beaches without a car
SUPPORTING KEYWORDS: antigua beaches by bus, jolly beach taxi, dickenson bay antigua, antigua beach no rental car
TARGET CATEGORY: https://www.antiguasearch.com/category/beaches
TARGET PARISH: https://www.antiguasearch.com/parishes
SEASONAL URGENCY: HIGH - Third post in the transport cluster. "Getting around without a car" doubled in sessions. This post captures the follow-up search intent.
COMPETITOR GAP: Existing beach guides assume visitors have a car. No guide specifically addresses the large segment of tourists arriving by cruise ship or without a rental.
SUGGESTED ANGLE: Rank 8-10 beaches by how easy they are to reach without a car. Include transport option (which bus route, rough taxi fare), what each beach is like, and nearby listings from the AntiguaSearch directory.
RECOMMENDED IMAGE: antigua-beach-no-car.jpg
TRAFFIC POTENTIAL: Medium-High - strong cruise ship passenger segment.

Begin with Step 1 (sitemap scan), then research, then present the outline for my approval before writing anything.
$$,
  'HIGH'
),

(
  'Moving to Antigua from the US: A Practical Guide (2026)',
  $$
APPROVED TOPIC BRIEF - Please begin the full writing workflow.

TOPIC: Moving to Antigua from the US: A Practical Guide (2026)
PRIMARY KEYWORD: moving to antigua from the us
SUPPORTING KEYWORDS: relocating to antigua, antigua residency, expat antigua, cost of living antigua
TARGET CATEGORY: https://www.antiguasearch.com/category/real-estate
TARGET PARISH: https://www.antiguasearch.com/parishes
SEASONAL URGENCY: HIGH - US is the #2 traffic source (1,025 sessions in October). High-intent, high-engagement audience. Relocation content converts to premium listings and real estate leads.
COMPETITOR GAP: Only government immigration pages and a handful of expat blog posts exist. No current, comprehensive guide covers the full journey: visa/residency options, shipping belongings, banking, healthcare, schools, neighbourhoods.
SUGGESTED ANGLE: Written for the American professional or retiree seriously considering the move. Cover residency by investment vs long-stay permit, what to bring vs buy locally, which areas to live in, healthcare access, internet/connectivity, and honest pros/cons.
RECOMMENDED IMAGE: moving-to-antigua-from-us.jpg
TRAFFIC POTENTIAL: High - strong lead-gen for real estate and featured business listings.

Begin with Step 1 (sitemap scan), then research, then present the outline for my approval before writing anything.
$$,
  'HIGH'
),

(
  'Relocating from the UK to Antigua: What You Need to Know (2026)',
  $$
APPROVED TOPIC BRIEF - Please begin the full writing workflow.

TOPIC: Relocating from the UK to Antigua: What You Need to Know (2026)
PRIMARY KEYWORD: relocating from uk to antigua
SUPPORTING KEYWORDS: british expat antigua, antigua uk citizens, moving antigua from england, antigua residency uk
TARGET CATEGORY: https://www.antiguasearch.com/category/real-estate
TARGET PARISH: https://www.antiguasearch.com/parishes
SEASONAL URGENCY: HIGH - UK is the #4 traffic country (364 sessions). Post-Brexit, many British nationals are exploring Caribbean relocation.
COMPETITOR GAP: Almost no current editorial content exists for UK-to-Antigua relocation specifically. UK readers have different questions (driving on the left already, NHS vs private healthcare, HMRC implications).
SUGGESTED ANGLE: UK-specific angle — driving is already on the left (easy transition), NHS vs private healthcare comparison, HMRC tax residency rules, shipping times from the UK, British expat community, and which parts of Antigua feel most familiar.
RECOMMENDED IMAGE: relocating-uk-antigua.jpg
TRAFFIC POTENTIAL: Medium-High - niche but high commercial value audience.

Begin with Step 1 (sitemap scan), then research, then present the outline for my approval before writing anything.
$$,
  'HIGH'
),

(
  'Opening a Bank Account in Antigua as an Expat or New Resident (2026)',
  $$
APPROVED TOPIC BRIEF - Please begin the full writing workflow.

TOPIC: Opening a Bank Account in Antigua as an Expat or New Resident (2026)
PRIMARY KEYWORD: opening bank account antigua
SUPPORTING KEYWORDS: antigua bank account non-resident, acb bank antigua, cibc antigua, ecab antigua bank account
TARGET CATEGORY: https://www.antiguasearch.com/category/financial-services
TARGET PARISH: https://www.antiguasearch.com/parish/saint-johns
SEASONAL URGENCY: MEDIUM - Financial services content (banks, credit union, social security) consistently ranks in the top 10 blog posts. This fills a gap for relocating visitors.
COMPETITOR GAP: Only individual bank homepages exist. No guide compares all banks (ACB, CIBC, ECAB), documents required, how long it takes, or whether non-residents can open accounts.
SUGGESTED ANGLE: Step-by-step guide: which banks accept non-residents, required documents checklist, typical processing times, minimum balance requirements, and which bank is best for different needs.
RECOMMENDED IMAGE: antigua-bank-account-guide.jpg
TRAFFIC POTENTIAL: Medium - high engagement, strong listing cross-sell.

Begin with Step 1 (sitemap scan), then research, then present the outline for my approval before writing anything.
$$,
  'MEDIUM'
),

(
  'Where to Buy Building Materials in Antigua: Complete Guide',
  $$
APPROVED TOPIC BRIEF - Please begin the full writing workflow.

TOPIC: Where to Buy Building Materials in Antigua: Complete Guide
PRIMARY KEYWORD: building materials antigua
SUPPORTING KEYWORDS: hardware store antigua, antigua plumbing hardware, lumberyard antigua, construction supplies antigua
TARGET CATEGORY: https://www.antiguasearch.com/category/hardware-building-supplies
TARGET PARISH: https://www.antiguasearch.com/parishes
SEASONAL URGENCY: MEDIUM - October top listings were dominated by hardware/building supply stores. Post-hurricane building season is now underway.
COMPETITOR GAP: No editorial guide covers Antigua's building supply landscape. Contractors, homeowners, and developers have no reference point for where to source specific materials.
SUGGESTED ANGLE: Practical guide for contractors and homeowners covering the major suppliers: what each stocks, relative pricing, delivery options, and which to go to for specific needs (plumbing vs lumber vs roofing vs electrical).
RECOMMENDED IMAGE: building-materials-antigua.jpg
TRAFFIC POTENTIAL: Medium - strong B2B and local homeowner segment.

Begin with Step 1 (sitemap scan), then research, then present the outline for my approval before writing anything.
$$,
  'MEDIUM'
);
