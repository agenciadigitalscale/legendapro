// LegendaPro — Sintetizador completo de SFX
// 80+ sons gerados 100% no navegador (Web Audio API)
// Exporta WAV 44.1kHz — compatível com CapCut, Premiere Pro, DaVinci Resolve

// ─── WAV ENCODER ─────────────────────────────────────────────────────────────
function _wavEncode(buffer) {
  const ch = buffer.numberOfChannels, sr = buffer.sampleRate, len = buffer.length;
  const dataLen = len * ch * 2;
  const ab = new ArrayBuffer(44 + dataLen);
  const v = new DataView(ab);
  const str = (off, s) => { for (let i = 0; i < s.length; i++) v.setUint8(off + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); v.setUint32(4, 36 + dataLen, true);
  str(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true);
  v.setUint16(22, ch, true); v.setUint32(24, sr, true);
  v.setUint32(28, sr * ch * 2, true); v.setUint16(32, ch * 2, true); v.setUint16(34, 16, true);
  str(36, 'data'); v.setUint32(40, dataLen, true);
  let off = 44;
  for (let i = 0; i < len; i++) for (let c = 0; c < ch; c++) {
    const s = Math.max(-1, Math.min(1, buffer.getChannelData(c)[i]));
    v.setInt16(off, s < 0 ? s * 32768 : s * 32767, true); off += 2;
  }
  return ab;
}
function _dlBlob(blob, name) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = name; a.click(); URL.revokeObjectURL(a.href);
}

// ─── AUDIO HELPERS ───────────────────────────────────────────────────────────
function _noise(ctx, dur) {
  const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf; return src;
}
function _osc(ctx, type, freq) {
  const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq; return o;
}
function _env(ctx, t, atk, hold, rel, vol = 0.5) {
  const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + atk);
  if (hold > 0) g.gain.setValueAtTime(vol, t + atk + hold);
  g.gain.exponentialRampToValueAtTime(0.0001, t + atk + hold + rel);
  return g;
}
function _filt(ctx, type, freq, Q = 1) {
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = Q; return f;
}
function _chain(...nodes) {
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].connect(nodes[i + 1]);
  return nodes[nodes.length - 1];
}

// ─── SFX GENERATORS ──────────────────────────────────────────────────────────
// Assinatura: (ctx, t=0) → AudioNode de saída (já conectado internamente)
// Chamar .start(t) nos sources é feito pelo playback engine

