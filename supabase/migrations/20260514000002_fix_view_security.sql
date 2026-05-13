-- SECURITY DEFINER view'larını SECURITY INVOKER'a çevir
-- Bu sayede RLS kuralları uygulanır

-- instructor_stats: sadece aktif hocaları göster
DROP VIEW IF EXISTS instructor_stats;
CREATE VIEW instructor_stats
  WITH (security_invoker = true)
AS
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

-- course_stats: herkese açık ders istatistikleri
DROP VIEW IF EXISTS course_stats;
CREATE VIEW course_stats
  WITH (security_invoker = true)
AS
SELECT
  c.id,
  c.code,
  c.name,
  c.department_id,
  d.name                   AS department_name,
  COUNT(r.id)              AS review_count,
  AVG(r.course_difficulty) AS avg_course_difficulty,
  AVG(r.exam_difficulty)   AS avg_exam_difficulty
FROM courses c
LEFT JOIN departments d ON d.id = c.department_id
LEFT JOIN reviews r ON r.course_id = c.id AND r.is_hidden = false
GROUP BY c.id, c.code, c.name, c.department_id, d.name;

GRANT SELECT ON course_stats TO anon, authenticated;
