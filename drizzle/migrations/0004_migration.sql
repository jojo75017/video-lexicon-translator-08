create table public.jvzoo_ipn_events (
  id uuid primary key default gen_random_uuid(),
  event_key text not null unique,
  transaction_id text not null,
  transaction_type text not null,
  paykey text,
  product_id text,
  email text,
  total numeric,
  outcome text not null default 'processing',
  detail text,
  created_at timestamptz not null default now()
);
alter table public.jvzoo_ipn_events enable row level security;
revoke all on public.jvzoo_ipn_events from anon, authenticated;
grant all on public.jvzoo_ipn_events to service_role;
create policy "Admins read JVZoo events" on public.jvzoo_ipn_events for select to authenticated using (public.has_role(auth.uid(), 'admin'));
grant select on public.jvzoo_ipn_events to authenticated;

create table public.jvzoo_access (
  email text primary key,
  paykey text not null,
  created_subscriber boolean not null default false,
  refunded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.jvzoo_access enable row level security;
revoke all on public.jvzoo_access from anon, authenticated;
grant all on public.jvzoo_access to service_role;