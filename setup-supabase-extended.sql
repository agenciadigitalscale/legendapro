-- LegendaPro: extensão com templates, payments, notifications
-- Cole este arquivo no SQL Editor do Supabase APÓS rodar setup-supabase.sql

-- Tabela de templates salvos na nuvem
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  nome text not null,
  model_id text not null,
  c1 text default '#ffffff',
  c2 text default '#00d9ff',
  c3 text default '#00ffa3',
  glow boolean default false,
  anim text default 'fade',
  scale numeric default 1,
  offset numeric default 0,
  fmt text default '9x16',
  texts text[] default array[]::text[],
  criado_em timestamptz not null default now(),
  editado_em timestamptz not null default now()
);

alter table public.templates enable row level security;
drop policy if exists "ler templates proprios" on public.templates;
create policy "ler templates proprios" on public.templates
  for select using (user_id = auth.uid() or public.lp_is_admin());
drop policy if exists "criar templates" on public.templates;
create policy "criar templates" on public.templates
  for insert with check (user_id = auth.uid());
drop policy if exists "editar templates proprios" on public.templates;
create policy "editar templates proprios" on public.templates
  for update using (user_id = auth.uid());
drop policy if exists "deletar templates proprios" on public.templates;
create policy "deletar templates proprios" on public.templates
  for delete using (user_id = auth.uid());

-- Tabela de histórico de exportações
create table if not exists public.exports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tipo text not null, -- 'png', 'webm', 'mp4', 'zip', 'layers'
  formato text default '9x16', -- '9x16', '1x1', '16x9'
  model_id text,
  criado_em timestamptz not null default now()
);

alter table public.exports enable row level security;
drop policy if exists "ler exports proprios" on public.exports;
create policy "ler exports proprios" on public.exports
  for select using (user_id = auth.uid() or public.lp_is_admin());
drop policy if exists "criar exports" on public.exports;
create policy "criar exports" on public.exports
  for insert with check (user_id = auth.uid());

-- Tabela de histórico de pagamentos
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  metodo text not null, -- 'mercadopago' ou 'pix'
  valor numeric not null default 37.99,
  status text not null default 'pendente', -- 'pendente', 'confirmado', 'falhou'
  pix_qr_code text,
  mercadopago_id text,
  notas text,
  criado_em timestamptz not null default now(),
  confirmado_em timestamptz
);

alter table public.payments enable row level security;
drop policy if exists "ler payments proprios" on public.payments;
create policy "ler payments proprios" on public.payments
  for select using (user_id = auth.uid() or public.lp_is_admin());
drop policy if equals "criar payments" on public.payments;
create policy "criar payments" on public.payments
  for insert with check (user_id = auth.uid());
drop policy if exists "admin confirma payments" on public.payments;
create policy "admin confirma payments" on public.payments
  for update using (public.lp_is_admin());

-- Tabela de notificações
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tipo text not null, -- 'trial_expiring', 'payment_received', 'feature_new'
  titulo text,
  mensagem text,
  lido boolean default false,
  criado_em timestamptz not null default now()
);

alter table public.notifications enable row level security;
drop policy if exists "ler notifications proprias" on public.notifications;
create policy "ler notifications proprias" on public.notifications
  for select using (user_id = auth.uid());
drop policy if exists "criar notifications" on public.notifications;
create policy "criar notifications" on public.notifications
  for insert with check (true); -- apenas admin/sistema cria

-- Função pra marcar como lido
create or replace function public.marcar_notificacao_lida(notif_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.notifications
  set lido = true
  where id = notif_id and user_id = auth.uid()
$$;

-- Função pra remover template
create or replace function public.deletar_template_seguro(template_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.templates
  where id = template_id and user_id = auth.uid()
$$;

-- Função pra registrar exportação (call pelo app)
create or replace function public.registrar_export(tipo text, formato text, model_id text)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.exports (user_id, tipo, formato, model_id)
  values (auth.uid(), tipo, formato, model_id)
$$;

-- Função pra salvar template na nuvem
create or replace function public.salvar_template_nuvem(
  nome text,
  model_id text,
  c1 text,
  c2 text,
  c3 text,
  glow boolean,
  anim text,
  scale numeric,
  offset numeric,
  fmt text,
  texts text[]
)
returns uuid
language sql
security definer
set search_path = public
as $$
  insert into public.templates (user_id, nome, model_id, c1, c2, c3, glow, anim, scale, offset, fmt, texts)
  values (auth.uid(), nome, model_id, c1, c2, c3, glow, anim, scale, offset, fmt, texts)
  returning id
$$;

-- Índices para performance
create index if not exists idx_templates_user on public.templates(user_id);
create index if not exists idx_exports_user on public.exports(user_id);
create index if not exists idx_payments_user on public.payments(user_id);
create index if not exists idx_notifications_user on public.notifications(user_id);
