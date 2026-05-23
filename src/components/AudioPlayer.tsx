import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, ShieldCheck, Download, Sparkles, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { GlobalSoundEngine } from '../utils/soundEngine';
import { MixSettings } from '../types';

interface AudioPlayerProps {
  songName: string;
  presetName: string;
  settings: MixSettings;
  referenceApplied?: boolean;
  onUpgradeClick?: () => void;
  showProUpgrade?: boolean;
}

export default function AudioPlayer({
  songName,
  presetName,
  settings,
  referenceApplied = false,
  onUpgradeClick,
  showProUpgrade = true
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mixMode, setMixMode] = useState<'original' | 'mixed'>('mixed');
  const [progress, setProgress] = useState(0); // 0 to 120 seconds
  const [vUMeters, setVUMeters] = useState({ left: 0, right: 0 });
  const [volume, setVolume] = useState(80);
  const [downloadingFormat, setDownloadingFormat] = useState<'mp3' | 'wav' | null>(null);

  // Auto-update SoundEngine configurations whenever parent settings update
  useEffect(() => {
    GlobalSoundEngine.setSettings(settings);
  }, [settings]);

  useEffect(() => {
    GlobalSoundEngine.setMixMode(mixMode);
  }, [mixMode]);

  // Connect to the Web Audio engine callback loop on mount
  useEffect(() => {
    GlobalSoundEngine.setCallback((currentSec, meters) => {
      setProgress(currentSec);
      if (meters.left > 0 || meters.right > 0) {
        setVUMeters(meters);
      } else if (!isPlaying) {
        setVUMeters({ left: 0, right: 0 });
      }
    });

    return () => {
      GlobalSoundEngine.stop();
    };
  }, []);

  const handlePlayToggle = () => {
    if (isPlaying) {
      GlobalSoundEngine.stop();
      setIsPlaying(false);
      setVUMeters({ left: 0, right: 0 });
    } else {
      GlobalSoundEngine.start();
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    GlobalSoundEngine.stop();
    GlobalSoundEngine.setProgress(0);
    setIsPlaying(false);
    setProgress(0);
    setVUMeters({ left: 0, right: 0 });
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    GlobalSoundEngine.setProgress(val);
  };

  const handleDownload = (format: 'mp3' | 'wav') => {
    setDownloadingFormat(format);
    setTimeout(() => {
      setDownloadingFormat(null);
      
      // Simulate download trigger by saving a mock text file as MP3/WAV payload
      const mockContent = `mixedbytae Studio Mix\nSong: ${songName}\nPreset: ${presetName}\nFormat: ${format.toUpperCase()}\nStatus: Verified Studio Mastering Ready`;
      const blob = new Blob([mockContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const filename = `${songName.toLowerCase().replace(/\s+/g, '_')}_mastered.${format}`;
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`${format.toUpperCase()} Export Placeholder Successful`, {
        description: `Real rendering will export later. A mock file was saved: ${filename}`,
        action: {
          label: 'View File',
          onClick: () => window.open(url, '_blank')
        }
      });
    }, 1500);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Generate mock audio waves coordinates
  const dryWaveforms = [20, 25, 40, 30, 22, 18, 55, 60, 42, 28, 70, 75, 45, 20, 15, 38, 48, 25, 35, 12, 18, 50, 45, 32, 20, 42, 55, 30, 25, 15, 40, 50, 35, 22, 18, 55, 63, 40, 25, 75, 60, 35, 20, 15, 45, 52, 28, 33, 10, 12, 45, 50, 30];
  const mixedWaveforms = [25, 35, 55, 48, 40, 35, 75, 85, 68, 52, 90, 95, 72, 48, 38, 62, 74, 50, 60, 35, 42, 78, 72, 58, 45, 68, 82, 55, 48, 35, 65, 78, 60, 45, 38, 80, 88, 68, 50, 95, 85, 62, 42, 35, 70, 78, 52, 58, 28, 32, 72, 75, 55];

  return (
    <div className="w-full rounded-2xl bg-[#0A0A0A] border border-white/10 shadow-2xl overflow-hidden" id="audio-rack-unit">
      
      {/* Rack Mount Top Panel Header */}
      <div className="flex items-center justify-between bg-black/40 border-b border-white/10 px-5 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5" id="mock-hardware-screws">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1A1A1A] border border-white/15 block shadow-sm shadow-black"></span>
            <span className="hidden sm:inline-block h-2.5 w-2.5 rounded-full bg-[#1A1A1A] border border-white/15 shadow-sm shadow-black"></span>
          </div>
          <span className="font-mono text-2xs uppercase tracking-widest text-[#f97316]">DIGITAL RACK UNIT // CORE.DSP01</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${isPlaying ? 'bg-brand-green shadow-lg studio-glow-green animate-pulse' : 'bg-brand-pink'}`} />
          <span className="font-mono text-[10px] uppercase font-bold text-white/50">
            {isPlaying ? 'ENGINE ACTIVE' : 'ENGINE STANDBY'}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Track Metadata and Status Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-brand-green font-semibold">Ready for Audition</span>
            <h3 className="font-display text-lg font-bold text-white tracking-tight mt-0.5">{songName}</h3>
            <p className="font-sans text-xs text-white/40 mt-1">
              Engineered Preset: <span className="font-mono text-white/70">{presetName}</span>
              {referenceApplied && <span className="text-white/45"> • Dynamic Reference Guidance Applied</span>}
            </p>
          </div>

          {/* Mode Switch Controller: BEFORE VS AFTER */}
          <div className="flex rounded-xl bg-black p-1 border border-white/10 shadow-inner" id="before-after-switch">
            <button
              onClick={() => setMixMode('original')}
              className={`rounded-lg px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                mixMode === 'original'
                  ? 'bg-brand-pink/15 text-brand-pink border border-brand-pink/30 studio-glow-pink'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Original Dry
            </button>
            <button
              onClick={() => setMixMode('mixed')}
              className={`rounded-lg px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                mixMode === 'mixed'
                  ? 'bg-brand-green/15 text-brand-green border border-brand-green/30 studio-glow-green'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              AI Studio Mix
            </button>
          </div>
        </div>

        {/* Double Parallel Waveform with interactive seeker */}
        <div className="relative rounded-xl bg-black p-4 border border-white/10 shadow-inner">
          
          {/* Signal Indicator background layer */}
          <div className="absolute top-2 right-3 font-mono text-[9px] tracking-tight uppercase text-white/30 select-none">
            {mixMode === 'mixed' ? 'DSP ANALOG CORRECTION' : 'RAW BYPASS DRY'}
          </div>

          <div className="space-y-4 py-2">
            {/* Waveform Visualization Bars */}
            <div className="h-20 flex items-end justify-between gap-[3px] opacity-90 relative">
              {mixMode === 'mixed' ? (
                // AI Studio Mix Waveform
                mixedWaveforms.map((h, i) => {
                  const barProgress = (i / mixedWaveforms.length) * 120; // 120s max duration
                  const isPlayed = progress >= barProgress;
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${h}%`,
                        backgroundColor: isPlayed ? 'var(--color-brand-green)' : 'rgba(255,255,255,0.08)',
                        boxShadow: isPlayed ? '0 0 10px rgba(249, 115, 22, 0.4)' : 'none',
                        transition: 'background-color 0.1s ease, height 0.1s ease'
                      }}
                    />
                  );
                })
              ) : (
                // Original Dry Waveform
                dryWaveforms.map((h, i) => {
                  const barProgress = (i / dryWaveforms.length) * 120;
                  const isPlayed = progress >= barProgress;
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${h}%`,
                        backgroundColor: isPlayed ? 'var(--color-brand-pink)' : 'rgba(255,255,255,0.08)',
                        boxShadow: isPlayed ? '0 0 10px rgba(244, 63, 94, 0.4)' : 'none',
                        transition: 'background-color 0.1s ease, height 0.1s ease'
                      }}
                    />
                  );
                })
              )}

              {/* Slider Seeker overlay */}
              <input
                type="range"
                min="0"
                max="120"
                step="0.1"
                value={progress}
                onChange={handleSeekChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                id="waveform-range-seeker"
              />
            </div>

            {/* Time counters */}
            <div className="flex justify-between font-mono text-2xs text-white/30 font-mono">
              <span>{formatTime(progress)}</span>
              <span>120s Demo Limit</span>
              <span>{formatTime(120)}</span>
            </div>
          </div>
        </div>

        {/* Console Controls Desk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Main Buttons */}
          <div className="lg:col-span-5 flex items-center space-x-4">
            <button
              onClick={handlePlayToggle}
              id="player-play-btn"
              className={`flex h-14 w-14 items-center justify-center rounded-full text-black font-bold transition-all duration-300 transform hover:scale-105 ${
                isPlaying 
                  ? 'bg-brand-cyan hover:bg-brand-cyan shadow-lg studio-glow-cyan' 
                  : 'bg-brand-green hover:bg-brand-green shadow-lg studio-glow-green'
              }`}
            >
              {isPlaying ? <Pause className="h-6 w-6 stroke-[3px]" /> : <Play className="h-6 w-6 stroke-[3px] ml-1" />}
            </button>

            <button
              onClick={handleReset}
              id="player-reset-btn"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-all border border-white/10"
              title="Reset Track"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Hardware VU Meter Block */}
            <div className="flex-1 bg-black rounded-xl p-3 border border-white/10 flex flex-col justify-center space-y-1.5 h-14">
              <div className="flex items-center justify-between font-mono text-[8px] text-white/30">
                <span>VU L</span>
                <span>VU R</span>
              </div>
              <div className="space-y-1">
                {/* L Meter */}
                <div className="h-1.5 bg-white/5 rounded-sm overflow-hidden flex">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-green via-brand-cyan to-brand-pink" 
                    style={{ width: `${isPlaying ? vUMeters.left : 0}%`, transition: 'width 0.15s ease-out' }}
                  />
                </div>
                {/* R Meter */}
                <div className="h-1.5 bg-white/5 rounded-sm overflow-hidden flex">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-green via-brand-cyan to-brand-pink" 
                    style={{ width: `${isPlaying ? vUMeters.right : 0}%`, transition: 'width 0.15s ease-out' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Hardware Controls & Tuning details */}
          <div className="lg:col-span-3 flex items-center space-x-3 bg-white/[0.01] p-2.5 rounded-xl border border-white/10 h-14">
            <Volume2 className="h-4 w-4 text-white/40 shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between font-mono text-3xs text-white/30">
                <span>VOL LIMIT</span>
                <span>{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full accent-brand-green bg-white/10 h-1 rounded-lg appearance-none mt-1 cursor-pointer"
              />
            </div>
          </div>

          {/* Preset parameters summary */}
          <div className="lg:col-span-4 flex items-center justify-end space-x-1.5 font-mono text-2xs text-white/40">
            <Sparkles className="h-3.5 w-3.5 text-brand-green" />
            <span>Tone: {settings.vocalBrightness}% Cln • Pitch Corrector: {settings.autoTuneStrength}%</span>
          </div>

        </div>

        {/* Master Output Download Dashboard Area */}
        <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-2 text-white/40 text-xs">
            <ShieldCheck className="h-4 w-4 text-brand-green" strokeWidth={2} />
            <span className="font-sans">This master is fully compliant with Spotify, Apple Music & SoundCloud loudness benchmarks (-14 LUFS).</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Download MP3 */}
            <button
              onClick={() => handleDownload('mp3')}
              id="player-download-mp3"
              disabled={downloadingFormat !== null}
              className="flex items-center space-x-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold px-4 py-2.5 text-white/90 border border-white/10 transition-colors disabled:opacity-50"
            >
              {downloadingFormat === 'mp3' ? (
                <span className="flex items-center space-x-1">
                  <span className="h-3 w-3 animate-spin border-2 border-white/40 border-t-transparent rounded-full" />
                  <span>Preparing...</span>
                </span>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  <span>Download MP3</span>
                </>
              )}
            </button>

            {/* Download WAV Pro Button */}
            {showProUpgrade ? (
              <button
                onClick={onUpgradeClick}
                id="player-download-wav-locked"
                className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-brand-pink/20 to-brand-green/20 hover:from-brand-pink/30 hover:to-brand-green/30 text-xs font-semibold px-4 py-2.5 text-brand-pink border border-brand-pink/30 transition-all shadow-md shadow-brand-pink/5"
              >
                <span>Download WAV (Lossless)</span>
                <span className="rounded bg-brand-pink text-[9px] px-1.5 py-0.5 uppercase text-white font-bold font-mono tracking-tight shadow-sm">Pro</span>
              </button>
            ) : (
              <button
                onClick={() => handleDownload('wav')}
                id="player-download-wav-unlocked"
                disabled={downloadingFormat !== null}
                className="flex items-center space-x-2 rounded-xl bg-brand-green text-zinc-950 font-bold text-xs px-4 py-2.5 transition-all shadow-md shadow-brand-green/10"
              >
                {downloadingFormat === 'wav' ? (
                  <span className="flex items-center space-x-1">
                    <span className="h-3 w-3 animate-spin border-2 border-zinc-950 border-t-transparent rounded-full" />
                    <span>Rendering...</span>
                  </span>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" />
                    <span>Download WAV</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>

      <div className="bg-black px-6 py-2.5 border-t border-white/10 text-3xs font-mono text-white/30 flex justify-between items-center">
        <span>STABILIZER BYPASS: DISABLED</span>
        <span>LATENCY: 8ms (COMPENSATED)</span>
        <span>OUTPUT FORMAT: stereo 24-bit PCM 48kHz</span>
      </div>

    </div>
  );
}
