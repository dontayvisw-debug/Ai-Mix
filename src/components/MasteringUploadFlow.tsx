import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Headphones, 
  Sparkle, 
  Sparkles, 
  HelpCircle, 
  SlidersHorizontal, 
  UploadCloud, 
  Clock, 
  X, 
  Activity, 
  Volume2, 
  Lock, 
  CheckCircle,
  PlayCircle
} from 'lucide-react';
import UploadDropzone from './UploadDropzone';
import SettingsSlider from './SettingsSlider';
import DisclaimerBanner from './DisclaimerBanner';
import TutorialVideoSection from './TutorialVideoSection';
import { UploadedFile, FileType } from '../types';

interface MasteringUploadFlowProps {
  userPlan: string;
  onComplete: (trackName: string, styleName: string, settings: any, referenceName?: string) => void;
  onUpgradeClick: () => void;
  onProcessStart?: () => void;
}

export const MASTERING_STYLES = [
  { id: 'clean-streaming', name: 'Clean Streaming Master', desc: 'Drives maximum transparent volume optimized for Spotify & Apple Music algorithms.' },
  { id: 'loud-rap', name: 'Loud Rap Master', desc: 'Saturates vocal presence, slamming sub-frequencies hard with aggressive brickwall ceilings.' },
  { id: 'warm-rnb', name: 'Warm R&B Master', desc: 'Emulates historical vacuum tube tape reels, adding cozy mid-end harmonics & width.' },
  { id: 'punchy-trap', name: 'Punchy Trap Master', desc: 'Fast attacks, crisp transient controllers to let sharp hi-hats and heavy 808s pop.' },
  { id: 'bright-pop', name: 'Bright Pop Master', desc: 'Shimmers treble air bands (12kHz and up) to elevate vocals into contemporary glossy space.' },
  { id: 'dark-underground', name: 'Dark Underground Master', desc: 'Attenuates harsh sibilants, centering lower midranges representing lo-fi soundscapes.' },
  { id: 'natural-dynamic', name: 'Natural Dynamic Master', desc: 'Preserves raw performance headroom, avoiding heavy limiting squash for live bands.' },
];

