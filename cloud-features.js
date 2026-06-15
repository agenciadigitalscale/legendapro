// LegendaPro: Lógica de templates nuvem, batch export, dashboard
// Este arquivo é chamado APÓS o script principal do app.html

let sb = null;
let cloudTemplates = [];
let batchQueue = [];

// INICIALIZAR INTEGRAÇÃO COM SUPABASE
async function initCloudFeatures() {
  if (!window.LP_CONFIGURADO()) return;
  
  sb = window.supabase.createClient(window.LP_SUPABASE_URL, window.LP_SUPABASE_ANON);
  const { data: { session } } = await sb.auth.getSession();
  
  if (session) {
    // Mostrar seções cloud e batch pro usuário Pro
    const { data: prof } = await sb.from('profiles').select('is_pro').eq('id', session.user.id).single();
    if (prof && (prof.is_pro || prof.is_admin)) {
      document.getElementById('cloudSection').style.display = 'block';
      document.getElementById('batchSection').style.display = 'block';
      setupCloudFeatures();
      setupBatchExport();
    }
  }
}

// TEMPLATES NA NUVEM
function setupCloudFeatures() {
  document.getElementById('btnSaveCloud').addEventListener('click', saveTemplateCloud);
  document.getElementById('btnLoadCloud').addEventListener('click', loadTemplatesCloud);
  document.getElementById('btnListCloud').addEventListener('click', listTemplatesCloud);
}

async function saveTemplateCloud() {
  const name = prompt('Nome do template:');
  if (!name) return;
  
  const btn = document.getElementById('btnSaveCloud');
  btn.disabled = true;
  setStatus('Salvando na nuvem...');
  
  try {
    const result = await sb.rpc('salvar_template_nuvem', {
      nome: name,
      model_id: state.model.id,
      c1: state.c1,
      c2: state.c2,
      c3: state.c3,
      glow: state.glow,
      anim: state.anim,
      scale: state.scale,
      offset: state.offset,
      fmt: state.fmt,
      texts: state.texts
    });
    
    if (result.error) throw result.error;
    setStatus('✓ Template "' + name + '" salvo na nuvem!');
    await sb.rpc('registrar_export', { tipo: 'template_save', formato: state.fmt, model_id: state.model.id });
  } catch (e) {
    setStatus('Erro ao salvar: ' + e.message);
  }
  btn.disabled = false;
}

async function loadTemplatesCloud() {
  try {
    const { data, error } = await sb.from('templates').select('*').order('editado_em', { ascending: false });
    if (error) throw error;
    cloudTemplates = data || [];
    listTemplatesCloud();
  } catch (e) {
    setStatus('Erro ao carregar: ' + e.message);
  }
}

async function listTemplatesCloud() {
  const wrap = document.getElementById('cloudList');
  wrap.innerHTML = '';
  
  if (cloudTemplates.length === 0) {
    wrap.innerHTML = '<p style="font-size:12px;color:#9a9aa3;">Nenhum template salvo na nuvem ainda.</p>';
    return;
  }
  
  cloudTemplates.forEach(tpl => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-play';
    btn.style.cssText = 'flex:0;padding:6px 12px;font-size:11px;';
    btn.textContent = tpl.nome;
    btn.addEventListener('click', () => loadTemplateFromCloud(tpl));
    wrap.appendChild(btn);
  });
}

function loadTemplateFromCloud(tpl) {
  const m = MODELS.find(x => x.id === tpl.model_id);
  if (!m) { setStatus('Modelo não encontrado.'); return; }
  
  state.model = m;
  state.texts = tpl.texts || [];
  state.c1 = tpl.c1;
  state.c2 = tpl.c2;
  state.c3 = tpl.c3;
  state.glow = tpl.glow;
  state.anim = tpl.anim;
  state.scale = tpl.scale;
  state.offset = tpl.offset;
  state.fmt = tpl.fmt;
  
  document.getElementById('c1').value = state.c1;
  document.getElementById('c2').value = state.c2;
  document.getElementById('c3').value = state.c3;
  document.getElementById('glow').checked = state.glow;
  document.getElementById('anim').value = state.anim;
  document.getElementById('soundEffect').value = state.anim; // efeito sonoro combina com animação
  document.getElementById('scale').value = state.scale * 100;
  document.getElementById('offset').value = state.offset;
  document.getElementById('fmt').value = state.fmt;
  document.getElementById('scaleOut').textContent = (state.scale * 100) + '%';
  document.getElementById('offOut').textContent = state.offset;
  
  buildChips();
  buildModels();
  buildTexts();
  applyFormat();
  renderPreview();
  playAnim(pctx, '#1c1c1f');
  
  setStatus('✓ Template "' + tpl.nome + '" carregado!');
  saveToLocalStorage();
}

