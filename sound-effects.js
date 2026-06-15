// LegendaPro: Sound Effects Library
// Sons procedurais gerados com Web Audio API
// Cada som combina com um estilo de animação de legenda

const SOUND_EFFECTS = {
  fade: {
    name: 'Suave',
    desc: 'Efeito de fade in delicado',
    generate: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      osc.connect(gain);
      return [osc, gain];
    },
    duration: 0.4
  },
  pop: {
    name: 'Impacto',
    desc: 'Som de impacto rápido e seco',
    generate: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      return [osc, gain];
    },
    duration: 0.08
  },
  slide: {
    name: 'Desliza',
    desc: 'Som de movimento ascendente',
    generate: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(500, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      osc.connect(gain);
      return [osc, gain];
    },
    duration: 0.3
  },
  typewriter: {
    name: 'Máquina',
    desc: 'Efeito de máquina de escrever',
    generate: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 2000;
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
      osc.connect(filter);
      return [osc, gain, filter];
    },
    duration: 0.05
  },
  none: {
    name: 'Silêncio',
    desc: 'Sem efeito sonoro',
    generate: () => null,
    duration: 0
  }
};

function playSound(effectName) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const effect = SOUND_EFFECTS[effectName];
    if (!effect || !effect.generate) return;
    
    const nodes = effect.generate(ctx);
    if (!nodes) return;
    
    const [osc, gain, ...rest] = nodes;
    const finalGain = ctx.createGain();
    finalGain.gain.value = 0.3; // volume master
    
    if (rest.length > 0) {
      rest[rest.length - 1].connect(finalGain);
    } else {
      gain.connect(finalGain);
    }
    
    finalGain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + effect.duration);
  } catch (e) {
    console.log('Audio not available:', e.message);
  }
}

function playComboSound(animationType, lineCount) {
  // Play main effect
  playSound(animationType);
  
  // Play line-by-line effects (staggered)
  if (lineCount > 1) {
    const stag = 0.18; // same as animation stagger
    for (let i = 1; i < lineCount; i++) {
      const delay = i * stag * 1000 * (1400 / 1000); // convert to ms
      setTimeout(() => playSound(animationType), delay);
    }
  }
}
