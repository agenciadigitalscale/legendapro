// LegendaPro — E-mails automáticos de trial
// Roda via Supabase Scheduled Functions (a cada hora)
// Segredos: RESEND_API_KEY

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND = 'https://api.resend.com/emails'
const FROM   = 'LegendaPro <oi@legendapro.com.br>'
const APP    = 'https://legendapro.vercel.app'

async function send(to: string, subject: string, html: string, key: string) {
  const r = await fetch(RESEND, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html })
  })
  return r.ok
}

// ─── TEMPLATE BASE ────────────────────────────────────────────────────────────
function base(titulo: string, corpo: string, cta: string, ctaUrl: string) {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<style>
  body{margin:0;padding:0;background:#08090c;font-family:'Helvetica Neue',Arial,sans-serif;color:#eef1f4;}
  .w{max-width:560px;margin:0 auto;padding:0 16px;}
  .top{text-align:center;padding:32px 0 20px;}
  .logo{font-size:24px;font-weight:800;color:#fff;}
  .logo span{background:linear-gradient(90deg,#00d9ff,#00ffa3);-webkit-background-clip:text;background-clip:text;color:transparent;}
  .card{background:#101216;border:1px solid #1e2228;border-radius:20px;padding:36px 32px;margin:12px 0;}
  h1{font-size:24px;font-weight:800;margin:0 0 16px;line-height:1.3;}
  p{font-size:15px;color:#aab2bd;line-height:1.7;margin:0 0 16px;}
  .cta{display:block;text-align:center;background:linear-gradient(90deg,#00d9ff,#00ffa3);color:#04151c;font-weight:800;font-size:16px;padding:16px 32px;border-radius:12px;text-decoration:none;margin:24px 0;}
  .tip{background:#13161c;border-left:3px solid #00d9ff;padding:14px 18px;border-radius:0 10px 10px 0;font-size:13px;color:#8a93a0;}
  .foot{text-align:center;padding:24px 0 32px;font-size:12px;color:#4a505c;}
  .foot a{color:#00d9ff;text-decoration:none;}
</style></head><body>
<div class="w">
  <div class="top"><div class="logo">Legenda<span>Pro</span></div></div>
  <div class="card">
    <h1>${titulo}</h1>
    ${corpo}
    <a class="cta" href="${ctaUrl}">${cta}</a>
  </div>
  <div class="foot">LegendaPro — <a href="${APP}">legendapro.vercel.app</a><br>Criado por Agência Digital Scale</div>
</div></body></html>`
}

// ─── TEMPLATE 1: expirando em 2h ─────────────────────────────────────────────
function emailTrialSoon() {
  return base(
    '⏰ Seu teste acaba em 2 horas',
    `<p>Seu dia de teste gratuito no LegendaPro está quase no fim.</p>
     <p>Antes que expire, você conseguiu ver o tempo que economiza com as <strong>60+ legendas dinâmicas</strong> prontas?</p>
     <div class="tip">💡 <strong>Dica rápida:</strong> experimente exportar um WebM e arrastar direto pro CapCut — leva menos de 30 segundos.</div>
     <p style="margin-top:16px;">Se gostou, assine agora por <strong>R$ 37,99/mês</strong> — menos de R$ 1,30 por dia pra nunca mais perder tempo procurando legenda.</p>`,
    '✅ Assinar e continuar usando',
    `${APP}/assinar.html`
  )
}

// ─── TEMPLATE 2: expirou ─────────────────────────────────────────────────────
function emailTrialExpired() {
  return base(
    '🔒 Seu teste expirou — tá perdendo tempo',
    `<p>Seu acesso gratuito ao LegendaPro encerrou.</p>
     <p>Cada vídeo que você edita sem uma legenda profissional é uma oportunidade de engajamento que vai pro lixo. Sabe bem né?</p>
     <p>Com o LegendaPro você tem:</p>
     <ul style="color:#aab2bd;font-size:15px;line-height:2;padding-left:18px;">
       <li><strong style="color:#fff">60+ modelos</strong> organizados por nicho</li>
       <li><strong style="color:#fff">80+ efeitos sonoros</strong> pra baixar em WAV</li>
       <li><strong style="color:#fff">Export universal</strong> — CapCut, Premiere, DaVinci</li>
       <li><strong style="color:#fff">Presets de clientes</strong> — uma vez, pra sempre</li>
     </ul>
     <p>Tudo isso por <strong>R$ 37,99/mês</strong>. Menos de 2 cafés no mês.</p>`,
    '🚀 Reativar meu acesso agora',
    `${APP}/assinar.html`
  )
}

// ─── TEMPLATE 3: última chance (3 dias depois) ────────────────────────────────
function emailLastChance() {
  return base(
    '🔥 Última mensagem — vai ficar sem legenda?',
    `<p>Faz alguns dias desde que seu teste expirou.</p>
     <p>Imagina o tempo que você gastou procurando template, ajustando fonte, recriando do zero o que você já tinha pronto aqui.</p>
     <p>Não vou mais encher sua caixa de mensagens. Esse é meu último recado:</p>
     <div class="tip">Se você edita <strong>1 vídeo por semana</strong>, o LegendaPro economiza pelo menos 30 minutos por vídeo — são <strong>2h/mês</strong> recuperadas por R$ 37,99. Você faz a conta.</div>
     <p style="margin-top:16px;">Se quiser voltar, a porta está aberta.</p>`,
    '↩ Voltar pro LegendaPro',
    `${APP}/assinar.html`
  )
}

// ─── HANDLER ──────────────────────────────────────────────────────────────────
Deno.serve(async () => {
  const sb = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )
  const KEY = Deno.env.get('RESEND_API_KEY')
  if (!KEY) return new Response('RESEND_API_KEY ausente', { status: 500 })

  // Usuários em trial não-pro sem admin
  const { data: users, error } = await sb
    .from('profiles')
    .select('id, email, trial_start')
    .eq('is_pro', false)
    .eq('is_admin', false)
    .not('trial_start', 'is', null)

  if (error) return new Response(error.message, { status: 500 })
  if (!users?.length) return new Response(JSON.stringify({ ok: true, sent: 0 }))

  const now = Date.now()
  let sent = 0

  for (const u of users) {
    if (!u.email) continue
    const h = (now - new Date(u.trial_start).getTime()) / 3_600_000

    // Quais emails já foram enviados
    const { data: notifs } = await sb
      .from('notifications')
      .select('tipo')
      .eq('user_id', u.id)
      .in('tipo', ['email_trial_soon', 'email_trial_expired', 'email_last_chance'])

    const done = new Set(notifs?.map((n: any) => n.tipo))

    const tasks = [
      { tipo: 'email_trial_soon',    min: 22,  max: 24,  subj: '⏰ Seu teste do LegendaPro acaba em 2 horas', html: emailTrialSoon() },
      { tipo: 'email_trial_expired', min: 25,  max: 72,  subj: '🔒 Seu teste expirou — continue no LegendaPro', html: emailTrialExpired() },
      { tipo: 'email_last_chance',   min: 73,  max: 168, subj: '🔥 Última mensagem — vai ficar sem legenda?',  html: emailLastChance() },
    ]

    for (const t of tasks) {
      if (h >= t.min && h < t.max && !done.has(t.tipo)) {
        const ok = await send(u.email, t.subj, t.html, KEY)
        if (ok) {
          await sb.from('notifications').insert({
            user_id: u.id, tipo: t.tipo,
            titulo: 'Email enviado: ' + t.tipo, mensagem: t.subj
          })
          sent++
        }
      }
    }
  }

  return new Response(JSON.stringify({ ok: true, sent, total: users.length }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
