import React from 'react';
import { FarmerLayout } from '../../components/farmer/FarmerLayout';
import { useFarmerData } from '../../hooks/useFarmerData';
import { FileText, ChevronRight } from 'lucide-react';

export const FarmerReportView: React.FC = () => {
  const { plots, loading } = useFarmerData();

  if (loading) {
    return (
      <FarmerLayout title="My Reports">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </FarmerLayout>
    );
  }

  const allReports = plots.flatMap(plot => 
    plot.latestReport ? [{ ...plot.latestReport, plotName: plot.plotName, crop: plot.crop }] : []
  ).sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());

  return (
    <FarmerLayout title="My Reports">
      {allReports.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">No Reports Yet</h3>
          <p className="text-zinc-500 dark:text-zinc-400">Your field officer will generate reports after soil testing.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allReports.map((report) => (
            <button key={report.id} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">{report.plotName}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {report.crop} • {new Date(report.generatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full">
                  Ready
                </span>
                <ChevronRight className="w-5 h-5 text-zinc-400" />
              </div>
            </button>
          ))}
        </div>
      )}
    </FarmerLayout>
  );
};