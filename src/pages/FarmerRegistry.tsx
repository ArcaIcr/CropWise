import React, { useState } from 'react';
import { db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { UserPlus, Plus, Landmark, Calendar, MapPin, Phone, Search, Info, Users } from 'lucide-react';
import type { IFarmer, IPlot } from '../types/database';
import { AddFarmerForm } from '../components/AddFarmerForm';
import { AddPlotForm } from '../components/AddPlotForm';

/**
 * FarmerRegistry Page component. Provides searchable farmer registry details, 
 * adding new farmers, viewing plots per farmer, and adding plots.
 * Polished with a premium glassmorphic dark agricultural theme.
 */
export const FarmerRegistry: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);

  // Form toggle states
  const [showAddFarmer, setShowAddFarmer] = useState<boolean>(false);
  const [showAddPlot, setShowAddPlot] = useState<boolean>(false);

  // Query farmers from DB
  const farmers = useLiveQuery(
    async () => {
      const allFarmers = await db.farmers.toArray();
      return allFarmers.filter(f => !f.isDeleted);
    },
    []
  );

  // Query plots for the selected farmer
  const plots = useLiveQuery(
    async () => {
      if (!selectedFarmerId) return [];
      const allPlots = await db.plots.where('farmerId').equals(selectedFarmerId).toArray();
      return allPlots.filter(p => !p.isDeleted);
    },
    [selectedFarmerId]
  ) || [];

  // Filter farmers by search term
  const filteredFarmers = farmers?.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.barangay.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  /**
   * Submits the farmer registration form.
   */
  const handleFarmerSubmit = async (farmerData: { name: string; phone: string; barangay: string; notes?: string }) => {
    try {
      const newFarmer: IFarmer = {
        id: crypto.randomUUID(),
        cooperativeId: 'coop-default-uuid',
        name: farmerData.name,
        phone: farmerData.phone,
        barangay: farmerData.barangay,
        notes: farmerData.notes,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isDeleted: false
      };

      await db.farmers.add(newFarmer);
      setShowAddFarmer(false);
      setSelectedFarmerId(newFarmer.id);
    } catch (err) {
      console.error('Failed to add farmer:', err);
    }
  };

  /**
   * Submits the plot registration form.
   */
  const handlePlotSubmit = async (plotData: {
    plotName: string;
    crop: string;
    areaHectares: number;
    locationText?: string;
    plantingDate: string;
    cropStage: string;
  }) => {
    if (!selectedFarmerId) return;
    try {
      const newPlot: IPlot = {
        id: crypto.randomUUID(),
        farmerId: selectedFarmerId,
        cooperativeId: 'coop-default-uuid',
        plotName: plotData.plotName,
        crop: plotData.crop,
        areaHectares: plotData.areaHectares,
        locationText: plotData.locationText,
        plantingDate: plotData.plantingDate,
        cropStage: plotData.cropStage,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isDeleted: false
      };

      await db.plots.add(newPlot);
      setShowAddPlot(false);
    } catch (err) {
      console.error('Failed to add plot:', err);
    }
  };

  const selectedFarmer = farmers?.find(f => f.id === selectedFarmerId);

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
        <div>
          <h2 className="text-base font-bold text-white m-0">Farmer & Plot Registry</h2>
          <p className="text-zinc-400 text-xs mt-1">Manage local smallholders and configure their cultivated plots.</p>
        </div>
        <button
          onClick={() => setShowAddFarmer(!showAddFarmer)}
          className="flex items-center space-x-2 bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register Farmer</span>
        </button>
      </div>

      {/* Register Farmer Form Section */}
      {showAddFarmer && (
        <AddFarmerForm
          onSubmit={handleFarmerSubmit}
          onCancel={() => setShowAddFarmer(false)}
        />
      )}

      {/* Grid view split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left List Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search farmer or location..."
              className="w-full bg-zinc-950/25 border border-zinc-900 focus:border-emerald-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-550 outline-none transition-all"
            />
          </div>

          <div className="bg-zinc-950/20 border border-zinc-900 rounded-2xl overflow-hidden max-h-[440px] overflow-y-auto divide-y divide-zinc-900/60">
            {filteredFarmers.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs space-y-2">
                <Search className="w-7 h-7 text-zinc-700 mx-auto" />
                <p>No farmers found.</p>
              </div>
            ) : (
              filteredFarmers.map(farmer => (
                <div
                  key={farmer.id}
                  onClick={() => {
                    setSelectedFarmerId(farmer.id);
                    setShowAddPlot(false);
                  }}
                  className={`p-4 transition duration-150 cursor-pointer flex flex-col space-y-1.5 ${
                    selectedFarmerId === farmer.id
                      ? 'bg-emerald-950/15 border-l-2 border-emerald-500 text-emerald-450'
                      : 'hover:bg-zinc-900/20 text-zinc-300'
                  }`}
                >
                  <h4 className="font-semibold text-xs">{farmer.name}</h4>
                  <div className="flex items-center space-x-3 text-[10px] text-zinc-500">
                    <span className="flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{farmer.phone}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>Brgy. {farmer.barangay}</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Details Column */}
        <div className="lg:col-span-2 bg-zinc-950/20 border border-zinc-900 rounded-2xl p-5 sm:p-6 min-h-[300px]">
          {selectedFarmer ? (
            <div className="space-y-6">
              
              {/* Farmer Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-4 gap-3">
                <div>
                  <h3 className="text-sm font-bold text-zinc-200">{selectedFarmer.name}</h3>
                  <div className="flex items-center space-x-4 text-[10px] text-zinc-500 mt-1">
                    <span>Phone: {selectedFarmer.phone}</span>
                    <span>•</span>
                    <span>Barangay: {selectedFarmer.barangay}</span>
                  </div>
                  {selectedFarmer.notes && (
                    <div className="mt-3 flex items-start space-x-2 text-[10px] text-zinc-400 bg-zinc-950/30 border border-zinc-900 p-2.5 rounded-xl">
                      <Info className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{selectedFarmer.notes}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowAddPlot(!showAddPlot)}
                  className="flex items-center space-x-1.5 bg-emerald-950/40 border border-emerald-900/30 text-emerald-450 hover:bg-emerald-600/20 font-semibold text-[11px] px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Farm Plot</span>
                </button>
              </div>

              {/* Add Plot Form overlay */}
              {showAddPlot && (
                <AddPlotForm
                  onSubmit={handlePlotSubmit}
                  onCancel={() => setShowAddPlot(false)}
                />
              )}

              {/* Plots List */}
              <div className="space-y-4">
                <h4 className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Registered Farm Plots</h4>
                {plots.length === 0 ? (
                  <div className="p-8 border border-dashed border-zinc-900 rounded-2xl text-center text-zinc-550 text-xs">
                    <Landmark className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                    <p>No farm plots configured for this farmer yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plots.map(plot => (
                      <div key={plot.id} className="bg-zinc-950/30 border border-zinc-900 p-4.5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-zinc-850 transition duration-150">
                        <div>
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-xs text-zinc-200">{plot.plotName}</h5>
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                              plot.crop === 'Corn' 
                                ? 'bg-amber-950/20 border border-amber-900/30 text-amber-400' 
                                : 'bg-sky-950/20 border border-sky-900/30 text-sky-455'
                            }`}>
                              {plot.crop}
                            </span>
                          </div>
                          <div className="space-y-2 mt-3">
                            <div className="flex items-center text-[10px] text-zinc-400">
                              <Landmark className="w-3.5 h-3.5 text-zinc-500 mr-2 shrink-0" />
                              <span>{plot.areaHectares} Hectare(s)</span>
                            </div>
                            <div className="flex items-center text-[10px] text-zinc-400">
                              <Calendar className="w-3.5 h-3.5 text-zinc-500 mr-2 shrink-0" />
                              <span>Planted: {plot.plantingDate}</span>
                            </div>
                            <div className="flex items-center text-[10px] text-zinc-400">
                              <MapPin className="w-3.5 h-3.5 text-zinc-500 mr-2 shrink-0" />
                              <span className="truncate">{plot.locationText || 'No location coordinates'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="pt-2.5 border-t border-zinc-900 flex items-center justify-between text-[10px]">
                          <span className="text-zinc-500 font-semibold">Stage: <span className="text-zinc-300 font-bold">{plot.cropStage}</span></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-550 text-xs py-16 space-y-3">
              <Users className="w-10 h-10 text-zinc-700" />
              <div className="text-center">
                <p className="font-bold text-zinc-500 uppercase tracking-wider text-[9px]">No Farmer Selected</p>
                <p className="text-[11px] mt-1 text-zinc-600">Select a farmer from the sidebar registry to inspect details or register farm plots.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
