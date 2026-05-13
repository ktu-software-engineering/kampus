create table reply_downvotes (
  reply_id   uuid not null references review_replies(id) on delete cascade,
  user_id    uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (reply_id, user_id)
);

alter table reply_downvotes enable row level security;

create policy "reply_downvotes_read" on reply_downvotes for select using (true);
create policy "reply_downvotes_write" on reply_downvotes for all using (user_id = auth.uid());

grant select on reply_downvotes to anon;
grant select, insert, update, delete on reply_downvotes to authenticated;
grant all on reply_downvotes to service_role;
