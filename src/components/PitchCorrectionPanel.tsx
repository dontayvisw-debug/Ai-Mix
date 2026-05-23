import React from 'react';
import { Activity, Radio, HelpCircle, Check, Settings2 } from 'lucide-react';

export type PitchCorrectionMode = 
  | 'off'
  | 'natural'
  | 'modern_clean'
  | 'heavy_melodic'
  | 'trap_hard'
  | 'robotic';

interface PitchCorrectionPanelProps {
  currentMode: PitchCorrectionMode;
  onModeChange: (mode: PitchCorrectionMode) => void;
  songKey: string;
  onKeyChange: (key: string) => void;
  bpm: number;
  onBpmChange: (bpm: number) => void;
  retuneSpeed: string;
  onRetuneSpeedChange: (speed: string) => void;
  humanize: string;
  onHumanizeChange: (val: string) => void;
}

export const PITCH_PRESET_OPTIONS: { value: PitchCorrectionMode; label: string; artistLabel: string; desc: string }[] = [
  { value: 'off', label: 'Off', artistLabel: 'No Tune', desc: 'Bypasses the pitch correction module entirely.' },
  { value: 'natural', label: 'Natural', artistLabel: 'Light Tune', desc: 'Transparent smoothing of slight vocal imperfections.' },
  { value: 'modern_clean', label: 'Modern Clean', artistLabel: 'Clean Tune', desc: 'Slightly faster retuning for a crisp, locked-in chart vocal.' },
  { value: 'heavy_melodic', label: 'Heavy Melodic', artistLabel: 'Heavy Tune', desc: 'Distinct quantizing for melodic hip-hop and trap singers.' },
  { value: 'trap_hard', label: 'Trap Hard Tune', artistLabel: 'Trap Hard Tune', desc: 'Distinct snappy hard-tuning effect with zero retune delay.' },
  { value: 'robotic', label: 'Robotic Tune', artistLabel: 'Robotic Tune', desc: 'Continuous strict vocoder-like modulation.' },
];

export default function PitchCorrectionPanel({
  currentMode,
  onModeChange,
  songKey,
  onKeyChange,
  bpm,
  onBpmChange,
  retuneSpeed,
  onRetuneSpeedChange,
  humanize,
  onHumanizeChange
}: PitchCorrectionPanelProps) {
  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 sm:p-7 text-left space-y-6" id="pitch-correction-panel">
      
      {/* Header element */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <span className="font-mono text-3xs font-extrabold text-brand-cyan uppercase tracking-widest flex items-center space-x-1">
            <Radio className="h-3.5 w-3.5 text-brand-cyan shrink-0 animate-pulse" />
            <span>AI AutoTune-Style module</span>
          </span>
          <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">Acoustic Pitch Correction Controls</h4>
        </div>
        <p className="font-sans text-[10px] text-white/40 max-w-xs leading-normal">
          Pitch correction works best when the song key is correct and the vocal performance is clean.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Preset list selector left */}
        <div className="md:col-span-7 space-y-3">
          <label className="font-display text-2xs font-extrabold uppercase tracking-wider text-white/50 block">Select Pitch Preset</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PITCH_PRESET_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onModeChange(opt.value)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between h-[100px] ${
                  currentMode === opt.value
                    ? 'bg-brand-cyan/5 border-brand-cyan shadow-[0_0_12px_rgba(34,211,238,0.15)] text-white'
                    : 'bg-black border-white/5 hover:border-white/20 text-white/60 hover:text-white'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-display text-[11px] font-black uppercase tracking-wide">{opt.label}</span>
                  <span className="font-mono text-[9px] text-[#10b981] uppercase font-bold bg-brand-green/10 border border-brand-green/20 px-1.5 py-0.5 rounded-md">
                    {opt.artistLabel}
                  </span>
                </div>
                <p className="font-sans text-[10px] text-white/40 leading-snug mt-1 flex-grow shrink-0">
                  {opt.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Micro adjust values right */}
        <div className="md:col-span-5 space-y-5">
          <label className="font-display text-2xs font-extrabold uppercase tracking-wider text-white/50 block">Pitch Manual Calibration</label>

          <div className="space-y-4 rounded-xl bg-white/[0.01] border border-white/5 p-4.5">
            
            {/* Key select */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-[10px] text-white/50 uppercase font-bold">
                <span>Manual Scale Key Override</span>
                <span className="text-brand-cyan">{songKey}</span>
              </div>
              <select
                value={songKey}
                onChange={(e) => onKeyChange(e.target.value)}
                className="bg-black border border-white/10 rounded-xl px-2.5 py-1.5 font-mono text-[11px] outline-none text-white w-full"
              >
                <option value="F# minor">F# minor (Default Demo Key)</option>
                <option value="A major">A major</option>
                <option value="C minor">C minor</option>
                <option value="G minor">G minor</option>
                <option value="D major">D major</option>
                <option value="E minor">E minor</option>
              </select>
            </div>

            {/* Retune speed slider representation */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-[10px] text-white/50 uppercase font-bold">
                <span>Retune Speed</span>
                <span className="text-brand-cyan">{retuneSpeed}</span>
              </div>
              <select
                value={retuneSpeed}
                onChange={(e) => onRetuneSpeedChange(e.target.value)}
                className="bg-black border border-white/10 rounded-xl px-2.5 py-1.5 font-mono text-[11px] outline-none text-white w-full"
              >
                <option value="fast (0ms)">Fast (0ms - Heavy AutoTune)</option>
                <option value="medium-fast">Medium-fast (Recommended)</option>
                <option value="medium">Medium (Natural adjustment)</option>
                <option value="slow">Slow (Gentle glide)</option>
              </select>
            </div>

            {/* Humanize slider representation */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-[10px] text-white/50 uppercase font-bold">
                <span>Humanize strength</span>
                <span className="text-brand-cyan">{humanize}</span>
              </div>
              <select
                value={humanize}
                onChange={(e) => onHumanizeChange(e.target.value)}
                className="bg-black border border-white/10 rounded-xl px-2.5 py-1.5 font-mono text-[11px] outline-none text-white w-full"
              >
                <option value="low">Low (Strict tune accuracy)</option>
                <option value="medium">Medium (Standard Balance)</option>
                <option value="high">High (Maximum performance warmth)</option>
              </select>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
