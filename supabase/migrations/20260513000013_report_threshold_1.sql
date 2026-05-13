-- Otomatik yorum gizleme eşiğini 5'ten 1'e indir
CREATE OR REPLACE FUNCTION auto_hide_on_report()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE reviews
  SET is_hidden = true
  WHERE id = NEW.review_id
    AND is_hidden = false
    AND (SELECT count(*) FROM reports WHERE review_id = NEW.review_id) >= 1;
  RETURN NEW;
END;
$$;

-- Trigger varsa yeniden oluştur
DROP TRIGGER IF EXISTS on_report_hide_review ON reports;
CREATE TRIGGER on_report_hide_review
  AFTER INSERT ON reports
  FOR EACH ROW
  EXECUTE FUNCTION auto_hide_on_report();
