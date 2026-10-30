create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  category varchar(16) not null check (category in ('Idea','Bug','Praise','Other')),
  message varchar(1000) not null check (char_length(message) between 10 and 1000),
  rating smallint check (rating between 1 and 5),
  page varchar(500),
  user_agent varchar(500),
  screen_size varchar(32),
  status varchar(8) not null default 'new' check (status in ('new','done')),
  created_at timestamptz not null default now()
);

create index if not exists feedback_user_created_idx
  on feedback(user_id, created_at desc);

alter table public.feedback enable row level security;
