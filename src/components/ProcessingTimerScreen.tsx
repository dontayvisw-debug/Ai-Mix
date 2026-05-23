import React, { useEffect, useState } from 'react';
import { Activity, Clock, Timer, CheckCircle, AlertOctagon } from 'lucide-react';
import { toast } from 'sonner';

export type JobType = 'singleMix' | 'masteringOnly' | 'artistMonthlyMix' | 'proArtistMix' | 'revision';

interface ProcessingTimerScreenProps {
  isOpen: boolean;
  onComplete: () => void;
  onCancel: () => void;
  jobType: JobType;
}

const MIXING_STAGES = [
  { label: "Reading uploaded audio files", percent: 10 },
  { label: "Analyzing Voice DNA", percent: 20 },
  { label: "Detecting BPM and key", percent: 30 },
  { label: "Checking noise, mud, harshness, and sibilance", percent: 40 },
  { label: "Choosing a voice-adaptive vocal chain", percent: 50 },
  { label: "Setting pitch correction direction", percent: 60 },
  { label: "Balancing vocal with the 2-track instrumental", percent: 70 },
  { label: "Applying EQ, compression, de-essing, delay, and reverb", percent: 80 },
  { label: "Preparing mix preview", percent: 90 },
  { label: "Preparing export options", percent: 100 }
];

const MASTERING_STAGES = [
  { label: "Reading finished mix", percent: 15 },
  { label: "Analyzing loudness and tonal balance", percent: 30 },
  { label: "Checking low-end and brightness", percent: 45 },
  { label: "Applying final EQ balance", percent: 60 },
  { label: "Applying compression and limiting", percent: 75 },
  { label: "Preparing master preview", percent: 90 },
  { label: "Preparing export options", percent: 100 }
];

const REVISION_STAGES = [
  { label: "Reading revision request", percent: 15 },
  { label: "Adjusting vocal balance and effects", percent: 40 },
  { label: "Rebuilding preview mix", percent: 70 },
  { label: "Preparing revised download options", percent: 100 }
];

const PROCESSING_TIPS = [
  "Cleaner dry vocals usually create better mixes.",
  "Pitch correction works best when the song key is correct.",
  "Adlibs usually sound better when they are tucked lower and wider than the lead.",
  "Mastering works best when the mix is already balanced.",
  "WAV 48kHz exports are better for release prep and archiving."
];

const PROCESSING_TIMES: Record<JobType, number> = {
  singleMix: 180, // 3 minutes
  masteringOnly: 90, // 1 minute 30 seconds
  artistMonthlyMix: 150, // 2 minutes 30 seconds
  proArtistMix: 120, // 2 minutes
  revision: 60 // 1 minute
};

