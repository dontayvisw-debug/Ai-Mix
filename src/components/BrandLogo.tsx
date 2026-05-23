import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

export const BRAND_NAME = "mixedbytae";
export const BRAND_ARTIST = "taedatarget";
export const BRAND_HERO_IMAGE = "/brand/taedatarget-hero.png";
export const BRAND_LOGO_IMAGE = "/brand/taedatarget-hero.png";
export const BRAND_WORDMARK_IMAGE = "/brand/taedatarget-wordmark.png";

export type BrandLogoMode = 'navbar' | 'hero' | 'footer' | 'fallback';

interface BrandLogoProps {
  mode?: BrandLogoMode;
  className?: string;
}

export default function BrandLogo({ mode = 'navbar', className = '' }: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);

  if (mode === 'navbar') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {!imageError ? (
          <img 
            src={BRAND_WORDMARK_IMAGE} 
            alt={BRAND_NAME} 
            className="h-6 object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="font-display text-lg font-bold tracking-tight text-white">
            {BRAND_NAME}
          </span>
        )}
      </div>
    );
  }

  if (mode === 'hero' || mode === 'footer') {
    return (
      <div className={`flex flex-col ${mode === 'hero' ? 'items-center text-center' : 'items-start text-left'} space-y-1 ${className}`}>
        <span className="font-display text-2xl font-bold tracking-tight text-white">
          {BRAND_NAME}
        </span>
        <span className="font-mono text-3xs uppercase tracking-widest text-brand-pink font-semibold flex items-center space-x-1">
          <span>Powered by</span>
          <span className="text-white/80">{BRAND_ARTIST}</span>
        </span>
      </div>
    );
  }

  // fallback text mode
  return (
    <span className={`font-display font-bold tracking-tight text-white ${className}`}>
      {BRAND_NAME}
    </span>
  );
}
