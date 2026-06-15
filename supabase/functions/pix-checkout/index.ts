// LegendaPro — Criar PIX dinâmico via Mercado Pago
// Gera QR Code único por usuário/plano com rastreamento automático
// Segredos necessários: MERCADOPAGO_ACCESS_TOKEN

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PLANOS: Record<string, number> = {
  mensal: 59.90,
  anual: 479.90,
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const auth = req.headers.get('Authorization')
    if (!auth) return new Response('Não autenticado', { status: 401, headers: CORS })

    const sb = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: auth } } }
    )

    const { data: { user } } = await sb.auth.getUser()
    if (!user) return new Response('Usuário inválido', { status: 401, headers: CORS })

    const { plano } = await req.json()
    const valor = PLANOS[plano]
    if (!valor) return new Response('Plano inválido', { status: 400, headers: CORS })

    const mpToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')
    const idempotency = `legendapro-${user.id}-${plano}-${Date.now()}`

    const mpRes = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mpToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': idempotency,
      },
      body: JSON.stringify({
        transaction_amount: valor,
        description: `LegendaPro Pro ${plano}`,
        payment_method_id: 'pix',
        payer: { email: user.email },
        external_reference: `${user.id}|pix-${plano}`,
        notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/pix-webhook`,
      }),
    })

    const payment = await mpRes.json()
    if (!payment?.id) throw new Error(payment?.message ?? JSON.stringify(payment))

    const qr = payment.point_of_interaction?.transaction_data
    return new Response(JSON.stringify({
      id: payment.id,
      qr_code: qr?.qr_code,
      qr_code_base64: qr?.qr_code_base64,
      valor,
      expira_em: payment.date_of_expiration,
    }), { headers: { ...CORS, 'Content-Type': 'application/json' } })

  } catch (err) {
    console.error('Erro no checkout:', err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
