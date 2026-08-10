/**
 * Mini moteur audio procédural. Aucun fichier son à charger : tous les effets
 * sont synthétisés avec Web Audio après le premier geste de l'utilisateur.
 */
export class AudioEngine {
  constructor(enabled = true) {
    this.enabled = enabled;
    this.context = null;
    this.master = null;
  }

  unlock() {
    if (!this.enabled) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = 0.38;
      this.master.connect(this.context.destination);
    }

    if (this.context.state === "suspended") {
      this.context.resume().catch(() => {});
    }
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
    if (this.enabled) this.unlock();
    if (this.master && this.context) {
      this.master.gain.cancelScheduledValues(this.context.currentTime);
      this.master.gain.setTargetAtTime(this.enabled ? 0.38 : 0.0001, this.context.currentTime, 0.025);
    }
  }

  tone({ frequency = 440, endFrequency = frequency, duration = 0.12, volume = 0.12, type = "sine", delay = 0 }) {
    if (!this.enabled) return;
    this.unlock();
    if (!this.context || !this.master) return;

    const now = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(Math.max(20, frequency), now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), now + duration);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain);
    gain.connect(this.master);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.025);
  }

  noise(duration = 0.22, volume = 0.13) {
    if (!this.enabled) return;
    this.unlock();
    if (!this.context || !this.master) return;

    const sampleCount = Math.floor(this.context.sampleRate * duration);
    const buffer = this.context.createBuffer(1, sampleCount, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i += 1) {
      const envelope = 1 - i / sampleCount;
      data[i] = (Math.random() * 2 - 1) * envelope;
    }

    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    const now = this.context.currentTime;

    source.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(540, now);
    filter.frequency.exponentialRampToValueAtTime(90, now + duration);
    filter.Q.value = 0.7;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    source.start(now);
  }

  ui() {
    this.tone({ frequency: 480, endFrequency: 650, duration: 0.065, volume: 0.055, type: "triangle" });
  }

  start() {
    this.tone({ frequency: 180, endFrequency: 520, duration: 0.34, volume: 0.11, type: "sine" });
    this.tone({ frequency: 620, endFrequency: 900, duration: 0.2, volume: 0.05, type: "triangle", delay: 0.17 });
  }

  pass(combo = 1) {
    const base = Math.min(880, 315 + combo * 22);
    this.tone({ frequency: base, endFrequency: base * 1.18, duration: 0.085, volume: 0.07, type: "triangle" });
  }

  perfect(combo = 1) {
    const base = Math.min(920, 470 + combo * 18);
    this.tone({ frequency: base, endFrequency: base * 1.3, duration: 0.12, volume: 0.095, type: "sine" });
    this.tone({ frequency: base * 1.5, endFrequency: base * 1.8, duration: 0.16, volume: 0.055, type: "triangle", delay: 0.055 });
  }

  pulse() {
    this.tone({ frequency: 115, endFrequency: 780, duration: 0.24, volume: 0.13, type: "sawtooth" });
    this.tone({ frequency: 980, endFrequency: 420, duration: 0.3, volume: 0.045, type: "sine" });
  }

  denied() {
    this.tone({ frequency: 120, endFrequency: 82, duration: 0.1, volume: 0.05, type: "square" });
  }

  hit() {
    this.noise(0.38, 0.18);
    this.tone({ frequency: 145, endFrequency: 38, duration: 0.48, volume: 0.17, type: "sawtooth" });
  }
}
