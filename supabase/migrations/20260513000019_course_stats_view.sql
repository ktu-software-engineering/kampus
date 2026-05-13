-- Ders istatistikleri view'ı (yorum sayısı, ortalama zorluklar)
CREATE OR REPLACE VIEW course_stats AS
SELECT
  c.id,
  c.code,
  c.name,
  c.department_id,
  d.name  AS department_name,
  COUNT(r.id)                          AS review_count,
  COALESCE(AVG(r.course_difficulty), 0) AS avg_course_difficulty,
  COALESCE(AVG(r.exam_difficulty),   0) AS avg_exam_difficulty
FROM courses c
LEFT JOIN departments d ON d.id = c.department_id
LEFT JOIN reviews r ON r.course_id = c.id AND r.is_hidden = false
GROUP BY c.id, c.code, c.name, c.department_id, d.name;

-- Anon ve authenticated okuyabilsin
GRANT SELECT ON course_stats TO anon, authenticated;
