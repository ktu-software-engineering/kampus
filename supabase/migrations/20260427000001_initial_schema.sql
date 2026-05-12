-- KampusKarne — Başlangıç Şeması

-- uuid-ossp gerekmez, gen_random_uuid() PostgreSQL 13+'da natif gelir

-- ─────────────────────────────────────────
-- ENUM tipleri
-- ─────────────────────────────────────────

create type user_role as enum ('student', 'professor', 'moderator', 'admin');
create type report_status as enum ('pending', 'reviewed', 'removed');
create type suggestion_type as enum ('instructor', 'course');
create type suggestion_status as enum ('pending', 'approved', 'rejected');

-- ─────────────────────────────────────────
-- Tablolar
-- ─────────────────────────────────────────

create table universities (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  created_at timestamptz not null default now()
);

create table departments (
  id            uuid primary key default gen_random_uuid(),
  university_id uuid not null references universities(id) on delete cascade,
  name          text not null,
  created_at    timestamptz not null default now(),
  unique(university_id, name)
);

create table instructors (
  id             uuid primary key default gen_random_uuid(),
  full_name      text not null,
  title          text,
  average_rating float not null default 0,
  review_count   int not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

create table courses (
  id            uuid primary key default gen_random_uuid(),
  code          text not null,
  name          text not null,
  department_id uuid references departments(id) on delete set null,
  term          text,
  created_at    timestamptz not null default now()
);

create table course_instructors (
  course_id     uuid not null references courses(id) on delete cascade,
  instructor_id uuid not null references instructors(id) on delete cascade,
  primary key (course_id, instructor_id)
);

-- Kullanıcı profili — Supabase Auth ile senkronize
create table users (
  id                 uuid primary key references auth.users(id) on delete cascade,
  email              text not null unique,
  full_name          text,
  university_id      uuid references universities(id) on delete set null,
  department_id      uuid references departments(id) on delete set null,
  role               user_role not null default 'student',
  is_verified        boolean not null default false,
  failed_login_count int not null default 0,
  locked_until       timestamptz,
  created_at         timestamptz not null default now()
);

create table reviews (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references users(id) on delete cascade,
  instructor_id       uuid not null references instructors(id) on delete cascade,
  course_id           uuid references courses(id) on delete set null,
  teaching_quality    int not null check (teaching_quality between 1 and 5),
  course_difficulty   int check (course_difficulty between 1 and 5),
  exam_difficulty     int check (exam_difficulty between 1 and 5),
  attendance_required boolean,
  comment             text check (char_length(comment) <= 500),
  is_hidden           boolean not null default false,
  created_at          timestamptz not null default now(),
  unique(user_id, instructor_id)
);

create table review_upvotes (
  review_id  uuid not null references reviews(id) on delete cascade,
  user_id    uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (review_id, user_id)
);

create table review_replies (
  id         uuid primary key default gen_random_uuid(),
  review_id  uuid not null references reviews(id) on delete cascade,
  user_id    uuid not null references users(id) on delete cascade,
  content    text not null check (char_length(content) <= 500),
  is_hidden  boolean not null default false,
  created_at timestamptz not null default now()
);

create table reply_upvotes (
  reply_id   uuid not null references review_replies(id) on delete cascade,
  user_id    uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (reply_id, user_id)
);

create table reports (
  id          uuid primary key default gen_random_uuid(),
  review_id   uuid references reviews(id) on delete cascade,
  reply_id    uuid references review_replies(id) on delete cascade,
  reported_by uuid not null references users(id) on delete cascade,
  reason      text not null,
  status      report_status not null default 'pending',
  created_at  timestamptz not null default now(),
  -- review ya da reply'dan biri zorunlu, ikisi birden olamaz
  constraint report_target_check check (
    (review_id is not null and reply_id is null) or
    (review_id is null and reply_id is not null)
  )
);

create table suggestions (
  id           uuid primary key default gen_random_uuid(),
  type         suggestion_type not null,
  data         jsonb not null,
  suggested_by uuid references users(id) on delete set null,
  vote_count   int not null default 0,
  status       suggestion_status not null default 'pending',
  created_at   timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- Yeni Auth kullanıcısı → users tablosuna ekle
-- ─────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();

-- ─────────────────────────────────────────
-- Yorum ekle/sil → hocanın average_rating ve review_count güncelle
-- ─────────────────────────────────────────

create or replace function update_instructor_rating()
returns trigger language plpgsql security definer as $$
declare
  target_instructor_id uuid;
begin
  if tg_op = 'DELETE' then
    target_instructor_id := old.instructor_id;
  else
    target_instructor_id := new.instructor_id;
  end if;

  update instructors
  set
    review_count   = (select count(*) from reviews where instructor_id = target_instructor_id and is_hidden = false),
    average_rating = coalesce(
      (select avg(teaching_quality) from reviews where instructor_id = target_instructor_id and is_hidden = false),
      0
    )
  where id = target_instructor_id;

  return coalesce(new, old);
end;
$$;

drop trigger if exists on_review_change on reviews;
create trigger on_review_change
after insert or update or delete on reviews
for each row execute function update_instructor_rating();

-- ─────────────────────────────────────────
-- Otomatik yorum gizleme: 5+ şikayet → is_hidden = true
-- ─────────────────────────────────────────

create or replace function check_review_report_threshold()
returns trigger language plpgsql security definer as $$
begin
  if new.review_id is not null then
    update reviews
    set is_hidden = true
    where id = new.review_id
      and (select count(*) from reports where review_id = new.review_id) >= 5;
  end if;
  return new;
end;
$$;

drop trigger if exists auto_hide_review on reports;
create trigger auto_hide_review
after insert on reports
for each row execute function check_review_report_threshold();

-- ─────────────────────────────────────────
-- Otomatik cevap gizleme: 5+ şikayet → is_hidden = true
-- ─────────────────────────────────────────

create or replace function check_reply_report_threshold()
returns trigger language plpgsql security definer as $$
begin
  if new.reply_id is not null then
    update review_replies
    set is_hidden = true
    where id = new.reply_id
      and (select count(*) from reports where reply_id = new.reply_id) >= 5;
  end if;
  return new;
end;
$$;

drop trigger if exists auto_hide_reply on reports;
create trigger auto_hide_reply
after insert on reports
for each row execute function check_reply_report_threshold();

-- ─────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────

alter table universities      enable row level security;
alter table departments       enable row level security;
alter table instructors       enable row level security;
alter table courses           enable row level security;
alter table course_instructors enable row level security;
alter table users             enable row level security;
alter table reviews           enable row level security;
alter table review_upvotes    enable row level security;
alter table review_replies    enable row level security;
alter table reply_upvotes     enable row level security;
alter table reports           enable row level security;
alter table suggestions       enable row level security;

-- universities: herkes okur, admin yazar
create policy "universities_read"  on universities for select using (true);
create policy "universities_write" on universities for all
  using (exists (select 1 from users where id = auth.uid() and role = 'admin'));

-- departments: herkes okur, admin yazar
create policy "departments_read"  on departments for select using (true);
create policy "departments_write" on departments for all
  using (exists (select 1 from users where id = auth.uid() and role = 'admin'));

-- instructors: aktifler herkese açık; admin hepsini görür ve yönetir
create policy "instructors_read" on instructors for select
  using (is_active = true or exists (select 1 from users where id = auth.uid() and role in ('admin', 'moderator')));
create policy "instructors_write" on instructors for all
  using (exists (select 1 from users where id = auth.uid() and role = 'admin'));

-- courses: herkes okur, admin yazar
create policy "courses_read"  on courses for select using (true);
create policy "courses_write" on courses for all
  using (exists (select 1 from users where id = auth.uid() and role = 'admin'));

-- course_instructors: herkes okur, admin yazar
create policy "course_instructors_read"  on course_instructors for select using (true);
create policy "course_instructors_write" on course_instructors for all
  using (exists (select 1 from users where id = auth.uid() and role = 'admin'));

-- users: kendi profilini okur/günceller; admin/moderator hepsini görür
create policy "users_read_own" on users for select
  using (id = auth.uid() or exists (select 1 from users where id = auth.uid() and role in ('admin', 'moderator')));
create policy "users_update_own" on users for update
  using (id = auth.uid());

-- reviews: gizli olmayanlar herkese açık; doğrulanmış öğrenci yazar; sahibi/admin/moderator siler
create policy "reviews_read" on reviews for select
  using (
    is_hidden = false
    or user_id = auth.uid()
    or exists (select 1 from users where id = auth.uid() and role in ('admin', 'moderator'))
  );
create policy "reviews_insert" on reviews for insert
  with check (
    user_id = auth.uid()
    and exists (select 1 from users where id = auth.uid() and role = 'student' and is_verified = true)
  );
create policy "reviews_delete" on reviews for delete
  using (user_id = auth.uid() or exists (select 1 from users where id = auth.uid() and role in ('admin', 'moderator')));

-- review_upvotes: herkes okur; doğrulanmış kullanıcı ekler; kendi upvote'unu siler
create policy "upvotes_read"   on review_upvotes for select using (true);
create policy "upvotes_insert" on review_upvotes for insert
  with check (user_id = auth.uid() and exists (select 1 from users where id = auth.uid() and is_verified = true));
create policy "upvotes_delete" on review_upvotes for delete
  using (user_id = auth.uid());

-- review_replies: gizli olmayanlar herkese açık; doğrulanmış öğrenci yazar; sahibi/admin/moderator siler
create policy "replies_read" on review_replies for select
  using (
    is_hidden = false
    or user_id = auth.uid()
    or exists (select 1 from users where id = auth.uid() and role in ('admin', 'moderator'))
  );
create policy "replies_insert" on review_replies for insert
  with check (
    user_id = auth.uid()
    and exists (select 1 from users where id = auth.uid() and role = 'student' and is_verified = true)
  );
create policy "replies_delete" on review_replies for delete
  using (user_id = auth.uid() or exists (select 1 from users where id = auth.uid() and role in ('admin', 'moderator')));

-- reply_upvotes: herkes okur; doğrulanmış kullanıcı ekler; kendi upvote'unu siler
create policy "reply_upvotes_read"   on reply_upvotes for select using (true);
create policy "reply_upvotes_insert" on reply_upvotes for insert
  with check (user_id = auth.uid() and exists (select 1 from users where id = auth.uid() and is_verified = true));
create policy "reply_upvotes_delete" on reply_upvotes for delete
  using (user_id = auth.uid());

-- reports: doğrulanmış kullanıcı şikayet eder; admin/moderator okur ve günceller
create policy "reports_insert" on reports for insert
  with check (reported_by = auth.uid() and exists (select 1 from users where id = auth.uid() and is_verified = true));
create policy "reports_read" on reports for select
  using (exists (select 1 from users where id = auth.uid() and role in ('admin', 'moderator')));
create policy "reports_update" on reports for update
  using (exists (select 1 from users where id = auth.uid() and role in ('admin', 'moderator')));

-- suggestions: doğrulanmış kullanıcı gönderir; sadece admin/moderator okur ve yönetir
create policy "suggestions_insert" on suggestions for insert
  with check (suggested_by = auth.uid() and exists (select 1 from users where id = auth.uid() and is_verified = true));
create policy "suggestions_read" on suggestions for select
  using (exists (select 1 from users where id = auth.uid() and role in ('admin', 'moderator')));
create policy "suggestions_update" on suggestions for update
  using (exists (select 1 from users where id = auth.uid() and role in ('admin', 'moderator')));
