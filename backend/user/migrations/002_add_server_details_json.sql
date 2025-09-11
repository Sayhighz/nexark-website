-- Add details JSON column to servers (compatible with MySQL versions without IF NOT EXISTS for columns)
-- This script safely adds the 'details' JSON column only if it doesn't already exist.

SET @col_exists := 0;

SELECT COUNT(*)
INTO @col_exists
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'servers'
  AND COLUMN_NAME = 'details';

SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE servers ADD COLUMN details JSON NULL AFTER last_ping',
  'SELECT 1');

PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;