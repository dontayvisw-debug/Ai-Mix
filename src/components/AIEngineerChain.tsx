import React, { useState } from 'react';
import { Layers, ListTodo, Activity, Disc, Sparkles, Check, Cpu } from 'lucide-react';

interface ChainStep {
  id: string;
  name: string;
  domain: string;
  description: string;
}

const chainSteps: ChainStep[] = [
  { id: "1", name: "Noise Cleanup", domain: "Analog noise gating & background attenuation.", description: "Detects pauses in vocals to clamp down on fan, microphone, and ambient floor noises." },
  { id: "2", name: "Pitch Correction", domain: "Automatic pitch correction & key alignment.", description: "Locks lead performances into the detected or selected key using quantized pitch correction algorithms." },
  { id: "3", name: "Subtractive EQ", domain: "Phase-coherent resonant peak reduction.", description: "Cuts muddy low-end frequencies under 90Hz and attenuates boxy room build-ups." },
  { id: "4", name: "De-essing", domain: "High-frequency sibilance limiter compression.", description: "Intelligent compression gating targeting the 4kHz to 8kHz sibilant harshness peaks." },
  { id: "5", name: "Compression", domain: "Transient optical levelling & volume smoothing.", description: "Applies two stages of optical & VCA-style compression to lock track levels forward." },
  { id: "6", name: "Tone Shaping EQ", domain: "Dynamic midrange carving & high-shelf lift.", description: "Adds commercial presence air (12kHz boost) and thickens core body vocal notes." },
  { id: "7", name: "Saturation", domain: "Tube, Tape & Transformer harmonic excite.", description: "Introduces rich analog warmth and dense distortion transients for vocal grit." },
  { id: "8", name: "Parallel Compression", domain: "Shattered parallel compression mixing.", description: "Pours absolute energy and edge back into vocal transients by blending crushed bus feeds." },
  { id: "9", name: "Reverb", domain: "Spatial lush plate & stereo acoustic hall modeling.", description: "Simulates complex reflections designed around modern hip-hop and rap vocal spacing." },
  { id: "10", name: "Delay", domain: "BPM-locked echo reflection ping-pong delay.", description: "Creates modern musical feedback trails synced strictly to the project BPM intervals." },
  { id: "11", name: "Vocal Widening", domain: "Haas effect micro-pitch delay expanders.", description: "Spreads double vocals and background adlibs wide across the extreme stereo channels." },
  { id: "12", name: "Final Vocal Limiter", domain: "Independent brickwall vocal level optimization.", description: "Guarantees absolutely zero digital clipping on stems while forcing maximum density." },
  { id: "13", name: "Beat / Vocal Balance", domain: "2-track active frequency ducking balance.", description: "Ducks busy mid-range beat layers by 1.5dB only when vocals sing, creating space." },
  { id: "14", name: "Mastering Polish", domain: "Stereo bus peak compression & limiter loudness.", description: "Finalizes output loudness optimizing average peak targets to hit streaming readiness." }
];

export default function AIEngineerChain() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="bg-[#090909] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 text-left" id="ai-engineer-chain-root">
      
      {/* Chain header details */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <span className="font-mono text-3xs font-extrabold text-brand-pink uppercase tracking-widest flex items-center space-x-1">
            <Cpu className="h-3.5 w-3.5" />
            <span>mixedbytae Processing Pipeline</span>
          </span>
          <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">mixedbytae Vocal Chain</h4>
        </div>
        <p className="font-sans text-[11px] text-white/40 max-w-md leading-relaxed">
          Built around modern major-label mixing principles used in today’s rap, R&B, trap, and melodic vocal production.
        </p>
      </div>

      {/* Visual interactive flow grids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5" id="chain-steps-grid">
        {chainSteps.map((step, index) => {
          const isHovered = hoveredIdx === index;
          return (
            <div
              key={step.id}
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`p-4 rounded-xl border transition-all duration-200 text-left relative overflow-hidden ${
                isHovered
                  ? 'bg-brand-cyan/5 border-brand-cyan/40 scale-[1.01] shadow-md shadow-brand-cyan/5'
                  : 'bg-black border-white/5'
              }`}
              id={`chain-step-card-${step.id}`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
                <span className="font-mono text-3xs font-bold text-white/40">STEP {step.id.padStart(2, '0')}</span>
                <span className="h-4.5 w-4.5 rounded-full bg-brand-green/10 border border-brand-green/30 text-brand-green flex items-center justify-center font-mono text-4xs font-bold font-sans">
                  <Check className="h-2.5 w-2.5" />
                </span>
              </div>
              
              <h5 className="font-display text-xs font-black text-white/90 uppercase tracking-wide truncate">{step.name}</h5>
              <span className="font-mono text-[9px] text-[#10b981] block mt-0.5 uppercase tracking-wide leading-tight truncate">{step.domain}</span>
              <p className="font-sans text-[10px] text-white/40 mt-1.5 leading-relaxed">
                {step.description}
              </p>

              {/* Watermark indices */}
              <div className="absolute right-2 bottom-0 text-white/2 font-mono text-[36px] font-black pointer-events-none select-none">
                {step.id}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
