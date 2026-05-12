-- Fix: GRANT eksikleri ve users tablosundaki sonsuz döngü RLS policy

-- ─────────────────────────────────────────
-- 1. GRANT — tüm tablolar için yetki ver
-- ─────────────────────────────────────────

grant usage on schema public to anon, authenticated;

-- Herkese açık tablolar (anonim dahil okuyabilir)
grant select on universities, departments, instructors, courses, course_instructors to anon, authenticated;

-- Yorumlar ve upvote'lar anonim de okuyabilir (RLS gizlenenleri filtreler)
grant select on reviews, review_upvotes to anon;

-- Oturum açmış kullanıcılar için tam erişim (RLS ne yapılabileceğini belirler)
grant select, insert, update, delete on
  reviews, review_upvotes, review_replies, reply_upvotes,
  reports, suggestions, users
  to authenticated;

-- service_role her şeye erişebilir (RLS'yi atlar)
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role, authenticated;

-- ─────────────────────────────────────────
-- 2. Sonsuz döngüyü kıran yardımcı fonksiyon
-- ─────────────────────────────────────────

-- security definer ile çalışır, users policy'sini tetiklemez
create or replace function public.my_role()
  returns text
  language sql
  security definer
  stable
  set search_path = public
as $$
  select role::text from public.users where id = auth.uid();
$$;

create or replace function public.my_is_verified()
  returns boolean
  language sql
  security definer
  stable
  set search_path = public
as $$
  select is_verified from public.users where id = auth.uid();
$$;

-- ─────────────────────────────────────────
-- 3. Sorunlu policy'leri sil ve yeniden yaz
-- ─────────────────────────────────────────

-- users tablosu
drop policy if exists "users_read_own" on users;
create policy "users_read_own" on users for select
  using (id = auth.uid() or public.my_role() in ('admin', 'moderator'));

-- universities write
drop policy if exists "universities_write" on universities;
create policy "universities_write" on universities for all
  using (public.my_role() = 'admin');

-- departments write
drop policy if exists "departments_write" on departments;
create policy "departments_write" on departments for all
  using (public.my_role() = 'admin');

-- instructors read/write
drop policy if exists "instructors_read" on instructors;
create policy "instructors_read" on instructors for select
  using (is_active = true or public.my_role() in ('admin', 'moderator'));

drop policy if exists "instructors_write" on instructors;
create policy "instructors_write" on instructors for all
  using (public.my_role() = 'admin');

-- courses write
drop policy if exists "courses_write" on courses;
create policy "courses_write" on courses for all
  using (public.my_role() = 'admin');

-- course_instructors write
drop policy if exists "course_instructors_write" on course_instructors;
create policy "course_instructors_write" on course_instructors for all
  using (public.my_role() = 'admin');

-- reviews
drop policy if exists "reviews_read" on reviews;
create policy "reviews_read" on reviews for select
  using (
    is_hidden = false
    or user_id = auth.uid()
    or public.my_role() in ('admin', 'moderator')
  );

drop policy if exists "reviews_insert" on reviews;
create policy "reviews_insert" on reviews for insert
  with check (
    user_id = auth.uid()
    and public.my_role() = 'student'
    and public.my_is_verified() = true
  );

drop policy if exists "reviews_delete" on reviews;
create policy "reviews_delete" on reviews for delete
  using (user_id = auth.uid() or public.my_role() in ('admin', 'moderator'));

-- review_upvotes
drop policy if exists "upvotes_insert" on review_upvotes;
create policy "upvotes_insert" on review_upvotes for insert
  with check (user_id = auth.uid() and public.my_is_verified() = true);

-- review_replies
drop policy if exists "replies_read" on review_replies;
create policy "replies_read" on review_replies for select
  using (
    is_hidden = false
    or user_id = auth.uid()
    or public.my_role() in ('admin', 'moderator')
  );

drop policy if exists "replies_insert" on review_replies;
create policy "replies_insert" on review_replies for insert
  with check (
    user_id = auth.uid()
    and public.my_role() = 'student'
    and public.my_is_verified() = true
  );

drop policy if exists "replies_delete" on review_replies;
create policy "replies_delete" on review_replies for delete
  using (user_id = auth.uid() or public.my_role() in ('admin', 'moderator'));

-- reports
drop policy if exists "reports_insert" on reports;
create policy "reports_insert" on reports for insert
  with check (reported_by = auth.uid() and public.my_is_verified() = true);

drop policy if exists "reports_read" on reports;
create policy "reports_read" on reports for select
  using (public.my_role() in ('admin', 'moderator'));

drop policy if exists "reports_update" on reports;
create policy "reports_update" on reports for update
  using (public.my_role() in ('admin', 'moderator'));

-- suggestions
drop policy if exists "suggestions_insert" on suggestions;
create policy "suggestions_insert" on suggestions for insert
  with check (suggested_by = auth.uid() and public.my_is_verified() = true);

drop policy if exists "suggestions_read" on suggestions;
create policy "suggestions_read" on suggestions for select
  using (public.my_role() in ('admin', 'moderator'));

drop policy if exists "suggestions_update" on suggestions;
create policy "suggestions_update" on suggestions for update
  using (public.my_role() in ('admin', 'moderator'));
