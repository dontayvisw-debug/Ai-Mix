import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';


interface SettingsSliderProps {
  key?: any;
  id: string;
  label: string;
  description: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}

export default function SettingsSlider({
  id,
  label,
  description,
  value,
  min = 0,
  max = 100,
  step = 1,
  suffix = '%',
  onChange,
}: SettingsSliderProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="flex flex-col space-y-1.5 p-3.5 rounded-xl bg-white/[0.01] border border-white/5 transition-all duration-200 hover:bg-white/[0.03] hover:border-white/10" id={`slider-wrap-${id}`}>
      
      {/* Header Label and Values */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5 relative">
          <span className="font-display text-xs font-semibold text-white/80">{label}</span>
          <button
            onMouseEnter={() => setShowHelp(true)}
            onMouseLeave={() => setShowHelp(false)}
            onClick={() => setShowHelp(!showHelp)}
            type="button"
            className="text-white/30 hover:text-white/70 focus:outline-none cursor-help transition-colors"
            title="What is this?"
            id={`slider-help-trigger-${id}`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </button>
          
          {/* Tooltip Hover bubble */}
          {showHelp && (
            <div className="absolute left-0 bottom-6 z-10 w-60 rounded-lg bg-[#0A0A0A] border border-white/10 p-2.5 shadow-xl transition-all duration-150 animate-fadeIn" id={`slider-tip-${id}`}>
              <p className="font-sans text-[11px] text-white/85 leading-normal">{description}</p>
            </div>
          )}
        </div>
        <span className="font-mono text-2xs font-bold text-brand-green">{value}{suffix}</span>
      </div>

      {/* Slider range input track */}
      <div className="flex items-center space-x-3 mt-1.5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          id={`input-slider-${id}`}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 accent-brand-green bg-white/10 rounded-lg appearance-none cursor-pointer hover:accent-brand-cyan transition-colors"
        />
      </div>
      
    </div>
  );
}
