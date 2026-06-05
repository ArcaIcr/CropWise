import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface INutrientWellProps {
  label: string;
  value: number;
  maxVal: number;
  unit?: string;
  onChange: (value: number) => void;
  readOnly?: boolean;
  colorType?: 'nitrogen' | 'phosphorus' | 'potassium';
}

/**
 * Reusable Vertical Bioluminescent Nutrient Well component.
 * Represents soil chemical concentrations as glowing fluid levels inside glass vials.
 * 
 * @param props Props containing values, ranges, change handlers, and styling parameters.
 */
export const NutrientWell: React.FC<INutrientWellProps> = ({
  label,
  value,
  maxVal,
  unit = 'ppm',
  onChange,
  readOnly = false,
  colorType = 'nitrogen'
}) => {
  const percent = Math.min(Math.max((value / maxVal) * 100, 0), 100);

  // Dynamic colors and status text based on value thresholds
  let glowColor = 'from-rose-500/80 to-rose-600/80'; // Low (Default)
  let statusLabel = 'Deficient';
  let shadowGlow = 'rgba(239, 68, 68, 0.4)';

  if (colorType === 'nitrogen') {
    if (value > 20 && value <= 40) {
      glowColor = 'from-amber-500/80 to-amber-600/80';
      statusLabel = 'Moderate';
      shadowGlow = 'rgba(245, 166, 35, 0.4)';
    } else if (value > 40) {
      glowColor = 'from-emerald-400/80 to-emerald-500/80';
      statusLabel = 'Optimal';
      shadowGlow = 'rgba(16, 185, 129, 0.4)';
    }
  } else if (colorType === 'phosphorus') {
    if (value > 8 && value <= 15) {
      glowColor = 'from-amber-500/80 to-amber-600/80';
      statusLabel = 'Moderate';
      shadowGlow = 'rgba(245, 166, 35, 0.4)';
    } else if (value > 15) {
      glowColor = 'from-emerald-400/80 to-emerald-500/80';
      statusLabel = 'Optimal';
      shadowGlow = 'rgba(16, 185, 129, 0.4)';
    }
  } else if (colorType === 'potassium') {
    if (value > 60 && value <= 100) {
      glowColor = 'from-amber-500/80 to-amber-600/80';
      statusLabel = 'Moderate';
      shadowGlow = 'rgba(245, 166, 35, 0.4)';
    } else if (value > 100) {
      glowColor = 'from-emerald-400/80 to-emerald-500/80';
      statusLabel = 'Optimal';
      shadowGlow = 'rgba(16, 185, 129, 0.4)';
    }
  }

  const handleAdjust = (amount: number) => {
    if (readOnly) return;
    const newVal = Math.min(Math.max(value + amount, 0), maxVal);
    onChange(newVal);
  };

  /**
   * Adjusts level directly by clicking on the vial container.
   */
  const handleVialClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top; // pixel position from top of the vial
    const fillPercent = 1 - (clickY / rect.height); // percent from bottom
    const calculatedValue = Math.round(fillPercent * maxVal);
    onChange(Math.min(Math.max(calculatedValue, 0), maxVal));
  };

  return (
    <div className="flex flex-col items-center p-4 bg-slate-950/60 border border-white/5 rounded-2xl shadow-xl hover:border-emerald-500/20 transition-all duration-300 w-full">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">{label}</span>
      
      {/* Bioluminescent Glass Vial */}
      <div 
        onClick={handleVialClick}
        className="w-12 h-36 bg-slate-900 border-2 border-slate-700/60 rounded-full relative overflow-hidden flex flex-col justify-end shadow-inner cursor-ns-resize"
        style={{ boxShadow: `inset 0 0 10px rgba(0,0,0,0.8), 0 0 5px rgba(255,255,255,0.05)` }}
      >
        {/* Glowing Fluid Level */}
        <div 
          className={`w-full bg-gradient-to-t ${glowColor} transition-all duration-200 rounded-b-full`}
          style={{ 
            height: `${percent}%`,
            boxShadow: `0 0 15px ${shadowGlow}`
          }}
        />

        {/* Measuring tick markers */}
        <div className="absolute inset-y-4 right-1.5 flex flex-col justify-between pointer-events-none text-[8px] font-mono text-slate-600 select-none">
          <span>- Max</span>
          <span>- Mid</span>
          <span>- Min</span>
        </div>
      </div>

      {/* Numerical Value display */}
      <div className="text-center mt-3.5 space-y-0.5">
        <span className="text-sm font-bold text-slate-100 block">
          {value} <span className="text-[10px] text-slate-500 font-medium">{unit}</span>
        </span>
        <span className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900/50 border border-white/5 block ${
          statusLabel === 'Optimal' ? 'text-emerald-400' : statusLabel === 'Moderate' ? 'text-amber-400' : 'text-rose-500'
        }`}>
          {statusLabel}
        </span>
      </div>

      {/* Adjustment Buttons */}
      {!readOnly && (
        <div className="flex items-center space-x-2 mt-3.5">
          <button
            type="button"
            onClick={() => handleAdjust(-5)}
            className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-white rounded-md border border-white/5 active:scale-90 transition cursor-pointer"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => handleAdjust(5)}
            className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-white rounded-md border border-white/5 active:scale-90 transition cursor-pointer"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
