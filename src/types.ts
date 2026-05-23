export type FileType = 'vocal' | 'beat' | 'backing' | 'reference';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: FileType;
  file?: File;
  duration?: number; // seconds
}

export interface MixStyle {
  id: string;
  name: string;
  description: string;
  category: 'Rap' | 'Melodic' | 'R&B' | 'Pop' | 'Experimental';
  tag: string;
  intensityDefault: number;
}

export interface MixSettings {
  vocalBrightness: number; // 0-100
  vocalWarmth: number;    // 0-100
  autoTuneStrength: number; // 0-100 (0 is off)
  reverbAmount: number;   // 0-100
  delayAmount: number;    // 0-100
  vocalLoudness: number;  // 0-100
  compressionStrength: number; // 0-100
  masterLoudness: number; // 0-100
}

export interface ReferenceAnalysis {
  vocalPresence: number; // 0-100
  brightness: number; // 0-100
  loudness: number; // -14 to -6 LUFS
  reverbFeel: string; // "Dry", "Acoustic Room", "Large Hall", "Lush Plate"
  lowEndBalance: string; // "Controlled", "Sub-heavy", "Boomy", "Tight"
  overallPolish: number; // 0-100
}

export type MixStatus = 'waiting_for_payment' | 'uploading' | 'processing' | 'mixing' | 'mastering' | 'revision_processing' | 'completed' | 'failed';

export interface MixHistoryItem {
  id: string;
  name: string;
  date: string;
  presetId: string;
  presetName: string;
  vocalName: string;
  beatName: string;
  referenceName?: string;
  status: MixStatus;
  userSettings?: MixSettings;
  originalDuration?: string;
  audioUrl?: string; // path to simulated or real player
}