// Formats seconds into MM:SS
const formatTime = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export default function ProcessingTimerScreen({
  isOpen,
  onComplete,
  onCancel,
  jobType
}: ProcessingTimerScreenProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(30);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const isMastering = jobType === 'masteringOnly';
  const isRevision = jobType === 'revision';
  const isMixing = !isMastering && !isRevision;

  const stages = isMastering ? MASTERING_STAGES : isRevision ? REVISION_STAGES : MIXING_STAGES;

  const title = isMixing ? "mixedbytae is mixing your song…" : isMastering ? "mixedbytae is mastering your song…" : "mixedbytae is preparing your revision…";
  
  const subtext = isMixing 
    ? "Balancing your vocals with the 2-track instrumental, applying pitch correction, effects, and modern vocal processing."
    : isMastering
    ? "Adding final loudness, polish, EQ balance, and release-ready consistency."
    : "Applying your requested changes and creating a new preview.";

  useEffect(() => {
    if (!isOpen) return;

    setElapsedTime(0);
    setProgress(0);
    setCurrentStage(stages[0].label);
    setCancelModalOpen(false);
    setTipIndex(0);

    const totalSeconds = PROCESSING_TIMES[jobType] || 180;
    setEstimatedTime(totalSeconds);
    setTimeRemaining(totalSeconds);

    const tInterval = setInterval(() => {
      setTipIndex(t => (t + 1) % PROCESSING_TIPS.length);
    }, 6000);

    return () => clearInterval(tInterval);
  }, [isOpen, jobType, stages]);

  useEffect(() => {
    if (!isOpen || cancelModalOpen) return;

    const tickMs = 1000;
    
    // We update every second.
    const interval = setInterval(() => {
      setElapsedTime(prev => {
        const next = prev + 1;
        const remaining = Math.max(0, estimatedTime - next);
        setTimeRemaining(remaining);
        
        // Compute progress % based on time
        const newProgress = Math.min(100, Math.floor((next / estimatedTime) * 100));
        setProgress(newProgress);
        
        let activeStage = stages[0].label;
        for (let i = 0; i < stages.length; i++) {
          if (newProgress >= stages[i].percent) {
            if (i === stages.length - 1 || newProgress < stages[i + 1].percent) {
              activeStage = stages[i].label;
            }
          }
        }
        setCurrentStage(activeStage);

        if (next >= estimatedTime) {
          clearInterval(interval);
          setTimeout(() => {
            if (isMastering) {
              toast.success("Master complete. Your preview is ready.");
            } else if (isRevision) {
              toast.success("Revision complete. Your updated preview is ready.");
            } else {
              toast.success("Mix complete. Your preview is ready.");
            }
            onComplete();
          }, 1000);
        }
        
        return next;
      });
    }, tickMs);

    return () => clearInterval(interval);
  }, [isOpen, cancelModalOpen, estimatedTime, onComplete, stages, isMastering, isRevision]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fadeIn" id="processing-timer-overlay">
      <div className="w-full max-w-2xl rounded-3xl bg-[#0A0A0A] border border-white/10 shadow-3xl p-6 sm:p-10 space-y-8 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        
        <div className="text-center space-y-3">
          <h2 className="font-display text-4xl font-black tracking-tight text-white animate-pulse">{title}</h2>
          <p className="font-sans text-sm text-white/50 max-w-md mx-auto leading-relaxed">{subtext}</p>
        </div>

        <div className="bg-black border border-white/5 rounded-2xl p-6 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-[#10b981] opacity-[0.03] w-32 h-32 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5">
            <div>
              <span className="font-mono text-[10px] uppercase text-white/40 tracking-wider">Current Stage</span>
              <p className="font-sans text-base font-bold text-[#10b981] mt-1 pr-4 leading-tight">{currentStage}</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-[10px] uppercase text-white/40 tracking-wider">Progress</span>
              <p className="font-mono text-3xl font-black text-white">{progress}%</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="w-full h-2.5 bg-[#050505] rounded-full overflow-hidden border border-white/10 p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-brand-cyan to-[#10b981] rounded-full shadow-lg studio-glow-green" 
                style={{ width: `${progress}%`, transition: 'width 1s linear' }}
              />
            </div>
            
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center space-x-2 text-white/60">
                <Clock className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">Elapsed time</span>
                  <span className="font-mono text-xs">{formatTime(elapsedTime)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <Timer className="h-4 w-4 text-[#10b981]" />
                <div className="flex flex-col text-right">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#10b981]">Estimated remaining</span>
                  <span className="font-mono text-sm font-bold">{formatTime(timeRemaining)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Animated waveform placeholder */}
          <div className="h-16 flex items-center justify-center space-x-1 opacity-50 py-2">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i} 
                className="w-1.5 bg-[#10b981] rounded-full animate-waveform"
                style={{ 
                  height: `${Math.max(10, Math.random() * 100)}%`,
                  animationDuration: `${0.5 + Math.random()}s`,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
              />
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-brand-cyan/5 border border-brand-cyan/10 text-center min-h-[70px] flex items-center justify-center transition-all duration-300">
          <p className="font-sans text-[11px] text-white/80 font-medium">
            <Sparkles className="h-3 w-3 inline-block mr-1.5 text-brand-cyan" />
            {PROCESSING_TIPS[tipIndex]}
          </p>
        </div>

        <div className="text-center">
          <p className="font-sans text-[10px] text-white/30 uppercase tracking-widest font-bold mb-4">Please do not close this page during processing</p>
          <button 
            onClick={() => setCancelModalOpen(true)}
            className="text-white/40 hover:text-white pb-1 border-b border-white/20 hover:border-white text-xs transition-colors"
          >
            Cancel Processing
          </button>
        </div>

      </div>

      {cancelModalOpen && (
        <div className="absolute inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#050505] border border-white/10 rounded-2xl p-6 text-center space-y-6">
            <div className="flex justify-center text-red-500 mb-2">
              <AlertOctagon className="h-10 w-10" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white mb-2">Are you sure you want to cancel this process?</h3>
              <p className="font-sans text-xs text-white/50">Your progress will be lost and the processing session will safely terminate.</p>
            </div>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => setCancelModalOpen(false)}
                className="w-full py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                Keep Processing
              </button>
              <button 
                onClick={() => {
                  setCancelModalOpen(false);
                  toast.info("Processing canceled. No credits were used in this demo.");
                  onCancel();
                }}
                className="w-full py-3 rounded-xl bg-white/5 text-white/60 hover:text-white font-bold text-xs uppercase tracking-wider border border-white/10 hover:border-white/20 transition-all"
              >
                Cancel Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
