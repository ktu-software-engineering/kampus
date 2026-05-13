-- public.users.is_verified = true yapılınca auth.users.email_confirmed_at güncellenir

CREATE OR REPLACE FUNCTION public.handle_is_verified_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- is_verified false'dan true'ya geçince auth tablosunu güncelle
  IF NEW.is_verified = true AND (OLD.is_verified = false OR OLD.is_verified IS NULL) THEN
    UPDATE auth.users
    SET email_confirmed_at = NOW()
    WHERE id = NEW.id
      AND email_confirmed_at IS NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_is_verified_update ON public.users;

CREATE TRIGGER on_is_verified_update
  AFTER UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_is_verified_update();
