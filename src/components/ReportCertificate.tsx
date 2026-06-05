import React from 'react';
import { User, MapPin, Calendar, Activity, TrendingDown } from 'lucide-react';
import type { IRecommendationResult } from '../services/recommendations';
import type { 
  IFertilizerReport, 
  IFarmer, 
  IPlot, 
  ISoilReading, 
  ICooperative, 
  IUser 
} from '../types/database';

interface IReportCertificateProps {
  report: IFertilizerReport;
  farmer?: IFarmer | null;
  plot?: IPlot | null;
  reading?: ISoilReading | null;
  coop?: ICooperative | null;
  user?: IUser | null;
  translate: (text: string) => string;
}

/**
 * Reusable ReportCertificate component.
 * Displays a formatted laboratory certificate with diagnostic chemistry logs.
 * 
 * @param props Props containing entity records and translation helpers.
 */
export const ReportCertificate: React.FC<IReportCertificateProps> = ({
  report,
  farmer,
  plot,
  reading,
  coop,
  user,
  translate
}) => {
  const recData: IRecommendationResult = JSON.parse(report.recommendationSummary || '{}');


  return (
    <div className="bg-slate-900/25 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 print-card shadow-xl relative overflow-hidden">
      
      {/* Decorative bioluminescent organic ring inside background */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start border-b border-white/5 pb-5 gap-4 relative z-10">
        <div>
          <h3 className="text-base font-bold text-slate-100 print-title flex items-center">
            <span className="text-emerald-400 mr-2">✓</span> CropWise Diagnostic Certificate
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">{coop?.name || 'Northern Mindanao Farmers Association'}</p>
          <p className="text-[9px] text-slate-550 mt-0.5">{coop?.barangay}, {coop?.city}, {coop?.province}</p>
        </div>
        <div className="text-left sm:text-right text-[10px] text-slate-450 space-y-1">
          <p>Certificate ID: <span className="font-mono text-slate-300 font-bold">{report.id.substring(0, 13).toUpperCase()}</span></p>
          <p>Date Tested: <span className="text-slate-300 font-bold">{new Date(report.generatedAt).toLocaleString()}</span></p>
          <p>Field Officer: <span className="text-slate-300 font-bold">{user?.name}</span></p>
        </div>
      </div>

      {/* Target Farmer Details Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/40 p-4 rounded-2xl border border-white/5 print-card relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-900 rounded-lg text-slate-455 border border-white/5">
            <User className="w-4 h-4 text-emerald-550" />
          </div>
          <div>
            <p className="text-[9px] uppercase text-slate-500 tracking-wider font-bold">Farmer</p>
            <h4 className="text-xs font-bold text-slate-200">{farmer?.name}</h4>
            <p className="text-[10px] text-slate-450">{farmer?.phone}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-900 rounded-lg text-slate-455 border border-white/5">
            <MapPin className="w-4 h-4 text-emerald-555" />
          </div>
          <div>
            <p className="text-[9px] uppercase text-slate-500 tracking-wider font-bold">Farming Plot</p>
            <h4 className="text-xs font-bold text-slate-200">{plot?.plotName}</h4>
            <p className="text-[10px] text-slate-455">{plot?.areaHectares} Hectare(s) • {plot?.crop}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-900 rounded-lg text-slate-455 border border-white/5">
            <Calendar className="w-4 h-4 text-emerald-555" />
          </div>
          <div>
            <p className="text-[9px] uppercase text-slate-500 tracking-wider font-bold">Crop Cycle</p>
            <h4 className="text-xs font-bold text-slate-200">Stage: {plot?.cropStage}</h4>
            <p className="text-[10px] text-slate-455 font-medium">Planted: {plot?.plantingDate}</p>
          </div>
        </div>
      </div>

      {/* Chemistry status blocks */}
      <div className="space-y-3 relative z-10">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-550 flex items-center">
          <Activity className="w-3.5 h-3.5 text-emerald-500 mr-2" />
          Soil Chemistry Logs
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950/40 border border-white/5 p-3 rounded-2xl print-card text-center">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Soil pH</span>
            <span className="text-sm font-bold text-slate-200 mt-1 block">{reading?.ph}</span>
          </div>
          <div className="bg-slate-950/40 border border-white/5 p-3 rounded-2xl print-card text-center">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Nitrogen</span>
            <span className="text-sm font-bold text-slate-200 mt-1 block">{reading?.nitrogen} ppm</span>
          </div>
          <div className="bg-slate-950/40 border border-white/5 p-3 rounded-2xl print-card text-center">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Phosphorus</span>
            <span className="text-sm font-bold text-slate-200 mt-1 block">{reading?.phosphorus} ppm</span>
          </div>
          <div className="bg-slate-950/40 border border-white/5 p-3 rounded-2xl print-card text-center">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Potassium</span>
            <span className="text-sm font-bold text-slate-200 mt-1 block">{reading?.potassium} ppm</span>
          </div>
        </div>
      </div>

      {/* Specific Parameter Interpretation */}
      <div className="space-y-4 relative z-10">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-550 flex items-center">
          <TrendingDown className="w-3.5 h-3.5 text-emerald-500 mr-2" />
          Agronomic Diagnosis & Action Steps
        </h4>
        <div className="space-y-3">
          {recData.recommendations?.map((rec, idx) => (
            <div key={idx} className="bg-slate-950/30 border border-white/5 p-4 rounded-2xl print-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
                  {rec.parameter === 'ph' ? 'Soil pH' : rec.parameter.toUpperCase()}
                </span>
                <span className="text-[10px] font-bold text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                  {translate(rec.interpretation)}
                </span>
              </div>
              <p className="text-xs text-slate-350 leading-relaxed">{translate(rec.recommendationText)}</p>
              {rec.rateKgPerHectare > 0 && (
                <div className="flex flex-wrap gap-4 pt-1 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  <span>Rate: <strong className="text-slate-300">{rec.rateKgPerHectare} kg/ha</strong></span>
                  <span>•</span>
                  <span>Total needed: <strong className="text-emerald-450">{rec.totalNeededKg} kg ({rec.totalBags} bags)</strong></span>
                  <span>•</span>
                  <span>Type: <strong className="text-slate-300">{rec.fertilizerType}</strong></span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Total aggregates block */}
      <div className="bg-emerald-600/5 border border-emerald-500/20 rounded-2xl p-5 print-card relative z-10">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-3">Total commercial fertilizer required</h4>
        <div className="divide-y divide-emerald-500/10 space-y-2.5">
          {!recData.totalFertilizers || recData.totalFertilizers.length === 0 ? (
            <p className="text-xs text-slate-400 pt-1">No commercial fertilizer inputs required for this plot.</p>
          ) : (
            recData.totalFertilizers.map((tf, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs pt-2.5 first:pt-0">
                <span className="font-semibold text-slate-300">{tf.fertilizerType}</span>
                <span className="font-bold text-emerald-450">{tf.totalBags} Bag(s) <span className="text-[10px] text-slate-500 font-normal">({tf.totalKg} kg)</span></span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Official disclaimer */}
      <div className="border-t border-white/5 pt-4 text-[9px] text-slate-550 text-center leading-relaxed relative z-10">
        <p>Disclaimer: Agronomic calculations are rule-based and derived from regional soil limits mapped by the Bureau of Soils and Water Management (DA-BSWM). Consult cooperative specialists to audit field-level moisture variations.</p>
      </div>

    </div>
  );
};
