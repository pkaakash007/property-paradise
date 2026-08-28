-- Add auth extension columns to users table
ALTER TABLE users ADD COLUMN username TEXT;
ALTER TABLE users ADD COLUMN password_hash TEXT;
ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0;

-- Create table to track OTP verifications
CREATE TABLE IF NOT EXISTS otps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at INTEGER NOT NULL, -- Unix timestamp in milliseconds
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
