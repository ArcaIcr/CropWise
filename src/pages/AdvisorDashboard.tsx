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
  FileText
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
 * Implements a light-cream agricultural theme mockup dashboard with Soil Health gauges,
 * localized weather forecasts, and dynamic AI-generated recommended crops.
 */
export const AdvisorDashboard: React.FC<IAdvisorDashboardProps> = ({ 
  selectedFarmerId,
  setSelectedFarmerId,
  selectedPlotId,
  setSelectedPlotId,
  onViewReport,
  onLogout 
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
      // Keep previous plot selection if possible, otherwise default to first
      const hasPreviousPlot = plots.some(p => p.id === selectedPlotId);
      if (!hasPreviousPlot) {
        setSelectedPlotId(plots[0].id);
      }
    } else {
      setSelectedPlotId('');
    }
    setShowRecommendedCrops(false);
  }, [selectedFarmerId, plots, selectedPlotId]);

  // Simulate AI Plan generation loading states
  const handleGeneratePlan = () => {
    setIsGeneratingPlan(true);
    setGenerationStep(0);
    setShowRecommendedCrops(false);
  };

  useEffect(() => {
    if (!isGeneratingPlan) return;

    const steps = [
      'Reading soil diagnostic indices...',
      'Cross-referencing regional rainfall & monsoon forecasts...',
      'Synthesizing multi-crop yield parameters...',
      'Compiling optimal crop rotation roadmap...'
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
    }, 700);

    return () => clearInterval(interval);
  }, [isGeneratingPlan]);

  // Generate customized warnings or summary based on selected plot readings
  const getSoilSummary = (reading: ISoilReading) => {
    const alerts: string[] = [];
    if (reading.ph < 5.5) {
      alerts.push('Soil is acidic, which reduces root nutrient absorption efficiency.');
    }
    if (reading.electricalConductivity && reading.electricalConductivity > 2.0) {
      alerts.push('High salinity detected. Limit sensitive crops like onions.');
    } else {
      alerts.push('Low salinity is ideal for most vegetable crops.');
    }
    if (reading.moisture && reading.moisture > 70) {
      alerts.push('Good moisture retention suitable for current season planting.');
    }
    if (reading.organicMatter && reading.organicMatter < 3.0) {
      alerts.push('Consider adding compost or organic fertilizers to improve soil structure.');
    }
    return alerts.join(' ');
  };

  const getCropSuitability = (cropName: string, reading: ISoilReading | null) => {
    if (!reading) return { score: 100, desc: 'Ideal default values assume rich organic soil structures.' };
    
    let matchScore = 0;
    const descParts: string[] = [];
    const ph = reading.ph;
    const N = reading.nitrogen;
    const P = reading.phosphorus;
    const K = reading.potassium;

    if (cropName === 'Tomato') {
      if (ph >= 6.0 && ph <= 7.0) {
        matchScore += 25;
        descParts.push(`Soil pH (${ph}) is optimal.`);
      } else if (ph >= 5.5 && ph < 6.0) {
        matchScore += 15;
        descParts.push(`Soil pH (${ph}) is slightly acidic; liming might be required.`);
      } else {
        matchScore += 5;
        descParts.push(`Soil pH (${ph}) is too acidic; pre-treatment is highly recommended.`);
      }

      if (N >= 30 && N <= 60) {
        matchScore += 25;
        descParts.push('Nitrogen is optimal.');
      } else if (N < 30) {
        matchScore += 10;
        descParts.push(`Low Nitrogen (${N} ppm); supplementary urea basal/sidedress recommended.`);
      } else {
        matchScore += 20;
        descParts.push('Nitrogen is high; watch out for excessive vine growth.');
      }

      if (P >= 10 && P <= 20) {
        matchScore += 25;
        descParts.push('Phosphorus is optimal.');
      } else if (P < 10) {
        matchScore += 10;
        descParts.push(`Low Phosphorus (${P} ppm); supplement with Solophos.`);
      } else {
        matchScore += 25;
        descParts.push('Phosphorus level is ideal.');
      }

      if (K >= 70 && K <= 110) {
        matchScore += 25;
        descParts.push('Potassium is excellent for fruit yield.');
      } else if (K < 70) {
        matchScore += 10;
        descParts.push(`Low Potassium (${K} ppm); Muriate of Potash is required.`);
      } else {
        matchScore += 25;
        descParts.push('Strong Potassium level supports healthy tomatoes.');
      }
    } else if (cropName === 'Eggplant') {
      if (ph >= 5.5 && ph <= 7.5) {
        matchScore += 25;
        descParts.push(`Soil pH (${ph}) is optimal.`);
      } else {
        matchScore += 10;
        descParts.push(`Soil pH (${ph}) is outside ideal bounds.`);
      }

      if (N >= 20 && N <= 50) {
        matchScore += 25;
        descParts.push('Nitrogen is optimal.');
      } else if (N < 20) {
        matchScore += 10;
        descParts.push(`Nitrogen (${N} ppm) is deficient.`);
      } else {
        matchScore += 20;
        descParts.push('High Nitrogen is well tolerated.');
      }

      if (P >= 8 && P <= 18) {
        matchScore += 25;
        descParts.push('Phosphorus is good.');
      } else if (P < 8) {
        matchScore += 10;
        descParts.push(`Low Phosphorus (${P} ppm).`);
      } else {
        matchScore += 25;
        descParts.push('Phosphorus level is ideal.');
      }

      if (K >= 60 && K <= 100) {
        matchScore += 25;
        descParts.push('Potassium is good for stalk strength.');
      } else if (K < 60) {
        matchScore += 10;
        descParts.push(`Low Potassium (${K} ppm).`);
      } else {
        matchScore += 25;
        descParts.push('Strong Potassium level.');
      }
    } else if (cropName === 'Okra') {
      if (ph >= 6.0 && ph <= 8.0) {
        matchScore += 25;
        descParts.push(`Soil pH (${ph}) is optimal.`);
      } else if (ph >= 5.0 && ph < 6.0) {
        matchScore += 20;
        descParts.push(`Okra tolerates this mild acidity (${ph} pH).`);
      } else {
        matchScore += 10;
        descParts.push(`Acidity check required.`);
      }

      if (N >= 15 && N <= 40) {
        matchScore += 25;
        descParts.push('Nitrogen is optimal.');
      } else if (N < 15) {
        matchScore += 15;
        descParts.push(`Low Nitrogen (${N} ppm) is tolerated by Okra.`);
      } else {
        matchScore += 25;
        descParts.push('High Nitrogen level.');
      }

      if (P >= 5 && P <= 15) {
        matchScore += 25;
        descParts.push('Phosphorus is optimal.');
      } else if (P < 5) {
        matchScore += 15;
        descParts.push(`Low Phosphorus (${P} ppm) is tolerated well.`);
      } else {
        matchScore += 25;
        descParts.push('Ideal Phosphorus.');
      }

      if (K >= 50 && K <= 90) {
        matchScore += 25;
        descParts.push('Potassium is optimal.');
      } else if (K < 50) {
        matchScore += 15;
        descParts.push(`Potassium is slightly low.`);
      } else {
        matchScore += 25;
        descParts.push('Good Potassium level.');
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

  const steps = [
    'Reading soil diagnostic indices...',
    'Cross-referencing regional rainfall & monsoon forecasts...',
    'Synthesizing multi-crop yield parameters...',
    'Compiling optimal crop rotation roadmap...'
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-zinc-800 p-4 sm:p-6 font-sans antialiased">
      
      {/* 1. Header welcome banner (Green theme) */}
      <div className="w-full bg-[#7BB058] rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <span className="text-white text-2xl font-bold">🌱</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight m-0">CropWise</h1>
            <p className="text-white/80 text-xs sm:text-sm mt-0.5 font-medium">
              Welcome, {selectedFarmer ? selectedFarmer.name : 'Juan Carlos Santos'}
            </p>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/25 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Selector Area: Farmer switch & Language controls */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-5">
        
        {/* Farmer Dropdown Selector */}
        <div className="flex items-center space-x-2.5 bg-white border border-zinc-200 shadow-xs px-3.5 py-1.5 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Farmer:</span>
          <select 
            value={selectedFarmerId}
            onChange={(e) => setSelectedFarmerId(e.target.value)}
            className="text-xs font-bold text-zinc-700 bg-transparent outline-none border-none cursor-pointer pr-1"
          >
            {farmers?.map(f => (
              <option key={f.id} value={f.id}>{f.name} (Brgy. {f.barangay})</option>
            ))}
          </select>
        </div>

        {/* English & History buttons */}
        <div className="flex bg-zinc-200/50 p-1 rounded-2xl self-end sm:self-auto gap-0.5">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              language === 'en' ? 'bg-[#7BB058] text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-800'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('history')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              language === 'history' ? 'bg-[#7BB058] text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-800'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* 2. My Farms Section */}
      <div className="bg-white border border-zinc-200 shadow-sm rounded-3xl p-5 sm:p-6 mt-6">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xl">📍</span>
          <div>
            <h2 className="text-sm font-extrabold text-zinc-800 m-0">My Farms</h2>
            <p className="text-[11px] text-zinc-400 font-medium">Select your farm and we'll show you details.</p>
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
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected 
                      ? 'border-[#7BB058] bg-[#F1F7EC] shadow-xs' 
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <span className="text-2xl">🚜</span>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800">{plot.plotName}</h4>
                      <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                        {plot.areaHectares} hectares • {plot.crop} soil
                      </p>
                      <p className="text-[9px] text-zinc-400 font-semibold flex items-center space-x-1 mt-1">
                        <MapPin className="w-2.5 h-2.5 shrink-0 text-zinc-350" />
                        <span className="truncate">{plot.locationText || 'Mindanao, PH'}</span>
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#7BB058] flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5" />
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
          <div className="bg-white border border-zinc-200 shadow-sm rounded-3xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">📈</span>
                <div>
                  <h2 className="text-sm font-extrabold text-zinc-800 m-0">Soil Health</h2>
                  <p className="text-[11px] text-zinc-400 font-medium">Diagnostic readings and organic content index.</p>
                </div>
              </div>
              {latestReport && (
                <button
                  type="button"
                  onClick={() => onViewReport(latestReport.id)}
                  className="flex items-center space-x-1.5 bg-[#FAF7F0] hover:bg-zinc-100 text-[#537E36] border border-zinc-200 font-bold text-[10px] px-3 py-1.5 rounded-xl transition cursor-pointer active:scale-95 shadow-xs"
                >
                  <FileText className="w-3 h-3 text-[#7BB058]" />
                  <span>View Certificate</span>
                </button>
              )}
            </div>

            {!latestReading ? (
              <div className="p-8 border border-dashed border-zinc-200 rounded-2xl text-center space-y-4">
                <AlertCircle className="w-8 h-8 text-zinc-450 mx-auto" />
                <div>
                  <p className="text-xs font-bold text-zinc-600">No Soil Readings Recorded</p>
                  <p className="text-[10px] text-zinc-400 mt-1">This farm plot does not have any recorded soil diagnosis data yet.</p>
                </div>
                <button
                  type="button"
                  onClick={handleLoadDemoReading}
                  className="inline-flex items-center space-x-1.5 bg-[#7BB058] hover:bg-[#6FA04E] text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Load Baseline Demo Data</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Nitrogen Progress Card */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-zinc-700">
                    <span className="flex items-center">
                      <span className="text-emerald-500 font-extrabold mr-1">N</span> Nitrogen
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-md font-extrabold">Good</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-3">
                    <div className="bg-[#7BB058] h-3 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-400 font-bold">
                    <span>0</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Phosphorus Progress Card */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-zinc-700">
                    <span className="flex items-center">
                      <span className="text-amber-500 font-extrabold mr-1">P</span> Phosphorus
                    </span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md font-extrabold">Moderate</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-3">
                    <div className="bg-amber-500 h-3 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-400 font-bold">
                    <span>0</span>
                    <span>65%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Potassium Progress Card */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-zinc-700">
                    <span className="flex items-center">
                      <span className="text-emerald-500 font-extrabold mr-1">K</span> Potassium
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-md font-extrabold">Excellent</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-3">
                    <div className="bg-[#7BB058] h-3 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-400 font-bold">
                    <span>0</span>
                    <span>85%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Salinity Progress Card */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-zinc-700">
                    <span className="flex items-center">
                      <span className="text-blue-500 font-extrabold mr-1">❖</span> Salinity
                    </span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-md font-extrabold">Low</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: '14.1%' }}></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-400 font-bold">
                    <span>0</span>
                    <span>{latestReading.electricalConductivity || 1.2} dS/m</span>
                    <span>8.5 dS/m</span>
                  </div>
                </div>

                {/* Acidity Progress Card */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-zinc-700">
                    <span className="flex items-center">
                      <span className="text-emerald-500 font-extrabold mr-1">🧪</span> Acidity
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-md font-extrabold">Optimal</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-3">
                    <div className="bg-[#7BB058] h-3 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-400 font-bold">
                    <span>0</span>
                    <span>{latestReading.ph} pH</span>
                    <span>10 pH</span>
                  </div>
                </div>

                {/* Moisture Progress Card */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-zinc-700">
                    <span className="flex items-center">
                      <span className="text-emerald-500 font-extrabold mr-1">💧</span> Moisture
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-md font-extrabold">Good</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-3">
                    <div className="bg-[#7BB058] h-3 rounded-full" style={{ width: `${latestReading.moisture || 80}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-400 font-bold">
                    <span>0</span>
                    <span>{latestReading.moisture || 80}%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Organic Matter Progress Card */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-zinc-700">
                    <span className="flex items-center">
                      <span className="text-amber-500 font-extrabold mr-1">🍂</span> Organic Matter
                    </span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md font-extrabold">Low</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-3">
                    <div className="bg-amber-500 h-3 rounded-full" style={{ width: `${(latestReading.organicMatter || 2.2) * 10}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-400 font-bold">
                    <span>0</span>
                    <span>{latestReading.organicMatter || 2.2}%</span>
                    <span>10%</span>
                  </div>
                </div>

                {/* Soil summary text block */}
                <div className="bg-[#F8FAF6] border border-[#E9F3E2] p-4.5 rounded-2xl text-[11px] leading-relaxed text-zinc-600 flex items-start space-x-2.5">
                  <div className="p-1.5 bg-[#E2F0D7] text-[#639242] rounded-xl shrink-0">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-[#537E36] block uppercase tracking-wider text-[9px] mb-1">Summary</span>
                    <p>{getSoilSummary(latestReading)}</p>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* 4. Weather Forecast Section */}
          <div className="bg-white border border-zinc-200 shadow-sm rounded-3xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center space-x-2 border-b border-zinc-150 pb-3">
              <span className="text-xl">🌤️</span>
              <div>
                <h2 className="text-sm font-extrabold text-zinc-800 m-0">Weather Forecast</h2>
                <p className="text-[11px] text-zinc-400 font-medium">Today is August 27, 2025 – Wet Season (Southwest Monsoon)</p>
              </div>
            </div>

            {/* Current day detailed forecast block */}
            <div className="bg-[#FAF7F0] border border-zinc-150 p-5 rounded-2xl text-center space-y-3 relative overflow-hidden">
              <div className="flex justify-center items-center gap-3">
                <CloudSun className="w-12 h-12 text-amber-500 shrink-0" />
                <div>
                  <h3 className="text-base font-extrabold text-zinc-800 tracking-tight leading-none">
                    ☀️ 32°C <span className="text-zinc-450 font-normal text-xs">Day</span> / 🌙 24°C <span className="text-zinc-450 font-normal text-xs">Night</span>
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-semibold mt-1">Partly Cloudy</p>
                </div>
              </div>

              {/* Grid detail metrics */}
              <div className="grid grid-cols-3 gap-2 border-t border-zinc-200/60 pt-3 mt-3 text-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1 text-sky-500">
                    <Droplet className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-bold text-zinc-450 uppercase tracking-wider block">Humidity</span>
                  <span className="text-xs font-bold text-zinc-700">68%</span>
                </div>
                
                <div className="space-y-1 border-x border-zinc-200/60">
                  <div className="flex items-center justify-center space-x-1 text-[#7BB058]">
                    <CloudRain className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-bold text-zinc-450 uppercase tracking-wider block">Precipitation</span>
                  <span className="text-xs font-bold text-zinc-700">0 mm</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1 text-zinc-450">
                    <Wind className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-bold text-zinc-450 uppercase tracking-wider block">Wind Speed</span>
                  <span className="text-xs font-bold text-zinc-700">12 km/h SW</span>
                </div>
              </div>
            </div>

            {/* 4-Day Daily Forecast Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#FAF8F5] border border-zinc-150 p-3 rounded-2xl text-center space-y-1.5">
                <span className="text-[10px] text-zinc-450 font-bold block">Tuesday</span>
                <Sun className="w-5 h-5 text-amber-500 mx-auto" />
                <span className="text-xs font-bold text-zinc-700 block">33°C / 25°C</span>
                <span className="text-[9px] text-zinc-400 font-semibold block">Sunny</span>
              </div>

              <div className="bg-[#FAF8F5] border border-zinc-150 p-3 rounded-2xl text-center space-y-1.5">
                <span className="text-[10px] text-zinc-450 font-bold block">Wednesday</span>
                <CloudRain className="w-5 h-5 text-sky-450 mx-auto" />
                <span className="text-xs font-bold text-zinc-700 block">30°C / 23°C</span>
                <span className="text-[9px] text-zinc-400 font-semibold block">Showers</span>
              </div>

              <div className="bg-[#FAF8F5] border border-zinc-150 p-3 rounded-2xl text-center space-y-1.5">
                <span className="text-[10px] text-zinc-450 font-bold block">Thursday</span>
                <CloudSun className="w-5 h-5 text-zinc-400 mx-auto" />
                <span className="text-xs font-bold text-zinc-700 block">29°C / 24°C</span>
                <span className="text-[9px] text-zinc-400 font-semibold block">Cloudy</span>
              </div>

              <div className="bg-[#FAF8F5] border border-zinc-150 p-3 rounded-2xl text-center space-y-1.5">
                <span className="text-[10px] text-zinc-450 font-bold block">Friday</span>
                <CloudRain className="w-5 h-5 text-[#7BB058] mx-auto animate-pulse" />
                <span className="text-xs font-bold text-zinc-700 block">28°C / 22°C</span>
                <span className="text-[9px] text-zinc-400 font-semibold block">Heavy Rain</span>
              </div>
            </div>

            {/* Weather agricultural alert summary */}
            <div className="bg-[#F8FAF6] border border-[#E9F3E2] p-4.5 rounded-2xl text-[11px] leading-relaxed text-zinc-600 flex items-start space-x-2.5">
              <div className="p-1.5 bg-[#E2F0D7] text-[#639242] rounded-xl shrink-0">
                <Info className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-extrabold text-[#537E36] block uppercase tracking-wider text-[9px] mb-1">Summary</span>
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
            className="flex items-center space-x-2.5 bg-[#7BB058] hover:bg-[#6FA04E] disabled:bg-zinc-350 text-white font-bold text-xs px-8 py-3.5 rounded-2xl transition shadow-md active:scale-95 duration-150 cursor-pointer w-full sm:w-auto text-center justify-center uppercase tracking-wider"
          >
            {isGeneratingPlan ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>AI processing ({generationStep + 1}/4)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Generate AI Plan</span>
              </>
            )}
          </button>

          {/* AI Loader Text steps */}
          {isGeneratingPlan && (
            <div className="mt-4 p-4 bg-white/70 border border-zinc-200 rounded-2xl w-full max-w-sm flex items-center justify-center space-x-3 shadow-xs animate-pulse">
              <TrendingUp className="w-5 h-5 text-[#7BB058] shrink-0" />
              <span className="text-xs text-zinc-650 font-bold font-mono">{steps[generationStep]}</span>
            </div>
          )}
        </div>
      )}

      {/* 6. Recommended Crops Section */}
      {showRecommendedCrops && (
        <div className="bg-white border border-zinc-200 shadow-sm rounded-3xl p-5 sm:p-6 mt-8 space-y-6 animate-fadeIn">
          
          <div className="flex items-center space-x-2 border-b border-zinc-150 pb-3">
            <span className="text-xl">🥗</span>
            <div>
              <h2 className="text-sm font-extrabold text-zinc-800 m-0">Recommended Crops</h2>
              <p className="text-[11px] text-zinc-400 font-medium">Select your starting crop and we'll plan your crop rotation.</p>
            </div>
          </div>

          <div className="space-y-4">
            {recommendedCrops.map((crop, idx) => (
              <div 
                key={idx} 
                className="bg-[#FAF8F5] border border-zinc-150 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-zinc-350 transition-all shadow-xs relative overflow-hidden"
              >
                
                {/* Crop details grid */}
                <div className="flex-1 space-y-3.5 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-center text-xl">
                        {crop.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-zinc-800 leading-none">{crop.name}</h4>
                        <span className="text-[9px] font-bold text-[#537E36] tracking-wider uppercase mt-1 inline-block">
                          {crop.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg tracking-wider ${
                        crop.score >= 80 
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : crop.score >= 60
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-rose-100 text-rose-700 border border-rose-200'
                      }`}>
                        {crop.score}% Match
                      </span>
                      <span className="text-[9px] font-extrabold px-2.5 py-1 bg-zinc-950 text-white rounded-lg tracking-wider uppercase">
                        {crop.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-650 leading-relaxed font-medium">{crop.desc}</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 pt-1">
                    <div className="flex items-center text-[10px] text-zinc-600 font-medium">
                      <span className="text-zinc-400 w-16 uppercase tracking-wider text-[8px] font-bold">Growth:</span>
                      <span className="text-zinc-700 font-bold">{crop.growth}</span>
                    </div>
                    <div className="flex items-center text-[10px] text-zinc-600 font-medium">
                      <span className="text-zinc-400 w-16 uppercase tracking-wider text-[8px] font-bold">Water:</span>
                      <span className="text-zinc-700 font-bold">{crop.water}</span>
                    </div>
                    <div className="flex items-center text-[10px] text-zinc-600 font-medium">
                      <span className="text-zinc-400 w-16 uppercase tracking-wider text-[8px] font-bold">Spacing:</span>
                      <span className="text-zinc-700 font-bold">{crop.spacing}</span>
                    </div>
                    <div className="flex items-center text-[10px] text-zinc-600 font-medium">
                      <span className="text-zinc-400 w-16 uppercase tracking-wider text-[8px] font-bold">Season:</span>
                      <span className="text-zinc-700 font-bold">{crop.season}</span>
                    </div>
                    <div className="flex items-center text-[10px] text-zinc-600 font-medium">
                      <span className="text-zinc-400 w-16 uppercase tracking-wider text-[8px] font-bold">pH:</span>
                      <span className="text-[#537E36] font-bold">{crop.ph}</span>
                    </div>
                    <div className="flex items-center text-[10px] text-zinc-600 font-medium">
                      <span className="text-zinc-400 w-16 uppercase tracking-wider text-[8px] font-bold">Yield:</span>
                      <span className="text-zinc-700 font-bold">{crop.yield}</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

          <div className="flex items-start space-x-2 text-[10px] text-zinc-500 bg-[#FAF8F5] p-3 border border-zinc-150 rounded-xl leading-relaxed">
            <Flame className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
            <span>AI recommendation engine utilizes soil organic density ratios alongside seasonal meteorological cycles to plan optimal crop successions.</span>
          </div>

        </div>
      )}

    </div>
  );
};
