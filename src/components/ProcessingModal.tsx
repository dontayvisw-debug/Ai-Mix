import React, { useEffect, useState } from 'react';
import { Sparkles, Terminal, Activity, HelpCircle, CheckCircle } from 'lucide-react';

interface ProcessingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  presetName: string;
  hasReference?: boolean;
  isDemo?: boolean;
}

const STAGES = [
  "Analyzing vocal dynamic range and sample rate",
  "Detecting rhythm patterns and instrumental energy",
  "Cleaning microphone noise and low-end room hum",
  "Side-chain docking and vocal-over-beat compression balance",
  "Applying custom harmonic style saturation layers",
  "Calculating matching spectral EQ vectors from reference song",
  "Mastering final multi-band spectrum ceiling",
  "Rendering lossless web preview buffer nodes"
];

const DEMO_STAGES = [
  "Reading uploaded audio files",
  "Organizing lead vocal, double, dubs, adlibs, and instrumental",
  "Confirming 2-track instrumental",
  "Detecting BPM and key",
  "Setting pitch correction to F# minor",
  "Cleaning lead vocal",
  "Aligning doubles and dubs",
  "Balancing adlibs behind the lead",
  "Applying modern vocal chain",
  "Syncing delay to 77 BPM",
  "Balancing vocals with the 2-track instrumental",
  "Creating mixedbytae mix preview",
  "Applying mastering polish",
  "Preparing MP3 and WAV exports"
];

const LOG_TEMPLATES: Record<number, string[]> = {
  0: [
    "SYS: Mapping dry vocal sample buffer...",
    "VOX: Sample rate 48000Hz, bit rate 24-bit PCM",
    "VOX: Detecting crest factor... -22.4dB average level",
    "VOX: Sibilance analysis... 6.4kHz peak detected"
  ],
  1: [
    "SYS: Streaming 2-track audio spectrum...",
    "BEAT: BPM calculated at 142.5 - Drill signature",
    "BEAT: Sub-bass energy peaking at 48Hz with strong 808 transient",
    "BEAT: Sideband spatial width matched to standard stereo array"
  ],
  2: [
    "DSP: Launching spectral gate algorithm...",
    "DSP: Suppressed -18dB room AC rumble below 80Hz",
    "DSP: De-essing sweep... 5.5dB attenuation on harsh 'S' plosives",
    "DSP: Static phase offset aligned correctly"
  ],
  3: [
    "DSP: Initiating side-chain compression ducks...",
    "DSP: Carving 350Hz muddy frequencies in beat to host vocal throat frequencies",
    "DSP: Fast peaks limited with 4ms attack time",
    "DSP: Level matched within -2.4dB headroom margins"
  ],
  4: [
    "AMP: Loading styled analog tube profiles...",
    "AMP: Applied second-harmonic tube heater warmth (+2.4%)",
    "AMP: Implemented modern air excitation curve above 10kHz",
    "AMP: Wide plate spatial reverb matrix sent"
  ],
  5: [
    "REF: Fingerprinting acoustic reference profile...",
    "REF: Matched high shelf brightness and stereo panning values",
    "REF: Equalized mid-presence to model -9.5 LUFS targeted response",
    "REF: Low-end bass limits compensated"
  ],
  6: [
    "SYS: Driving mastering bricks-wall limiter...",
    "MASTER: Ceiling limited to -1.0dBTP conformities",
    "MASTER: Competitive streaming loudness balanced to -14.0 LUFS",
    "MASTER: Dithering noise shape filter added"
  ],
  7: [
    "SYS: Bundling stereophonic preview files...",
    "SYS: Mastered MP3 preview ready",
    "SYS: High-definition WAV backup rendered successfully",
    "COMPLETED: Job completed in 12.4s. Master finalized."
  ]
};

const DEMO_LOG_TEMPLATES: Record<number, string[]> = {
  0: ["SYS: Accessing loaded audio buffers...", "FILE: Checked lead-1.mp3", "FILE: Checked lead-2.mp3", "FILE: Checked libs.mp3", "FILE: Checked dub.mp3", "FILE: Checked mix-this-77-bpm-2track-instrumental.mp3"],
  1: ["AI: Grouping files by acoustic characteristics...", "SUCCESS: Found 4 dry vocal components and 1 stereo beat track.", "MAPPED: lead-1.mp3 -> Lead Vocal", "MAPPED: lead-2.mp3 -> Vocal Double"],
  2: ["GRID: Analyzing stereo beat transients...", "SUCCESS: Base instrumental matched successfully.", "NOTED: mix-this-77-bpm-2track-instrumental.mp3 is confirmed beat."],
  3: ["FFT: Analyzing vocal peaks... BPM: 77 detected, Scale: F# minor detected."],
  4: ["AUTOTUNE: Scaling vocal notes... Centering to F# minor scale. Retune speed 20ms.", "TUNING: pitchCorrectionMode set of Modern Clean"],
  5: ["EQ: Running high-pass sweep & vocal room cleaning... Muddy areas below 95Hz scoped out."],
  6: ["ALIGN: Syncing dub and double phases to main vocal bus... Double alignment locked."],
  7: ["LEVEL: Setting adlib volume offsets... Wider field (+30%) and tucked -6.5dB tail."],
  8: ["COMPRESSION: Running optical dual-stage compressor and dynamic EQ on lead vocal."],
  9: ["ECHO: Calculating tempo delay trails to 77 BPM intervals (779ms delay offset)."],
  10: ["DSP: Balancing relative vocal frequencies with beat matrix side-band loops."],
  11: ["RENDER: Creating 320kbps mixedbytae mix preview buffer."],
  12: ["MASTER: Running dynamic multiband limiter to force volume to -14.0 LUFS threshold."],
  13: ["SUCCESS: Consolidated MP3 and high-fidelity 48kHz WAV exports ready for download!"]
};

