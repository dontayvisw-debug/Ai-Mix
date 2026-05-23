import React from 'react';
import { Layers, HelpCircle, Check, AlertCircle } from 'lucide-react';

export type FileRole = 
  | 'lead_vocal' 
  | 'lead_double' 
  | 'adlibs' 
  | 'dubs' 
  | 'instrumental' 
  | 'rough_mix' 
  | 'finished_mix' 
  | 'reference' 
  | 'ignore';

export interface SessionFile {
  id: string;
  name: string;
  size: number;
  assignedRole: FileRole;
}

interface SessionFileMapperProps {
  files: SessionFile[];
  onRoleChange: (id: string, newRole: FileRole) => void;
  onConfirm: () => void;
}

export const ROLE_OPTIONS: { value: FileRole; label: string; desc: string }[] = [
  { value: 'lead_vocal', label: 'Lead Vocal', desc: 'Main foreground melody or dry rap take.' },
  { value: 'lead_double', label: 'Lead Vocal Double', desc: 'Parallel layers giving thickness to leads.' },
  { value: 'adlibs', label: 'Adlibs', desc: 'Background accents, wide-panned callouts.' },
  { value: 'dubs', label: 'Dubs', desc: 'Specific phrase highlight stacks tucked underneath.' },
  { value: 'instrumental', label: '2-Track Instrumental', desc: 'The base target beat file.' },
  { value: 'rough_mix', label: 'Rough Mix', desc: 'Pre-mixed reference render for balance.' },
  { value: 'finished_mix', label: 'Finished Mix', desc: 'Pre-balanced stereo mixdown ready for mastering.' },
  { value: 'reference', label: 'Reference Track', desc: 'Commercial hit file to mirror sonic curves.' },
  { value: 'ignore', label: 'Ignore File', desc: 'Skip importing this stem into pipeline.' },
];

export function autoDetectRole(fileName: string): FileRole {
  const normalized = fileName.toLowerCase();
  if (normalized.includes('lead 1') || normalized.includes('lead_1') || (normalized.includes('vocal') && !normalized.includes('double') && !normalized.includes('backup') && !normalized.includes('adlib') && !normalized.includes('libs') && !normalized.includes('dub'))) {
    return 'lead_vocal';
  }
  if (normalized.includes('lead 2') || normalized.includes('lead_2') || normalized.includes('double') || normalized.includes('vocal double')) {
    return 'lead_double';
  }
  if (normalized.includes('libs') || normalized.includes('adlib') || normalized.includes('ad-lib')) {
    return 'adlibs';
  }
  if (normalized.includes('dub') || normalized.includes('dubs')) {
    return 'dubs';
  }
  if (normalized.includes('mix this 77 bpm') || normalized.includes('mix_this') || normalized.includes('beat') || normalized.includes('instrumental') || normalized.includes('inst')) {
    return 'instrumental';
  }
  if (normalized.includes('rough') || normalized.includes('premix')) {
    return 'rough_mix';
  }
  if (normalized.includes('reference') || normalized.includes('ref')) {
    return 'reference';
  }
  return 'lead_vocal'; // default fallback
}

export default function SessionFileMapper({
  files,
  onRoleChange,
  onConfirm
}: SessionFileMapperProps) {
  
  const hasInstrumental = files.some(f => f.assignedRole === 'instrumental');
  const hasLeadVocal = files.some(f => f.assignedRole === 'lead_vocal');

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 text-left space-y-6" id="session-file-mapper-container">
      
      <div className="flex justify-between items-start border-b border-white/5 pb-4">
        <div>
          <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-cyan/10 text-brand-cyan font-mono text-[10px] font-extrabold border border-brand-cyan/20">A</span>
            <span>Manual Vocal & Beat File Mapping</span>
          </h4>
          <p className="font-sans text-xs text-white/50 mt-1">
            Review and adjust each file's exact vocal/beat role. Real artists use creative names; override roles below as needed.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="border-b border-white/10 text-white/40 uppercase font-mono text-3xs tracking-wider">
              <th className="py-3 px-2">Uploaded Filename</th>
              <th className="py-3 px-2">File Size</th>
              <th className="py-3 px-2">Auto-Detected / Assigned Role</th>
              <th className="py-3 px-2 text-right">Mapping Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white/90">
            {files.map((file) => (
              <tr key={file.id} className="hover:bg-white/[0.01] transition-colors">
                <td className="py-3.5 px-2 font-mono text-[11px] truncate max-w-[200px]" title={file.name}>
                  {file.name}
                </td>
                <td className="py-3.5 px-2 text-white/50 font-mono">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </td>
                <td className="py-3.5 px-2">
                  <select
                    value={file.assignedRole}
                    onChange={(e) => onRoleChange(file.id, e.target.value as FileRole)}
                    className="bg-[#020202] border border-white/10 rounded-xl px-2.5 py-1.5 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none text-[11px] text-white/90 w-full max-w-[220px]"
                  >
                    {ROLE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} title={opt.desc}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3.5 px-2 text-right">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 font-mono text-4xs uppercase tracking-widest font-bold">
                    <Check className="h-2.5 w-2.5" />
                    <span>Mapped</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Core Session Warnings */}
        <div className="flex items-center space-x-2 text-3xs text-white/40 font-sans">
          {!hasInstrumental && (
            <div className="flex items-center space-x-1 text-amber-500">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>Missing 2-Track Instrumental beat</span>
            </div>
          )}
          {!hasLeadVocal && (
            <div className="flex items-center space-x-1 text-amber-500">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>Missing dry Lead Vocal stem</span>
            </div>
          )}
          {hasInstrumental && hasLeadVocal && (
            <div className="flex items-center space-x-1 text-brand-cyan">
              <Check className="h-3.5 w-3.5 shrink-0" />
              <span>Lead Vocal & Beat successfully locked. Session ready for mixedbytae.</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onConfirm}
          className="rounded-xl bg-gradient-to-r from-brand-cyan to-brand-green hover:opacity-90 text-black font-display font-black text-2xs uppercase tracking-wider px-5 py-3 transition-all duration-200 shrink-0"
        >
          Confirm Session Files
        </button>
      </div>
      
    </div>
  );
}
