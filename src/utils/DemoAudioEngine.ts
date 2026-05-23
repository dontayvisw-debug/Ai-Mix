export const GENRE_DEMOS = {
  melodicRap: {
    name: "Melodic Rap",
    bpm: 77,
    key: "F# minor",
    preset: "Melodic Trap Tune",
    mood: "moody, melodic, tuned vocals"
  },
  cleanRap: {
    name: "Clean Rap",
    bpm: 92,
    key: "A minor",
    preset: "Modern Rap Clean",
    mood: "clean, forward rap vocal"
  },
  rnbSmooth: {
    name: "R&B Smooth",
    bpm: 70,
    key: "C# minor",
    preset: "R&B Smooth",
    mood: "warm, smooth, emotional"
  },
  drillDark: {
    name: "Drill / Dark",
    bpm: 140,
    key: "D minor",
    preset: "Drill / Dark Vocal",
    mood: "dark, aggressive, punchy"
  },
  trapAutotune: {
    name: "Trap AutoTune",
    bpm: 130,
    key: "G minor",
    preset: "Trap Hard Tune",
    mood: "hard tuned, modern trap"
  },
  popBright: {
    name: "Pop Bright",
    bpm: 100,
    key: "E major",
    preset: "Radio Ready Polish",
    mood: "bright, clean, polished"
  }
};

let audioContext: AudioContext | null = null;
const activeSources: AudioBufferSourceNode[] = [];

export function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

export function stopCurrentDemo() {
  activeSources.forEach(source => {
    try {
      source.stop();
      source.disconnect();
    } catch (e) {
      // Ignore if already stopped
    }
  });
  activeSources.length = 0;
}

// Generate an audio buffer synthetically
async function generateSyntheticAudio(trackType: string, genreId: string): Promise<AudioBuffer> {
  const ctx = new OfflineAudioContext(2, 44100 * 10, 44100); // 10 seconds of audio
  const genre = GENRE_DEMOS[genreId as keyof typeof GENRE_DEMOS] || GENRE_DEMOS.melodicRap;
  const bpm = genre.bpm;
  const beatDuration = 60 / bpm;

  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);
  
  if (trackType === 'dryLead' || trackType === 'roughMix' || trackType === 'aiMixed' || trackType === 'mastered') {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 1;
    
    const env = ctx.createGain();
    
    if (trackType === 'dryLead' || trackType === 'roughMix') {
      env.gain.value = 0.5;
    } else if (trackType === 'aiMixed') {
      env.gain.value = 0.7;
      filter.frequency.value = 2000; // brighter
    } else {
      env.gain.value = 0.9;
      filter.frequency.value = 3000; // even brighter
    }
    
    osc.frequency.setValueAtTime(440, 0); // A4
    osc.frequency.linearRampToValueAtTime(880, 5); // Pitch modulation mock
    
    // Simple envelope to mimic vocal phrasing
    for(let i=0; i<10; i+=beatDuration) {
       env.gain.setValueAtTime(0, i);
       env.gain.linearRampToValueAtTime(0.8, i + 0.1);
       env.gain.linearRampToValueAtTime(0, i + beatDuration - 0.1);
    }
    
    osc.connect(filter);
    filter.connect(env);
    env.connect(masterGain);
    
    osc.start(0);
    osc.stop(10);
  }

  if (trackType === 'double') {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    const env = ctx.createGain();
    env.gain.value = 0.3;
    osc.frequency.setValueAtTime(435, 0);
    for(let i=0; i<10; i+=beatDuration) {
       env.gain.setValueAtTime(0, i + 0.05);
       env.gain.linearRampToValueAtTime(0.5, i + 0.15);
       env.gain.linearRampToValueAtTime(0, i + beatDuration - 0.05);
    }
    osc.connect(env);
    env.connect(masterGain);
    osc.start(0);
    osc.stop(10);
  }

  if (trackType === 'beat' || trackType === 'roughMix' || trackType === 'aiMixed' || trackType === 'mastered') {
    // Generate beat
    for (let i = 0; i < 10; i += beatDuration) {
      // Kick (every beat)
      const kickOsc = ctx.createOscillator();
      kickOsc.type = 'sine';
      const kickEnv = ctx.createGain();
      kickOsc.connect(kickEnv);
      kickEnv.connect(masterGain);
      
      kickOsc.frequency.setValueAtTime(150, i);
      kickOsc.frequency.exponentialRampToValueAtTime(0.01, i + 0.5);
      kickEnv.gain.setValueAtTime(1, i);
      kickEnv.gain.exponentialRampToValueAtTime(0.01, i + 0.5);
      
      kickOsc.start(i);
      kickOsc.stop(i + 0.5);
      
      // Snare (every other beat)
      if (Math.round(i / beatDuration) % 2 === 1) {
        const snareNoise = ctx.createBufferSource();
        const noiseBuffer = ctx.createBuffer(1, 44100, 44100);
        for(let j=0; j<44100; j++) noiseBuffer.getChannelData(0)[j] = Math.random() * 2 - 1;
        snareNoise.buffer = noiseBuffer;
        
        const snareFilter = ctx.createBiquadFilter();
        snareFilter.type = 'bandpass';
        snareFilter.frequency.value = 1000;
        
        const snareEnv = ctx.createGain();
        snareEnv.gain.setValueAtTime(1, i);
        snareEnv.gain.exponentialRampToValueAtTime(0.01, i + 0.2);
        
        snareNoise.connect(snareFilter);
        snareFilter.connect(snareEnv);
        snareEnv.connect(masterGain);
        
        snareNoise.start(i);
        snareNoise.stop(i + 0.2);
      }
    }
  }

  // Master limiting for aiMixed and mastered
  if (trackType === 'mastered') {
     const comp = ctx.createDynamicsCompressor();
     comp.threshold.value = -20;
     comp.knee.value = 10;
     comp.ratio.value = 12;
     comp.attack.value = 0;
     comp.release.value = 0.25;
     
     masterGain.disconnect();
     masterGain.connect(comp);
     
     const outGain = ctx.createGain();
     outGain.gain.value = 3; // Making it louder
     comp.connect(outGain);
     outGain.connect(ctx.destination);
  } else if (trackType === 'aiMixed') {
     masterGain.gain.value = 1.2;
  } else if (trackType === 'roughMix') {
     masterGain.gain.value = 0.8;
  }

  return await ctx.startRendering();
}