const SFX_GEN = {

  // ── TRANSIÇÕES ──
  'whoosh-forward': (ctx, t = 0) => {
    const src = _noise(ctx, 0.5); const f = _filt(ctx, 'bandpass', 250, 0.6);
    f.frequency.exponentialRampToValueAtTime(4000, t + 0.35);
    const g = _env(ctx, t, 0.02, 0, 0.4, 0.5);
    _chain(src, f, g); src.start(t); src.stop(t + 0.5); return g;
  },
  'whoosh-reverse': (ctx, t = 0) => {
    const src = _noise(ctx, 0.5); const f = _filt(ctx, 'bandpass', 4000, 0.6);
    f.frequency.exponentialRampToValueAtTime(150, t + 0.4);
    const g = _env(ctx, t, 0.01, 0, 0.45, 0.5);
    _chain(src, f, g); src.start(t); src.stop(t + 0.5); return g;
  },
  'sweep-up': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 120); o.frequency.exponentialRampToValueAtTime(800, t + 0.45);
    const g = _env(ctx, t, 0.03, 0, 0.35, 0.35);
    _chain(o, g); o.start(t); o.stop(t + 0.5); return g;
  },
  'sweep-down': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 800); o.frequency.exponentialRampToValueAtTime(100, t + 0.45);
    const g = _env(ctx, t, 0.01, 0, 0.4, 0.35);
    _chain(o, g); o.start(t); o.stop(t + 0.5); return g;
  },
  'digital-swipe': (ctx, t = 0) => {
    const o = _osc(ctx, 'square', 1200); o.frequency.exponentialRampToValueAtTime(3000, t + 0.15);
    const f = _filt(ctx, 'highpass', 800, 1);
    const g = _env(ctx, t, 0.005, 0, 0.15, 0.25);
    _chain(o, f, g); o.start(t); o.stop(t + 0.2); return g;
  },
  'transition-pop': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 500); o.frequency.exponentialRampToValueAtTime(80, t + 0.08);
    const g = _env(ctx, t, 0.002, 0, 0.08, 0.4);
    _chain(o, g); o.start(t); o.stop(t + 0.12); return g;
  },
  'reverse-cymbal': (ctx, t = 0) => {
    const src = _noise(ctx, 0.7); const f = _filt(ctx, 'highpass', 6000, 0.5);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5, t + 0.55); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.65);
    _chain(src, f, g); src.start(t); src.stop(t + 0.7); return g;
  },
  'scratch-vinyl': (ctx, t = 0) => {
    const src = _noise(ctx, 0.35); const f = _filt(ctx, 'bandpass', 2000, 3);
    f.frequency.exponentialRampToValueAtTime(400, t + 0.15); f.frequency.exponentialRampToValueAtTime(1800, t + 0.3);
    const g = _env(ctx, t, 0.01, 0, 0.28, 0.45);
    _chain(src, f, g); src.start(t); src.stop(t + 0.35); return g;
  },

  // ── IMPACTOS ──
  'kick-bass': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 200); o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
    const gSub = _env(ctx, t, 0.001, 0, 0.25, 0.5);
    const src = _noise(ctx, 0.05); const f = _filt(ctx, 'lowpass', 200, 1);
    const gN = _env(ctx, t, 0.001, 0, 0.04, 0.35);
    const out = ctx.createGain(); out.gain.value = 1;
    _chain(o, gSub, out); _chain(src, f, gN, out);
    o.start(t); o.stop(t + 0.3); src.start(t); src.stop(t + 0.05); return out;
  },
  'punch-hard': (ctx, t = 0) => {
    const src = _noise(ctx, 0.18); const f = _filt(ctx, 'lowpass', 600, 1.5);
    const o = _osc(ctx, 'sine', 120); o.frequency.exponentialRampToValueAtTime(50, t + 0.08);
    const gN = _env(ctx, t, 0.001, 0, 0.14, 0.45); const gO = _env(ctx, t, 0.001, 0, 0.1, 0.4);
    const out = ctx.createGain();
    _chain(src, f, gN, out); _chain(o, gO, out);
    src.start(t); src.stop(t + 0.18); o.start(t); o.stop(t + 0.15); return out;
  },
  'punch-soft': (ctx, t = 0) => {
    const src = _noise(ctx, 0.2); const f = _filt(ctx, 'lowpass', 400, 1);
    const g = _env(ctx, t, 0.005, 0, 0.18, 0.3);
    _chain(src, f, g); src.start(t); src.stop(t + 0.2); return g;
  },
  'clap-loud': (ctx, t = 0) => {
    const src = _noise(ctx, 0.22); const f = _filt(ctx, 'highpass', 1000, 0.8);
    const g = _env(ctx, t, 0.001, 0, 0.2, 0.5);
    _chain(src, f, g); src.start(t); src.stop(t + 0.22); return g;
  },
  'clap-soft': (ctx, t = 0) => {
    const src = _noise(ctx, 0.18); const f = _filt(ctx, 'bandpass', 1200, 0.7);
    const g = _env(ctx, t, 0.002, 0, 0.16, 0.25);
    _chain(src, f, g); src.start(t); src.stop(t + 0.18); return g;
  },
  'snap-fingers': (ctx, t = 0) => {
    const src = _noise(ctx, 0.06); const f = _filt(ctx, 'highpass', 2000, 1.5);
    const g = _env(ctx, t, 0.001, 0, 0.055, 0.45);
    _chain(src, f, g); src.start(t); src.stop(t + 0.06); return g;
  },
  'stomp-floor': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 80); o.frequency.exponentialRampToValueAtTime(35, t + 0.15);
    const src = _noise(ctx, 0.1); const f = _filt(ctx, 'lowpass', 300, 1);
    const gO = _env(ctx, t, 0.001, 0, 0.22, 0.55); const gN = _env(ctx, t, 0.001, 0, 0.08, 0.35);
    const out = ctx.createGain();
    _chain(o, gO, out); _chain(src, f, gN, out);
    o.start(t); o.stop(t + 0.25); src.start(t); src.stop(t + 0.1); return out;
  },
  'thump-deep': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 60); o.frequency.exponentialRampToValueAtTime(28, t + 0.2);
    const g = _env(ctx, t, 0.001, 0, 0.28, 0.5);
    _chain(o, g); o.start(t); o.stop(t + 0.3); return g;
  },
  'hit-metal': (ctx, t = 0) => {
    const freqs = [440, 660, 880, 1100];
    const out = ctx.createGain(); out.gain.value = 0.25;
    freqs.forEach((f, i) => {
      const o = _osc(ctx, 'sine', f + i * 30);
      const g = _env(ctx, t, 0.001, 0, 0.4 - i * 0.05, 0.5 / (i + 1));
      _chain(o, g, out); o.start(t); o.stop(t + 0.5);
    });
    return out;
  },
  'hit-wood': (ctx, t = 0) => {
    const src = _noise(ctx, 0.12); const f = _filt(ctx, 'bandpass', 800, 4);
    const o = _osc(ctx, 'sine', 250); o.frequency.exponentialRampToValueAtTime(150, t + 0.06);
    const gN = _env(ctx, t, 0.001, 0, 0.1, 0.35); const gO = _env(ctx, t, 0.001, 0, 0.1, 0.45);
    const out = ctx.createGain();
    _chain(src, f, gN, out); _chain(o, gO, out);
    src.start(t); src.stop(t + 0.12); o.start(t); o.stop(t + 0.12); return out;
  },

  // ── EXPLOSÕES ──
  'explosion-small': (ctx, t = 0) => {
    const src = _noise(ctx, 0.8); const f = _filt(ctx, 'lowpass', 1200, 0.7);
    f.frequency.exponentialRampToValueAtTime(200, t + 0.6);
    const g = _env(ctx, t, 0.001, 0.05, 0.7, 0.6);
    _chain(src, f, g); src.start(t); src.stop(t + 0.8); return g;
  },
  'explosion-medium': (ctx, t = 0) => {
    const src = _noise(ctx, 1.2); const f = _filt(ctx, 'lowpass', 1800, 0.5);
    f.frequency.exponentialRampToValueAtTime(80, t + 0.9);
    const o = _osc(ctx, 'sine', 55); o.frequency.exponentialRampToValueAtTime(30, t + 0.5);
    const gN = _env(ctx, t, 0.001, 0.08, 1.0, 0.65); const gO = _env(ctx, t, 0.001, 0, 0.8, 0.5);
    const out = ctx.createGain();
    _chain(src, f, gN, out); _chain(o, gO, out);
    src.start(t); src.stop(t + 1.2); o.start(t); o.stop(t + 1.0); return out;
  },
  'explosion-massive': (ctx, t = 0) => {
    const src = _noise(ctx, 2.0); const f = _filt(ctx, 'lowpass', 2500, 0.4);
    f.frequency.exponentialRampToValueAtTime(50, t + 1.5);
    const o = _osc(ctx, 'sine', 40); o.frequency.exponentialRampToValueAtTime(20, t + 0.8);
    const gN = _env(ctx, t, 0.001, 0.1, 1.8, 0.7); const gO = _env(ctx, t, 0.001, 0.1, 1.5, 0.6);
    const out = ctx.createGain();
    _chain(src, f, gN, out); _chain(o, gO, out);
    src.start(t); src.stop(t + 2.0); o.start(t); o.stop(t + 2.0); return out;
  },
  'blast-wave': (ctx, t = 0) => {
    const src = _noise(ctx, 0.7); const f = _filt(ctx, 'lowpass', 3000, 0.5);
    f.frequency.exponentialRampToValueAtTime(60, t + 0.5);
    const o = _osc(ctx, 'sine', 70); o.frequency.exponentialRampToValueAtTime(25, t + 0.4);
    const gN = _env(ctx, t, 0.001, 0, 0.65, 0.55); const gO = _env(ctx, t, 0.001, 0, 0.6, 0.5);
    const out = ctx.createGain();
    _chain(src, f, gN, out); _chain(o, gO, out);
    src.start(t); src.stop(t + 0.7); o.start(t); o.stop(t + 0.7); return out;
  },
  'firecracker': (ctx, t = 0) => {
    const src = _noise(ctx, 0.1); const f = _filt(ctx, 'highpass', 3000, 1);
    const g = _env(ctx, t, 0.001, 0, 0.09, 0.55);
    _chain(src, f, g); src.start(t); src.stop(t + 0.1); return g;
  },
  'thunder-strike': (ctx, t = 0) => {
    const src = _noise(ctx, 1.8); const f = _filt(ctx, 'lowpass', 800, 0.6);
    f.frequency.exponentialRampToValueAtTime(100, t + 1.5);
    const o = _osc(ctx, 'sine', 45); o.frequency.exponentialRampToValueAtTime(18, t + 1.0);
    const gN = _env(ctx, t, 0.003, 0.05, 1.7, 0.6); const gO = _env(ctx, t, 0.002, 0.05, 1.5, 0.45);
    const out = ctx.createGain();
    _chain(src, f, gN, out); _chain(o, gO, out);
    src.start(t); src.stop(t + 1.8); o.start(t); o.stop(t + 1.8); return out;
  },

  // ── ELETRÔNICO ──
  'beep-low': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 440); const g = _env(ctx, t, 0.005, 0.08, 0.05, 0.3);
    _chain(o, g); o.start(t); o.stop(t + 0.15); return g;
  },
  'beep-high': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 1200); const g = _env(ctx, t, 0.003, 0.05, 0.04, 0.25);
    _chain(o, g); o.start(t); o.stop(t + 0.1); return g;
  },
  'beep-sequence': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 1;
    [0, 0.12, 0.24].forEach(delay => {
      const o = _osc(ctx, 'sine', 880); const g = _env(ctx, t + delay, 0.003, 0.05, 0.04, 0.25);
      _chain(o, g, out); o.start(t + delay); o.stop(t + delay + 0.1);
    });
    return out;
  },
  'glitch-digital': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.8;
    const src = _noise(ctx, 0.18); const f = _filt(ctx, 'highpass', 3000, 2);
    const g = _env(ctx, t, 0.001, 0, 0.16, 0.4); _chain(src, f, g, out);
    src.start(t); src.stop(t + 0.18);
    [0, 0.06, 0.11].forEach(d => {
      const o = _osc(ctx, 'square', 200 + Math.random() * 2000);
      const og = _env(ctx, t + d, 0.001, 0, 0.04, 0.3); _chain(o, og, out);
      o.start(t + d); o.stop(t + d + 0.05);
    });
    return out;
  },
  'glitch-heavy': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.7;
    const src = _noise(ctx, 0.3); const f = _filt(ctx, 'bandpass', 2000, 1.5);
    const g = _env(ctx, t, 0.001, 0.05, 0.22, 0.5); _chain(src, f, g, out);
    src.start(t); src.stop(t + 0.3);
    [0, 0.08, 0.15, 0.22].forEach(d => {
      const o = _osc(ctx, 'sawtooth', 100 + Math.random() * 3000);
      const og = _env(ctx, t + d, 0.001, 0, 0.06, 0.35); _chain(o, og, out);
      o.start(t + d); o.stop(t + d + 0.07);
    });
    return out;
  },
  'laser-zap': (ctx, t = 0) => {
    const o = _osc(ctx, 'sawtooth', 3000); o.frequency.exponentialRampToValueAtTime(200, t + 0.3);
    const f = _filt(ctx, 'highpass', 400, 1.5);
    const g = _env(ctx, t, 0.001, 0, 0.28, 0.35);
    _chain(o, f, g); o.start(t); o.stop(t + 0.32); return g;
  },
  'laser-rise': (ctx, t = 0) => {
    const o = _osc(ctx, 'sawtooth', 200); o.frequency.exponentialRampToValueAtTime(4000, t + 0.3);
    const f = _filt(ctx, 'highpass', 200, 1);
    const g = _env(ctx, t, 0.005, 0, 0.28, 0.35);
    _chain(o, f, g); o.start(t); o.stop(t + 0.35); return g;
  },
  'radar-ping': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 1200); const g = _env(ctx, t, 0.002, 0.02, 0.22, 0.3);
    _chain(o, g); o.start(t); o.stop(t + 0.28); return g;
  },
  'power-up': (ctx, t = 0) => {
    const o = _osc(ctx, 'sawtooth', 100); o.frequency.exponentialRampToValueAtTime(1200, t + 0.45);
    const f = _filt(ctx, 'lowpass', 1500, 0.8);
    const g = _env(ctx, t, 0.01, 0, 0.4, 0.35);
    _chain(o, f, g); o.start(t); o.stop(t + 0.5); return g;
  },
  'power-down': (ctx, t = 0) => {
    const o = _osc(ctx, 'sawtooth', 1200); o.frequency.exponentialRampToValueAtTime(60, t + 0.45);
    const f = _filt(ctx, 'lowpass', 1000, 0.8);
    const g = _env(ctx, t, 0.005, 0, 0.44, 0.35);
    _chain(o, f, g); o.start(t); o.stop(t + 0.5); return g;
  },
  'error-buzz': (ctx, t = 0) => {
    const o = _osc(ctx, 'square', 180); const g = _env(ctx, t, 0.003, 0.12, 0.05, 0.3);
    _chain(o, g); o.start(t); o.stop(t + 0.18); return g;
  },
  'synth-whoosh': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 80); o.frequency.exponentialRampToValueAtTime(2400, t + 0.4);
    const o2 = _osc(ctx, 'triangle', 160); o2.frequency.exponentialRampToValueAtTime(4800, t + 0.4);
    const g = _env(ctx, t, 0.02, 0, 0.38, 0.3); const g2 = _env(ctx, t, 0.02, 0, 0.38, 0.15);
    const out = ctx.createGain();
    _chain(o, g, out); _chain(o2, g2, out);
    o.start(t); o.stop(t + 0.45); o2.start(t); o2.stop(t + 0.45); return out;
  },
  'electric-spark': (ctx, t = 0) => {
    const src = _noise(ctx, 0.08); const f = _filt(ctx, 'highpass', 5000, 2);
    const g = _env(ctx, t, 0.001, 0, 0.07, 0.5);
    _chain(src, f, g); src.start(t); src.stop(t + 0.08); return g;
  },
  'sci-fi-scan': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 600); o.frequency.setValueAtTime(600, t);
    o.frequency.linearRampToValueAtTime(800, t + 0.25); o.frequency.linearRampToValueAtTime(600, t + 0.5);
    const g = _env(ctx, t, 0.02, 0.4, 0.06, 0.2);
    _chain(o, g); o.start(t); o.stop(t + 0.55); return g;
  },

  // ── NOTIFICAÇÕES / UI ──
  'notification-ping': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 880); const g = _env(ctx, t, 0.003, 0, 0.2, 0.25);
    const f = _filt(ctx, 'lowpass', 2000, 0.8);
    _chain(o, f, g); o.start(t); o.stop(t + 0.25); return g;
  },
  'success-chime': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.7;
    [[523, 0], [659, 0.12], [784, 0.24]].forEach(([freq, delay]) => {
      const o = _osc(ctx, 'sine', freq); const g = _env(ctx, t + delay, 0.003, 0, 0.28, 0.3);
      _chain(o, g, out); o.start(t + delay); o.stop(t + delay + 0.35);
    });
    return out;
  },
  'alert-warn': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.7;
    [[660, 0], [440, 0.15]].forEach(([freq, delay]) => {
      const o = _osc(ctx, 'triangle', freq); const g = _env(ctx, t + delay, 0.005, 0.05, 0.1, 0.35);
      _chain(o, g, out); o.start(t + delay); o.stop(t + delay + 0.18);
    });
    return out;
  },
  'error-beep': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.7;
    [0, 0.1, 0.2].forEach(delay => {
      const o = _osc(ctx, 'square', 220); const g = _env(ctx, t + delay, 0.003, 0.05, 0.03, 0.25);
      _chain(o, g, out); o.start(t + delay); o.stop(t + delay + 0.09);
    });
    return out;
  },
  'message-pop': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 700); o.frequency.exponentialRampToValueAtTime(900, t + 0.06);
    const g = _env(ctx, t, 0.002, 0, 0.1, 0.25);
    _chain(o, g); o.start(t); o.stop(t + 0.12); return g;
  },
  'level-up': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.6;
    [[392, 0], [523, 0.08], [659, 0.16], [784, 0.24], [1047, 0.35]].forEach(([freq, delay]) => {
      const o = _osc(ctx, 'triangle', freq); const g = _env(ctx, t + delay, 0.003, 0, 0.2, 0.3);
      _chain(o, g, out); o.start(t + delay); o.stop(t + delay + 0.25);
    });
    return out;
  },
  'coin-collect': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.6;
    [[1200, 0], [1600, 0.06]].forEach(([freq, delay]) => {
      const o = _osc(ctx, 'sine', freq); const g = _env(ctx, t + delay, 0.002, 0, 0.18, 0.35);
      _chain(o, g, out); o.start(t + delay); o.stop(t + delay + 0.22);
    });
    return out;
  },
  'ui-click': (ctx, t = 0) => {
    const src = _noise(ctx, 0.04); const f = _filt(ctx, 'highpass', 4000, 2);
    const g = _env(ctx, t, 0.001, 0, 0.035, 0.4);
    _chain(src, f, g); src.start(t); src.stop(t + 0.04); return g;
  },
  'countdown-tick': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 800); const g = _env(ctx, t, 0.001, 0.02, 0.06, 0.35);
    _chain(o, g); o.start(t); o.stop(t + 0.1); return g;
  },
  'victory': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.55;
    [[523, 0], [659, 0.1], [784, 0.2], [1047, 0.32], [784, 0.44], [1047, 0.56]].forEach(([freq, delay]) => {
      const o = _osc(ctx, 'triangle', freq); const g = _env(ctx, t + delay, 0.005, 0, 0.22, 0.3);
      _chain(o, g, out); o.start(t + delay); o.stop(t + delay + 0.28);
    });
    return out;
  },

  // ── CÔMICO / CARTOON ──
  'boing-spring': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 100); o.frequency.exponentialRampToValueAtTime(600, t + 0.15);
    o.frequency.exponentialRampToValueAtTime(200, t + 0.28); o.frequency.exponentialRampToValueAtTime(400, t + 0.38);
    const g = _env(ctx, t, 0.005, 0, 0.35, 0.35);
    _chain(o, g); o.start(t); o.stop(t + 0.42); return g;
  },
  'squeak-toy': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 400); o.frequency.exponentialRampToValueAtTime(1200, t + 0.06);
    o.frequency.exponentialRampToValueAtTime(500, t + 0.12);
    const g = _env(ctx, t, 0.003, 0, 0.11, 0.3);
    _chain(o, g); o.start(t); o.stop(t + 0.14); return g;
  },
  'wah-wah-sad': (ctx, t = 0) => {
    const o = _osc(ctx, 'sawtooth', 220);
    const f = _filt(ctx, 'lowpass', 1200, 5);
    f.frequency.exponentialRampToValueAtTime(200, t + 0.4); f.frequency.exponentialRampToValueAtTime(80, t + 0.7);
    const g = _env(ctx, t, 0.02, 0.1, 0.5, 0.3);
    _chain(o, f, g); o.start(t); o.stop(t + 0.75); return g;
  },
  'horn-honk': (ctx, t = 0) => {
    const o = _osc(ctx, 'sawtooth', 330); const f = _filt(ctx, 'lowpass', 2000, 2);
    const g = _env(ctx, t, 0.01, 0.18, 0.05, 0.35);
    _chain(o, f, g); o.start(t); o.stop(t + 0.25); return g;
  },
  'slide-whistle-up': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 300); o.frequency.exponentialRampToValueAtTime(1800, t + 0.4);
    const g = _env(ctx, t, 0.01, 0, 0.36, 0.25);
    _chain(o, g); o.start(t); o.stop(t + 0.42); return g;
  },
  'slide-whistle-down': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 1800); o.frequency.exponentialRampToValueAtTime(200, t + 0.4);
    const g = _env(ctx, t, 0.005, 0, 0.38, 0.25);
    _chain(o, g); o.start(t); o.stop(t + 0.42); return g;
  },
  'comedy-rimshot': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.8;
    const src = _noise(ctx, 0.15); const f = _filt(ctx, 'highpass', 2000, 1);
    const gN = _env(ctx, t, 0.001, 0, 0.12, 0.4); _chain(src, f, gN, out);
    src.start(t); src.stop(t + 0.15);
    const o = _osc(ctx, 'sine', 220); const gO = _env(ctx, t, 0.001, 0, 0.2, 0.5);
    _chain(o, gO, out); o.start(t); o.stop(t + 0.25);
    return out;
  },
  'cartoon-pop': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 300); o.frequency.exponentialRampToValueAtTime(1000, t + 0.04);
    o.frequency.exponentialRampToValueAtTime(400, t + 0.08);
    const g = _env(ctx, t, 0.001, 0, 0.1, 0.3);
    _chain(o, g); o.start(t); o.stop(t + 0.12); return g;
  },

  // ── HORROR / SUSPENSE ──
  'scare-sting': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.5;
    [440, 466, 494].forEach((freq, i) => {
      const o = _osc(ctx, 'sawtooth', freq + i * 5);
      const g = _env(ctx, t, 0.002, 0.1, 0.18, 0.4);
      _chain(o, g, out); o.start(t); o.stop(t + 0.32);
    });
    return out;
  },
  'ambient-dark': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.5;
    [55, 73.4, 82.4].forEach(freq => {
      const o = _osc(ctx, 'sine', freq); const g = _env(ctx, t, 0.3, 1.2, 0.5, 0.3);
      _chain(o, g, out); o.start(t); o.stop(t + 2.2);
    });
    return out;
  },
  'ghost-whoosh': (ctx, t = 0) => {
    const src = _noise(ctx, 0.6); const f = _filt(ctx, 'bandpass', 800, 0.4);
    f.frequency.exponentialRampToValueAtTime(3000, t + 0.3); f.frequency.exponentialRampToValueAtTime(400, t + 0.55);
    const g = _env(ctx, t, 0.05, 0, 0.5, 0.25);
    _chain(src, f, g); src.start(t); src.stop(t + 0.6); return g;
  },
  'heartbeat-fast': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 1;
    [[0, 0.12, 0.06], [0.2, 0.12, 0.06], [0.4, 0.12, 0.06]].forEach(([start, vol, dur]) => {
      const o = _osc(ctx, 'sine', 80); o.frequency.exponentialRampToValueAtTime(40, t + start + dur);
      const g = _env(ctx, t + start, 0.002, 0, dur, vol);
      _chain(o, g, out); o.start(t + start); o.stop(t + start + dur + 0.05);
    });
    return out;
  },
  'ghost-wail': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 300);
    o.frequency.setValueAtTime(300, t); o.frequency.linearRampToValueAtTime(500, t + 0.4);
    o.frequency.linearRampToValueAtTime(250, t + 0.75);
    const g = _env(ctx, t, 0.08, 0.3, 0.35, 0.25);
    _chain(o, g); o.start(t); o.stop(t + 0.8); return g;
  },
  'eerie-tension': (ctx, t = 0) => {
    const src = _noise(ctx, 1.5); const f = _filt(ctx, 'lowpass', 300, 0.5);
    f.frequency.exponentialRampToValueAtTime(800, t + 1.3);
    const o = _osc(ctx, 'sine', 40); o.frequency.setValueAtTime(40, t);
    o.frequency.linearRampToValueAtTime(55, t + 1.5);
    const gN = _env(ctx, t, 0.2, 0.8, 0.45, 0.25); const gO = _env(ctx, t, 0.1, 1.0, 0.35, 0.3);
    const out = ctx.createGain();
    _chain(src, f, gN, out); _chain(o, gO, out);
    src.start(t); src.stop(t + 1.5); o.start(t); o.stop(t + 1.5); return out;
  },

  // ── AÇÃO ──
  'whoosh-fast': (ctx, t = 0) => {
    const src = _noise(ctx, 0.2); const f = _filt(ctx, 'bandpass', 1500, 1);
    f.frequency.exponentialRampToValueAtTime(5000, t + 0.12);
    const g = _env(ctx, t, 0.001, 0, 0.18, 0.5);
    _chain(src, f, g); src.start(t); src.stop(t + 0.2); return g;
  },
  'weapon-slash': (ctx, t = 0) => {
    const src = _noise(ctx, 0.28); const f = _filt(ctx, 'bandpass', 2000, 1.5);
    f.frequency.exponentialRampToValueAtTime(6000, t + 0.2);
    const g = _env(ctx, t, 0.001, 0, 0.25, 0.5);
    _chain(src, f, g); src.start(t); src.stop(t + 0.28); return g;
  },
  'bullet-fly': (ctx, t = 0) => {
    const src = _noise(ctx, 0.15); const f = _filt(ctx, 'bandpass', 3000, 2);
    f.frequency.exponentialRampToValueAtTime(8000, t + 0.08); f.frequency.exponentialRampToValueAtTime(1000, t + 0.14);
    const g = _env(ctx, t, 0.001, 0, 0.13, 0.4);
    _chain(src, f, g); src.start(t); src.stop(t + 0.15); return g;
  },
  'tension-rise': (ctx, t = 0) => {
    const o = _osc(ctx, 'sawtooth', 55); o.frequency.exponentialRampToValueAtTime(110, t + 0.8);
    const f = _filt(ctx, 'lowpass', 500, 0.7); f.frequency.exponentialRampToValueAtTime(2000, t + 0.8);
    const g = _env(ctx, t, 0.05, 0.5, 0.25, 0.4);
    _chain(o, f, g); o.start(t); o.stop(t + 0.9); return g;
  },
  'impact-cinematic': (ctx, t = 0) => {
    const src = _noise(ctx, 0.8); const f = _filt(ctx, 'lowpass', 2000, 0.6);
    f.frequency.exponentialRampToValueAtTime(100, t + 0.6);
    const o = _osc(ctx, 'sine', 80); o.frequency.exponentialRampToValueAtTime(30, t + 0.4);
    const gN = _env(ctx, t, 0.001, 0.05, 0.7, 0.6); const gO = _env(ctx, t, 0.001, 0.05, 0.6, 0.55);
    const out = ctx.createGain();
    _chain(src, f, gN, out); _chain(o, gO, out);
    src.start(t); src.stop(t + 0.8); o.start(t); o.stop(t + 0.8); return out;
  },
  'riser-cinematic': (ctx, t = 0) => {
    const src = _noise(ctx, 1.5); const f = _filt(ctx, 'highpass', 200, 0.5);
    f.frequency.exponentialRampToValueAtTime(3000, t + 1.3);
    const o = _osc(ctx, 'sine', 60); o.frequency.exponentialRampToValueAtTime(200, t + 1.5);
    const gN = _env(ctx, t, 0.1, 0.9, 0.45, 0.4); const gO = _env(ctx, t, 0.2, 0.8, 0.45, 0.3);
    const out = ctx.createGain();
    _chain(src, f, gN, out); _chain(o, gO, out);
    src.start(t); src.stop(t + 1.5); o.start(t); o.stop(t + 1.5); return out;
  },
  'trailer-braam': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.7;
    [55, 73.4, 110].forEach(freq => {
      const o = _osc(ctx, 'sawtooth', freq); const f = _filt(ctx, 'lowpass', 400, 0.5);
      const g = _env(ctx, t, 0.02, 0.5, 0.8, 0.4);
      _chain(o, f, g, out); o.start(t); o.stop(t + 1.4);
    });
    return out;
  },

  // ── MUSICAL ──
  'bell-ding': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.6;
    [880, 1760, 2640].forEach((freq, i) => {
      const o = _osc(ctx, 'sine', freq); const g = _env(ctx, t, 0.002, 0, 0.8 - i * 0.2, 0.4 / (i + 1));
      _chain(o, g, out); o.start(t); o.stop(t + 1.0);
    });
    return out;
  },
  'piano-note': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.55;
    [523, 1046].forEach((freq, i) => {
      const o = _osc(ctx, 'sine', freq); const g = _env(ctx, t, 0.003, 0, 0.6 - i * 0.1, 0.35 / (i + 1));
      _chain(o, g, out); o.start(t); o.stop(t + 0.75);
    });
    return out;
  },
  'wind-chimes': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.45;
    const notes = [1047, 1175, 1319, 1568, 1760];
    notes.forEach((freq, i) => {
      const delay = i * 0.12 + Math.random() * 0.08;
      const o = _osc(ctx, 'sine', freq); const g = _env(ctx, t + delay, 0.002, 0, 0.55, 0.3);
      _chain(o, g, out); o.start(t + delay); o.stop(t + delay + 0.6);
    });
    return out;
  },
  'xylophone-hit': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.6;
    [1047, 2093].forEach((freq, i) => {
      const o = _osc(ctx, 'triangle', freq); const g = _env(ctx, t, 0.002, 0, 0.35 - i * 0.05, 0.4 / (i + 1));
      _chain(o, g, out); o.start(t); o.stop(t + 0.42);
    });
    return out;
  },
  'wrong-note': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.55;
    [220, 233, 246].forEach(freq => {
      const o = _osc(ctx, 'sawtooth', freq); const g = _env(ctx, t, 0.01, 0.1, 0.2, 0.25);
      _chain(o, g, out); o.start(t); o.stop(t + 0.35);
    });
    return out;
  },
  'magic-spell': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.5;
    const notes = [784, 988, 1175, 1568, 1976, 2349];
    notes.forEach((freq, i) => {
      const delay = i * 0.055;
      const o = _osc(ctx, 'sine', freq); const g = _env(ctx, t + delay, 0.003, 0, 0.25, 0.3);
      _chain(o, g, out); o.start(t + delay); o.stop(t + delay + 0.3);
    });
    const src = _noise(ctx, 0.5); const f = _filt(ctx, 'highpass', 6000, 0.5);
    const gN = _env(ctx, t, 0.05, 0.2, 0.2, 0.15); _chain(src, f, gN, out);
    src.start(t); src.stop(t + 0.5);
    return out;
  },
  'crystalline': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.5;
    [2093, 2637, 3136, 4186].forEach((freq, i) => {
      const delay = i * 0.04;
      const o = _osc(ctx, 'sine', freq); const g = _env(ctx, t + delay, 0.002, 0, 0.5, 0.3 / (i + 1));
      _chain(o, g, out); o.start(t + delay); o.stop(t + delay + 0.6);
    });
    return out;
  },
  'shimmer': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.4;
    for (let i = 0; i < 8; i++) {
      const freq = 1200 + i * 300 + Math.random() * 200;
      const delay = Math.random() * 0.3;
      const o = _osc(ctx, 'sine', freq); const g = _env(ctx, t + delay, 0.02, 0, 0.25, 0.2);
      _chain(o, g, out); o.start(t + delay); o.stop(t + delay + 0.3);
    }
    return out;
  },
  'portal-open': (ctx, t = 0) => {
    const src = _noise(ctx, 0.8); const f = _filt(ctx, 'bandpass', 200, 0.5);
    f.frequency.exponentialRampToValueAtTime(3000, t + 0.5); f.frequency.exponentialRampToValueAtTime(500, t + 0.75);
    const o = _osc(ctx, 'sine', 60); o.frequency.exponentialRampToValueAtTime(200, t + 0.4);
    const gN = _env(ctx, t, 0.05, 0.2, 0.5, 0.4); const gO = _env(ctx, t, 0.1, 0.1, 0.55, 0.35);
    const out = ctx.createGain();
    _chain(src, f, gN, out); _chain(o, gO, out);
    src.start(t); src.stop(t + 0.8); o.start(t); o.stop(t + 0.8); return out;
  },

  // ── FOLEY ──
  'footstep-hard': (ctx, t = 0) => {
    const src = _noise(ctx, 0.15); const f = _filt(ctx, 'bandpass', 500, 2);
    const o = _osc(ctx, 'sine', 100); o.frequency.exponentialRampToValueAtTime(60, t + 0.08);
    const gN = _env(ctx, t, 0.001, 0, 0.13, 0.35); const gO = _env(ctx, t, 0.001, 0, 0.12, 0.4);
    const out = ctx.createGain();
    _chain(src, f, gN, out); _chain(o, gO, out);
    src.start(t); src.stop(t + 0.15); o.start(t); o.stop(t + 0.12); return out;
  },
  'footstep-soft': (ctx, t = 0) => {
    const src = _noise(ctx, 0.12); const f = _filt(ctx, 'lowpass', 400, 1);
    const g = _env(ctx, t, 0.005, 0, 0.1, 0.2);
    _chain(src, f, g); src.start(t); src.stop(t + 0.12); return g;
  },
  'door-close': (ctx, t = 0) => {
    const src = _noise(ctx, 0.35); const f = _filt(ctx, 'lowpass', 800, 1);
    const o = _osc(ctx, 'sine', 120); o.frequency.exponentialRampToValueAtTime(50, t + 0.1);
    const gN = _env(ctx, t, 0.001, 0, 0.3, 0.4); const gO = _env(ctx, t, 0.001, 0, 0.15, 0.5);
    const out = ctx.createGain();
    _chain(src, f, gN, out); _chain(o, gO, out);
    src.start(t); src.stop(t + 0.35); o.start(t); o.stop(t + 0.18); return out;
  },
  'door-knock': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 1;
    [0, 0.14, 0.28].forEach(delay => {
      const src = _noise(ctx, 0.08); const f = _filt(ctx, 'bandpass', 600, 3);
      const g = _env(ctx, t + delay, 0.001, 0, 0.07, 0.45);
      _chain(src, f, g, out); src.start(t + delay); src.stop(t + delay + 0.08);
    });
    return out;
  },
  'typing-key': (ctx, t = 0) => {
    const src = _noise(ctx, 0.04); const f = _filt(ctx, 'highpass', 3000, 2);
    const g = _env(ctx, t, 0.001, 0, 0.035, 0.35);
    _chain(src, f, g); src.start(t); src.stop(t + 0.04); return g;
  },
  'glass-clink': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.55;
    [1800, 2400, 3200].forEach((freq, i) => {
      const o = _osc(ctx, 'sine', freq); const g = _env(ctx, t, 0.001, 0, 0.4 - i * 0.06, 0.3 / (i + 1));
      _chain(o, g, out); o.start(t); o.stop(t + 0.5);
    });
    return out;
  },
  'glass-break': (ctx, t = 0) => {
    const src = _noise(ctx, 0.5); const f = _filt(ctx, 'highpass', 2000, 0.8);
    const g = _env(ctx, t, 0.001, 0.02, 0.45, 0.55);
    _chain(src, f, g); src.start(t); src.stop(t + 0.5); return g;
  },
  'paper-rustle': (ctx, t = 0) => {
    const src = _noise(ctx, 0.45); const f = _filt(ctx, 'highpass', 2000, 0.5);
    const g = _env(ctx, t, 0.05, 0.2, 0.15, 0.18);
    _chain(src, f, g); src.start(t); src.stop(t + 0.45); return g;
  },
  'water-drip': (ctx, t = 0) => {
    const o = _osc(ctx, 'sine', 1800); o.frequency.exponentialRampToValueAtTime(600, t + 0.08);
    const g = _env(ctx, t, 0.002, 0, 0.12, 0.25);
    _chain(o, g); o.start(t); o.stop(t + 0.15); return g;
  },
  'water-splash': (ctx, t = 0) => {
    const src = _noise(ctx, 0.5); const f = _filt(ctx, 'bandpass', 600, 0.7);
    f.frequency.exponentialRampToValueAtTime(200, t + 0.4);
    const g = _env(ctx, t, 0.003, 0.05, 0.4, 0.45);
    _chain(src, f, g); src.start(t); src.stop(t + 0.5); return g;
  },
  'wind-breeze': (ctx, t = 0) => {
    const src = _noise(ctx, 1.5); const f = _filt(ctx, 'bandpass', 400, 0.4);
    f.frequency.setValueAtTime(300, t); f.frequency.linearRampToValueAtTime(600, t + 0.75);
    f.frequency.linearRampToValueAtTime(350, t + 1.5);
    const g = _env(ctx, t, 0.3, 0.7, 0.45, 0.18);
    _chain(src, f, g); src.start(t); src.stop(t + 1.5); return g;
  },
  'camera-shutter': (ctx, t = 0) => {
    const out = ctx.createGain(); out.gain.value = 0.7;
    [0, 0.05].forEach(delay => {
      const src = _noise(ctx, 0.04); const f = _filt(ctx, 'highpass', 4000, 2);
      const g = _env(ctx, t + delay, 0.001, 0, 0.035, 0.4);
      _chain(src, f, g, out); src.start(t + delay); src.stop(t + delay + 0.04);
    });
    return out;
  },

  // ── ANIMAÇÕES (compatibilidade com versão anterior) ──
  'fade': (ctx, t = 0) => SFX_GEN['sweep-up'](ctx, t),
  'pop': (ctx, t = 0) => SFX_GEN['transition-pop'](ctx, t),
  'slide': (ctx, t = 0) => SFX_GEN['whoosh-forward'](ctx, t),
  'typewriter': (ctx, t = 0) => SFX_GEN['typing-key'](ctx, t),
  'none': null,
};

