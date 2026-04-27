-- KampusKarne — Başlangıç Şeması

-- Uzantılar
create extension if not exists "uuid-ossp";

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
  id   uuid primary key default uuid_generate_v4(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table departments (
  id            uuid primary key default uuid_generate_v4(),
  university_id uuid not null references universities(id) on delete cascade,
  name          text not null,
  created_at    timestamptz not null default now(),
  unique(university_id, name)
);

create table instructors (
  id            uuid primary key default uuid_generate_v4(),
  full_name     text not null,
  title         text,
  department_id uuid references departments(id) on delete set null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

create table courses (
  id            uuid primary key default uuid_generate_v4(),
  code          text not null,
  name          text not null,
  instructor_id uuid references instructors(id) on delete set null,
  department_id uuid references departments(id) on delete set null,
  term          text,
  created_at    timestamptz not null default now()
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
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid not null references users(id) on delete cascade,
  course_id          uuid not null references courses(id) on delete cascade,
  instructor_id      uuid references instructors(id) on delete set null,
  teaching_quality   int not null check (teaching_quality between 1 and 5),
  course_difficulty  int not null check (course_difficulty between 1 and 5),
  exam_difficulty    int not null check (exam_difficulty between 1 and 5),
  attendance_required boolean not null default false,
  comment            text check (char_length(comment) <= 500),
  is_hidden          boolean not null default false,
  created_at         timestamptz not null default now(),
  unique(user_id, course_id)
);

create table review_upvotes (
  review_id uuid not null references reviews(id) on delete cascade,
  user_id   uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (review_id, user_id)
);

create table reports (
  id          uuid primary key default uuid_generate_v4(),
  review_id   uuid not null references reviews(id) on delete cascade,
  reported_by uuid not null references users(id) on delete cascade,
  reason      text not null,
  status      report_status not null default 'pending',
  created_at  timestamptz not null default now()
);

create table suggestions (
  id           uuid primary key default uuid_generate_v4(),
  type         suggestion_type not null,
  data         jsonb not null,
  suggested_by uuid references users(id) on delete set null,
  vote_count   int not null default 0,
  status       suggestion_status not null default 'pending',
  created_at   timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- Otomatik yorum gizleme: 3+ şikayet → is_hidden = true
-- ─────────────────────────────────────────

create or replace function check_report_threshold()
returns trigger language plpgsql security definer as $$
begin
  update reviews
  set is_hidden = true
  where id = new.review_id
    and (select count(*) from reports where review_id = new.review_id) >= 3;
  return new;
end;
$$;

create trigger auto_hide_review
after insert on reports
for each row execute function check_report_threshold();

-- ─────────────────────────────────────────
-- Yeni Auth kullanıcısı → users tablosuna ekle
-- ─────────────────────────────────────────

create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();

-- ─────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────

alter table universities      enable row level security;
alter table departments       enable row level security;
alter table instructors       enable row level security;
alter table courses           enable row level security;
alter table users             enable row level security;
alter table reviews           enable row level security;
alter table review_upvotes    enable row level security;
alter table reports           enable row level security;
alter table suggestions       enable row level security;

-- universities: herkes okuyabilir, sadece admin yazabilir
create policy "universities_read"  on universities for select using (true);
create policy "universities_write" on universities for all
  using (exists (select 1 from users where id = auth.uid() and role in ('admin')));

-- departments: herkes okuyabilir, sadece admin yazabilir
create policy "departments_read"  on departments for select using (true);
create policy "departments_write" on departments for all
  using (exists (select 1 from users where id = auth.uid() and role in ('admin')));

-- instructors: aktifler herkese açık, admin hepsini görür
create policy "instructors_read_active" on instructors for select
  using (is_active = true or exists (select 1 from users where id = auth.uid() and role in ('admin', 'moderator')));
create policy "instructors_write" on instructors for all
  using (exists (select 1 from users where id = auth.uid() and role in ('admin')));

-- courses: herkes okuyabilir, admin yazabilir
create policy "courses_read"  on courses for select using (true);
create policy "courses_write" on courses for all
  using (exists (select 1 from users where id = auth.uid() and role in ('admin')));

-- users: kendi profilini okur/günceller; admin hepsini görür
create policy "users_read_own" on users for select
  using (id = auth.uid() or exists (select 1 from users where id = auth.uid() and role in ('admin', 'moderator')));
create policy "users_update_own" on users for update
  using (id = auth.uid());

-- reviews: gizli olmayanlar herkese açık; sahibi oluşturabilir/silebilir; moderator/admin her şeyi görür
create policy "reviews_read_visible" on reviews for select
  using (
    is_hidden = false
    or user_id = auth.uid()
    or exists (select 1 from users where id = auth.uid() and role in ('admin', 'moderator'))
    or exists (
      select 1 from users u
      join courses c on c.id = reviews.course_id
      join instructors i on i.id = c.instructor_id
      where u.id = auth.uid() and u.role = 'professor' and i.id = c.instructor_id
    )
  );
create policy "reviews_insert" on reviews for insert
  with check (
    user_id = auth.uid()
    and exists (select 1 from users where id = auth.uid() and role = 'student' and is_verified = true)
  );
create policy "reviews_delete_own" on reviews for delete
  using (user_id = auth.uid() or exists (select 1 from users where id = auth.uid() and role in ('admin', 'moderator')));

-- review_upvotes: giriş yapmış herkes upvote yapabilir, kendi upvote'unu silebilir
create policy "upvotes_read"   on review_upvotes for select using (true);
create policy "upvotes_insert" on review_upvotes for insert
  with check (user_id = auth.uid() and exists (select 1 from users where id = auth.uid() and is_verified = true));
create policy "upvotes_delete" on review_upvotes for delete
  using (user_id = auth.uid());

-- reports: doğrulanmış öğrenci şikayet edebilir; moderator/admin görür
create policy "reports_insert" on reports for insert
  with check (reported_by = auth.uid() and exists (select 1 from users where id = auth.uid() and is_verified = true));
create policy "reports_read" on reports for select
  using (exists (select 1 from users where id = auth.uid() and role in ('admin', 'moderator')));
create policy "reports_update" on reports for update
  using (exists (select 1 from users where id = auth.uid() and role in ('admin', 'moderator')));

-- suggestions: doğrulanmış kullanıcılar öneri gönderebilir; admin/moderator yönetir
create policy "suggestions_insert" on suggestions for insert
  with check (suggested_by = auth.uid() and exists (select 1 from users where id = auth.uid() and is_verified = true));
create policy "suggestions_read" on suggestions for select using (true);
create policy "suggestions_update" on suggestions for update
  using (exists (select 1 from users where id = auth.uid() and role in ('admin', 'moderator')));
