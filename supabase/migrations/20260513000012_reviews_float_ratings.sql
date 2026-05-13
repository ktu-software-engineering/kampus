-- teaching_quality, course_difficulty, exam_difficulty kolonlarını
-- 0.5 artışlı değerlere (1.0-5.0) izin verecek şekilde güncelle

ALTER TABLE reviews
  ALTER COLUMN teaching_quality TYPE numeric(3,1),
  ALTER COLUMN course_difficulty TYPE numeric(3,1),
  ALTER COLUMN exam_difficulty   TYPE numeric(3,1);

ALTER TABLE reviews
  DROP CONSTRAINT IF EXISTS reviews_teaching_quality_check,
  DROP CONSTRAINT IF EXISTS reviews_course_difficulty_check,
  DROP CONSTRAINT IF EXISTS reviews_exam_difficulty_check;

ALTER TABLE reviews
  ADD CONSTRAINT reviews_teaching_quality_check
    CHECK (teaching_quality BETWEEN 1 AND 5),
  ADD CONSTRAINT reviews_course_difficulty_check
    CHECK (course_difficulty BETWEEN 1 AND 5),
  ADD CONSTRAINT reviews_exam_difficulty_check
    CHECK (exam_difficulty BETWEEN 1 AND 5);
