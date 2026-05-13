-- Daha önce emailini doğrulamış kullanıcıların is_verified alanını güncelle
UPDATE public.users
SET is_verified = true
WHERE id IN (
  SELECT id FROM auth.users WHERE email_confirmed_at IS NOT NULL
);
