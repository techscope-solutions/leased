-- ============================================================
-- inquiries  (buyer → seller deal interest)
-- ============================================================
-- Run this in Supabase SQL Editor (or add to your migration run).
-- Idempotent: safe to re-run.

create table if not exists public.inquiries (
  id            uuid primary key default gen_random_uuid(),
  deal_id       uuid not null references public.deals(id)    on delete cascade,
  buyer_id      uuid not null references auth.users(id)      on delete cascade,
  seller_id     uuid not null references auth.users(id)      on delete cascade,

  -- Requested structure
  preferred_term    integer,          -- months: 24 30 36 39 42 48
  preferred_down    integer,          -- dollars due at signing

  -- Buyer self-reported financials
  estimated_income  integer,          -- annual, USD
  estimated_credit  text,             -- range label e.g. "700-749"

  -- Free-text message
  message           text,

  -- Conversation state
  status text not null default 'sent'
    check (status in ('sent', 'viewed', 'replied', 'application_sent', 'complete')),

  created_at timestamptz default now(),

  -- One inquiry per buyer per deal
  unique (deal_id, buyer_id)
);

create index if not exists inquiries_deal_id_idx     on public.inquiries(deal_id);
create index if not exists inquiries_seller_id_idx   on public.inquiries(seller_id);
create index if not exists inquiries_buyer_id_idx    on public.inquiries(buyer_id);
create index if not exists inquiries_created_at_idx  on public.inquiries(created_at desc);

alter table public.inquiries enable row level security;

-- Buyers can insert their own inquiries
drop policy if exists "Buyers can submit inquiries" on public.inquiries;
create policy "Buyers can submit inquiries" on public.inquiries
  for insert with check (auth.uid() = buyer_id);

-- Buyers see their own inquiries
drop policy if exists "Buyers see own inquiries" on public.inquiries;
create policy "Buyers see own inquiries" on public.inquiries
  for select using (auth.uid() = buyer_id);

-- Sellers see inquiries on their deals
drop policy if exists "Sellers see inquiries on their deals" on public.inquiries;
create policy "Sellers see inquiries on their deals" on public.inquiries
  for select using (auth.uid() = seller_id);

-- Sellers can mark inquiries as viewed/replied
drop policy if exists "Sellers can update inquiry status" on public.inquiries;
create policy "Sellers can update inquiry status" on public.inquiries
  for update using (auth.uid() = seller_id);

-- Moderators see all
drop policy if exists "Moderators can read all inquiries" on public.inquiries;
create policy "Moderators can read all inquiries" on public.inquiries
  for select using (
    exists (select 1 from public.profiles p
            where p.id = auth.uid() and p.role = 'moderator')
  );
