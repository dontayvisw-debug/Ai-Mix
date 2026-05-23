import React from 'react';
import { AlertTriangle, Info, ShieldCheck } from 'lucide-react';

interface DisclaimerBannerProps {
  type?: 'general' | 'upload-vocal' | 'upload-master' | 'results' | 'badge-small';
}

export default function DisclaimerBanner({ type = 'general' }: DisclaimerBannerProps) {
  if (type === 'badge-small') {
    return (
      <span className="inline-flex items-center space-x-1 font-sans text-2xs text-brand-cyan">
        <Info className="h-3 w-3 shrink-0" />
        <span>Better recordings create better mixes.</span>
      </span>
    );
  }

  if (type === 'upload-vocal') {
    return (
      <div className="rounded-xl border border-brand-green/20 bg-[#0A0A0A] p-4 text-left space-y-2.5" id="vocal-disclaimer-banner">
        <div className="flex items-center space-x-2 text-brand-green font-display text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="h-4.5 w-4.5 animate-pulse shrink-0" />
          <span>Vocal Delivery Advisory</span>
        </div>
        <div className="space-y-1 text-xs text-white/70">
          <p className="leading-relaxed font-sans font-medium text-white/90">
            Results may vary based on the quality of your recording, microphone, room noise, vocal performance, file quality, and uploaded instrumental. Better recordings create better mixes.
          </p>
          <p className="text-[11px] text-white/40 leading-normal">
            mixedbytae can improve the sound of a recording, but it cannot fully fix heavily distorted, clipped, extremely noisy, or badly recorded vocals. mixedbytae uses AI-assisted mixing concepts and does not copy, clone, or replicate any specific engineer, artist, song, voice, or copyrighted style.
          </p>
        </div>
      </div>
    );
  }

  if (type === 'upload-master') {
    return (
      <div className="rounded-xl border border-brand-pink/20 bg-[#0A0A0A] p-4 text-left space-y-2.5" id="mastering-disclaimer-banner">
        <div className="flex items-center space-x-2 text-brand-pink font-display text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
          <span>Mastering Input Advisory</span>
        </div>
        <div className="space-y-1 text-xs text-white/70">
          <p className="leading-relaxed font-sans font-medium text-white/90">
            Results may vary based on recording quality, microphone, room noise, performance, and overall mix alignment. Better recordings create better results.
          </p>
          <p className="text-[11px] text-white/40 leading-normal">
            Mastering works best when the song is already mixed well. mixedbytae uses AI-assisted mixing concepts and does not copy, clone, or replicate any specific engineer, artist, song, voice, or copyrighted style.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 text-left space-y-2" id="general-disclaimer-banner">
      <div className="flex items-center space-x-1.5 text-white/50 text-xs font-semibold uppercase tracking-wider">
        <Info className="h-4 w-4 shrink-0" />
        <span>Disclaimer Statement</span>
      </div>
      <p className="font-sans text-2xs text-white/45 leading-normal">
        Results may vary based on the quality of your recording, microphone, room noise, vocal performance, file quality, and uploaded instrumental. Cleaner dry vocals usually produce better mixes. Better recordings create better results.
      </p>
    </div>
  );
}
