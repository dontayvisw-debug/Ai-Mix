import React, { useState } from 'react';
import { CreditCard, Lock, Sparkles, X, ShoppingBag, ShieldAlert } from 'lucide-react';
import { PAYMENT_PROVIDER, redirectToCheckout } from '../utils/audioService';

interface CheckoutModalProps {
  productId: 'single_mix_20' | 'mastering_only_10' | 'artist_monthly_75' | 'pro_artist' | 'wav_export_upgrade' | 'pro_export_upgrade';
  productName: string;
  price: string;
  billingType: string;
  features: string[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (planId: string) => void;
}

export default function CheckoutModal({
  productId,
  productName,
  price,
  billingType,
  features,
  isOpen,
  onClose,
  onSuccess
}: CheckoutModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const checkoutDetails = redirectToCheckout(productId);

  const handleProcessCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(productId);
      onClose();
    }, 1500); // simulate delay redirecting or confirming
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn" id="saas-checkout-modal-holder">
      <div className="w-full max-w-md rounded-2xl bg-[#0A0A0A] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-black/50">
          <div className="flex items-center space-x-2.5">
            {PAYMENT_PROVIDER === 'stripe' ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <CreditCard className="h-5 w-5" />
              </div>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#95bf47]/10 text-[#95bf47]">
                <ShoppingBag className="h-5 w-5" />
              </div>
            )}
            <div>
              <h4 className="font-display text-sm font-bold text-white tracking-tight">
                {PAYMENT_PROVIDER === 'stripe' ? 'Stripe Checkout Sandbox' : 'Shopify Checkout Gateway'}
              </h4>
              <p className="font-mono text-4xs uppercase tracking-widest text-white/30">Secure checkout session</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          
          {/* Badge for payment provider */}
          <div className="flex items-center justify-between font-mono text-3xs border-b border-white/5 pb-2">
            <span className="text-white/30">PAYMENT PROVIDER</span>
            <span className="text-white rounded bg-white/5 px-2 py-0.5 border border-white/10 lowercase tracking-wide font-semibold">
              authorized via {PAYMENT_PROVIDER}
            </span>
          </div>

          {/* Selected Item Box */}
          <div className="rounded-xl border border-white/15 bg-black p-4 space-y-3 text-left">
            <div>
              <span className="font-mono text-[9px] text-[#f97316] uppercase font-bold tracking-widest">SELECTED SECURE PRODUCT</span>
              <h5 className="font-display text-base font-bold text-white tracking-tight mt-0.5">{productName}</h5>
              <p className="font-sans text-[10px] text-white/40 mt-1">Billing frequency: {billingType}</p>
            </div>

            <div className="border-t border-white/5 pt-3 flex justify-between items-baseline">
              <span className="font-sans text-xs text-white/50">LUMP SUM COMPLISED:</span>
              <span className="font-display text-3xl font-black text-[#f97316] tracking-tight">{price}</span>
            </div>
          </div>

          {/* What's included bullet points */}
          <div className="space-y-2 text-left">
            <span className="font-mono text-4xs uppercase tracking-widest text-white/40 block font-bold">What's included in this purchase:</span>
            <div className="grid grid-cols-1 gap-1.5 pl-1.5 font-sans text-xs text-white/70">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-green mt-1.5 shrink-0" />
                  <span className="leading-tight">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SaaS disclaimer notice inside the checkout layout */}
          <div className="rounded-xl border border-white/5 bg-white/[0.01] p-3 text-left space-y-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#f97316] block font-bold">Payment Notification</span>
            <p className="font-sans text-[10px] text-white/40 leading-relaxed">
              Your payment unlocks mix, mastering, or export credits inside your account. Real payment processing will connect through Shopify or Stripe.
            </p>
            <p className="font-sans text-[10px] text-white/50 leading-relaxed font-semibold">
              Results may vary based on the quality of your recording, microphone, room noise, vocal performance, file quality, and uploaded instrumental. Better recordings create better results.
            </p>
          </div>

          {/* Simulated redirect action button */}
          <div className="space-y-2">
            <button
              onClick={handleProcessCheckout}
              disabled={isProcessing}
              id="confirm-checkout-redirect-btn"
              className="w-full rounded-xl bg-brand-green hover:bg-orange-400 text-black font-extrabold py-3.5 text-xs uppercase tracking-wider transition-all shadow-lg studio-glow-green flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <Lock className="h-4 w-4" />
              <span>{isProcessing ? 'Connecting...' : checkoutDetails.providerText}</span>
            </button>
            <p className="font-mono text-[9px] text-white/30 text-center uppercase">
              No real credit card is required to simulate payment validation today.
            </p>
          </div>

        </div>

        {/* Security badge footer */}
        <div className="bg-black px-6 py-3 border-t border-white/10 flex items-center justify-center gap-1 font-sans text-3xs text-white/30">
          <ShieldAlert className="h-3.5 w-3.5 text-white/30" />
          <span>AES-256 Bit SSL Encrypted Credentials</span>
        </div>

        {/* 
          STRIPE INTEGRATION PLAN COMMENTS:
          - Stripe Checkout links correspond to product IDs on the Stripe Dashboard:
            single_mix_20, mastering_only_10, artist_monthly_75, pro_artist, etc.
          - stripe checkout handles subscription intervals or instant captures.
          - Stripe Webhook listener processes event checkout.session.completed 
            and executes activateCreditsAfterPayment to persist user records.
          - Customers can access the self-service customer billing portal via Stripe portal configurations.

          SHOPIFY INTEGRATION PLAN COMMENTS:
          - Shopify product variants correspond to IDs:
            single_mix_20, mastering_only_10, artist_monthly_75, pro_artist, etc.
          - Users buy digital items via the Shopify Storefront cart.
          - Subscription apps on Shopify manage billing recurring intervals.
          - Order creation webhooks track paid statuses and grant corresponding digital credits.
        */}

      </div>
    </div>
  );
}
