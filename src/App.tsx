import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play,
  CreditCard,
  Sparkle, 
  Layers, 
  Headphones, 
  Mic2, 
  Flame, 
  Music, 
  ArrowRight, 
  HelpCircle, 
  ChevronRight, 
  Sparkles, 
  ListMusic, 
  SlidersHorizontal,
  HardDrive,
  Info,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  User,
  Activity,
  AlertTriangle,
  PlayCircle
} from 'lucide-react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UploadDropzone from './components/UploadDropzone';
import StyleSelector, { MIX_PRESETS } from './components/StyleSelector';
import SettingsSlider from './components/SettingsSlider';
import AudioPlayer from './components/AudioPlayer';
import ProcessingTimerScreen, { JobType } from './components/ProcessingTimerScreen';
import PricingCard, { PRO_ARTIST_PRICE } from './components/PricingCard';
import DashboardMixCard from './components/DashboardMixCard';

// Core updates imports
import ServiceSelection from './components/ServiceSelection';
import MasteringUploadFlow from './components/MasteringUploadFlow';
import TutorialVideoSection from './components/TutorialVideoSection';
import FAQSection from './components/FAQSection';
import DisclaimerBanner from './components/DisclaimerBanner';
import BillingSection from './components/BillingSection';
import UpgradeModal from './components/UpgradeModal';
import WAVUpgradeModal from './components/WAVUpgradeModal';
import RevisionRequest from './components/RevisionRequest';
import DemoSongGeneratorPlaceholder from './components/DemoSongGeneratorPlaceholder';

// Individual WAV Demo Assets, Drag-and-Drop + DSP Chains
import MultiFileUploadDropzone from './components/MultiFileUploadDropzone';
import SessionFileMapper, { SessionFile, FileRole } from './components/SessionFileMapper';
import AIEngineerAnalysis from './components/AIEngineerAnalysis';
import PitchCorrectionPanel, { PitchCorrectionMode } from './components/PitchCorrectionPanel';
import AIEngineerChain from './components/AIEngineerChain';
import RealVocalDemo from './components/RealVocalDemo';
import AITutorialVideoBuilder from './components/AITutorialVideoBuilder';
import ContactSupport from './components/ContactSupport';
import AdminPanel from './components/AdminPanel';
import { toast } from 'sonner';

import { UploadedFile, MixSettings, ReferenceAnalysis, MixHistoryItem, FileType } from './types';
import { getUserMixHistory, analyzeReferenceTrack, UserCreditsProfile, activateCreditsAfterPayment } from './utils/audioService';

