import React from 'react';
import { Play, HelpCircle, FileText, CheckCircle, Headphones } from 'lucide-react';
import { toast } from 'sonner';

// Editable variable for tutorial video
export const TUTORIAL_VIDEO_URL = ""; // e.g., "https://www.youtube.com/embed/dQw4w9WgXcQ" or similar embed URL

export default function TutorialVideoSection() {
  const steps = [
    "Upload your vocal and beat.",
    "mixedbytae organizes your session.",
    "mixedbytae analyzes the BPM and key.",
    "mixedbytae applies pitch correction.",
    "mixedbytae builds a modern vocal chain.",
    "mixedbytae prepares your mix preview.",
    "Choose mixing or mastering.",
    "Download MP3 or unlock WAV exports."
  ];

  const handlePlayTutorialDemo = () => {
    window.dispatchEvent(new CustomEvent('playTutorialDemo'));
    document.getElementById('real-vocal-demo-deck')?.scrollIntoView({ behavior: 'smooth' });
    toast.info("Tutorial demo started. Loading Melodic Rap mixedbytae mix preview.");
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-[#0A0A0A] p-6 space-y-6 text-left" id="tutorial-video-section-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h3 className="font-display text-base font-bold text-white flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-brand-pink" />
            <span>How mixedbytae Works</span>
          </h3>
          <p className="font-sans text-xs text-white/50">
            Learn how to upload your vocals, choose your sound, and generate a cleaner mix or master.
          </p>
        </div>
        <button 
          onClick={handlePlayTutorialDemo}
          className="flex items-center space-x-2 bg-brand-pink hover:bg-rose-400 text-white font-display font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-lg shrink-0"
        >
          <Headphones className="h-4 w-4" />
          <span>Play Tutorial Demo</span>
        </button>
      </div>

      {TUTORIAL_VIDEO_URL ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black">
          <iframe
            src={TUTORIAL_VIDEO_URL}
            title="mixedbytae Videoguide"
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black flex flex-col items-center justify-center text-center shadow-inner group cursor-pointer">
          <div className="absolute inset-0 z-0">
            <img src="/brand/taedatarget-hero.png" alt="mixedbytae background" className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/60 to-black/30" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center space-y-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-pink/20 text-brand-pink backdrop-blur-sm border border-brand-pink/30 group-hover:scale-110 transition-transform">
              <Play className="h-6 w-6 fill-current ml-1" />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-white tracking-wider">Watch mixedbytae turn dry vocals into a polished preview.</p>
              <p className="font-sans text-[11px] text-white/50 mt-1 max-w-sm mx-auto">
                mixedbytae organizes your session, analyzes the BPM and key, applies pitch correction, builds a modern vocal chain, and prepares your mix preview.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Steps */}
      <div className="space-y-3 pt-2">
        <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
          <FileText className="h-4 w-4 text-brand-pink" />
          <span>Steps to Studio Polish</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-[11px] text-white/75 bg-black/40 rounded-lg p-2.5 border border-white/5">
              <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded bg-brand-pink/20 text-brand-pink font-mono text-[9px] font-bold">
                0{idx + 1}
              </span>
              <span className="leading-snug">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
