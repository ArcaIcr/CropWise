import React from 'react';
import { User, MapPin, Calendar, Activity, ClipboardList } from 'lucide-react';
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
    <div className="bg-zinc-950/20 border border-zinc-900 rounded-2xl p-6 sm:p-8 space-y-6 print-card relative">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start border-b border-zinc-900 pb-5 gap-4">
        <div>
          <h3 className="text-sm font-bold text-white print-title flex items-center">
            <ClipboardList className="w-4 h-4 text-emerald-450 mr-2 shrink-0" />
            <span>Soil Diagnosis Certificate</span>
          </h3>
          <p className="text-[10px] text-zinc-400 mt-1">{coop?.name || 'Northern Mindanao Farmers Association'}</p>
          <p className="text-[9px] text-zinc-550 mt-0.5">{coop?.barangay}, {coop?.city}, {coop?.province}</p>
        </div>
        <div className="text-left sm:text-right text-[10px] text-zinc-500 space-y-1">
          <p>Certificate ID: <span className="font-mono text-zinc-300 font-bold">{report.id.substring(0, 13).toUpperCase()}</span></p>
          <p>Date Tested: <span className="text-zinc-300 font-bold">{new Date(report.generatedAt).toLocaleString()}</span></p>
          <p>Field Officer: <span className="text-zinc-300 font-bold">{user?.name}</span></p>
        </div>
      </div>

      {/* Target Farmer Details Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-950/30 p-4 rounded-xl border border-zinc-900 print-card">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-zinc-900 rounded-lg text-zinc-500 border border-zinc-850">
            <User className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[8px] uppercase text-zinc-500 tracking-wider font-bold">Farmer</p>
            <h4 className="text-xs font-bold text-zinc-200">{farmer?.name}</h4>
            <p className="text-[10px] text-zinc-400">{farmer?.phone}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-zinc-900 rounded-lg text-zinc-500 border border-zinc-850">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[8px] uppercase text-zinc-500 tracking-wider font-bold">Farming Plot</p>
            <h4 className="text-xs font-bold text-zinc-200">{plot?.plotName}</h4>
            <p className="text-[10px] text-zinc-400">{plot?.areaHectares} Hectare(s) • {plot?.crop}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-zinc-900 rounded-lg text-zinc-500 border border-zinc-850">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[8px] uppercase text-zinc-500 tracking-wider font-bold">Crop Cycle</p>
            <h4 className="text-xs font-bold text-zinc-200">Stage: {plot?.cropStage}</h4>
            <p className="text-[10px] text-zinc-400">Planted: {plot?.plantingDate}</p>
          </div>
        </div>
      </div>

      {/* Chemistry status blocks */}
      <div className="space-y-2.5">
        <h4 className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 flex items-center">
          <Activity className="w-3.5 h-3.5 text-emerald-500/70 mr-1.5" />
          Soil Chemistry Logs
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-zinc-950/30 border border-zinc-900 p-3 rounded-xl print-card text-center">
            <span className="text-[8px] text-zinc-500 uppercase tracking-wider block">Soil pH</span>
            <span className="text-xs font-bold text-zinc-200 mt-1 block">{reading?.ph}</span>
          </div>
          <div className="bg-zinc-950/30 border border-zinc-900 p-3 rounded-xl print-card text-center">
            <span className="text-[8px] text-zinc-500 uppercase tracking-wider block">Nitrogen</span>
            <span className="text-xs font-bold text-zinc-200 mt-1 block">{reading?.nitrogen} ppm</span>
          </div>
          <div className="bg-zinc-950/30 border border-zinc-900 p-3 rounded-xl print-card text-center">
            <span className="text-[8px] text-zinc-500 uppercase tracking-wider block">Phosphorus</span>
            <span className="text-xs font-bold text-zinc-200 mt-1 block">{reading?.phosphorus} ppm</span>
          </div>
          <div className="bg-zinc-950/30 border border-zinc-900 p-3 rounded-xl print-card text-center">
            <span className="text-[8px] text-zinc-500 uppercase tracking-wider block">Potassium</span>
            <span className="text-xs font-bold text-zinc-200 mt-1 block">{reading?.potassium} ppm</span>
          </div>
        </div>
      </div>

      {/* Specific Parameter Interpretation */}
      <div className="space-y-2.5">
        <h4 className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 flex items-center">
          <ClipboardList className="w-3.5 h-3.5 text-emerald-500/70 mr-1.5" />
          Agronomic Diagnosis & Action Steps
        </h4>
        <div className="space-y-2">
          {recData.recommendations?.map((rec, idx) => (
            <div key={idx} className="bg-zinc-950/20 border border-zinc-900 p-3.5 rounded-xl print-card space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                  {rec.parameter === 'ph' ? 'Soil pH' : rec.parameter.toUpperCase()}
                </span>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-950/30 px-2 py-0.5 rounded-lg">
                  {translate(rec.interpretation)}
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">{translate(rec.recommendationText)}</p>
              {rec.rateKgPerHectare > 0 && (
                <div className="flex flex-wrap gap-4 pt-1 text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">
                  <span>Rate: <strong className="text-zinc-350">{rec.rateKgPerHectare} kg/ha</strong></span>
                  <span>•</span>
                  <span>Total needed: <strong className="text-emerald-400">{rec.totalNeededKg} kg ({rec.totalBags} bags)</strong></span>
                  <span>•</span>
                  <span>Type: <strong className="text-zinc-350">{rec.fertilizerType}</strong></span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Total aggregates block */}
      <div className="bg-emerald-950/10 border border-emerald-900/20 rounded-xl p-4.5 print-card">
        <h4 className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 mb-2.5">Total commercial fertilizer required</h4>
        <div className="divide-y divide-emerald-900/10 space-y-2">
          {!recData.totalFertilizers || recData.totalFertilizers.length === 0 ? (
            <p className="text-xs text-zinc-400 pt-1">No commercial fertilizer inputs required for this plot.</p>
          ) : (
            recData.totalFertilizers.map((tf, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs pt-2 first:pt-0">
                <span className="font-semibold text-zinc-350">{tf.fertilizerType}</span>
                <span className="font-bold text-emerald-400">{tf.totalBags} Bag(s) <span className="text-[10px] text-zinc-500 font-normal">({tf.totalKg} kg)</span></span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Official disclaimer */}
      <div className="border-t border-zinc-900 pt-4 text-[9px] text-zinc-550 text-center leading-relaxed">
        <p>Disclaimer: Agronomic calculations are rule-based and derived from regional soil limits mapped by the Bureau of Soils and Water Management (DA-BSWM). Consult cooperative specialists to audit field-level moisture variations.</p>
      </div>

    </div>
  );
};
