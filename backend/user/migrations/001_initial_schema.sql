-- nexark_user database schema (MySQL version)

CREATE DATABASE IF NOT EXISTS nexark_user CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nexark_user;

-- ===============================
-- USER MANAGEMENT TABLES
-- ===============================

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    steam_id VARCHAR(20) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    credit_balance DECIMAL(10,2) DEFAULT 0.00,
    loyalty_points INT DEFAULT 0,
    stripe_customer_id VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT true,
    is_banned BOOLEAN DEFAULT false,
    ban_reason TEXT,
    INDEX idx_steam_id (steam_id),
    INDEX idx_stripe_customer (stripe_customer_id),
    INDEX idx_active (is_active)
);

CREATE TABLE user_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_session_token (session_token),
    INDEX idx_user_active (user_id, is_active)
);

-- ===============================
-- SERVER MANAGEMENT TABLES
-- ===============================

CREATE TABLE servers (
    server_id INT AUTO_INCREMENT PRIMARY KEY,
    server_name VARCHAR(50) NOT NULL,
    server_type VARCHAR(20) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    port INT NOT NULL,
    rcon_port INT NOT NULL,
    rcon_password VARCHAR(100) NOT NULL,
    is_online BOOLEAN DEFAULT false,
    current_players INT DEFAULT 0,
    max_players INT DEFAULT 70,
    last_ping TIMESTAMP NULL
);

CREATE TABLE server_display_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    category_key VARCHAR(50) UNIQUE NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE server_display_info (
    info_id INT AUTO_INCREMENT PRIMARY KEY,
    server_id INT,
    category_id INT,
    info_key VARCHAR(100) NOT NULL,
    info_value TEXT NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    FOREIGN KEY (server_id) REFERENCES servers(server_id),
    FOREIGN KEY (category_id) REFERENCES server_display_categories(category_id)
);

-- ===============================
-- SHOPPING SYSTEM TABLES
-- ===============================

CREATE TABLE item_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    item_name VARCHAR(200) NOT NULL,
    item_code VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    rcon_command TEXT NOT NULL,
    image_url TEXT,
    stock_quantity INT DEFAULT -1,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (category_id) REFERENCES item_categories(category_id),
    INDEX idx_category_active (category_id, is_active),
    INDEX idx_featured (is_featured)
);

CREATE TABLE shopping_cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    item_id INT,
    quantity INT NOT NULL DEFAULT 1,
    server_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (item_id) REFERENCES items(item_id),
    FOREIGN KEY (server_id) REFERENCES servers(server_id),
    UNIQUE KEY unique_user_item_server (user_id, item_id, server_id)
);

-- ===============================
-- STRIPE PAYMENT SYSTEM TABLES
-- ===============================

CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    payment_uuid VARCHAR(36) UNIQUE NOT NULL,
    user_id INT,
    stripe_payment_intent_id VARCHAR(100) UNIQUE,
    stripe_payment_method_id VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'THB',
    payment_method ENUM('promptpay', 'card', 'bank_transfer', 'alipay') NOT NULL,
    payment_status ENUM('pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded') DEFAULT 'pending',
    stripe_client_secret TEXT,
    stripe_charges JSON,
    metadata JSON,
    failure_reason TEXT,
    stripe_webhook_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_stripe_intent (stripe_payment_intent_id),
    INDEX idx_user_status (user_id, payment_status),
    INDEX idx_status_created (payment_status, created_at)
);

-- ต่อจากตัวก่อนหน้า...

CREATE TABLE user_payment_methods (
    payment_method_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    stripe_payment_method_id VARCHAR(100) UNIQUE NOT NULL,
    payment_method_type VARCHAR(30) NOT NULL,
    brand VARCHAR(20),
    last4 VARCHAR(4),
    exp_month INT,
    exp_year INT,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_user_active (user_id, is_active)
);

