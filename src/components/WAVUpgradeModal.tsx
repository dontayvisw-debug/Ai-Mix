import React from 'react';
import { Sparkles, X, ShieldAlert, Award, FileAudio, ArrowRight } from 'lucide-react';

interface WAVUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeToMonthly: () => void;
  onUpgradeToPro: () => void;
  onBuyWavAddon: () => void;
}

export default function WAVUpgradeModal({
  isOpen,
  onClose,
  onUpgradeToMonthly,
  onUpgradeToPro,
  onBuyWavAddon
}: WAVUpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fadeIn" id="wav-upgrade-modal-holder">
      <div className="w-full max-w-md rounded-2xl bg-black border border-white/10 p-6 md:p-8 space-y-6 relative text-left">
        
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
          <X className="h-4 w-4" />
        </button>

        {/* Head */}
        <div className="space-y-1">
          <span className="font-mono text-3xs font-bold uppercase tracking-widest text-[#f97316] flex items-center gap-1.5">
            <Award className="h-4.5 w-4.5 text-brand-green" />
            <span>Format License Upgrade</span>
          </span>
          <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight">Unlock Lossless WAV Exports</h3>
          <p className="font-sans text-xs text-white/50 leading-relaxed">
            Lossless audio formats distribute premium frequency fidelity, releasing competitive tracks to major streaming services.
          </p>
        </div>

        {/* Option pathways stack */}
        <div className="space-y-3.5 pt-2">
          
          {/* Option 1: Buy add-on */}
          <button
            onClick={onBuyWavAddon}
            id="buy-wav-addon-btn"
            className="w-full rounded-xl border border-brand-green/20 bg-brand-green/[0.01] hover:bg-brand-green/[0.04] p-4 text-left flex justify-between items-center transition-colors hover:scale-101"
          >
            <div className="space-y-0.5 max-w-[280px]">
              <h5 className="font-display text-xs font-bold text-[#f97316]">Add WAV Export Upgrade</h5>
              <p className="font-sans text-3xs text-white/50 leading-snug">
                One-time unlock of 48kHz lossless depth files of this specific mix or master file.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="font-display text-xs font-black text-white">$10</span>
              <span className="font-mono text-4xs uppercase text-white/30 block">one-time</span>
            </div>
          </button>

          {/* Option 2: Go to Artist Monthly */}
          <button
            onClick={onUpgradeToMonthly}
            id="upgrade-to-artist-monthly-btn"
            className="w-full rounded-xl border border-brand-cyan/25 bg-brand-cyan/[0.01] hover:bg-brand-cyan/[0.04] p-4 text-left flex justify-between items-center transition-colors hover:scale-101"
          >
            <div className="space-y-0.5 max-w-[280px]">
              <h5 className="font-display text-xs font-bold text-brand-cyan">Upgrade to Artist Monthly</h5>
              <p className="font-sans text-3xs text-white/50 leading-snug">
                Unlocks 15 monthly mixing sessions, mastering access, and infinite WAV 48kHz lossless downloads.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="font-display text-xs font-black text-white">$75</span>
              <span className="font-mono text-4xs uppercase text-white/30 block">/month</span>
            </div>
          </button>

          {/* Option 3: Go to Pro Artist */}
          <button
            onClick={onUpgradeToPro}
            id="upgrade-to-pro-artist-btn"
            className="w-full rounded-xl border border-purple-500/25 bg-purple-500/[0.01] hover:bg-purple-500/[0.04] p-4 text-left flex justify-between items-center transition-colors hover:scale-101"
          >
            <div className="space-y-0.5 max-w-[280px]">
              <h5 className="font-display text-xs font-bold text-purple-400">Upgrade to Pro Artist</h5>
              <p className="font-sans text-3xs text-white/50 leading-snug">
                Unlimited mixing, unlimited mastering, WAV 48kHz lossless, and WAV 48kHz / 24-bit Pro Exports.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="font-display text-xs font-black text-white">Unlimited</span>
              <span className="font-mono text-4xs uppercase text-white/30 block">recurring</span>
            </div>
          </button>

        </div>

        {/* Disclaimer footer */}
        <div className="border-t border-white/5 pt-4 text-center text-3xs font-mono text-white/30 space-y-1">
          <p className="uppercase leading-normal">
            WAV exports are lossless file downloads intended for higher-quality playback, release preparation, and archiving. Final quality still depends on the original recording and mix quality.
          </p>
        </div>

      </div>
    </div>
  );
}
