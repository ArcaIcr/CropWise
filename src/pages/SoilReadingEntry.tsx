import React, { useState, useEffect } from 'react';
import { db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Beaker, ArrowRight, Info, AlertTriangle } from 'lucide-react';
import type { ISoilReading, IFertilizerReport } from '../types/database';
import { generateRecommendation } from '../services/recommendations';
import { SoilDial } from '../components/SoilDial';
import { NutrientWell } from '../components/NutrientWell';

interface ISoilReadingEntryProps {
  onReportGenerated: (reportId: string) => void;
}

/**
 * SoilReadingEntry component. Allows field technicians to log soil diagnostic readings,
 * execute rule matching, and persist calculated fertilizer reports.
 * Beautified with premium dark instrumentation styling.
 * 
 * @param props Props containing the callback executed on successful report generation.
 */
export const SoilReadingEntry: React.FC<ISoilReadingEntryProps> = ({ onReportGenerated }) => {
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('');
  const [selectedPlotId, setSelectedPlotId] = useState<string>('');
  
  // Reading form inputs
  const [readingSource, setReadingSource] = useState<'manual' | 'hardware' | 'lab'>('manual');
  const [ph, setPh] = useState<number>(6.0);
  const [nitrogen, setNitrogen] = useState<number>(25);
  const [phosphorus, setPhosphorus] = useState<number>(15);
  const [potassium, setPotassium] = useState<number>(80);

  // Optional sensor fields
  const [moisture, setMoisture] = useState<number>(30);
  const [temperature, setTemperature] = useState<number>(26.5);
  const [ec, setEc] = useState<number>(0.8);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch farmers and plots list
  const farmers = useLiveQuery(
    async () => {
      const allFarmers = await db.farmers.toArray();
      return allFarmers.filter(f => !f.isDeleted);
    },
    []
  );

  const plots = useLiveQuery(
    async () => {
      if (!selectedFarmerId) return [];
      const allPlots = await db.plots.where('farmerId').equals(selectedFarmerId).toArray();
      return allPlots.filter(p => !p.isDeleted);
    },
    [selectedFarmerId]
  );

  // Reset selected plot when farmer changes
  useEffect(() => {
    setSelectedPlotId('');
  }, [selectedFarmerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlotId || !selectedFarmerId) {
      setErrorMessage('Please select a farmer and a target farm plot.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const selectedPlot = await db.plots.get(selectedPlotId);
      if (!selectedPlot) throw new Error('Selected plot not found in database.');

      const rules = await db.recommendationRules.toArray();

      const readingId = crypto.randomUUID();
      const now = Date.now();

      // 1. Create and save soil reading
      const newReading: ISoilReading = {
        id: readingId,
        plotId: selectedPlotId,
        cooperativeId: 'coop-default-uuid',
        source: readingSource,
        ph: Number(ph),
        nitrogen: Number(nitrogen),
        phosphorus: Number(phosphorus),
        potassium: Number(potassium),
        moisture: Number(moisture),
        temperature: Number(temperature),
        electricalConductivity: Number(ec),
        collectedAt: now,
        createdBy: 'tech-default-uuid',
        createdAt: now,
        updatedAt: now,
        isDeleted: false
      };

      await db.soilReadings.add(newReading);

      // 2. Run recommendation calculations
      const recResult = generateRecommendation(
        newReading,
        rules,
        selectedPlot.crop,
        'Northern Mindanao',
        selectedPlot.areaHectares
      );

      // Sum up total fertilizer weight needed
      const fertilizerTotalKg = recResult.totalFertilizers.reduce((sum, f) => sum + f.totalKg, 0);

      // 3. Create and save report record
      const reportId = crypto.randomUUID();
      const newReport: IFertilizerReport = {
        id: reportId,
        plotId: selectedPlotId,
        soilReadingId: readingId,
        cooperativeId: 'coop-default-uuid',
        recommendationSummary: JSON.stringify(recResult),
        fertilizerTotalKg,
        reportStatus: 'finalized',
        generatedAt: now,
        generatedBy: 'tech-default-uuid',
        createdAt: now,
        updatedAt: now,
        isDeleted: false
      };

      await db.fertilizerReports.add(newReport);

      // Trigger callback with generated report ID
      onReportGenerated(reportId);
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage('Failed to generate report. Please verify rules database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-bold text-slate-100 m-0">Log Soil Readings</h2>
        <p className="text-slate-400 text-xs mt-1">Input regional N-P-K soil values to calculate customized fertilizer recommendation reports.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/25 text-red-400 p-4 rounded-xl text-xs animate-shake">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Section 1: Plot Selector */}
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">1. Target Location</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Select Farmer *</label>
              <select
                required
                value={selectedFarmerId}
                onChange={e => setSelectedFarmerId(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 focus:border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none transition-all cursor-pointer"
              >
                <option value="">-- Choose a registered farmer --</option>
                {farmers?.map(farmer => (
                  <option key={farmer.id} value={farmer.id}>{farmer.name} (Brgy. {farmer.barangay})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Select Plot *</label>
              <select
                required
                disabled={!selectedFarmerId}
                value={selectedPlotId}
                onChange={e => setSelectedPlotId(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 focus:border-emerald-500/30 disabled:bg-slate-950 disabled:text-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none transition-all cursor-pointer"
              >
                <option value="">-- Choose target plot --</option>
                {plots?.map(plot => (
                  <option key={plot.id} value={plot.id}>{plot.plotName} ({plot.crop} - {plot.areaHectares} Hectares)</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Soil Reading Values */}
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">2. Soil Chemistry (N-P-K & pH)</h3>
            <div className="flex items-center space-x-1 bg-slate-950 border border-white/5 p-0.5 rounded-xl text-[10px]">
              <button
                type="button"
                onClick={() => setReadingSource('manual')}
                className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition cursor-pointer ${
                  readingSource === 'manual' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Manual
              </button>
              <button
                type="button"
                onClick={() => setReadingSource('hardware')}
                className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition cursor-pointer ${
                  readingSource === 'hardware' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Probe/Sensor
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Soil pH Gauge Dial */}
            <div className="w-full flex justify-center">
              <SoilDial
                value={ph}
                onChange={setPh}
              />
            </div>

            {/* Nitrogen Well */}
            <div className="w-full flex justify-center">
              <NutrientWell
                label="Nitrogen (N)"
                value={nitrogen}
                maxVal={60}
                colorType="nitrogen"
                onChange={setNitrogen}
              />
            </div>

            {/* Phosphorus Well */}
            <div className="w-full flex justify-center">
              <NutrientWell
                label="Phosphorus (P)"
                value={phosphorus}
                maxVal={25}
                colorType="phosphorus"
                onChange={setPhosphorus}
              />
            </div>

            {/* Potassium Well */}
            <div className="w-full flex justify-center">
              <NutrientWell
                label="Potassium (K)"
                value={potassium}
                maxVal={120}
                colorType="potassium"
                onChange={setPotassium}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Sensor Parameters (Visible for hardware/sensor readings) */}
        {readingSource === 'hardware' && (
          <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 sm:p-6 space-y-4 animate-fadeIn">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">3. Environmental Readings (IoT Probe Sensors)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Moisture (%)</label>
                <input
                  type="number"
                  value={moisture}
                  onChange={e => setMoisture(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-white/5 focus:border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={e => setTemperature(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-white/5 focus:border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">EC (dS/m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={ec}
                  onChange={e => setEc(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-white/5 focus:border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex items-start space-x-2 text-[10px] text-slate-500 bg-slate-950/45 p-2.5 rounded-xl border border-white/5">
              <Info className="w-3.5 h-3.5 text-emerald-500/70 shrink-0 mt-0.5" />
              <span>Environmental factors are pulled dynamically from multi-depth sensor calibrations to verify soil condition index.</span>
            </div>
          </div>
        )}

        {/* Submit Action */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !selectedPlotId}
            className="flex items-center space-x-2 bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-550 hover:bg-emerald-500 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-950/20 active:scale-95 cursor-pointer hover:scale-[1.01]"
          >
            <Beaker className="w-4.5 h-4.5 animate-pulse" />
            <span>{isSubmitting ? 'Processing...' : 'Run Diagnostics'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </form>
    </div>
  );
};
