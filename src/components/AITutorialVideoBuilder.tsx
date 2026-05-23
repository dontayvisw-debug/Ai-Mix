import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Play, Pause, FileText, Image, Clipboard, Check, Sparkles, Video, 
  ArrowRight, AudioLines, Layers, Film, RotateCcw, Volume2, CloudLightning, Download
} from 'lucide-react';
import { toast } from 'sonner';

interface Scene {
  number: number;
  title: string;
  voiceover: string;
  onScreenText: string;
  duration: number; // seconds
}

const scenes: Scene[] = [
  {
    number: 1,
    title: "Hook & Introduction",
    voiceover: "Got dry vocals and a 2-track beat? mixedbytae helps turn your rough home recording into a cleaner, more polished song.",
    onScreenText: "Dry Vocals + 2-Track Beat → mixedbytae Mix Preview",
    duration: 6
  },
  {
    number: 2,
    title: "Multi-File Stem Upload",
    voiceover: "Drag in your lead vocal, vocal double, adlibs, dubs, and 2-track instrumental.",
    onScreenText: "Files Uploaded:\n• lead-1.mp3 (Lead)\n• lead-2.mp3 (Double)\n• libs.mp3 (Adlibs)\n• dub.mp3 (Dubs)\n• mix-this-77... (Instrumental)",
    duration: 6
  },
  {
    number: 3,
    title: "Acoustic File Mapping",
    voiceover: "mixedbytae organizes your session so we know what to process.",
    onScreenText: "Auto-Assigned Session Roles:\n• lead-1.mp3 → Lead Vocal\n• lead-2.mp3 → Vocal Double\n• libs.mp3 → Adlibs\n• dub.mp3 → Dubs\n• mix-this... → 2-Track Instrumental",
    duration: 5
  },
  {
    number: 4,
    title: "BPM & Key Detection",
    voiceover: "For this demo, mixedbytae analyzes the 77 BPM session in F-sharp minor and prepares pitch correction, vocal cleanup, EQ, compression, delay, and mastering polish.",
    onScreenText: "Session Intel:\n• BPM: 77\n• Key: F# Minor\n• Preset: Melodic Trap Tune",
    duration: 8
  },
  {
    number: 5,
    title: "Pitch Correction System",
    voiceover: "Pitch correction is set to the song key, helping melodic vocals sound cleaner while keeping the performance natural.",
    onScreenText: "Pitch Correction: F# Minor\nMode: Modern Clean (Smooth Quantize)",
    duration: 6
  },
  {
    number: 6,
    title: "The Professional Vocal Chain",
    voiceover: "mixedbytae builds a modern vocal chain: cleanup, tuning, EQ, de-essing, compression, saturation, reverb, delay, vocal widening, and final loudness polish.",
    onScreenText: "DSP Chain Link Active:\nCleanup → Tune → EQ → Compress → Effects → Master",
    duration: 7
  },
  {
    number: 7,
    title: "Vocal Balance & Core Preview",
    voiceover: "Compare the original upload against the mixedbytae mix preview before downloading.",
    onScreenText: "Before: Original Dry Capture\nAfter: mixedbytae Mix Preview",
    duration: 6
  },
  {
    number: 8,
    title: "High-Fidelity WAV Downloads",
    voiceover: "Download MP3 for quick sharing, or unlock WAV 48kHz lossless quality for release prep.",
    onScreenText: "Export Ready:\n• MP3 Download\n• WAV 48kHz Lossless\n• WAV 48kHz / 24-bit Pro Export",
    duration: 6
  },
  {
    number: 9,
    title: "Affordable Plan Offerings",
    voiceover: "Start with a single mix for twenty dollars, master a finished song for ten dollars, or upgrade to Artist Monthly for 15 mixes plus mastering.",
    onScreenText: "Premium Studio Plans:\n• Single Mix — $20\n• Mastering — $10\n• Artist Monthly — $75/month\n• Pro Artist — Unlimited",
    duration: 6
  },
  {
    number: 10,
    title: "Legal & Recording Disclaimer",
    voiceover: "Results depend on your recording quality. Cleaner dry vocals create better mixes.",
    onScreenText: "Better recordings create better results.",
    duration: 4
  }
];

