-- Migration: Drop unused OTP table and auth columns
DROP TABLE IF EXISTS otps;

ALTER TABLE users DROP COLUMN username;
ALTER TABLE users DROP COLUMN password_hash;
ALTER TABLE users DROP COLUMN is_verified;
