-- ============================================================
-- Sugar Ridge Homes — Demo Data (89 properties, ~$275M total)
-- WARNING: Deletes ALL existing properties, sales, and inquiries
-- Run this in your Supabase SQL editor
-- ============================================================
-- Property totals:
--   25 Villas  = $216,900,000
--   32 Condos  = $34,460,000
--   32 Lots    = $23,640,000
--   TOTAL      = $275,000,000
-- ============================================================

DELETE FROM sales;
DELETE FROM inquiries;
DELETE FROM properties;

-- ── VILLAS (25) ──────────────────────────────────────────────────────────────

INSERT INTO properties
  (name, slug, type, status, price, bedrooms, bathrooms, interior_sqft, total_sqft,
   completion_date, listed_at, description, features, sort_order)
VALUES

('Sea La Vie',        'sea-la-vie',        'villa', 'available', 2600000, 4, 4,  2229, 4415, 'Completed',  '2025-12-01',
 'A luxurious four-bedroom villa embodying the fusion of contemporary innovation and traditional Caribbean aesthetics, with vaulted ceilings and a heated infinity pool.',
 ARRAY['Heated infinity pool with swim-up bar','European-style kitchen with waterfall island','3 ensuite bedrooms with rain showers','Outdoor BBQ & entertainment deck','Backup generator','Covered parking for 2'], 1),

('Villa Vista',       'villa-vista',       'villa', 'available', 3400000, 4, 5,  5475, 5475, 'Completed',  '2025-12-01',
 'A 2-storey contemporary estate with west-facing ocean views over Jolly Harbour and Jolly Beach. Eco-conscious features throughout.',
 ARRAY['Saltwater pool with sunken fire pit','40,000-gallon cistern & rainwater harvesting','Solar power system','Fully furnished','11,975 sq.ft. lot','West-facing ocean views'], 2),

('Coral Crest',       'coral-crest',       'villa', 'available', 4200000, 4, 4,  3200, 5800, 'Completed',  '2026-01-15',
 'Perched on the hillside with panoramic coral sea views, blending natural stone and tropical hardwoods.',
 ARRAY['Infinity pool','Chef kitchen with butler pantry','Garden terrace','Smart home system','Rainwater harvesting','Carport for 2'], 3),

('Sunset Haven',      'sunset-haven',      'villa', 'available', 5500000, 5, 5,  4100, 7200, 'Completed',  '2026-01-15',
 'Designed to capture every shade of the Caribbean sunset, a masterclass in west-coast luxury.',
 ARRAY['Infinity edge pool','Outdoor kitchen & bar','5 ensuite bedrooms','Home cinema room','Solar power','EV charger'], 4),

('The Palms',         'the-palms',         'villa', 'reserved',  3800000, 4, 4,  3400, 5900, 'Completed',  '2026-01-15',
 'Framed by swaying palms, refined villa with seamless indoor-outdoor living and sweeping sea views.',
 ARRAY['Tiled pool with sundeck','Open-plan living','Mature tropical garden','Generator backup','Staff quarters','Double garage'], 5),

('Caribbean Pearl',   'caribbean-pearl',   'villa', 'available', 6200000, 5, 5,  4800, 8100, 'Q1 2026',   '2026-01-15',
 'A jewel on the hillside commanding breathtaking 180-degree sea views across the Caribbean.',
 ARRAY['Rooftop terrace with hot tub','Wine cellar','Home gym','Fully automated smart home','Solar & battery storage','6-car garage'], 6),

('Hillside Manor',    'hillside-manor',    'villa', 'available', 7500000, 5, 6,  5200, 9000, 'Q1 2026',   '2026-01-15',
 'A grand manor elevated above the community, offering unparalleled privacy and Caribbean Sea panoramas.',
 ARRAY['Double-infinity pool','Formal dining room','Library & study','Staff cottage','Tennis court','Helipad'], 7),

