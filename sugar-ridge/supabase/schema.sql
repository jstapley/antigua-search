-- Sugar Ridge Homes — Database Schema
-- Run this in your Supabase SQL editor

-- Properties
CREATE TABLE IF NOT EXISTS properties (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name            text NOT NULL,
  slug            text UNIQUE NOT NULL,
  type            text NOT NULL CHECK (type IN ('villa', 'condo', 'lot')),
  status          text NOT NULL DEFAULT 'available'
                    CHECK (status IN ('available', 'reserved', 'sold')),
  price           numeric(12, 2),
  bedrooms        integer,
  bathrooms       integer,
  interior_sqft   integer,
  total_sqft      integer,
  lot_sqft        integer,
  lot_number      text,
  completion_date text,
  description     text,
  features        text[],
  images          text[],
  sort_order      integer DEFAULT 0,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- Inquiries (contact form submissions)
CREATE TABLE IF NOT EXISTS inquiries (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text NOT NULL,
  email         text NOT NULL,
  phone         text,
  property_id   uuid REFERENCES properties(id) ON DELETE SET NULL,
  property_name text,
  message       text,
  status        text NOT NULL DEFAULT 'new'
                  CHECK (status IN ('new', 'contacted', 'closed')),
  created_at    timestamptz DEFAULT now()
);

-- Sales ledger (CEO dashboard history)
CREATE TABLE IF NOT EXISTS sales (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id   uuid REFERENCES properties(id) ON DELETE SET NULL,
  property_name text NOT NULL,
  property_type text NOT NULL CHECK (property_type IN ('villa', 'condo', 'lot')),
  sale_price    numeric(12, 2) NOT NULL,
  list_price    numeric(12, 2),
  sold_at       date NOT NULL DEFAULT CURRENT_DATE,
  buyer_name    text,
  notes         text,
  created_at    timestamptz DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales      ENABLE ROW LEVEL SECURITY;

-- Public can read available/sold properties
CREATE POLICY "Public read properties"
  ON properties FOR SELECT
  USING (true);

-- Public can insert inquiries
CREATE POLICY "Public insert inquiries"
  ON inquiries FOR INSERT
  WITH CHECK (true);

-- Only authenticated users (CEO) can manage everything
CREATE POLICY "Auth full access properties"
  ON properties FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth read inquiries"
  ON inquiries FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth update inquiries"
  ON inquiries FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth full access sales"
  ON sales FOR ALL
  USING (auth.role() = 'authenticated');

-- ── Seed Data ────────────────────────────────────────────────────────────────

INSERT INTO properties (name, slug, type, status, price, bedrooms, bathrooms, interior_sqft, total_sqft, completion_date, description, features) VALUES
-- Villas
('Sea La Vie', 'sea-la-vie', 'villa', 'available', 2600000, 4, 4, 2229, 4415, 'Completed',
 'A luxurious four-bedroom villa that embodies the perfect fusion of contemporary innovation and traditional Caribbean aesthetics, featuring vaulted ceilings, wood porcelain tiles, and high-end aluminum louvered windows.',
 ARRAY['Heated infinity pool with swim-up bar', 'European-style kitchen with waterfall island', 'Master suite with sea views', '3 additional ensuite bedrooms with rain showers', 'Outdoor BBQ & entertainment deck', 'Backup generator', 'Covered parking for 2 vehicles']),

('Villa Vista', 'villa-vista', 'villa', 'available', 3400000, 4, 5, 5475, 5475, 'Q1 2025',
 'A 2-storey contemporary estate that combines elegance with unparalleled luxury. West-facing ocean views overlook Jolly Harbour and Jolly Beach, with a focus on eco-conscious living.',
 ARRAY['Saltwater pool with sunken fire pit', '40,000-gallon cistern & rainwater harvesting', 'Solar power system', 'Tankless water heater', 'Fully furnished', '11,975 sq.ft. lot', 'West-facing ocean views']),

-- Condos (28 units — seeding a representative sample)
('Condo Unit 4A', 'condo-4a', 'condo', 'sold', 450000, 2, 2, 1200, 1200, 'Completed',
 'West-facing 2-bedroom condo with private terrace and Caribbean Sea views in the 5-storey Sugar Ridge Condos building.',
 ARRAY['Private terrace', 'Caribbean Sea views', 'Air conditioning', 'Built-in work-from-home station', 'Open-concept living', 'Pool & fitness center access']),

('Condo Unit 4B', 'condo-4b', 'condo', 'available', 450000, 2, 2, 1200, 1200, 'Completed',
 'West-facing 2-bedroom condo with private terrace and Caribbean Sea views.',
 ARRAY['Private terrace', 'Caribbean Sea views', 'Air conditioning', 'Built-in work-from-home station', 'Open-concept living', 'Pool & fitness center access']),

('Condo Unit 8C', 'condo-8c', 'condo', 'available', 475000, 2, 2, 1200, 1200, 'Completed',
 'Upper-floor 2-bedroom condo with elevated sea views and premium finishes.',
 ARRAY['Elevated sea views', 'Private terrace', 'Air conditioning', 'Ultra-modern finishes', 'Pool & fitness center access', 'Yoga pavilion']),

-- Lots
('Lot 6', 'lot-6', 'lot', 'available', 700000, NULL, NULL, NULL, NULL, NULL,
 'Gentle slope providing exceptional views of the sunset over Antigua''s west coast.',
 ARRAY['Gentle slope', 'Sunset views', 'West coast panorama']),

('Lot 7', 'lot-7', 'lot', 'sold', 680000, NULL, NULL, NULL, NULL, NULL,
 'Prime hillside lot with sunset views.',
 ARRAY['Hillside position', 'Sunset views']),

('Lot 10', 'lot-10', 'lot', 'available', 995000, NULL, NULL, NULL, NULL, NULL,
 'Northwestern edge location with dramatic design opportunities thanks to the sharp terrain drop.',
 ARRAY['Northwestern edge', 'Dramatic terrain', 'Design-forward opportunity', 'Premium position']),

('Lot 11', 'lot-11', 'lot', 'available', 650000, NULL, NULL, NULL, NULL, NULL,
 'Northwestern edge lot with exceptional views to the west coast and Caribbean Sea.',
 ARRAY['Caribbean Sea views', 'West coast panorama', 'Northwestern edge']),

('Lot 12', 'lot-12', 'lot', 'available', 650000, NULL, NULL, NULL, NULL, NULL,
 'Adjacent to Hideaway villa, offering stunning sunset vistas.',
 ARRAY['Adjacent to completed villa', 'Sunset vistas', 'Private setting']),

('Lot 14', 'lot-14', 'lot', 'available', 695000, NULL, NULL, NULL, NULL, NULL,
 'Prominent hillside position between two completed properties.',
 ARRAY['Prominent hillside', 'Between completed villas', 'Established neighbourhood']),

('Lot 16', 'lot-16', 'lot', 'sold', 650000, NULL, NULL, NULL, NULL, NULL,
 'Hillside lot with sea views.',
 ARRAY['Sea views', 'Hillside position']),

('Lot 17', 'lot-17', 'lot', 'sold', 660000, NULL, NULL, NULL, NULL, NULL,
 'Prime hillside position.',
 ARRAY['Hillside position', 'Sea views']),

('Lot 19', 'lot-19', 'lot', 'sold', 650000, NULL, NULL, NULL, NULL, NULL,
 'Scenic hillside lot.',
 ARRAY['Scenic views', 'Hillside position']),

('Lot 29', 'lot-29', 'lot', 'sold', 620000, NULL, NULL, NULL, NULL, NULL,
 'Hillside lot.',
 ARRAY['Hillside position']),

('Lot 30', 'lot-30', 'lot', 'available', 650000, NULL, NULL, NULL, NULL, NULL,
 'Corner lot with sloping sides offering unique design possibilities.',
 ARRAY['Corner lot', 'Sloping terrain', 'Unique design potential']),

('Lot 34', 'lot-34', 'lot', 'available', 650000, NULL, NULL, NULL, NULL, NULL,
 'Corner lot with sloping sides offering unique design possibilities.',
 ARRAY['Corner lot', 'Sloping terrain', 'Unique design potential']),

('Lot 35', 'lot-35', 'lot', 'available', 700000, NULL, NULL, NULL, NULL, NULL,
 'Tucked away at the end of the road, giving extra privacy.',
 ARRAY['Maximum privacy', 'End of road', 'Secluded setting']),

('Lot 36', 'lot-36', 'lot', 'sold', 650000, NULL, NULL, NULL, NULL, NULL,
 'Hillside lot.',
 ARRAY['Hillside position']),

('Lot 39', 'lot-39', 'lot', 'available', 650000, NULL, NULL, NULL, NULL, NULL,
 'Valley Church beach views with turquoise sea vistas.',
 ARRAY['Valley Church beach views', 'Turquoise sea vistas', 'Beach proximity']),

('Lot 40', 'lot-40', 'lot', 'available', 650000, NULL, NULL, NULL, NULL, NULL,
 'Large lot with gentle slope and multiple viewpoints.',
 ARRAY['Large lot', 'Gentle slope', 'Multiple viewpoints']),

('Lot 41', 'lot-41', 'lot', 'available', 595000, NULL, NULL, NULL, NULL, NULL,
 'Lower elevation lot capturing the sunset over Jolly Harbour.',
 ARRAY['Jolly Harbour sunset views', 'Lower elevation', 'Value lot']),

('Lot 42', 'lot-42', 'lot', 'sold', 595000, NULL, NULL, NULL, NULL, NULL,
 'Lower hillside lot.',
 ARRAY['Hillside position']),

('Lot 45', 'lot-45', 'lot', 'available', 650000, NULL, NULL, NULL, NULL, NULL,
 'Lower hillside location at the northern edge of the development.',
 ARRAY['Northern edge', 'Lower hillside', 'Sea views']);

-- Update lot numbers
UPDATE properties SET lot_number = REPLACE(name, 'Lot ', '') WHERE type = 'lot';

-- Seed a few historical sales for dashboard metrics
INSERT INTO sales (property_name, property_type, sale_price, list_price, sold_at, buyer_name) VALUES
('Lot 7',  'lot', 680000,  680000,  '2023-03-15', NULL),
('Lot 16', 'lot', 645000,  650000,  '2023-06-22', NULL),
('Lot 17', 'lot', 660000,  660000,  '2023-09-10', NULL),
('Lot 19', 'lot', 650000,  650000,  '2024-01-08', NULL),
('Lot 29', 'lot', 615000,  620000,  '2024-04-19', NULL),
('Lot 36', 'lot', 650000,  650000,  '2024-07-03', NULL),
('Lot 42', 'lot', 590000,  595000,  '2024-10-14', NULL),
('Condo Unit 4A', 'condo', 455000, 450000, '2025-02-28', NULL);
