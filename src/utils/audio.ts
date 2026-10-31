/**
 * Procedural Audio Synthesizer via Web Audio API
 * Provides low-latency, responsive tactile sounds for touch & mouse gameplay
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    const saved = localStorage.getItem('puzzle_sound_muted');
    if (saved !== null) {
      this.muted = saved === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    localStorage.setItem('puzzle_sound_muted', String(muted));
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  // Crisp magnetic snap sound when a puzzle piece locks into place
  public playSnap() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Wooden/cardboard tactile "click"
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(320, now);
      osc1.frequency.exponentialRampToValueAtTime(80, now + 0.06);

      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.06);

      // Sweet harmonic ping
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.02);
      osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.08);

      gain2.gain.setValueAtTime(0.2, now + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.02);
      osc2.stop(now + 0.22);
    } catch {
      // AudioContext could fail on un-interacted page, ignore safely
    }
  }

  // Soft tactile pick up
  public playPick() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(360, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  // Soft drop back to tray
  public playDrop() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  // Gentle magical chime when hint is clicked
  public playHint() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6
      notes.forEach((freq, idx) => {
        const now = (this.ctx?.currentTime || 0) + idx * 0.07;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      });
    } catch {}
  }

  // Triumphant victory fanfare when the entire picture is completed
  public playVictory() {
    if (this.muted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      // Grand Russian triumphant chord progression: C - E - G - C - E
      const notes = [
        { f: 523.25, t: 0, d: 0.2 },     // C5
        { f: 659.25, t: 0.15, d: 0.2 },  // E5
        { f: 783.99, t: 0.3, d: 0.25 },  // G5
        { f: 1046.50, t: 0.48, d: 0.6 }, // C6
        { f: 1318.51, t: 0.6, d: 0.9 },  // E6
      ];

      notes.forEach(({ f, t, d }) => {
        const now = (this.ctx?.currentTime || 0) + t;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + d);
      });
    } catch {}
  }
}

export const soundManager = new SoundController();