('Jolly Vista',       'jolly-vista',       'villa', 'available', 4900000, 4, 5,  3800, 6600, 'Completed',  '2026-01-15',
 'Overlooking Jolly Harbour marina, celebrating life on the water with nautical-inspired interiors.',
 ARRAY['Pool with marina views','Boat storage facility','Open-plan chef kitchen','4 ensuite bedrooms','Covered terrace','Solar panels'], 8),

('Azure Retreat',     'azure-retreat',     'villa', 'available', 8200000, 6, 6,  6100,10200, 'Q2 2026',   '2026-02-01',
 'An opulent six-bedroom retreat finished in azure blues and whites, reflecting the Caribbean sky.',
 ARRAY['Heated pool & spa','Private cinema','Dedicated gym','6 ensuite suites','Smart climate control','Underground parking'], 9),

('The Ridge House',   'the-ridge-house',   'villa', 'available', 9500000, 5, 6,  7200,12000, 'Q2 2026',   '2026-02-01',
 'Positioned at the development''s highest point with 360-degree island views — the definitive Sugar Ridge villa.',
 ARRAY['Wrap-around infinity pool','Rooftop observatory deck','Private guest wing','Chef''s & outdoor BBQ kitchen','Whole-home generator','Landscaped estate garden'], 10),

('Coconut Grove',     'coconut-grove',     'villa', 'sold',      3200000, 3, 3,  2800, 4900, 'Completed',  '2025-10-01',
 'Nestled in a grove of mature coconut palms, this intimate three-bedroom villa prioritises privacy and natural beauty.',
 ARRAY['Plunge pool','Tropical garden','Open-plan living','Outdoor shower','Solar power','Off-street parking'], 11),

('Panorama',          'panorama',          'villa', 'available',11000000, 6, 7,  8500,14000, 'Q2 2026',   '2026-02-01',
 'Panorama delivers an uninterrupted canvas of sea, sky, and island life from every single room.',
 ARRAY['Multi-level infinity pools','Private bar & lounge','6 suites each with terrace','Concierge-ready staff wing','EV charging station','Fully smart home'], 12),

('Seabreeze',         'seabreeze',         'villa', 'available', 5800000, 5, 5,  4400, 7600, 'Q1 2026',   '2026-01-15',
 'Designed to channel the constant trade-wind breeze, Seabreeze stays naturally cool with louvered architecture.',
 ARRAY['Lap pool','Outdoor yoga deck','Open-plan kitchen with island','Covered dining terrace','Solar hot water','Rainwater tank'], 13),

('Hibiscus Hill',     'hibiscus-hill',     'villa', 'reserved',  6500000, 5, 6,  5100, 8800, 'Q1 2026',   '2026-01-15',
 'Named for the vibrant hibiscus that frame its entrance, marrying tropical colour with refined elegance.',
 ARRAY['Lagoon-style pool','Floral courtyard garden','Outdoor kitchen','5 ensuite bedrooms','Backup generator','Double carport'], 14),

('The Lantern',       'the-lantern',       'villa', 'available', 4100000, 4, 4,  3300, 5700, 'Completed',  '2026-01-15',
 'The Lantern glows with warm timber interiors and copper fittings, casting golden light across sea-view terraces.',
 ARRAY['Heated pool','Timber-clad interiors','Copper fixture details','Covered veranda','Solar energy','Private parking'], 15),

('Westwind',          'westwind',          'villa', 'available', 7200000, 5, 5,  5600, 9400, 'Q2 2026',   '2026-02-01',
 'Facing due west and calibrated for sunset living — every principal room faces the Caribbean horizon.',
 ARRAY['Sunset-facing infinity pool','Double master suites','Media room','Outdoor dining pavilion','Whole-house water filtration','Battery storage'], 16),

('Mango Bay',         'mango-bay',         'villa', 'sold',      8800000, 6, 6,  6800,11200, 'Completed',  '2025-10-01',
 'A six-bedroom estate celebrating Caribbean abundance, set within a mature mango orchard on the hillside.',
 ARRAY['Infinity pool with Bali beds','Mango orchard','Outdoor cinema terrace','Butler kitchen','Solar & wind energy','Staff quarters'], 17),

