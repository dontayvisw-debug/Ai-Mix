import React, { useState } from 'react';
import { PencilLine, Send, CheckCircle2 } from 'lucide-react';
import { requestRevision } from '../utils/audioService';

interface RevisionRequestProps {
  mixId: string;
  songName: string;
  onSubmitRevision: () => void;
}

const QUICK_REVISIONS = [
  "Make vocal louder",
  "Make vocal warmer",
  "Make vocal brighter",
  "Make it darker",
  "Less AutoTune",
  "More AutoTune",
  "Less reverb",
  "More reverb",
  "Make vocal more aggressive",
  "Make vocal smoother",
  "Keep my natural tone",
  "Make it more polished"
];

export default function RevisionRequest({
  mixId,
  songName,
  onSubmitRevision
}: RevisionRequestProps) {
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent | string) => {
    if (typeof e !== 'string') e.preventDefault();
    
    const textToSubmit = typeof e === 'string' ? e : draft.trim();
    if (!textToSubmit) return;

    setIsSending(true);
    try {
      await requestRevision(mixId, textToSubmit);
      setIsSent(true);
      setDraft('');
      // Propagate upward so the timer modal triggers
      onSubmitRevision();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/5 bg-[#0A0A0A] p-5 space-y-4 text-left" id={`revision-request-box-${mixId}`}>
      <div className="space-y-1">
        <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5 gap-1">
          <PencilLine className="h-4 w-4 text-brand-green" />
          <span>Request Voice-Adaptive Revision</span>
        </h4>
        <p className="font-sans text-3xs text-white/50 leading-relaxed">
          mixedbytae learns how you like your voice to sound. Tap a preset adjustment or type what you want changed.
        </p>
      </div>

      {isSent ? (
        <div className="rounded-lg bg-brand-green/10 border border-brand-green/20 p-3.5 flex items-center space-x-2.5 text-2xs text-brand-green animate-fadeIn">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <div>
            <span className="font-bold uppercase tracking-wider font-mono">Revision noted.</span>
            <p className="text-white/60 mt-0.5">mixedbytae will adjust the mix while preserving your vocal identity. Previews render in 1 minute.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {QUICK_REVISIONS.map((text, i) => (
               <button
                 key={i}
                 onClick={() => handleSubmit(text)}
                 disabled={isSending}
                 className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-sans text-3xs text-white/80 transition-colors disabled:opacity-50"
               >
                 {text}
               </button>
            ))}
          </div>
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={draft}
              disabled={isSending}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Or type custom feedback..."
              id="revision-text-input"
              className="flex-grow bg-black rounded-lg border border-white/10 px-3.5 py-2 font-sans text-2xs text-white focus:outline-none focus:border-brand-green placeholder:text-white/20 transition-all placeholder:text-3xs"
            />
            <button
              type="submit"
              disabled={isSending || !draft.trim()}
              id="send-revision-btn"
              className="rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 text-2xs uppercase tracking-wider font-bold transition-all flex items-center space-x-1 shrink-0 disabled:opacity-40"
            >
              {isSending ? (
                <span className="h-3 w-3 animate-spin border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <>
                  <Send className="h-3 w-3" />
                  <span>Send</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
