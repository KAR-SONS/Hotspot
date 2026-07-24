-- Run this in Supabase SQL Editor (adds columns to the businesses table
-- you already created — safe to run even if some columns already exist)

alter table public.businesses
  add column if not exists hotspot_name text,
  add column if not exists max_users integer,
  add column if not exists network_name text,
  add column if not exists network_password text,
  add column if not exists band text check (band in ('2.4GHz', '5GHz', 'Dual Band')),
  add column if not exists wifi_share_link text;