('The Sanctuary',     'the-sanctuary',     'villa', 'available',12500000, 7, 7,  9200,15500, 'Q3 2026',   '2026-03-01',
 'Secluded, serene, and utterly spectacular — The Sanctuary delivers seven-bedroom tranquility at altitude.',
 ARRAY['Multi-pool complex','Meditation garden','Private wellness spa','Cinema & gaming lounge','Full-time staff accommodation','Secure underground garage'], 18),

('Tradewinds',        'tradewinds',        'villa', 'available', 9200000, 6, 6,  7100,11800, 'Q2 2026',   '2026-02-01',
 'Built to harness the Antiguan trade winds, achieving passive cooling through masterful architecture.',
 ARRAY['Sail-shaded terrace','Natural ventilation design','Infinity pool','Wind energy integration','6 ensuite bedrooms','Double garage'], 19),

('Bougainvillea',     'bougainvillea',     'villa', 'available', 6800000, 5, 5,  5300, 9000, 'Q2 2026',   '2026-02-01',
 'Cascades of bougainvillea colour this hillside villa, where vivid blooms contrast with crisp white architecture.',
 ARRAY['Flower-framed pool deck','Artist studio','Rooftop terrace','Landscaped garden rooms','Solar power','Artisan kitchen'], 20),

('The Summit',        'the-summit',        'villa', 'available',15000000, 7, 8, 11000,18000, 'Q3 2026',   '2026-03-01',
 'Perched at the apex of Sugar Ridge, The Summit is a seven-bedroom estate of rare distinction.',
 ARRAY['Olympic-size pool','360-degree viewing tower','Private helipad','Spa & wellness centre','Resident caretaker suite','8-car motor court'], 21),

('Antigua Blue',      'antigua-blue',      'villa', 'available',18500000, 8, 8, 13500,22000, 'Q3 2026',   '2026-03-01',
 'Inspired by the legendary Antiguan sea, a landmark estate finished entirely in ocean-inspired tones.',
 ARRAY['2,000 sq.ft. pool complex','Private art gallery','Boat launch access','8 oceanview suites','Zero-carbon energy system','Private security suite'], 22),

('Crown Jewel',       'crown-jewel',       'villa', 'available',22000000, 8, 9, 15000,24500, 'Q4 2026',   '2026-03-01',
 'The Crown Jewel of Sugar Ridge — an eight-bedroom trophy estate redefining Caribbean ultra-luxury.',
 ARRAY['Lagoon pool & waterfall feature','Private nightclub','Gourmet restaurant kitchen','Separate guest villa','Concierge services','Panic room & vault'], 23),

('The Grand',         'the-grand',         'villa', 'available',25000000,10,10, 18000,30000, 'Q4 2026',   '2026-03-01',
 'Simply, the finest residential estate ever offered in Antigua. The Grand sets a new benchmark for Caribbean luxury.',
 ARRAY['5,000 sq.ft. leisure complex','IMAX cinema room','Full staff village','Ballroom & event space','Hypercar garage','Private airstrip access'], 24),

('Harbor View',       'harbor-view',       'villa', 'sold',      5500000, 5, 5,  4200, 7100, 'Completed',  '2025-10-01',
 'Overlooking Jolly Harbour, Harbor View combines maritime charm with contemporary luxury in perfect proportion.',
 ARRAY['Harbor-view terrace','Teak-deck pool','Nautical-themed interiors','Direct marina access','Dock storage','Chef kitchen'], 25);

-- ── CONDOS (32) ──────────────────────────────────────────────────────────────
-- Building: 4 floors × 8 units | 2 bed / 2 bath / 1,200 sq.ft. each
-- Floor 1: $880K–$980K | Floor 2: $1,000K–$1,080K
-- Floor 3: $1,100K–$1,180K | Floor 4: $1,200K

INSERT INTO properties
  (name, slug, type, status, price, bedrooms, bathrooms, interior_sqft,
   completion_date, listed_at, description, features, sort_order)
