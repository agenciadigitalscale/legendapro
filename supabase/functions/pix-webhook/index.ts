// LegendaPro — Webhook Mercado Pago
// Recebe notificações de pagamento e libera Pro automaticamente
// Segredos necessários: MERCADOPAGO_ACCESS_TOKEN, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature, x-request-id',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const body = await req.json()

    // MP envia type='payment' para pagamentos aprovados/atualizados
    if (body.type !== 'payment' && body.action !== 'payment.updated') {
      return new Response('ignored', { headers: CORS })
    }

    const paymentId = body.data?.id || body.id
    if (!paymentId) return new Response('sem payment id', { status: 400, headers: CORS })

    // Busca detalhes do pagamento na API do MP
    const mpToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${mpToken}` }
    })
    const payment = await mpRes.json()

    if (payment.status !== 'approved') {
      console.log(`Pagamento ${paymentId} não aprovado: ${payment.status}`)
      return new Response('not approved', { headers: CORS })
    }

    const email = payment.payer?.email
    if (!email) return new Response('sem email', { headers: CORS })

    const sb = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: profile } = await sb
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (!profile) {
      console.warn(`Usuário não encontrado para email: ${email}`)
      return new Response('user not found', { headers: CORS })
    }

    // Assinaturas (cartão MP): sem expiração — MP cancela se o pagamento falhar
    // PIX avulso (external_reference contém 'pix'): +31 dias
    const isAvulso = (payment.external_reference || '').includes('pix')
    const expiresAt = isAvulso
      ? new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString()
      : null

    await sb.from('profiles').update({
      is_pro: true,
      pro_expires_at: expiresAt,
      mp_payment_id: String(paymentId),
      updated_at: new Date().toISOString()
    }).eq('id', profile.id)

    console.log(`✅ Pro liberado: ${email} | payment ${paymentId} | expira: ${expiresAt ?? 'nunca'}`)
    return new Response('ok', { headers: CORS })

  } catch (err) {
    console.error('Erro no webhook:', err)
    return new Response('error', { status: 500, headers: CORS })
  }
})
