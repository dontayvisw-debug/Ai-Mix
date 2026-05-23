import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Waves, Volume2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface RealVocalDemoProps {
  onUpgradeClick?: () => void;
}

export type TrackTabType = 'dryVocal' | 'beat' | 'before' | 'mix' | 'master';

const REAL_DEMO_AUDIO = {
  dryVocal: "/demo-assets/trap-demo/dry-vocal.mp3",
  beat: "/demo-assets/trap-demo/trap-beat.mp3",
  before: "/demo-assets/trap-demo/before-rough-mix.mp3",
  mix: "/demo-assets/trap-demo/final-mix.mp3",
  master: "/demo-assets/trap-demo/final-master.mp3"
};

const TABS: { id: TrackTabType; label: string; description: string; file: string; color: string }[] = [
  { id: 'dryVocal', label: 'Dry Vocal', description: 'Raw vocal recording before mixing.', file: REAL_DEMO_AUDIO.dryVocal, color: 'border-white/50 text-white hover:bg-white/10' },
  { id: 'beat', label: 'Beat', description: '2-track instrumental before vocals are mixed in.', file: REAL_DEMO_AUDIO.beat, color: 'border-white/50 text-white hover:bg-white/10' },
  { id: 'before', label: 'Before', description: 'Rough vocal over beat before mixing.', file: REAL_DEMO_AUDIO.before, color: 'border-white/50 text-white hover:bg-white/10' },
  { id: 'mix', label: 'Mix', description: 'Cleaner vocal balance with pitch correction, EQ, compression, delay, and reverb.', file: REAL_DEMO_AUDIO.mix, color: 'border-brand-pink text-brand-pink hover:bg-brand-pink/10' },
  { id: 'master', label: 'Master', description: 'Final louder master preview for release prep.', file: REAL_DEMO_AUDIO.master, color: 'border-brand-pink text-white bg-brand-pink hover:bg-rose-500' }
];

async function checkDemoFileExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const contentType = response.headers.get("content-type");
    if (response.ok && contentType && contentType.includes("text/html")) {
      return false; // Vite dev server fallback to index.html
    }
    return response.ok;
  } catch {
    try {
      const response = await fetch(url);
      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("text/html")) {
        return false;
      }
      return response.ok;
    } catch {
      return false;
    }
  }
}