VALUES
-- Floor 1
('Unit 101','unit-101','condo','sold',     880000,2,2,1200,'Completed','2025-12-01','West-facing ground-floor unit with private terrace and Caribbean Sea views.',ARRAY['Private terrace','Caribbean Sea views','Air conditioning','Built-in WFH station','Pool & fitness access','Café & restaurant'],101),
('Unit 102','unit-102','condo','available',880000,2,2,1200,'Completed','2026-01-01','West-facing ground-floor unit with private terrace and Caribbean Sea views.',ARRAY['Private terrace','Caribbean Sea views','Air conditioning','Built-in WFH station','Pool & fitness access','Café & restaurant'],102),
('Unit 103','unit-103','condo','sold',     920000,2,2,1200,'Completed','2025-12-01','Ground-floor corner unit with extended terrace and panoramic sea outlook.',ARRAY['Corner position','Extended terrace','Caribbean Sea views','Air conditioning','Pool & fitness access','Yoga pavilion'],103),
('Unit 104','unit-104','condo','available',920000,2,2,1200,'Completed','2026-01-01','Ground-floor unit with private terrace and direct pool access.',ARRAY['Private terrace','Pool-level access','Caribbean Sea views','Air conditioning','Built-in WFH station','Café & restaurant'],104),
('Unit 105','unit-105','condo','reserved', 950000,2,2,1200,'Completed','2026-01-01','South-facing ground-floor unit with lush garden views.',ARRAY['Garden views','Private terrace','Air conditioning','Built-in WFH station','Pool & fitness access','Secure parking'],105),
('Unit 106','unit-106','condo','available',950000,2,2,1200,'Completed','2026-01-01','Ground-floor unit with private terrace and sea glimpses.',ARRAY['Private terrace','Sea glimpses','Air conditioning','Built-in WFH station','Pool & fitness access','Café & restaurant'],106),
('Unit 107','unit-107','condo','available',980000,2,2,1200,'Completed','2026-01-01','Prime ground-floor corner unit with extended wraparound terrace.',ARRAY['Wraparound terrace','Caribbean Sea views','Air conditioning','Built-in WFH station','Pool & fitness access','Yoga pavilion'],107),
('Unit 108','unit-108','condo','available',980000,2,2,1200,'Completed','2026-01-01','Ground-floor unit offering elevated garden and sea views.',ARRAY['Garden terrace','Sea views','Air conditioning','Built-in WFH station','Pool & fitness access','Secure parking'],108),
-- Floor 2
('Unit 201','unit-201','condo','available',1000000,2,2,1200,'Completed','2026-01-01','Second-floor unit with elevated Caribbean Sea views and private balcony.',ARRAY['Private balcony','Elevated sea views','Air conditioning','Built-in WFH station','Pool & fitness access','Café & restaurant'],201),
('Unit 202','unit-202','condo','sold',     1000000,2,2,1200,'Completed','2025-12-01','Second-floor unit with elevated sea views and open-plan layout.',ARRAY['Private balcony','Elevated sea views','Open-plan layout','Air conditioning','Pool & fitness access','Yoga pavilion'],202),
('Unit 203','unit-203','condo','sold',     1020000,2,2,1200,'Completed','2025-12-01','Second-floor corner unit with exceptional 180-degree sea panorama.',ARRAY['Corner unit','180° sea panorama','Extended balcony','Air conditioning','Pool & fitness access','Café & restaurant'],203),
('Unit 204','unit-204','condo','available',1020000,2,2,1200,'Completed','2026-01-01','Second-floor unit with beautiful sea views and open-concept living.',ARRAY['Private balcony','Sea views','Open-concept living','Air conditioning','Built-in WFH station','Pool & fitness access'],204),
('Unit 205','unit-205','condo','reserved', 1050000,2,2,1200,'Completed','2026-01-01','Sought-after second-floor position with prime sunset-facing balcony.',ARRAY['Sunset balcony','Premium sea views','Air conditioning','Built-in WFH station','Pool & fitness access','Secure parking'],205),
('Unit 206','unit-206','condo','available',1050000,2,2,1200,'Completed','2026-01-01','Second-floor unit with sea views and light-filled open-plan living.',ARRAY['Private balcony','Sea views','Air conditioning','Built-in WFH station','Pool & fitness access','Yoga pavilion'],206),
('Unit 207','unit-207','condo','available',1080000,2,2,1200,'Completed','2026-01-01','Premium second-floor corner unit with sweeping Caribbean panoramas.',ARRAY['Corner unit','Sweeping panoramas','Extended balcony','Air conditioning','Pool & fitness access','Café & restaurant'],207),
('Unit 208','unit-208','condo','reserved', 1080000,2,2,1200,'Completed','2026-01-01','Second-floor unit with unobstructed sea views and premium finishes.',ARRAY['Unobstructed sea views','Premium finishes','Private balcony','Air conditioning','Pool & fitness access','Secure parking'],208),
-- Floor 3
('Unit 301','unit-301','condo','sold',     1100000,2,2,1200,'Completed','2026-01-01','Third-floor unit commanding impressive elevation and Caribbean Sea views.',ARRAY['Elevated sea views','Private balcony','Air conditioning','Built-in WFH station','Pool & fitness access','Yoga pavilion'],301),
('Unit 302','unit-302','condo','available',1100000,2,2,1200,'Completed','2026-01-01','Third-floor unit with elevated sea views and bright, spacious layout.',ARRAY['Elevated sea views','Bright layout','Private balcony','Air conditioning','Pool & fitness access','Café & restaurant'],302),
('Unit 303','unit-303','condo','available',1120000,2,2,1200,'Completed','2026-01-01','Third-floor unit with broad Caribbean Sea outlook from private balcony.',ARRAY['Broad sea outlook','Private balcony','Air conditioning','Built-in WFH station','Pool & fitness access','Secure parking'],303),
('Unit 304','unit-304','condo','sold',     1120000,2,2,1200,'Completed','2026-01-01','Third-floor corner unit delivering one of the finest sea views in the building.',ARRAY['Corner unit','Premier sea views','Extended balcony','Air conditioning','Pool & fitness access','Yoga pavilion'],304),
('Unit 305','unit-305','condo','reserved', 1150000,2,2,1200,'Completed','2026-01-01','Elevated third-floor unit with stunning sunset views across the Caribbean.',ARRAY['Sunset views','Elevated position','Private balcony','Air conditioning','Pool & fitness access','Café & restaurant'],305),
('Unit 306','unit-306','condo','available',1150000,2,2,1200,'Completed','2026-01-01','Third-floor unit with captivating sea views and refined open-plan interiors.',ARRAY['Sea views','Open-plan interiors','Private balcony','Air conditioning','Built-in WFH station','Pool & fitness access'],306),
('Unit 307','unit-307','condo','available',1180000,2,2,1200,'Completed','2026-01-01','Third-floor premium unit with near-penthouse elevation and sea panorama.',ARRAY['Near-penthouse elevation','Sea panorama','Extended balcony','Air conditioning','Pool & fitness access','Secure parking'],307),
('Unit 308','unit-308','condo','available',1180000,2,2,1200,'Completed','2026-01-01','Third-floor corner unit with exceptional light and 180-degree sea views.',ARRAY['Corner unit','180° sea views','Exceptional light','Air conditioning','Pool & fitness access','Yoga pavilion'],308),
-- Floor 4 (Penthouse level)
('Unit 401','unit-401','condo','reserved', 1200000,2,2,1200,'Completed','2026-01-01','Top-floor penthouse-level unit with the highest elevation sea views in the building.',ARRAY['Top-floor position','Highest elevation views','Private balcony','Air conditioning','Pool & fitness access','Café & restaurant'],401),
('Unit 402','unit-402','condo','available',1200000,2,2,1200,'Completed','2026-01-01','Penthouse-level unit with spectacular Caribbean Sea outlook.',ARRAY['Penthouse level','Spectacular sea outlook','Private balcony','Air conditioning','Built-in WFH station','Pool & fitness access'],402),
('Unit 403','unit-403','condo','available',1200000,2,2,1200,'Completed','2026-01-01','Top-floor unit with unrivalled panoramic sea views and premium finishes.',ARRAY['Panoramic sea views','Premium finishes','Private balcony','Air conditioning','Pool & fitness access','Secure parking'],403),
('Unit 404','unit-404','condo','available',1200000,2,2,1200,'Completed','2026-01-01','Top-floor unit overlooking the Caribbean with all-day sun exposure.',ARRAY['All-day sun','Caribbean views','Private balcony','Air conditioning','Built-in WFH station','Yoga pavilion'],404),
('Unit 405','unit-405','condo','available',1200000,2,2,1200,'Completed','2026-01-01','Top-floor corner unit commanding the broadest sea views in the building.',ARRAY['Corner unit','Broadest sea views','Extended balcony','Air conditioning','Pool & fitness access','Café & restaurant'],405),
('Unit 406','unit-406','condo','available',1200000,2,2,1200,'Completed','2026-01-01','Penthouse-level unit with stunning west-facing Caribbean sunsets daily.',ARRAY['West-facing sunsets','Top-floor position','Private balcony','Air conditioning','Pool & fitness access','Secure parking'],406),
('Unit 407','unit-407','condo','available',1200000,2,2,1200,'Completed','2026-01-01','Top-floor unit with sweeping 180-degree views across the Caribbean Sea.',ARRAY['180° Caribbean views','Top-floor position','Private balcony','Air conditioning','Built-in WFH station','Pool & fitness access'],407),
('Unit 408','unit-408','condo','available',1200000,2,2,1200,'Completed','2026-01-01','Top-floor corner penthouse-level unit — the pinnacle of condo living at Sugar Ridge.',ARRAY['Pinnacle position','Corner unit','360° views','Air conditioning','Pool & fitness access','Yoga pavilion'],408);

