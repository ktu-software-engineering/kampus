-- Hoca istatistikleri view — yorumu olmayanlar için NULL rating
CREATE OR REPLACE VIEW instructor_stats AS
SELECT
  id,
  full_name,
  title,
  slug,
  review_count,
  CASE WHEN review_count > 0 THEN average_rating ELSE NULL END AS avg_rating,
  is_active
FROM instructors;

GRANT SELECT ON instructor_stats TO anon, authenticated;
