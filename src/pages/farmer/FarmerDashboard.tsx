import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FarmerLayout } from '../../components/farmer/FarmerLayout';
import { useFarmerData } from '../../hooks/useFarmerData';
import { Leaf, FileText, Sparkles, ChevronRight, Calendar, MapPin } from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { farmer, plots, loading } = useFarmerData();
  const navigate = useNavigate();

  if (loading) {
    return (
      <FarmerLayout title="Dashboard">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </FarmerLayout>
    );
  }

  if (!farmer) {
    return (
      <FarmerLayout title="Dashboard">
        <div className="text-center py-12">
          <Leaf className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">No Farm Profile Found</h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Contact your field officer to register your farm.
          your farm in the system.
          </p>
        </div>
      </FarmerLayout>
    );
  }

  const getStatusColor = (report?: any) => {
    if (!report) return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500';
    return report.reportStatus === 'finalized' 
      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
  };

  const getStatusText = (report?: any) => {
    if (!report) return 'No Report';
    return report.reportStatus === 'finalized' ? 'Ready' : 'Draft';
  };

  const totalArea = plots.reduce((sum, p) => sum + p.areaHectares, 0);
  const activeCropsCount = plots.length;

  // Calculate if any plot is deficient based on standard agronomic thresholds:
  // pH < 5.5 (Acidic), N < 20 ppm, P < 8 ppm, K < 60 ppm
  const deficientPlots = plots.filter(plot => {
    const reading = plot.latestReading;
    if (!reading) return false;
    return reading.ph < 5.5 || reading.nitrogen < 20 || reading.phosphorus < 8 || reading.potassium < 60;
  });

  return (
    <FarmerLayout title="My Farm">
      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-green-700 dark:from-emerald-950 dark:to-zinc-900 border border-emerald-500/20 dark:border-zinc-800 rounded-2xl p-5 mb-6 text-white shadow-lg relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-400/10 blur-[40px] rounded-full pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-emerald-100 dark:text-emerald-400/80 text-sm">Welcome back,</p>
            <h2 className="text-xl font-bold tracking-tight mt-0.5">{farmer.name}</h2>
            <p className="text-emerald-100/90 dark:text-zinc-400 text-xs mt-1.5 font-medium">{farmer.barangay} • {farmer.phone}</p>
          </div>
          <div className="w-16 h-16 bg-white/10 dark:bg-emerald-900/30 border border-white/10 dark:border-emerald-800/20 rounded-2xl flex items-center justify-center shadow-inner">
            <Leaf className="w-8 h-8 text-emerald-250 dark:text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 text-center shadow-sm">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Total Land</p>
          <p className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white mt-1">{totalArea.toFixed(1)} ha</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 text-center shadow-sm">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Plots Active</p>
          <p className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white mt-1">{activeCropsCount}</p>
        </div>
        <div className={`border rounded-2xl p-3 text-center shadow-sm ${
          deficientPlots.length > 0
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
        }`}>
          <p className="text-[10px] uppercase tracking-wider font-semibold">Deficiency</p>
          <p className="text-base sm:text-lg font-extrabold mt-1">{deficientPlots.length > 0 ? `${deficientPlots.length} Alert` : 'Optimal'}</p>
        </div>
      </div>

      {/* Deficiency warning banner if any are deficient */}
      {deficientPlots.length > 0 && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 p-3.5 rounded-2xl text-xs flex items-start gap-2.5 shadow-sm">
          <Sparkles className="w-5 h-5 shrink-0 text-amber-500" />
          <div>
            <span className="font-bold">Soil Nutrients Warning:</span>
            <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">
              Some farm plots ({deficientPlots.map(p => p.plotName).join(', ')}) show low soil chemistry readings. Review recommendations to apply appropriate fertilizers.
            </p>
          </div>
        </div>
      )}

      {/* Plots Overview */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Your Farm Plots</h3>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">{plots.length} plot{plots.length !== 1 ? 's' : ''}</span>
        </div>

        {plots.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 text-center border border-zinc-200 dark:border-zinc-800">
            <Leaf className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-zinc-900 dark:text-white mb-1">No Plots Registered</h4>
            <p className="text-zinc-500 dark:text-zinc-400">Your field officer will add your farm plots.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plots.map((plot: typeof plots[0]) => {
              const isPlotDeficient = plot.latestReading && (
                plot.latestReading.ph < 5.5 ||
                plot.latestReading.nitrogen < 20 ||
                plot.latestReading.phosphorus < 8 ||
                plot.latestReading.potassium < 60
              );

              const accentClass = isPlotDeficient 
                ? 'border-l-4 border-l-amber-500' 
                : plot.latestReport 
                  ? 'border-l-4 border-l-emerald-500' 
                  : 'border-l-4 border-l-zinc-300 dark:border-l-zinc-700';

              return (
                <div 
                  key={plot.id} 
                  className={`bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm transition hover:shadow-md ${accentClass}`}
                >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-white">{plot.plotName}</h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{plot.crop} • {plot.areaHectares} ha</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(plot.latestReport)}`}>
                    {getStatusText(plot.latestReport)}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>Planted: {plot.plantingDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="truncate">{plot.locationText || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Stage: {plot.cropStage}</span>
                  </div>
                </div>

                {plot.latestReading && (
                  <button 
                    onClick={() => navigate(`/farmer/reading/${plot.latestReading?.id}`)}
                    className="w-full text-left mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 hover:opacity-80 transition block cursor-pointer"
                  >
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Latest Soil Reading</p>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-2">
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{plot.latestReading.ph}</p>
                        <p className="text-xs text-zinc-500">pH</p>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-2">
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{plot.latestReading.nitrogen}</p>
                        <p className="text-xs text-zinc-500">N</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-2">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{plot.latestReading.phosphorus}</p>
                        <p className="text-xs text-zinc-500">P</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-2">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{plot.latestReading.potassium}</p>
                        <p className="text-xs text-zinc-500">K</p>
                      </div>
                    </div>
                  </button>
                )}

                {plot.latestReport && (
                  <button 
                    onClick={() => navigate(`/farmer/reports/${plot.latestReport?.id}`)}
                    className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    View Fertilizer Report
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => navigate('/farmer/reports')}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
        >
          <FileText className="w-6 h-6 text-emerald-600" />
          <span className="text-sm font-medium text-zinc-900 dark:text-white">My Reports</span>
          <span className="text-xs text-zinc-500">{plots.filter(p => p.latestReport).length} available</span>
        </button>
        <button 
          onClick={() => navigate('/farmer/advisor')}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
        >
          <Sparkles className="w-6 h-6 text-amber-500" />
          <span className="text-sm font-medium text-zinc-900 dark:text-white">Recommendations</span>
          <span className="text-xs text-zinc-500">View fertilizer plans</span>
        </button>
      </div>
    </FarmerLayout>
  );
};