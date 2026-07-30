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
 * Reusable Vertical Nutrient Well component.
 * Represents soil chemical concentrations as clean fluid levels inside flat glass tubes.
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
  let fillBg = 'bg-rose-500'; // Low (Default)
  let statusLabel = 'Deficient';
  let statusTextClass = 'text-rose-400 bg-rose-950/20 border-rose-900/30';

  if (colorType === 'nitrogen') {
    if (value > 20 && value <= 40) {
      fillBg = 'bg-amber-500';
      statusLabel = 'Moderate';
      statusTextClass = 'text-amber-400 bg-amber-950/20 border-amber-900/30';
    } else if (value > 40) {
      fillBg = 'bg-emerald-500';
      statusLabel = 'Optimal';
      statusTextClass = 'text-emerald-400 bg-emerald-950/20 border-emerald-900/30';
    }
  } else if (colorType === 'phosphorus') {
    if (value > 8 && value <= 15) {
      fillBg = 'bg-amber-500';
      statusLabel = 'Moderate';
      statusTextClass = 'text-amber-400 bg-amber-950/20 border-amber-900/30';
    } else if (value > 15) {
      fillBg = 'bg-emerald-500';
      statusLabel = 'Optimal';
      statusTextClass = 'text-emerald-400 bg-emerald-950/20 border-emerald-900/30';
    }
  } else if (colorType === 'potassium') {
    if (value > 60 && value <= 100) {
      fillBg = 'bg-amber-500';
      statusLabel = 'Moderate';
      statusTextClass = 'text-amber-400 bg-amber-950/20 border-amber-900/30';
    } else if (value > 100) {
      fillBg = 'bg-emerald-500';
      statusLabel = 'Optimal';
      statusTextClass = 'text-emerald-400 bg-emerald-950/20 border-emerald-900/30';
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
    <div className="flex flex-col items-center p-3 sm:p-4 bg-zinc-950/20 border border-zinc-900 rounded-2xl w-full max-w-[150px] transition-all duration-200">
      <span className="text-[8px] sm:text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-3 select-none">{label}</span>
      
      {/* Precision Glass Graduated Cylinder */}
      <div 
        onClick={handleVialClick}
        className="w-8 sm:w-10 h-24 sm:h-32 bg-zinc-950 border border-zinc-800 rounded-xl relative overflow-hidden flex flex-col justify-end shadow-inner cursor-ns-resize min-h-[44px]"
      >
        {/* Fill Level */}
        <div 
          className={`w-full ${fillBg} transition-all duration-150 rounded-b-lg`}
          style={{ height: `${percent}%` }}
        />

        {/* Measuring Ticks */}
        <div className="absolute inset-y-2 right-1.5 flex flex-col justify-between pointer-events-none text-[6px] sm:text-[7px] font-mono text-zinc-700 select-none">
          <span>— Max</span>
          <span>— Mid</span>
          <span>— Min</span>
        </div>
      </div>

      {/* Numerical Value display */}
      <div className="text-center mt-3 space-y-1 w-full">
        <span className="text-sm sm:text-xs font-bold text-zinc-100 block">
          {value} <span className="text-[8px] sm:text-[9px] text-zinc-500 font-normal">{unit}</span>
        </span>
        <span className={`text-[7px] sm:text-[8px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border block ${statusTextClass}`}>
          {statusLabel}
        </span>
      </div>

      {/* Adjustment Buttons */}
      {!readOnly && (
        <div className="flex items-center space-x-1.5 sm:space-x-2 mt-3">
          <button
            type="button"
            onClick={() => handleAdjust(-5)}
            className="p-1.5 sm:p-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-500 hover:text-white rounded-lg border border-zinc-800 active:scale-95 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={`Decrease ${label}`}
          >
            <Minus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
          </button>
          <button
            type="button"
            onClick={() => handleAdjust(5)}
            className="p-1.5 sm:p-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-500 hover:text-white rounded-lg border border-zinc-800 active:scale-95 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={`Increase ${label}`}
          >
            <Plus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
