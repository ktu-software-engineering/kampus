-- Yeni hoca eklenince otomatik slug üretir
CREATE OR REPLACE FUNCTION auto_generate_instructor_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INT := 2;
BEGIN
  -- Slug zaten varsa dokunma
  IF NEW.slug IS NOT NULL AND NEW.slug != '' THEN
    RETURN NEW;
  END IF;

  base_slug := generate_instructor_slug(NEW.full_name);
  final_slug := base_slug;

  WHILE EXISTS (SELECT 1 FROM instructors WHERE slug = final_slug AND id != NEW.id) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;

  NEW.slug := final_slug;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS instructor_slug_trigger ON instructors;

CREATE TRIGGER instructor_slug_trigger
  BEFORE INSERT OR UPDATE OF full_name ON instructors
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_instructor_slug();