const urlMap: Record<string, string> = {
  dryLead: "/demo-assets/77bpm-fsharp-minor/lead-1.mp3",
  double: "/demo-assets/77bpm-fsharp-minor/lead-2.mp3",
  adlibs: "/demo-assets/77bpm-fsharp-minor/libs.mp3",
  dubs: "/demo-assets/77bpm-fsharp-minor/dub.mp3",
  beat: "/demo-assets/77bpm-fsharp-minor/mix-this-77-bpm-2track-instrumental.mp3",
};

export async function loadDemoAudioOrGenerateFallback(trackType: string, genreId: string): Promise<{ buffer: AudioBuffer; type: 'real' | 'generated' }> {
  const url = urlMap[trackType];
  const ctx = getAudioContext();
  
  if (url && (genreId === 'melodicRap')) { // We only have real assets for melodicRap 77 BPM right now
    try {
      const response = await fetch(url);
      if (response.ok && response.headers.get('content-type')?.includes('audio')) {
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        return { buffer: audioBuffer, type: 'real' };
      }
    } catch (e) {
      console.warn("Failed to load real audio asset, falling back to synthetic", e);
    }
  }
  
  const buffer = await generateSyntheticAudio(trackType, genreId);
  return { buffer, type: 'generated' };
}

let globalVolumeNode: GainNode | null = null;
let globalPlaybackVolume = 0.85;

export function setGlobalDemoVolume(vol: number) {
  globalPlaybackVolume = Math.max(0, Math.min(1, vol));
  if (globalVolumeNode) {
    globalVolumeNode.gain.value = globalPlaybackVolume;
  }
}

export function playGeneratedBuffer(buffer: AudioBuffer, onEnd: () => void): { source: AudioBufferSourceNode, startTime: number } {
  const ctx = getAudioContext();
  
  if (!globalVolumeNode) {
    globalVolumeNode = ctx.createGain();
    globalVolumeNode.connect(ctx.destination);
  }
  globalVolumeNode.gain.value = globalPlaybackVolume;
  
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(globalVolumeNode);
  source.onended = onEnd;
  source.start(0);
  activeSources.push(source);
  return { source, startTime: ctx.currentTime };
}

export function renderWaveformBars(buffer: AudioBuffer, points: number = 40): number[] {
  const channelData = buffer.getChannelData(0);
  const step = Math.ceil(channelData.length / points);
  const bars = [];
  for (let i = 0; i < points; i++) {
    let sum = 0;
    for (let j = 0; j < step; j++) {
      const idx = i * step + j;
      if (idx < channelData.length) {
        sum += Math.abs(channelData[idx]);
      }
    }
    bars.push(sum / step);
  }
  // Normalize
  const max = Math.max(...bars);
  return bars.map(b => (max > 0 ? (b / max) * 100 : 0));
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
