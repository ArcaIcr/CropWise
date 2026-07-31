import React from 'react';
import { FarmerLayout } from '../../components/farmer/FarmerLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Sparkles, ChevronRight, Activity, FileText, Leaf } from 'lucide-react';

export const SoilReadingDetail: React.FC = () => {
  const { readingId } = useParams<{ readingId: string }>();
  const navigate = useNavigate();

  const reading = useLiveQuery(async () => {
    if (!readingId) return null;
    return await db.soilReadings.get(readingId);
  }, [readingId]);

  const report = useLiveQuery(async () => {
    if (!readingId) return null;
    return await db.fertilizerReports.where('soilReadingId').equals(readingId).first();
  }, [readingId]);

  const plot = useLiveQuery(async () => {
    if (!reading) return null;
    return await db.plots.get(reading.plotId);
  }, [reading?.plotId]);

  if (!reading) {
    return (
      <FarmerLayout title="Soil Reading">
        <div className="text-center py-12">
          <Activity className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Reading Not Found</h3>
        </div>
      </FarmerLayout>
    );
  }

  return (
    <FarmerLayout title="Soil Reading">
      <div className="space-y-4">
        {/* Header Card */}
        <div className="bg-emerald-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Soil Test Results</p>
              <h2 className="text-xl font-bold">{plot?.plotName || 'Farm Plot'}</h2>
              <p className="text-emerald-100 text-sm mt-1">{plot?.crop} • {plot?.areaHectares} ha</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Test Info */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Test Date</p>
              <p className="font-medium text-zinc-900 dark:text-white">{new Date(reading.collectedAt).toLocaleDateString()}</p>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Source</p>
              <p className="font-medium text-zinc-900 dark:text-white capitalize">{reading.source}</p>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Officer</p>
              <p className="font-medium text-zinc-900 dark:text-white">Field Officer</p>
            </div>
          </div>
        </div>

        {/* Soil Chemistry */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800">
          <h3 className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white mb-4">
            <Activity className="w-5 h-5 text-emerald-600" />
            Soil Chemistry (NPK & pH)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 text-center">
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-1">Soil pH</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{reading.ph.toFixed(1)}</p>
              <p className="text-xs text-zinc-500">
                {reading.ph >= 5.5 && reading.ph <= 7.0 ? 'Optimal' : reading.ph < 5.5 ? 'Acidic' : 'Alkaline'}
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 text-center">
              <p className="text-xs text-amber-700 dark:text-amber-400 mb-1">Nitrogen (N)</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{reading.nitrogen} ppm</p>
              <p className="text-xs text-zinc-500">{reading.nitrogen > 40 ? 'Optimal' : reading.nitrogen > 20 ? 'Moderate' : 'Low'}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
              <p className="text-xs text-purple-700 dark:text-purple-400 mb-1">Phosphorus (P)</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{reading.phosphorus} ppm</p>
              <p className="text-xs text-zinc-500">{reading.phosphorus > 15 ? 'Optimal' : reading.phosphorus > 8 ? 'Moderate' : 'Low'}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
              <p className="text-xs text-blue-700 dark:text-blue-400 mb-1">Potassium (K)</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{reading.potassium} ppm</p>
              <p className="text-xs text-zinc-500">{reading.potassium > 100 ? 'Optimal' : reading.potassium > 60 ? 'Moderate' : 'Low'}</p>
            </div>
          </div>
        </div>

        {/* Additional Parameters */}
        {(reading.moisture || reading.temperature || reading.electricalConductivity || reading.organicMatter) && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800">
            <h3 className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white mb-4">
              <Leaf className="w-5 h-5 text-emerald-600" />
              Additional Parameters
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {reading.moisture && (
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-zinc-500 mb-1">Moisture</p>
                  <p className="font-bold text-zinc-900 dark:text-white">{reading.moisture}%</p>
                </div>
              )}
              {reading.temperature && (
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-zinc-500 mb-1">Temperature</p>
                  <p className="font-bold text-zinc-900 dark:text-white">{reading.temperature}°C</p>
                </div>
              )}
              {reading.electricalConductivity && (
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-zinc-500 mb-1">EC / Salinity</p>
                  <p className="font-bold text-zinc-900 dark:text-white">{reading.electricalConductivity} dS/m</p>
                </div>
              )}
              {reading.organicMatter && (
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-zinc-500 mb-1">Organic Matter</p>
                  <p className="font-bold text-zinc-900 dark:text-white">{reading.organicMatter}%</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Report Link */}
        {report && (
          <button 
            onClick={() => navigate('/farmer/reports')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <FileText className="w-5 h-5" />
            View Fertilizer Report
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </FarmerLayout>
  );
};