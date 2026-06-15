// Webhook do Mercado Pago → ativa Pro no Supabase automaticamente
// Deploy: supabase functions deploy mp-webhook
// Segredo necessário: MP_ACCESS_TOKEN (no painel Supabase → Settings → Secrets)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const headers = { 'Content-Type': 'application/json' }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200 })

  try {
    const body = await req.json()

    // MP envia type=payment para pagamentos avulsos e recorrentes
    const tipo = body.type ?? ''
    if (!['payment', 'subscription_authorized_payment'].includes(tipo)) {
      return new Response(JSON.stringify({ ok: true, skip: tipo }), { headers })
    }

    const paymentId = body.data?.id
    if (!paymentId) return new Response(JSON.stringify({ error: 'no id' }), { status: 400, headers })

    const mpToken = Deno.env.get('MP_ACCESS_TOKEN')
    if (!mpToken) throw new Error('MP_ACCESS_TOKEN não configurado em Secrets')

    // Busca detalhes do pagamento na API do Mercado Pago
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${mpToken}` }
    })
    if (!mpRes.ok) throw new Error(`MP API: ${mpRes.status}`)
    const payment = await mpRes.json()

    // Ignora pagamentos não aprovados (pending, cancelled, rejected, etc.)
    if (payment.status !== 'approved') {
      return new Response(JSON.stringify({ ok: true, status: payment.status }), { headers })
    }

    const email = payment.payer?.email
    if (!email) throw new Error('email do pagador não encontrado no pagamento')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data, error } = await supabase.rpc('ativar_pro_via_mp', {
      p_email: email.toLowerCase(),
      p_mp_id: String(paymentId),
      p_valor: payment.transaction_amount ?? 37.99
    })

    if (error) throw error

    console.log('mp-webhook ok:', data)
    return new Response(JSON.stringify({ ok: true, result: data }), { headers })

  } catch (e) {
    console.error('mp-webhook erro:', e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers })
  }
})
