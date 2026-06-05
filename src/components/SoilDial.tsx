import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface ISoilDialProps {
  value: number;
  onChange: (value: number) => void;
  readOnly?: boolean;
}

/**
 * Reusable Circular Soil pH Dial Gauge component.
 * Visualizes soil acidity/alkalinity using a rotating indicator needle.
 * 
 * @param props Props containing the pH value, change handler, and optional read-only flag.
 */
export const SoilDial: React.FC<ISoilDialProps> = ({ value, onChange, readOnly = false }) => {
  // Ensure value stays within bounds
  const clampedValue = Math.min(Math.max(value, 3.5), 8.5);
  
  // Convert pH range (3.5 to 8.5) to SVG rotation degrees (-90deg to +90deg)
  const percent = (clampedValue - 3.5) / (8.5 - 3.5);
  const rotationDegrees = -90 + percent * 180;

  // Determine active colors based on pH level
  let glowColor = 'rgba(239, 68, 68, 0.4)'; // Acidic Red
  let textColor = 'text-rose-500';
  let statusText = 'Acidic';

  if (clampedValue >= 5.5 && clampedValue <= 7.0) {
    glowColor = 'rgba(16, 185, 129, 0.4)'; // Neutral Emerald
    textColor = 'text-emerald-400';
    statusText = 'Optimal (Neutral)';
  } else if (clampedValue > 7.0) {
    glowColor = 'rgba(245, 166, 35, 0.4)'; // Alkaline Gold
    textColor = 'text-amber-400';
    statusText = 'Alkaline';
  }

  const handleAdjust = (amount: number) => {
    if (readOnly) return;
    const newVal = Math.round((clampedValue + amount) * 10) / 10;
    if (newVal >= 3.5 && newVal <= 8.5) {
      onChange(newVal);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-slate-950/60 border border-white/5 rounded-2xl relative shadow-xl hover:border-emerald-500/20 transition-all duration-300">
      
      {/* SVG Dial Gauge */}
      <div className="relative w-40 h-24 flex items-center justify-center overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 100 55">
          {/* Background Track Arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Acidity (Red) Arc Section */}
          <path
            d="M 10 50 A 40 40 0 0 1 42 18"
            fill="none"
            stroke="rgba(239, 68, 68, 0.5)"
            strokeWidth="8"
          />

          {/* Optimal (Green) Arc Section */}
          <path
            d="M 42 18 A 40 40 0 0 1 66 18"
            fill="none"
            stroke="rgba(16, 185, 129, 0.5)"
            strokeWidth="8"
          />

          {/* Alkaline (Gold) Arc Section */}
          <path
            d="M 66 18 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="rgba(245, 166, 35, 0.5)"
            strokeWidth="8"
          />

          {/* Needle Center Point */}
          <circle cx="50" cy="50" r="4" fill="#ffffff" />
          
          {/* Rotating Needle Pointer */}
          <g transform={`rotate(${rotationDegrees} 50 50)`}>
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="15"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 3px ${glowColor})` }}
            />
          </g>
        </svg>

        {/* Central pH Number Display */}
        <div className="absolute bottom-0 text-center">
          <span className={`text-2xl font-extrabold tracking-tight ${textColor} drop-shadow-[0_0_8px_${glowColor}]`}>
            {clampedValue.toFixed(1)}
          </span>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
            {statusText}
          </span>
        </div>
      </div>

      {/* Adjustment Controllers */}
      {!readOnly && (
        <div className="flex items-center space-x-3 mt-4">
          <button
            type="button"
            onClick={() => handleAdjust(-0.1)}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-white/5 active:scale-90 transition cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Soil pH</span>
          <button
            type="button"
            onClick={() => handleAdjust(0.1)}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-white/5 active:scale-90 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
