// Simple Web Audio synthesizer for ambient music and gentle UI clicks
let audioCtx: AudioContext | null = null;
let musicInterval: number | null = null;
let currentOscillators: OscillatorNode[] = [];

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playUiClick(): void {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Ignore audio errors if blocked by browser policy
  }
}

export function playUiChime(): void {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.03, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  } catch {
    // Ignore
  }
}

// Generates warm lofi chord progression when music player is active
const CHORD_PROGRESSION = [
  [261.63, 329.63, 392.0, 493.88], // Cmaj7
  [220.0, 261.63, 329.63, 392.0],  // Am7
  [174.61, 220.0, 261.63, 329.63], // Fmaj7
  [196.0, 246.94, 293.66, 349.23], // G7
];

export function startAmbientMusic(volumeLevel: number = 0.5): void {
  stopAmbientMusic();
  try {
    const ctx = getAudioContext();
    let chordIdx = 0;

    const playChord = () => {
      const chord = CHORD_PROGRESSION[chordIdx % CHORD_PROGRESSION.length];
      chordIdx++;

      currentOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      currentOscillators = [];

      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const targetVol = 0.015 * (volumeLevel / 100);
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(targetVol, ctx.currentTime + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 3.0);
        currentOscillators.push(osc);
      });
    };

    playChord();
    musicInterval = window.setInterval(playChord, 3000);
  } catch {
    // ignore
  }
}

export function stopAmbientMusic(): void {
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
  currentOscillators.forEach((osc) => {
    try {
      osc.stop();
      osc.disconnect();
    } catch {
      // ignore
    }
  });
  currentOscillators = [];
}
