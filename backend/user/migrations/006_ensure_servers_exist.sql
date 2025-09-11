-- Ensure servers exist for shopping cart functionality

-- Insert servers if they don't exist
INSERT IGNORE INTO servers (server_id, server_name, server_type, ip_address, port, rcon_port, rcon_password, max_players) VALUES
(1, 'ARK x25', 'PVP', '127.0.0.1', 7777, 27020, 'rcon_password_x25', 70),
(2, 'ARK x100', 'PVP', '127.0.0.1', 7778, 27021, 'rcon_password_x100', 70);

-- Ensure server display categories exist
INSERT IGNORE INTO server_display_categories (category_name, category_key, display_order) VALUES
('Server Settings', 'server_settings', 1),
('Dino Stats', 'dino_stats', 2),
('Player Stats', 'player_stats', 3),
('Crafting Rates', 'crafting_rates', 4),
('Item Stats', 'item_stats', 5),
('Server Rules', 'server_rules', 6);