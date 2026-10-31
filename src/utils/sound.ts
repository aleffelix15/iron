// Web Audio API synthesizer for STARK INDUSTRIES V2 HUD interface
// Pure procedural audio — zero external audio files required.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = false;
  private listeners = new Set<(enabled: boolean) => void>();

  constructor() {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("stark-audio");
      if (saved === "1") {
        this.enabled = true;
      }
    }
  }

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("stark-audio", this.enabled ? "1" : "0");
    }
    if (this.enabled) {
      this.playClick();
    }
    this.listeners.forEach((fn) => fn(this.enabled));
    return this.enabled;
  }

  public subscribe(fn: (enabled: boolean) => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  /** Subtle high-tech tick on hover */
  public playHover(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1480, now);
    osc.frequency.exponentialRampToValueAtTime(1920, now + 0.035);

    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  /** Tactical mechanical-digital click */
  public playClick(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(210, now + 0.065);

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1840, now);
    osc2.frequency.exponentialRampToValueAtTime(920, now + 0.045);

    gain.gain.setValueAtTime(0.065, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 0.075);
    osc2.stop(now + 0.05);
  }

  /** Cinematic frequency sweep when transitioning between sections */
  public playSwipe(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.36);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.18);
    filter.Q.value = 3.5;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  /** Harmonic chord chime when J.A.R.V.I.S. activates or responds */
  public playJarvis(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.045;

      osc.type = "sine";
      osc.frequency.setValueAtTime(f, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.035, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.32);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.34);
    });
  }

  /** Power surge / overdrive sound for 3D reactor inspection */
  public playSurge(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.28);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  }
}

export const sound = new SoundEngine();
