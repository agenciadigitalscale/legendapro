# LegendaPro

SaaS de legendas dinâmicas pra editores de vídeo (CapCut, Premiere Pro, DaVinci Resolve), em produção em **https://legendapro.vercel.app**. Site estático (HTML/CSS/JS puro, sem build) hospedado na Vercel, com autenticação e banco no Supabase.

O dono do projeto é o criador (homem, fala português, editor de vídeo com ~30 clientes — Agência Digital Scale). Identidade visual: ciano #00d9ff + verde-ciano #00ffa3 sobre fundo escuro #08090c, fontes Montserrat/Anton/Archivo Black/Playfair Display/Bebas Neue/Caveat (Google Fonts).

## Arquivos

- `index.html` — landing page (hero com tilt 3D, galeria de modelos renderizada ao vivo em canvas, preços, FAQ)
- `app.html` — o produto: gerador de legendas com 34 modelos em 7 categorias, renderização 100% em canvas 2D
- `login.html` — entrar/criar conta (Supabase Auth, e-mail/senha, sem confirmação de e-mail)
- `assinar.html` — pagamento PIX manual (QR Code BR-Code gerado em JS, chave CNPJ 58867806000161, R$ 37,99/mês)
- `admin.html` — painel do criador: lista contas, libera/remove Pro
- `criativo.html` — NÃO LINKADO, uso interno: gera o vídeo de anúncio 9:16 de 30s (7 cenas animadas em canvas, exporta MP4/WebM via MediaRecorder)
- `lp-config.js` — URL e chave anon do Supabase (projeto `uvzdtzpwrojlkcerrqby`) + link do WhatsApp (+55 11 99729-5407)
- `setup-supabase.sql` / `trava-aparelho.sql` — schema do banco (já aplicado)

## Modelo de negócio

Teste grátis de 1 dia (trial_start no servidor) → R$ 37,99/mês pago por PIX manual; cliente manda comprovante no WhatsApp e o criador clica "Liberar Pro" no admin. Conta dele (agenciadigitalscale@gmail.com) nasce admin + Pro vitalício via trigger SQL. Trava de 1 aparelho por conta (RPC `lp_claim_device`, último login expulsa o anterior; admin isento).

## Arquitetura do gerador (app.html)

- `MODELS`: array de modelos; cada linha tem fonte/tamanho/cor (c1/c2/c3)/gap/dx/rot/sp/box/stroke etc.
- `drawFrame(ctx, t, bg, model, texts, opts)`: renderizador único usado por preview, miniaturas e todas as exportações. `opts.lineOv` = overrides por linha (ocultar, espaçamento); `opts.onlyLine` = renderiza só uma linha (export por camadas).
- Exportações: PNG transparente, WebM (CapCut), MP4 verde (Premiere/DaVinci, chroma), sequência PNG com alfa em ZIP (JSZip), camadas separadas (1 PNG por palavra, posicionado, pra sincronizar com a fala no CapCut).
- Formatos: 9:16 (1080×1920), 1:1, 16:9. Responsivo: mobile ≤700px (preview sticky no topo) e widescreen ≥1400px.

## Deploy

`npx vercel --prod --yes` na raiz (projeto Vercel `agenciadigitalscales-projects/legendapro`). `.vercelignore` exclui `.claude` e `meu-video-engine`. Não comitar nada de `meu-video-engine/` (pasta pessoal, fora do produto).

## Regras

- Tudo em português brasileiro (UI e comunicação).
- Sem frameworks/build: HTML+JS puro, um arquivo por página.
- A chave `anon` do Supabase em lp-config.js é pública por design (RLS protege os dados). NUNCA colocar a service_role em lugar nenhum.
- Testar mudanças do gerador nos 3 formatos e conferir que as exportações continuam funcionando.