-- ── LOTS (32) ────────────────────────────────────────────────────────────────
-- Group A (Lots 1–8):  $620,000 each | Group B (Lots 9–16):  $700,000 each
-- Group C (Lots 17–24): $780,000 each | Group D (Lots 25–32): $855,000 each

INSERT INTO properties
  (name, slug, type, status, price, lot_number,
   completion_date, listed_at, description, features, sort_order)
VALUES
('Lot 1', 'lot-1','lot','available',620000,'1',NULL,'2026-01-15','Gently sloping lot with open westward sea views and easy road access.',ARRAY['West-facing views','Gentle slope','Road access','Utility connections'],1001),
('Lot 2', 'lot-2','lot','available',620000,'2',NULL,'2026-01-15','Quiet corner position with tropical vegetation and sea glimpses.',ARRAY['Corner position','Tropical vegetation','Sea glimpses','Road access'],1002),
('Lot 3', 'lot-3','lot','sold',    620000,'3',NULL,'2025-10-01','Sought-after lot with views across Valley Church and the turquoise sea.',ARRAY['Valley Church views','Turquoise sea vista','Gentle slope','Utility connections'],1003),
('Lot 4', 'lot-4','lot','available',620000,'4',NULL,'2026-01-15','Lower hillside lot capturing the sunset over Jolly Harbour.',ARRAY['Jolly Harbour sunset views','Lower hillside','Road access','Utility connections'],1004),
('Lot 5', 'lot-5','lot','available',620000,'5',NULL,'2026-01-15','Tucked-away lot offering extra privacy at the end of a quiet lane.',ARRAY['Maximum privacy','End of lane','Tropical setting','Utility connections'],1005),
('Lot 6', 'lot-6','lot','available',620000,'6',NULL,'2026-01-15','Corner lot with sloping sides offering unique design possibilities.',ARRAY['Corner position','Sloping terrain','Design opportunity','Road access'],1006),
('Lot 7', 'lot-7','lot','sold',    620000,'7',NULL,'2025-10-01','Prime hillside lot with mature trees providing natural shade and privacy.',ARRAY['Mature trees','Natural shade','Hillside position','Utility connections'],1007),
('Lot 8', 'lot-8','lot','available',620000,'8',NULL,'2026-01-15','Level lot with broad sea views — ideal for a single-storey design.',ARRAY['Level site','Broad sea views','Single-storey ideal','Road access'],1008),

