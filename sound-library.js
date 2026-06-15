// LegendaPro Sound Effects Library
// Referências profissionais de categorias e nomes de efeitos sonoros
// Compilado de: Zapsplat, Freesound, Epidemic Sound, AudioNetwork

const SOUND_LIBRARY = {
  // TRANSIÇÕES (Entrada/Saída de legendas)
  transitions: {
    name: '🎬 Transições',
    icon: '→',
    desc: 'Entradas, saídas, cortes',
    effects: [
      { id: 'whoosh-forward', name: 'Whoosh Frontal', desc: 'Transição rápida para frente', duration: 0.3 },
      { id: 'whoosh-reverse', name: 'Whoosh Reverso', desc: 'Transição para trás', duration: 0.3 },
      { id: 'sweep-up', name: 'Sweep Ascendente', desc: 'Som varrendo pra cima', duration: 0.4 },
      { id: 'sweep-down', name: 'Sweep Descendente', desc: 'Som varrendo pra baixo', duration: 0.4 },
      { id: 'digital-swipe', name: 'Digital Swipe', desc: 'Corte digital/eletrônico', duration: 0.2 },
      { id: 'transition-pop', name: 'Pop Transição', desc: 'Entrada com Pop suave', duration: 0.15 },
      { id: 'reverse-cymbal', name: 'Cymbal Reverso', desc: 'Prato reverso (tipo filme)', duration: 0.5 },
      { id: 'scratch-vinyl', name: 'Scratch Vinil', desc: 'Efeito de disco vinil', duration: 0.3 },
    ]
  },

  // IMPACTOS (Batidas, pancadas, explosões leves)
  impacts: {
    name: '💥 Impactos',
    icon: '⚡',
    desc: 'Pancadas, batidas, socos',
    effects: [
      { id: 'kick-bass', name: 'Kick Bass', desc: 'Batida de baixo profundo', duration: 0.15 },
      { id: 'punch-hard', name: 'Soco Forte', desc: 'Impacto de soco direto', duration: 0.1 },
      { id: 'punch-soft', name: 'Soco Macio', desc: 'Impacto suave/corporal', duration: 0.15 },
      { id: 'clap-loud', name: 'Palma Alta', desc: 'Aplauso forte isolado', duration: 0.2 },
      { id: 'clap-soft', name: 'Palma Macia', desc: 'Aplauso suave', duration: 0.15 },
      { id: 'snap-fingers', name: 'Snap Dedos', desc: 'Estalo de dedos', duration: 0.1 },
      { id: 'stomp-floor', name: 'Pisada Forte', desc: 'Pisada no chão', duration: 0.2 },
      { id: 'thump-deep', name: 'Thump Profundo', desc: 'Pancada grave', duration: 0.25 },
      { id: 'hit-wood', name: 'Bater Madeira', desc: 'Pancada em madeira', duration: 0.15 },
      { id: 'hit-metal', name: 'Bater Metal', desc: 'Bata em metal/sino', duration: 0.3 },
    ]
  },

  // EXPLOSÕES
  explosions: {
    name: '🔥 Explosões',
    icon: '💣',
    desc: 'Explosões, detonações, estrondos',
    effects: [
      { id: 'explosion-small', name: 'Explosão Pequena', desc: 'Explosão leve/longe', duration: 0.5 },
      { id: 'explosion-medium', name: 'Explosão Média', desc: 'Explosão moderada', duration: 0.7 },
      { id: 'explosion-massive', name: 'Explosão Gigante', desc: 'Impacto de explosão grande', duration: 1.0 },
      { id: 'explosion-distant', name: 'Explosão Distante', desc: 'Explosão longe', duration: 0.8 },
      { id: 'blast-wave', name: 'Onda de Choque', desc: 'Efeito de onda expansiva', duration: 0.6 },
      { id: 'firecracker', name: 'Bombinha', desc: 'Efeito de bombinha/petardo', duration: 0.15 },
      { id: 'thunder-strike', name: 'Trovão', desc: 'Som de trovão/relâmpago', duration: 0.8 },
    ]
  },

  // ELETRÔNICO/DIGITAL
  electronic: {
    name: '⚙️ Eletrônico',
    icon: '🔌',
    desc: 'Beeps, glitches, sintetizadores',
    effects: [
      { id: 'beep-low', name: 'Beep Grave', desc: 'Beep eletrônico grave', duration: 0.1 },
      { id: 'beep-high', name: 'Beep Agudo', desc: 'Beep eletrônico agudo', duration: 0.08 },
      { id: 'beep-sequence', name: 'Sequência Beep', desc: '3-4 beeps em sequência', duration: 0.3 },
      { id: 'glitch-digital', name: 'Glitch Digital', desc: 'Efeito glitch/erro', duration: 0.15 },
      { id: 'glitch-heavy', name: 'Glitch Pesado', desc: 'Glitch mais distorcido', duration: 0.25 },
      { id: 'laser-zap', name: 'Laser Zap', desc: 'Som de laser/raio', duration: 0.3 },
      { id: 'radar-ping', name: 'Radar Ping', desc: 'Som de radar/sonar', duration: 0.2 },
      { id: 'power-up', name: 'Power Up', desc: 'Efeito de ativação/carga', duration: 0.4 },
      { id: 'power-down', name: 'Power Down', desc: 'Efeito de desligamento', duration: 0.3 },
      { id: 'error-buzz', name: 'Erro Buzz', desc: 'Som de erro/aviso', duration: 0.15 },
      { id: 'synth-whoosh', name: 'Synth Whoosh', desc: 'Sintetizador swoosh', duration: 0.4 },
    ]
  },

  // NATUREZA
  nature: {
    name: '🌿 Natureza',
    icon: '🍃',
    desc: 'Vento, chuva, água, animais',
    effects: [
      { id: 'wind-breeze', name: 'Brisa Vento', desc: 'Vento suave passando', duration: 1.0 },
      { id: 'wind-heavy', name: 'Vento Forte', desc: 'Vento forte/tempestade', duration: 1.2 },
      { id: 'rain-light', name: 'Chuva Leve', desc: 'Chuva leve/gotículas', duration: 1.5 },
      { id: 'rain-heavy', name: 'Chuva Pesada', desc: 'Chuva forte/temporal', duration: 1.5 },
      { id: 'water-splash', name: 'Água Respingo', desc: 'Som de água respingando', duration: 0.4 },
      { id: 'water-drip', name: 'Água Gota', desc: 'Gota de água caindo', duration: 0.2 },
      { id: 'thunder', name: 'Trovão Distante', desc: 'Trovão longe', duration: 1.0 },
      { id: 'forest-ambience', name: 'Floresta Ambiente', desc: 'Sons da floresta', duration: 2.0 },
      { id: 'bird-chirp', name: 'Pássaro Canto', desc: 'Canto de pássaro', duration: 0.5 },
      { id: 'dog-bark', name: 'Latido Cão', desc: 'Latido de cachorro', duration: 0.3 },
      { id: 'cat-meow', name: 'Miau Gato', desc: 'Miau de gato', duration: 0.2 },
    ]
  },

  // FOLEY (Passos, objetos, movimentos)
  foley: {
    name: '👣 Foley',
    icon: '🚶',
    desc: 'Passos, movimento, objetos',
    effects: [
      { id: 'footstep-hard', name: 'Passo Duro', desc: 'Passos em piso duro', duration: 0.3 },
      { id: 'footstep-soft', name: 'Passo Macio', desc: 'Passos em carpete/grama', duration: 0.3 },
      { id: 'running-fast', name: 'Corrida Rápida', desc: 'Som de corrida intensa', duration: 0.5 },
      { id: 'door-open', name: 'Porta Abre', desc: 'Som de porta abrindo', duration: 0.4 },
      { id: 'door-close', name: 'Porta Fecha', desc: 'Som de porta fechando', duration: 0.3 },
      { id: 'door-knock', name: 'Bater Porta', desc: 'Batida na porta', duration: 0.3 },
      { id: 'paper-rustle', name: 'Papel Rustling', desc: 'Som de papel amassando', duration: 0.4 },
      { id: 'cloth-swish', name: 'Pano Swish', desc: 'Som de pano movendo', duration: 0.3 },
      { id: 'chain-rattle', name: 'Corrente Som', desc: 'Corrente/metal tinindo', duration: 0.5 },
      { id: 'glass-clink', name: 'Vidro Clink', desc: 'Som de vidros batendo', duration: 0.2 },
    ]
  },

  // MUSICAIS (Tones, acordes, melodias)
  musical: {
    name: '🎵 Musical',
    icon: '♪',
    desc: 'Notas, acordes, efeitos musicais',
    effects: [
      { id: 'piano-note', name: 'Nota Piano', desc: 'Nota de piano isolada', duration: 0.8 },
      { id: 'bell-ding', name: 'Sino Ding', desc: 'Som de sino/campainha', duration: 0.6 },
      { id: 'wind-chimes', name: 'Carrilhões Vento', desc: 'Carrilhões ao vento', duration: 1.5 },
      { id: 'xylophone-hit', name: 'Xilofone Batiida', desc: 'Nota de xilofone', duration: 0.3 },
      { id: 'tuning-fork', name: 'Diapasão', desc: 'Som de diapasão', duration: 1.0 },
      { id: 'wrong-note', name: 'Nota Errada', desc: 'Nota desafinada/engraçada', duration: 0.3 },
      { id: 'violin-screech', name: 'Violino Rangido', desc: 'Efeito de violino rangendo', duration: 0.5 },
      { id: 'record-scratch', name: 'Disco Scratch', desc: 'Vinil sendo riscado', duration: 0.4 },
    ]
  },

  // CÔMICO/CARTOON
  comedy: {
    name: '😂 Cômico',
    icon: '🤪',
    desc: 'Efeitos engraçados, cartoon',
    effects: [
      { id: 'boing-spring', name: 'Boing Mola', desc: 'Efeito de mola soltando', duration: 0.3 },
      { id: 'squeak-toy', name: 'Squeak Brinquedo', desc: 'Som de brinquedo espremido', duration: 0.15 },
      { id: 'crash-cymbals', name: 'Crash Pratos', desc: 'Crash de pratos (cômico)', duration: 0.5 },
      { id: 'wah-wah-sad', name: 'Wah Wah Triste', desc: 'Efeito triste/decepção', duration: 0.5 },
      { id: 'horn-honk', name: 'Buzina Honk', desc: 'Som de buzina/trometa', duration: 0.2 },
      { id: 'fart-sound', name: 'Som Fart', desc: '... você sabe', duration: 0.15 },
      { id: 'kazoo-note', name: 'Kazoo Nota', desc: 'Som de kazoo', duration: 0.3 },
      { id: 'slide-whistle', name: 'Apito Slide', desc: 'Apito descendo/subindo', duration: 0.4 },
    ]
  },

  // HORROR/SUSPENSE
  horror: {
    name: '👻 Horror',
    icon: '☠️',
    desc: 'Assustador, suspense, misterioso',
    effects: [
      { id: 'scare-sting', name: 'Sting Susto', desc: 'Sting assustador agudo', duration: 0.3 },
      { id: 'ambient-dark', name: 'Ambiente Escuro', desc: 'Fundo misterioso/sombrio', duration: 2.0 },
      { id: 'ghost-whoosh', name: 'Whoosh Fantasma', desc: 'Som etéreo/sobrenatural', duration: 0.4 },
      { id: 'heartbeat-fast', name: 'Batida Coração', desc: 'Coração acelerado (pânico)', duration: 0.5 },
      { id: 'creepy-crawl', name: 'Arrepio Creepy', desc: 'Som arrepiante longo', duration: 1.5 },
      { id: 'ghost-wail', name: 'Lamento Fantasma', desc: 'Som de fantasma/banshee', duration: 0.8 },
      { id: 'eerie-strings', name: 'Cordas Assombradas', desc: 'Cordas tenebrosas', duration: 1.2 },
    ]
  },

  // AÇÃO/DINÂMICO
  action: {
    name: '⚔️ Ação',
    icon: '🎬',
    desc: 'Lutador, perseguição, dinâmico',
    effects: [
      { id: 'whoosh-fast', name: 'Whoosh Rápido', desc: 'Movimento rápido/ar', duration: 0.25 },
      { id: 'weapon-slash', name: 'Espada Corte', desc: 'Som de espada/corte', duration: 0.3 },
      { id: 'weapon-impact', name: 'Impacto Arma', desc: 'Bater com arma/objeto', duration: 0.2 },
      { id: 'bullet-fly', name: 'Bala Passa', desc: 'Som de bala passando', duration: 0.15 },
      { id: 'gunshot-pistol', name: 'Tiro Pistola', desc: 'Som de pistola', duration: 0.3 },
      { id: 'gunshot-rifle', name: 'Tiro Rifle', desc: 'Som de rifle/metralhadora', duration: 0.4 },
      { id: 'chase-music', name: 'Música Perseguição', desc: 'Fundo dinâmico de ação', duration: 1.5 },
    ]
  },

  // NOTIFICAÇÃO/UI
  notification: {
    name: '🔔 Notificação',
    icon: '📲',
    desc: 'Alertas, confirmações, interface',
    effects: [
      { id: 'notification-ping', name: 'Notificação Ping', desc: 'Som suave de notificação', duration: 0.15 },
      { id: 'success-chime', name: 'Sucesso Chime', desc: 'Confirmação de sucesso', duration: 0.4 },
      { id: 'alert-warn', name: 'Alerta Aviso', desc: 'Som de aviso/alerta', duration: 0.25 },
      { id: 'error-beep', name: 'Erro Beep', desc: 'Som de erro (3x)', duration: 0.3 },
      { id: 'message-pop', name: 'Mensagem Pop', desc: 'Pop de nova mensagem', duration: 0.2 },
      { id: 'level-up', name: 'Level Up', desc: 'Efeito de nível alcançado', duration: 0.5 },
    ]
  },

  // ESPECIAL/GLITCH
  special: {
    name: '✨ Especial',
    icon: '🌟',
    desc: 'Efeitos únicos e criativos',
    effects: [
      { id: 'magic-spell', name: 'Magia Feitiço', desc: 'Som mágico/encantamento', duration: 0.4 },
      { id: 'portal-open', name: 'Portal Abre', desc: 'Abertura de portal', duration: 0.6 },
      { id: 'portal-close', name: 'Portal Fecha', desc: 'Fechamento de portal', duration: 0.5 },
      { id: 'crystalline', name: 'Cristal Toque', desc: 'Som cristalino/brilhante', duration: 0.5 },
      { id: 'shimmer', name: 'Shimmer Brilho', desc: 'Efeito de brilho/magia', duration: 0.4 },
      { id: 'whomp-bounce', name: 'Whomp Bounce', desc: 'Pulo de bola/bouncing', duration: 0.3 },
    ]
  }
};

