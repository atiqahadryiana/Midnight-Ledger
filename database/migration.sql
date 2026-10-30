create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(trim(email))),
  token_hash text not null,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);
create table if not exists applications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references users(id) on delete cascade,
  company varchar(160) not null, role varchar(160) not null, location varchar(160), link text,
  date_applied date not null, status varchar(32) not null check (status in ('Wishlist','Applied','Online Assessment','Interview','Offer','Rejected','Ghosted')),
  contact_person varchar(160), notes varchar(10000), followed_up_at date,
  last_updated_at timestamptz not null default now(), created_at timestamptz not null default now()
);
create index if not exists applications_user_id_idx on applications(user_id);
create table if not exists sessions (
  id char(64) primary key, user_id uuid not null references users(id) on delete cascade,
  expires_at timestamptz not null, created_at timestamptz not null default now()
);
create index if not exists sessions_user_id_idx on sessions(user_id);
create index if not exists sessions_expires_at_idx on sessions(expires_at);
create table if not exists rate_limits (
  key_hash char(64) primary key, attempts integer not null default 1, window_started_at timestamptz not null default now()
);
