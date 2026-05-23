import React from 'react';
import { Sparkles, Radio, Mic2, Flame, Heart, Headphones } from 'lucide-react';
import { MixStyle, MixSettings } from '../types';

export const MIX_PRESETS: (MixStyle & { defaultSettings: MixSettings })[] = [
  {
    id: 'clean-rap',
    name: "Clean Rap Vocal",
    description: "Crisp and upfront focus on bars. Low room reverb, precise multi-band compression, and minor tuning stability.",
    category: 'Rap',
    tag: "Upfront & Punchy",
    intensityDefault: 70,
    defaultSettings: {
      vocalBrightness: 75,
      vocalWarmth: 40,
      autoTuneStrength: 25,
      reverbAmount: 18,
      delayAmount: 12,
      vocalLoudness: 82,
      compressionStrength: 75,
      masterLoudness: 85
    }
  },
  {
    id: 'melodic-rap',
    name: "Melodic Rap",
    description: "Modern synth-rap vocals. Wide stereo delay echoes, dense plate reverb, and snappy auto-pitch corrections.",
    category: 'Melodic',
    tag: "Echo & Tuned",
    intensityDefault: 80,
    defaultSettings: {
      vocalBrightness: 80,
      vocalWarmth: 50,
      autoTuneStrength: 85,
      reverbAmount: 55,
      delayAmount: 45,
      vocalLoudness: 78,
      compressionStrength: 65,
      masterLoudness: 82
    }
  },
  {
    id: 'rnb-smooth',
    name: "R&B Smooth",
    description: "Silky, warm vocal preamps. Intimate rooms, vintage tube warmth, and organic natural stabilization.",
    category: 'Singing' as any, // category helper
    tag: "Cozy & Warm",
    intensityDefault: 60,
    defaultSettings: {
      vocalBrightness: 55,
      vocalWarmth: 80,
      autoTuneStrength: 35,
      reverbAmount: 60,
      delayAmount: 30,
      vocalLoudness: 72,
      compressionStrength: 60,
      masterLoudness: 78
    }
  },
  {
    id: 'trap-autotune',
    name: "Trap / AutoTune Heavy",
    description: "Extreme pitch-quantized robotic locking. Loud saturation, long slapback echoes, and aggressive limiting.",
    category: 'Melodic',
    tag: "Robotic Scale Lock",
    intensityDefault: 95,
    defaultSettings: {
      vocalBrightness: 85,
      vocalWarmth: 45,
      autoTuneStrength: 100,
      reverbAmount: 40,
      delayAmount: 60,
      vocalLoudness: 85,
      compressionStrength: 80,
      masterLoudness: 90
    }
  },
  {
    id: 'drill-vocal',
    name: "Drill Vocal",
    description: "Engineered for heavy drill beats. Blazing high-shelf presence, ultra-fast limiters, and a dry mix that commands focus.",
    category: 'Rap',
    tag: "Harsh Drill Highs",
    intensityDefault: 90,
    defaultSettings: {
      vocalBrightness: 90,
      vocalWarmth: 35,
      autoTuneStrength: 45,
      reverbAmount: 15,
      delayAmount: 20,
      vocalLoudness: 85,
      compressionStrength: 85,
      masterLoudness: 88
    }
  },
  {
    id: 'pop-bright',
    name: "Pop Bright",
    description: "Billboard radio sheen. Wide spatial chorus backing, clear brilliant high-end, and radio limiters.",
    category: 'Pop',
    tag: "Prism Clarity",
    intensityDefault: 75,
    defaultSettings: {
      vocalBrightness: 92,
      vocalWarmth: 48,
      autoTuneStrength: 50,
      reverbAmount: 45,
      delayAmount: 35,
      vocalLoudness: 80,
      compressionStrength: 70,
      masterLoudness: 82
    }
  },
  {
    id: 'dark-underground',
    name: "Dark Underground",
    description: "Grungy low-fi tape saturation. Vintage analog preamps, dark vintage echo filters, and dense warm rooms.",
    category: 'Experimental',
    tag: "Grungy Low-fi",
    intensityDefault: 85,
    defaultSettings: {
      vocalBrightness: 45,
      vocalWarmth: 85,
      autoTuneStrength: 60,
      reverbAmount: 50,
      delayAmount: 55,
      vocalLoudness: 76,
      compressionStrength: 75,
      masterLoudness: 80
    }
  },
  {
    id: 'warm-emotional',
    name: "Warm Emotional",
    description: "Deep, soul-stirring ballads. Focuses heavily on chest resonance and intimate close-microphone saturation.",
    category: 'Singing' as any,
    tag: "Chest Depth",
    intensityDefault: 50,
    defaultSettings: {
      vocalBrightness: 48,
      vocalWarmth: 92,
      autoTuneStrength: 15,
      reverbAmount: 65,
      delayAmount: 25,
      vocalLoudness: 70,
      compressionStrength: 55,
      masterLoudness: 75
    }
  },
  {
    id: 'natural-vocal',
    name: "Natural Vocal",
    description: "Authentic studio mastering. Minor surgical EQ balance and gentle dynamics adjustment. Free of heavy effects.",
    category: 'Experimental',
    tag: "Organic Pure",
    intensityDefault: 40,
    defaultSettings: {
      vocalBrightness: 60,
      vocalWarmth: 55,
      autoTuneStrength: 10,
      reverbAmount: 20,
      delayAmount: 10,
      vocalLoudness: 75,
      compressionStrength: 50,
      masterLoudness: 78
    }
  },
  {
    id: 'radio-ready',
    name: "Radio Ready",
    description: "Golden ratio spectrum balance. Modern excitation, automatic de-essing, side-chain ducks, and maximum loud limit.",
    category: 'Pop',
    tag: "Commercial Standard",
    intensityDefault: 85,
    defaultSettings: {
      vocalBrightness: 80,
      vocalWarmth: 55,
      autoTuneStrength: 60,
      reverbAmount: 32,
      delayAmount: 28,
      vocalLoudness: 83,
      compressionStrength: 75,
      masterLoudness: 86
    }
  }
];