const SLIDERS_META = [
  { id: 'vocalBrightness', label: "Vocal Shimmer (Presence)", description: "Boosts high-end vocal frequencies to cut through the beat with modern studio 'air'." },
  { id: 'vocalWarmth', label: "Digital Saturation (Warmth)", description: "Mimics vintage tube micro-preamps, adding cozy depth and rich harmonic body layers." },
  { id: 'autoTuneStrength', label: "AutoTune Pitch Strength", description: "Automatically stabilizes vocal notes. 0% is organic, 100% hard-locks to scales for heavy modern style." },
  { id: 'reverbAmount', label: "Ambient Space (Reverb)", description: "Simulates classic studio plate rooms for depth and width around vocals." },
  { id: 'delayAmount', label: "Dynamic Stereo Delay", description: "Injects timed slapback echoes, widening spatial placement across left-right speaker arrays." },
  { id: 'vocalLoudness', label: "Vocal Center Gain", description: "Sets exactly how high your voice commands prominence in front of the backend beat." },
  { id: 'compressionStrength', label: "Dynamics Compression", description: "Smooths volume variance. Brings quiet details forward and keeps peaks safely controlled." },
  { id: 'masterLoudness', label: "Limiter Ceiling Boost", description: "Drives final masters to stream-competitive target levels (aligned with Spotify limit maps)." }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [hasRefreshed, setHasRefreshed] = useState(false);
  const [userEmail] = useState<string>("Dontayvisw@gmail.com");
  
  // Custom integrated state variables
  const [userPlan, setUserPlan] = useState<string>("Free Tier");
  const [serviceType, setServiceType] = useState<'mix' | 'master' | null>(null);
  const [dashboardTab, setDashboardTab] = useState<'history' | 'billing'>('history');
  
  const [creditsProfile, setCreditsProfile] = useState<UserCreditsProfile>({
    userPlan: "Free Tier",
    mixCredits: 5, // user starts with standard mixing credits
    masteringCredits: 5, // user starts with standard mastering credits
    mixesUsedThisMonth: 0,
    masteringAccess: false,
    wavExportAccess: 'none'
  });

  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [wavUpgradeModalOpen, setWavUpgradeModalOpen] = useState(false);
  
  // Multi-File Drag-and-Drop system state
  // Demo assets are individual WAV files, not a ZIP.
  // mix this 77 bpm.wav is the 2-track instrumental.
  // Demo song is 77 BPM in F# minor.
  const [sessionFiles, setSessionFiles] = useState<SessionFile[]>([]);
  const [sessionConfirmed, setSessionConfirmed] = useState<boolean>(false);
  
  // Custom Autotune Pitch states
  const [songKey, setSongKey] = useState<string>('F# minor');
  const [bpm, setBpm] = useState<number>(77);
  const [pitchCorrectionMode, setPitchCorrectionMode] = useState<PitchCorrectionMode>('modern_clean');
  const [retuneSpeed, setRetuneSpeed] = useState<string>('medium-fast');
  const [humanize, setHumanize] = useState<string>('medium');
  const [isDemoJob, setIsDemoJob] = useState<boolean>(false);

  // Mix list
  const [mixHistory, setMixHistory] = useState<MixHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Active Audit Audition State
  const [auditionMix, setAuditionMix] = useState<{
    songName: string;
    presetName: string;
    settings: MixSettings;
    referenceName?: string;
  } | null>(null);

  // Workshop upload state variables
  const [inputs, setInputs] = useState<{
    vocal: UploadedFile | null;
    beat: UploadedFile | null;
    backing: UploadedFile | null;
    reference: UploadedFile | null;
  }>({
    vocal: null,
    beat: null,
    backing: null,
    reference: null,
  });

  const [uploadProgress, setUploadProgress] = useState<Record<FileType, number>>({
    vocal: 0,
    beat: 0,
    backing: 0,
    reference: 0,
  });

  const [activeUploads, setActiveUploads] = useState<Record<FileType, boolean>>({
    vocal: false,
    beat: false,
    backing: false,
    reference: false,
  });

  // Reference analysis variables
  const [isAnalyzingRef, setIsAnalyzingRef] = useState(false);
  const [refAnalysis, setRefAnalysis] = useState<ReferenceAnalysis | null>(null);

  // Active configurations style
  const [selectedPreset, setSelectedPreset] = useState(MIX_PRESETS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [customSettings, setCustomSettings] = useState<MixSettings>({ ...MIX_PRESETS[0].defaultSettings });

  // Job trigger states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingJobType, setProcessingJobType] = useState<JobType>('singleMix');
  const [workshopError, setWorkshopError] = useState<string | null>(null);

  // Pre-load mock data on layout start
  useEffect(() => {
    const handleNavigateAdmin = () => {
      setCurrentTab('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('navigateToAdmin', handleNavigateAdmin as EventListener);

    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const history = await getUserMixHistory(userEmail);
        setMixHistory(history);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();

    return () => {
      window.removeEventListener('navigateToAdmin', handleNavigateAdmin as EventListener);
    };
  }, [userEmail]);

  const handleFileSelect = async (type: FileType, file: File) => {
    setActiveUploads(prev => ({ ...prev, [type]: true }));
    setUploadProgress(prev => ({ ...prev, [type]: 0 }));

    // Simulate chunk uploads to cloud nodes
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        setInputs(prev => ({
          ...prev,
          [type]: {
            id: `stem-${type}-${Date.now()}`,
            name: file.name,
            size: file.size,
            type: type,
            file: file
          }
        }));

        setActiveUploads(prev => ({ ...prev, [type]: false }));

        // Trigger reference analysis if reference track is dropped
        if (type === 'reference') {
          handleReferenceAnalysis(file);
        }
      }
      setUploadProgress(prev => ({ ...prev, [type]: Math.min(progress, 100) }));
    }, 180);
  };

  const handleFileRemove = (type: FileType) => {
    setInputs(prev => ({ ...prev, [type]: null }));
    if (type === 'reference') {
      setRefAnalysis(null);
    }
  };

  const handleReferenceAnalysis = async (file: File) => {
    setIsAnalyzingRef(true);
    try {
      const blueprint = await analyzeReferenceTrack(file.name);
      setRefAnalysis(blueprint);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingRef(false);
    }
  };

  const handlePresetSelect = (preset: typeof MIX_PRESETS[0]) => {
    setSelectedPreset(preset);
    setCustomSettings({ ...preset.defaultSettings });
  };

  const handleSliderValueChange = (field: keyof MixSettings, val: number) => {
    setCustomSettings(prev => ({ ...prev, [field]: val }));
  };

  const handleGenerateMixClick = () => {
    setWorkshopError(null);

    // Validate main dependencies
    if (!inputs.vocal) {
      setWorkshopError("Missing Dry Lead Vocal. Please map and confirm your lead voice stem to begin.");
      return;
    }
    if (!inputs.beat) {
      setWorkshopError("Missing 2-Track Beat. Please map and confirm your beat/instrumental track to begin.");
      return;
    }

    // Credits validation
    const hasUnlimited = userPlan === "Pro Artist";
    if (!hasUnlimited && creditsProfile.mixCredits <= 0) {
      setUpgradeModalOpen(true);
      return;
    }

    // Deduct 1 mix credit
    if (!hasUnlimited) {
      setCreditsProfile(p => ({
        ...p,
        mixCredits: Math.max(0, p.mixCredits - 1),
        mixesUsedThisMonth: p.mixesUsedThisMonth + 1
      }));
    }

    // Launch master processor
    setProcessingJobType(hasUnlimited ? 'proArtistMix' : (userPlan.includes('Monthly') ? 'artistMonthlyMix' : 'singleMix'));
    setIsProcessing(true);
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);

    // Build the newly completed track
    const newMix: MixHistoryItem = {
      id: `mix-${Date.now()}`,
      name: `${inputs.vocal?.name.split('.')[0] || 'Vocal'} (Studio Master)`,
      date: new Date().toISOString().split('T')[0],
      presetId: selectedPreset.id,
      presetName: selectedPreset.name,
      vocalName: inputs.vocal?.name || "lead_dry.mp3",
      beatName: inputs.beat?.name || "beat_2track.mp3",
      referenceName: inputs.reference?.name || undefined,
      status: 'completed',
      userSettings: { ...customSettings },
      originalDuration: '2:12',
      audioUrl: '/audio/newly_mastered_mix.mp3'
    };

    // Prepend to history stack and load active results panel
    setMixHistory(prev => [newMix, ...prev]);
    setAuditionMix({
      songName: newMix.name,
      presetName: newMix.presetName,
      settings: { ...customSettings },
      referenceName: newMix.referenceName
    });

    setCurrentTab('results');

    // Wipe temporary inputs to allow quick restarts on subsequent mixes!
    setInputs({
      vocal: null,
      beat: null,
      backing: null,
      reference: null
    });
    setRefAnalysis(null);
    setSessionConfirmed(false);
    setSessionFiles([]);
    setIsDemoJob(false);
  };

  const handleMasteringComplete = (trackName: string, styleName: string, settings: any, referenceName?: string) => {
    // Check mastering credentials
    const isPro = userPlan === "Pro Artist";
    const isMonthly = userPlan === "Artist Monthly";
    const hasCredits = creditsProfile.masteringCredits > 0 || creditsProfile.masteringAccess;
    
    if (!isPro && !isMonthly && !hasCredits) {
      setUpgradeModalOpen(true);
      return;
    }

    if (!isPro && !isMonthly) {
      setCreditsProfile(p => ({
        ...p,
        masteringCredits: Math.max(0, p.masteringCredits - 1)
      }));
    }

    // Build the newly completed master track
    const newMaster: MixHistoryItem = {
      id: `master-${Date.now()}`,
      name: `${trackName.split('.')[0] || 'Track'} (Studio Mastered)`,
      date: new Date().toISOString().split('T')[0],
      presetId: 'master-preset',
      presetName: styleName,
      vocalName: trackName,
      beatName: "Pre-balanced track",
      referenceName: referenceName || undefined,
      status: 'completed',
      userSettings: settings,
      originalDuration: '3:05',
      audioUrl: '/audio/newly_mastered_mix.mp3'
    };

    setMixHistory(prev => [newMaster, ...prev]);
    setAuditionMix({
      songName: newMaster.name,
      presetName: newMaster.presetName,
      settings: settings,
      referenceName: newMaster.referenceName
    });
    setCurrentTab('results');
  };

  const handleAuditionMixFromHistory = (mix: MixHistoryItem) => {
    if (mix.userSettings) {
      setAuditionMix({
        songName: mix.name,
        presetName: mix.presetName,
        settings: { ...mix.userSettings },
        referenceName: mix.referenceName
      });
      setCurrentTab('results');
    }
  };

  const handleUpgradeSuccess = (planName: string) => {
    let pId = "free";
    const nameLower = planName.toLowerCase();
    if (nameLower.includes("single")) pId = "single_mix_20";
    else if (nameLower.includes("mastering only") || nameLower.includes("mastering_only")) pId = "mastering_only_10";
    else if (nameLower.includes("monthly") || nameLower.includes("artist")) pId = "artist_monthly_75";
    else if (nameLower.includes("pro")) pId = "pro_artist";

    const updatedProfile = activateCreditsAfterPayment(userEmail, pId);
    setCreditsProfile(updatedProfile);
    setUserPlan(updatedProfile.userPlan);
    setCurrentTab('dashboard');
    toast.success(`Success! Upgraded to ${planName}.`, { description: 'Your dashboard credits have been successfully updated.' });
  };

  const handleBuyWavAddon = () => {
    setWavUpgradeModalOpen(false);
    setCreditsProfile(prev => ({
      ...prev,
      wavExportAccess: 'lossless_48k'
    }));
    toast.success("WAV Lossless Unlocked", { description: "WAV Lossless downloads successfully unlocked for your account history! Direct exports can now be run." });
  };

  const handleSelectOptionInUpgradeModal = (pId: 'single_mix_20' | 'mastering_only_10' | 'artist_monthly_75' | 'pro_artist') => {
    let pName = "Single Mix";
    if (pId === 'mastering_only_10') pName = "Mastering Only";
    else if (pId === 'artist_monthly_75') pName = "Artist Monthly";
    else if (pId === 'pro_artist') pName = "Pro Artist";
    
    handleUpgradeSuccess(pName);
    setUpgradeModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-black font-sans text-white/90 flex flex-col justify-between" id="mixmyvocal-root-wrapper">
      
      {/* Sticky Premium Navbar */}
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} userEmail={userEmail} />

      {/* Main Core View Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: LANDING PAGE */}
          {currentTab === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-24"
              id="landing-section"
            >
              
              {/* Hero Header Pitch */}
              <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-brand-pink/10 border border-white/10" id="landing-hero">
                <div className="absolute inset-0">
                  <img src="/brand/taedatarget-hero.png" alt="mixedbytae studio" className="w-full h-full object-cover opacity-30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
                </div>
                
                <div className="relative text-center sm:text-left space-y-6 max-w-4xl mx-auto px-6 py-16 sm:py-24 sm:px-12">
                  <div className="inline-flex items-center space-x-2 rounded-full bg-brand-pink/10 border border-brand-pink/30 px-3.5 py-1.5 font-mono text-xs font-semibold text-brand-pink shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                    <Sparkle className="h-4.5 w-4.5 animate-pulse text-brand-pink shrink-0" />
                    <span>Powered by taedatarget</span>
                  </div>
                  
                  <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1] text-balance">
                    Get your vocals <span className="bg-gradient-to-r from-red-500 via-brand-pink to-brand-pink/80 bg-clip-text text-transparent">mixedbytae</span>.
                  </h1>
                  
                  <p className="font-sans text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed text-balance">
                    Upload your dry vocals and 2-track beat, choose your sound, and get an AI-assisted mix preview with mastering and export options.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center sm:justify-start space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                    <button
                      onClick={() => {
                        const target = document.getElementById('workshop-section') || document.getElementById('features-how-it-works');
                        target?.scrollIntoView({ behavior: 'smooth' });
                        setCurrentTab('workshop');
                      }}
                      id="hero-start-mixing-btn"
                      className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-red-600 to-brand-pink hover:from-red-500 hover:to-rose-400 text-white px-8 py-4 text-sm font-extrabold uppercase tracking-wider transition-all duration-200 transform hover:scale-103 shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                    >
                      <span>Start Mixing — $20</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        document.getElementById('real-vocal-demo-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      id="hero-hear-demo-btn"
                      className="flex items-center space-x-2 rounded-xl bg-black/50 hover:bg-white/10 text-white border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-wider transition-colors backdrop-blur-md"
                    >
                      <Headphones className="h-4 w-4" />
                      <span>Hear Demo</span>
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap items-center sm:justify-start justify-center gap-4 pt-2">
                    <button
                      onClick={() => {
                        document.getElementById('tutorial-video-section-container')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      id="hero-watch-tutorial-btn"
                      className="flex items-center space-x-1.5 text-white/50 hover:text-white transition-colors py-2 text-xs font-bold uppercase tracking-wider"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>Watch Tutorial</span>
                    </button>
                    <button
                      onClick={() => {
                        document.getElementById('pricing-module-container')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      id="hero-view-pricing-btn"
                      className="flex items-center space-x-1.5 text-white/50 hover:text-white transition-colors py-2 text-xs font-bold uppercase tracking-wider"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>View Pricing</span>
                    </button>
                  </div>
                  
                  <p className="font-sans text-3xs text-white/40 uppercase tracking-widest font-semibold max-w-lg leading-relaxed select-none pt-4">
                    Built for rappers, singers, BandLab users, USB mic setups, and home studio artists.
                  </p>
                </div>
              </div>

              {/* Real Vocal Demo Deck Premium Section */}
              <div id="real-vocal-demo-section" className="scroll-mt-20">
                <RealVocalDemo onUpgradeClick={() => setCurrentTab('pricing')} />
              </div>

              {/* How it works grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left border-y border-white/5 py-16" id="features-how-it-works">
                <div className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A0A0A] text-white/90 font-mono text-sm font-bold border border-white/10">
                    01
                  </div>
                  <h4 className="font-display text-sm font-bold text-white uppercase tracking-tight">Upload Vocal & Beat</h4>
                  <p className="font-sans text-xs text-white/50 leading-relaxed">
                    Drop your 24-bit dry main audio file, your instrumental stereo track, and any optional adlib stems directly onto our portal.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A0A0A] text-white/90 font-mono text-sm font-bold border border-white/10">
                    02
                  </div>
                  <h4 className="font-display text-sm font-bold text-white uppercase tracking-tight">Select Sound Preset</h4>
                  <p className="font-sans text-xs text-white/50 leading-relaxed">
                    Pick from 10 distinct vocal styles—from upfront Drill bars to pitchlocked melodic trap singers—to set your foundational EQ targets.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A0A0A] text-white/90 font-mono text-sm font-bold border border-white/10">
                    03
                  </div>
                  <h4 className="font-display text-sm font-bold text-white uppercase tracking-tight">Match Reference Song</h4>
                  <p className="font-sans text-xs text-white/50 leading-relaxed">
                    Upload any reference track to extract and match its brightness, depth, and competitive loudness ratios.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A0A0A] text-white/90 font-mono text-sm font-bold border border-white/10">
                    04
                  </div>
                  <h4 className="font-display text-sm font-bold text-white uppercase tracking-tight">Refine & Download</h4>
                  <p className="font-sans text-xs text-white/50 leading-relaxed">
                    Nudge brightness sliders, adjust auto-reverb, balance dry voices, and render a pristine mastered preview ready for distribution.
                  </p>
                </div>
              </div>

              {/* Target Audience panels */}
              <div className="space-y-10" id="audiences">
                <div className="text-center space-y-2">
                  <span className="font-mono text-2xs uppercase tracking-widest text-brand-pink font-bold">RELEASE READY DESIGNS</span>
                  <h2 className="font-display text-2xl md:text-3xl font-black text-white">Engineered For Crucial Creators</h2>
                  <p className="font-sans text-xs text-white/60 max-w-md mx-auto">
                    Whether you record on high-end Neumann capsules or entry-level USB setups, our parameters adjust to cover acoustic inconsistencies.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                  <div className="rounded-xl border border-white/5 bg-[#0A0A0A] p-5 space-y-2">
                    <Headphones className="h-5 w-5 text-brand-green" />
                    <h5 className="font-display text-sm font-bold text-white">Rappers & Drill MCs</h5>
                    <p className="font-sans text-xs text-white/40">
                      Carve mid-frequency space from heavy distorted 808 beats. Ensure fast-paced rhyme syllables maintain clean transients and front-and-center focus.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-[#0A0A0A] p-5 space-y-2">
                    <Mic2 className="h-5 w-5 text-brand-cyan" />
                    <h5 className="font-display text-sm font-bold text-white">Melodic Singers & R&B Vocalists</h5>
                    <p className="font-sans text-xs text-white/40">
                      Apply tight vocal pitch corrections, rich stereo echoes (ping-pongs), and luxurious plate reverbs to create that glossy, expensive contemporary radio shimmer.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-[#0A0A0A] p-5 space-y-2">
                    <Flame className="h-5 w-5 text-brand-pink" />
                    <h5 className="font-display text-sm font-bold text-white">BandLab & Bed Room Artists</h5>
                    <p className="font-sans text-xs text-white/40">
                      Acoustic filters are set to sweep room resonances and headphone bleed. Level differences are equalized instantly so your vocals never drown behind beats.
                    </p>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 2: STUDIO WORKSHOP (MIX BUILDER & PORTALS) */}
          {currentTab === 'workshop' && (
            <div className="space-y-10" id="workshop-container-router">
              {serviceType === null ? (
                <motion.div
                  key="selection"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-12"
                >
                  <ServiceSelection 
                    onSelectService={(type) => setServiceType(type)} 
                    onGoToPricing={() => setCurrentTab('pricing')} 
                    proArtistPriceDisplay={PRO_ARTIST_PRICE} 
                  />
                  
                  <div className="border-t border-white/5 pt-10">
                    <TutorialVideoSection />
                  </div>
                  
                  <DisclaimerBanner type="general" />
                </motion.div>
              ) : serviceType === 'mix' ? (
                <motion.div
                  key="workshop-mix"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10"
                  id="workshop-section"
                >
                  
                  {/* Service selector return bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#080808] border border-white/5 rounded-2xl p-4 gap-4 text-left">
                    <button
                      onClick={() => setServiceType(null)}
                      className="text-2xs font-bold font-mono tracking-wider uppercase text-white/50 hover:text-brand-green flex items-center space-x-2 transition-colors duration-200"
                    >
                      <span>&larr; Switch Service Mode</span>
                    </button>
                    <div className="flex items-center space-x-4">
                      <span className="font-mono text-3xs text-white/45 uppercase font-bold">Vocal Mix Credits:</span>
                      <span className="font-display text-xs font-black text-brand-green bg-brand-green/10 border border-brand-green/20 rounded px-2.5 py-0.5">
                        {userPlan === "Pro Artist" ? "UNLIMITED" : `${creditsProfile.mixCredits}`}
                      </span>
                    </div>
                  </div>

                  {/* Header Titles */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left border-b border-white/5 pb-6">
                    <div>
                      <div className="flex items-center space-x-1.5 font-mono text-3xs text-brand-green font-bold uppercase tracking-wider">
                        <span className="h-2 w-2 rounded-full bg-brand-green animate-pulse" />
                        <span>Real-time Studio Desks</span>
                      </div>
                      <h2 className="font-display text-2xl font-extrabold text-white tracking-tight mt-1">Vocal Mixing Portal</h2>
                      <p className="font-sans text-xs text-white/50 mt-1">Upload files, lock presets, match a hit reference song, and master your record with pristine quality.</p>
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2 font-mono text-xs flex items-center space-x-2">
                      <HardDrive className="h-4 w-4 text-white/30" />
                      <span className="text-white/30">Account Session status:</span>
                      <span className="text-brand-pink font-semibold">{userPlan}</span>
                    </div>
                  </div>

                  {/* Steps Layout Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left side: Uploaders + Presets */}
                    <div className="lg:col-span-8 space-y-8">
                      
                      {/* Step 1 Box: Upload Audio Stems */}
                      <div className="space-y-4 text-left p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 bg-gradient-to-br from-white/[0.01] to-black/[0.02]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <h3 className="font-display text-sm font-bold text-white flex items-center space-x-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-green/10 text-brand-green font-mono text-[10px] font-extrabold border border-brand-green/20">1</span>
                            <span className="uppercase tracking-wide">Upload Stems & Multi-tracks</span>
                          </h3>

                          {!sessionConfirmed && (
                            <button
                              onClick={() => {
                                // Load individual WAV files directly
                                // lead 1.wav = Lead Vocal
                                // lead 2.wav = Lead Vocal Double
                                // libs.wav = Adlibs
                                // dub.wav = Dubs
                                // mix this 77 bpm.wav = 2-Track Instrumental
                                // Demo assets are individual MP3 files, not a ZIP.
                                // mix-this-77-bpm-2track-instrumental.mp3 is the 2-track instrumental.
                                // Demo song is 77 BPM in F# minor.
                                const demoStems: SessionFile[] = [
                                  { id: 'demo-stem-1', name: 'lead-1.mp3', size: 14500000, assignedRole: 'lead_vocal' },
                                  { id: 'demo-stem-2', name: 'lead-2.mp3', size: 13200000, assignedRole: 'lead_double' },
                                  { id: 'demo-stem-3', name: 'libs.mp3', size: 980000, assignedRole: 'adlibs' },
                                  { id: 'demo-stem-4', name: 'dub.mp3', size: 1100000, assignedRole: 'dubs' },
                                  { id: 'demo-stem-5', name: 'mix-this-77-bpm-2track-instrumental.mp3', size: 24500000, assignedRole: 'instrumental' }
                                ];
                                setSessionFiles(demoStems);
                              }}
                              className="px-3.5 py-1.5 rounded-lg border border-brand-cyan/20 bg-brand-cyan/5 hover:bg-brand-cyan/15 text-brand-cyan font-mono text-3xs font-extrabold uppercase transition-all"
                            >
                              Load 77 BPM Demo Session Stems
                            </button>
                          )}
                        </div>
                        
                        {!sessionConfirmed ? (
                          <div className="space-y-6">
                            <MultiFileUploadDropzone
                              onFilesSelect={(files) => {
                                // Map real dropped files
                                const newSessionFiles = files.map((file, idx) => {
                                  let detectedRole: FileRole = 'lead_vocal';
                                  const nameLower = file.name.toLowerCase();
                                  if (nameLower.includes('lead 1')) detectedRole = 'lead_vocal';
                                  else if (nameLower.includes('lead 2') || nameLower.includes('double')) detectedRole = 'lead_double';
                                  else if (nameLower.includes('lib') || nameLower.includes('adlib')) detectedRole = 'adlibs';
                                  else if (nameLower.includes('dub')) detectedRole = 'dubs';
                                  else if (nameLower.includes('mix this') || nameLower.includes('beat') || nameLower.includes('inst')) detectedRole = 'instrumental';
                                  else if (nameLower.includes('rough')) detectedRole = 'rough_mix';
                                  else if (nameLower.includes('finish') || nameLower.includes('master')) detectedRole = 'finished_mix';
                                  else if (nameLower.includes('ref')) detectedRole = 'reference';

                                  return {
                                    id: `session-file-${Date.now()}-${idx}`,
                                    name: file.name,
                                    size: file.size,
                                    assignedRole: detectedRole,
                                    file: file
                                  };
                                });
                                setSessionFiles(prev => [...prev, ...newSessionFiles]);
                              }}
                            />

                            {sessionFiles.length > 0 && (
                              <SessionFileMapper
                                files={sessionFiles}
                                onRoleChange={(id, newRole) => {
                                  setSessionFiles(prev => prev.map(f => f.id === id ? { ...f, assignedRole: newRole } : f));
                                }}
                                onConfirm={() => {
                                  // Locate specific files from configuration for engine mapping
                                  const vocalFile = sessionFiles.find(f => f.assignedRole === 'lead_vocal');
                                  const beatFile = sessionFiles.find(f => f.assignedRole === 'instrumental');
                                  const backingFile = sessionFiles.find(f => f.assignedRole === 'adlibs' || f.assignedRole === 'dubs' || f.assignedRole === 'lead_double');
                                  const referenceFile = sessionFiles.find(f => f.assignedRole === 'reference');

                                  setInputs({
                                    vocal: vocalFile ? { id: vocalFile.id, name: vocalFile.name, size: vocalFile.size, type: 'vocal', file: vocalFile.file } : null,
                                    beat: beatFile ? { id: beatFile.id, name: beatFile.name, size: beatFile.size, type: 'beat', file: beatFile.file } : null,
                                    backing: backingFile ? { id: backingFile.id, name: backingFile.name, size: backingFile.size, type: 'backing', file: backingFile.file } : null,
                                    reference: referenceFile ? { id: referenceFile.id, name: referenceFile.name, size: referenceFile.size, type: 'reference', file: referenceFile.file } : null,
                                  });

                                  // Set demo markers if demo files are loaded
                                  const isDemo = sessionFiles.some(f => f.name.includes('lead-1.mp3') || f.name.includes('mix-this'));
                                  if (isDemo) {
                                    setIsDemoJob(true);
                                    setSongKey('F# minor');
                                    setBpm(77);
                                    setPitchCorrectionMode('modern_clean');
                                    setRetuneSpeed('medium-fast');
                                    setHumanize('medium');
                                  }

                                  setSessionConfirmed(true);
                                }}
                              />
                            )}
                          </div>
                        ) : (
                          <div className="rounded-xl border border-brand-green/20 bg-brand-green/5 p-4 flex justify-between items-center text-left">
                            <div className="space-y-1">
                              <span className="font-mono text-3xs font-extrabold text-brand-green tracking-wider uppercase">Active Session Active</span>
                              <h4 className="font-display font-medium text-xs text-white">Stems Mapping Verified ({sessionFiles.length} files)</h4>
                              <p className="font-sans text-3xs text-white/50">
                                Primary Lead: <span className="text-white font-semibold font-mono">{inputs.vocal?.name}</span> • Instrumental Grid: <span className="text-white font-semibold font-mono">{inputs.beat?.name}</span>
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setSessionConfirmed(false);
                                setInputs({ vocal: null, beat: null, backing: null, reference: null });
                              }}
                              className="px-3.5 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white font-mono text-4xs uppercase tracking-wider"
                            >
                              Edit Files / Reset
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Display verified analysis and controls only when confirmed */}
                      {sessionConfirmed && (
                        <div className="space-y-8">
                          
                          {/* AI Engineer Spec Analysis view */}
                          <AIEngineerAnalysis />

                          {/* Autotune style correction sliders panel */}
                          <PitchCorrectionPanel
                            currentMode={pitchCorrectionMode}
                            onModeChange={setPitchCorrectionMode}
                            songKey={songKey}
                            onKeyChange={setSongKey}
                            bpm={bpm}
                            onBpmChange={setBpm}
                            retuneSpeed={retuneSpeed}
                            onRetuneSpeedChange={setRetuneSpeed}
                            humanize={humanize}
                            onHumanizeChange={setHumanize}
                          />

                          {/* Dynamic visual representation of DSP signal router */}
                          <AIEngineerChain />

                        </div>
                      )}

                      {/* Step 2 Box: Style Selector presets */}
                      <div className="space-y-4 text-left p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 bg-gradient-to-br from-white/[0.01] to-black/[0.02]">
                        <h3 className="font-display text-sm font-bold text-white flex items-center space-x-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-green/10 text-brand-green font-mono text-[10px] font-extrabold border border-brand-green/20">2</span>
                          <span className="uppercase tracking-wide">Choose Foundation Style Preset</span>
                        </h3>
                        
                        <StyleSelector
                          selectedId={selectedPreset.id}
                          onSelect={handlePresetSelect}
                          selectedCategory={selectedCategory}
                          setSelectedCategory={setSelectedCategory}
                        />
                      </div>

                    </div>

                    {/* Right Side: Advanced sliders + Reference blueprints + Master buttons */}
                    <div className="lg:col-span-4 space-y-6">
                      {/* Reference track analysis card display */}
                      {inputs.reference && (
                        <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-5 text-left space-y-4">
                          <div className="flex items-center space-x-2">
                            <Activity className="h-4.5 w-4.5 text-brand-cyan animate-pulse shrink-0" />
                            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">Acoustic Reference Blueprint</h4>
                          </div>

                          {isAnalyzingRef ? (
                            <div className="space-y-2 py-4">
                              <div className="h-2 w-full bg-black rounded-full overflow-hidden">
                                <div className="h-full bg-brand-cyan animate-shimmer" style={{ width: '40%' }}></div>
                              </div>
                              <p className="font-mono text-3xs text-white/30 animate-pulse">Running FFT filter scans on reference frequency peaks...</p>
                            </div>
                          ) : refAnalysis ? (
                            <div className="space-y-3 font-mono text-xs">
                              <div className="flex justify-between items-center text-3xs border-b border-white/10 pb-2">
                                <span className="text-white/30">ANALYZING SPEC</span>
                                <span className="text-white/90 truncate max-w-[150px]">{inputs.reference.name}</span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 pt-1">
                                <div>
                                  <span className="text-white/30 block text-3xs">VOCAL PRESENCE</span>
                                  <span className="text-white/80 text-2xs font-bold">{refAnalysis.vocalPresence}% Cut-through</span>
                                </div>
                                <div>
                                  <span className="text-white/30 block text-3xs">HIGH SHELF BRIGHTNESS</span>
                                  <span className="text-white/80 text-2xs font-bold">{refAnalysis.brightness}% Air EQ</span>
                                </div>
                                <div>
                                  <span className="text-white/30 block text-3xs">RMS TARGET LOUDNESS</span>
                                  <span className="text-white/80 text-2xs font-bold">{refAnalysis.loudness} LUFS</span>
                                </div>
                                <div>
                                  <span className="text-white/30 block text-3xs">REVERB ROOM FEEL</span>
                                  <span className="text-white/80 text-2xs font-bold truncate block">{refAnalysis.reverbFeel}</span>
                                </div>
                              </div>

                              <div className="pt-2 border-t border-white/10 leading-normal">
                                <span className="text-white/30 block text-3xs">BASS BALANCE MODE</span>
                                <span className="text-amber-400 text-2xs font-bold">{refAnalysis.lowEndBalance}</span>
                              </div>

                              <div className="text-[10px] text-white/40 flex items-center space-x-1 font-sans leading-normal">
                                <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan block" />
                                <span>These calculated targets automatically override the EQ ceiling.</span>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )}

                      {/* Step 3 Box: Advanced sliders tweaks */}
                      <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/5 text-left space-y-4">
                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                          <h3 className="font-display text-sm font-bold text-white flex items-center space-x-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-green/10 text-brand-green font-mono text-[10px] font-extrabold border border-brand-green/20">3</span>
                            <span className="uppercase tracking-wide">Fine-tune Dials</span>
                          </h3>
                          <button
                            onClick={() => setCustomSettings({ ...selectedPreset.defaultSettings })}
                            id="reset-sliders-btn"
                            className="font-mono text-3xs hover:text-brand-green text-white/30 transition-colors uppercase"
                            title="Align sliders back to chosen preset default values"
                          >
                            Reset Defaults
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 max-h-[350px] overflow-y-auto pr-1">
                          {SLIDERS_META.map((slider) => (
                            <SettingsSlider
                              key={slider.id}
                              id={slider.id}
                              label={slider.label}
                              description={slider.description}
                              value={customSettings[slider.id as keyof MixSettings]}
                              onChange={(val) => handleSliderValueChange(slider.id as keyof MixSettings, val)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Warning Error and Generate Master Mix Button Trigger */}
                      <div className="space-y-4" id="workshop-trigger-desktop">
                        {workshopError && (
                          <div className="flex items-start space-x-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-left" id="workshop-error-banner">
                            <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                            <span className="font-sans text-xs text-rose-400 leading-tight">{workshopError}</span>
                          </div>
                        )}

                        <button
                          onClick={handleGenerateMixClick}
                          id="studio-generate-mix-btn"
                          className="w-full flex items-center justify-center space-x-2.5 rounded-2xl bg-gradient-to-r from-brand-green to-brand-cyan hover:from-emerald-400 hover:to-cyan-400 text-black px-6 py-4 font-display font-black text-xs uppercase tracking-wider transition-all duration-300 transform hover:scale-102 shadow-lg studio-glow-green"
                        >
                          <Sparkles className="h-4.5 w-4.5 text-black animate-pulse" />
                          <span>Render Mastering Preview</span>
                        </button>
                        
                        <p className="font-sans text-3xs text-white/30 text-center uppercase tracking-wider text-balance">
                          Render averages 12 seconds. No credit card required. Free accounts receive 5 monthly masters.
                        </p>
                      </div>

                    </div>

                  </div>

                </motion.div>
              ) : (
                <motion.div
                  key="workshop-master"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-10"
                >
                  
                  {/* Service selector return bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#080808] border border-white/5 rounded-2xl p-4 gap-4 text-left">
                    <button
                      onClick={() => setServiceType(null)}
                      className="text-2xs font-bold font-mono tracking-wider uppercase text-white/50 hover:text-brand-pink flex items-center space-x-2 transition-colors duration-200"
                    >
                      <span>&larr; Switch Service Mode</span>
                    </button>
                    <div className="flex items-center space-x-4">
                      <span className="font-mono text-3xs text-white/45 uppercase font-bold text-left">Mastering Credits remaining:</span>
                      <span className="font-display text-xs font-bold text-brand-pink bg-brand-pink/10 border border-brand-pink/20 rounded px-2.5 py-0.5">
                        {userPlan === "Pro Artist" || userPlan === "Artist Monthly" ? "UNLIMITED" : `${creditsProfile.masteringCredits}`}
                      </span>
                    </div>
                  </div>

                  <MasteringUploadFlow 
                    userPlan={userPlan} 
                    onComplete={handleMasteringComplete} 
                    onUpgradeClick={() => setUpgradeModalOpen(true)} 
                    onProcessStart={() => {
                      setProcessingJobType('masteringOnly');
                      setIsProcessing(true);
                    }}
                  />

                  <DisclaimerBanner type="upload-master" />
                </motion.div>
              )}
            </div>
          )}

          {/* TAB 3: AUDITION & RESULTS AUDIOPLAYER */}
          {currentTab === 'results' && auditionMix && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8"
              id="results-section"
            >
              
              <div className="text-left space-y-2">
                <span className="font-mono text-3xs font-bold uppercase tracking-widest text-brand-pink">Job Complete</span>
                <h2 className="font-display text-2xl font-black text-white tracking-tight">mixedbytae {currentTab === 'results' && auditionMix?.presetName?.includes('Master') ? 'Master Preview' : 'Mix Preview'}</h2>
                <p className="font-sans text-xs text-white/50">Adjust parameters dynamically while listening! You can still fine-tune settings and download the polished output.</p>
              </div>

              {/* Voice DNA Analysis Section on Results */}
              <AIEngineerAnalysis />

              {/* What mixedbytae did section */}
              <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 text-left space-y-4">
                <h4 className="font-display font-bold text-white tracking-widest uppercase text-sm">What mixedbytae Did</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-white/60 font-sans">
                  <li className="flex items-start space-x-2"><span className="text-brand-pink mt-0.5">•</span><span>Organized lead vocals, doubles, and instrumental properly</span></li>
                  <li className="flex items-start space-x-2"><span className="text-brand-pink mt-0.5">•</span><span>Applied voice-adaptive pitch correction in key</span></li>
                  <li className="flex items-start space-x-2"><span className="text-brand-pink mt-0.5">•</span><span>Balanced your voice with the beat levels</span></li>
                  <li className="flex items-start space-x-2"><span className="text-brand-pink mt-0.5">•</span><span>Applied subtractive EQ, de-essing, compression</span></li>
                  <li className="flex items-start space-x-2"><span className="text-brand-pink mt-0.5">•</span><span>Added tempo-synced delay and spatial reverb</span></li>
                  <li className="flex items-start space-x-2"><span className="text-brand-pink mt-0.5">•</span><span>Created MP3 and Studio WAV file export options</span></li>
                </ul>
              </div>

              {/* Central Player unit */}
              <div id="results-player-holder">
                <AudioPlayer
                  songName={auditionMix.songName}
                  presetName={auditionMix.presetName}
                  settings={auditionMix.settings}
                  referenceApplied={auditionMix.referenceName !== undefined}
                  onUpgradeClick={() => {
                    if (userPlan === 'Free Tier' && creditsProfile.wavExportAccess === 'none') {
                      setWavUpgradeModalOpen(true);
                    } else {
                      setCurrentTab('pricing');
                    }
                  }}
                  showProUpgrade={userPlan === 'Free Tier' && creditsProfile.wavExportAccess === 'none'}
                />
              </div>

              {/* Sliders adjustments right on the result page! Essential for premium UX */}
              <div className="rounded-2xl bg-zinc-900 border border-zinc-850 p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3 text-left">
                  <div>
                    <h4 className="font-display text-sm font-bold text-white uppercase tracking-tight">Post-mastering Micro-Tweaks</h4>
                    <p className="font-sans text-3xs text-zinc-500 mt-0.5">Nudge variables on the fly. The background browser synthesizer recalculates EQ nodes live.</p>
                  </div>
                  <button
                    onClick={() => setCustomSettings({ ...MIX_PRESETS.find(p => p.name === auditionMix.presetName)?.defaultSettings || customSettings })}
                    className="font-mono text-3xs text-zinc-500 hover:text-brand-green uppercase transition-colors"
                  >
                    Reset Defaults
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {SLIDERS_META.slice(0, 4).map((slider) => (
                    <SettingsSlider
                      key={slider.id}
                      id={`result-${slider.id}`}
                      label={slider.label}
                      description={slider.description}
                      value={auditionMix.settings[slider.id as keyof MixSettings]}
                      onChange={(val) => {
                        setAuditionMix(prev => {
                          if (!prev) return null;
                          const updated = {
                            ...prev,
                            settings: { ...prev.settings, [slider.id]: val }
                          };
                          // sync parent
                          setCustomSettings(updated.settings);
                          return updated;
                        });
                      }}
                    />
                  ))}
                  {SLIDERS_META.slice(4).map((slider) => (
                    <SettingsSlider
                      key={slider.id}
                      id={`result-${slider.id}`}
                      label={slider.label}
                      description={slider.description}
                      value={auditionMix.settings[slider.id as keyof MixSettings]}
                      onChange={(val) => {
                        setAuditionMix(prev => {
                          if (!prev) return null;
                          const updated = {
                            ...prev,
                            settings: { ...prev.settings, [slider.id]: val }
                          };
                          // sync parent
                          setCustomSettings(updated.settings);
                          return updated;
                        });
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Next Steps controls button dashboard */}
              <div className="flex flex-col sm:flex-row justify-between items-center p-5 rounded-2xl bg-black border border-white/5 gap-4">
                <div className="text-left">
                  <span className="font-mono text-4xs uppercase tracking-wider text-white/30">Unsatisfied with original dynamics?</span>
                  <p className="font-sans text-xs text-white/55 mt-0.5">You can record clean vocals and launch as many mastering trials as you like.</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentTab('workshop')}
                    id="make-another-mix-btn"
                    className="rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-semibold px-4 py-2.5 text-white/90 transition-colors"
                  >
                    Make Another Mix
                  </button>
                  <button
                    onClick={() => setCurrentTab('dashboard')}
                    id="view-all-mixes-btn"
                    className="rounded-xl bg-brand-green/10 hover:bg-brand-green/15 text-brand-green border border-brand-green/20 text-xs font-semibold px-4 py-2.5 transition-colors"
                  >
                    View Mix History Dashboard
                  </button>
                </div>
              </div>

              {/* Revision Request Module */}
              <RevisionRequest 
                mixId={auditionMix.songName} 
                songName={auditionMix.songName} 
                onSubmitRevision={() => {
                  setProcessingJobType('revision');
                  setIsProcessing(true);
                }}
              />

            </motion.div>
          )}

          {/* TAB 4: HISTORICAL MIXES DASHBOARD */}
          {currentTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8"
              id="dashboard-section"
            >
              
              {/* mixedbytae Dashboard Banner */}
              <div className="relative w-full h-40 sm:h-48 md:h-56 rounded-3xl overflow-hidden border border-white/10 flex items-center mb-8">
                <div className="absolute inset-0 z-0">
                  <img src="/brand/taedatarget-hero.png" alt="mixedbytae branding" className="w-full h-full object-cover opacity-50" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                </div>
                <div className="relative z-10 px-6 sm:px-10 text-left">
                  <span className="font-mono text-[10px] text-brand-pink uppercase tracking-widest font-extrabold block mb-2">taedatarget</span>
                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">Welcome to <span className="text-brand-pink">mixed</span>bytae</h1>
                  <p className="font-sans text-sm sm:text-base text-white/60 mt-2 max-w-lg">Upload a song, choose your sound, and let mixedbytae prepare your mix or master.</p>
                </div>
              </div>

              {/* Dashboard header stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Stat 1: Dynamic Mixing Credits */}
                <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-[#0A0A0A] to-black p-5 text-left flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="font-mono text-3xs uppercase tracking-wider text-white/30 block">Monthly Mixing Credits</span>
                    {userPlan === "Pro Artist" ? (
                      <span className="font-display text-4xl font-black text-white tracking-tight">UNLIMITED</span>
                    ) : (
                      <span className="font-display text-4xl font-black text-white tracking-tight">
                        {creditsProfile.mixCredits} <span className="text-sm font-normal text-white/30">left</span>
                      </span>
                    )}
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-brand-green/10 border border-brand-green/20 text-brand-green flex items-center justify-center font-mono text-xs font-bold leading-none">
                    {userPlan === "Pro Artist" ? "100%" : `${Math.round((creditsProfile.mixCredits / (userPlan === "Artist Monthly" ? 15 : 5)) * 100)}%`}
                  </div>
                </div>

                {/* Stat 2: Active Plan */}
                <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-[#0A0A0A] to-black p-5 text-left flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="font-mono text-3xs uppercase tracking-wider text-white/30 block">Active Creator Tier</span>
                    <span className="font-display text-lg font-bold text-white tracking-tight flex items-center space-x-1">
                      <span>{userPlan}</span>
                    </span>
                  </div>
                  {userPlan === "Free Tier" ? (
                    <button
                      onClick={() => setCurrentTab('pricing')}
                      className="rounded-lg bg-brand-pink/15 hover:bg-brand-pink/22 border border-brand-pink/30 text-brand-pink px-3 py-1 font-mono text-3xs tracking-wider uppercase font-bold"
                    >
                      Upgrade Plan
                    </button>
                  ) : (
                    <span className="rounded bg-brand-cyan/15 px-2.5 py-1 text-brand-cyan border border-brand-cyan/20 font-mono text-3xs uppercase font-extrabold tracking-widest">PRO STATUS</span>
                  )}
                </div>

                {/* Stat 3: Mastering Node Status */}
                <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-[#0A0A0A] to-black p-5 text-left flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="font-mono text-3xs uppercase tracking-wider text-white/30 block font-bold">WAV Export Status</span>
                    <span className="font-display text-sm font-bold text-white tracking-tight block uppercase">
                      {userPlan === "Pro Artist" ? "Lossless 24-bit PCM" : creditsProfile.wavExportAccess !== "none" ? "lossless 48kHz WAV" : "MP3 320kbps Only"}
                    </span>
                  </div>
                  <div className="h-8.5 w-8.5 rounded-full bg-[#0A0A0A] text-white/40 border border-white/10 flex items-center justify-center">
                    <Headphones className="h-4 w-4" />
                  </div>
                </div>

              </div>

              {/* Sub-navigation Tabs */}
              <div className="flex border-b border-white/5 space-x-6">
                <button
                  onClick={() => setDashboardTab('history')}
                  className={`pb-3.5 text-xs font-bold uppercase tracking-wider transition-colors relative font-display ${
                    dashboardTab === 'history' ? 'text-brand-green font-extrabold' : 'text-white/40 hover:text-white'
                  }`}
                >
                  <span>Active Audits History</span>
                  {dashboardTab === 'history' && (
                    <motion.div layoutId="dashboardUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green" />
                  )}
                </button>
                <button
                  onClick={() => setDashboardTab('billing')}
                  className={`pb-3.5 text-xs font-bold uppercase tracking-wider transition-colors relative font-display ${
                    dashboardTab === 'billing' ? 'text-brand-cyan font-extrabold' : 'text-white/40 hover:text-white'
                  }`}
                >
                  <span>Billing, Quotas & Invoices</span>
                  {dashboardTab === 'billing' && (
                    <motion.div layoutId="dashboardUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-cyan" />
                  )}
                </button>
              </div>

              {/* Switchable Views */}
              {dashboardTab === 'history' ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display text-base font-bold text-white tracking-tight">Your Recent Creative Audits</h3>
                    <button
                      onClick={() => {
                        setServiceType(null); // Force selection reset
                        setCurrentTab('workshop');
                      }}
                      id="dashboard-new-mix-btn"
                      className="rounded-xl bg-brand-green hover:bg-emerald-400 text-black text-xs font-extrabold px-4 py-2 transition-colors inline-flex items-center space-x-1 shadow studio-glow-green"
                    >
                      <span>+ New Mix Job</span>
                    </button>
                  </div>

                  {loadingHistory ? (
                    <div className="space-y-3 py-10" id="dashboard-loading-history">
                      <div className="h-10 w-10 animate-spin border-2 border-brand-green border-t-transparent rounded-full mx-auto" />
                      <p className="font-mono text-3xs text-white/30 animate-pulse text-center uppercase">Synching your Cloud Firestore bucket...</p>
                    </div>
                  ) : mixHistory.length === 0 ? (
                    <div className="rounded-2xl border border-white/5 p-12 text-center space-y-4" id="dashboard-empty-state">
                      <div className="p-3 bg-black rounded-full border border-white/10 inline-block text-white/10">
                        <ListMusic className="h-7 w-7" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-sans text-sm font-medium text-white/95">No mixes created yet</p>
                        <p className="font-sans text-xs text-white/30 max-w-xs mx-auto">Upload dry vocal stems and custom instrumental beats in the Studio Mixer to compile your first record.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3.5" id="history-items-grid">
                      {mixHistory.map((mix) => (
                        <DashboardMixCard
                          key={mix.id}
                          mix={mix}
                          onAudition={handleAuditionMixFromHistory}
                          isActiveAudition={auditionMix?.id === mix.id}
                          userPlan={userPlan}
                          onUnlockWAV={() => setWavUpgradeModalOpen(true)}
                          onRequestRevision={() => {
                            setProcessingJobType('revision');
                            setIsProcessing(true);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <BillingSection 
                    profile={creditsProfile} 
                    onUpgradeClick={() => setCurrentTab('pricing')} 
                  />
                </div>
              )}

              <DemoSongGeneratorPlaceholder />
            </motion.div>
          )}

          {/* TAB 4: TUTORIAL GUIDE */}
          {currentTab === 'tutorial' && (
            <motion.div
              key="tutorial"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-10"
              id="tutorial-tab-view"
            >
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <span className="font-mono text-3xs font-bold uppercase tracking-widest text-brand-pink">Interactive Guide</span>
                <h2 className="font-display text-3xl font-extrabold text-white tracking-tight">How mixedbytae Works</h2>
                <p className="font-sans text-xs text-white/50 leading-normal">
                  Learn how to upload your vocals, choose your sound, and generate a cleaner mix or master.
                </p>
              </div>

              <TutorialVideoSection />

              {/* Advanced Interactive AI Tutorial Video Script Creator & Storyboard */}
              <div className="border-t border-white/5 pt-10">
                <AITutorialVideoBuilder />
              </div>
              
              <div className="border-t border-white/5 pt-10">
                <FAQSection />
              </div>
            </motion.div>
          )}

          {/* TAB 5: PRICING PAGES */}
          {currentTab === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10"
              id="pricing-section"
            >
              
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <span className="font-mono text-3xs font-bold uppercase tracking-widest text-brand-green">Subscription Packages</span>
                <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-tight">Choose Your Artist Tier Blueprint</h2>
                <p className="font-sans text-xs text-white/50 text-balance leading-normal">
                  Unlock unlimited background stem uploads, lossless professional WAV distributions, precise reference target calculations, and dedicated priority rendering DSP nodes.
                </p>
              </div>

              {/* Pricing Grid items module */}
              <PricingCard
                userEmail={userEmail}
                selectedPlan={userPlan}
                onSuccess={handleUpgradeSuccess}
              />

              {/* FAQ guidelines */}
              <FAQSection />

            </motion.div>
          )}

          {/* TAB 6: SUPPORT PAGES */}
          {currentTab === 'support' && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10"
              id="support-section"
            >
              <ContactSupport />
            </motion.div>
          )}

          {/* TAB 7: ADMIN PAGES */}
          {currentTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10"
              id="admin-section"
            >
              <AdminPanel />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Global simulated background processing modal */}
      <ProcessingTimerScreen
        isOpen={isProcessing}
        onComplete={handleProcessingComplete}
        onCancel={() => setIsProcessing(false)}
        jobType={processingJobType}
      />

      {/* Checkout and Credit Upgrade Overlay systems */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        onSelectOption={handleSelectOptionInUpgradeModal}
        proArtistPriceDisplay={PRO_ARTIST_PRICE}
      />

      {/* Lossless WAV Format Access Upgrade Overlay */}
      <WAVUpgradeModal
        isOpen={wavUpgradeModalOpen}
        onClose={() => setWavUpgradeModalOpen(false)}
        onUpgradeToMonthly={() => {
          handleUpgradeSuccess("Artist Monthly Subscription");
          setWavUpgradeModalOpen(false);
        }}
        onUpgradeToPro={() => {
          handleUpgradeSuccess("Pro Artist plan");
          setWavUpgradeModalOpen(false);
        }}
        onBuyWavAddon={() => {
          handleBuyWavAddon();
          setWavUpgradeModalOpen(false);
        }}
      />

      {/* Core Safety Disclaimer Footer */}
      <Footer />

    </div>
  );
}
