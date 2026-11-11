/**
 * Web Audio API procedural sound synthesizer
 * Zero external audio dependencies. Completely offline, soothing, and instant.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a gentle pentatonic chime (soothing, positive feedback)
 */
export function playChime(freq = 528): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.85);
  } catch {
    // Ignore audio errors gracefully if user hasn't interacted
  }
}

/**
 * Play an organic satisfying bubble pop
 */
export function playBubblePop(variation = 1): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const baseFreq = 400 + (Math.random() * 200) * variation;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch {
    // Graceful fallback
  }
}

/**
 * Play paper rustle / release shredding sound
 */
export function playShredSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Buffer noise for paper tearing
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 3;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(ctx.currentTime);
  } catch {
    // Ignore
  }
}

/**
 * Play gentle tone for breathing guide (inhale / hold / exhale)
 */
export function playBreathTone(phase: 'inhale' | 'hold' | 'exhale'): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';

    if (phase === 'inhale') {
      osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
      osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 3.8); // A4
    } else if (phase === 'hold') {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
    } else {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(261.63, ctx.currentTime + 3.8); // C4
    }

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.9);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 4.0);
  } catch {
    // Ignore
  }
}

// Ambient procedural noise nodes storage
interface ActiveAmbient {
  sourceNodes: AudioNode[];
  gainNode: GainNode;
  type: string;
}

let activeAmbient: ActiveAmbient | null = null;

export function stopAmbient(): void {
  if (activeAmbient) {
    try {
      activeAmbient.gainNode.gain.linearRampToValueAtTime(0.0001, (audioCtx?.currentTime || 0) + 0.5);
      setTimeout(() => {
        activeAmbient?.sourceNodes.forEach(node => {
          if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
            (node as AudioScheduledSourceNode).stop();
          }
          node.disconnect();
        });
        activeAmbient = null;
      }, 550);
    } catch {
      activeAmbient = null;
    }
  }
}

export function playAmbient(type: 'rain' | 'fireplace' | 'cat_purr' | 'singing_bowl', volume = 0.5): void {
  stopAmbient();
  const ctx = getAudioContext();
  if (!ctx) return;

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(volume * 0.25, ctx.currentTime + 0.8);
  masterGain.connect(ctx.destination);

  const nodes: AudioNode[] = [masterGain];

  if (type === 'rain') {
    // Synthesize gentle rain using pink-filtered white noise
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.08;
    }
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;

    whiteNoise.connect(filter);
    filter.connect(masterGain);
    whiteNoise.start();
    nodes.push(whiteNoise, filter);
  } else if (type === 'cat_purr') {
    // Low frequency purring rumble with amplitude modulation
    const carrier = ctx.createOscillator();
    carrier.type = 'sawtooth';
    carrier.frequency.value = 55; // low purr base

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 160;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 24; // purr rate

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.6;

    const purrGain = ctx.createGain();
    purrGain.gain.value = 0.5;

    lfo.connect(lfoGain);
    carrier.connect(filter);
    filter.connect(purrGain);
    purrGain.connect(masterGain);

    carrier.start();
    lfo.start();
    nodes.push(carrier, lfo, filter, lfoGain, purrGain);
  } else if (type === 'fireplace') {
    // Fireplace crackles: soft rumble + random bursts
    const rumble = ctx.createOscillator();
    rumble.type = 'triangle';
    rumble.frequency.value = 65;

    const rumbleGain = ctx.createGain();
    rumbleGain.gain.value = 0.4;
    rumble.connect(rumbleGain);
    rumbleGain.connect(masterGain);
    rumble.start();
    nodes.push(rumble, rumbleGain);

    // Random crackle buffer
    const bufferSize = ctx.sampleRate * 2;
    const crackleBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = crackleBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      if (Math.random() < 0.003) {
        data[i] = (Math.random() * 2 - 1) * 0.7;
      } else {
        data[i] = 0;
      }
    }
    const crackleSource = ctx.createBufferSource();
    crackleSource.buffer = crackleBuffer;
    crackleSource.loop = true;
    crackleSource.connect(masterGain);
    crackleSource.start();
    nodes.push(crackleSource);
  } else if (type === 'singing_bowl') {
    // Soothing meditative harmonics (432Hz + warm overtones)
    const baseFreqs = [432, 864, 1296];
    baseFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      oscGain.gain.value = 0.3 / (idx + 1);
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      nodes.push(osc, oscGain);
    });
  }

  activeAmbient = {
    sourceNodes: nodes,
    gainNode: masterGain,
    type,
  };
}
