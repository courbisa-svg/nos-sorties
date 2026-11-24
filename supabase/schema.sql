-- À coller dans Supabase : SQL Editor → New query → Run
create table if not exists public.members (email text primary key);
insert into public.members (email) values ('aymeric.julia.c@gmail.com') on conflict do nothing;
alter table public.members enable row level security;

create or replace function public.is_member() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.members where email = lower(auth.jwt() ->> 'email'));
$$;

create table if not exists public.favs (
  event_id   text primary key,
  tente      boolean not null default false,
  go         boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.places (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  city       text,
  dept       text,
  kind       text,
  notes      text,
  url        text,
  done       boolean not null default false,
  done_at    date,
  created_at timestamptz not null default now()
);

-- Droits d'accès pour l'appli (sinon : « permission denied for table »)
grant select, insert, update, delete on table public.favs, public.places to authenticated;

alter table public.favs   enable row level security;
alter table public.places enable row level security;

drop policy if exists "membres favs" on public.favs;
create policy "membres favs" on public.favs for all to authenticated
  using (public.is_member()) with check (public.is_member());

drop policy if exists "membres places" on public.places;
create policy "membres places" on public.places for all to authenticated
  using (public.is_member()) with check (public.is_member());

alter publication supabase_realtime add table public.favs, public.places;
