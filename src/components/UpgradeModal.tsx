import React from 'react';
import { Sparkles, Trophy, Check, ArrowRight, X, Headphones, Layers, Flame, Mic2 } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (productId: 'single_mix_20' | 'mastering_only_10' | 'artist_monthly_75' | 'pro_artist') => void;
  proArtistPriceDisplay: string;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  onSelectOption,
  proArtistPriceDisplay
}: UpgradeModalProps) {
  if (!isOpen) return null;

  const pathways = [
    {
      id: 'single_mix_20',
      title: 'Buy Single Mix',
      price: '$20',
      duration: 'one-time',
      icon: <Layers className="h-5 w-5 text-brand-green" />,
      description: 'Provides 1 mix session credit. Perfect for finishing one vocal track.',
      colorClass: 'border-brand-green/20 hover:border-brand-green/70 bg-[#0A0A0A]'
    },
    {
      id: 'mastering_only_10',
      title: 'Buy Mastering Only',
      price: '$10',
      duration: 'one-time',
      icon: <Headphones className="h-5 w-5 text-brand-pink" />,
      description: 'Provides 1 mastering session credit. For pre-balanced finished tracks.',
      colorClass: 'border-brand-pink/20 hover:border-brand-pink/70 bg-[#0A0A0A]'
    },
    {
      id: 'artist_monthly_75',
      title: 'Artist Monthly Sub',
      price: '$75',
      duration: 'month',
      icon: <Sparkles className="h-5 w-5 text-brand-cyan" />,
      description: 'Best for active creators. Includes 15 mixes per month + WAV lossless downloads + mastering access.',
      colorClass: 'border-brand-cyan/25 hover:border-brand-cyan/80 bg-white/[0.01]'
    },
    {
      id: 'pro_artist',
      title: 'Pro Artist Sub',
      price: 'Pro Unlimited',
      duration: proArtistPriceDisplay,
      icon: <Flame className="h-5 w-5 text-purple-400" />,
      description: 'Ultimate freedom for home studios. Unlimited access, Saves custom presets & WAV 24-bit Pro output.',
      colorClass: 'border-purple-500/20 hover:border-purple-400 bg-[#0A0A0A]'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fadeIn" id="quota-upgrade-modal-view">
      <div className="w-full max-w-lg rounded-2xl bg-black border border-white/10 p-6 md:p-8 space-y-6 relative text-left">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
          <X className="h-4 w-4" />
        </button>

        {/* Head */}
        <div className="space-y-1.5 pr-6">
          <span className="font-mono text-3xs font-bold uppercase tracking-widest text-[#f97316] flex items-center gap-1.5">
            <Trophy className="h-4.5 w-4.5 text-yellow-500" />
            <span>Quota Balance Replenishment</span>
          </span>
          <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">Need More Session Room?</h3>
          <p className="font-sans text-xs text-white/50 leading-relaxed">
            Choose whether to reload immediate credits or subscribe to release-unlimited active artist tiers.
          </p>
        </div>

        {/* Comparison Alert warning disclaimers */}
        <div className="rounded-xl border border-white/5 bg-white/[0.01] p-3 text-2xs text-white/50 leading-normal font-sans">
          Mixing is for songs that need vocals balanced with the beat. Mastering is for songs that are already mixed and need final loudness, polish, and release-ready consistency.
        </div>

        {/* Pathways Stack */}
        <div className="grid grid-cols-1 gap-3.5">
          {pathways.map((path) => (
            <button
              key={path.id}
              onClick={() => onSelectOption(path.id as any)}
              id={`upgrade-choice-${path.id}`}
              className={`rounded-xl border p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all text-left duration-200 hover:scale-101 select-none ${path.colorClass}`}
            >
              <div className="flex items-start space-x-3.5">
                <div className="flex p-2.5 rounded-lg bg-black border border-white/10 shrink-0 mt-0.5">
                  {path.icon}
                </div>
                <div>
                  <h4 className="font-display text-xs font-bold text-white flex items-center space-x-2">
                    <span>{path.title}</span>
                  </h4>
                  <p className="font-sans text-3xs text-white/45 mt-0.5 leading-snug max-w-xs">{path.description}</p>
                </div>
              </div>

              <div className="flex sm:flex-col items-baseline sm:items-end shrink-0 gap-1 sm:gap-0">
                <span className="font-display text-sm font-black text-white">{path.price}</span>
                <span className="font-sans text-4xs text-white/30 truncate">/{path.duration}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Disclaimer Results Footer */}
        <div className="border-t border-white/5 pt-4">
          <p className="font-sans text-4xs text-white/30 uppercase text-center tracking-widest leading-normal">
            Results may vary based on recordings quality • Better recordings create better mixes
          </p>
        </div>

      </div>
    </div>
  );
}
