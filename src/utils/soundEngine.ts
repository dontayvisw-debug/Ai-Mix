import { MixSettings } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private mixMode: 'original' | 'mixed' = 'mixed';
  private timer: number | null = null;
  
  // Audio Nodes
  private beatOsc: OscillatorNode | null = null;
  private vocalOsc: OscillatorNode | null = null;
  private mainGain: GainNode | null = null;
  private vocalGain: GainNode | null = null;
  private beatGain: GainNode | null = null;
  private reverbNode: DelayNode | null = null;
  private reverbGain: GainNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null; // Tube warmth

  // Values
  private currentProgress: number = 0; // 0 to 120 seconds length
  private duration: number = 120;
  private playbackCallback: ((seconds: number, meters: { left: number; right: number }) => void) | null = null;
  private settings: MixSettings = {
    vocalBrightness: 70,
    vocalWarmth: 50,
    autoTuneStrength: 80,
    reverbAmount: 40,
    delayAmount: 30,
    vocalLoudness: 75,
    compressionStrength: 60,
    masterLoudness: 80
  };

  constructor() {
    // Initialized on-demand to respect browser sandboxing and interactive audio start policy
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setCallback(cb: (seconds: number, meters: { left: number; right: number }) => void) {
    this.playbackCallback = cb;
  }

  public setSettings(newSettings: MixSettings) {
    this.settings = { ...newSettings };
    this.updateDspNodes();
  }

  public setMixMode(mode: 'original' | 'mixed') {
    this.mixMode = mode;
    this.updateDspNodes();
  }

  public setProgress(seconds: number) {
    this.currentProgress = Math.max(0, Math.min(seconds, this.duration));
    if (this.playbackCallback) {
      this.playbackCallback(this.currentProgress, { left: 0, right: 0 });
    }
  }

  public start() {
    this.initCtx();
    if (!this.ctx) return;
    if (this.isPlaying) return;

    try {
      this.isPlaying = true;
      this.currentProgress = this.currentProgress >= this.duration ? 0 : this.currentProgress;
      
      // Create main output path
      this.mainGain = this.ctx.createGain();
      this.mainGain.connect(this.ctx.destination);
      
      // Vocal Path
      this.vocalGain = this.ctx.createGain();
      this.vocalOsc = this.ctx.createOscillator();
      this.vocalOsc.type = 'sawtooth';

      // Tube saturation filter
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      
      // Reverb / Echo effects
      this.delayNode = this.ctx.createDelay(1.0);
      this.delayGain = this.ctx.createGain();
      
      this.reverbNode = this.ctx.createDelay(2.0); // Simple delay-based room generator
      this.reverbGain = this.ctx.createGain();

      // Beat Drum-Track simulation
      this.beatGain = this.ctx.createGain();
      this.beatOsc = this.ctx.createOscillator();
      this.beatOsc.type = 'triangle';

      // Wire up Vocal Nodes
      this.vocalOsc.connect(this.filterNode);
      this.filterNode.connect(this.vocalGain);
      
      // Send paths
      this.filterNode.connect(this.delayNode);
      this.delayNode.connect(this.delayGain);
      this.delayGain.connect(this.mainGain);

      this.filterNode.connect(this.reverbNode);
      this.reverbNode.connect(this.reverbGain);
      this.reverbGain.connect(this.mainGain);
      
      this.vocalGain.connect(this.mainGain);

      // Wire up Beat Nodes
      this.beatOsc.connect(this.beatGain);
      this.beatGain.connect(this.mainGain);

      // Synchronize start times
      const now = this.ctx.currentTime;
      this.vocalOsc.start(now);
      this.beatOsc.start(now);

      // Trigger dynamic modulation loop
      this.updateDspNodes();
      this.startSequenceLoop();
    } catch (e) {
      console.error("Audio API synthesis unavailable in this frame:", e);
      // Fallback timer for no audio structures
      this.isPlaying = true;
      this.startSequenceLoop();
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    // Stop oscillators and clean
    try {
      if (this.vocalOsc) {
        this.vocalOsc.stop();
        this.vocalOsc.disconnect();
      }
      if (this.beatOsc) {
        this.beatOsc.stop();
        this.beatOsc.disconnect();
      }
      if (this.mainGain) this.mainGain.disconnect();
    } catch (e) {}

    this.vocalOsc = null;
    this.beatOsc = null;
  }

  private updateDspNodes() {
    if (!this.ctx || !this.isPlaying) return;

    const originalScale = [130.81, 146.83, 164.81, 196.00, 220.00]; // C3 Major scale
    const now = this.ctx.currentTime;

    try {
      if (this.mixMode === 'mixed') {
        // AI STAGE: Polished settings mapped
        // Vocal volume balanced
        const vocVol = (this.settings.vocalLoudness / 100) * 0.4;
        this.vocalGain?.gain.setValueAtTime(vocVol, now);
        
        // AutoTune level: if low, introduces vocal drift; if high, locks perfectly to nearest scale note
        // Warmth: lower cutoff for cozy saturation
        const warmFreq = 1500 - (this.settings.vocalWarmth * 8);
        if (this.filterNode) {
          this.filterNode.frequency.setValueAtTime(warmFreq, now);
          this.filterNode.Q.setValueAtTime(2.0, now);
        }

        // Brightness: adds air shelf
        // Reverb map
        const revVol = (this.settings.reverbAmount / 100) * 0.25;
        this.reverbGain?.gain.setValueAtTime(revVol, now);
        if (this.reverbNode) {
          this.reverbNode.delayTime.setValueAtTime(0.35 + (this.settings.reverbAmount * 0.005), now);
        }

        // Delay map
        const dlyVol = (this.settings.delayAmount / 100) * 0.2;
        this.delayGain?.gain.setValueAtTime(dlyVol, now);
        if (this.delayNode) {
          this.delayNode.delayTime.setValueAtTime(0.25, now);
        }

        // Beat Master Loudness
        const beatVol = 0.25 * (this.settings.masterLoudness / 80);
        this.beatGain?.gain.setValueAtTime(beatVol, now);

        // Overall Master volume limit
        const masterVol = (this.settings.masterLoudness / 100) * 0.9;
        this.mainGain?.gain.setValueAtTime(masterVol, now);

      } else {
        // ORIGINAL DRY: Dry, slightly flat vocal, thin beat, cold room, no reverb or echo
        this.vocalGain?.gain.setValueAtTime(0.5, now);
        this.reverbGain?.gain.setValueAtTime(0, now);
        this.delayGain?.gain.setValueAtTime(0, now);
        this.beatGain?.gain.setValueAtTime(0.18, now); // Quiet, unbalanced
        
        if (this.filterNode) {
          this.filterNode.frequency.setValueAtTime(4000, now); // Harsh flat sound
          this.filterNode.Q.setValueAtTime(0.5, now);
        }

        if (this.mainGain) {
          this.mainGain.gain.setValueAtTime(0.7, now);
        }
      }
    } catch (e) {
      // Ignored if custom nodes missing
    }
  }

  private startSequenceLoop() {
    let tickCount = 0;
    this.timer = window.setInterval(() => {
      if (!this.isPlaying) return;

      this.currentProgress += 0.5;
      if (this.currentProgress >= this.duration) {
        this.currentProgress = 0;
        this.stop();
        this.playbackCallback?.(0, { left: 0, right: 0 });
        return;
      }

      // Live Melody Note Sequences
      tickCount++;
      const measureIndex = Math.floor(tickCount / 2) % 4;
      const originalScale = [130.81, 146.83, 164.81, 196.00, 220.00]; // Low pitch
      const leadScale = [261.63, 293.66, 329.63, 392.00, 440.00]; // Vocal mid-range

      if (!this.ctx) {
        // Direct UI animation fallback if Web Audio initialized, but failed
        const leftMeter = this.isPlaying ? 30 + Math.random() * 45 : 0;
        const rightMeter = this.isPlaying ? 25 + Math.random() * 50 : 0;
        this.playbackCallback?.(this.currentProgress, { left: leftMeter, right: rightMeter });
        return;
      }

      const now = this.ctx.currentTime;
      try {
        // 1. Play Lead vocal notes (sine-guided rap and melodic flow)
        if (this.vocalOsc && this.vocalGain) {
          const baseNote = leadScale[measureIndex];
          
          // Original mode is slightly sharp or drifting in melody (Autotune Strength logic)
          const autotuneRatio = this.settings.autoTuneStrength / 100;
          const correctionOffset = this.mixMode === 'original' 
            ? Math.sin(tickCount) * 12 // Vocal pitch slide (dry drift)
            : (1 - autotuneRatio) * Math.sin(tickCount) * 8; // Auto-corrected tightness!

          this.vocalOsc.frequency.setValueAtTime(baseNote + correctionOffset, now);
        }

        // 2. Play instrumental kicks & hi-hats (boom bap beat)
        if (this.beatOsc) {
          const beats = [65.41, 0, 98.00, 65.41]; // G1 to C2 bass drum kick
          const pitch = beats[tickCount % 4];
          if (pitch > 0) {
            this.beatOsc.frequency.setValueAtTime(pitch, now);
            this.beatGain?.gain.linearRampToValueAtTime(0.3, now);
            this.beatGain?.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
          } else {
            // Synthesise high hat snap
            this.beatOsc.frequency.setValueAtTime(5000, now);
            this.beatGain?.gain.linearRampToValueAtTime(0.12, now);
            this.beatGain?.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
          }
        }

        // 3. Emit VU meters
        const activeMultiplier = this.mixMode === 'mixed' ? 1.4 : 0.8;
        const leftMeter = 45 + Math.random() * 35 * activeMultiplier;
        const rightMeter = 40 + Math.random() * 40 * activeMultiplier;

        this.playbackCallback?.(this.currentProgress, { 
          left: Math.min(leftMeter, 100), 
          right: Math.min(rightMeter, 100) 
        });

      } catch (e) {
        this.playbackCallback?.(this.currentProgress, { left: 45, right: 50 });
      }
    }, 500);
  }
}

export const GlobalSoundEngine = new SoundEngine();
