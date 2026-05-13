-- Doğrulama maili yeniden gönderim takibi
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS verification_resend_count int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_verification_sent timestamptz;
