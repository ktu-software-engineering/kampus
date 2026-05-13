-- Aynı isimli hocaları birleştir
-- En eski kayıt (created_at) ana kayıt olarak kalır
-- Diğerlerinin ders ve yorum bağlantıları ana kayda taşınır

DO $$
DECLARE
  dup RECORD;
  keeper_id UUID;
  dup_id UUID;
BEGIN
  -- Mükerrer isimleri işle
  FOR dup IN
    SELECT full_name
    FROM instructors
    GROUP BY full_name
    HAVING COUNT(*) > 1
  LOOP
    -- En eski kaydı ana kayıt olarak seç
    SELECT id INTO keeper_id
    FROM instructors
    WHERE full_name = dup.full_name
    ORDER BY created_at ASC
    LIMIT 1;

    -- Diğer kayıtları birer birer işle
    FOR dup_id IN
      SELECT id FROM instructors
      WHERE full_name = dup.full_name AND id != keeper_id
    LOOP
      -- course_instructors: çakışmayan kayıtları ana hocaya taşı
      INSERT INTO course_instructors (course_id, instructor_id)
        SELECT course_id, keeper_id
        FROM course_instructors
        WHERE instructor_id = dup_id
          AND course_id NOT IN (
            SELECT course_id FROM course_instructors WHERE instructor_id = keeper_id
          )
      ON CONFLICT DO NOTHING;

      -- Eski course_instructors kaydını sil
      DELETE FROM course_instructors WHERE instructor_id = dup_id;

      -- reviews: ana hocaya taşı (unique(user_id, instructor_id) çakışma riski var)
      -- Çakışanlar silinir (aynı kullanıcının aynı hocaya iki yorumu olamaz)
      UPDATE reviews
      SET instructor_id = keeper_id
      WHERE instructor_id = dup_id
        AND user_id NOT IN (
          SELECT user_id FROM reviews WHERE instructor_id = keeper_id
        );

      DELETE FROM reviews WHERE instructor_id = dup_id;

      -- Artık boş kalan hoca kaydını sil
      DELETE FROM instructors WHERE id = dup_id;
    END LOOP;
  END LOOP;
END;
$$;

-- Slug'ları yeniden üret (birleşme sonrası bazı kayıtlar değişti)
UPDATE instructors SET slug = NULL;

DO $$
DECLARE
  rec RECORD;
  base_slug TEXT;
  final_slug TEXT;
  counter INT;
BEGIN
  FOR rec IN SELECT id FROM instructors ORDER BY created_at ASC LOOP
    SELECT generate_instructor_slug(full_name) INTO base_slug
    FROM instructors WHERE id = rec.id;

    final_slug := base_slug;
    counter := 2;

    WHILE EXISTS (SELECT 1 FROM instructors WHERE slug = final_slug AND id != rec.id) LOOP
      final_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;

    UPDATE instructors SET slug = final_slug WHERE id = rec.id;
  END LOOP;
END;
$$;
