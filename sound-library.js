// LegendaPro — Biblioteca de SFX com preview + download WAV
// Conecta aos geradores em sound-effects.js

const SOUND_LIBRARY = {
  transitions: {
    name: '🎬 Transições', desc: 'Entradas, saídas, swooshes',
    effects: [
      { id: 'whoosh-forward',   name: 'Whoosh Frontal',    desc: 'Varrido rápido pra frente' },
      { id: 'whoosh-reverse',   name: 'Whoosh Reverso',    desc: 'Varrido de volta' },
      { id: 'sweep-up',         name: 'Sweep Subindo',     desc: 'Tom subindo em sweep' },
      { id: 'sweep-down',       name: 'Sweep Descendo',    desc: 'Tom descendo em sweep' },
      { id: 'digital-swipe',    name: 'Digital Swipe',     desc: 'Corte eletrônico' },
      { id: 'transition-pop',   name: 'Pop Transição',     desc: 'Entrada com pop seco' },
      { id: 'reverse-cymbal',   name: 'Cymbal Reverso',    desc: 'Prato reverso (cinema)' },
      { id: 'scratch-vinyl',    name: 'Scratch Vinil',     desc: 'Disco sendo riscado' },
      { id: 'synth-whoosh',     name: 'Synth Whoosh',      desc: 'Swoosh sintetizado' },
      { id: 'riser-cinematic',  name: 'Riser Cinemático',  desc: 'Crescendo dramático' },
    ]
  },
  impacts: {
    name: '💥 Impactos', desc: 'Pancadas, socos, batidas',
    effects: [
      { id: 'kick-bass',        name: 'Kick Bass',         desc: 'Batida de bumbo profunda' },
      { id: 'punch-hard',       name: 'Soco Forte',        desc: 'Impacto de soco direto' },
      { id: 'punch-soft',       name: 'Soco Macio',        desc: 'Pancada corporal suave' },
      { id: 'clap-loud',        name: 'Palma Alta',        desc: 'Palma forte e seca' },
      { id: 'clap-soft',        name: 'Palma Macia',       desc: 'Palma suave' },
      { id: 'snap-fingers',     name: 'Estalo Dedos',      desc: 'Snap de dedos' },
      { id: 'stomp-floor',      name: 'Pisada Forte',      desc: 'Pisada pesada no chão' },
      { id: 'thump-deep',       name: 'Thump Profundo',    desc: 'Batida grave e densa' },
      { id: 'hit-metal',        name: 'Bater Metal',       desc: 'Pancada em metal' },
      { id: 'hit-wood',         name: 'Bater Madeira',     desc: 'Pancada em madeira' },
      { id: 'impact-cinematic', name: 'Impacto Cinema',    desc: 'Impacto de trailer' },
    ]
  },
  explosions: {
    name: '🔥 Explosões', desc: 'Do pequeno ao épico',
    effects: [
      { id: 'explosion-small',   name: 'Explosão Leve',     desc: 'Detonação pequena' },
      { id: 'explosion-medium',  name: 'Explosão Média',    desc: 'Impacto moderado' },
      { id: 'explosion-massive', name: 'Explosão Épica',    desc: 'Grande detonação' },
      { id: 'blast-wave',        name: 'Onda de Choque',    desc: 'Expansão de onda' },
      { id: 'firecracker',       name: 'Bombinha',          desc: 'Petardo/fogos' },
      { id: 'thunder-strike',    name: 'Trovão',            desc: 'Relâmpago/trovão' },
      { id: 'trailer-braam',     name: 'Trailer Braam',     desc: 'Braam de trailer épico' },
    ]
  },
  electronic: {
    name: '⚙️ Eletrônico', desc: 'Beeps, glitches, sci-fi',
    effects: [
      { id: 'beep-low',         name: 'Beep Grave',        desc: 'Beep eletrônico 440hz' },
      { id: 'beep-high',        name: 'Beep Agudo',        desc: 'Beep eletrônico agudo' },
      { id: 'beep-sequence',    name: 'Sequência Beep',    desc: '3 beeps em sequência' },
      { id: 'glitch-digital',   name: 'Glitch Digital',    desc: 'Glitch leve' },
      { id: 'glitch-heavy',     name: 'Glitch Pesado',     desc: 'Glitch distorcido' },
      { id: 'laser-zap',        name: 'Laser Zap',         desc: 'Raio laser descendente' },
      { id: 'laser-rise',       name: 'Laser Rise',        desc: 'Laser subindo' },
      { id: 'radar-ping',       name: 'Radar Ping',        desc: 'Sonar/radar' },
      { id: 'power-up',         name: 'Power Up',          desc: 'Ativação de energia' },
      { id: 'power-down',       name: 'Power Down',        desc: 'Desligamento' },
      { id: 'error-buzz',       name: 'Erro Buzz',         desc: 'Som de erro' },
      { id: 'electric-spark',   name: 'Faísca Elétrica',   desc: 'Faísca/descarga' },
      { id: 'sci-fi-scan',      name: 'Scan Sci-Fi',       desc: 'Varredura futurista' },
    ]
  },
  notifications: {
    name: '🔔 Notificação', desc: 'Alertas, UI, confirmações',
    effects: [
      { id: 'notification-ping', name: 'Notificação Ping',  desc: 'Alerta suave' },
      { id: 'success-chime',     name: 'Sucesso Chime',     desc: 'Confirmação positiva' },
      { id: 'alert-warn',        name: 'Alerta Aviso',      desc: 'Tom de atenção' },
      { id: 'error-beep',        name: 'Erro Beep',         desc: '3 beeps de erro' },
      { id: 'message-pop',       name: 'Mensagem Pop',      desc: 'Pop de nova mensagem' },
      { id: 'level-up',          name: 'Level Up',          desc: 'Subiu de nível' },
      { id: 'coin-collect',      name: 'Coletar Moeda',     desc: 'Moeda/ponto coletado' },
      { id: 'ui-click',          name: 'UI Click',          desc: 'Clique de interface' },
      { id: 'countdown-tick',    name: 'Tick Contagem',     desc: 'Relógio/countdown' },
      { id: 'victory',           name: 'Vitória',           desc: 'Fanfarra de vitória' },
    ]
  },
  comedy: {
    name: '😂 Cômico', desc: 'Cartoon, engraçado',
    effects: [
      { id: 'boing-spring',      name: 'Boing Mola',        desc: 'Mola soltando' },
      { id: 'squeak-toy',        name: 'Squeak Brinquedo',  desc: 'Brinquedo espremido' },
      { id: 'wah-wah-sad',       name: 'Wah Wah Triste',    desc: 'Decepção cômica' },
      { id: 'horn-honk',         name: 'Buzina',            desc: 'Buzina/trompa' },
      { id: 'slide-whistle-up',  name: 'Apito Subindo',     desc: 'Slide whistle ↑' },
      { id: 'slide-whistle-down',name: 'Apito Descendo',    desc: 'Slide whistle ↓' },
      { id: 'comedy-rimshot',    name: 'Comedy Rimshot',    desc: 'Ba dum tss' },
      { id: 'cartoon-pop',       name: 'Pop Cartoon',       desc: 'Pop de cartoon' },
    ]
  },
  horror: {
    name: '👻 Horror', desc: 'Susto, tensão, mistério',
    effects: [
      { id: 'scare-sting',       name: 'Sting Susto',       desc: 'Susto agudo' },
      { id: 'ambient-dark',      name: 'Ambiente Sombrio',  desc: 'Fundo tenebroso' },
      { id: 'ghost-whoosh',      name: 'Whoosh Fantasma',   desc: 'Som etéreo' },
      { id: 'heartbeat-fast',    name: 'Coração Acelerado', desc: 'Pânico/tensão' },
      { id: 'ghost-wail',        name: 'Lamento Fantasma',  desc: 'Banshee/gemido' },
      { id: 'eerie-tension',     name: 'Tensão Eerie',      desc: 'Suspense crescente' },
    ]
  },
  action: {
    name: '⚔️ Ação', desc: 'Rápido, dinâmico, intenso',
    effects: [
      { id: 'whoosh-fast',       name: 'Whoosh Ultra-Rápido', desc: 'Movimento veloz' },
      { id: 'weapon-slash',      name: 'Golpe Espada',       desc: 'Corte de arma' },
      { id: 'bullet-fly',        name: 'Bala Passando',      desc: 'Projétil veloz' },
      { id: 'tension-rise',      name: 'Tensão Subindo',     desc: 'Bass crescendo' },
      { id: 'impact-cinematic',  name: 'Impacto Épico',      desc: 'Hit cinemático' },
      { id: 'trailer-braam',     name: 'Braam Trailer',      desc: 'Braam épico' },
    ]
  },
  musical: {
    name: '🎵 Musical', desc: 'Notas, acordes, melodias',
    effects: [
      { id: 'bell-ding',         name: 'Sino Ding',          desc: 'Sino/campainha' },
      { id: 'piano-note',        name: 'Nota Piano',         desc: 'Toque de piano' },
      { id: 'wind-chimes',       name: 'Carrilhões Vento',   desc: 'Carrilhões ao vento' },
      { id: 'xylophone-hit',     name: 'Xilofone',           desc: 'Batiida de xilofone' },
      { id: 'wrong-note',        name: 'Nota Errada',        desc: 'Desafinado/cômico' },
      { id: 'magic-spell',       name: 'Feitiço Mágico',     desc: 'Magia/encantamento' },
      { id: 'crystalline',       name: 'Cristal',            desc: 'Sons cristalinos' },
      { id: 'shimmer',           name: 'Shimmer Brilho',     desc: 'Brilho mágico' },
      { id: 'portal-open',       name: 'Portal Abre',        desc: 'Abertura de portal' },
      { id: 'victory',           name: 'Vitória',            desc: 'Fanfarra vitória' },
    ]
  },
  foley: {
    name: '👣 Foley', desc: 'Ambiente, objetos, movimento',
    effects: [
      { id: 'footstep-hard',     name: 'Passo Duro',         desc: 'Piso duro' },
      { id: 'footstep-soft',     name: 'Passo Macio',        desc: 'Carpete/grama' },
      { id: 'door-close',        name: 'Porta Fechando',     desc: 'Porta bate' },
      { id: 'door-knock',        name: 'Batida Porta',       desc: '3 batidas' },
      { id: 'typing-key',        name: 'Tecla Digitando',    desc: 'Teclado' },
      { id: 'glass-clink',       name: 'Vidro Clink',        desc: 'Copos tinindo' },
      { id: 'glass-break',       name: 'Vidro Quebrando',    desc: 'Vidro se estilhaça' },
      { id: 'paper-rustle',      name: 'Papel Rustling',     desc: 'Papel amassando' },
      { id: 'water-drip',        name: 'Gota Água',          desc: 'Pingo d\'água' },
      { id: 'water-splash',      name: 'Água Respingando',   desc: 'Respingo' },
      { id: 'wind-breeze',       name: 'Brisa de Vento',     desc: 'Vento suave' },
      { id: 'camera-shutter',    name: 'Obturador Camera',   desc: 'Clique de foto' },
    ]
  }
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const SOUND_LIBRARY_CSS = `
#soundLibraryContainer { font-family: 'Montserrat', sans-serif; }
.slib-head { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid #23272f; }
.slib-head h3 { margin:0; font-size:13px; font-weight:800; color:#eef1f4; }
.slib-head p { margin:0; font-size:10px; color:#6f7482; }
.slib-dl-all { background:linear-gradient(90deg,#00d9ff,#00ffa3); color:#04151c; border:none; border-radius:8px; font-family:inherit; font-weight:800; font-size:11px; padding:6px 12px; cursor:pointer; white-space:nowrap; }
.slib-tabs { display:flex; gap:5px; padding:10px 12px 0; overflow-x:auto; border-bottom:1px solid #23272f; scrollbar-width:none; }
.slib-tabs::-webkit-scrollbar { display:none; }
.slib-tab { background:transparent; border:1px solid #2a2f38; color:#7a8494; padding:5px 10px; border-radius:6px; font-size:10px; font-weight:700; cursor:pointer; white-space:nowrap; font-family:inherit; transition:all .15s; }
.slib-tab:hover { border-color:#00d9ff; color:#00d9ff; }
.slib-tab.active { background:#00d9ff22; color:#00d9ff; border-color:#00d9ff; }
.slib-cat-info { padding:8px 12px; font-size:11px; color:#6f7482; border-bottom:1px solid #1e2228; }
.slib-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); gap:6px; padding:10px 12px 14px; max-height:260px; overflow-y:auto; scrollbar-width:thin; scrollbar-color:#2a2f38 transparent; }
.slib-card { background:#16181d; border:1px solid #23272f; border-radius:8px; overflow:hidden; transition:border-color .15s; }
.slib-card:hover { border-color:#00d9ff55; }
.slib-card.playing { border-color:#00ffa3; background:#00ffa308; }
.slib-card.selected { border-color:#00d9ff; background:#00d9ff12; }
.slib-play { display:block; width:100%; background:none; border:none; padding:8px 9px 4px; cursor:pointer; text-align:left; font-family:inherit; color:inherit; }
.slib-name { font-size:11px; font-weight:700; color:#dde1ea; margin-bottom:2px; line-height:1.3; }
.slib-desc { font-size:9px; color:#6f7482; line-height:1.4; }
.slib-actions { display:flex; border-top:1px solid #1e2228; }
.slib-btn-use { flex:1; background:none; border:none; border-right:1px solid #1e2228; padding:5px 0; font-size:9px; font-weight:700; color:#00d9ff; cursor:pointer; font-family:inherit; transition:background .15s; }
.slib-btn-use:hover { background:#00d9ff15; }
.slib-btn-dl { flex:0 0 30px; background:none; border:none; font-size:12px; cursor:pointer; transition:background .15s; }
.slib-btn-dl:hover { background:#00ffa315; }
.slib-dl-progress { padding:6px 12px; font-size:11px; color:#00ffa3; display:none; }
@media(max-width:700px){ .slib-grid{ grid-template-columns:repeat(2,1fr); } }
`;

// ─── RENDER UI ────────────────────────────────────────────────────────────────
function initSoundLibrary() {
  const container = document.getElementById('soundLibraryContainer');
  if (!container) return;

  // Injeta CSS uma vez
  if (!document.getElementById('slib-css')) {
    const s = document.createElement('style'); s.id = 'slib-css'; s.textContent = SOUND_LIBRARY_CSS;
    document.head.appendChild(s);
  }

  const allIds = Object.values(SOUND_LIBRARY).flatMap(c => c.effects.map(e => e.id));

  container.innerHTML = `
    <div class="slib-head">
      <div><h3>🎵 SFX Library</h3><p>${allIds.length} efeitos sonoros — preview + download WAV</p></div>
      <button class="slib-dl-all" id="slibDlAll">⬇ Pack Completo</button>
    </div>
    <div class="slib-tabs" id="slibTabs">
      ${Object.entries(SOUND_LIBRARY).map(([key, cat], i) =>
        `<button class="slib-tab${i===0?' active':''}" data-cat="${key}">${cat.name}</button>`
      ).join('')}
    </div>
    <div class="slib-cat-info" id="slibCatInfo"></div>
    <div class="slib-grid" id="slibGrid"></div>
    <div class="slib-dl-progress" id="slibDlProg"></div>
  `;

  const firstCat = Object.keys(SOUND_LIBRARY)[0];
  renderEffects(firstCat);

  container.querySelectorAll('.slib-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.slib-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderEffects(tab.dataset.cat);
    });
  });

  document.getElementById('slibDlAll').addEventListener('click', async () => {
    const btn = document.getElementById('slibDlAll');
    const prog = document.getElementById('slibDlProg');
    btn.disabled = true; btn.textContent = 'Gerando...';
    prog.style.display = 'block';
    await downloadAllSFX(allIds, (done, total) => {
      prog.textContent = `Processando ${done}/${total}...`;
    });
    prog.style.display = 'none';
    btn.disabled = false; btn.textContent = '⬇ Pack Completo';
  });
}

