// LegendaPro — Transcrição automática via OpenAI Whisper
// Segredos: OPENAI_API_KEY
// Disponível pra usuários em trial ativo ou Pro

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    if (!user) return new Response('Sessão inválida', { status: 401, headers: CORS })

    // Verifica acesso (trial ou Pro)
    const { data: prof } = await sb
      .from('profiles')
      .select('is_pro, is_admin, trial_start')
      .eq('id', user.id)
      .single()

    const inTrial = prof?.trial_start
      ? (Date.now() - new Date(prof.trial_start).getTime()) < 86_400_000
      : false

    if (!prof?.is_pro && !prof?.is_admin && !inTrial) {
      return new Response(JSON.stringify({ error: 'pro_required' }), {
        status: 403, headers: { ...CORS, 'Content-Type': 'application/json' }
      })
    }

    const OPENAI_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_KEY) {
      return new Response(JSON.stringify({ error: 'openai_not_configured' }), {
        status: 500, headers: { ...CORS, 'Content-Type': 'application/json' }
      })
    }

    // Pega o arquivo de áudio do form
    const form = await req.formData()
    const audio = form.get('audio') as File
    if (!audio) return new Response('Arquivo de áudio ausente', { status: 400, headers: CORS })

    // Limite 25 MB (limite do Whisper)
    if (audio.size > 25 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'file_too_large', max: '25MB' }), {
        status: 400, headers: { ...CORS, 'Content-Type': 'application/json' }
      })
    }

    // Envia pro Whisper
    const whisperForm = new FormData()
    whisperForm.append('file', audio, audio.name || 'audio.mp3')
    whisperForm.append('model', 'whisper-1')
    whisperForm.append('language', 'pt')
    whisperForm.append('response_format', 'verbose_json')
    whisperForm.append('timestamp_granularities[]', 'word')

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_KEY}` },
      body: whisperForm,
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error('Whisper API: ' + err)
    }

    const result = await res.json()
    const text: string = result.text || ''

    // Divide em linhas de legenda (~5-6 palavras por linha)
    const words = text.trim().split(/\s+/).filter(Boolean)
    const WORDS_PER_LINE = 5
    const lines: string[] = []
    for (let i = 0; i < words.length; i += WORDS_PER_LINE) {
      const chunk = words.slice(i, i + WORDS_PER_LINE).join(' ')
      if (chunk) lines.push(chunk)
    }

    // Registra uso
    await sb.rpc('registrar_export', { tipo: 'transcricao', formato: 'whisper', model_id: '' }).catch(() => {})

    return new Response(
      JSON.stringify({ ok: true, text, lines, duration: result.duration }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } }
    )

  } catch (e) {
    console.error('transcribe error:', e)
    return new Response(
      JSON.stringify({ error: String(e) }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  }
})
