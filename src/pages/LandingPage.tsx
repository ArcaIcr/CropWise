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
import { SoilDial } from '../components/SoilDial';
import { NutrientWell } from '../components/NutrientWell';

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
    <div className="min-h-screen text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* Landing Navigation */}
      <nav className="bg-zinc-950/45 backdrop-blur-md border-b border-zinc-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-950/50 border border-emerald-900/40 rounded-xl text-emerald-400">
              <CloudLightning className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white leading-none">CropWise</span>
              <p className="text-[9px] text-emerald-400 font-semibold tracking-wider uppercase mt-0.5 leading-none">Cooperative Deployment</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#how-it-works" className="text-xs text-zinc-400 hover:text-zinc-200 transition font-medium hidden sm:inline-block">How it works</a>
            <a href="#features" className="text-xs text-zinc-400 hover:text-zinc-200 transition font-medium hidden sm:inline-block">System Features</a>
            <button
                onClick={onLaunch}
                className="flex items-center space-x-2 bg-emerald-950/30 border border-emerald-900/30 text-emerald-400 hover:bg-emerald-800/30 backdrop-blur-xl rounded-xl px-4 py-2.5 text-xs font-semibold transition shadow-lg hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>Launch Field Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
          </div>
        </div>
      </nav>

      {/* Centered Hero Section */}
      <section className="relative py-20 overflow-hidden border-b border-zinc-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-emerald-950/30 border border-emerald-900/20 text-emerald-400 text-[10px] font-bold rounded-full select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-pulse" />
            <span>Offline-First Cooperative Network</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[112%] max-w-2xl">
            Smarter Fertilizer Decisions, <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-emerald-450 to-emerald-300">Delivered Offline.</span>
          </h1>
          
          <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
            CropWise empowers cooperative technicians to guide hundreds of small farmers. Log soil values, run rule-based diagnostic calculations offline, and print crop-specific fertilizer plans instantly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onLaunch}
              className="flex items-center space-x-2 bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all shadow-sm hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              <span>Launch Officer Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <a 
              href="#how-it-works"
              className="flex items-center space-x-2 border border-zinc-800 bg-zinc-900/10 hover:bg-zinc-900/20 text-zinc-300 font-semibold text-xs px-5 py-3 rounded-xl transition active:scale-95"
            >
              <span>Learn Deployment Pipeline</span>
            </a>
          </div>

          {/* Quick trust stamps */}
          <div className="pt-8 grid grid-cols-3 gap-8 border-t border-zinc-900 w-full max-w-md text-center">
            <div>
              <span className="text-base font-extrabold text-white block">100%</span>
              <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest mt-1 block">Offline Capable</span>
            </div>
            <div>
              <span className="text-base font-extrabold text-white block">Official</span>
              <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest mt-1 block">BSWM Aligned</span>
            </div>
            <div>
              <span className="text-base font-extrabold text-white block">Local</span>
              <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest mt-1 block">Multi-Lingual</span>
            </div>
          </div>
        </div>

        {/* Interactive Soil Simulator Preview Widget - Unified Centered Laboratory Panel */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative z-10">
          <div className="bg-zinc-950/20 border border-zinc-900 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-zinc-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold text-zinc-300 flex items-center uppercase tracking-widest">
                  <Flame className="w-3.5 h-3.5 text-emerald-400 mr-2" />
                  <span>Interactive Diagnostics Console</span>
                </h3>
                <p className="text-[10px] text-zinc-500 mt-1">Adjust dials and graduated cylinders to test recommendation computations:</p>
              </div>
              <span className="text-[9px] font-bold px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg select-none self-start sm:self-center">
                Vessel: 1.0 Ha Corn
              </span>
            </div>

            {/* Dials & Wells container replaced with premium centered single-row console */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-items-center">
              {/* pH Dial */}
              <div className="w-full flex justify-center">
                <SoilDial
                  value={simPh}
                  onChange={setSimPh}
                />
              </div>

              {/* Nitrogen Well */}
              <div className="w-full flex justify-center">
                <NutrientWell
                  label="Nitrogen"
                  value={simN}
                  maxVal={60}
                  colorType="nitrogen"
                  onChange={setSimN}
                />
              </div>

              {/* Phosphorus Well */}
              <div className="w-full flex justify-center">
                <NutrientWell
                  label="Phosphorus"
                  value={simP}
                  maxVal={25}
                  colorType="phosphorus"
                  onChange={setSimP}
                />
              </div>

              {/* Potassium Well */}
              <div className="w-full flex justify-center">
                <NutrientWell
                  label="Potassium"
                  value={simK}
                  maxVal={120}
                  colorType="potassium"
                  onChange={setSimK}
                />
              </div>
            </div>

            {/* Live result output */}
            <div className="bg-zinc-950/30 border border-zinc-900/60 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5 text-[9px] uppercase font-bold tracking-widest text-zinc-500">
                <span>Computed Diagnostics</span>
                <span>SARAI Standards</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {simResult.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start justify-between text-xs bg-zinc-900/20 border border-zinc-900/40 p-3 rounded-xl gap-3">
                    <span className="text-zinc-500 font-bold uppercase text-[9px] shrink-0 mt-0.5">
                      {rec.parameter === 'ph' ? 'Soil pH' : rec.parameter.toUpperCase()}
                    </span>
                    <div className="text-right">
                      <span className="font-bold text-zinc-200 block">{rec.interpretation}</span>
                      {rec.rateKgPerHectare > 0 ? (
                        <p className="text-[10px] text-emerald-400 mt-0.5">{rec.fertilizerType}: {rec.totalBags} bags</p>
                      ) : (
                        <p className="text-[10px] text-zinc-600 mt-0.5">Deficiency check optimal</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-900 pt-3 flex flex-col sm:flex-row justify-between items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Total Fertilizer Input:</span>
                <span className="text-xs font-bold text-emerald-450 bg-emerald-500/10 border border-emerald-950/30 px-3 py-1 rounded-xl">
                  {simResult.totalFertilizers.reduce((sum, f) => sum + f.totalBags, 0).toFixed(1)} bag(s) required
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pipeline workflow details */}
      <section id="how-it-works" className="py-20 bg-zinc-950/15 border-b border-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-white tracking-tight">The Technician-Assisted Access Pipeline</h2>
            <p className="text-zinc-400 text-xs max-w-xl mx-auto">CropWise bridges the digital gap by using trusted local field officers as the operators, ensuring small farmers benefit directly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="bg-zinc-950/20 border border-zinc-900/60 p-6 rounded-2xl relative space-y-4">
              <div className="w-9 h-9 rounded-full bg-emerald-950/40 border border-emerald-900/30 flex items-center justify-center font-bold text-emerald-455 text-xs">
                1
              </div>
              <h4 className="font-bold text-sm text-zinc-200">Field Diagnosis</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The cooperative officer visits the smallholder plot, manually logging coordinates or syncing with soil sensor kits offline.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-zinc-950/20 border border-zinc-900/60 p-6 rounded-2xl relative space-y-4">
              <div className="w-9 h-9 rounded-full bg-emerald-950/40 border border-emerald-900/30 flex items-center justify-center font-bold text-emerald-455 text-xs">
                2
              </div>
              <h4 className="font-bold text-sm text-zinc-200">Standard Rule Check</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Soil parameters are parsed locally using official government (DA-BSWM) guidelines to define deficiency flags.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-zinc-950/20 border border-zinc-900/60 p-6 rounded-2xl relative space-y-4">
              <div className="w-9 h-9 rounded-full bg-emerald-950/40 border border-emerald-900/30 flex items-center justify-center font-bold text-emerald-455 text-xs">
                3
              </div>
              <h4 className="font-bold text-sm text-zinc-200">Local Handout Delivery</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The officer gives the farmer a physical printed diagnostic sheet or a Tagalog/Cebuano SMS summary directly.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-zinc-950/20 border border-zinc-900/60 p-6 rounded-2xl relative space-y-4">
              <div className="w-9 h-9 rounded-full bg-emerald-950/40 border border-emerald-900/30 flex items-center justify-center font-bold text-emerald-455 text-xs">
                4
              </div>
              <h4 className="font-bold text-sm text-zinc-200">Cooperative Sync</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
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
            <h2 className="text-2xl font-bold text-white tracking-tight">Engineered for Harsh Field Realities</h2>
            <p className="text-zinc-400 text-xs max-w-xl mx-auto">No placeholders. Fully type-safe offline synchronization designed specifically for agricultural extensions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-zinc-950/20 border border-zinc-900/60 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-950/30 border border-emerald-900/20 text-emerald-400 flex items-center justify-center">
                  <Smartphone className="w-4.5 h-4.5" />
                </div>
                <h4 className="font-bold text-sm text-zinc-200">Zero Farmer Smartphone Barrier</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Beneficiaries do not need logins, complex dashboards, or smartphone installations. Trusted human extension workers explain recommendations directly.
                </p>
              </div>
              <div className="flex items-center text-[9px] text-emerald-450 font-bold uppercase tracking-wider space-x-1 pt-4">
                <span>Farmer Benefiting Access Model</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-950/20 border border-zinc-900/60 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-950/30 border border-emerald-900/20 text-emerald-400 flex items-center justify-center">
                  <Wifi className="w-4.5 h-4.5" />
                </div>
                <h4 className="font-bold text-sm text-zinc-200">Dexie-Powered Offline Caching</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  All readings, farmer details, and reports write to IndexedDB. Safe conflict resolution automatically synchronizes with Supabase when online.
                </p>
              </div>
              <div className="flex items-center text-[9px] text-emerald-450 font-bold uppercase tracking-wider space-x-1 pt-4">
                <span>IndexedDB Storage Sync</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-950/20 border border-zinc-900/60 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-950/30 border border-emerald-900/20 text-emerald-400 flex items-center justify-center">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <h4 className="font-bold text-sm text-zinc-200">Auditable, Rule-Based calculations</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  No black-box "AI recipe generation". All recommendations are traceable to regional agricultural soil standards and government BSWM source references.
                </p>
              </div>
              <div className="flex items-center text-[9px] text-emerald-455 font-bold uppercase tracking-wider space-x-1 pt-4">
                <span>DA-BSWM Standard Aligned</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-16 bg-zinc-950/45 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl font-bold text-white">Empower Your Cooperative Technicians Today</h2>
          <p className="text-zinc-400 text-xs max-w-lg mx-auto">Provide auditable, custom soil diagnosis reports that reduce input costs and maximize crop yields.</p>
          <button
            onClick={onLaunch}
            className="inline-flex items-center space-x-2 bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow-sm hover:scale-[1.01] active:scale-95 cursor-pointer"
          >
            <span>Launch Technician Dashboard</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
          <div className="flex justify-center space-x-6 pt-4 text-xs text-zinc-650">
            <span>Co-op Funded</span>
            <span>•</span>
            <span>Technician-Operated</span>
            <span>•</span>
            <span>Farmer-Benefiting</span>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <footer className="bg-zinc-950/45 border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        <p>© 2026 CropWise Agronomic Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
};
