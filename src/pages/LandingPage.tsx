import React, { useState } from 'react';
import { 
  CloudLightning, 
  ArrowRight, 
  Wifi, 
  FileText, 
  Smartphone,
  Flame
} from 'lucide-react';
import { generateRecommendation } from '../services/recommendations';
import type { IRecommendationRule, ISoilReading } from '../types/database';

interface ILandingPageProps {
  onLaunch: () => void;
}

// Static fallback rules for Corn in Northern Mindanao for the interactive hero simulator
const demoRules: IRecommendationRule[] = [
  {
    id: 'rule-demo-ph-low',
    crop: 'Corn',
    region: 'Northern Mindanao',
    parameter: 'ph',
    thresholdMin: 0,
    thresholdMax: 5.4,
    interpretation: 'Highly Acidic Soil',
    recommendationText: 'Apply agricultural lime (carbonate) at 2 to 3 tons per hectare. Work lime thoroughly into the top 15cm of soil at least 4 weeks before planting.',
    fertilizerType: 'Agricultural Lime',
    rateKgPerHectare: 2500,
    sourceReference: 'DA-BSWM Soil Quality Guidelines for Corn Production',
    createdAt: 0,
    updatedAt: 0,
    isDeleted: false
  },
  {
    id: 'rule-demo-ph-optimal',
    crop: 'Corn',
    region: 'Northern Mindanao',
    parameter: 'ph',
    thresholdMin: 5.5,
    thresholdMax: 7.0,
    interpretation: 'Optimal Soil pH',
    recommendationText: 'Soil acidity is optimal. Maintain current organic matter practices to stabilize pH.',
    fertilizerType: 'None',
    rateKgPerHectare: 0,
    sourceReference: 'DA-BSWM Soil Quality Guidelines for Corn Production',
    createdAt: 0,
    updatedAt: 0,
    isDeleted: false
  },
  {
    id: 'rule-demo-n-low',
    crop: 'Corn',
    region: 'Northern Mindanao',
    parameter: 'nitrogen',
    thresholdMin: 0,
    thresholdMax: 20,
    interpretation: 'Severe Nitrogen Deficiency',
    recommendationText: 'Apply 120 kg N/ha. Split application: 50% basal (Complete 14-14-14) and 50% sidedress using Urea.',
    fertilizerType: 'Urea (46-0-0)',
    rateKgPerHectare: 260,
    sourceReference: 'Project SARAI Guidelines for Corn',
    createdAt: 0,
    updatedAt: 0,
    isDeleted: false
  },
  {
    id: 'rule-demo-n-medium',
    crop: 'Corn',
    region: 'Northern Mindanao',
    parameter: 'nitrogen',
    thresholdMin: 21,
    thresholdMax: 40,
    interpretation: 'Moderate Nitrogen Level',
    recommendationText: 'Apply 80 kg N/ha. Apply 40% basal and 60% sidedress during the active vegetative stage (V6-V8).',
    fertilizerType: 'Urea (46-0-0)',
    rateKgPerHectare: 175,
    sourceReference: 'Project SARAI Guidelines for Corn',
    createdAt: 0,
    updatedAt: 0,
    isDeleted: false
  },
  {
    id: 'rule-demo-p-low',
    crop: 'Corn',
    region: 'Northern Mindanao',
    parameter: 'phosphorus',
    thresholdMin: 0,
    thresholdMax: 6,
    interpretation: 'Phosphorus Deficient',
    recommendationText: 'Apply 60 kg P2O5/ha as basal. Phosphorus is critical for early root development.',
    fertilizerType: 'Solophos (0-20-0)',
    rateKgPerHectare: 300,
    sourceReference: 'DA-BSWM Soil Diagnostic Manual',
    createdAt: 0,
    updatedAt: 0,
    isDeleted: false
  },
  {
    id: 'rule-demo-k-low',
    crop: 'Corn',
    region: 'Northern Mindanao',
    parameter: 'potassium',
    thresholdMin: 0,
    thresholdMax: 60,
    interpretation: 'Potassium Deficient',
    recommendationText: 'Apply 60 kg K2O/ha. Potassium enhances drought tolerance and stalk strength.',
    fertilizerType: 'Muriate of Potash (0-0-60)',
    rateKgPerHectare: 100,
    sourceReference: 'DA-BSWM Soil Diagnostic Manual',
    createdAt: 0,
    updatedAt: 0,
    isDeleted: false
  }
];

