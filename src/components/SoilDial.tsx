import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface ISoilDialProps {
  value: number;
  onChange: (value: number) => void;
  readOnly?: boolean;
}

/**
 * Reusable Circular Soil pH Dial Gauge component.
 * Visualizes soil acidity/alkalinity using a thin indicator needle.
 * 
 * @param props Props containing the pH value, change handler, and optional read-only flag.
 */
export const SoilDial: React.FC<ISoilDialProps> = ({ value, onChange, readOnly = false }) => {
  const clampedValue = Math.min(Math.max(value, 3.5), 8.5);
  
  // Convert pH range (3.5 to 8.5) to SVG rotation degrees (-90deg to +90deg)
  const percent = (clampedValue - 3.5) / (8.5 - 3.5);
  const rotationDegrees = -90 + percent * 180;

  // Determine active colors based on pH level
  let textColor = 'text-rose-400';
  let statusText = 'Acidic';
  let needleColor = '#f43f5e'; // Rose-500

  if (clampedValue >= 5.5 && clampedValue <= 7.0) {
    textColor = 'text-emerald-400';
    statusText = 'Optimal';
    needleColor = '#10b981'; // Emerald-500
  } else if (clampedValue > 7.0) {
    textColor = 'text-amber-400';
    statusText = 'Alkaline';
    needleColor = '#f59e0b'; // Amber-500
  }

  const handleAdjust = (amount: number) => {
    if (readOnly) return;
    const newVal = Math.round((clampedValue + amount) * 10) / 10;
    if (newVal >= 3.5 && newVal <= 8.5) {
      onChange(newVal);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-zinc-950/20 border border-zinc-900 rounded-2xl w-full max-w-[200px] transition-all duration-200">
      
      {/* SVG Dial Gauge */}
      <div className="relative w-36 h-20 flex items-center justify-center overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 100 55">
          {/* Background Track Arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#18181b"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Acidity (Red) Arc Section */}
          <path
            d="M 10 50 A 40 40 0 0 1 42 18"
            fill="none"
            stroke="rgba(244, 63, 94, 0.2)"
            strokeWidth="3.5"
          />

          {/* Optimal (Green) Arc Section */}
          <path
            d="M 42 18 A 40 40 0 0 1 66 18"
            fill="none"
            stroke="rgba(16, 185, 129, 0.2)"
            strokeWidth="3.5"
          />

          {/* Alkaline (Gold) Arc Section */}
          <path
            d="M 66 18 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="rgba(245, 158, 11, 0.2)"
            strokeWidth="3.5"
          />

          {/* Needle Center Point */}
          <circle cx="50" cy="50" r="3.5" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
          
          {/* Rotating Needle Pointer */}
          <g transform={`rotate(${rotationDegrees} 50 50)`}>
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="16"
              stroke={needleColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* Central pH Number Display */}
        <div className="absolute bottom-0 text-center">
          <span className={`text-xl font-bold tracking-tight ${textColor}`}>
            {clampedValue.toFixed(1)}
          </span>
          <span className="text-[8px] font-medium text-zinc-500 uppercase tracking-widest block mt-0.5">
            {statusText}
          </span>
        </div>
      </div>

      {/* Adjustment Controllers */}
      {!readOnly && (
        <div className="flex items-center space-x-2.5 mt-3.5">
          <button
            type="button"
            onClick={() => handleAdjust(-0.1)}
            className="p-1 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 active:scale-95 transition-all cursor-pointer"
            aria-label="Decrease pH"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 select-none">pH</span>
          <button
            type="button"
            onClick={() => handleAdjust(0.1)}
            className="p-1 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 active:scale-95 transition-all cursor-pointer"
            aria-label="Increase pH"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
