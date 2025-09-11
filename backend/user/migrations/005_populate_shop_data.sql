-- Create shop categories and items migration
-- This migration populates the shop with sample ARK items

-- Insert categories
INSERT INTO item_categories (category_id, category_name, description, icon_url, display_order, is_active) VALUES
(1, 'อาวุธ', 'อาวุธและอุปกรณ์ต่อสู้', NULL, 1, true),
(2, 'เกราะป้องกัน', 'เกราะและอุปกรณ์ป้องกัน', NULL, 2, true),
(3, 'ไดโนเสาร์', 'ไดโนเสาร์และของที่เกี่ยวข้อง', NULL, 3, true),
(4, 'ทรัพยากร', 'วัตถุดิบและทรัพยากร', NULL, 4, true),
(5, 'เครื่องมือ', 'เครื่องมือและอุปกรณ์', NULL, 5, true),
(6, 'อาหาร', 'อาหารและเครื่องดื่ม', NULL, 6, true)
ON DUPLICATE KEY UPDATE 
category_name = VALUES(category_name),
description = VALUES(description);

-- Insert items
INSERT INTO items (item_id, category_id, item_name, item_code, description, price, rcon_command, image_url, stock_quantity, is_featured, is_active, created_at) VALUES
(1, 1, 'Tek Rifle', 'TEK_RIFLE', 'ปืนไรเฟิลเทคโนโลยีชั้นสูง ยิงลำแสงพลาสม่าทรงพลัง', 2500.00, 'giveitemnum 1 1 0', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop', 10, true, true, NOW()),
(2, 2, 'Riot Gear Set', 'RIOT_GEAR', 'ชุดเกราะป้องกันระดับสูง ทนทานต่อการโจมทีทุกรูปแบบ', 1800.00, 'giveitemnum 1 1 0', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', 15, false, true, NOW()),
(3, 3, 'T-Rex Saddle', 'TREX_SADDLE', 'อานไดโนเสาร์สำหรับ T-Rex ระดับ 75+ ขึ้นไป', 3500.00, 'giveitemnum 1 1 0', 'https://images.unsplash.com/photo-1551845041-63d96a1a632b?w=400&h=300&fit=crop', 5, true, true, NOW()),
(4, 4, 'Crystal Bundle', 'CRYSTAL_BUNDLE', 'ชุดคริสตัลพิเศษ 500 ชิ้น สำหรับคราฟท์ของระดับสูง', 1200.00, 'giveitemnum 1 500 0', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop', 25, false, true, NOW()),
(5, 5, 'Chainsaw', 'CHAINSAW', 'เลื่อยยนต์สำหรับตัดไม้และเก็บทรัพยากรอย่างรวดเร็ว', 800.00, 'giveitemnum 1 1 0', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop', 20, false, true, NOW()),
(6, 6, 'Cooked Meat Pack', 'COOKED_MEAT', 'ชุดเนื้อสุกแพ็ค 100 ชิ้น เพิ่ม HP และความอิ่ม', 150.00, 'giveitemnum 1 100 0', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop', 50, false, true, NOW()),
(7, 3, 'Wyvern Egg', 'WYVERN_EGG', 'ไข่วิร์เวิร์นระดับ 190 สำหรับเพาะพันธุ์', 5000.00, 'giveitemnum 1 1 0', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', 3, true, true, NOW()),
(8, 4, 'Element Pack', 'ELEMENT_PACK', 'ชุดเอเลเมนต์ 50 ชิ้น สำหรับเทคโนโลยีขั้นสูง', 4200.00, 'giveitemnum 1 50 0', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop', 8, true, true, NOW())
ON DUPLICATE KEY UPDATE 
item_name = VALUES(item_name),
description = VALUES(description),
price = VALUES(price),
stock_quantity = VALUES(stock_quantity),
is_featured = VALUES(is_featured);