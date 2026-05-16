-- teaching_quality için minimum değeri 0.5'e düşür
ALTER TABLE reviews
  DROP CONSTRAINT IF EXISTS reviews_teaching_quality_check;

ALTER TABLE reviews
  ADD CONSTRAINT reviews_teaching_quality_check
    CHECK (teaching_quality BETWEEN 0.5 AND 5);
