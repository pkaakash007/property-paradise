-- Migration: Drop chat_messages table to free D1 storage and prevent D1 operations
DROP TABLE IF EXISTS chat_messages;