('Lot 9', 'lot-9','lot','available',700000,'9',NULL,'2026-01-15','Mid-hillside lot with elevated Caribbean sea views and a gentle slope.',ARRAY['Elevated sea views','Mid-hillside','Gentle slope','Road access'],1009),
('Lot 10','lot-10','lot','available',700000,'10',NULL,'2026-01-15','Northwestern edge location with dramatic design opportunities and sharp terrain.',ARRAY['Northwestern edge','Dramatic terrain','Design opportunity','Sea views'],1010),
('Lot 11','lot-11','lot','available',700000,'11',NULL,'2026-01-15','Exceptional views to the west coast and Caribbean Sea.',ARRAY['West coast views','Caribbean Sea vista','Gentle slope','Utility connections'],1011),
('Lot 12','lot-12','lot','sold',    700000,'12',NULL,'2025-10-01','Adjacent to a completed villa, with stunning sunset vistas.',ARRAY['Adjacent to villa','Sunset vistas','Private setting','Road access'],1012),
('Lot 13','lot-13','lot','available',700000,'13',NULL,'2026-01-15','Prominent hillside position between two completed properties.',ARRAY['Prominent hillside','Established neighbourhood','Sea views','Utility connections'],1013),
('Lot 14','lot-14','lot','available',700000,'14',NULL,'2026-01-15','Large lot with gentle slope and multiple viewpoints.',ARRAY['Large lot','Multiple viewpoints','Gentle slope','Road access'],1014),
('Lot 15','lot-15','lot','available',700000,'15',NULL,'2026-01-15','Elevated lot with natural rocky outcrops and panoramic views.',ARRAY['Rocky outcrops','Panoramic views','Elevated position','Utility connections'],1015),
('Lot 16','lot-16','lot','sold',    700000,'16',NULL,'2025-10-01','Hillside lot with sweeping sea views and ideal sunset orientation.',ARRAY['Sweeping sea views','Sunset orientation','Hillside','Road access'],1016),

