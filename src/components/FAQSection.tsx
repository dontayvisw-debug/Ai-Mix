import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
  q: string;
  a: string;
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      q: "How much is a single mix?",
      a: "A single mix is $20. It includes one AI-powered mix using your uploaded dry vocal and 2-track instrumental. This is perfect for testing out drafts."
    },
    {
      q: "How much is mastering by itself?",
      a: "Mastering by itself is $10 per song. This applies final loudness pipelines, limiting, width adjustments, and competitive loudness targets on already-mixed audio stems."
    },
    {
      q: "What comes with Artist Monthly?",
      a: "Artist Monthly is $75/month and includes 15 mixes per month, mastering, and WAV 48kHz lossless downloads included out of the box."
    },
    {
      q: "What comes with Pro Artist?",
      a: "Pro Artist includes unlimited mixing, unlimited mastering, WAV 48kHz lossless downloads, and WAV 48kHz / 24-bit Pro Export. It is built for serious independent artists, frequent releases, and small studios."
    },
    {
      q: "What is the difference between mixing and mastering?",
      a: "Mixing balances your vocals, beat, adlibs, effects, and overall sound. Mastering is the final polish after the song is already mixed. If your vocals are not balanced with the beat yet, choose mixing. If your song already sounds balanced and only needs loudness and final polish, choose mastering."
    },
    {
      q: "Are results guaranteed?",
      a: "No. Results may vary based on recording quality, microphone quality, background noise, vocal performance, file quality, and the instrumental. Better dry recordings create better final outcomes."
    },
    {
      q: "What gives the best results?",
      a: "Dry vocals with no effects, no beat bleeding, no clipping, low background noise, and a clean instrumental file. Recording in a treated room or vocal booth significantly improves transparency."
    },
    {
      q: "Can mastering fix a bad mix?",
      a: "Not always. Mastering can make a good mix louder, cleaner, and more polished, but it cannot fully fix vocals that are too loud, too quiet, distorted, or poorly balanced."
    },
    {
      q: "Can I download WAV files?",
      a: "Yes. Artist Monthly and Pro Artist include WAV 48kHz lossless downloads. Single Mix and Mastering Only users can unlock WAV downloads with an upgrade."
    },
    {
      q: "What is WAV 48kHz lossless quality?",
      a: "WAV 48kHz lossless is a higher-quality audio export format for release prep, distribution, professional playback, and archiving."
    },
    {
      q: "Can I pay through Shopify or Stripe?",
      a: "Yes. The app is structured so payments can connect of both Shopify or Stripe checkouts seamlessly depending on variable configurations."
    }
  ];

  return (
    <div className="w-full space-y-4" id="faq-section-wrapper">
      <div className="text-center space-y-1">
        <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">Frequently Answered Queries</h4>
        <p className="font-sans text-xs text-white/40">Everything you need to know about our business updates, audio specifications, and mastering tools.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-white/5 bg-[#0A0A0A] p-4 space-y-2 hover:border-white/10 transition-colors cursor-pointer"
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            id={`faq-item-${idx}`}
          >
            <div className="flex justify-between items-start gap-2">
              <h5 className="font-display text-xs font-bold text-white/90 leading-tight flex items-center gap-2">
                <span className="text-brand-green font-mono text-3xs font-extrabold shrink-0">Q.</span>
                <span>{faq.q}</span>
              </h5>
              <span className="text-white/30 shrink-0 mt-0.5">
                {openIndex === idx ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </span>
            </div>
            
            {(openIndex === idx || idx < 4) && (
              <p className="font-sans text-[11px] text-white/50 leading-relaxed pl-4 border-l border-white/10 animate-slideDown">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Trust disclaimer banner */}
      <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 text-center text-3xs font-mono text-white/30 uppercase tracking-widest leading-relaxed">
        Results may vary based on the quality of your recording, microphone, room noise, vocal performance, file quality, and uploaded instrumental. Cleaner dry vocals usually produce better mixes. Better recordings create better results.
      </div>
    </div>
  );
}
