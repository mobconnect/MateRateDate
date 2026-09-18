import { SoundCategory, SoundSettings } from "../types";

export type { SoundCategory, SoundSettings };

export const DEFAULT_SETTINGS: SoundSettings = {
  master: true,
  categories: {
    spray: true,
    stamp: true,
    match: true,
    ui: true,
  },
};

const STORAGE_KEY = "materatedate_sound_settings";

export function loadSoundSettings(): SoundSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as SoundSettings;
    return {
      master: parsed.master ?? DEFAULT_SETTINGS.master,
      categories: {
        spray: parsed.categories?.spray ?? DEFAULT_SETTINGS.categories.spray,
        stamp: parsed.categories?.stamp ?? DEFAULT_SETTINGS.categories.stamp,
        match: parsed.categories?.match ?? DEFAULT_SETTINGS.categories.match,
        ui: parsed.categories?.ui ?? DEFAULT_SETTINGS.categories.ui,
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSoundSettings(settings: SoundSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

class AudioController {
  private settings: SoundSettings;
  private clips: Partial<Record<SoundCategory, HTMLAudioElement[]>> = {};
  private indices: Partial<Record<SoundCategory, number>> = {};
  private ctx: AudioContext | null = null;

  constructor(settings: SoundSettings) {
    this.settings = settings;
    // Auto initialize in browser context
    if (typeof window !== "undefined") {
      try {
        initGraffitiSFX();
      } catch {}
    }
  }

  get currentSettings(): SoundSettings {
    return this.settings;
  }

  get enabled(): boolean {
    return this.settings.master;
  }

  set enabled(val: boolean) {
    this.settings.master = val;
    saveSoundSettings(this.settings);
  }

  updateSettings(settings: SoundSettings) {
    this.settings = settings;
    saveSoundSettings(this.settings);
  }

  private canPlay(cat: SoundCategory): boolean {
    return this.settings.master && Boolean(this.settings.categories[cat]);
  }

  loadCategory(cat: SoundCategory, urls: string[]) {
    if (typeof window === "undefined") return;
    this.clips[cat] = urls.map((u) => {
      const audio = new Audio(u);
      audio.preload = "auto";
      return audio;
    });
    this.indices[cat] = 0;
  }

  private getNextClip(cat: SoundCategory): HTMLAudioElement | null {
    const pool = this.clips[cat];
    if (!pool || pool.length === 0) return null;
    const idx = this.indices[cat] ?? 0;
    const clip = pool[idx % pool.length];
    this.indices[cat] = (idx + 1) % pool.length;
    return clip;
  }

  private initWebAudioCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  // Fallback synthesized Web Audio sound if HTMLAudioElement encounters error or before load
  private playSynthesizedFallback(cat: SoundCategory) {
    try {
      this.initWebAudioCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      if (cat === "ui") {
        // Graffiti swipe sound: agitator metal ball rattle clink + pressurized aerosol burst
        const rattleOsc = this.ctx.createOscillator();
        const rattleGain = this.ctx.createGain();
        rattleOsc.type = "triangle";
        rattleOsc.frequency.setValueAtTime(1750, now);
        rattleOsc.frequency.exponentialRampToValueAtTime(750, now + 0.04);
        rattleGain.gain.setValueAtTime(0.22, now);
        rattleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
        rattleOsc.connect(rattleGain);
        rattleGain.connect(this.ctx.destination);
        rattleOsc.start(now);
        rattleOsc.stop(now + 0.05);

        const bufferSize = Math.floor(this.ctx.sampleRate * 0.2);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(3200, now + 0.01);
        filter.frequency.exponentialRampToValueAtTime(4600, now + 0.18);
        filter.Q.value = 2.2;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.2, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now + 0.01);
      } else if (cat === "spray") {
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 3200;
        filter.Q.value = 1.8;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);
      } else if (cat === "stamp") {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (cat === "match") {
        const freqs = [523.25, 659.25, 783.99, 1046.5];
        freqs.forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          const startTime = now + idx * 0.07;
          gain.gain.setValueAtTime(0.18, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.35);
        });
      }
    } catch {}
  }

  async play(cat: SoundCategory) {
    if (!this.canPlay(cat)) return;
    const clip = this.getNextClip(cat);
    if (!clip) {
      this.playSynthesizedFallback(cat);
      return;
    }
    try {
      clip.currentTime = 0;
      clip.volume = cat === "match" ? 0.7 : 0.9;
      const promise = clip.play();
      if (promise !== undefined) {
        await promise.catch(() => {
          // Autoplay or loading issue, fallback to synthetic Web Audio
          this.playSynthesizedFallback(cat);
        });
      }
    } catch {
      this.playSynthesizedFallback(cat);
    }
  }

  // Compatibility methods for existing codebase
  playSpray() {
    this.play("spray");
  }

  playStamp() {
    this.play("stamp");
  }

  playMatchChime() {
    this.play("match");
  }

  playPass() {
    this.play("spray");
  }

  playRattle() {
    this.play("spray");
  }

  playGraffitiSwipe(_direction?: "left" | "right") {
    this.play("ui");
  }
}

// Singleton instance wired to localStorage
const controller = new AudioController(loadSoundSettings());

export function getAudioController() {
  return controller;
}

// Convenience helpers used across components
export const playSpray = () => controller.play("spray");
export const playStamp = () => controller.play("stamp");
export const playMatch = () => controller.play("match");
export const playUISwipe = () => controller.play("ui");

// Initialize with graffiti-style assets (hosted in /public/sfx/)
export function initGraffitiSFX() {
  // Spray: aerosol bursts for actions & spray canvas
  controller.loadCategory("spray", [
    "/sfx/graffiti_spray_1.mp3",
    "/sfx/graffiti_spray_2.mp3",
    "/sfx/graffiti_spray_3.mp3",
  ]);

  // Stamp: tag impact for MATE/RATE/DATE buttons
  controller.loadCategory("stamp", [
    "/sfx/tag_stamp_1.mp3",
    "/sfx/tag_stamp_2.mp3",
  ]);

  // Match: celebration chimes
  controller.loadCategory("match", [
    "/sfx/match_celebration_1.mp3",
    "/sfx/match_celebration_2.mp3",
  ]);

  // UI/Swipe: short graffiti spray for gestures
  controller.loadCategory("ui", [
    "/sfx/swipe_spray_1.mp3",
    "/sfx/swipe_spray_2.mp3",
  ]);
}

// Export singleton as sounds for backward compatibility
export const sounds = controller;