('Lot 17','lot-17','lot','available',780000,'17',NULL,'2026-02-01','Upper hillside lot with commanding views across the Caribbean.',ARRAY['Upper hillside','Commanding views','Sea panorama','Road access'],1017),
('Lot 18','lot-18','lot','reserved', 780000,'18',NULL,'2026-02-01','Sought-after position with unobstructed westward sea outlook.',ARRAY['Unobstructed views','West-facing','Upper hillside','Utility connections'],1018),
('Lot 19','lot-19','lot','available',780000,'19',NULL,'2026-02-01','Elevated position with mature tropical trees and privacy.',ARRAY['Elevated position','Mature trees','Privacy','Sea views'],1019),
('Lot 20','lot-20','lot','available',780000,'20',NULL,'2026-02-01','Prime lot adjacent to community amenity space with sea glimpses.',ARRAY['Amenity adjacency','Sea glimpses','Level site','Road access'],1020),
('Lot 21','lot-21','lot','available',780000,'21',NULL,'2026-02-01','Corner lot overlooking the western coastline at prime elevation.',ARRAY['Corner position','Western coastline','Prime elevation','Utility connections'],1021),
('Lot 22','lot-22','lot','sold',    780000,'22',NULL,'2025-12-01','Upper hillside corner lot with 180-degree panoramic sea views.',ARRAY['Corner lot','180° sea views','Upper hillside','Road access'],1022),
('Lot 23','lot-23','lot','available',780000,'23',NULL,'2026-02-01','Generous upper hillside lot ideal for a multi-level contemporary home.',ARRAY['Generous size','Multi-level potential','Sea views','Utility connections'],1023),
('Lot 24','lot-24','lot','available',780000,'24',NULL,'2026-02-01','High-elevation lot with dramatic sea and island backdrop.',ARRAY['High elevation','Dramatic backdrop','Sea views','Road access'],1024),

