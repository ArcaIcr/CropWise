import React, { useState } from 'react';

interface IAddPlotFormProps {
  onSubmit: (plotData: {
    plotName: string;
    crop: string;
    areaHectares: number;
    locationText?: string;
    plantingDate: string;
    cropStage: string;
  }) => void;
  onCancel: () => void;
}

/**
 * Reusable AddPlotForm component.
 * Allows adding agricultural plots for smallholder farmers.
 * 
 * @param props Props containing submit and cancel handlers.
 */
export const AddPlotForm: React.FC<IAddPlotFormProps> = ({ onSubmit, onCancel }) => {
  const [plotName, setPlotName] = useState<string>('');
  const [plotCrop, setPlotCrop] = useState<string>('Corn');
  const [plotArea, setPlotArea] = useState<number>(1.0);
  const [plotLocation, setPlotLocation] = useState<string>('');
  const [plotPlantingDate, setPlotPlantingDate] = useState<string>('');
  const [plotStage, setPlotStage] = useState<string>('Basal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plotName || !plotPlantingDate) return;
    onSubmit({
      plotName,
      crop: plotCrop,
      areaHectares: Number(plotArea),
      locationText: plotLocation || undefined,
      plantingDate: plotPlantingDate,
      cropStage: plotStage
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 sm:p-5 space-y-4 animate-fadeIn">
      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400">Add Farm Plot</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Plot Name */}
        <div className="space-y-1.5">
          <label className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Plot Name / Reference *</label>
          <input
            type="text"
            required
            value={plotName}
            onChange={e => setPlotName(e.target.value)}
            placeholder="e.g. North Hillside"
            className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-655 outline-none transition-all min-h-[44px]"
          />
        </div>

        {/* Cultivated Crop */}
        <div className="space-y-1.5">
          <label className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Cultivated Crop *</label>
          <select
            value={plotCrop}
            onChange={e => setPlotCrop(e.target.value)}
            className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/30 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-slate-100 outline-none transition-all cursor-pointer min-h-[44px]"
          >
            <option value="Corn">Corn (White/Yellow)</option>
            <option value="Rice">Rice (Lowland)</option>
          </select>
        </div>

        {/* Area Hectares */}
        <div className="space-y-1.5">
          <label className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Size (Hectares) *</label>
          <input
            type="number"
            step="0.01"
            required
            min="0.05"
            value={plotArea}
            onChange={e => setPlotArea(Number(e.target.value))}
            className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/30 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-slate-100 outline-none transition-all min-h-[44px]"
          />
        </div>

        {/* Planting Date */}
        <div className="space-y-1.5">
          <label className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Planting Date *</label>
          <input
            type="date"
            required
            value={plotPlantingDate}
            onChange={e => setPlotPlantingDate(e.target.value)}
            className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/30 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-slate-100 outline-none transition-all cursor-pointer min-h-[44px]"
          />
        </div>

        {/* Location Text */}
        <div className="space-y-1.5">
          <label className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Location Reference</label>
          <input
            type="text"
            value={plotLocation}
            onChange={e => setPlotLocation(e.target.value)}
            placeholder="Near the municipal boundary marker"
            className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-655 outline-none transition-all min-h-[44px]"
          />
        </div>

        {/* Crop Stage */}
        <div className="space-y-1.5">
          <label className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Current Stage</label>
          <select
            value={plotStage}
            onChange={e => setPlotStage(e.target.value)}
            className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/30 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-slate-100 outline-none transition-all cursor-pointer min-h-[44px]"
          >
            <option value="Basal">Land Preparation / Basal Stage</option>
            <option value="Early Vegetative">Early Vegetative (V1-V5 / Early Tillering)</option>
            <option value="Vegetative">Active Vegetative (V6-V10 / Active Tillering)</option>
            <option value="Reproductive">Reproductive (Tasseling / Panicle Initiation)</option>
          </select>
        </div>
      </div>

      {/* Button controls */}
      <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-slate-800 hover:bg-slate-700 text-slate-350 font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl transition cursor-pointer w-full sm:w-auto min-h-[44px]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl transition cursor-pointer shadow-md w-full sm:w-auto min-h-[44px]"
        >
          Save Plot
        </button>
      </div>
    </form>
  );
};
