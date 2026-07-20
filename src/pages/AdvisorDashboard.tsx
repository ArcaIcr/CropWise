import React, { useState, useEffect } from 'react';
import { db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Sparkles,
  MapPin,
  Droplet,
  Wind,
  Sun,
  CloudSun,
  CloudRain,
  Flame,
  Info,
  Check,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  FileText,
  Leaf,
  Activity
} from 'lucide-react';
import type { ISoilReading } from '../types/database';

interface IAdvisorDashboardProps {
  selectedFarmerId: string;
  setSelectedFarmerId: (id: string) => void;
  selectedPlotId: string;
  setSelectedPlotId: (id: string) => void;
  onViewReport: (reportId: string) => void;
  onLogout: () => void;
}

/**
 * AdvisorDashboard Component.
 * Remodeled and revamped with a premium, state-of-the-art visual style.
 * Combines organic green gradients, glassmorphism card readouts, SVG circular matching dials,
 * and high-fidelity micro-interactions to deliver a wow factor.
 */
export const AdvisorDashboard: React.FC<IAdvisorDashboardProps> = ({
  selectedFarmerId,
  setSelectedFarmerId,
  selectedPlotId,
  setSelectedPlotId,
  onViewReport
}) => {
  const [language, setLanguage] = useState<'en' | 'history'>('en');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [showRecommendedCrops, setShowRecommendedCrops] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(0);

  // Load registered farmers list
  const farmers = useLiveQuery(
    async () => {
      const allFarmers = await db.farmers.toArray();
      return allFarmers.filter(f => !f.isDeleted);
    },
    []
  );

  // Load plots of the selected farmer
  const plots = useLiveQuery(
    async () => {
      if (!selectedFarmerId) return [];
      const allPlots = await db.plots.where('farmerId').equals(selectedFarmerId).toArray();
      return allPlots.filter(p => !p.isDeleted);
    },
    [selectedFarmerId]
  ) || [];

  // Load latest soil reading of selected plot
  const latestReading = useLiveQuery(
    async () => {
      if (!selectedPlotId) return null;
      const readings = await db.soilReadings.where('plotId').equals(selectedPlotId).toArray();
      const validReadings = readings.filter(r => !r.isDeleted);
      if (validReadings.length === 0) return null;
      return validReadings.sort((a, b) => b.collectedAt - a.collectedAt)[0];
    },
    [selectedPlotId]
  );

  // Load latest fertilizer report of selected plot
  const latestReport = useLiveQuery(
    async () => {
      if (!selectedPlotId) return null;
      const reports = await db.fertilizerReports.where('plotId').equals(selectedPlotId).toArray();
      const validReports = reports.filter(r => !r.isDeleted);
      if (validReports.length === 0) return null;
      return validReports.sort((a, b) => b.generatedAt - a.generatedAt)[0];
    },
    [selectedPlotId]
  );

  const selectedFarmer = farmers?.find(f => f.id === selectedFarmerId);

  // Synchronize plot selection if farmer changes
  useEffect(() => {
    if (plots && plots.length > 0) {
      const hasPreviousPlot = plots.some(p => p.id === selectedPlotId);
      if (!hasPreviousPlot) {
        setSelectedPlotId(plots[0].id);
      }
    } else {
      setSelectedPlotId('');
    }
    setShowRecommendedCrops(false);
  }, [selectedFarmerId, plots, selectedPlotId, setSelectedPlotId]);

  // Simulate AI Plan generation loading states
  const handleGeneratePlan = () => {
    setIsGeneratingPlan(true);
    setGenerationStep(0);
    setShowRecommendedCrops(false);
  };

  // Helper function to seed dummy readings if needed
  const handleLoadDemoReading = async () => {
    if (!selectedPlotId) return;
    const now = Date.now();
    const demoReading: ISoilReading = {
      id: crypto.randomUUID(),
      plotId: selectedPlotId,
      cooperativeId: 'coop-default-uuid',
      source: 'hardware',
      ph: 6.8,
      nitrogen: 45,
      phosphorus: 12,
      potassium: 85,
      moisture: 80,
      temperature: 27.5,
      electricalConductivity: 1.2,
      organicMatter: 2.2,
      collectedAt: now,
      createdBy: 'tech-default-uuid',
      createdAt: now,
      updatedAt: now,
      isDeleted: false
    };
    await db.soilReadings.add(demoReading);
  };

  useEffect(() => {
    if (!isGeneratingPlan) return;

    const steps = [
      'Deconstructing mineral indexes...',
      'Matching crop requirements against current N-P-K balances...',
      'Analyzing seasonal monsoon and wind metrics...',
      'Synthesizing crop rotation recommendations...'
    ];

    const interval = setInterval(() => {
      setGenerationStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGeneratingPlan(false);
            setShowRecommendedCrops(true);
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 850);

    return () => clearInterval(interval);
  }, [isGeneratingPlan]);

  const getSoilSummary = (reading: ISoilReading) => {
    const alerts: string[] = [];
    if (reading.ph < 5.5) {
      alerts.push('Acidity is slightly elevated, hindering vital mineral uptake. Liming is recommended before sowing.');
    }
    if (reading.electricalConductivity && reading.electricalConductivity > 2.0) {
      alerts.push('Minor salinity spikes detected; select salt-resistant crop cultivars.');
    } else {
      alerts.push('Low salinity offers a highly favorable medium for vegetable cultivation.');
    }
    if (reading.moisture && reading.moisture > 70) {
      alerts.push('Excellent organic moisture reserves detected, perfect for current seasonal growth.');
    }
    if (reading.organicMatter && reading.organicMatter < 3.0) {
      alerts.push('Incorporate animal manure or natural compost layers to revitalize topsoil structure.');
    }
    return alerts.join(' ');
  };

  // Suitability matching calculator
  const getCropSuitability = (cropName: string, reading: ISoilReading | null) => {
    if (!reading) return { score: 100, desc: 'Baseline measurements assume pre-conditioned topsoil.' };

    let matchScore = 0;
    const descParts: string[] = [];
    const ph = reading.ph;
    const N = reading.nitrogen;
    const P = reading.phosphorus;
    const K = reading.potassium;

    if (cropName === 'Tomato') {
      if (ph >= 6.0 && ph <= 7.0) {
        matchScore += 25;
        descParts.push('Optimal soil acidity detected.');
      } else if (ph >= 5.5 && ph < 6.0) {
        matchScore += 15;
        descParts.push(`Mild acidity (${ph} pH) requires slight lime integration.`);
      } else {
        matchScore += 5;
        descParts.push(`Highly acidic medium (${ph} pH) calls for corrective liming pre-planting.`);
      }

      if (N >= 30 && N <= 60) {
        matchScore += 25;
        descParts.push('Excellent nitrogen reserves.');
      } else if (N < 30) {
        matchScore += 10;
        descParts.push('Nitrogen is deficient; apply organic mulching or urea split basal.');
      } else {
        matchScore += 20;
        descParts.push('Rich nitrogen promotes vine foliage.');
      }

      if (P >= 10 && P <= 20) {
        matchScore += 25;
        descParts.push('Phosphorus level is ideal.');
      } else if (P < 10) {
        matchScore += 10;
        descParts.push('Low Phosphorus; basal phosphate complete fertilizer needed.');
      } else {
        matchScore += 25;
        descParts.push('Phosphorus content is optimal.');
      }

      if (K >= 70 && K <= 110) {
        matchScore += 25;
        descParts.push('Superb Potassium levels.');
      } else if (K < 70) {
        matchScore += 10;
        descParts.push('Potassium deficiency; supplement with Muriate of Potash.');
      } else {
        matchScore += 25;
        descParts.push('Potassium levels support strong fruit set.');
      }
    } else if (cropName === 'Eggplant') {
      if (ph >= 5.5 && ph <= 7.5) {
        matchScore += 25;
        descParts.push('pH matches crop requirements.');
      } else {
        matchScore += 10;
        descParts.push(`Sub-optimal acidity (${ph} pH).`);
      }

      if (N >= 20 && N <= 50) {
        matchScore += 25;
        descParts.push('Good nitrogen baseline.');
      } else if (N < 20) {
        matchScore += 10;
        descParts.push('Nitrogen level is low; supplement required.');
      } else {
        matchScore += 25;
        descParts.push('Abundant Nitrogen levels.');
      }

      if (P >= 8 && P <= 18) {
        matchScore += 25;
        descParts.push('Phosphorus level is satisfactory.');
      } else if (P < 8) {
        matchScore += 10;
        descParts.push('Low Phosphorus levels.');
      } else {
        matchScore += 25;
        descParts.push('Ideal Phosphorus range.');
      }

      if (K >= 60 && K <= 100) {
        matchScore += 25;
        descParts.push('Adequate Potassium baseline.');
      } else if (K < 60) {
        matchScore += 10;
        descParts.push('Potassium supplement recommended.');
      } else {
        matchScore += 25;
        descParts.push('High Potassium supports pest resilience.');
      }
    } else if (cropName === 'Okra') {
      if (ph >= 6.0 && ph <= 8.0) {
        matchScore += 25;
        descParts.push('Acidity levels are perfect.');
      } else if (ph >= 5.0 && ph < 6.0) {
        matchScore += 20;
        descParts.push('Tolerates this moderate acidity level.');
      } else {
        matchScore += 10;
        descParts.push('Acidity limits optimal growth.');
      }

      if (N >= 15 && N <= 40) {
        matchScore += 25;
        descParts.push('Nitrogen baseline is sufficient.');
      } else if (N < 15) {
        matchScore += 15;
        descParts.push('Okra adapts well to this low Nitrogen baseline.');
      } else {
        matchScore += 25;
        descParts.push('Rich Nitrogen levels.');
      }

      if (P >= 5 && P <= 15) {
        matchScore += 25;
        descParts.push('Phosphorus content matches Okra perfectly.');
      } else if (P < 5) {
        matchScore += 15;
        descParts.push('Low Phosphorus tolerated, but starter fertilizer helps.');
      } else {
        matchScore += 25;
        descParts.push('Rich Phosphorus levels.');
      }

      if (K >= 50 && K <= 90) {
        matchScore += 25;
        descParts.push('Ideal Potassium profile.');
      } else if (K < 50) {
        matchScore += 15;
        descParts.push('Low Potassium; yield might be minorly restricted.');
      } else {
        matchScore += 25;
        descParts.push('Optimal Potassium levels.');
      }
    }

    return {
      score: matchScore,
      desc: descParts.join(' ')
    };
  };

  const tomatoSuitability = getCropSuitability('Tomato', latestReading || null);
  const eggplantSuitability = getCropSuitability('Eggplant', latestReading || null);
  const okraSuitability = getCropSuitability('Okra', latestReading || null);

  const recommendedCrops = [
    {
      name: 'Tomato',
      category: 'Fruit Vegetable',
      icon: '🍅',
      growth: '75–85 days',
      spacing: '60cm apart',
      ph: '6.0–7.0',
      water: 'Moderate',
      season: 'Year-round',
      yield: '2–3 kg/plant',
      score: tomatoSuitability.score,
      desc: `${tomatoSuitability.desc} Thrives in clay-loam soil with good drainage. High potassium supports fruit development. Current weather pattern ideal for transplanting.`
    },
    {
      name: 'Eggplant',
      category: 'Fruit Vegetable',
      icon: '🍆',
      growth: '70–80 days',
      spacing: '45cm apart',
      ph: '5.5–7.5',
      water: 'Moderate - High',
      season: 'Dry-Wet Transition',
      yield: '1.5–2 kg/plant',
      score: eggplantSuitability.score,
      desc: `${eggplantSuitability.desc} Excellent nitrogen uptake matches your soil profile. Heat-tolerant variety perfect for current season. Good rotation crop after rice.`
    },
    {
      name: 'Okra',
      category: 'Pod Vegetable',
      icon: '🌱',
      growth: '50–65 days',
      spacing: '30cm apart',
      ph: '6.0–8.0',
      water: 'Low - Moderate',
      season: 'Hot/Dry Season',
      yield: '0.8–1.2 kg/plant',
      score: okraSuitability.score,
      desc: `${okraSuitability.desc} Low phosphorus requirement suits your soil. Drought-resistant backup for dry spells. Fast-growing summer crop.`
    }
  ].sort((a, b) => b.score - a.score);

  const steps = [
    'Deconstructing mineral indexes...',
    'Matching crop requirements against current N-P-K balances...',
    'Analyzing seasonal monsoon and wind metrics...',
    'Synthesizing crop rotation recommendations...'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#FAF8F5] via-[#FDFBF7] to-[#F1F6EC] text-zinc-800 p-4 sm:p-6 lg:p-8 font-sans antialiased">

      {/* 1. Header welcome banner (Revamped Green Gradient) */}
      <div className="w-full bg-gradient-to-r from-[#60993E] to-[#34701B] rounded-[28px] p-6 sm:p-8 shadow-[0_12px_30px_-8px_rgba(96,153,62,0.3)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white relative overflow-hidden">

        {/* Glow Spotlight Overlays */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-450/10 blur-2xl rounded-full -ml-16 -mb-16 pointer-events-none" />

        <div className="flex items-center space-x-4.5 relative z-10">
          <div className="w-14 h-14 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-inner scale-100 hover:scale-105 transition duration-200">
            <Leaf className="w-7 h-7 text-emerald-300 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight m-0 drop-shadow-xs">CropWise</h1>
            <p className="text-white/90 text-sm mt-1.5 font-medium flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-450 inline-block animate-ping" />
              Advisor Panel: <span className="font-bold text-emerald-200">{selectedFarmer ? selectedFarmer.name : 'Juan Carlos Santos'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Selector Area: Farmer switch & Language controls */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-6">

        {/* Farmer Dropdown Selector */}
        <div className="flex items-center space-x-2.5 bg-white/70 backdrop-blur-md border border-zinc-200 shadow-sm px-4 py-2 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Active Farmer:</span>
          <select
            value={selectedFarmerId}
            onChange={(e) => setSelectedFarmerId(e.target.value)}
            className="text-xs font-extrabold text-zinc-700 bg-transparent outline-none border-none cursor-pointer pr-2"
          >
            {farmers?.map(f => (
              <option key={f.id} value={f.id}>{f.name} (Brgy. {f.barangay})</option>
            ))}
          </select>
        </div>

        {/* English & History buttons */}
        <div className="flex bg-zinc-200/50 p-1 rounded-2xl self-end sm:self-auto gap-0.5 shadow-inner">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${language === 'en' ? 'bg-gradient-to-r from-[#60993E] to-[#4B7D2F] text-white shadow-md' : 'text-zinc-600 hover:text-zinc-800'
              }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('history')}
            className={`px-4.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${language === 'history' ? 'bg-gradient-to-r from-[#60993E] to-[#4B7D2F] text-white shadow-md' : 'text-zinc-600 hover:text-zinc-800'
              }`}
          >
            History
          </button>
        </div>
      </div>

      {/* 2. My Farms Section */}
      <div className="bg-white/80 backdrop-blur-md border border-zinc-200 shadow-sm rounded-[28px] p-6 sm:p-7 mt-6">
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-zinc-800 m-0">My Farms</h2>
            <p className="text-xs text-zinc-400 font-medium">Select a configured plot to refresh Soil Health and Weather readouts.</p>
          </div>
        </div>

        {plots.length === 0 ? (
          <div className="p-8 border border-dashed border-zinc-200 rounded-2xl text-center text-zinc-500 text-xs">
            <p className="font-semibold">No farm plots configured for this farmer.</p>
            <p className="text-[10px] text-zinc-400 mt-1">Please register plots in the Farmer Registry tab.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plots.map(plot => {
              const isSelected = plot.id === selectedPlotId;
              return (
                <div
                  key={plot.id}
                  onClick={() => setSelectedPlotId(plot.id)}
                  className={`p-5 rounded-2xl border-2 transition-all duration-350 cursor-pointer flex items-center justify-between group ${isSelected
                    ? 'border-[#60993E] bg-[#F1F6EC] shadow-md shadow-emerald-900/5'
                    : 'border-zinc-250/80 hover:border-zinc-350 bg-white hover:shadow-md'
                    }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl transition duration-200 ${isSelected ? 'bg-[#E3EED8]' : 'bg-zinc-100 group-hover:scale-105'
                      }`}>
                      🚜
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-zinc-800 group-hover:text-[#60993E] transition">{plot.plotName}</h4>
                      <p className="text-[10px] text-zinc-500 font-bold mt-0.5">
                        {plot.areaHectares} Hectares • {plot.crop} Cultivation
                      </p>
                      <p className="text-[9px] text-zinc-400 font-semibold flex items-center space-x-1 mt-1">
                        <MapPin className="w-2.5 h-2.5 shrink-0 text-zinc-350" />
                        <span>{plot.locationText || 'Mindanao, PH'}</span>
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#60993E] to-[#487B2E] flex items-center justify-center text-white shadow-xs">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Grid Content: Soil Health & Weather Forecast */}
      {selectedPlotId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

          {/* 3. Soil Health Section */}
          <div className="bg-white/80 backdrop-blur-md border border-zinc-200 shadow-sm rounded-[28px] p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-200/80 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-emerald-50 rounded-xl text-[#60993E]">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-zinc-800 m-0">Soil Health</h2>
                  <p className="text-xs text-zinc-400 font-medium">Diagnostic readings and organic content index.</p>
                </div>
              </div>
              {latestReport && (
                <button
                  type="button"
                  onClick={() => onViewReport(latestReport.id)}
                  className="flex items-center space-x-1.5 bg-[#FAF7F0] hover:bg-zinc-155 text-[#537E36] border border-zinc-200/80 font-bold text-[10px] px-3.5 py-2 rounded-xl transition cursor-pointer active:scale-95 shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-[#60993E]" />
                  <span>View Certificate</span>
                </button>
              )}
            </div>

            {!latestReading ? (
              <div className="p-8 border border-dashed border-zinc-200 rounded-2xl text-center space-y-4">
                <AlertCircle className="w-9 h-9 text-zinc-450 mx-auto animate-bounce" />
                <div>
                  <p className="text-xs font-bold text-zinc-650">No Soil Readings Recorded</p>
                  <p className="text-[10px] text-zinc-400 mt-1">This farm plot does not have any recorded soil diagnosis data yet.</p>
                </div>
                <button
                  type="button"
                  onClick={handleLoadDemoReading}
                  className="inline-flex items-center space-x-2 bg-[#60993E] hover:bg-[#528732] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer active:scale-95 shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Load Baseline Demo Data</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Nitrogen Indicator Well */}
                  <div className="bg-[#FAF9F5]/70 border border-zinc-100 rounded-2xl p-4 flex flex-col space-y-2 hover:border-[#60993E]/20 transition-all duration-300">
                    <div className="flex justify-between items-center text-xs font-extrabold text-zinc-700">
                      <span className="flex items-center">
                        <span className="w-5 h-5 rounded-md bg-[#60993E]/10 text-[#60993E] flex items-center justify-center font-extrabold mr-1.5 text-[10px]">N</span>
                        Nitrogen
                      </span>
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Good</span>
                    </div>
                    <div className="w-full bg-zinc-200/60 rounded-full h-2 pt-0.5">
                      <div className="bg-gradient-to-r from-emerald-450 to-[#60993E] h-1.5 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-400 font-bold">
                      <span>0</span>
                      <span className="text-[#60993E]">75%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Phosphorus Indicator Well */}
                  <div className="bg-[#FAF9F5]/70 border border-zinc-100 rounded-2xl p-4 flex flex-col space-y-2 hover:border-[#60993E]/20 transition-all duration-300">
                    <div className="flex justify-between items-center text-xs font-extrabold text-zinc-700">
                      <span className="flex items-center">
                        <span className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center font-extrabold mr-1.5 text-[10px]">P</span>
                        Phosphorus
                      </span>
                      <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Moderate</span>
                    </div>
                    <div className="w-full bg-zinc-200/60 rounded-full h-2 pt-0.5">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-400 font-bold">
                      <span>0</span>
                      <span className="text-amber-500">65%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Potassium Indicator Well */}
                  <div className="bg-[#FAF9F5]/70 border border-zinc-100 rounded-2xl p-4 flex flex-col space-y-2 hover:border-[#60993E]/20 transition-all duration-300">
                    <div className="flex justify-between items-center text-xs font-extrabold text-zinc-700">
                      <span className="flex items-center">
                        <span className="w-5 h-5 rounded-md bg-[#60993E]/10 text-[#60993E] flex items-center justify-center font-extrabold mr-1.5 text-[10px]">K</span>
                        Potassium
                      </span>
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Excellent</span>
                    </div>
                    <div className="w-full bg-zinc-200/60 rounded-full h-2 pt-0.5">
                      <div className="bg-gradient-to-r from-emerald-450 to-[#60993E] h-1.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-400 font-bold">
                      <span>0</span>
                      <span className="text-[#60993E]">85%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Salinity Indicator Well */}
                  <div className="bg-[#FAF9F5]/70 border border-zinc-100 rounded-2xl p-4 flex flex-col space-y-2 hover:border-[#60993E]/20 transition-all duration-300">
                    <div className="flex justify-between items-center text-xs font-extrabold text-zinc-700">
                      <span className="flex items-center">
                        <span className="w-5 h-5 rounded-md bg-blue-500/10 text-blue-500 flex items-center justify-center font-extrabold mr-1.5 text-[10px]">❖</span>
                        Salinity
                      </span>
                      <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Low</span>
                    </div>
                    <div className="w-full bg-zinc-200/60 rounded-full h-2 pt-0.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '14.1%' }}></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-400 font-bold">
                      <span>0</span>
                      <span className="text-blue-500">{latestReading.electricalConductivity || 1.2} dS/m</span>
                      <span>8.5 dS/m</span>
                    </div>
                  </div>

                  {/* Acidity Indicator Well */}
                  <div className="bg-[#FAF9F5]/70 border border-zinc-100 rounded-2xl p-4 flex flex-col space-y-2 hover:border-[#60993E]/20 transition-all duration-300">
                    <div className="flex justify-between items-center text-xs font-extrabold text-zinc-700">
                      <span className="flex items-center">
                        <span className="w-5 h-5 rounded-md bg-[#60993E]/10 text-[#60993E] flex items-center justify-center font-extrabold mr-1.5 text-[10px]">🧪</span>
                        Acidity
                      </span>
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Optimal</span>
                    </div>
                    <div className="w-full bg-zinc-200/60 rounded-full h-2 pt-0.5">
                      <div className="bg-gradient-to-r from-emerald-450 to-[#60993E] h-1.5 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-400 font-bold">
                      <span>0</span>
                      <span className="text-[#60993E] font-bold">{latestReading.ph} pH</span>
                      <span>10 pH</span>
                    </div>
                  </div>

                  {/* Moisture Indicator Well */}
                  <div className="bg-[#FAF9F5]/70 border border-zinc-100 rounded-2xl p-4 flex flex-col space-y-2 hover:border-[#60993E]/20 transition-all duration-300">
                    <div className="flex justify-between items-center text-xs font-extrabold text-zinc-700">
                      <span className="flex items-center">
                        <span className="w-5 h-5 rounded-md bg-[#60993E]/10 text-[#60993E] flex items-center justify-center font-extrabold mr-1.5 text-[10px]">💧</span>
                        Moisture
                      </span>
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Good</span>
                    </div>
                    <div className="w-full bg-zinc-200/60 rounded-full h-2 pt-0.5">
                      <div className="bg-gradient-to-r from-emerald-450 to-[#60993E] h-1.5 rounded-full" style={{ width: `${latestReading.moisture || 80}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-400 font-bold">
                      <span>0</span>
                      <span className="text-[#60993E] font-bold">{latestReading.moisture || 80}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Organic Matter Indicator Well */}
                  <div className="bg-[#FAF9F5]/70 border border-zinc-100 rounded-2xl p-4 flex flex-col space-y-2 hover:border-[#60993E]/20 transition-all duration-300">
                    <div className="flex justify-between items-center text-xs font-extrabold text-zinc-700">
                      <span className="flex items-center">
                        <span className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center font-extrabold mr-1.5 text-[10px]">🍂</span>
                        Organic Matter
                      </span>
                      <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Low</span>
                    </div>
                    <div className="w-full bg-zinc-200/60 rounded-full h-2 pt-0.5">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${(latestReading.organicMatter || 2.2) * 10}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-zinc-400 font-bold">
                      <span>0</span>
                      <span className="text-amber-500 font-bold">{latestReading.organicMatter || 2.2}%</span>
                      <span>10%</span>
                    </div>
                  </div>

                </div>

                {/* Soil summary text block */}
                <div className="bg-gradient-to-tr from-[#F8FAF6] to-[#FAFBF8] border border-[#E9F3E2] p-5 rounded-2xl text-[11px] leading-relaxed text-zinc-650 flex items-start space-x-3.5 mt-4">
                  <div className="p-2 bg-[#E2F0D7] text-[#537E36] rounded-xl shrink-0 shadow-inner">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-[#4F7A32] block uppercase tracking-wider text-[9px] mb-1">Agronomic Summary</span>
                    <p>{getSoilSummary(latestReading)}</p>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* 4. Weather Forecast Section */}
          <div className="bg-white/80 backdrop-blur-md border border-zinc-200 shadow-sm rounded-[28px] p-6 sm:p-7 space-y-6">
            <div className="flex items-center space-x-3 border-b border-zinc-200/80 pb-4">
              <div className="p-2.5 bg-amber-50 rounded-xl text-amber-500">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-zinc-800 m-0">Weather Forecast</h2>
                <p className="text-xs text-zinc-400 font-medium">Wet Season (Southwest Monsoon) • August 27, 2025</p>
              </div>
            </div>

            {/* Current day detailed forecast block */}
            <div className="bg-gradient-to-tr from-[#FAF9F6] to-[#F3F6EF] border border-zinc-200/80 p-5.5 rounded-2xl text-center space-y-4 relative overflow-hidden shadow-inner">
              <div className="flex justify-center items-center gap-4">
                <div className="w-14 h-14 bg-white/70 shadow-xs border border-zinc-200/40 rounded-2xl flex items-center justify-center scale-100 hover:scale-105 transition duration-200">
                  <CloudSun className="w-9 h-9 text-amber-500 animate-pulse" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-extrabold text-zinc-800 tracking-tight leading-none flex items-center gap-2">
                    <span>☀️ 32°C</span>
                    <span className="text-zinc-400 font-semibold text-xs shrink-0">Day</span>
                    <span className="text-zinc-350">/</span>
                    <span className="text-zinc-650">🌙 24°C</span>
                    <span className="text-zinc-400 font-semibold text-xs shrink-0">Night</span>
                  </h3>
                  <p className="text-xs text-zinc-500 font-bold mt-1">Partly Cloudy Conditions</p>
                </div>
              </div>

              {/* Grid detail metrics */}
              <div className="grid grid-cols-3 gap-2.5 border-t border-zinc-200/60 pt-3.5 mt-3.5 text-center">
                <div className="space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center mx-auto shadow-inner">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">Humidity</span>
                  <span className="text-xs font-extrabold text-zinc-700">68%</span>
                </div>

                <div className="space-y-1 border-x border-zinc-200/60">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">Precipitation</span>
                  <span className="text-xs font-extrabold text-zinc-700">0 mm</span>
                </div>

                <div className="space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-500 flex items-center justify-center mx-auto shadow-inner">
                    <Wind className="w-4 h-4" />
                  </div>
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">Wind Speed</span>
                  <span className="text-xs font-extrabold text-zinc-700">12 km/h SW</span>
                </div>
              </div>
            </div>

            {/* 4-Day Daily Forecast Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-white/70 border border-zinc-150 p-3.5 rounded-2xl text-center space-y-2 hover:-translate-y-0.5 hover:shadow-xs transition duration-200">
                <span className="text-[10px] text-zinc-400 font-extrabold block">Tuesday</span>
                <Sun className="w-5 h-5 text-amber-500 mx-auto" />
                <span className="text-xs font-extrabold text-zinc-750 block mt-1">33° / 25°</span>
                <span className="text-[8px] text-zinc-400 font-bold block uppercase tracking-wider">Sunny</span>
              </div>

              <div className="bg-white/70 border border-zinc-150 p-3.5 rounded-2xl text-center space-y-2 hover:-translate-y-0.5 hover:shadow-xs transition duration-200">
                <span className="text-[10px] text-zinc-400 font-extrabold block">Wednesday</span>
                <CloudRain className="w-5 h-5 text-sky-450 mx-auto animate-pulse" />
                <span className="text-xs font-extrabold text-zinc-750 block mt-1">30° / 23°</span>
                <span className="text-[8px] text-zinc-400 font-bold block uppercase tracking-wider">Showers</span>
              </div>

              <div className="bg-white/70 border border-zinc-150 p-3.5 rounded-2xl text-center space-y-2 hover:-translate-y-0.5 hover:shadow-xs transition duration-200">
                <span className="text-[10px] text-zinc-400 font-extrabold block">Thursday</span>
                <CloudSun className="w-5 h-5 text-zinc-400 mx-auto" />
                <span className="text-xs font-extrabold text-zinc-750 block mt-1">29° / 24°</span>
                <span className="text-[8px] text-zinc-400 font-bold block uppercase tracking-wider">Cloudy</span>
              </div>

              <div className="bg-white/70 border border-zinc-150 p-3.5 rounded-2xl text-center space-y-2 hover:-translate-y-0.5 hover:shadow-xs transition duration-200">
                <span className="text-[10px] text-zinc-400 font-extrabold block">Friday</span>
                <CloudRain className="w-5 h-5 text-emerald-500 mx-auto animate-bounce" />
                <span className="text-xs font-extrabold text-zinc-750 block mt-1">28° / 22°</span>
                <span className="text-[8px] text-zinc-400 font-bold block uppercase tracking-wider">Heavy Rain</span>
              </div>
            </div>

            {/* Weather agricultural alert summary */}
            <div className="bg-gradient-to-tr from-[#F8FAF6] to-[#FAFBF8] border border-[#E9F3E2] p-5 rounded-2xl text-[11px] leading-relaxed text-zinc-650 flex items-start space-x-3.5">
              <div className="p-2 bg-[#E2F0D7] text-[#537E36] rounded-xl shrink-0 shadow-inner">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-[#4F7A32] block uppercase tracking-wider text-[9px] mb-1">Weather Outlook</span>
                <p>Southwest monsoon pattern typical for August. High humidity Thursday may require disease monitoring. Overall weather supports current season crop establishment.</p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 5. Generate AI Plan Button & Action */}
      {selectedPlotId && latestReading && (
        <div className="flex flex-col items-center justify-center mt-8">
          <button
            onClick={handleGeneratePlan}
            disabled={isGeneratingPlan}
            className="flex items-center space-x-3 bg-gradient-to-r from-[#60993E] to-[#45792B] hover:shadow-[0_8px_20px_-6px_rgba(96,153,62,0.4)] disabled:bg-zinc-350 text-white font-extrabold text-xs px-10 py-4.5 rounded-2xl transition-all shadow-md active:scale-95 duration-150 cursor-pointer w-full sm:w-auto text-center justify-center uppercase tracking-widest relative overflow-hidden"
          >
            {isGeneratingPlan ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Generating plan ({generationStep + 1}/4)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-250 animate-pulse" />
                <span>Generate Crop Advisor Plan</span>
              </>
            )}
          </button>

          {/* AI Loader Text steps */}
          {isGeneratingPlan && (
            <div className="mt-5 p-4.5 bg-white border border-zinc-200/80 rounded-2xl w-full max-w-sm flex items-center justify-center space-x-3.5 shadow-sm animate-pulse">
              <TrendingUp className="w-5 h-5 text-[#60993E] shrink-0" />
              <span className="text-xs text-zinc-700 font-extrabold font-mono">{steps[generationStep]}</span>
            </div>
          )}
        </div>
      )}

      {/* 6. Recommended Crops Section */}
      {showRecommendedCrops && (
        <div className="bg-white/80 backdrop-blur-md border border-zinc-200 shadow-sm rounded-[28px] p-6 sm:p-7 mt-8 space-y-6 animate-fadeIn">

          <div className="flex items-center space-x-3 border-b border-zinc-200/80 pb-4">
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
              <Sparkles className="w-5 h-5 text-[#60993E]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-zinc-800 m-0">Recommended Crops</h2>
              <p className="text-xs text-zinc-400 font-medium">Select your starting crop and we'll plan your crop rotation.</p>
            </div>
          </div>

          <div className="space-y-5">
            {recommendedCrops.map((crop, idx) => {
              // Custom colors based on compatibility match score
              const isHigh = crop.score >= 80;
              const isMod = crop.score >= 60 && crop.score < 80;
              const accentColor = isHigh ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : isMod ? 'text-amber-600 border-amber-200 bg-amber-50' : 'text-rose-600 border-rose-200 bg-rose-50';
              const progressColor = isHigh ? 'stroke-emerald-500' : isMod ? 'stroke-amber-500' : 'stroke-rose-500';

              // SVG Circle properties
              const radius = 22;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset = circumference - (crop.score / 100) * circumference;

              return (
                <div
                  key={idx}
                  className="bg-[#FAF9F5]/70 border border-zinc-150 hover:border-zinc-350 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-all duration-300 relative overflow-hidden"
                >

                  {/* Glowing match indicators for high compatibility */}
                  {isHigh && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-450/5 blur-xl rounded-full pointer-events-none" />
                  )}

                  {/* SVG Compatibility Matching Dial (Visual Wow Factor!) */}
                  <div className="flex items-center justify-center shrink-0 self-center md:self-auto relative w-16 h-16">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        className="stroke-zinc-100 fill-none"
                        strokeWidth="3.5"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        className={`fill-none transition-all duration-1000 ${progressColor}`}
                        strokeWidth="3.5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                      <span className="text-[11px] font-extrabold text-zinc-800">{crop.score}%</span>
                      <span className="text-[6px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Match</span>
                    </div>
                  </div>

                  {/* Crop details grid */}
                  <div className="flex-1 space-y-3.5 w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-2xl shadow-xs scale-100 hover:scale-105 transition">
                          {crop.icon}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-zinc-800 leading-none">{crop.name}</h4>
                          <span className="text-[9px] font-bold text-[#60993E] tracking-wider uppercase mt-1.5 inline-block">
                            {crop.category}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[9px] font-extrabold px-3 py-1 rounded-full tracking-wider uppercase border ${accentColor}`}>
                        {crop.category}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-650 leading-relaxed font-medium">{crop.desc}</p>

                    {/* Metadata Badges Panel */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2 text-[10px]">
                      <div className="bg-white border border-zinc-150 rounded-xl p-2 text-center space-y-1 hover:border-[#60993E]/20 transition">
                        <span className="text-zinc-400 font-bold uppercase tracking-wider text-[7px] block">Growth Period</span>
                        <span className="text-zinc-700 font-extrabold">{crop.growth}</span>
                      </div>
                      <div className="bg-white border border-zinc-150 rounded-xl p-2 text-center space-y-1 hover:border-[#60993E]/20 transition">
                        <span className="text-zinc-400 font-bold uppercase tracking-wider text-[7px] block">Water Intake</span>
                        <span className="text-zinc-700 font-extrabold">{crop.water}</span>
                      </div>
                      <div className="bg-white border border-zinc-150 rounded-xl p-2 text-center space-y-1 hover:border-[#60993E]/20 transition">
                        <span className="text-zinc-400 font-bold uppercase tracking-wider text-[7px] block">Sowing Spacing</span>
                        <span className="text-zinc-700 font-extrabold">{crop.spacing}</span>
                      </div>
                      <div className="bg-white border border-zinc-150 rounded-xl p-2 text-center space-y-1 hover:border-[#60993E]/20 transition">
                        <span className="text-zinc-400 font-bold uppercase tracking-wider text-[7px] block">Growth Season</span>
                        <span className="text-zinc-700 font-extrabold">{crop.season}</span>
                      </div>
                      <div className="bg-white border border-zinc-150 rounded-xl p-2 text-center space-y-1 hover:border-[#60993E]/20 transition">
                        <span className="text-zinc-400 font-bold uppercase tracking-wider text-[7px] block">Target pH</span>
                        <span className="text-[#60993E] font-extrabold">{crop.ph}</span>
                      </div>
                      <div className="bg-white border border-zinc-150 rounded-xl p-2 text-center space-y-1 hover:border-[#60993E]/20 transition">
                        <span className="text-zinc-400 font-bold uppercase tracking-wider text-[7px] block">Est. Yield</span>
                        <span className="text-zinc-700 font-extrabold">{crop.yield}</span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          <div className="flex items-start space-x-2.5 text-[10px] text-zinc-500 bg-[#FAF9F5] p-3.5 border border-zinc-150 rounded-2xl leading-relaxed">
            <Flame className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
            <span>AI recommendation engine matches soil chemistry logs directly against agronomic constraints to optimize regional planting productivity.</span>
          </div>

        </div>
      )}

    </div>
  );
};
