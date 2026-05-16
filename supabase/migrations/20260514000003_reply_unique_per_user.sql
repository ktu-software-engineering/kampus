-- Bir kullanıcı bir yoruma sadece bir kez cevap verebilir
ALTER TABLE review_replies
  ADD CONSTRAINT review_replies_user_review_unique UNIQUE (user_id, review_id);
