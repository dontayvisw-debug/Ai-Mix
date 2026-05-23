import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, FileAudio, AlertTriangle, Trash2 } from 'lucide-react';
import { FileType, UploadedFile } from '../types';
import { validateAudioFile } from '../utils/audioService';

interface UploadDropzoneProps {
  type: FileType;
  label: string;
  required?: boolean;
  description: string;
  uploadedFile: UploadedFile | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  uploadProgress?: number;
  isUploading?: boolean;
}

export default function UploadDropzone({
  type,
  label,
  required = false,
  description,
  uploadedFile,
  onFileSelect,
  onFileRemove,
  uploadProgress = 0,
  isUploading = false,
}: UploadDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setErrorText(null);
    const validation = validateAudioFile(file, type);
    if (!validation.valid) {
      setErrorText(validation.error || 'Invalid audio file.');
      return;
    }
    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Human readable file size conversion
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 1;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col space-y-1.5" id={`dropzone-container-${type}`}>
      {/* Label and Badge status */}
      <div className="flex items-center justify-between">
        <label className="font-display text-xs font-semibold tracking-wide uppercase text-white/50 flex items-center space-x-1.5">
          <span>{label}</span>
          {required && <span className="text-rose-500 font-sans">*</span>}
        </label>
        {required && !uploadedFile && !isUploading && (
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Required</span>
        )}
        {uploadedFile && (
          <span className="text-[10px] font-mono font-medium text-brand-green uppercase tracking-wider flex items-center space-x-1">
            <CheckCircle2 className="h-3 w-3 text-brand-green shrink-0" />
            <span>Ready</span>
          </span>
        )}
      </div>

      {/* Main Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!uploadedFile && !isUploading ? triggerFileInput : undefined}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer min-h-[150px] transition-all duration-200 ${
          isDragActive
            ? 'border-brand-green bg-brand-green/5'
            : uploadedFile
            ? 'border-white/10 bg-white/[0.02] cursor-default'
            : isUploading
            ? 'border-brand-cyan/40 bg-white/[0.01]'
            : errorText
            ? 'border-rose-500/50 bg-rose-500/5 hover:border-rose-400'
            : 'border-white/10 hover:border-brand-green/35 hover:bg-white/[0.03]'
        }`}
        id={`dropzone-${type}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".mp3,.m4a,.aac,.ogg"
          className="hidden"
          id={`file-input-${type}`}
        />

        {/* State 1: Uploading progress */}
        {isUploading && (
          <div className="w-full flex flex-col items-center py-2 space-y-4" id={`state-uploading-${type}`}>
            <div className="relative flex items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-cyan/20 border-t-brand-cyan" />
              <div className="absolute font-mono text-[10px] font-bold text-brand-cyan">{uploadProgress}%</div>
            </div>
            <div className="text-center">
              <p className="font-display text-sm font-semibold text-white/90">Casting cloud buffer...</p>
              <p className="font-sans text-2xs text-white/40 mt-1">Converting sample rates & creating spectral map</p>
            </div>
            {/* ProgressBar */}
            <div className="w-full max-w-[200px] h-1.5 bg-[#0A0A0A] rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-brand-cyan shadow-[0_0_10px_rgba(251,146,60,0.5)]" style={{ width: `${uploadProgress}%`, transition: 'width 0.15s ease' }}></div>
            </div>
          </div>
        )}

        {/* State 2: Completed file uploaded */}
        {!isUploading && uploadedFile && (
          <div className="w-full flex items-center justify-between p-2" id={`state-completed-${type}`}>
            <div className="flex items-center space-x-3 text-left overflow-hidden mr-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black border border-white/10 text-brand-green shadow-inner">
                <FileAudio className="h-5 w-5" />
              </div>
              <div className="overflow-hidden">
                <p className="font-display text-xs font-semibold text-white/90 truncate pr-2">{uploadedFile.name}</p>
                <p className="font-mono text-3xs text-white/40 mt-0.5">{formatBytes(uploadedFile.size)} • WAV Compliant</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileRemove();
              }}
              id={`remove-file-btn-${type}`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black hover:bg-rose-500/10 text-white/30 hover:text-rose-500 transition-colors border border-white/10"
              title="Remove File"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* State 3: Empty / Drop active */}
        {!isUploading && !uploadedFile && (
          <div className="flex flex-col items-center space-y-3 py-1" id={`state-empty-${type}`}>
            <div className={`p-3 rounded-full bg-black border transition-transform duration-200 ${isDragActive ? 'scale-110 border-brand-green text-brand-green studio-glow-green' : 'border-white/10 text-white/30'}`}>
              <UploadCloud className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="font-sans text-xs font-medium text-white/70">
                {isDragActive ? 'Release to upload!' : 'Drag & drop file or click to browse'}
              </p>
              <p className="font-sans text-3xs text-white/40 max-w-[200px]">
                {description}
              </p>
              <p className="font-sans text-[9px] text-brand-cyan/60 max-w-[220px] mt-1">
                WAV 48kHz lossless export is available for paid plans and future backend processing.
              </p>
            </div>
          </div>
        )}

        {/* Local Error Block */}
        {errorText && !isUploading && !uploadedFile && (
          <div className="mt-3 flex items-start space-x-1.5 p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-left w-full max-w-xs" id={`error-box-${type}`}>
            <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
            <span className="font-sans text-[10px] text-rose-500 leading-tight">{errorText}</span>
          </div>
        )}
      </div>
    </div>
  );
}