// Durações em segundos (para OfflineAudioContext)
const SFX_DUR = {
  'whoosh-forward':0.55,'whoosh-reverse':0.55,'sweep-up':0.55,'sweep-down':0.55,
  'digital-swipe':0.22,'transition-pop':0.15,'reverse-cymbal':0.75,'scratch-vinyl':0.4,
  'kick-bass':0.35,'punch-hard':0.2,'punch-soft':0.25,'clap-loud':0.25,'clap-soft':0.22,
  'snap-fingers':0.1,'stomp-floor':0.3,'thump-deep':0.35,'hit-metal':0.6,'hit-wood':0.18,
  'explosion-small':0.9,'explosion-medium':1.3,'explosion-massive':2.1,'blast-wave':0.8,
  'firecracker':0.15,'thunder-strike':1.9,
  'beep-low':0.18,'beep-high':0.12,'beep-sequence':0.42,'glitch-digital':0.22,
  'glitch-heavy':0.38,'laser-zap':0.38,'laser-rise':0.4,'radar-ping':0.35,
  'power-up':0.55,'power-down':0.55,'error-buzz':0.22,'synth-whoosh':0.5,
  'electric-spark':0.1,'sci-fi-scan':0.6,
  'notification-ping':0.3,'success-chime':0.65,'alert-warn':0.4,'error-beep':0.35,
  'message-pop':0.16,'level-up':0.7,'coin-collect':0.32,'ui-click':0.06,
  'countdown-tick':0.12,'victory':0.9,
  'boing-spring':0.5,'squeak-toy':0.18,'wah-wah-sad':0.82,'horn-honk':0.3,
  'slide-whistle-up':0.5,'slide-whistle-down':0.5,'comedy-rimshot':0.35,'cartoon-pop':0.16,
  'scare-sting':0.38,'ambient-dark':2.3,'ghost-whoosh':0.7,'heartbeat-fast':0.6,
  'ghost-wail':0.9,'eerie-tension':1.6,
  'whoosh-fast':0.25,'weapon-slash':0.32,'bullet-fly':0.18,'tension-rise':1.0,
  'impact-cinematic':0.9,'riser-cinematic':1.6,'trailer-braam':1.5,
  'bell-ding':1.1,'piano-note':0.85,'wind-chimes':1.0,'xylophone-hit':0.55,
  'wrong-note':0.42,'magic-spell':0.62,'crystalline':0.75,'shimmer':0.55,'portal-open':0.9,
  'footstep-hard':0.18,'footstep-soft':0.16,'door-close':0.4,'door-knock':0.45,
  'typing-key':0.06,'glass-clink':0.6,'glass-break':0.55,'paper-rustle':0.5,
  'water-drip':0.18,'water-splash':0.55,'wind-breeze':1.6,'camera-shutter':0.12,
  'fade':0.5,'pop':0.15,'slide':0.5,'typewriter':0.06,
};