export default function RealVocalDemo({ onUpgradeClick }: RealVocalDemoProps) {
  const [activeTab, setActiveTab] = useState<TrackTabType>('before');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(85);
  const [playbackSecs, setPlaybackSecs] = useState<number>(0);
  const [duration, setDuration] = useState<number>(100);
  
  const [demoAssetsStatus, setDemoAssetsStatus] = useState<Record<string, boolean>>({});
  const [isInitializing, setIsInitializing] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function validateDemoAssets() {
      const results = await Promise.all(
        Object.entries(REAL_DEMO_AUDIO).map(async ([key, url]) => ({
          key,
          url,
          exists: await checkDemoFileExists(url)
        }))
      );
      
      const statusObj: Record<string, boolean> = {};
      results.forEach(res => {
        statusObj[res.key] = res.exists;
      });
      setDemoAssetsStatus(statusObj);
      setIsInitializing(false);
      
      // Select the first valid tab if the current one is missing
      const validTabs = TABS.filter(t => statusObj[t.id]);
      if (validTabs.length > 0 && !statusObj['before']) {
         setActiveTab(validTabs[0].id);
      }
    }
    
    validateDemoAssets();
  }, []);

  const totalValidAssets = Object.values(demoAssetsStatus).filter(Boolean).length;
  const allMissing = totalValidAssets === 0;

  useEffect(() => {
    if (allMissing || isInitializing) return;

    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused;
      const currentProgress = audioRef.current.currentTime;
      audioRef.current.pause();
      
      if (demoAssetsStatus[activeTab]) {
         audioRef.current.src = TABS.find(t => t.id === activeTab)?.file || '';
         audioRef.current.load();
         const onCanPlay = () => {
           if (audioRef.current) {
             audioRef.current.volume = volume / 100;
             try {
               audioRef.current.currentTime = currentProgress;
             } catch (e) {
               console.error("Seek error", e);
             }
             if (wasPlaying) {
               const playPromise = audioRef.current.play();
               if (playPromise !== undefined) {
                 playPromise.catch((e) => {
                   if (e.name !== 'NotSupportedError') {
                     console.error("Audio playback interrupted", e);
                   }
                   setIsPlaying(false);
                 });
               } else {
                 setIsPlaying(true);
               }
             }
           }
         };
         audioRef.current.addEventListener('loadedmetadata', onCanPlay, { once: true });
      } else {
         setIsPlaying(false);
      }
    } else {
      if (demoAssetsStatus[activeTab]) {
        const audio = new Audio(TABS.find(t => t.id === activeTab)?.file);
        audio.volume = volume / 100;
        audioRef.current = audio;
        
        audio.onplay = () => setIsPlaying(true);
        audio.onpause = () => setIsPlaying(false);
        audio.onended = () => {
          setIsPlaying(false);
          setPlaybackSecs(0);
        };
        
        audio.ontimeupdate = () => {
          setPlaybackSecs(audio.currentTime);
          if (audio.duration && !isNaN(audio.duration)) {
            setDuration(audio.duration);
          }
        };
        audio.onerror = (e) => {
           setIsPlaying(false);
        };
      }
    }

    return () => {
      // Cleanup is mostly for unmount
    };
  }, [activeTab, allMissing, isInitializing, demoAssetsStatus]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
  }, []);

  const handlePlayToggle = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (!demoAssetsStatus[activeTab]) {
         toast.error("This demo file is missing. Add it to /public/demo-assets/trap-demo/.");
         return;
      }
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          if (e.name !== 'NotSupportedError') {
            console.error("Audio play error", e);
          }
          toast.error("Audio format not supported. Please ensure you uploaded valid MP3 files.");
          setIsPlaying(false);
          setPlaybackSecs(0);
        });
      }
    }
  };

  const handleStop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setPlaybackSecs(0);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const activeTabData = TABS.find(t => t.id === activeTab);

  if (isInitializing) {
     return <div className="h-[400px] rounded-3xl p-6 sm:p-8 space-y-6 text-left overflow-hidden border border-white/5 bg-[#050505] animate-pulse"></div>;
  }

  return (
    <div className="relative rounded-3xl p-6 sm:p-8 space-y-6 text-left overflow-hidden border border-white/5" id="real-vocal-demo-deck">
      <div className="absolute inset-0 z-0">
        <img src="/brand/taedatarget-hero.png" alt="mixedbytae background" className="w-full h-full object-cover opacity-[0.15]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-[#050505]/80" />
      </div>
      
      {/* Top headline section */}
      <div className="relative z-10 space-y-4 text-center max-w-2xl mx-auto">
        <span className="inline-flex font-mono text-3xs font-extrabold text-[#f43f5e] uppercase tracking-widest bg-brand-pink/10 border border-brand-pink/20 px-2.5 py-1 rounded-full items-center justify-center space-x-1">
          <Waves className="h-3 w-3" />
          <span>Real-style vocal mix examples</span>
        </span>
        <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
          Hear what <span className="text-brand-pink">mixedbytae</span> does to a vocal.
        </h3>
        <p className="font-sans text-sm text-white/50 leading-relaxed max-w-lg mx-auto">
          Listen to a real vocal demo go from dry recording and 2-track beat to a cleaner mix and louder master.
        </p>
        <p className="font-mono text-3xs text-[#10b981] font-bold uppercase tracking-widest pt-1">
           Better recordings create better mixes.
        </p>
      </div>

      {allMissing ? (
        <div className="relative z-10 max-w-2xl mx-auto bg-black/60 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 space-y-6 text-center shadow-[0_0_30px_rgba(244,63,94,0.1)]">
           <div className="mx-auto w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-2">
             <Volume2 className="h-5 w-5 text-red-500" />
           </div>
           
           <h4 className="font-display text-lg font-bold text-white">Demo audio is not connected yet.</h4>
           <div className="font-sans text-sm text-white/70 space-y-2">
             <p>Add your five demo MP3 files to activate the homepage preview.</p>
             <p className="text-xs text-white/50 pt-2 pb-1 font-mono">/public/demo-assets/trap-demo/</p>
             <ul className="text-xs font-mono text-white/40 border border-white/5 bg-white/5 rounded-lg p-3 inline-block text-left mx-auto">
               <li>dry-vocal.mp3</li>
               <li>trap-beat.mp3</li>
               <li>before-rough-mix.mp3</li>
               <li>final-mix.mp3</li>
               <li>final-master.mp3</li>
             </ul>
           </div>
           
           <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
             <button
                onClick={() => {
                   document.getElementById('workshop-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-center space-x-2 bg-brand-pink hover:bg-rose-400 text-white px-5 py-2.5 rounded-lg text-sm font-bold w-full sm:w-auto transition-colors"
             >
                <Upload className="h-4 w-4" />
                <span>Open Upload Flow</span>
             </button>
             <button
                onClick={() => {
                   toast.info("Add the five demo files to /public/demo-assets/trap-demo/ to enable playback.");
                }}
                className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg text-sm font-bold w-full sm:w-auto transition-colors"
             >
                <span>Show Setup Instructions</span>
             </button>
           </div>
        </div>
      ) : (
        <>
          {/* Tabs list */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 border-b border-white/5 pb-6 pt-2" id="demo-deck-tabs">
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              const isAvailable = demoAssetsStatus[tab.id];
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (isAvailable) {
                      setActiveTab(tab.id as TrackTabType);
                    } else {
                      toast.info("This demo file is missing. Add it to /public/demo-assets/trap-demo/.");
                    }
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all border ${
                    !isAvailable ? 'opacity-30 cursor-not-allowed bg-black/60 text-white/30 border-white/5' :
                    isActive 
                      ? (tab.id === 'master' || tab.id === 'mix' ? tab.color : 'bg-white text-black border-white shadow-lg') 
                      : 'bg-black/60 text-white/60 border-white/10 hover:border-white/30'
                  }`}
                >
                  {tab.label} {isAvailable ? '' : '(Missing)'}
                </button>
              );
            })}
          </div>

          {/* Actual Player UI block */}
          <div className="relative z-10 max-w-3xl mx-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">
            
            {totalValidAssets > 0 && totalValidAssets < 5 && (
               <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-3xs uppercase tracking-wider p-2 mb-2 rounded text-center font-bold">
                 {totalValidAssets} of 5 demo files connected
               </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="font-mono text-3xs uppercase text-brand-pink font-bold block mb-1">
                  Currently Auditioning
                </span>
                <h4 className="font-display font-black text-lg text-white uppercase tracking-wide">{activeTabData?.label}</h4>
                <p className="font-sans text-xs text-white/60 mt-1 max-w-sm">
                  {activeTabData?.description}
                </p>
                <p className="font-sans text-2xs text-white/30 mt-2 max-w-[280px] leading-tight">
                  This product demo shows the difference between a dry vocal, rough mix, final mix, and master. Your real results depend on recording quality.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end opacity-40">
                 <Waves className="h-12 w-12 text-white/50 stroke-1" />
              </div>
            </div>

            {/* Playable Area */}
            <div className="space-y-3 pt-2">
              <div className="h-14 flex items-end justify-between gap-[2px] relative bg-black/50 rounded-xl border border-white/10 px-2 py-1 overflow-hidden" id="waveform-simple-visualizer">
                {/* Fake waveform visual strictly for aesthetic structure, it syncs with progress */}
                {Array.from({length: 60}).map((_, i) => {
                  const barProgress = (i / 60) * duration;
                  const isPlayed = playbackSecs >= barProgress;
                  // Random heights for visual texture
                  const height = 15 + Math.sin(i * 0.5) * 10 + Math.random() * 20;
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm"
                      style={{
                        height: `${height}%`,
                        backgroundColor: isPlayed ? (activeTab === 'master' ? '#FFFFFF' : activeTab === 'mix' ? '#f43f5e' : '#52525b') : 'rgba(255,255,255,0.1)'
                      }}
                    />
                  );
                })}
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.01"
                  value={playbackSecs}
                  onChange={(e) => {
                    const newTime = parseFloat(e.target.value);
                    setPlaybackSecs(newTime);
                    if (audioRef.current) {
                      audioRef.current.currentTime = newTime;
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
              </div>
              <div className="flex justify-between font-mono text-3xs text-white/50 px-1">
                <span>{formatTime(playbackSecs)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-4 pt-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePlayToggle}
                  className={`h-12 w-12 rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-lg ${
                    activeTab === 'master' ? 'bg-white text-black hover:bg-zinc-200' :
                    activeTab === 'mix' ? 'bg-brand-pink text-white hover:bg-rose-400' :
                    'bg-zinc-800 text-white hover:bg-zinc-600 border border-white/10'
                  }`}
                >
                  {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-1" />}
                </button>
                <button
                  onClick={handleStop}
                  className="font-mono text-3xs uppercase text-white/30 hover:text-white transition-colors border border-transparent px-3 py-2 rounded-lg hover:bg-white/5"
                >
                  Stop
                </button>

                <div className="hidden sm:flex flex-row items-center space-x-2 font-mono text-3xs text-white/30 bg-[#0A0A0A] border border-white/5 px-3 py-1.5 rounded-xl ml-4">
                  <Volume2 className="h-3 w-3 text-white/50" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setVolume(val);
                      if (audioRef.current) {
                         audioRef.current.volume = val / 100;
                      }
                    }}
                    className="w-16 accent-brand-cyan bg-white/10 h-0.5 mt-0.5 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
}