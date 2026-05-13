-- review_downvotes tablosuna gerekli izinleri ver
grant select on review_downvotes to anon;
grant select, insert, update, delete on review_downvotes to authenticated;

-- Servis rolü için de açık izin
grant all on review_downvotes to service_role;