// Renderizar biblioteca na UI
function initSoundLibrary() {
  const container = document.getElementById('soundLibraryContainer');
  if (!container) return; // Seção não existe ainda
  
  // Header
  let html = '<div class="library-header"><h3>🎵 Sound Library</h3><p>Selecione efeitos pra suas legendas</p></div>';
  html += '<div class="library-tabs" id="soundTabs">';
  
  // Tabs de categorias
  Object.entries(SOUND_LIBRARY).forEach(([key, cat]) => {
    html += `<button class="library-tab ${key === 'transitions' ? 'active' : ''}" data-category="${key}">${cat.icon} ${cat.name}</button>`;
  });
  
  html += '</div>';
  html += '<div class="library-effects" id="soundEffects"></div>';
  
  container.innerHTML = html;
  
  // Event listeners nas tabs
  document.querySelectorAll('.library-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.library-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderEffects(tab.dataset.category);
    });
  });
  
  // Renderizar primeira categoria
  renderEffects('transitions');
}

function renderEffects(categoryKey) {
  const container = document.getElementById('soundEffects');
  const category = SOUND_LIBRARY[categoryKey];
  
  let html = `<div class="library-category-info"><strong>${category.name}</strong>: ${category.desc}</div>`;
  html += '<div class="library-effects-grid">';
  
  category.effects.forEach(effect => {
    html += `
      <div class="library-effect-card">
        <button class="effect-btn" data-effect-id="${effect.id}" onclick="selectSoundEffect('${effect.id}', '${effect.name}')">
          <div class="effect-name">${effect.name}</div>
          <div class="effect-desc">${effect.desc}</div>
          <div class="effect-duration">${effect.duration}s</div>
        </button>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

// Selecionar efeito
window.selectSoundEffect = function(effectId, effectName) {
  state.soundEffect = effectId;
  state.soundEffectName = effectName;
  
  // Atualizar seletor principal
  const selector = document.getElementById('soundEffect');
  if (selector) {
    selector.value = effectId;
  }
  
  // Feedback visual
  document.querySelectorAll('.effect-btn').forEach(btn => btn.classList.remove('selected'));
  document.querySelector(`[data-effect-id="${effectId}"]`).classList.add('selected');
  
  setStatus(`✓ Efeito "${effectName}" selecionado`);
  saveToLocalStorage();
  
  // Tocar preview
  if (typeof playComboSound === 'function') {
    playComboSound(effectId, state.model.lines.length);
  }
};

// CSS para Sound Library
const SOUND_LIBRARY_CSS = `
.library-header { padding: 12px; border-bottom: 1px solid #2e2e35; }
.library-header h3 { margin: 0 0 4px; font-size: 14px; }
.library-header p { margin: 0; font-size: 11px; color: #9a9aa3; }

.library-tabs { display: flex; gap: 6px; padding: 12px; overflow-x: auto; border-bottom: 1px solid #2e2e35; }
.library-tab { 
  background: transparent; border: 1px solid #2e2e35; color: #9a9aa3; 
  padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;
  white-space: nowrap; transition: all .2s;
}
.library-tab:hover { border-color: #00d9ff; color: #00d9ff; }
.library-tab.active { background: #00d9ff; color: #08090c; border-color: #00d9ff; }

.library-category-info { 
  padding: 12px; font-size: 12px; color: #8a93a0; 
  background: #16181d; border-bottom: 1px solid #2e2e35; margin-bottom: 8px;
}

.library-effects-grid { 
  display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); 
  gap: 8px; padding: 12px;
}

.library-effect-card { }
.effect-btn {
  background: #16181d; border: 1px solid #2e2e35; border-radius: 8px; padding: 10px;
  color: #eef1f4; cursor: pointer; transition: all .15s; text-align: left; font-family: inherit;
}
.effect-btn:hover { 
  border-color: #00d9ff; background: #1c1f26;
}
.effect-btn.selected { 
  border-color: #00ffa3; background: rgba(0,255,163,.1);
}

.effect-name { font-size: 12px; font-weight: 700; margin-bottom: 3px; }
.effect-desc { font-size: 10px; color: #9a9aa3; margin-bottom: 4px; }
.effect-duration { font-size: 9px; color: #6f6f78; }

@media (max-width: 700px) {
  .library-effects-grid { grid-template-columns: repeat(2, 1fr); }
}
`;

// Exportar pra uso em app.html
window.SOUND_LIBRARY = SOUND_LIBRARY;
window.initSoundLibrary = initSoundLibrary;
window.SOUND_LIBRARY_CSS = SOUND_LIBRARY_CSS;
