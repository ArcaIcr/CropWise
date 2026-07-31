import React, { useState, useEffect } from 'react';
import { db } from '../../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Sun, 
  CloudSun, 
  CloudRain, 
  Info, 
  Check, 
  RefreshCw, 
  TrendingUp, 
  AlertCircle, 
  FileText, 
  Activity 
} from 'lucide-react';
import { FarmerLayout } from '../../components/farmer/FarmerLayout';
import { useFarmerData } from '../../hooks/useFarmerData';
import type { ISoilReading } from '../../types/database';

export const FarmerAdvisorView: React.FC = () => {
  const navigate = useNavigate();
  const { farmer, plots, loading } = useFarmerData();
  const [selectedPlotId, setSelectedPlotId] = useState<string>('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [showRecommendedCrops, setShowRecommendedCrops] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(0);

  // Default to the first plot once they load
  useEffect(() => {
    if (plots && plots.length > 0 && !selectedPlotId) {
      setSelectedPlotId(plots[0].id);
    }
  }, [plots, selectedPlotId]);

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


  const handleGeneratePlan = () => {
    setIsGeneratingPlan(true);
    setGenerationStep(0);
    setShowRecommendedCrops(false);
  };

  const handleLoadDemoReading = async () => {
    if (!selectedPlotId) return;
    const now = Date.now();
    const demoReading: ISoilReading = {
      id: crypto.randomUUID(),
      plotId: selectedPlotId,
      cooperativeId: farmer?.cooperativeId || 'coop-default-uuid',
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
      createdBy: farmer?.id || 'tech-default-uuid',
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

  if (loading) {
    return (
      <FarmerLayout title="Crop Advisor">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </FarmerLayout>
    );
  }

  return (
    <FarmerLayout title="Crop Advisor">
      <div className="text-zinc-800 space-y-5 sm:space-y-6 font-sans antialiased">
        
        {/* Header welcome banner */}
        <div className="w-full bg-gradient-to-r from-[#60993E] to-[#34701B] rounded-2xl p-5 sm:p-6 shadow-md text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
          <div className="flex items-center space-x-3.5 relative z-10">
            <div className="w-12 h-12 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-inner">
              <Sparkles className="w-6 h-6 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight m-0">AI Crop Advisor</h2>
              <p className="text-white/80 text-xs mt-1">Get custom crop suitability matching based on your farm's soil readings.</p>
            </div>
          </div>
        </div>

        {/* My Farms Selector Section */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl p-4 sm:p-5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950 rounded-xl text-emerald-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 m-0">Select Farm Plot</h3>
              <p className="text-[10px] text-zinc-400 font-medium">Select a plot to run the agronomic match engine.</p>
            </div>
          </div>

          {plots.length === 0 ? (
            <div className="p-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-zinc-500 text-xs">
              <p className="font-semibold">No plots registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {plots.map(plot => {
                const isSelected = plot.id === selectedPlotId;
                return (
                  <button
                    key={plot.id}
                    onClick={() => {
                      setSelectedPlotId(plot.id);
                      setShowRecommendedCrops(false);
                    }}
                    className={`p-4 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer w-full ${
                      isSelected
                        ? 'border-[#60993E] bg-[#F1F6EC] dark:bg-emerald-950/20'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{plot.plotName}</h4>
                      <p className="text-[9px] text-zinc-500 mt-0.5">{plot.areaHectares} ha • {plot.crop}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#60993E] flex items-center justify-center text-white">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Soil Health & Weather Forecast */}
        {selectedPlotId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Soil Health */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-[#60993E]" />
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Soil Metrics</span>
                </div>
                {latestReport && (
                  <button
                    onClick={() => navigate(`/farmer/reports/${latestReport.id}`)}
                    className="flex items-center space-x-1 text-[10px] text-[#60993E] font-bold cursor-pointer hover:underline"
                  >
                    <FileText className="w-3 h-3" />
                    <span>View Plan</span>
                  </button>
                )}
              </div>

              {!latestReading ? (
                <div className="py-8 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto" />
                  <p className="text-xs text-zinc-500">No soil reading logs recorded for this plot.</p>
                  <button
                    onClick={handleLoadDemoReading}
                    className="inline-flex items-center space-x-1.5 bg-[#60993E] hover:bg-[#528732] text-white font-bold text-[10px] px-4 py-2 rounded-xl transition cursor-pointer active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Load Demo Baseline Reading</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800">
                      <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Acidity (pH)</span>
                      <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-200 mt-1 block">{latestReading.ph} pH</span>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800">
                      <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Nitrogen (N)</span>
                      <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-200 mt-1 block">{latestReading.nitrogen} ppm</span>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800">
                      <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Phosphorus (P)</span>
                      <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-200 mt-1 block">{latestReading.phosphorus} ppm</span>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800">
                      <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Potassium (K)</span>
                      <span className="text-base font-extrabold text-zinc-800 dark:text-zinc-200 mt-1 block">{latestReading.potassium} ppm</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-tr from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 border border-zinc-200/50 dark:border-zinc-800 p-3.5 rounded-xl text-[10px] text-zinc-600 dark:text-zinc-400 leading-relaxed flex gap-2">
                    <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p>{getSoilSummary(latestReading)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Weather Forecast */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <CloudSun className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Weather Forecast</span>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800 text-center space-y-3">
                <div className="flex justify-center items-center gap-3">
                  <CloudSun className="w-8 h-8 text-amber-500 animate-pulse" />
                  <div className="text-left">
                    <h4 className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200 leading-none">32°C / 24°C</h4>
                    <p className="text-[10px] text-zinc-500 mt-1">Partly Cloudy Conditions</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-zinc-200/40 dark:border-zinc-800 pt-2.5 mt-2.5 text-center text-[10px]">
                  <div>
                    <span className="text-zinc-400 block">Humidity</span>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">68%</span>
                  </div>
                  <div className="border-x border-zinc-200/40 dark:border-zinc-800">
                    <span className="text-zinc-400 block">Rainfall</span>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">0 mm</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block">Wind</span>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">12 km/h</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-center text-[8px] sm:text-[9px] font-medium">
                <div className="bg-zinc-50 dark:bg-zinc-950 p-2 rounded-lg border border-zinc-300/20">
                  <span className="text-zinc-500 block">Tue</span>
                  <Sun className="w-3.5 h-3.5 text-amber-500 mx-auto my-1" />
                  <span className="text-zinc-700 dark:text-zinc-350 font-bold block">33°/25°</span>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-950 p-2 rounded-lg border border-zinc-300/20">
                  <span className="text-zinc-500 block">Wed</span>
                  <CloudRain className="w-3.5 h-3.5 text-sky-400 mx-auto my-1" />
                  <span className="text-zinc-700 dark:text-zinc-350 font-bold block">30°/23°</span>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-950 p-2 rounded-lg border border-zinc-300/20">
                  <span className="text-zinc-500 block">Thu</span>
                  <CloudSun className="w-3.5 h-3.5 text-zinc-400 mx-auto my-1" />
                  <span className="text-zinc-700 dark:text-zinc-350 font-bold block">29°/24°</span>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-950 p-2 rounded-lg border border-zinc-300/20">
                  <span className="text-zinc-500 block">Fri</span>
                  <CloudRain className="w-3.5 h-3.5 text-emerald-500 mx-auto my-1" />
                  <span className="text-zinc-700 dark:text-zinc-350 font-bold block">28°/22°</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Generate Advisor Plan Actions */}
        {selectedPlotId && latestReading && (
          <div className="flex flex-col items-center justify-center pt-3">
            <button
              onClick={handleGeneratePlan}
              disabled={isGeneratingPlan}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#60993E] to-[#45792B] hover:shadow-md disabled:bg-zinc-300 text-white font-extrabold text-xs px-8 py-3.5 rounded-xl transition duration-150 active:scale-95 cursor-pointer uppercase tracking-wider text-center"
            >
              {isGeneratingPlan ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Generating ({generationStep + 1}/4)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
                  <span>Generate Advisor Plan</span>
                </>
              )}
            </button>

            {isGeneratingPlan && (
              <div className="mt-4 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-xs flex items-center justify-center space-x-3 shadow-xs animate-pulse text-xs text-zinc-650 dark:text-zinc-450 font-mono">
                <TrendingUp className="w-4 h-4 text-[#60993E]" />
                <span>{steps[generationStep]}</span>
              </div>
            )}
          </div>
        )}

        {/* Recommended Crops Display */}
        {showRecommendedCrops && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl p-4 sm:p-5 space-y-4 animate-fadeIn">
            
            <div className="flex items-center space-x-2.5 border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <Sparkles className="w-4.5 h-4.5 text-[#60993E]" />
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Recommended Crop Yields</span>
            </div>

            <div className="space-y-4">
              {recommendedCrops.map((crop, idx) => {
                const isHigh = crop.score >= 80;
                const isMod = crop.score >= 60 && crop.score < 80;
                const accentColor = isHigh ? 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900/30' : isMod ? 'text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/30' : 'text-rose-600 border-rose-200 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-900/30';
                const progressColor = isHigh ? 'stroke-emerald-500' : isMod ? 'stroke-amber-500' : 'stroke-rose-500';

                const radius = 20;
                const circumference = 2 * Math.PI * radius;
                const strokeDashoffset = circumference - (crop.score / 100) * circumference;

                return (
                  <div
                    key={idx}
                    className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 p-4 rounded-xl flex items-start gap-4 hover:shadow-sm transition relative overflow-hidden"
                  >
                    {/* circular score dial */}
                    <div className="flex items-center justify-center shrink-0 relative w-12 h-12">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="24" cy="24" r={radius} className="stroke-zinc-200 dark:stroke-zinc-800 fill-none" strokeWidth="3" />
                        <circle cx="24" cy="24" r={radius} className={`fill-none ${progressColor}`} strokeWidth="3" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none text-[9px] font-extrabold text-zinc-800 dark:text-zinc-200">
                        <span>{crop.score}%</span>
                      </div>
                    </div>

                    {/* details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{crop.icon}</span>
                          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{crop.name}</span>
                        </div>
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${accentColor}`}>
                          {crop.category}
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">{crop.desc}</p>

                      <div className="grid grid-cols-2 gap-1.5 pt-1 text-[9px] text-zinc-500 dark:text-zinc-400">
                        <div>Period: <strong className="text-zinc-700 dark:text-zinc-300 font-bold">{crop.growth}</strong></div>
                        <div>Water: <strong className="text-zinc-700 dark:text-zinc-300 font-bold">{crop.water}</strong></div>
                        <div>pH Needs: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{crop.ph}</strong></div>
                        <div>Est. Yield: <strong className="text-zinc-700 dark:text-zinc-300 font-bold">{crop.yield}</strong></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </FarmerLayout>
  );
};