export default function ProcessingModal({
  isOpen,
  onComplete,
  presetName,
  hasReference = false,
  isDemo = false
}: ProcessingModalProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const activeStages = isDemo ? DEMO_STAGES : STAGES;
  const activeLogTemplates = isDemo ? DEMO_LOG_TEMPLATES : LOG_TEMPLATES;

  useEffect(() => {
    if (!isOpen) return;

    // Reset details
    setCurrentStageIndex(0);
    setPercentage(0);
    setLogs([`[SYSTEM START]: Initializing mixedbytae Cloud-Mixing Node ${isDemo ? '(RUNNING 77 BPM DEMO SESSION)' : ''}`]);

    const totalSeconds = isDemo ? 14 : 12; // 14 stages for demo
    const intervalMs = 150;
    const totalTicks = (totalSeconds * 1000) / intervalMs;
    let ticks = 0;

    const interval = setInterval(() => {
      ticks++;
      const currentPct = Math.min(100, Math.floor((ticks / totalTicks) * 100));
      setPercentage(currentPct);

      // Determine active stage
      const stageIdx = Math.min(
        activeStages.length - 1,
        Math.floor((currentPct / 100) * activeStages.length)
      );
      
      setCurrentStageIndex((prevIdx) => {
        if (prevIdx !== stageIdx) {
          // Changed stage! Add standard logs
          const newLogs = activeLogTemplates[stageIdx] || [];
          setLogs((prevLogs) => [
            ...prevLogs,
            `>>> [STAGE ${stageIdx + 1}]: ${activeStages[stageIdx].toUpperCase()}`,
            ...newLogs.map(l => `  ${l}`)
          ]);
          return stageIdx;
        }
        return prevIdx;
      });

      // Periodically inject a randomly timed sub logs for visual flare
      if (ticks % 7 === 0 && currentPct < 98) {
        setLogs((prevLogs) => [
          ...prevLogs,
          `  [MONITOR]: DSP load balanced • Latency: 4.2ms • Frame rate sync validated`
        ]);
      }

      if (currentPct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 1200); // short pause at 100% for completeness satisfaction
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isOpen, isDemo]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fadeIn" id="processing-overlay">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0A0A0A] border border-white/10 shadow-3xl p-6 md:p-8 space-y-6" id="processing-box">
        
        {/* Header Title with Spinner */}
        <div className="flex items-center space-x-4">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green shadow-inner border border-brand-green/20">
            <Activity className="h-6 w-6 animate-pulse" />
            <span className="absolute inset-0 rounded-xl border-2 border-brand-green/30 border-t-transparent animate-spin"></span>
          </div>
          <div>
            <span className="font-mono text-2xs uppercase text-white/30">MOCK CLOUD PROCESSOR // ACTIVE JOB</span>
            <h2 className="font-display text-xl font-bold text-white tracking-tight mt-0.5">
              {isDemo ? "Rendering 77 BPM Vocal masterclass..." : `Refining Your Sound via ${presetName}`}
            </h2>
          </div>
        </div>

        {/* Big visual progress percentage indicator */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-4 flex flex-col justify-center items-center md:items-start p-4 rounded-xl bg-black border border-white/10">
            <span className="font-mono text-5xl font-extrabold text-brand-green tracking-tight">{percentage}%</span>
            <span className="font-mono text-[9px] uppercase text-white/30 tracking-wider mt-1.5">Processing Master Buffer</span>
          </div>

          <div className="md:col-span-8 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-display font-semibold text-white/80">Active Task:</span>
              <span className="font-mono text-white/40">Stage {currentStageIndex + 1} of {activeStages.length}</span>
            </div>
            <p className="font-sans text-xs text-brand-cyan font-medium animate-pulse">
              {activeStages[currentStageIndex]}...
            </p>

            {/* Glowing active progress bar */}
            <div className="w-full h-2.5 bg-black rounded-full overflow-hidden border border-white/10 p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-brand-cyan to-brand-green rounded-full shadow-lg studio-glow-green" 
                style={{ width: `${percentage}%`, transition: 'width 0.15s ease' }}
              />
            </div>
          </div>

        </div>

        {/* Interactive Virtual Logger Terminal Console */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-white/30 font-mono">
            <Terminal className="h-4 w-4" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Console telemetry logs // stdout</span>
          </div>
          
          <div className="h-48 rounded-xl bg-black border border-white/10 p-4 font-mono text-[10px] text-emerald-400 overflow-y-auto space-y-1.5 scrollbar-thin select-all" id="terminal-screen">
            {logs.map((log, i) => (
              <div key={i} className="leading-relaxed hover:bg-white/5 p-0.5 rounded transition-all">
                {log}
              </div>
            ))}
            <div className="h-1 w-full animate-pulse bg-emerald-400/20 rounded"></div>
          </div>
        </div>

        {/* Footer info warning */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-center">
          <p className="font-sans text-[10px] text-white/30 max-w-lg mx-auto">
            Please stay on this page. Audio rendering runs concurrently on our server farms. Average job speed completes within 15 seconds.
          </p>
        </div>

      </div>
    </div>
  );
}
