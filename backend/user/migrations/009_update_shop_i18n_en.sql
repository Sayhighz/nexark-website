-- Migration 009: Populate English (en) translations for shop categories and items

-- Categories (IDs from 005_populate_shop_data.sql)
UPDATE item_categories
SET
  category_name_en = 'Weapons',
  description_en   = 'Weapons and combat equipment'
WHERE category_id = 1;

UPDATE item_categories
SET
  category_name_en = 'Armor',
  description_en   = 'Armor and protective equipment'
WHERE category_id = 2;

UPDATE item_categories
SET
  category_name_en = 'Dinosaurs',
  description_en   = 'Dinosaurs and related items'
WHERE category_id = 3;

UPDATE item_categories
SET
  category_name_en = 'Resources',
  description_en   = 'Materials and resources'
WHERE category_id = 4;

UPDATE item_categories
SET
  category_name_en = 'Tools',
  description_en   = 'Tools and utilities'
WHERE category_id = 5;

UPDATE item_categories
SET
  category_name_en = 'Food',
  description_en   = 'Food and drinks'
WHERE category_id = 6;

-- Items (IDs from 005_populate_shop_data.sql)
UPDATE items
SET
  item_name_en   = 'Tek Rifle',
  description_en = 'Advanced technology rifle that fires powerful plasma beams'
WHERE item_id = 1;

UPDATE items
SET
  item_name_en   = 'Riot Gear Set',
  description_en = 'High-grade protective armor set, durable against various attacks'
WHERE item_id = 2;

UPDATE items
SET
  item_name_en   = 'T-Rex Saddle',
  description_en = 'Dinosaur saddle for T-Rex, level 75+'
WHERE item_id = 3;

UPDATE items
SET
  item_name_en   = 'Crystal Bundle',
  description_en = 'Special bundle of 500 crystals for high-tier crafting'
WHERE item_id = 4;

UPDATE items
SET
  item_name_en   = 'Chainsaw',
  description_en = 'Chainsaw for fast wood cutting and resource gathering'
WHERE item_id = 5;

UPDATE items
SET
  item_name_en   = 'Cooked Meat Pack',
  description_en = 'Pack of 100 cooked meat to increase HP and hunger'
WHERE item_id = 6;

UPDATE items
SET
  item_name_en   = 'Wyvern Egg',
  description_en = 'Wyvern egg (level 190) for breeding'
WHERE item_id = 7;

UPDATE items
SET
  item_name_en   = 'Element Pack',
  description_en = 'Pack of 50 Element for advanced technology'
WHERE item_id = 8;