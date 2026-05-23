import React, { useState } from 'react';
import { Check, ShieldAlert, Sparkles, CreditCard, Lock, ArrowRight, X } from 'lucide-react';
import { createCheckoutSession } from '../utils/audioService';
import CheckoutModal from './CheckoutModal';

interface PricingCardProps {
  userEmail?: string;
  onSuccess?: (planName: string) => void;
  selectedPlan?: string;
}

export const PRO_ARTIST_PRICE = "$130"; // Easily customizable pricing value

export default function PricingCard({
  userEmail = "Dontayvisw@gmail.com",
  onSuccess,
  selectedPlan = "Free Tier"
}: PricingCardProps) {
  const [activePlanLoading, setActivePlanLoading] = useState<string | null>(null);
  
  // Checkout Model state
  const [checkoutModal, setCheckoutModal] = useState<{
    isOpen: boolean;
    productId: 'single_mix_20' | 'mastering_only_10' | 'artist_monthly_75' | 'pro_artist';
    productName: string;
    price: string;
    billingType: string;
    features: string[];
  } | null>(null);

  const plans = [
    {
      id: "single_mix_20",
      name: "Single Mix",
      price: "$20",
      period: "per song mix credit",
      description: "Get mixed by mixedbytae for $20.",
      features: [
        "1 AI Vocal Mix credit",
        "Includes MP3 320kbps export",
        "Standard presets included",
        "Basic vocal cleanup & De-essing",
        "Lossless WAV formats unlockable via upgrade",
        "Vocal + beat stems balance"
      ],
      notIncluded: [
        "WAV 48kHz lossless exports in-the-box",
        "Mastering session access",
        "Unlimited parallel backup tracks",
        "Reference track style-matching filter"
      ],
      cta: "Buy Single Mix",
      isPopular: false,
      glowColor: "border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02]"
    },
    {
      id: "mastering_only_10",
      name: "Mastering Only",
      price: "$10",
      period: "per mastered track",
      description: "Get your finished song mastered by mixedbytae for $10.",
      features: [
        "1 High-loudness Mastering session",
        "Includes MP3 320kbps export",
        "Stereo field imaging and air shelving",
        "Brickwall limiters aligned up to Spotify thresholds",
        "WAV exports unlockable via upgrade"
      ],
      notIncluded: [
        "Vocal balancing & pitch tuning integration",
        "Free multi-stem background renders",
        "Infinite revision adjusts"
      ],
      cta: "Buy Mastering Only",
      isPopular: false,
      glowColor: "border-brand-pink/20 bg-brand-pink/[0.01] hover:border-brand-pink/40"
    },
    {
      id: "artist_monthly_75",
      name: "Artist Monthly",
      price: "$75",
      period: "per month",
      description: "15 mixes per month plus mastering with mixedbytae.",
      features: [
        "15 Song mixing credits per month",
        "Mastering access included",
        "WAV 48kHz Lossless exports included",
        "Reference track style-matching filter",
        "Background vocal & adlib stems supported",
        "Saves track historical files cloud databases"
      ],
      notIncluded: [
        "WAV 48kHz / 24-bit Pro Exports",
        "Unlimited mixing sessions"
      ],
      cta: "Subscribe to Artist Monthly",
      isPopular: true,
      glowColor: "border-brand-cyan bg-white/[0.01] studio-glow-cyan"
    },
    {
      id: "pro_artist",
      name: "Pro Artist",
      price: PRO_ARTIST_PRICE,
      period: "per month",
      description: "Unlimited mixing and mastering with mixedbytae.",
      features: [
        "Unlimited Mixes & Unlimited Mastering",
        "WAV 48kHz Lossless exports included",
        "WAV 48kHz / 24-bit Pro Exports included",
        "Save and lock custom sound settings presets",
        "Priority DSP rendering nodes",
        "Dedicated VIP priority support queues"
      ],
      notIncluded: [],
      cta: "Subscribe to Pro Artist",
      isPopular: false,
      glowColor: "border-purple-500/30 bg-purple-500/[0.01] hover:border-purple-500/55"
    }
  ];

  const handleTriggerCheckout = (planId: string, planName: string, price: string, billingPeriod: string, features: string[]) => {
    setCheckoutModal({
      isOpen: true,
      productId: planId as any,
      productName: planName,
      price: price,
      billingType: billingPeriod.includes('month') ? 'Monthly Subscription' : 'One-time Session charge',
      features: features
    });
  };

  const handleCheckoutSuccess = (productId: string) => {
    let finalPlanName = "Free Tier";
    if (productId === "single_mix_20") finalPlanName = "Single Mix User";
    else if (productId === "mastering_only_10") finalPlanName = "Mastering Only User";
    else if (productId === "artist_monthly_75") finalPlanName = "Artist Monthly";
    else if (productId === "pro_artist") finalPlanName = "Pro Artist";

    if (onSuccess) {
      onSuccess(finalPlanName);
    }
    setCheckoutModal(null);
  };

  return (
    <div className="space-y-12" id="pricing-module-container">
      
      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {plans.map((p) => {
          const isCurrentPlan = selectedPlan.toLowerCase() === p.name.toLowerCase();
          return (
            <div
              key={p.id}
              id={`plan-card-${p.id}`}
              className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 border ${p.glowColor}`}
            >
              {p.isPopular && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green text-black font-display text-[9px] font-extrabold uppercase tracking-widest px-4 py-1.5 shadow-md studio-glow-green">
                  Most Popular
                </div>
              )}

              {/* Header details */}
              <div className="space-y-4 text-left">
                <div>
                  <h3 className="font-display text-base font-bold text-white tracking-tight">{p.name}</h3>
                  <p className="font-sans text-2xs text-white/50 mt-1 min-h-[44px] leading-relaxed">{p.description}</p>
                </div>

                <div className="flex items-baseline space-x-1">
                  <span className="font-display text-4xl font-extrabold text-white tracking-tight">{p.price}</span>
                  <span className="font-sans text-3xs text-white/30 font-medium">/{p.period}</span>
                </div>
              </div>

              {/* Action Trigger Button */}
              <button
                onClick={() => handleTriggerCheckout(p.id, p.name, p.price, p.period, p.features)}
                id={`plan-cta-btn-${p.id}`}
                disabled={isCurrentPlan}
                className={`w-full flex items-center justify-center space-x-2 rounded-xl py-3 text-2xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isCurrentPlan
                    ? 'bg-white/[0.03] text-white/40 border border-white/5 cursor-default'
                    : p.isPopular
                    ? 'bg-brand-green text-black hover:bg-orange-400 font-extrabold shadow-lg studio-glow-green'
                    : p.id === 'mastering_only_10'
                    ? 'bg-brand-pink text-white hover:bg-rose-500 font-extrabold shadow-lg'
                    : 'bg-white/5 text-white/90 hover:bg-white/10 border border-white/10'
                }`}
              >
                <span>{isCurrentPlan ? 'Current Active Plan' : p.cta}</span>
                {!isCurrentPlan && <ArrowRight className="h-3.5 w-3.5 shrink-0" />}
              </button>

              {/* Bullet Features Lists */}
              <ul className="space-y-3.5 border-t border-white/5 pt-6 text-left" id={`plan-features-${p.id}`}>
                <span className="font-mono text-4xs uppercase text-white/30 tracking-widest block font-bold">Includes:</span>
                {p.features.map((feature) => (
                  <li key={feature} className="flex items-start space-x-2.5 text-2xs text-white/85">
                    <Check className="h-4 w-4 text-brand-green shrink-0 mt-0.2" />
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
                {p.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-start space-x-2.5 text-2xs text-white/20 line-through">
                    <X className="h-4 w-4 text-white/10 shrink-0 mt-0.2" />
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Renders secure CheckoutModal */}
      {checkoutModal?.isOpen && (
        <CheckoutModal
          productId={checkoutModal.productId}
          productName={checkoutModal.productName}
          price={checkoutModal.price}
          billingType={checkoutModal.billingType}
          features={checkoutModal.features}
          isOpen={checkoutModal.isOpen}
          onClose={() => setCheckoutModal(null)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

    </div>
  );
}
