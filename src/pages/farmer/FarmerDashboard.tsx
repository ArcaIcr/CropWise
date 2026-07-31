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

  return (
    <FarmerLayout title="My Farm">
      {/* Welcome Card */}
      <div className="bg-emerald-600 rounded-2xl p-5 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm">Welcome back,</p>
            <h2 className="text-xl font-bold">{farmer.name}</h2>
            <p className="text-emerald-100 text-sm mt-1">{farmer.barangay} • {farmer.phone}</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <Leaf className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </div>

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
            {plots.map((plot: typeof plots[0]) => (
              <div key={plot.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm">
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
                    onClick={() => navigate('/farmer/reports')}
                    className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    View Fertilizer Report
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
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
          onClick={() => navigate('/farmer/reports')}
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