function renderEffects(catKey) {
  const cat = SOUND_LIBRARY[catKey];
  if (!cat) return;
  document.getElementById('slibCatInfo').textContent = cat.name + ' — ' + cat.desc;
  const grid = document.getElementById('slibGrid');

  grid.innerHTML = cat.effects.map(e => `
    <div class="slib-card" id="sfxcard-${e.id}">
      <button class="slib-play" onclick="previewSFX('${e.id}')">
        <div class="slib-name">${e.name}</div>
        <div class="slib-desc">${e.desc}</div>
      </button>
      <div class="slib-actions">
        <button class="slib-btn-use" onclick="selectSoundEffect('${e.id}','${e.name}')">usar ▶</button>
        <button class="slib-btn-dl" title="Baixar WAV" onclick="downloadSFX('${e.id}','${e.id}')">⬇</button>
      </div>
    </div>
  `).join('');
}

window.previewSFX = function(id) {
  const card = document.getElementById('sfxcard-' + id);
  if (card) { card.classList.add('playing'); setTimeout(() => card.classList.remove('playing'), 600); }
  playSound(id);
};

window.selectSoundEffect = function(effectId, effectName) {
  if (typeof state !== 'undefined') {
    state.soundEffect = effectId;
    if (typeof saveToLocalStorage === 'function') saveToLocalStorage();
  }
  const sel = document.getElementById('soundEffect');
  if (sel) sel.value = effectId;
  document.querySelectorAll('.slib-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById('sfxcard-' + effectId);
  if (card) card.classList.add('selected');
  if (typeof setStatus === 'function') setStatus(`✓ SFX "${effectName}" selecionado`);
  playSound(effectId);
};

window.SOUND_LIBRARY = SOUND_LIBRARY;
window.initSoundLibrary = initSoundLibrary;
window.SOUND_LIBRARY_CSS = SOUND_LIBRARY_CSS;