/**
 * Public landing page for the CropWise ecosystem.
 * Shows product positioning, values, stats, deployment flows, and an interactive hero preview.
 * 
 * @param props Props containing the launch trigger callback.
 */
export const LandingPage: React.FC<ILandingPageProps> = ({ onLaunch }) => {
  // Simulator states
  const [simPh, setSimPh] = useState<number>(5.2);
  const [simN, setSimN] = useState<number>(15);
  const [simP, setSimP] = useState<number>(5);
  const [simK, setSimK] = useState<number>(45);

  const mockReading: ISoilReading = {
    id: 'mock-id',
    plotId: 'mock-plot',
    cooperativeId: 'coop-default-uuid',
    source: 'manual',
    ph: simPh,
    nitrogen: simN,
    phosphorus: simP,
    potassium: simK,
    collectedAt: Date.now(),
    createdBy: 'tech-default-uuid',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDeleted: false
  };

  const simResult = generateRecommendation(mockReading, demoRules, 'Corn', 'Northern Mindanao', 1.0);

  return (
    <div className="min-h-screen bg-slate-950 bg-gradient-to-br from-zinc-950 via-slate-900 to-emerald-950/20 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Landing Navigation */}
      <nav className="bg-slate-950/40 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-600/10 border border-emerald-500/25 rounded-xl text-emerald-400">
              <CloudLightning className="w-5.5 h-5.5 animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white leading-none">CropWise</span>
              <p className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase mt-0.5 leading-none">Cooperative Deployment</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#how-it-works" className="text-xs text-slate-400 hover:text-slate-200 transition font-medium hidden sm:inline-block">How it works</a>
            <a href="#features" className="text-xs text-slate-400 hover:text-slate-200 transition font-medium hidden sm:inline-block">System Features</a>
            <button
              onClick={onLaunch}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4.5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <span>Launch Field Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Interactive Widget */}
      <section className="relative py-16 lg:py-24 overflow-hidden border-b border-slate-900">
        {/* Glow Spotlight Behind */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Pitch Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold rounded-full select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Offline-First Cooperative Network</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-[112%]">
              Smarter Fertilizer Decisions, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">Delivered Offline.</span>
            </h1>
            
            <p className="text-base text-slate-300 max-w-xl leading-relaxed">
              CropWise empowers field officers to serve hundreds of small farmers. Log soil values, run rule-based diagnostic calculations offline, and print crop-specific fertilizer plans instantly—without forcing farmers to download another app.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onLaunch}
                className="flex items-center space-x-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition shadow-xl shadow-emerald-950/30 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>Launch Officer Dashboard</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
              <a 
                href="#how-it-works"
                className="flex items-center space-x-2 border border-slate-800 bg-slate-900/40 hover:bg-slate-900 text-slate-300 font-semibold text-sm px-6 py-3.5 rounded-xl transition active:scale-95"
              >
                <span>Learn Deployment Pipeline</span>
              </a>
            </div>

            {/* Quick trust stamps */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-900 max-w-md">
              <div>
                <span className="text-lg font-extrabold text-white block">100%</span>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Offline Diagnostic Capable</span>
              </div>
              <div>
                <span className="text-lg font-extrabold text-white block">Official</span>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Aligned with BSWM standards</span>
              </div>
              <div>
                <span className="text-lg font-extrabold text-white block">Local</span>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Tagalog/Cebuano translated</span>
              </div>
            </div>
          </div>

          {/* Interactive Soil Simulator Preview Widget */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-200 flex items-center uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-emerald-400 mr-2" /> Live Soil Calculator Preview
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">Interact with sliders to test real-time agronomic recommendations:</p>
              </div>

              {/* Sliders container */}
              <div className="space-y-4">
                {/* pH Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Soil pH Level</span>
                    <span className="font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">{simPh}</span>
                  </div>
                  <input
                    type="range"
                    min="3.5"
                    max="8.5"
                    step="0.1"
                    value={simPh}
                    onChange={e => setSimPh(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Nitrogen Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Nitrogen (N)</span>
                    <span className="font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">{simN} ppm</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="1"
                    value={simN}
                    onChange={e => setSimN(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Phosphorus Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Phosphorus (P)</span>
                    <span className="font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">{simP} ppm</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="1"
                    value={simP}
                    onChange={e => setSimP(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Potassium Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Potassium (K)</span>
                    <span className="font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">{simK} ppm</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    step="1"
                    value={simK}
                    onChange={e => setSimK(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>

              {/* Live result output */}
              <div className="bg-slate-950/65 border border-white/5 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  <span>Computed Diagnostics</span>
                  <span className="text-slate-400">1.0 Hectare Corn</span>
                </div>
                
                <div className="space-y-2">
                  {simResult.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start justify-between text-xs gap-3">
                      <span className="text-slate-400 font-semibold uppercase text-[10px] shrink-0 mt-0.5">
                        {rec.parameter === 'ph' ? 'Soil pH' : rec.parameter.charAt(0).toUpperCase()}
                      </span>
                      <div className="text-right">
                        <span className="font-bold text-slate-200">{rec.interpretation}</span>
                        {rec.rateKgPerHectare > 0 && (
                          <p className="text-[10px] text-emerald-400">{rec.fertilizerType}: {rec.totalBags} bags</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/5 pt-2.5 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-400">Total Fertilizer Input:</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                    {simResult.totalFertilizers.reduce((sum, f) => sum + f.totalBags, 0).toFixed(1)} bag(s) required
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Pipeline workflow details */}
      <section id="how-it-works" className="py-20 bg-slate-950/20 border-b border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">The Technician-Assisted Access Pipeline</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">CropWise bridges the digital gap by using trusted local field officers as the operators, ensuring small farmers benefit directly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl relative space-y-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center font-bold text-emerald-400 text-sm">
                1
              </div>
              <h4 className="font-bold text-base text-slate-200">Field Diagnosis</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The cooperative officer visits the smallholder plot, manually logging coordinates or syncing with soil sensor kits offline.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl relative space-y-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center font-bold text-emerald-400 text-sm">
                2
              </div>
              <h4 className="font-bold text-base text-slate-200">Standard Rule Check</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Soil parameters are parsed locally using official government (DA-BSWM) guidelines to define deficiency flags.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl relative space-y-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center font-bold text-emerald-400 text-sm">
                3
              </div>
              <h4 className="font-bold text-base text-slate-200">Local Handout Delivery</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The officer gives the farmer a physical printed diagnostic sheet or a Tagalog/Cebuano SMS summary directly.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl relative space-y-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center font-bold text-emerald-400 text-sm">
                4
              </div>
              <h4 className="font-bold text-base text-slate-200">Cooperative Sync</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Once cellular or office Wi-Fi connection is restored, the local cached readings safely sync to the cloud database.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Feature matrix */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Engineered for Harsh Field Realities</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">No placeholders. Fully type-safe offline synchronization designed specifically for agricultural extensions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-slate-900/20 border border-slate-850 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-slate-200">Zero Farmer Smartphone Barrier</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Beneficiaries do not need logins, complex dashboards, or smartphone installations. Trusted human extension workers explain recommendations directly.
                </p>
              </div>
              <div className="flex items-center text-[10px] text-emerald-400 font-bold uppercase tracking-wider space-x-1 pt-4">
                <span>Farmer Benefiting Access Model</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/20 border border-slate-850 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Wifi className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-slate-200">Dexie-Powered Offline Caching</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  All readings, farmer details, and reports write to IndexedDB. Safe conflict resolution automatically synchronizes with Supabase when online.
                </p>
              </div>
              <div className="flex items-center text-[10px] text-emerald-400 font-bold uppercase tracking-wider space-x-1 pt-4">
                <span>IndexedDB Storage Sync</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/20 border border-slate-850 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-slate-200">Auditable, Rule-Based calculations</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No black-box "AI recipe generation". All recommendations are traceable to regional agricultural soil standards and government BSWM source references.
                </p>
              </div>
              <div className="flex items-center text-[10px] text-emerald-400 font-bold uppercase tracking-wider space-x-1 pt-4">
                <span>DA-BSWM Standard Aligned</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-16 bg-slate-950 border-t border-slate-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Empower Your Cooperative Technicians Today</h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">Provide auditable, custom soil diagnosis reports that reduce input costs and maximize crop yields.</p>
          <button
            onClick={onLaunch}
            className="inline-flex items-center space-x-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-7 py-4 rounded-xl transition shadow-xl shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span>Launch Technician Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="flex justify-center space-x-6 pt-4 text-xs text-slate-650">
            <span>Co-op Funded</span>
            <span>•</span>
            <span>Technician-Operated</span>
            <span>•</span>
            <span>Farmer-Benefiting</span>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>© 2026 CropWise Agronomic Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
};
