/**
 * Sound effects using Web Audio API
 * No external files needed - generates sounds programmatically
 */

class SoundEngine {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Resume audio context (required after user interaction)
  resume() {
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // Toggle sounds on/off
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // Base oscillator sound
  playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!this.enabled) return;

    const ctx = this.init();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  // Play a sequence of tones
  playSequence(notes, interval = 0.1) {
    if (!this.enabled) return;

    notes.forEach((note, i) => {
      setTimeout(() => {
        this.playTone(note.freq, note.duration || 0.15, note.type || 'sine', note.volume || 0.3);
      }, i * interval * 1000);
    });
  }

  // === SOUND EFFECTS ===

  // Swipe RIGHT - bullish, ascending, positive
  swipeYes() {
    this.playSequence([
      { freq: 440, duration: 0.08, type: 'sine', volume: 0.25 },
      { freq: 554, duration: 0.08, type: 'sine', volume: 0.3 },
      { freq: 659, duration: 0.12, type: 'sine', volume: 0.35 },
    ], 0.06);
  }

  // Swipe LEFT - bearish, descending
  swipeNo() {
    this.playSequence([
      { freq: 440, duration: 0.08, type: 'square', volume: 0.15 },
      { freq: 349, duration: 0.08, type: 'square', volume: 0.18 },
      { freq: 293, duration: 0.12, type: 'square', volume: 0.2 },
    ], 0.06);
  }

  // Skip - neutral whoosh
  skip() {
    if (!this.enabled) return;

    const ctx = this.init();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }

  // Card appear - soft pop
  cardAppear() {
    this.playSequence([
      { freq: 800, duration: 0.05, type: 'sine', volume: 0.15 },
      { freq: 1200, duration: 0.08, type: 'sine', volume: 0.2 },
    ], 0.03);
  }

  // Success - triumphant arpeggio
  success() {
    this.playSequence([
      { freq: 523, duration: 0.1, type: 'sine', volume: 0.25 },
      { freq: 659, duration: 0.1, type: 'sine', volume: 0.28 },
      { freq: 784, duration: 0.1, type: 'sine', volume: 0.3 },
      { freq: 1047, duration: 0.2, type: 'sine', volume: 0.35 },
    ], 0.08);
  }

  // Button click - subtle tick
  click() {
    this.playTone(1000, 0.05, 'sine', 0.15);
  }

  // Button hover - very subtle
  hover() {
    this.playTone(800, 0.03, 'sine', 0.08);
  }

  // Error/rejection
  error() {
    this.playSequence([
      { freq: 200, duration: 0.15, type: 'sawtooth', volume: 0.2 },
      { freq: 180, duration: 0.2, type: 'sawtooth', volume: 0.15 },
    ], 0.1);
  }

  // Impact/slam sound for the bounce animation
  impact() {
    if (!this.enabled) return;

    const ctx = this.init();

    // Create noise for impact
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 150;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start(ctx.currentTime);
  }

  // Signing/processing - techy beeps
  signing() {
    this.playSequence([
      { freq: 1200, duration: 0.05, type: 'square', volume: 0.1 },
      { freq: 1400, duration: 0.05, type: 'square', volume: 0.1 },
      { freq: 1000, duration: 0.05, type: 'square', volume: 0.1 },
    ], 0.12);
  }

  // Coin/money sound
  coin() {
    this.playSequence([
      { freq: 1568, duration: 0.08, type: 'sine', volume: 0.2 },
      { freq: 2093, duration: 0.15, type: 'sine', volume: 0.25 },
    ], 0.08);
  }

  // Whoosh for card flying away
  whoosh() {
    if (!this.enabled) return;

    const ctx = this.init();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  }

  // Theme toggle
  themeToggle() {
    this.playSequence([
      { freq: 600, duration: 0.06, type: 'sine', volume: 0.15 },
      { freq: 900, duration: 0.1, type: 'sine', volume: 0.2 },
    ], 0.05);
  }

  // Glass shatter effect
  shatter() {
    if (!this.enabled) return;

    const ctx = this.init();

    // Create noise burst for glass breaking
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate shatter noise with multiple frequency components
    for (let i = 0; i < bufferSize; i++) {
      const t = i / ctx.sampleRate;
      // Combine different noise profiles
      const noise = Math.random() * 2 - 1;
      const highFreq = Math.sin(t * 8000 + Math.random() * 10) * 0.3;
      const midFreq = Math.sin(t * 3000 + Math.random() * 5) * 0.4;
      // Quick decay envelope
      const envelope = Math.exp(-i / (bufferSize * 0.08));
      data[i] = (noise * 0.5 + highFreq + midFreq) * envelope;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // High-pass filter for glass-like sound
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 2000;

    // Add some resonance
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 4000;
    bandpass.Q.value = 2;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    noise.connect(highpass);
    highpass.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start(ctx.currentTime);

    // Add some tinkling sounds
    setTimeout(() => {
      this.playSequence([
        { freq: 2000, duration: 0.05, type: 'sine', volume: 0.1 },
        { freq: 3000, duration: 0.04, type: 'sine', volume: 0.08 },
        { freq: 2500, duration: 0.05, type: 'sine', volume: 0.06 },
        { freq: 4000, duration: 0.03, type: 'sine', volume: 0.05 },
      ], 0.03);
    }, 50);
  }
}

// Singleton instance
const sounds = new SoundEngine();

export default sounds;
