import React, { useState } from 'react';
import { CheckCircle2, AlertOctagon, HelpCircle, FileAudio, PlayCircle, Download, Lock, Check } from 'lucide-react';
import { MixHistoryItem } from '../types';
import { toast } from 'sonner';

interface DashboardMixCardProps {
  key?: any;
  mix: MixHistoryItem;
  onAudition: (mix: MixHistoryItem) => void;
  isActiveAudition?: boolean;
  userPlan?: string;
  onUnlockWAV?: () => void;
  onRequestRevision?: (mix: MixHistoryItem) => void;
}

export default function DashboardMixCard({
  mix,
  onAudition,
  isActiveAudition = false,
  userPlan = "Free Tier",
  onUnlockWAV,
  onRequestRevision
}: DashboardMixCardProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const plan = userPlan.toLowerCase();
  const hasWav48kAccess = plan.includes('artist') || plan.includes('pro');
  const hasPro24bitAccess = plan.includes('pro');

  const handleDownload = (format: 'mp3' | 'wav48' | 'wav24') => {
    setDownloading(format);
    setTimeout(() => {
      setDownloading(null);
      toast.info("Export placeholder.", { description: "Real download will connect after backend audio processing is added."});
      const filename = `${mix.name.toLowerCase().replace(/\s+/g, '_')}_master_${format}`;
      const ext = format === 'mp3' ? 'mp3' : 'wav';
      const mockContent = `mixedbytae Rendered Master\nSong ID: ${mix.id}\nName: ${mix.name}\nExport Spec: ${format.toUpperCase()}\nLicensing User Plan: ${userPlan}`;
      
      const blob = new Blob([mockContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1200);
  };

  return (
    <div
      id={`history-card-${mix.id}`}
      className={`rounded-xl border p-5 transition-all duration-200 ${
        isActiveAudition
          ? 'border-brand-green bg-white/5 shadow-xl studio-glow-green'
          : 'bg-[#0A0A0A] border-white/5 hover:border-white/10'
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        {/* Track info Details */}
        <div className="flex items-center space-x-3.5 text-left overflow-hidden w-full sm:w-auto">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black border border-white/10 text-brand-green shadow-inner">
            <FileAudio className="h-5 w-5 text-white/45" />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center space-x-2">
              <h4 className="font-display text-sm font-bold text-white/90 truncate max-w-[200px] sm:max-w-xs">{mix.name}</h4>
              <span className="font-mono text-[9px] text-white/30 shrink-0">{mix.date}</span>
            </div>
            
            <p className="font-sans text-2xs text-white/50 mt-0.5 flex flex-wrap items-center gap-x-1">
              Preset: <span className="font-mono text-white/80 font-medium">{mix.presetName}</span>
              {mix.originalDuration && <span className="text-white/30">• {mix.originalDuration} min</span>}
            </p>
          </div>
        </div>

        {/* Status Indicators and Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-white/5 sm:border-t-0">
          
          {/* Badge Status */}
          <div id={`mix-status-${mix.id}`} className="flex flex-col sm:items-end w-full sm:w-auto">
            {mix.status === 'completed' && (
              <span className="inline-flex items-center space-x-1 rounded-md bg-brand-green/10 px-2 py-0.8 font-mono text-[10px] font-semibold text-brand-green">
                <CheckCircle2 className="h-3 w-3 text-brand-green shrink-0" />
                <span>COMPLETED</span>
              </span>
            )}
            {(mix.status === 'processing' || mix.status === 'mixing' || mix.status === 'mastering' || mix.status === 'revision_processing' || mix.status === 'uploading' || mix.status === 'waiting_for_payment') && (
              <div className="flex flex-col items-start sm:items-end">
                <span className="inline-flex items-center space-x-1 rounded-md bg-amber-500/10 px-2 py-0.8 font-mono text-[10px] font-semibold text-amber-500 animate-pulse mb-1">
                  <span className="h-2 w-2 rounded-full bg-amber-500 block animate-ping shrink-0" />
                  <span className="uppercase">{mix.status.replace(/_/g, ' ')}...</span>
                </span>
                <span className="text-[9px] font-mono text-white/50">Estimated time remaining: 2:14</span>
              </div>
            )}
            {mix.status === 'failed' && (
              <span className="inline-flex items-center space-x-1 rounded-md bg-rose-500/10 px-2 py-0.8 font-mono text-[10px] font-semibold text-rose-500" title="Source clip contains excessive latency clip drift">
                <AlertOctagon className="h-3 w-3 text-rose-500 shrink-0" />
                <span>FAILED — TRY AGAIN</span>
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-1.5 shrink-0" id={`mix-actions-${mix.id}`}>
            {mix.status === 'completed' ? (
              <>
                <button
                  onClick={() => onAudition(mix)}
                  id={`audition-btn-${mix.id}`}
                  className={`flex items-center space-x-1 rounded-lg px-3 py-1.5 font-display text-xs font-semibold tracking-wide transition-all duration-150 ${
                    isActiveAudition
                      ? 'bg-brand-green text-black font-extrabold shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 text-white/95 hover:text-white border border-white/10'
                  }`}
                >
                  <PlayCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{isActiveAudition ? 'Auditioning' : 'Audition'}</span>
                </button>
                <button
                  onClick={() => onRequestRevision && onRequestRevision(mix)}
                  className="flex items-center space-x-1 rounded-lg px-3 py-1.5 font-display text-xs font-semibold tracking-wide transition-all duration-150 bg-white/5 hover:bg-white/10 text-white/95 hover:text-white border border-white/10"
                >
                  <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>Request Revision</span>
                </button>
              </>
            ) : mix.status === 'failed' ? (
              <div className="text-[10px] font-mono text-white/30 leading-tight pr-1" title="Please record below -12dB headroom and remove external headphone delays.">
                Clipping / Latency issue
              </div>
            ) : null}
          </div>

        </div>

      </div>

      {/* Accordion nested file stem traces */}
      {mix.status === 'completed' && (
        <div className="mt-4 pt-3.5 border-t border-white/5 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="space-y-0.5">
              <span className="font-mono text-[8px] uppercase text-white/30 block">Dry Vocal Trace</span>
              <span className="font-sans text-2xs text-white/60 truncate block">{mix.vocalName}</span>
            </div>
            <div className="space-y-0.5">
              <span className="font-mono text-[8px] uppercase text-white/30 block">Beat Track Trace</span>
              <span className="font-sans text-2xs text-white/60 truncate block">{mix.beatName}</span>
            </div>
          </div>

          {/* Format Download Rows in history itemcard */}
          <div className="bg-black/40 rounded-xl p-3 border border-white/5 text-left space-y-3">
            <span className="font-mono text-4xs uppercase tracking-widest text-[#f97316] font-bold block">Available Audio Formats</span>
            
            <div className="flex flex-wrap gap-2">
              {/* MP3 */}
              <button
                onClick={() => handleDownload('mp3')}
                disabled={downloading !== null}
                className="inline-flex items-center gap-1 bg-white/5 hover:bg-white/10 text-white/80 border border-white/5 rounded-lg px-3 py-1.5 text-3xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {downloading === 'mp3' ? 'Preparing MP3...' : 'MP3 Download'}
              </button>

              {/* WAV 48k Lossless */}
              {hasWav48kAccess ? (
                <button
                  onClick={() => handleDownload('wav48')}
                  disabled={downloading !== null}
                  className="inline-flex items-center gap-1 bg-brand-green/20 hover:bg-brand-green/35 text-white rounded-lg px-3 py-1.5 text-3xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {downloading === 'wav48' ? 'Preparing WAV...' : 'WAV 48kHz Lossless'}
                </button>
              ) : (
                <button
                  onClick={onUnlockWAV}
                  className="inline-flex items-center gap-1 bg-white/[0.02] border border-white/10 text-white/30 rounded-lg px-3 py-1.5 text-3xs uppercase tracking-wider hover:text-white transition-colors"
                  title="Unlock WAV 48kHz lossless"
                >
                  <Lock className="h-3 w-3 text-white/40" />
                  <span>WAV 48kHz Lossless</span>
                </button>
              )}

              {/* WAV 24-bit Pro */}
              {hasPro24bitAccess ? (
                <button
                  onClick={() => handleDownload('wav24')}
                  disabled={downloading !== null}
                  className="inline-flex items-center gap-1 bg-purple-500/20 hover:bg-purple-500/35 text-white rounded-lg px-3 py-1.5 text-3xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {downloading === 'wav24' ? 'Preparing Pro WAV...' : 'WAV 48kHz / 24-bit Pro'}
                </button>
              ) : (
                <button
                  onClick={onUnlockWAV}
                  className="inline-flex items-center gap-1 bg-white/[0.02] border border-white/10 text-white/30 rounded-lg px-3 py-1.5 text-3xs uppercase tracking-wider hover:text-white transition-colors"
                  title="Unlock WAV 24-bit Pro export"
                >
                  <Lock className="h-3 w-3 text-white/40" />
                  <span>WAV 48kHz / 24-bit Pro</span>
                </button>
              )}
            </div>

            {/* Lock advisory description */}
            {!hasWav48kAccess && (
              <p className="font-sans text-[10px] text-white/30">
                WAV export requires Artist Monthly, Pro Artist, or WAV upgrade.
              </p>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

