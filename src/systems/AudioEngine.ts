// Procedural Web Audio Engine for RUPTURA
// Generates both dynamic ambient music tracks and punchy sound effects without external dependencies

export type BGMTrack = 'NONE' | 'MENU' | 'NEXUS' | 'EXPLORATION' | 'COMBAT' | 'BOSS';

export class SoundSynth {
  private ctx: AudioContext | null = null;
  public masterVolume: number = 0.8;
  public sfxVolume: number = 0.8;
  public bgmVolume: number = 0.5;
  public muted: boolean = false;
  private currentBgm: BGMTrack = 'NONE';
  private bgmTimer: number | null = null;
  private bgmGainNode: GainNode | null = null;
  private isUnlocked: boolean = false;

  constructor() {
    // Load persisted audio settings if available
    try {
      const savedMute = localStorage.getItem('ruptura_muted');
      if (savedMute !== null) this.muted = savedMute === 'true';
      const savedBgmVol = localStorage.getItem('ruptura_bgm_vol');
      if (savedBgmVol !== null) this.bgmVolume = parseFloat(savedBgmVol);
      const savedSfxVol = localStorage.getItem('ruptura_sfx_vol');
      if (savedSfxVol !== null) this.sfxVolume = parseFloat(savedSfxVol);
    } catch {
      // ignore localstorage errors
    }

    // Auto unlock on first user gesture
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      };
      window.addEventListener('click', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });
      window.addEventListener('touchstart', unlockAudio, { once: true });

      // Handle tab visibility to pause audio gracefully
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (this.ctx && this.ctx.state === 'running') {
            this.ctx.suspend().catch(() => {});
          }
        } else {
          if (this.ctx && this.ctx.state === 'suspended' && !this.muted) {
            this.ctx.resume().catch(() => {});
          }
        }
      });
    }
  }

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
        this.bgmGainNode = this.ctx.createGain();
        this.updateBgmGain();
        this.bgmGainNode.connect(this.ctx.destination);
        this.isUnlocked = true;
      } catch {
        // AudioContext not available
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    try {
      localStorage.setItem('ruptura_muted', String(muted));
    } catch {}
    this.updateBgmGain();
  }

  public setBgmVolume(vol: number) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('ruptura_bgm_vol', String(this.bgmVolume));
    } catch {}
    this.updateBgmGain();
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('ruptura_sfx_vol', String(this.sfxVolume));
    } catch {}
  }

  private updateBgmGain() {
    if (this.bgmGainNode && this.ctx) {
      const targetGain = this.muted ? 0 : this.masterVolume * this.bgmVolume;
      this.bgmGainNode.gain.cancelScheduledValues(this.ctx.currentTime);
      this.bgmGainNode.gain.setValueAtTime(targetGain, this.ctx.currentTime);
    }
  }

  // --- Dynamic Procedural Music Tracks ---
  public playBGM(track: BGMTrack) {
    if (this.currentBgm === track) return;
    this.stopBGM();
    this.currentBgm = track;
    if (track === 'NONE') return;

    this.init();
    if (!this.ctx || !this.bgmGainNode) return;

    let step = 0;
    const intervalMs = track === 'BOSS' ? 220 : track === 'COMBAT' ? 260 : track === 'MENU' ? 500 : 420;

    const tick = () => {
      if (!this.ctx || this.currentBgm !== track || this.muted) return;
      if (this.ctx.state === 'suspended') return;

      const now = this.ctx.currentTime;

      if (track === 'MENU') {
        // Melodic ambient sci-fi arpeggio (C min9, Ab maj7)
        const menuScale = [261.63, 311.13, 392.00, 466.16, 523.25, 622.25];
        if (step % 2 === 0) {
          const freq = menuScale[(step / 2) % menuScale.length];
          this.playBgmSynthNote(freq, 'sine', 0.8, 0.08);
        }
        if (step % 16 === 0) {
          // Sub bass drone
          this.playBgmSynthNote(65.4, 'triangle', 3.0, 0.15);
        }
      } else if (track === 'NEXUS' || track === 'EXPLORATION') {
        // Atmospheric deep space mystery drone and subtle rhythmic clicks
        if (step % 8 === 0) {
          const baseFreq = step % 16 === 0 ? 55 : 73.42;
          this.playBgmSynthNote(baseFreq, 'triangle', 2.8, 0.12);
        }
        if (step % 4 === 2) {
          this.playBgmSynthNote(440 * (1 + (step % 3) * 0.25), 'sine', 0.4, 0.04);
        }
      } else if (track === 'COMBAT') {
        // Driving cybernetic bass and rhythm
        const combatBass = [65.41, 65.41, 77.78, 65.41, 87.31, 65.41, 98.00, 116.54];
        const freq = combatBass[step % combatBass.length];
        this.playBgmSynthNote(freq, 'sawtooth', 0.22, 0.14, true);

        // Hi-hat pulse
        if (step % 2 === 1) {
          this.playBgmNoise(0.04, 0.03);
        }
        // Synth arpeggio stab
        if (step % 8 === 4) {
          this.playBgmSynthNote(261.63 * 2, 'square', 0.15, 0.06);
        }
      } else if (track === 'BOSS') {
        // Aggressive, tense, dramatic boss theme with driving heavy bassline
        const bossBass = [58.27, 58.27, 61.74, 58.27, 73.42, 69.30, 58.27, 87.31];
        const freq = bossBass[step % bossBass.length];
        this.playBgmSynthNote(freq, 'sawtooth', 0.2, 0.18, true);

        // Heavy kick pulse
        if (step % 2 === 0) {
          this.playBgmSynthNote(45, 'sine', 0.15, 0.2);
        }
        // Intense lead warning stab
        if (step % 8 === 0) {
          this.playBgmSynthNote(466.16, 'sawtooth', 0.4, 0.1);
        } else if (step % 8 === 6) {
          this.playBgmSynthNote(440.0, 'sawtooth', 0.35, 0.09);
        }
      }

      step++;
    };

    this.bgmTimer = window.setInterval(tick, intervalMs);
  }

  public stopBGM() {
    if (this.bgmTimer !== null) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.currentBgm = 'NONE';
  }

  private playBgmSynthNote(freq: number, type: OscillatorType, duration: number, gainVal: number, filter: boolean = false) {
    if (!this.ctx || !this.bgmGainNode) return;
    try {
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      noteGain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      if (filter) {
        const biquad = this.ctx.createBiquadFilter();
        biquad.type = 'lowpass';
        biquad.frequency.setValueAtTime(500, this.ctx.currentTime);
        biquad.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + duration);
        osc.connect(biquad);
        biquad.connect(noteGain);
      } else {
        osc.connect(noteGain);
      }

      noteGain.connect(this.bgmGainNode);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {}
  }

  private playBgmNoise(duration: number, gainVal: number) {
    if (!this.ctx || !this.bgmGainNode) return;
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 3000;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGainNode);
      whiteNoise.start();
    } catch {}
  }

  // --- Punchy Sound Effects (SFX) ---
  private getSfxGain(): number {
    return this.muted ? 0 : this.masterVolume * this.sfxVolume;
  }

  playCinematicTransition() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(740, this.ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.15 * this.getSfxGain(), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.08 * this.getSfxGain(), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playLaser() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(950, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.18 * this.getSfxGain(), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  playShield() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(650, this.ctx.currentTime + 0.28);
    gain.gain.setValueAtTime(0.22 * this.getSfxGain(), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.28);
  }

  playQuantum() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1350, this.ctx.currentTime + 0.35);
    osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.55);
    gain.gain.setValueAtTime(0.25 * this.getSfxGain(), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.55);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.55);
  }

  playTelegraphWarning() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(740, this.ctx.currentTime);
    osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.08);
    osc.frequency.setValueAtTime(740, this.ctx.currentTime + 0.16);
    gain.gain.setValueAtTime(0.18 * this.getSfxGain(), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playEnemyAttack() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(45, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.2 * this.getSfxGain(), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playVictory() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const notes = [392, 440, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.14 * this.getSfxGain(), this.ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.1 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.1);
      osc.stop(this.ctx.currentTime + i * 0.1 + 0.35);
    });
  }

  playDefeat() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const notes = [220, 196, 174.61, 146.83];
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.18 * this.getSfxGain(), this.ctx.currentTime + i * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.18 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.18);
      osc.stop(this.ctx.currentTime + i * 0.18 + 0.4);
    });
  }

  playScan() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(550, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(950, this.ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.15 * this.getSfxGain(), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  playDenied() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.setValueAtTime(100, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.18 * this.getSfxGain(), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.22);
  }

  playDodge() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(850, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(260, this.ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.16 * this.getSfxGain(), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  playHeavyHit() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.3 * this.getSfxGain(), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playCombo() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(550, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(820, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.16 * this.getSfxGain(), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playBossPhase() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const notes = [164.81, 220, 293.66, 370, 440];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.22 * this.getSfxGain(), this.ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.12 + 0.38);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.12);
      osc.stop(this.ctx.currentTime + idx * 0.12 + 0.38);
    });
  }

  playPortal() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(980, this.ctx.currentTime + 0.45);
    gain.gain.setValueAtTime(0.16 * this.getSfxGain(), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.45);
  }

  playSecretFound() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.14 * this.getSfxGain(), this.ctx.currentTime + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.09 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.09);
      osc.stop(this.ctx.currentTime + i * 0.09 + 0.25);
    });
  }

  playUpgrade() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(920, this.ctx.currentTime + 0.28);
    gain.gain.setValueAtTime(0.18 * this.getSfxGain(), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.28);
  }

  playDialogueBlip() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const pitch = 380 + Math.random() * 80;
    osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.04 * this.getSfxGain(), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.035);
  }

  playResonanceCombo() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    // Massive multiversal resonance sweep and chord burst
    const notes = [220, 277.18, 329.63, 440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.06);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + i * 0.06 + 0.4);
      gain.gain.setValueAtTime(0.18 * this.getSfxGain(), this.ctx.currentTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.06 + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.06);
      osc.stop(this.ctx.currentTime + i * 0.06 + 0.45);
    });
  }

  playCompanionSupport() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.2);
    osc.frequency.exponentialRampToValueAtTime(1100, this.ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.2 * this.getSfxGain(), this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playRadioStatic() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const duration = 0.12;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.4;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08 * this.getSfxGain(), this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      noise.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch {}
  }
}

export const audio = new SoundSynth();
