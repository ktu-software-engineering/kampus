-- Email doğrulandığında public.users.is_verified = true yapan trigger

CREATE OR REPLACE FUNCTION public.handle_email_confirmed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- email_confirmed_at NULL'dan bir değere geçince is_verified'ı true yap
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    UPDATE public.users
    SET is_verified = true
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- Eski trigger varsa sil, yeniden oluştur
DROP TRIGGER IF EXISTS on_auth_email_confirmed ON auth.users;

CREATE TRIGGER on_auth_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_email_confirmed();
