-- LegendaPro: estrutura de contas + trava de aparelho unico
-- Cole este arquivo inteiro no SQL Editor do Supabase e clique em RUN.
-- (pode rodar mais de uma vez sem problema)

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  trial_start timestamptz not null default now(),
  is_pro boolean not null default false,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- trava de 1 aparelho por conta
alter table public.profiles add column if not exists current_device text;
alter table public.profiles add column if not exists device_set_at timestamptz;

alter table public.profiles enable row level security;

-- funcao auxiliar (security definer evita recursao nas policies)
create or replace function public.lp_is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
$$;

drop policy if exists "ler proprio perfil" on public.profiles;
create policy "ler proprio perfil" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "admin le todos" on public.profiles;
create policy "admin le todos" on public.profiles
  for select using (public.lp_is_admin());

drop policy if exists "admin atualiza" on public.profiles;
create policy "admin atualiza" on public.profiles
  for update using (public.lp_is_admin());

-- registra qual aparelho esta usando a conta (chamada pelo app)
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

-- cria o perfil automaticamente quando alguem se cadastra
-- o e-mail do criador ja nasce admin + pro vitalicio
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, is_admin, is_pro)
  values (
    new.id,
    new.email,
    new.email = 'agenciadigitalscale@gmail.com',
    new.email = 'agenciadigitalscale@gmail.com'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
