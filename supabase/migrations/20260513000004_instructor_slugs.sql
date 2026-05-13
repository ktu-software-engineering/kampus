-- Slug sütunu ekle (varsa atla)
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS slug text;

-- Türkçe karakterleri normalize eden fonksiyon
CREATE OR REPLACE FUNCTION generate_instructor_slug(name text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  result text;
BEGIN
  result := lower(name);
  result := replace(result, 'ş', 's');
  result := replace(result, 'ğ', 'g');
  result := replace(result, 'ü', 'u');
  result := replace(result, 'ö', 'o');
  result := replace(result, 'ı', 'i');
  result := replace(result, 'ç', 'c');
  result := replace(result, 'İ', 'i');
  result := replace(result, 'Ş', 's');
  result := replace(result, 'Ğ', 'g');
  result := replace(result, 'Ü', 'u');
  result := replace(result, 'Ö', 'o');
  result := replace(result, 'Ç', 'c');
  result := regexp_replace(result, '[^a-z0-9\s-]', '', 'g');
  result := regexp_replace(trim(result), '\s+', '-', 'g');
  RETURN result;
END;
$$;

-- Slug = isim-slug + UUID'nin son 8 karakteri (kesin unique)
UPDATE instructors
SET slug = generate_instructor_slug(full_name)
        || '-'
        || right(replace(id::text, '-', ''), 8);

-- Unique index
CREATE UNIQUE INDEX IF NOT EXISTS instructors_slug_idx ON instructors(slug);