export default function MasteringUploadFlow({
  userPlan,
  onComplete,
  onUpgradeClick,
  onProcessStart
}: MasteringUploadFlowProps) {
  const [songFile, setSongFile] = useState<UploadedFile | null>(null);
  const [referenceFile, setReferenceFile] = useState<UploadedFile | null>(null);

  const [uploadState, setUploadState] = useState<{ song: boolean; reference: boolean }>({ song: false, reference: false });
  const [progressState, setProgressState] = useState<{ song: number; reference: number }>({ song: 0, reference: 0 });

  const [selectedStyle, setSelectedStyle] = useState(MASTERING_STYLES[0]);
  const [loudnessTarget, setLoudnessTarget] = useState<'-14' | '-10' | '-8' | '-6'>('-14');
  
  // Mastering sliders
  const [sliders, setSliders] = useState({
    loudness: 75,
    warmth: 40,
    brightness: 60,
    bassTightness: 50,
    width: 65,
    limitingStrength: 70
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleUpload = (type: 'song' | 'ref', file: File) => {
    setUploadState(p => ({ ...p, [type]: true }));
    setProgressState(p => ({ ...p, [type]: 0 }));
    setErrorText(null);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 12;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        const uploaded: UploadedFile = {
          id: `master-${type}-${Date.now()}`,
          name: file.name,
          size: file.size,
          type: type === 'song' ? 'vocal' : 'reference'
        };

        if (type === 'song') setSongFile(uploaded);
        else setReferenceFile(uploaded);

        setUploadState(p => ({ ...p, [type]: false }));
      }
      setProgressState(p => ({ ...p, [type]: Math.min(progress, 100) }));
    }, 120);
  };

  const handleRemove = (type: 'song' | 'ref') => {
    if (type === 'song') setSongFile(null);
    else setReferenceFile(null);
  };

  const startMasteringRun = () => {
    setErrorText(null);
    if (!songFile) {
      setErrorText("Missing Finished Song. Please upload your balanced mix file to continue.");
      return;
    }

    if (onProcessStart) {
      // Defer completion to parent which uses the unified ProcessingTimerScreen
      onProcessStart();
      setTimeout(() => {
        onComplete(
          `${songFile.name.split('.')[0]} (${selectedStyle.name})`,
          selectedStyle.name,
          {
            vocalBrightness: sliders.brightness,
            vocalWarmth: sliders.warmth,
            autoTuneStrength: 0,
            reverbAmount: 10,
            delayAmount: 0,
            vocalLoudness: 50,
            compressionStrength: sliders.bassTightness,
            masterLoudness: sliders.loudness
          },
          referenceFile?.name
        );
      }, 90000); // Wait for mastering time
    }
  };

  return (
    <div className="space-y-10" id="mastering-upload-flow-wrapper">
      
      {/* Upload layout interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column - uploads + selector */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Upload Dropzones */}
          <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 bg-gradient-to-br from-white/[0.01] to-black/[0.02] text-left space-y-5">
            <div>
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-1.5/2 gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-brand-pink/20 text-brand-pink font-mono text-[10px] font-bold">1</span>
                <span>Upload Finished Mix File</span>
              </h3>
              <p className="font-sans text-3xs text-white/40 mt-1">Provide your final balanced mixdown. Ensure there is plenty of dynamic headroom with no clipping effects.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UploadDropzone
                type="vocal"
                label="Finished Mixed Song (Required)"
                required={true}
                description="Upload your final balanced mix file. (WAV preferred for distribution lossless)"
                uploadedFile={songFile}
                onFileSelect={(f) => handleUpload('song', f)}
                onFileRemove={() => handleRemove('song')}
                isUploading={uploadState.song}
                uploadProgress={progressState.song}
              />

              <UploadDropzone
                type="reference"
                label="OPTIONAL reference target file"
                required={false}
                description="Upload an official Eilish or Drake master track. Our nodes extract spectral dynamics."
                uploadedFile={referenceFile}
                onFileSelect={(f) => handleUpload('ref', f)}
                onFileRemove={() => handleRemove('ref')}
                isUploading={uploadState.reference}
                uploadProgress={progressState.reference}
              />
            </div>

            {/* Mastering Advice Warning */}
            <DisclaimerBanner type="upload-master" />
          </div>

          {/* Mastering styles selector cards */}
          <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 text-left space-y-6 animate-fadeIn">
            <div>
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-1.5/2 gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-brand-pink/20 text-brand-pink font-mono text-[10px] font-bold">2</span>
                <span>Select Mastering Style Preset</span>
              </h3>
              <p className="font-sans text-3xs text-white/40 mt-1">Our sound models configure thresholds, dynamics, and EQ curves matching historical templates.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
              {MASTERING_STYLES.map((style) => (
                <div
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  id={`master-style-${style.id}`}
                  className={`rounded-xl border p-4 cursor-pointer text-left transition-all ${
                    selectedStyle.id === style.id
                      ? 'border-brand-pink bg-brand-pink/[0.01]'
                      : 'border-white/5 bg-black/40 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center gap-2">
                    <h5 className="font-display text-xs font-bold text-white">{style.name}</h5>
                    {selectedStyle.id === style.id && <span className="h-2 w-2 rounded-full bg-brand-pink block shadow studio-glow-pink animate-pulse" />}
                  </div>
                  <p className="font-sans text-[11px] text-white/50 mt-1.5 leading-relaxed">{style.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column - settings sliders + final cta */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Hardware Loudness choice */}
          <div className="rounded-2xl border border-white/5 bg-[#0A0A0A] p-5 text-left space-y-4">
            <div className="space-y-1">
              <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="h-4.5 w-4.5 text-brand-pink" />
                <span>Target LUFS Loudness</span>
              </h4>
              <p className="font-sans text-3xs text-white/40 leading-normal">Configure final master brickwall ceiling limits.</p>
            </div>

            <div className="grid grid-cols-4 gap-1.5 bg-black p-1 rounded-xl border border-white/10">
              {([
                { val: '-14', l: 'Spotify' },
                { val: '-10', l: 'Club' },
                { val: '-8', l: 'Loud' },
                { val: '-6', l: 'Heavy' }
              ]).map((cell) => (
                <button
                  key={cell.val}
                  onClick={() => setLoudnessTarget(cell.val as any)}
                  className={`rounded-lg py-2 flex flex-col items-center justify-center transition-all ${
                    loudnessTarget === cell.val
                      ? 'bg-brand-pink/15 text-brand-pink border border-brand-pink/30 font-bold'
                      : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  <span className="font-mono text-2xs font-extrabold">{cell.val}</span>
                  <span className="font-sans text-[8px] text-white/30 uppercase mt-0.5">{cell.l}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dials for fine tuning */}
          <div className="rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] p-5 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
              <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="h-4.5 w-4.5 text-brand-pink" />
                <span>Limiter EQ Controls</span>
              </h4>
              <button
                onClick={() => setSliders({ loudness: 75, warmth: 40, brightness: 60, bassTightness: 50, width: 65, limitingStrength: 70 })}
                className="font-mono text-4xs uppercase text-white/30 hover:text-brand-pink"
              >
                Reset
              </button>
            </div>

            <div className="space-y-3.5">
              <SettingsSlider
                id="mast-loud"
                label="Ceiling Gain Drive"
                description="Controls how hard the limiter boosts low-frequency presence to final competitive ceilings."
                value={sliders.loudness}
                onChange={(val) => setSliders(p => ({ ...p, loudness: val }))}
              />
              <SettingsSlider
                id="mast-warm"
                label="Analog Warmth (Tape)"
                description="Injects harmonic third-order tube saturator warmth into stereophonic channels."
                value={sliders.warmth}
                onChange={(val) => setSliders(p => ({ ...p, warmth: val }))}
              />
              <SettingsSlider
                id="mast-bright"
                label="Aesthetic Treble Air"
                description="Excites high shelving bands (10kHz+) adding expensive studio shimmer."
                value={sliders.brightness}
                onChange={(val) => setSliders(p => ({ ...p, brightness: val }))}
              />
              <SettingsSlider
                id="mast-bass"
                label="Transient Kick Compressor"
                description="Tightens muddy low end frequencies (20-100Hz) to prevent clipping squashing."
                value={sliders.bassTightness}
                onChange={(val) => setSliders(p => ({ ...p, bassTightness: val }))}
              />
            </div>
          </div>

          {/* Final generate masters button */}
          <div className="space-y-4">
            {errorText && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-left text-xs text-rose-450 font-sans leading-normal">
                {errorText}
              </div>
            )}

            <button
              onClick={startMasteringRun}
              id="start-mastering-submit"
              className="w-full py-4 text-xs font-black uppercase tracking-wider text-black bg-[#f43f5e] hover:bg-rose-500 rounded-2xl shadow-lg studio-glow-pink transition-all transform hover:scale-102 flex items-center justify-center space-x-2"
            >
              <Sparkles className="h-4 w-4 animate-pulse shrink-0" />
              <span>Render Lossless Master</span>
            </button>

            <span className="font-sans text-[10px] text-white/30 text-center uppercase tracking-wider block">
              Processing sessions cost 1 mastering session credit. Free members get 5 credits.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
