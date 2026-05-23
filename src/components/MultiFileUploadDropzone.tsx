import React, { useState, useRef } from 'react';
import { Upload, AudioLines, FileCheck, Trash2, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface MultiFileUploadDropzoneProps {
  onFilesSelect: (files: File[]) => void;
  onClearAll?: () => void;
  uploadedFilesCount?: number;
}

export default function MultiFileUploadDropzone({
  onFilesSelect,
  onClearAll,
  uploadedFilesCount = 0
}: MultiFileUploadDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedExtensions = ['wav', 'mp3', 'aiff', 'm4a', 'flac', 'aac', 'ogg'];

  const validateAndAddFiles = (fileList: FileList) => {
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const ext = file.name.split('.').pop()?.toLowerCase();

      if (!ext || !allowedExtensions.includes(ext)) {
        newErrors.push(`"${file.name}" ignored. Please use MP3, M4A, AAC, OGG, or WAV.`);
        continue;
      }
      
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        newErrors.push(`"${file.name}" is too large (max 100MB).`);
        continue;
      }

      validFiles.push(file);
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
    } else {
      setErrors([]);
    }

    if (validFiles.length > 0) {
      onFilesSelect(validFiles);
    }
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
    if (e.dataTransfer.files) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      validateAndAddFiles(e.target.files);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4 text-left" id="multi-file-dropzone-container">
      
      <div className="flex justify-between items-center">
        <label className="font-display text-xs font-semibold tracking-wide uppercase text-white/50 flex items-center space-x-1.5">
          <Layers className="h-4 w-4 text-brand-cyan shrink-0 animate-pulse" />
          <span>Multitrack Stem & Beat Terminal</span>
        </label>

        {uploadedFilesCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[10px] font-mono text-rose-400 hover:text-rose-500 hover:underline uppercase tracking-wide"
          >
            Clear Uploads ({uploadedFilesCount})
          </button>
        )}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 min-h-[180px] ${
          isDragActive
            ? 'border-brand-green bg-brand-green/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
            : uploadedFilesCount > 0
            ? 'border-brand-cyan/40 bg-white/[0.01]'
            : 'border-white/10 hover:border-brand-green/35 hover:bg-white/[0.02]'
        }`}
        id="multi-drop-pad"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleInputChange}
          className="hidden"
          accept=".mp3,.m4a,.aac,.ogg"
          multiple
          id="multi-file-file-input"
        />

        <div className="flex flex-col items-center space-y-3 max-w-lg">
          <div className={`p-4 rounded-full bg-black border transition-transform duration-205 ${
            isDragActive ? 'scale-110 border-brand-green text-brand-green' : 'border-white/10 text-white/30'
          }`}>
            <Upload className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <h4 className="font-display font-bold text-sm text-white/90">
              {isDragActive ? "Inhale and release to load files!" : "Drag in your vocals and beat."}
            </h4>
            <p className="font-sans text-xs text-white/50 leading-relaxed">
              Upload your dry lead vocal, 2-track instrumental, adlibs, dubs, or finished mix.
            </p>
            <p className="font-mono text-3xs text-brand-cyan/80 font-extrabold uppercase tracking-wide pt-2">
              Accepted formats: MP3, M4A, AAC, OGG
            </p>
            <p className="font-sans text-[9px] text-white/50 mt-1">
              WAV 48kHz lossless export is available for paid plans and future backend processing.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Error Log */}
      {errors.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 space-y-1.5" id="multi-drop-errors-log">
          <div className="flex items-center space-x-1.5 font-sans text-xs font-extrabold text-rose-500">
            <AlertTriangle className="h-4 w-4" />
            <span>Format Warnings:</span>
          </div>
          <ul className="list-disc pl-5 text-[11px] text-rose-400 font-mono space-y-1">
            {errors.map((err, idx) => (
              <li key={idx} className="leading-snug">{err}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
