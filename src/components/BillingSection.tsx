import React, { useState } from 'react';
import { CreditCard, ShoppingBag, CheckCircle, Shield, Award, HelpCircle, ArrowUpRight } from 'lucide-react';
import { PAYMENT_PROVIDER, UserCreditsProfile } from '../utils/audioService';
import { toast } from 'sonner';

interface BillingSectionProps {
  profile: UserCreditsProfile;
  onUpgradeClick: () => void;
}

export default function BillingSection({
  profile,
  onUpgradeClick
}: BillingSectionProps) {
  const [isSimulatingPortal, setIsSimulatingPortal] = useState(false);

  const handleManageBilling = () => {
    setIsSimulatingPortal(true);
    setTimeout(() => {
      setIsSimulatingPortal(false);
      toast.info("Billing placeholder.", { description: `Redirecting to simulate safe billing management on ${PAYMENT_PROVIDER === 'stripe' ? 'Stripe Customer Portal' : 'Shopify Order History Drawer'}...` });
    }, 1200);
  };

  const hasMastering = profile.userPlan === "Pro Artist" || profile.userPlan === "Artist Monthly" || profile.masteringAccess || profile.masteringCredits > 0;

  return (
    <div className="rounded-2xl border border-white/5 bg-[#0A0A0A] p-6 space-y-6 text-left" id="billing-section-holder">
      
      {/* Head */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="font-mono text-3xs font-bold uppercase tracking-widest text-[#f97316]">Billing Profile</span>
          <h3 className="font-display text-base font-bold text-white tracking-tight mt-0.5">Quotas & Subscriptions</h3>
          <p className="font-sans text-xs text-white/40">Inspect active session credits, format locks, and merchant details.</p>
        </div>
        
        <div className="flex items-center space-x-2 rounded-xl bg-white/[0.02] border border-white/10 px-4.5 py-2">
          {PAYMENT_PROVIDER === "stripe" ? (
            <CreditCard className="h-4.5 w-4.5 text-emerald-400" />
          ) : (
            <ShoppingBag className="h-4.5 w-4.5 text-[#95bf47]" />
          )}
          <span className="font-sans text-xs text-white/60">Provider:</span>
          <span className="font-mono text-2xs uppercase tracking-wider text-white font-bold">{PAYMENT_PROVIDER}</span>
        </div>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Tier ID */}
        <div className="rounded-xl bg-black p-4 border border-white/5">
          <span className="font-mono text-4xs uppercase tracking-widest text-white/30 block">Current plan</span>
          <span className="font-display text-sm font-bold text-white block mt-1">{profile.userPlan}</span>
          <button
            onClick={onUpgradeClick}
            id="billing-upgrade-btn"
            className="font-mono text-4xs uppercase tracking-widest text-brand-green hover:underline mt-2 inline-flex items-center space-x-0.5 font-bold"
          >
            <span>Upgrade Option</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>

        {/* Mix credits status */}
        <div className="rounded-xl bg-black p-4 border border-white/5">
          <span className="font-mono text-4xs uppercase tracking-widest text-white/30 block">Vocal Mix credits</span>
          <span className="font-display text-sm font-bold text-white block mt-1">
            {profile.userPlan === "Pro Artist" ? "Unlimited active" : `${profile.mixCredits} balance`}
          </span>
          <span className="font-sans text-4xs text-white/40 block mt-2">
            Used {profile.mixesUsedThisMonth} this session tier
          </span>
        </div>

        {/* Mastering credits status */}
        <div className="rounded-xl bg-black p-4 border border-white/5">
          <span className="font-mono text-4xs uppercase tracking-widest text-white/30 block">Mastering credits</span>
          <span className="font-display text-sm font-bold text-white block mt-1">
            {profile.userPlan === "Pro Artist" ? "Unlimited active" : profile.userPlan === "Artist Monthly" ? "Included features" : `${profile.masteringCredits || 0} balance`}
          </span>
          <span className="font-sans text-4xs text-white/40 block mt-2">
            {hasMastering ? "High-loudness master active" : "Requires $10 credit purchase"}
          </span>
        </div>

        {/* Exports access status */}
        <div className="rounded-xl bg-black p-4 border border-white/5">
          <span className="font-mono text-4xs uppercase tracking-widest text-white/30 block">WAV Export status</span>
          <span className="font-display text-xs font-bold text-white block mt-1 uppercase tracking-wider text-brand-cyan">
            {profile.userPlan === "Pro Artist" ? "24-bit / 48kHz Pro Export" : profile.userPlan === "Artist Monthly" ? "48kHz Lossless WAV" : "MP3 Only"}
          </span>
          <span className="font-sans text-4xs text-white/40 block mt-2.5">
            {profile.userPlan.includes("Artist") || profile.userPlan.includes("Pro") ? "WAV downloads unlocked" : "Requires add-on WAV license"}
          </span>
        </div>

      </div>

      {/* Manage external billing portals buttons */}
      <div className="pt-5 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex bg-black p-1 rounded-xl border border-white/5 gap-1 shadow-inner max-w-full overflow-x-auto">
          <button
            onClick={() => {
              navigator.clipboard.writeText("https://mixmyvocal.com/ref/user_123");
              toast.success("Referral Link Copied!", { description: "Share this link to earn free mixes."});
            }}
            className="rounded-lg bg-white/5 hover:bg-white/10 text-white/90 border border-transparent hover:border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0"
          >
            Copy Referral Link
          </button>
          <button
            onClick={() => {
              document.getElementById('tutorial') || document.getElementById('tutorial-video-section-container')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="rounded-lg bg-white/5 hover:bg-white/10 text-white/90 border border-transparent hover:border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0"
          >
            Watch Tutorial
          </button>
        </div>

        <button
          onClick={handleManageBilling}
          id="manage-billing-btn"
          disabled={isSimulatingPortal}
          className="rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50 shrink-0"
        >
          {isSimulatingPortal ? (
            <span>Connecting gateway...</span>
          ) : PAYMENT_PROVIDER === "stripe" ? (
            <span>Manage Stripe Billing</span>
          ) : (
            <span>Manage Shopify Orders</span>
          )}
        </button>
      </div>

    </div>
  );
}
