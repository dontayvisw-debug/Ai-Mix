import React from 'react';
import { ShieldAlert, Info, Headphones, Music, Layers } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 mt-20 pt-12 pb-24 md:pb-12" id="studio-footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Logo Brand Pitch */}
          <div className="md:col-span-5 space-y-4 text-left">
            <BrandLogo mode="footer" />
            <p className="font-sans text-xs text-white/40 max-w-sm leading-relaxed mt-4">
              AI-assisted mixing and mastering for independent artists.
            </p>
          </div>

          {/* Quick links & references */}
          <div className="md:col-span-3 text-left space-y-3.5">
            <h5 className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#f43f5e]">Legal Presets</h5>
            <div className="flex flex-col space-y-2 text-xs text-white/40">
              <a href="#terms-of-service" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#privacy-policy" className="hover:text-white transition-colors">Acoustic Privacy Policy</a>
              <a href="#dmca" className="hover:text-white transition-colors">DMCA Compliance</a>
              <a href="#refund" className="hover:text-white transition-colors">Refund Guarantee</a>
              <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navigateToAdmin')); }} className="hover:text-white transition-colors">Admin</a>
            </div>
          </div>

          {/* Help links */}
          <div className="md:col-span-4 text-left space-y-3.5">
            <h5 className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#f43f5e]">Engineering Help</h5>
            <div className="flex flex-col space-y-2 text-xs text-white/40">
              <div className="flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer">
                <Headphones className="h-3.5 w-3.5" />
                <span>How to export dry vocals</span>
              </div>
              <div className="flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer">
                <Music className="h-3.5 w-3.5" />
                <span>USB Microphone setups</span>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Warnings & Safety Disclaimers */}
        <div className="border-t border-white/5 pt-8 space-y-4" id="disclaimer-panels">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Disclaimer 1: Reference Audio copyrights */}
            <div className="flex gap-3 p-4 rounded-xl bg-white/[0.01] border border-white/5 text-left">
              <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-display text-[10px] font-bold uppercase tracking-wider text-white/85">Reference Track Copyright Compliance</p>
                <p className="font-sans text-3xs text-white/35 leading-normal">
                  mixedbytae uses AI-assisted mixing concepts and does not copy, clone, or replicate any specific engineer, artist, song, voice, or copyrighted style. Only use audio, vocals, beats, artwork, and videos you own or have permission to use.
                </p>
              </div>
            </div>

            {/* Disclaimer 2: Record input quality */}
            <div className="flex gap-3 p-4 rounded-xl bg-white/[0.01] border border-white/5 text-left">
              <Info className="h-5 w-5 text-brand-pink shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-display text-[10px] font-bold uppercase tracking-wider text-white/85">Input Recording Quality Warning</p>
                <p className="font-sans text-3xs text-white/35 leading-normal">
                  Results may vary based on recording quality. Better recordings create better mixes. Cleaner input audio, proper headroom, and a quiet environment produce optimal mixed results.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Underlines credits */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-3xs font-mono text-white/30 pt-4 border-t border-white/5">
          <span>© 2026 mixedbytae. All rights reserved.</span>
          <span className="mt-1 sm:mt-0 uppercase tracking-widest text-[#f43f5e]/70">POWERED BY TAEDATARGET</span>
        </div>

      </div>
    </footer>
  );
}
