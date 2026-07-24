-- ============================================================
-- Hotspot Mtaani — Supabase schema
-- Run this in Supabase SQL Editor (Project > SQL Editor > New query)
-- ============================================================

-- 1. PROFILES ---------------------------------------------------
-- One row per auth user, created automatically on signup (see trigger below)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  onboarding_step text not null default 'business' -- business | package | payment | done
    check (onboarding_step in ('business', 'package', 'payment', 'done')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up (incl. Google OAuth)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. BUSINESSES --------------------------------------------------
-- One WiFi/hotspot business per user (keep it simple: 1-to-1 for now)
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  business_name text not null,
  business_type text not null default 'mobile_hotspot'
    check (business_type in ('mobile_hotspot', 'home_wifi')),
  location text,
  phone text,
  is_online boolean not null default false, -- the dashboard on/off toggle
  is_active boolean not null default false, -- flips true once the Ksh 100 setup fee is paid
  created_at timestamptz not null default now(),
  unique (owner_id)
);

alter table public.businesses enable row level security;

create policy "Owners manage their own business"
  on public.businesses for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- 3. PACKAGES ------------------------------------------------------
create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,               -- e.g. "1 Hour", "Daily", "Weekly"
  duration_minutes integer not null, -- e.g. 60, 1440, 10080
  price_ksh numeric(10, 2) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.packages enable row level security;

create policy "Owners manage packages of their business"
  on public.packages for all
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_id and b.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = business_id and b.owner_id = auth.uid()
    )
  );

-- 4. PAYMENTS --------------------------------------------------------
-- Tracks the one-time Ksh 100 setup fee (Paystack). Extendable later
-- if you add package purchases by end customers.
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  purpose text not null default 'setup_fee' check (purpose in ('setup_fee')),
  amount_ksh numeric(10, 2) not null default 100,
  paystack_reference text unique not null,
  status text not null default 'pending' check (status in ('pending', 'success', 'failed')),
  created_at timestamptz not null default now(),
  verified_at timestamptz
);

alter table public.payments enable row level security;

create policy "Owners view payments of their business"
  on public.payments for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_id and b.owner_id = auth.uid()
    )
  );

-- Inserts/updates to payments are done from the server (service role) only,
-- via the Paystack initialize/webhook route handlers — not directly by the client.

-- 5. Helpful index ------------------------------------------------
create index if not exists idx_packages_business_id on public.packages(business_id);
create index if not exists idx_payments_business_id on public.payments(business_id);
