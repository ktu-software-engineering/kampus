-- Giriş yapmayan kullanıcılar da yanıtları okuyabilsin
grant select on review_replies to anon;
grant select on reply_upvotes to anon;
grant select on reply_downvotes to anon;
