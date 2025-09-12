-- Migration 008: Add bilingual (TH/EN) support for shop items/categories and server details (JSON)
-- - Adds *_en and *_th columns for item_categories and items
-- - Adds details_i18n JSON column for servers (stores {"en": {...}, "th": {...}})
-- - Backfills new columns from existing data to avoid nulls

-- 1) Extend item_categories with bilingual columns
ALTER TABLE item_categories
  ADD COLUMN category_name_en VARCHAR(255) NULL AFTER category_name,
  ADD COLUMN category_name_th VARCHAR(255) NULL AFTER category_name_en,
  ADD COLUMN description_en TEXT NULL AFTER description,
  ADD COLUMN description_th TEXT NULL AFTER description_en;

-- Backfill category bilingual columns from existing data
UPDATE item_categories
SET
  category_name_en = COALESCE(category_name_en, category_name),
  category_name_th = COALESCE(category_name_th, category_name),
  description_en   = COALESCE(description_en, description),
  description_th   = COALESCE(description_th, description);

-- 2) Extend items with bilingual columns
ALTER TABLE items
  ADD COLUMN item_name_en VARCHAR(255) NULL AFTER item_name,
  ADD COLUMN item_name_th VARCHAR(255) NULL AFTER item_name_en,
  ADD COLUMN description_en TEXT NULL AFTER description,
  ADD COLUMN description_th TEXT NULL AFTER description_en;

-- Backfill item bilingual columns from existing data
UPDATE items
SET
  item_name_en   = COALESCE(item_name_en, item_name),
  item_name_th   = COALESCE(item_name_th, item_name),
  description_en = COALESCE(description_en, description),
  description_th = COALESCE(description_th, description);

-- 3) Add details_i18n to servers to store localized server detail JSON
ALTER TABLE servers
  ADD COLUMN details_i18n JSON NULL AFTER details;

-- Backfill details_i18n by duplicating current details to both "en" and "th"
-- This ensures API can immediately serve either language without nulls.
UPDATE servers
SET details_i18n = JSON_OBJECT('en', details, 'th', details)
WHERE details IS NOT NULL;