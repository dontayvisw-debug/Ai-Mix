import React from 'react';
import { Layers, Sparkles, Zap, Flame, Headphones, CheckCircle } from 'lucide-react';

interface ServiceSelectionProps {
  onSelectService: (service: 'mix' | 'master') => void;
  onGoToPricing: () => void;
  proArtistPriceDisplay: string;
}

export default function ServiceSelection({
  onSelectService,
  onGoToPricing,
  proArtistPriceDisplay
}: ServiceSelectionProps) {

  const cards = [
    {
      id: "mix",
      title: "Mix My Song",
      price: "$20",
      type: "One-time session credit",
      description: "Best if you have dry vocals and a 2-track beat. AI balanced with specific style targets.",
      required: ["Dry lead vocal stem", "2-track instrumental"],
      optional: ["Adlibs / Background stems", "Acoustic reference track"],
      btnText: "Start Mixing",
      colorTag: "border-brand-green/20 hover:border-brand-green text-brand-green bg-gradient-to-br from-[#0A0A0A] to-brand-green/[0.02]",
      badge: "CREATOR POPULAR",
      icon: <Layers className="h-6 w-6 text-brand-green" />
    },
    {
      id: "master",
      title: "Master My Song",
      price: "$10",
      type: "One-time master credit",
      description: "Best if your song is already mixed. Adds competitive loudness, depth, and release-ready consistency.",
      required: ["Finished mixed master file"],
      optional: ["Loudness reference target"],
      btnText: "Start Mastering",
      colorTag: "border-brand-pink/20 hover:border-brand-pink text-brand-pink bg-gradient-to-br from-[#0A0A0A] to-brand-pink/[0.02]",
      badge: "LOUD COMPLIANT",
      icon: <Headphones className="h-6 w-6 text-brand-pink" />
    },
    {
      id: "monthly",
      title: "Artist Monthly",
      price: "$75",
      type: "monthly subscription",
      description: "Best if you release often. Fully unlocked parameters. Get 15 full vocal mixes per month plus mastering.",
      required: ["15 mixes included", "Mastering included", "WAV exports included"],
      optional: ["Priority support queues", "Revision access"],
      btnText: "Start Artist Monthly",
      colorTag: "border-brand-cyan/20 hover:border-brand-cyan text-brand-cyan bg-gradient-to-br from-[#0A0A0A] to-brand-cyan/[0.02]",
      badge: "BEST VALUE",
      icon: <Sparkles className="h-6 w-6 text-brand-cyan" />
    },
    {
      id: "pro",
      title: "Pro Artist",
      price: "Unlimited",
      type: proArtistPriceDisplay,
      description: "Best for busy home studios, independent collectives, and artists demanding infinite output.",
      required: ["Unlimited vocal mixes & master", "Saves custom sound presets", "WAV 24-bit Pro Exports"],
      optional: ["Dedicated priority servers", "WAV downloads forever"],
      btnText: "Upgrade to Pro Artist",
      colorTag: "border-purple-500/20 hover:border-purple-500 text-purple-400 bg-gradient-to-br from-[#0A0A0A] to-purple-500/[0.02]",
      badge: "STUDIO UNLIMITED",
      icon: <Flame className="h-6 w-6 text-purple-400" />
    }
  ];

  return (
    <div className="space-y-10 animate-fadeIn" id="service-selection-view">
      
      {/* Visual Header Pitch */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          What do you need today?
        </h2>
        <p className="font-sans text-xs text-white/50 leading-relaxed text-balance">
          Choose mixing if you have dry vocals and a beat. Choose mastering if your song is already mixed and only needs final polish.
        </p>
      </div>

      {/* Difference helper message boxes */}
      <div className="max-w-3xl mx-auto rounded-xl border border-white/5 bg-white/[0.01] p-4 text-left font-sans text-xs space-y-1.5 leading-relaxed text-white/60">
        <span className="font-mono text-3xs font-bold text-brand-green uppercase tracking-widest block">Guide: Mixing vs. Mastering</span>
        <p>
          Mixing is for songs that need vocals balanced with the beat. Mastering is for songs that are already mixed and need final loudness, polish, and release-ready consistency.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {cards.map((card) => (
          <div
            key={card.id}
            id={`service-selection-${card.id}`}
            className={`rounded-2xl border p-6 flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1 ${card.colorTag}`}
          >
            <div className="space-y-4 text-left">
              {/* Badge info */}
              <div className="flex justify-between items-center">
                <span className="rounded-full bg-white/5 border border-white/5 px-2.5 py-0.8 font-mono text-[9px] font-extrabold tracking-wider uppercase text-white/60">
                  {card.badge}
                </span>
                {card.icon}
              </div>

              {/* Title & Price info */}
              <div>
                <h4 className="font-display text-base font-bold text-white tracking-tight">{card.title}</h4>
                <div className="flex items-baseline space-x-1 mt-1.5">
                  <span className="font-display text-3xl font-black text-white tracking-tight">{card.price}</span>
                  <span className="font-sans text-3xs text-white/40">{card.type}</span>
                </div>
                <p className="font-sans text-2xs text-white/50 mt-2.5 min-h-[44px] leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Requirement Bullet Traced Lists */}
              <div className="space-y-2 border-t border-white/5 pt-4">
                <span className="font-mono text-4xs uppercase tracking-widest text-white/30 block font-bold">Expects:</span>
                <ul className="space-y-1 text-3xs font-mono text-white/70">
                  {card.required.map((req, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-green shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                  {card.optional.map((opt, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5 text-white/30">
                      <span className="h-1 w-1 rounded-full bg-white/10 shrink-0" />
                      <span>{opt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA action triggers */}
            <div>
              {card.id === 'mix' || card.id === 'master' ? (
                <button
                  onClick={() => onSelectService(card.id as 'mix' | 'master')}
                  id={`start-service-${card.id}`}
                  className={`w-full py-3 rounded-xl font-display text-2xs font-bold uppercase tracking-wider text-black transition-all ${
                    card.id === 'mix' 
                      ? 'bg-brand-green hover:bg-orange-400 studio-glow-green' 
                      : 'bg-brand-pink hover:bg-rose-400 studio-glow-pink'
                  }`}
                >
                  {card.btnText}
                </button>
              ) : (
                <button
                  onClick={onGoToPricing}
                  id={`pricing-navigate-${card.id}`}
                  className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 rounded-xl font-display text-2xs font-bold uppercase tracking-wider transition-all"
                >
                  {card.btnText}
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