('Lot 25','lot-25','lot','available',855000,'25',NULL,'2026-03-01','Premium upper lot with unrivalled westward views across the entire Caribbean horizon.',ARRAY['Premier position','Westward horizon','Upper hillside','Utility connections'],1025),
('Lot 26','lot-26','lot','available',855000,'26',NULL,'2026-03-01','Exclusive upper-tier lot with wide sea views and architectural freedom.',ARRAY['Exclusive tier','Wide sea views','Architectural freedom','Road access'],1026),
('Lot 27','lot-27','lot','sold',    855000,'27',NULL,'2025-12-01','Highly desirable upper hillside lot commanding 270-degree sea and island views.',ARRAY['270° views','Upper hillside','Premier position','Utility connections'],1027),
('Lot 28','lot-28','lot','available',855000,'28',NULL,'2026-03-01','Large premium lot with elevated position and sweeping Caribbean panorama.',ARRAY['Large lot','Elevated position','Sweeping panorama','Road access'],1028),
('Lot 29','lot-29','lot','available',855000,'29',NULL,'2026-03-01','Prestigious upper-tier lot with front-row sunset views over the sea.',ARRAY['Front-row sunsets','Prestigious position','Upper tier','Utility connections'],1029),
('Lot 30','lot-30','lot','reserved', 855000,'30',NULL,'2026-03-01','Corner premium lot at the highest elevation tier with island and sea panorama.',ARRAY['Corner lot','Highest elevation','Island & sea panorama','Road access'],1030),
('Lot 31','lot-31','lot','available',855000,'31',NULL,'2026-03-01','Premium lot with privacy berm and uninterrupted western sea outlook.',ARRAY['Privacy berm','Uninterrupted views','Western outlook','Utility connections'],1031),
('Lot 32','lot-32','lot','available',855000,'32',NULL,'2026-03-01','The finest lot in the development — premium corner position at Sugar Ridge''s summit.',ARRAY['Finest position','Corner summit','360° island views','Road access'],1032);

-- ── SALES (15 records — matching all sold properties) ─────────────────────────

INSERT INTO sales (property_name, property_type, sale_price, list_price, sold_at, buyer_name, notes)
VALUES
-- Villas
('Coconut Grove', 'villa', 3150000, 3200000, '2026-02-14', NULL, 'First villa sale at Sugar Ridge'),
('Mango Bay',     'villa', 8850000, 8800000, '2026-05-22', NULL, 'Sold above list price'),
('Harbor View',   'villa', 5400000, 5500000, '2026-08-03', NULL, NULL),

-- Condos
('Unit 101', 'condo', 875000,  880000, '2026-02-28', NULL, 'First condo sale'),
('Unit 103', 'condo', 918000,  920000, '2026-03-15', NULL, NULL),
('Unit 202', 'condo', 998000, 1000000, '2026-04-10', NULL, NULL),
('Unit 203', 'condo',1022000, 1020000, '2026-05-01', NULL, 'Sold above list'),
('Unit 301', 'condo',1085000, 1100000, '2026-06-18', NULL, NULL),
('Unit 304', 'condo',1120000, 1120000, '2026-09-05', NULL, 'Full asking price'),

-- Lots
('Lot 3',  'lot', 615000, 620000, '2026-01-30', NULL, 'First lot sale'),
('Lot 7',  'lot', 618000, 620000, '2026-02-20', NULL, NULL),
('Lot 12', 'lot', 700000, 700000, '2026-03-28', NULL, 'Full asking price'),
('Lot 16', 'lot', 695000, 700000, '2026-04-15', NULL, NULL),
('Lot 22', 'lot', 780000, 780000, '2026-07-11', NULL, 'Full asking price'),
('Lot 27', 'lot', 850000, 855000, '2026-09-20', NULL, NULL);

-- ── Link sales to property IDs ────────────────────────────────────────────────
UPDATE sales s
SET property_id = p.id
FROM properties p
WHERE s.property_name = p.name AND s.property_type = p.type::text;
