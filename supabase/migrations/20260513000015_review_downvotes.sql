create table review_downvotes (
  review_id  uuid not null references reviews(id) on delete cascade,
  user_id    uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (review_id, user_id)
);

alter table review_downvotes enable row level security;

create policy "downvotes_read" on review_downvotes for select using (true);
create policy "downvotes_write" on review_downvotes for all
  using (user_id = auth.uid());
