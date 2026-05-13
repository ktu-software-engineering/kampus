-- AVG'yi NULL bırak — yorum yoksa NULL gelsin, sıralama için gerekli
CREATE OR REPLACE VIEW course_stats AS
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
