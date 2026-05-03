-- LEASED — full Supabase schema setup.
-- Idempotent: safe to re-run. Paste into Supabase SQL Editor.

-- ============================================================
-- profiles  (extends what was already created)
-- ============================================================
alter table public.profiles
  add column if not exists last_seen timestamptz;
alter table public.profiles
  add column if not exists login_count integer default 0;

-- Backfill profile rows for any existing auth.users that pre-date the trigger.
insert into public.profiles (id, email, full_name, avatar_url)
select u.id, u.email, u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'avatar_url'
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

-- Auto-create profile row on signup so /admin role lookups never miss.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Moderators need to read all profiles (admin/users page). The existing
-- "read own" policy stays; this one is additive.
drop policy if exists "Moderators can read all profiles" on public.profiles;
create policy "Moderators can read all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'moderator')
  );

-- Users must be able to insert their own profile row from the auth callback.
-- Without this policy, RLS silently blocks the callback's INSERT and no row
-- ever lands in public.profiles, even though the user exists in auth.users.
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- ============================================================
-- page_events  (analytics: page views + deal clicks)
-- ============================================================
create table if not exists public.page_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  session_id text,
  event_type text not null check (event_type in ('page_view', 'deal_click')),
  page text,
  deal_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists page_events_created_at_idx on public.page_events(created_at desc);
create index if not exists page_events_event_type_idx on public.page_events(event_type);
create index if not exists page_events_deal_id_idx on public.page_events(deal_id) where deal_id is not null;

alter table public.page_events enable row level security;

drop policy if exists "Anyone can insert page_events" on public.page_events;
create policy "Anyone can insert page_events" on public.page_events
  for insert with check (true);

drop policy if exists "Moderators can read page_events" on public.page_events;
create policy "Moderators can read page_events" on public.page_events
  for select using (
    exists (select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'moderator')
  );

-- ============================================================
-- support_tickets
-- ============================================================
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  created_at timestamptz default now()
);

create index if not exists support_tickets_status_idx on public.support_tickets(status);
create index if not exists support_tickets_created_at_idx on public.support_tickets(created_at desc);

alter table public.support_tickets enable row level security;

-- Backfill priority for tickets that were created before this column existed.
update public.support_tickets set priority = 'medium' where priority is null;

drop policy if exists "Anyone can submit a ticket" on public.support_tickets;
create policy "Anyone can submit a ticket" on public.support_tickets
  for insert with check (true);

-- Mods see all; users see their own.
drop policy if exists "Moderators can read tickets" on public.support_tickets;
drop policy if exists "Users see own, mods see all tickets" on public.support_tickets;
create policy "Users see own, mods see all tickets" on public.support_tickets
  for select using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p
               where p.id = auth.uid() and p.role = 'moderator')
  );

drop policy if exists "Moderators can update tickets" on public.support_tickets;
create policy "Moderators can update tickets" on public.support_tickets
  for update using (
    exists (select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'moderator')
  );

-- ============================================================
-- blogs (AI-generated, public read for published)
-- ============================================================
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content text not null,
  excerpt text,
  cover_image_url text,
  cover_image_alt text,
  seo_title text,
  seo_description text,
  tags text[] default '{}',
  published boolean default true,
  created_at timestamptz default now()
);

create index if not exists blogs_published_created_at_idx
  on public.blogs(published, created_at desc);

alter table public.blogs enable row level security;

drop policy if exists "Anyone can read published blogs" on public.blogs;
create policy "Anyone can read published blogs" on public.blogs
  for select using (published = true);

drop policy if exists "Moderators can read all blogs" on public.blogs;
create policy "Moderators can read all blogs" on public.blogs
  for select using (
    exists (select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'moderator')
  );

-- The cron route uses the anon key + RLS; insert is done server-side from the
-- API route after CRON_SECRET check, so we allow inserts unconditionally.
-- (Tighten this later by using a service role key in the cron route.)
drop policy if exists "Service can insert blogs" on public.blogs;
create policy "Service can insert blogs" on public.blogs
  for insert with check (true);

-- ============================================================
-- errors (Sentry-style error log surfaced in /admin/errors)
-- ============================================================
create table if not exists public.errors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  message text,
  stack text,
  page text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists errors_created_at_idx on public.errors(created_at desc);

alter table public.errors enable row level security;

drop policy if exists "Anyone can insert errors" on public.errors;
create policy "Anyone can insert errors" on public.errors
  for insert with check (true);

drop policy if exists "Moderators can read errors" on public.errors;
create policy "Moderators can read errors" on public.errors
  for select using (
    exists (select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'moderator')
  );
