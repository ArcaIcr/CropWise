import React, { useState, useEffect } from 'react';
import { db } from '../db/db';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Users, 
  ClipboardList, 
  PlusCircle, 
  CheckCircle,
  Database,
  CloudLightning,
  Home,
  Sparkles
} from 'lucide-react';

interface ILayoutProps {
  children: React.ReactNode;
  activeTab: 'registry' | 'test' | 'reports' | 'advisor';
  setActiveTab: (tab: 'registry' | 'test' | 'reports' | 'advisor') => void;
  onExit: () => void;
}

/**
 * Main Layout component containing the navigation bar, headers, 
 * network status indicator, and simulated offline syncing mechanism.
 * Styled with a premium glassmorphic dark agricultural theme.
 * 
 * @param props Props containing the layout children and navigation controllers.
 */
export const Layout: React.FC<ILayoutProps> = ({ children, activeTab, setActiveTab, onExit }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [unsyncedCount, setUnsyncedCount] = useState<number>(0);
  const [showSyncSuccess, setShowSyncSuccess] = useState<boolean>(false);

  // Sync count checker
  const checkUnsynced = async () => {
    try {
      const readings = await db.soilReadings.toArray();
      const unsynced = readings.filter(r => !r.syncedAt && !r.isDeleted).length;
      setUnsyncedCount(unsynced);
    } catch (error) {
      console.error('Failed to query soil readings:', error);
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    checkUnsynced();

    // Check periodically for new unsynced readings
    const interval = setInterval(checkUnsynced, 3000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  /**
   * Simulates sync pipeline: marks all unsynced readings as synced
   * and records a sync log inside the sync_events table.
   */
  const handleSync = async () => {
    if (unsyncedCount === 0 || isSyncing) return;
    
    setIsSyncing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const readings = await db.soilReadings.toArray();
      const unsyncedReadings = readings.filter(r => !r.syncedAt && !r.isDeleted);
      const now = Date.now();

      // Update readings in DB to marked as synced
      for (const reading of unsyncedReadings) {
        await db.soilReadings.update(reading.id, {
          syncedAt: now,
          updatedAt: now
        });

        // Record a sync event log
        await db.syncEvents.add({
          id: crypto.randomUUID(),
          userId: 'tech-default-uuid',
          localRecordId: reading.id,
          tableName: 'soil_readings',
          syncStatus: 'success',
          conflictStatus: 'none',
          syncedAt: now
        });
      }

      setUnsyncedCount(0);
      setShowSyncSuccess(true);
      setTimeout(() => setShowSyncSuccess(false), 3000);
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* Precision Top Header */}
      <header className="bg-zinc-950/45 backdrop-blur-md border-b border-zinc-900 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-950/50 border border-emerald-900/40 rounded-xl text-emerald-400">
              <CloudLightning className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white m-0 leading-none">
                CropWise <span className="text-[9px] font-semibold px-2 py-0.5 ml-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Field Portal</span>
              </h1>
              <p className="text-[10px] text-zinc-400 mt-1">Northern Mindanao Farmers Association</p>
            </div>
          </div>

          {/* Sync & Connectivity Center */}
          <div className="flex items-center space-x-3">
            {/* Sync Button */}
            {unsyncedCount > 0 && (
              <button
                onClick={handleSync}
                disabled={isSyncing || !isOnline}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all duration-150 ${
                  isOnline 
                    ? 'bg-emerald-600/90 hover:bg-emerald-600 border-emerald-500 text-white shadow-sm active:scale-95 cursor-pointer' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : `Sync ${unsyncedCount} draft(s)`}</span>
              </button>
            )}

            {/* Sync success toast indicator */}
            {showSyncSuccess && (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium rounded-xl">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Sync Complete!</span>
              </div>
            )}

            {/* Connectivity Status Badges */}
            <div className={`flex items-center space-x-1.5 px-3 py-1.5 border rounded-xl text-[11px] font-medium select-none ${
              isOnline 
                ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' 
                : 'bg-amber-950/20 border-amber-900/30 text-amber-400'
            }`}>
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main App Workspace Grid */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 flex flex-col space-y-1.5 no-print">
          {/* Profile Card */}
          <div className="bg-zinc-950/30 border border-zinc-900 rounded-2xl p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center">
                <span className="text-emerald-400 font-bold text-xs">GA</span>
              </div>
              <div>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Field Officer</p>
                <h3 className="text-xs font-semibold text-zinc-200">Gabriel Agila</h3>
                <p className="text-[9px] text-zinc-550">Bukidnon Coop #12</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('registry')}
            className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-medium border transition-all duration-150 cursor-pointer ${
              activeTab === 'registry'
                ? 'bg-emerald-950/30 border-emerald-900/30 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:bg-zinc-900/20 hover:text-zinc-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Farmer Registry</span>
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-medium border transition-all duration-150 cursor-pointer ${
              activeTab === 'test'
                ? 'bg-emerald-950/30 border-emerald-900/30 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:bg-zinc-900/20 hover:text-zinc-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Soil Test</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-medium border transition-all duration-150 cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-emerald-950/30 border-emerald-900/30 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:bg-zinc-900/20 hover:text-zinc-200'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Soil Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('advisor')}
            className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-medium border transition-all duration-150 cursor-pointer ${
              activeTab === 'advisor'
                ? 'bg-emerald-950/30 border-emerald-900/30 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:bg-zinc-900/20 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Crop Advisor</span>
          </button>

          <div className="pt-2 border-t border-zinc-900 mt-2">
            <button
                onClick={onExit}
                className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-medium border border-emerald-900/30 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-800/30 hover:text-emerald-200 transition cursor-pointer backdrop-blur-xl"
              >
                <Home className="w-4 h-4" />
                <span>Exit to Homepage</span>
              </button>
          </div>

          {/* Database Widget */}
          <div className="mt-auto pt-8 hidden md:block">
            <div className="bg-zinc-950/20 border border-zinc-900/60 rounded-2xl p-4 text-[10px] text-zinc-500 space-y-1.5 leading-relaxed">
              <div className="flex items-center space-x-1.5 font-bold text-zinc-400 uppercase tracking-wider text-[9px]">
                <Database className="w-3.5 h-3.5 text-emerald-500/60" />
                <span>Dexie Client Storage</span>
              </div>
              <p>Database logs operate fully client-side and sync when network cellular signals are available.</p>
            </div>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 bg-zinc-950/10 border border-zinc-900 rounded-3xl p-6 sm:p-8">
          {children}
        </main>
      </div>

      {/* Footer bar */}
      <footer className="bg-zinc-950/45 border-t border-zinc-900 py-4 text-center text-[10px] text-zinc-500 no-print">
        <p>© 2026 CropWise Technologies. Aligned with PH Department of Agriculture standards.</p>
      </footer>
    </div>
  );
};
