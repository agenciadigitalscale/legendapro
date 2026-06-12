-- LegendaPro: complemento da trava de 1 aparelho por conta
-- Cole no SQL Editor do Supabase e clique em Run.

alter table public.profiles add column if not exists current_device text;
alter table public.profiles add column if not exists device_set_at timestamptz;

create or replace function public.lp_claim_device(dev text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
  set current_device = dev, device_set_at = now()
  where id = auth.uid()
$$;