// BATCH EXPORT
function setupBatchExport() {
  const presets = loadPresets();
  const wrap = document.getElementById('batchList');
  wrap.innerHTML = '';
  
  presets.forEach((p, i) => {
    const tag = document.createElement('button');
    tag.className = 'chip';
    tag.type = 'button';
    tag.style.cssText = 'cursor:pointer;';
    tag.textContent = p.nome + ' ✕';
    
    let selected = false;
    tag.addEventListener('click', (e) => {
      e.preventDefault();
      selected = !selected;
      tag.classList.toggle('active', selected);
      if (selected) batchQueue.push(p);
      else batchQueue = batchQueue.filter(x => x.nome !== p.nome);
    });
    
    wrap.appendChild(tag);
  });
}

async function startBatchExport() {
  if (batchQueue.length === 0) {
    setStatus('Selecione pelo menos 1 cliente.');
    return;
  }
  
  const fmt = document.getElementById('batchFormat').value;
  const btn = document.getElementById('btnBatchExport');
  btn.disabled = true;
  
  const zip = new JSZip();
  let count = 0;
  
  for (const preset of batchQueue) {
    state.c1 = preset.c1;
    state.c2 = preset.c2;
    state.c3 = preset.c3;
    
    const F = dims();
    const c = document.createElement('canvas');
    c.width = F[0]; c.height = F[1];
    const ctx = c.getContext('2d');
    
    let blob;
    
    if (fmt === 'png') {
      drawFrame(ctx, 1, null, state.model, state.texts, state);
      blob = await new Promise(r => c.toBlob(r, 'image/png'));
      zip.file(preset.nome + '-' + state.fmt + '.png', blob);
    } else {
      // video
      const mimes = fmt === 'mp4'
        ? ['video/mp4;codecs=avc1.42E01E', 'video/mp4;codecs=avc1', 'video/mp4']
        : ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
      const mime = mimes.find(m => MediaRecorder.isTypeSupported(m));
      if (!mime) continue;
      
      const bg = fmt === 'mp4' ? '#00ff00' : '#00ff00';
      const rec = new MediaRecorder(c.captureStream(30), { mimeType: mime, videoBitsPerSecond: 8000000 });
      const chunks = [];
      rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      
      await new Promise(resolve => {
        rec.onstop = () => { resolve(); };
        rec.start();
        
        const dur = 1400, total = 4000;
        const start = performance.now();
        
        function tick(now) {
          const el = now - start;
          const t = Math.min(el / dur, 1);
          drawFrame(ctx, t, bg, state.model, state.texts, state);
          if (el < total) requestAnimationFrame(tick);
          else rec.stop();
        }
        requestAnimationFrame(tick);
      });
      
      blob = new Blob(chunks, { type: mime.split(';')[0] });
      zip.file(preset.nome + '-' + state.fmt + '.' + fmt, blob);
    }
    
    count++;
    document.getElementById('batchStatus').textContent = 'Processando: ' + count + '/' + batchQueue.length;
  }
  
  const finalBlob = await zip.generateAsync({ type: 'blob' });
  download(finalBlob, 'legendapro-batch-' + new Date().toISOString().split('T')[0] + '.zip');
  
  setStatus('✓ Pacote com ' + count + ' legendas exportado!');
  await sb.rpc('registrar_export', { tipo: 'batch_' + fmt, formato: state.fmt, model_id: '' });
  
  btn.disabled = false;
}

document.getElementById('btnBatchExport').addEventListener('click', startBatchExport);

// INTEGRAR EFEITOS SONOROS
const originalPlayAnim = playAnim;
window.playAnim = function(targetCtx, bg, onDone, holdMs) {
  originalPlayAnim(targetCtx, bg, onDone, holdMs);
  const soundEffect = document.getElementById('soundEffect').value;
  if (soundEffect !== 'none') {
    playComboSound(soundEffect, state.model.lines.length);
  }
};

// Event listener pra som ao preview atualizar
document.getElementById('soundEffect').addEventListener('change', () => {
  const effect = document.getElementById('soundEffect').value;
  if (effect !== 'none') {
    playComboSound(effect, state.model.lines.length);
  }
});

// DASHBOARD PRO (page separada)
function openDashboardPro() {
  if (!sb) return;
  location.href = 'dashboard.html';
}

// INICIAR TUDO
initCloudFeatures();
