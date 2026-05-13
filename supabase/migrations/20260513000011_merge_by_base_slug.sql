-- Baz slug (isimsiz, numarasız) aynı olan hocaları birleştir
DO $$
DECLARE
  dup RECORD;
  keeper_id UUID;
  dup_id UUID;
BEGIN
  FOR dup IN
    SELECT generate_instructor_slug(full_name) AS base_slug
    FROM instructors
    GROUP BY generate_instructor_slug(full_name)
    HAVING COUNT(*) > 1
  LOOP
    SELECT id INTO keeper_id
    FROM instructors
    WHERE generate_instructor_slug(full_name) = dup.base_slug
    ORDER BY created_at ASC
    LIMIT 1;

    FOR dup_id IN
      SELECT id FROM instructors
      WHERE generate_instructor_slug(full_name) = dup.base_slug AND id != keeper_id
    LOOP
      INSERT INTO course_instructors (course_id, instructor_id)
        SELECT course_id, keeper_id
        FROM course_instructors
        WHERE instructor_id = dup_id
          AND course_id NOT IN (
            SELECT course_id FROM course_instructors WHERE instructor_id = keeper_id
          )
      ON CONFLICT DO NOTHING;

      DELETE FROM course_instructors WHERE instructor_id = dup_id;

      UPDATE reviews
      SET instructor_id = keeper_id
      WHERE instructor_id = dup_id
        AND user_id NOT IN (
          SELECT user_id FROM reviews WHERE instructor_id = keeper_id
        );

      DELETE FROM reviews WHERE instructor_id = dup_id;
      DELETE FROM instructors WHERE id = dup_id;
    END LOOP;
  END LOOP;
END;
$$;

-- Slug'ları yeniden üret
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