// ─── PLAYBACK ────────────────────────────────────────────────────────────────
let _actx = null;
function _getCtx() {
  if (!_actx || _actx.state === 'closed') {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    _actx = new AC();
  }
  if (_actx.state === 'suspended') _actx.resume();
  return _actx;
}

function playSound(effectId) {
  if (!effectId || effectId === 'none') return;
  try {
    const gen = SFX_GEN[effectId];
    if (!gen) return;
    const ctx = _getCtx(); if (!ctx) return;
    const out = gen(ctx, ctx.currentTime);
    if (out) out.connect(ctx.destination);
  } catch (e) { console.warn('SFX play error:', e.message); }
}

function playComboSound(animationType, lineCount = 1) {
  playSound(animationType);
  if (lineCount > 1) {
    for (let i = 1; i < Math.min(lineCount, 4); i++) {
      setTimeout(() => playSound(animationType), i * 180);
    }
  }
}

// ─── DOWNLOAD WAV ────────────────────────────────────────────────────────────
async function downloadSFX(effectId, label) {
  const gen = SFX_GEN[effectId];
  if (!gen) return;
  const AC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!AC) { alert('Navegador não suporta exportação de áudio.'); return; }

  const dur = (SFX_DUR[effectId] || 1.0) + 0.1;
  const sr = 44100;
  const offCtx = new AC(2, Math.ceil(sr * dur), sr);

  try {
    const out = gen(offCtx, 0);
    if (out) out.connect(offCtx.destination);
    const rendered = await offCtx.startRendering();
    const wav = _wavEncode(rendered);
    _dlBlob(new Blob([wav], { type: 'audio/wav' }), (label || effectId) + '.wav');
  } catch (e) { console.error('SFX download error:', e); }
}