-- ===============================
-- TRANSACTION SYSTEM TABLES
-- ===============================

CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_uuid VARCHAR(36) UNIQUE NOT NULL,
    user_id INT,
    item_id INT,
    server_id INT,
    amount DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    rcon_command_sent TEXT,
    rcon_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    failure_reason TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (item_id) REFERENCES items(item_id),
    FOREIGN KEY (server_id) REFERENCES servers(server_id),
    INDEX idx_user_status (user_id, status),
    INDEX idx_created (created_at)
);

CREATE TABLE credit_transactions (
    credit_transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    related_payment_id INT,
    related_transaction_id INT,
    stripe_refund_id VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    transaction_type ENUM('deposit', 'purchase', 'refund', 'admin_adjust') NOT NULL,
    description TEXT,
    balance_before DECIMAL(10,2) NOT NULL,
    balance_after DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (related_payment_id) REFERENCES payments(payment_id),
    FOREIGN KEY (related_transaction_id) REFERENCES transactions(transaction_id),
    INDEX idx_user_type (user_id, transaction_type),
    INDEX idx_created (created_at)
);

-- ===============================
-- GAMIFICATION TABLES
-- ===============================

CREATE TABLE loyalty_point_transactions (
    point_transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    points INT NOT NULL,
    transaction_type ENUM('earned', 'spent', 'admin_adjust') NOT NULL,
    description TEXT,
    balance_before INT NOT NULL,
    balance_after INT NOT NULL,
    source VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_user_type (user_id, transaction_type)
);

CREATE TABLE spin_wheel_config (
    config_id INT AUTO_INCREMENT PRIMARY KEY,
    reward_type ENUM('credits', 'items', 'points') NOT NULL,
    reward_value TEXT NOT NULL,
    probability DECIMAL(5,4) NOT NULL CHECK (probability >= 0 AND probability <= 1),
    points_cost INT NOT NULL DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT
);

CREATE TABLE spin_wheel_results (
    spin_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    config_id INT,
    reward_received TEXT,
    points_spent INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (config_id) REFERENCES spin_wheel_config(config_id)
);

CREATE TABLE daily_login_rewards (
    reward_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    day_streak INT NOT NULL,
    reward_type VARCHAR(20) NOT NULL,
    reward_value TEXT,
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_user_date (user_id, claimed_at)
);

-- ===============================
-- CONTENT MANAGEMENT TABLES
-- ===============================

CREATE TABLE news (
    news_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image_url TEXT,
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    INDEX idx_published (is_published, published_at)
);

CREATE TABLE announcements (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    announcement_type ENUM('info', 'warning', 'maintenance') DEFAULT 'info',
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP NULL,
    end_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    INDEX idx_active_dates (is_active, start_date, end_date)
);

-- ===============================
-- INSERT INITIAL DATA
-- ===============================

-- Insert server display categories
INSERT INTO server_display_categories (category_name, category_key, display_order) VALUES
('Server Settings', 'server_settings', 1),
('Dino Stats', 'dino_stats', 2),
('Player Stats', 'player_stats', 3),
('Crafting Rates', 'crafting_rates', 4),
('Item Stats', 'item_stats', 5),
('Server Rules', 'server_rules', 6);

-- Insert servers
INSERT INTO servers (server_name, server_type, ip_address, port, rcon_port, rcon_password, max_players) VALUES
('ARK x25', 'PVP', '127.0.0.1', 7777, 27020, 'rcon_password_x25', 70),
('ARK x100', 'PVP', '127.0.0.1', 7778, 27021, 'rcon_password_x100', 70);

-- Insert item categories
INSERT INTO item_categories (category_name, description, display_order) VALUES
('Dinosaurs', 'Tamed dinosaurs and creatures', 1),
('Resources', 'Raw materials and crafting resources', 2),
('Items', 'Tools, weapons, and equipment', 3),
('Structures', 'Buildings and construction items', 4);