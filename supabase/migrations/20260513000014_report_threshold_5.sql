-- Otomatik yorum gizleme eşiğini 1'den 5'e çıkar
CREATE OR REPLACE FUNCTION auto_hide_on_report()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE reviews
  SET is_hidden = true
  WHERE id = NEW.review_id
    AND is_hidden = false
    AND (SELECT count(*) FROM reports WHERE review_id = NEW.review_id) >= 5;
  RETURN NEW;
END;
$$;
