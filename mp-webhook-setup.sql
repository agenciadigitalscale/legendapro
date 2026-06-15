-- LegendaPro: Automação de pagamento via Mercado Pago
-- Cole este SQL no Editor do Supabase e execute UMA VEZ
-- Pré-requisito: já ter rodado setup-supabase.sql e setup-supabase-extended.sql

-- Adiciona colunas de controle Pro ao profiles (se ainda não existirem)
alter table public.profiles
  add column if not exists pro_since timestamptz,
  add column if not exists pro_expires timestamptz;

-- Garante que o mesmo pagamento MP não seja processado duas vezes
alter table public.payments
  drop constraint if exists payments_mp_id_unique;
alter table public.payments
  add constraint payments_mp_id_unique unique (mercadopago_id);

-- Função chamada pelo webhook quando pagamento é aprovado
create or replace function public.ativar_pro_via_mp(
  p_email text,
  p_mp_id text,
  p_valor numeric default 37.99
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  -- Idempotente: retorna ok se esse pagamento já foi processado
  if exists(select 1 from public.payments where mercadopago_id = p_mp_id) then
    return '{"status":"already_processed"}'::jsonb;
  end if;

  -- Busca o usuário pelo email
  select id into v_user_id
  from auth.users
  where lower(email) = lower(p_email)
  limit 1;

  if v_user_id is null then
    return jsonb_build_object('status', 'user_not_found', 'email', p_email);
  end if;

  -- Ativa Pro e renova por 31 dias a partir de hoje
  update public.profiles
  set
    is_pro        = true,
    pro_since     = coalesce(pro_since, now()),
    pro_expires   = now() + interval '31 days'
  where id = v_user_id;

  -- Registra o pagamento no histórico
  insert into public.payments (user_id, metodo, valor, status, mercadopago_id, confirmado_em)
  values (v_user_id, 'mercadopago', p_valor, 'confirmado', p_mp_id, now());

  -- Notificação in-app pro usuário
  insert into public.notifications (user_id, tipo, titulo, mensagem)
  values (
    v_user_id,
    'payment_received',
    'Pagamento confirmado!',
    'Seu acesso Pro foi ativado. Bora criar legendas incríveis!'
  );

  return jsonb_build_object('status', 'ok', 'user_id', v_user_id::text);
end;
$$;

-- Permite que a Edge Function (service_role) chame a função
grant execute on function public.ativar_pro_via_mp(text, text, numeric) to service_role;
