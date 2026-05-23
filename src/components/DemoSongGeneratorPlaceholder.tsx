import React, { useState } from 'react';
import { Settings, Music, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function DemoSongGeneratorPlaceholder() {
  const [generations, setGenerations] = useState(0);

  const DEMO_GENERATOR_DEFAULTS = {
    genre: "Dark Trap / Melodic Rap",
    bpm: 140,
    key: "F# minor",
    vocalStyle: "Modern melodic rap",
    instrumentalStyle: "Dark trap beat with 808s, hats, pads, and moody melody",
    lyricTheme: "pressure, ambition, late nights, making a way out"
  };

  const handleGenerateClick = () => {
    toast.error("Demo song generation is a future backend feature. Connect an AI music or vocal generation API to create real vocals and instrumentals.");
    setGenerations(prev => prev + 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-white/5 bg-[#050505] p-6 sm:p-10 my-16 opacity-50 hover:opacity-100 transition-opacity">
      <div className="flex items-center space-x-3 border-b border-white/10 pb-6 mb-6">
        <Settings className="h-5 w-5 text-zinc-500" />
        <h3 className="font-display text-lg font-bold text-white tracking-wide">Demo Song Generator (Admin Placeholder)</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div className="space-y-4">
           <div>
             <label className="block font-mono text-3xs text-white/50 uppercase tracking-widest mb-1.5">Genre</label>
             <input type="text" readOnly value={DEMO_GENERATOR_DEFAULTS.genre} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-sans text-sm text-white/80 cursor-not-allowed" />
           </div>
           
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block font-mono text-3xs text-white/50 uppercase tracking-widest mb-1.5">BPM</label>
               <input type="text" readOnly value={DEMO_GENERATOR_DEFAULTS.bpm} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-sans text-sm text-white/80 cursor-not-allowed" />
             </div>
             <div>
               <label className="block font-mono text-3xs text-white/50 uppercase tracking-widest mb-1.5">Key</label>
               <input type="text" readOnly value={DEMO_GENERATOR_DEFAULTS.key} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-sans text-sm text-white/80 cursor-not-allowed" />
             </div>
           </div>

           <div>
             <label className="block font-mono text-3xs text-white/50 uppercase tracking-widest mb-1.5">Vocal Style</label>
             <input type="text" readOnly value={DEMO_GENERATOR_DEFAULTS.vocalStyle} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-sans text-sm text-white/80 cursor-not-allowed" />
           </div>
        </div>

        <div className="space-y-4">
           <div>
             <label className="block font-mono text-3xs text-white/50 uppercase tracking-widest mb-1.5">Instrumental Style</label>
             <textarea readOnly rows={2} value={DEMO_GENERATOR_DEFAULTS.instrumentalStyle} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-sans text-sm text-white/80 cursor-not-allowed resize-none" />
           </div>

           <div>
             <label className="block font-mono text-3xs text-white/50 uppercase tracking-widest mb-1.5">Lyric Theme</label>
             <textarea readOnly rows={2} value={DEMO_GENERATOR_DEFAULTS.lyricTheme} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-sans text-sm text-white/80 cursor-not-allowed resize-none" />
           </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleGenerateClick}
          className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all"
        >
          <Music className="h-4 w-4" />
          <span>Generate Demo Song</span>
        </button>
      </div>
    </div>
  );
}
