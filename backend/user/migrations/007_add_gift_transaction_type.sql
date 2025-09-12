-- Add 'gift' transaction type to credit_transactions table
ALTER TABLE credit_transactions 
MODIFY COLUMN transaction_type ENUM('deposit', 'purchase', 'refund', 'admin_adjust', 'gift') NOT NULL;