async function downloadAllSFX(ids, onProgress) {
  if (typeof JSZip === 'undefined') { alert('JSZip não carregado.'); return; }
  const zip = new JSZip();
  const toDownload = ids || Object.keys(SFX_GEN).filter(k => k !== 'none' && k !== 'fade' && k !== 'pop' && k !== 'slide' && k !== 'typewriter');
  let done = 0;

  for (const id of toDownload) {
    const gen = SFX_GEN[id]; if (!gen) continue;
    const AC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const dur = (SFX_DUR[id] || 1.0) + 0.1;
    const sr = 44100;
    const offCtx = new AC(2, Math.ceil(sr * dur), sr);
    try {
      const out = gen(offCtx, 0);
      if (out) out.connect(offCtx.destination);
      const rendered = await offCtx.startRendering();
      zip.file(id + '.wav', _wavEncode(rendered));
    } catch (e) { console.warn('skip', id, e.message); }
    done++;
    if (onProgress) onProgress(done, toDownload.length);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  _dlBlob(blob, 'legendapro-sfx-pack.zip');
}

// Expõe globalmente
window.SFX_GEN = SFX_GEN;
window.SFX_DUR = SFX_DUR;
window.playSound = playSound;
window.playComboSound = playComboSound;
window.downloadSFX = downloadSFX;
window.downloadAllSFX = downloadAllSFX;
