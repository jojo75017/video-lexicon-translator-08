create table if not exists public.internal_cron_tokens (name text primary key, token text not null, created_at timestamptz not null default now());
alter table public.internal_cron_tokens enable row level security;
revoke all on public.internal_cron_tokens from anon, authenticated;
grant all on public.internal_cron_tokens to service_role;
insert into public.internal_cron_tokens(name, token) values ('trials-maintenance', encode(extensions.gen_random_bytes(32),'hex')) on conflict (name) do nothing;

select cron.unschedule('trials-maintenance-daily');
select cron.schedule('trials-maintenance-daily', (select '0 6 * * *'), $$
  select net.http_post(
    url:='https://xvdgazrewsuaqtalqxue.supabase.co/functions/v1/trials-maintenance',
    headers:=jsonb_build_object('Content-Type','application/json','x-cron-token',(select token from public.internal_cron_tokens where name='trials-maintenance')),
    body:=concat('{"time": "', now(), '"}')::jsonb
  ) as request_id;
$$);