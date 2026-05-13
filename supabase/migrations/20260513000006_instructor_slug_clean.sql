-- Slug'ları temiz isim bazlı yeniden üret
-- Benzersizse: aziz-asan
-- Çakışanlar: aziz-asan, aziz-asan-2, aziz-asan-3 ...

DO $$
DECLARE
  rec RECORD;
  base_slug TEXT;
  final_slug TEXT;
  counter INT;
BEGIN
  -- Önce hepsini temizle
  UPDATE instructors SET slug = NULL;

  -- Oluşturma tarihine göre sıralı işle
  FOR rec IN SELECT id FROM instructors ORDER BY created_at ASC LOOP
    SELECT generate_instructor_slug(full_name) INTO base_slug
    FROM instructors WHERE id = rec.id;

    final_slug := base_slug;
    counter := 2;

    -- Çakışma varsa numara ekle
    WHILE EXISTS (SELECT 1 FROM instructors WHERE slug = final_slug) LOOP
      final_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;

    UPDATE instructors SET slug = final_slug WHERE id = rec.id;
  END LOOP;
END;
$$;