interface StyleSelectorProps {
  selectedId: string;
  onSelect: (preset: typeof MIX_PRESETS[0]) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export default function StyleSelector({
  selectedId,
  onSelect,
  selectedCategory,
  setSelectedCategory
}: StyleSelectorProps) {
  const categories = ['All', 'Rap', 'Melodic', 'Singing', 'Pop', 'Experimental'];

  const filteredPresets = selectedCategory === 'All'
    ? MIX_PRESETS
    : MIX_PRESETS.filter(p => p.category === selectedCategory || (selectedCategory === 'Singing' && p.id.includes('vocal-warmth') || p.id.includes('rnb')));

  // Map icons to preset ID
  const getIcon = (id: string) => {
    switch (id) {
      case 'trap-autotune': return Flame;
      case 'melodic-rap': return Sparkles;
      case 'rnb-smooth': return Heart;
      case 'radio-ready': return Radio;
      case 'pop-bright': return Mic2;
      default: return Headphones;
    }
  };

  return (
    <div className="space-y-4" id="style-selector-module">
      
      {/* Category Tab Selector */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-white/10 pb-3" id="style-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            id={`tab-style-${cat.toLowerCase()}`}
            className={`rounded-lg px-3 py-1.5 font-display text-xs font-medium transition-colors border ${
              selectedCategory === cat
                ? 'bg-brand-green/10 text-brand-green border-brand-green/30 studio-glow-green'
                : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Style Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="presets-grid">
        {filteredPresets.map((preset) => {
          const Icon = getIcon(preset.id);
          const isSelected = selectedId === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => onSelect(preset)}
              id={`preset-card-${preset.id}`}
              className={`relative flex flex-col justify-between rounded-xl p-4 cursor-pointer text-left transition-all duration-200 border group ${
                isSelected
                  ? 'bg-white/5 border-brand-green studio-glow-green'
                  : 'bg-white/[0.01] border-white/5 hover:border-white/15 hover:bg-white/[0.03]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-brand-green text-black font-sans text-[9px] font-extrabold shadow-sm">
                  ✓
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-lg border transition-colors ${isSelected ? 'bg-brand-green/15 border-brand-green/30 text-brand-green' : 'bg-black border-white/10 text-white/40 group-hover:text-white'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className="font-display text-xs font-bold text-white/90">{preset.name}</h4>
                </div>
                
                <p className="font-sans text-[11px] text-white/60 leading-normal pr-4">
                  {preset.description}
                </p>
              </div>

              {/* Tag metadata row */}
              <div className="mt-4 flex items-center justify-between">
                <span className="rounded bg-black border border-white/10 px-2 py-0.5 font-mono text-[9px] text-white/50 tracking-tight uppercase">
                  {preset.tag}
                </span>
                <span className="font-mono text-[9px] text-white/30">
                  Int. target: {preset.intensityDefault}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
