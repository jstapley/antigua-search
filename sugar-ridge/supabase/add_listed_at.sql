-- Migration: add listed_at to properties
-- Run this in your Supabase SQL editor

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS listed_at date;

-- Back-fill existing rows using created_at
UPDATE properties
SET listed_at = created_at::date
WHERE listed_at IS NULL;

-- Update the seed lot / villa data with approximate listing dates
-- (adjust as needed to reflect real dates)
UPDATE properties SET listed_at = '2022-10-01' WHERE type = 'lot' AND status = 'sold';
UPDATE properties SET listed_at = '2023-01-15' WHERE type = 'lot' AND status = 'available' AND lot_number IN ('6','10','11','12','14');
UPDATE properties SET listed_at = '2023-06-01' WHERE type = 'lot' AND status = 'available' AND lot_number IN ('30','34','35','39','40','41','45');
UPDATE properties SET listed_at = '2022-06-01' WHERE type = 'villa';
UPDATE properties SET listed_at = '2023-09-01' WHERE type = 'condo';