export default function AITutorialVideoBuilder() {
  const [activeScene, setActiveScene] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [selectedSubtab, setSelectedSubtab] = useState<'storyboard' | 'prompt' | 'export'>('storyboard');

  const currentScene = scenes[activeScene - 1];

  const handleNextScene = () => {
    setActiveScene(prev => (prev < scenes.length ? prev + 1 : 1));
  };

  const handlePrevScene = () => {
    setActiveScene(prev => (prev > 1 ? prev - 1 : scenes.length));
  };

  const getFullPrompt = () => {
    return `Create a 60-second dark premium music-tech tutorial video for mixedbytae using the demo song files. The song project is 77 BPM in F# minor and includes lead vocal, vocal double, dubs, adlibs, and a 2-track instrumental named "mix-this-77-bpm-2track-instrumental.mp3."

The video should show an independent artist dragging individual audio files into the mixedbytae website. The app detects lead-1.mp3, lead-2.mp3, libs.mp3, dub.mp3, and mix-this-77-bpm-2track-instrumental.mp3, then organizes them into lead vocal, vocal double, adlibs, dubs, and 2-track instrumental.

Show mixedbytae analyzing the song as 77 BPM and F# minor, applying AutoTune-style pitch correction in F# minor, vocal cleanup, EQ, de-essing, compression, saturation, reverb, tempo-synced delay, vocal widening, and mastering polish.

Show a before/after audio player comparing the original upload to the mixedbytae mix preview. Use waveform animations, dark neon UI, premium SaaS visuals, captions, and clear tutorial text.

End with pricing: Single Mix $20, Mastering $10, Artist Monthly $75/month with 15 mixes plus mastering, and Pro Artist with unlimited mixing and mastering.

Include disclaimer: Results may vary based on recording quality. Better recordings create better mixes.

Style: modern, dark, premium, futuristic, artist-focused, clean UI, music studio energy, made for independent rappers, singers, BandLab users, USB mic users, and home studio artists.`;
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(getFullPrompt());
    setCopiedPrompt(true);
    toast.success("Tutorial video prompt copied.");
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyScript = () => {
    const scriptText = scenes.map(s => `SCENE ${s.number}: ${s.title}\nVOICEOVER: "${s.voiceover}"\nON-SCREEN: "${s.onScreenText}"\nDURATION: ${s.duration}s\n------------------------`).join('\n\n');
    navigator.clipboard.writeText(scriptText);
    setCopiedScript(true);
    toast.success("Tutorial script copied.");
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleDownloadPDFMock = () => {
    toast.info("Downloading mixedbytae_Storyboard_Pack.pdf mock asset successfully generated for the 77 BPM F# minor demo project!");
  };

  return (
    <div className="w-full bg-[#070707] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-8 text-left" id="ai-video-builder-root">
      
      {/* Top Banner and Description */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="font-mono text-3xs font-extrabold text-brand-cyan tracking-widest uppercase flex items-center space-x-1">
            <Video className="h-3.5 w-3.5" />
            <span>Independent Artist Marketing Tool</span>
          </span>
          <h3 className="font-display text-lg font-bold text-white tracking-tight mt-1">AI Tutorial Video Builder</h3>
          <p className="font-sans text-xs text-white/40 mt-1">
            Build tutorial campaigns or social media reels using individual MP3 demo stem timelines.
          </p>
        </div>

        <div className="flex bg-[#0A0A0A] border border-white/10 p-0.5 rounded-xl">
          <button 
            type="button"
            onClick={() => setSelectedSubtab('storyboard')}
            className={`px-3 py-1.5 rounded-lg text-3xs font-mono uppercase tracking-wider transition-all duration-200 ${
              selectedSubtab === 'storyboard' ? 'bg-brand-cyan text-black font-extrabold' : 'text-white/55 hover:text-white'
            }`}
          >
            Storyboard
          </button>
          <button 
            type="button"
            onClick={() => setSelectedSubtab('prompt')}
            className={`px-3 py-1.5 rounded-lg text-3xs font-mono uppercase tracking-wider transition-all duration-200 ${
              selectedSubtab === 'prompt' ? 'bg-brand-cyan text-black font-extrabold' : 'text-white/55 hover:text-white'
            }`}
          >
            AI Prompt
          </button>
          <button 
            type="button"
            onClick={() => setSelectedSubtab('export')}
            className={`px-3 py-1.5 rounded-lg text-3xs font-mono uppercase tracking-wider transition-all duration-200 ${
              selectedSubtab === 'export' ? 'bg-brand-cyan text-black font-extrabold' : 'text-white/55 hover:text-white'
            }`}
          >
            Exports
          </button>
        </div>
      </div>

      {selectedSubtab === 'storyboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="video-storyboard-view">
          
          {/* Active Player Preview & Caption box */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-video rounded-2xl bg-[#030303] border border-white/10 overflow-hidden flex flex-col justify-between p-6">
              
              {/* Virtual Glowing Neon Camera Marker */}
              <div className="flex justify-between items-center w-full font-mono text-[10px]">
                <div className="flex items-center space-x-1.5 text-rose-500 font-extrabold">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>REC LIVE PREVIEW</span>
                </div>
                <div className="text-white/30">77 BPM | F# Minor</div>
              </div>

              {/* Central Abstract Pulse Animating Waveforms */}
              <div className="flex flex-col items-center justify-center space-y-3 py-4">
                <div className="flex items-end justify-center h-14 space-x-1.5">
                  {[...Array(24)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-gradient-to-t from-brand-cyan to-brand-green rounded-full"
                      animate={{
                        height: isPlaying ? [16, Math.floor(Math.random() * 40) + 12, 16] : 14
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.5 + i * 0.05,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>

                <div className="px-4 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 font-display text-[11px] font-semibold text-white/80 shrink-0 text-center uppercase tracking-wide">
                  Scene {currentScene.number}: {currentScene.title}
                </div>
              </div>

              {/* Interactive Teleprompt Subtitle Area */}
              <div className="w-full bg-black/80 border border-white/10 backdrop-blur-sm rounded-xl p-4 min-h-[90px] flex flex-col justify-end space-y-2 text-center" id="caption-preview-block">
                <span className="font-mono text-[10px] text-brand-green uppercase tracking-widest block font-bold">Voiceover Voice (60s AI Script)</span>
                <p className="font-sans text-xs text-white/90 leading-normal max-w-xl mx-auto italic">
                  "{currentScene.voiceover}"
                </p>
              </div>

              {/* Watermark brand */}
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white/5 opacity-10 pointer-events-none">
                <Video className="h-32 w-32 rotate-12" />
              </div>
            </div>

            {/* Simulated Live Timeline Player Bar */}
            <div className="space-y-3">
              <div className="flex justify-between items-center font-mono text-xs text-white/40">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="rounded-lg bg-brand-cyan text-black hover:bg-cyan-400 p-2 transition-colors duration-200 flex items-center space-x-1 font-bold text-3xs uppercase tracking-wider"
                >
                  {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  <span>{isPlaying ? 'Pause' : 'Play Script'}</span>
                </button>

                <div className="flex items-center space-x-2">
                  <span className="text-white/80 font-bold">Scene {activeScene}/10</span>
                  <span>({currentScene.duration}s Block)</span>
                </div>
              </div>

              {/* Micro bar selector */}
              <div className="grid grid-cols-10 gap-1.5">
                {scenes.map((s) => (
                  <button
                    key={s.number}
                    type="button"
                    onClick={() => {
                      setActiveScene(s.number);
                      setIsPlaying(true);
                    }}
                    className={`h-2.5 rounded transition-all duration-300 ${
                      activeScene === s.number ? 'bg-brand-cyan shadow-sm shadow-brand-cyan/20' : 'bg-white/10 hover:bg-white/20'
                    }`}
                    title={`Scene ${s.number}: ${s.title}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side Video Layout details */}
          <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="rounded-xl bg-[#0A0A0A] border border-white/5 p-4 space-y-2">
                <span className="font-mono text-3xs text-white/30 uppercase tracking-widest block font-bold">Visual Graphic Element Overlay</span>
                <div className="p-3 bg-black rounded-lg border border-white/5 font-mono text-3xs text-brand-green whitespace-pre-line leading-relaxed">
                  {currentScene.onScreenText}
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-mono text-3xs text-white/30 uppercase tracking-widest block font-bold">Acoustic Asset Usage</span>
                <div className="grid grid-cols-2 gap-2 font-mono text-3xs">
                  <div className="p-2 border border-white/5 bg-black rounded text-[10px]">
                    <span className="text-white/30 block">SOURCE FILES</span>
                    <span className="text-white/80 block mt-0.5 truncate">lead-1.mp3, libs.mp3</span>
                  </div>
                  <div className="p-2 border border-white/5 bg-black rounded text-[10px]">
                    <span className="text-white/30 block">FORMAT</span>
                    <span className="text-brand-cyan block mt-0.5 font-bold">320kbps MP3</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={handlePrevScene}
                className="flex-1 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white px-3 py-2.5 text-2xs uppercase tracking-wider font-mono text-center"
              >
                &larr; Prev Scene
              </button>
              <button
                type="button"
                onClick={handleNextScene}
                className="flex-1 rounded-xl bg-brand-cyan text-black font-extrabold hover:bg-cyan-400 px-3 py-2.5 text-2xs uppercase tracking-wider text-center"
              >
                Next Scene &rarr;
              </button>
            </div>
          </div>

        </div>
      )}

      {selectedSubtab === 'prompt' && (
        <div className="space-y-5 animate-fadeIn" id="ai-video-prompt-generator">
          <div className="rounded-2xl bg-[#0A0A0A] border border-white/5 p-5 space-y-4 text-left">
            <div className="flex justify-between items-center">
              <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="h-4 w-4 text-brand-cyan" />
                <span>Google Veo / Runway Gen-3 Prompt Blueprint</span>
              </h4>
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="font-mono text-3xs text-brand-cyan hover:underline hover:text-cyan-400 uppercase tracking-widest flex items-center space-x-1 bg-brand-cyan/10 border border-brand-cyan/20 px-2.5 py-1 rounded-lg"
              >
                {copiedPrompt ? <Check className="h-3 w-3" /> : <Clipboard className="h-3 w-3" />}
                <span>{copiedPrompt ? "Copied!" : "Copy AI Video Prompt"}</span>
              </button>
            </div>

            <p className="font-sans text-xs text-white/50 leading-relaxed">
              Use this precision script prompt to generate rich promo reels or video guides on platforms like Luma Dream Machine, Kling, Runway, or Canva.
            </p>

            <div className="p-4 bg-black rounded-xl border border-white/5 font-mono text-2xs text-white/70 max-h-[220px] overflow-y-auto leading-relaxed whitespace-pre-wrap select-all">
              {getFullPrompt()}
            </div>
          </div>
        </div>
      )}

      {selectedSubtab === 'export' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="tutorial-export-buttons">
          
          <div className="p-5 border border-white/5 bg-[#090909] rounded-2xl flex flex-col justify-between items-start space-y-3">
            <div className="space-y-1">
              <span className="h-2 w-2 rounded-full bg-brand-green inline-block animate-pulse" />
              <h5 className="font-display text-xs font-bold text-white uppercase tracking-wider mt-1">Export Script Content</h5>
              <p className="font-sans text-[11px] text-white/40">Copy the full scene voiceover text file block.</p>
            </div>
            <button
              type="button"
              onClick={handleCopyScript}
              className="w-full text-center rounded-xl bg-white/5 hover:bg-white/10 text-white/95 text-3xs font-mono uppercase tracking-widest py-2 transition-all"
            >
              {copiedScript ? "Script Copied!" : "Copy Full Script"}
            </button>
          </div>

          <div className="p-5 border border-white/5 bg-[#090909] rounded-2xl flex flex-col justify-between items-start space-y-3">
            <div className="space-y-1">
              <span className="h-2 w-2 rounded-full bg-brand-cyan inline-block" />
              <h5 className="font-display text-xs font-bold text-white uppercase tracking-wider mt-1">Export Storyboard PDF</h5>
              <p className="font-sans text-[11px] text-white/40">Download a consolidated schematic layout layout guide.</p>
            </div>
            <button
              type="button"
              onClick={handleDownloadPDFMock}
              className="w-full text-center rounded-xl bg-white/5 hover:bg-white/10 text-white/95 text-3xs font-mono uppercase tracking-widest py-2 transition-all"
            >
              Download PDF Bundle
            </button>
          </div>

          <div className="p-5 border border-white/5 bg-[#090909] rounded-2xl flex flex-col justify-between items-start space-y-3">
            <div className="space-y-1">
              <span className="h-2 w-2 rounded-full bg-brand-pink inline-block animate-pulse" />
              <h5 className="font-display text-xs font-bold text-white uppercase tracking-wider mt-1">Audio Master assets</h5>
              <p className="font-sans text-[11px] text-white/40">Download all clean 77 BPM track MP3 stems as a pack.</p>
            </div>
            <button
              type="button"
              onClick={() => toast.info("Downloading all 5 original 77 BPM stems individually...")}
              className="w-full text-center rounded-xl bg-brand-pink/10 hover:bg-brand-pink/20 text-brand-pink text-3xs font-mono uppercase tracking-widest py-2 transition-all border border-brand-pink/20"
            >
              Download All Audio Stems
            </button>
          </div>

        </div>
      )}

      {/* Safety copy */}
      <div className="pt-4 border-t border-white/5 text-[10px] text-white/30 flex items-start space-x-1 leading-normal font-sans">
        <span className="text-amber-500 font-extrabold mr-1 shrink-0">! NOTICE:</span>
        <span>Real video generation can later connect to Google Veo, Runway, Pika, Canva, Descript, or another video API. For now, this tool prepares the exact scripts, storyboard mapping, captions, multi-role cues and visual prompt generator.</span>
      </div>

    </div>
  );
}
