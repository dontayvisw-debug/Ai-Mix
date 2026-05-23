import React, { useState, useEffect } from 'react';
import { Sparkles, Music, Activity, Disc, CheckSquare, Layers, AlertCircle } from 'lucide-react';
import { AudioAnalyzerService } from '../utils/audioService';
import { TrackAnalysis } from '../utils/aiEngineerBrain';

interface AIEngineerAnalysisProps {
  analysis?: TrackAnalysis;
}

export default function AIEngineerAnalysis(props: AIEngineerAnalysisProps) {
  const [analysis, setAnalysis] = useState<TrackAnalysis | null>(props.analysis || null);
  const [loading, setLoading] = useState(!props.analysis);

  useEffect(() => {
    if (!props.analysis) {
      // Simulate real-time fetch on mount
      AudioAnalyzerService.analyze('vocal.wav', 'beat.mp3').then(res => {
        setAnalysis(res);
        setLoading(false);
      });
    }
  }, [props.analysis]);

  if (loading || !analysis) {
    return (
      <div className="bg-[#090909] border border-white/5 rounded-2xl p-6 sm:p-7 space-y-6 text-left flex items-center justify-center min-h-[300px]">
        <span className="font-mono text-3xs font-bold text-white/50 uppercase tracking-widest animate-pulse">Running Audio AI Analysis...</span>
      </div>
    );
  }

  return (
    <div className="bg-[#090909] border border-white/5 rounded-2xl p-6 sm:p-7 space-y-6 text-left" id="ai-engineer-analysis-wrapper">
      
      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-2">
        <div className="space-y-1">
          <span className="font-mono text-3xs font-extrabold text-brand-pink uppercase tracking-widest flex items-center space-x-1">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>Voice DNA Analysis</span>
          </span>
          <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">mixedbytae Voice Analysis</h4>
          <p className="font-sans text-xs text-white/50">Every voice is different. mixedbytae analyzes your vocal tone, energy, recording quality, and style to build a mix that fits you.</p>
        </div>
        <div className="font-mono text-3xs text-white/30 border border-white/10 px-2.5 py-1 rounded-lg self-start sm:self-center">
          {analysis.bpm} BPM | {analysis.key}
        </div>
      </div>

      {/* Grid of UI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4" id="ai-analysis-cards-grid">
        
        <div className="p-4 bg-black rounded-xl border border-white/5 space-y-1 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider block">Tone</span>
          <div className="pt-1 font-mono text-xs font-bold text-[#10b981] capitalize">
            {analysis.tone}
          </div>
        </div>

        <div className="p-4 bg-black rounded-xl border border-white/5 space-y-1 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider block">Delivery</span>
          <div className="pt-1 font-mono text-xs font-bold text-white/80 capitalize">
            {analysis.deliveryStyle}
          </div>
        </div>

        <div className="p-4 bg-black rounded-xl border border-white/5 space-y-1 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider block">Quality</span>
          <div className="pt-1 font-mono text-xs font-bold text-white/80 capitalize">
            {analysis.recordingQuality}
          </div>
        </div>

        <div className="p-4 bg-black rounded-xl border border-white/5 space-y-1 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-brand-pink opacity-10 w-16 h-16 rounded-full blur-xl group-hover:opacity-20 transition-opacity"></div>
          <span className="text-[10px] font-mono text-brand-pink uppercase tracking-wider block relative z-10 flex items-center space-x-1.5">
            <Layers className="h-3 w-3" />
            <span>Starting Point</span>
          </span>
          <div className="pt-1 font-mono text-xs font-bold text-white relative z-10">
            {analysis.recommendedChain || (analysis.genre.includes('Trap') ? 'Melodic Trap Tune' : 'R&B Smooth')}
          </div>
        </div>

      </div>

      <div className="p-4 bg-black rounded-xl border border-white/5 space-y-1.5 col-span-1 sm:col-span-2 mt-4">
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider block">Custom Mix Direction</span>
        <p className="font-sans text-xs text-white/80 font-semibold leading-snug">
          mixedbytae detected a {analysis.tone} {analysis.deliveryStyle} vocal with {analysis.roomEcho} room echo and {analysis.pitchStability}. The mix was shaped to keep your natural tone while adding clarity, pitch control, vocal balance, and polished delay.
        </p>
        <p className="font-sans text-4xs text-brand-pink/70 mt-3 font-mono uppercase tracking-widest">
          Presets are only starting points. mixedbytae adjusts them based on your actual voice.
        </p>
      </div>

      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl font-mono text-4xs text-right text-white/35 flex justify-between">
         <span>Target: -14.0 LUFS Master</span>
         <span>mixedbytae AI Engineer System Active</span>
      </div>

    </div>
  );
}
