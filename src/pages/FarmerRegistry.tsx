import React, { useState } from 'react';
import { db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { UserPlus, Plus, Landmark, Calendar, MapPin, Phone, Search, Info, Users } from 'lucide-react';
import type { IFarmer, IPlot } from '../types/database';

/**
 * FarmerRegistry Page component. Provides searchable farmer registry details, 
 * adding new farmers, viewing plots per farmer, and adding plots.
 * Polished with a premium glassmorphic dark agricultural theme.
 */
export const FarmerRegistry: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);

  // Form states for adding farmer
  const [showAddFarmer, setShowAddFarmer] = useState<boolean>(false);
  const [farmerName, setFarmerName] = useState<string>('');
  const [farmerPhone, setFarmerPhone] = useState<string>('');
  const [farmerBarangay, setFarmerBarangay] = useState<string>('');
  const [farmerNotes, setFarmerNotes] = useState<string>('');

  // Form states for adding plot
  const [showAddPlot, setShowAddPlot] = useState<boolean>(false);
  const [plotName, setPlotName] = useState<string>('');
  const [plotCrop, setPlotCrop] = useState<string>('Corn');
  const [plotArea, setPlotArea] = useState<number>(1.0);
  const [plotLocation, setPlotLocation] = useState<string>('');
  const [plotPlantingDate, setPlotPlantingDate] = useState<string>('');
  const [plotStage, setPlotStage] = useState<string>('Basal');

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
  const handleAddFarmer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName || !farmerPhone || !farmerBarangay) return;

    try {
      const newFarmer: IFarmer = {
        id: crypto.randomUUID(),
        cooperativeId: 'coop-default-uuid',
        name: farmerName,
        phone: farmerPhone,
        barangay: farmerBarangay,
        notes: farmerNotes || undefined,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isDeleted: false
      };

      await db.farmers.add(newFarmer);
      
      // Reset form
      setFarmerName('');
      setFarmerPhone('');
      setFarmerBarangay('');
      setFarmerNotes('');
      setShowAddFarmer(false);
      setSelectedFarmerId(newFarmer.id);
    } catch (err) {
      console.error('Failed to add farmer:', err);
    }
  };

  /**
   * Submits the plot registration form.
   */
  const handleAddPlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmerId || !plotName || !plotPlantingDate) return;

    try {
      const newPlot: IPlot = {
        id: crypto.randomUUID(),
        farmerId: selectedFarmerId,
        cooperativeId: 'coop-default-uuid',
        plotName,
        crop: plotCrop,
        areaHectares: Number(plotArea),
        locationText: plotLocation || undefined,
        plantingDate: plotPlantingDate,
        cropStage: plotStage,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isDeleted: false
      };

      await db.plots.add(newPlot);

      // Reset form
      setPlotName('');
      setPlotLocation('');
      setPlotPlantingDate('');
      setPlotStage('Basal');
      setPlotArea(1.0);
      setShowAddPlot(false);
    } catch (err) {
      console.error('Failed to add plot:', err);
    }
  };

  const selectedFarmer = farmers?.find(f => f.id === selectedFarmerId);

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 m-0">Farmer & Plot Registry</h2>
          <p className="text-slate-400 text-xs mt-1">Manage local smallholders and configure their cultivated plots.</p>
        </div>
        <button
          onClick={() => setShowAddFarmer(!showAddFarmer)}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-950/20 active:scale-95 cursor-pointer hover:scale-[1.02]"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register Farmer</span>
        </button>
      </div>

      {/* Register Farmer Form Section */}
      {showAddFarmer && (
        <form onSubmit={handleAddFarmer} className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 sm:p-6 space-y-4 animate-fadeIn">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">New Farmer Registration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Full Name *</label>
              <input
                type="text"
                required
                value={farmerName}
                onChange={e => setFarmerName(e.target.value)}
                placeholder="Juan dela Cruz"
                className="w-full bg-slate-950 border border-white/5 focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Mobile Phone *</label>
              <input
                type="text"
                required
                value={farmerPhone}
                onChange={e => setFarmerPhone(e.target.value)}
                placeholder="0917-XXX-XXXX"
                className="w-full bg-slate-950 border border-white/5 focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Barangay Location *</label>
              <input
                type="text"
                required
                value={farmerBarangay}
                onChange={e => setFarmerBarangay(e.target.value)}
                placeholder="e.g. Sumpong"
                className="w-full bg-slate-950 border border-white/5 focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Internal Field Notes</label>
            <textarea
              value={farmerNotes}
              onChange={e => setFarmerNotes(e.target.value)}
              placeholder="E.g., Farms corn split crop with rice. Soil has historic nitrogen deficiencies."
              rows={2}
              className="w-full bg-slate-950 border border-white/5 focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all resize-none"
            />
          </div>
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowAddFarmer(false)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-350 font-semibold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-md"
            >
              Save Farmer
            </button>
          </div>
        </form>
      )}

      {/* Grid view split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left List Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search farmer or location..."
              className="w-full bg-slate-900/50 border border-white/5 focus:border-emerald-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-550 outline-none transition-all"
            />
          </div>

          <div className="bg-slate-950/20 border border-white/5 rounded-2xl overflow-hidden max-h-[440px] overflow-y-auto divide-y divide-white/5">
            {filteredFarmers.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs space-y-2">
                <Search className="w-7 h-7 text-slate-700 mx-auto" />
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
                      ? 'bg-emerald-600/10 border-l-4 border-emerald-500'
                      : 'hover:bg-slate-800/15'
                  }`}
                >
                  <h4 className="font-semibold text-xs text-slate-200">{farmer.name}</h4>
                  <div className="flex items-center space-x-3 text-[10px] text-slate-450">
                    <span className="flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-slate-650" />
                      <span>{farmer.phone}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-650" />
                      <span>Brgy. {farmer.barangay}</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Details Column */}
        <div className="lg:col-span-2 bg-slate-900/25 border border-white/5 rounded-2xl p-5 sm:p-6 min-h-[300px]">
          {selectedFarmer ? (
            <div className="space-y-6">
              
              {/* Farmer Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-200">{selectedFarmer.name}</h3>
                  <div className="flex items-center space-x-4 text-[10px] text-slate-450 mt-1">
                    <span>Phone: {selectedFarmer.phone}</span>
                    <span>•</span>
                    <span>Barangay: {selectedFarmer.barangay}</span>
                  </div>
                  {selectedFarmer.notes && (
                    <div className="mt-3 flex items-start space-x-2 text-[10px] text-slate-400 bg-slate-900/40 border border-white/5 p-2.5 rounded-xl">
                      <Info className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{selectedFarmer.notes}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowAddPlot(!showAddPlot)}
                  className="flex items-center space-x-1.5 bg-emerald-600/10 border border-emerald-500/25 text-emerald-450 hover:bg-emerald-600 hover:text-white font-semibold text-[11px] px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 hover:scale-[1.01]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Farm Plot</span>
                </button>
              </div>

              {/* Add Plot Form overlay */}
              {showAddPlot && (
                <form onSubmit={handleAddPlot} className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 space-y-4 animate-fadeIn">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Add Farm Plot</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Plot Name / Reference *</label>
                      <input
                        type="text"
                        required
                        value={plotName}
                        onChange={e => setPlotName(e.target.value)}
                        placeholder="e.g. North Hillside"
                        className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Cultivated Crop *</label>
                      <select
                        value={plotCrop}
                        onChange={e => setPlotCrop(e.target.value)}
                        className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none transition-all"
                      >
                        <option value="Corn">Corn (White/Yellow)</option>
                        <option value="Rice">Rice (Lowland)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Size (Hectares) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        min="0.05"
                        value={plotArea}
                        onChange={e => setPlotArea(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Planting Date *</label>
                      <input
                        type="date"
                        required
                        value={plotPlantingDate}
                        onChange={e => setPlotPlantingDate(e.target.value)}
                        className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Location Reference</label>
                      <input
                        type="text"
                        value={plotLocation}
                        onChange={e => setPlotLocation(e.target.value)}
                        placeholder="Near the municipal boundary marker"
                        className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Current Stage</label>
                      <select
                        value={plotStage}
                        onChange={e => setPlotStage(e.target.value)}
                        className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none transition-all"
                      >
                        <option value="Basal">Land Preparation / Basal Stage</option>
                        <option value="Early Vegetative">Early Vegetative (V1-V5 / Early Tillering)</option>
                        <option value="Vegetative">Active Vegetative (V6-V10 / Active Tillering)</option>
                        <option value="Reproductive">Reproductive (Tasseling / Panicle Initiation)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddPlot(false)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-350 font-semibold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-md"
                    >
                      Save Plot
                    </button>
                  </div>
                </form>
              )}

              {/* Plots List */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Registered Farm Plots</h4>
                {plots.length === 0 ? (
                  <div className="p-8 border border-dashed border-white/5 rounded-2xl text-center text-slate-550 text-xs">
                    <Landmark className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                    <p>No farm plots configured for this farmer yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plots.map(plot => (
                      <div key={plot.id} className="bg-slate-950/45 border border-white/5 p-4.5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-800 transition duration-150">
                        <div>
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-xs text-slate-200">{plot.plotName}</h5>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              plot.crop === 'Corn' 
                                ? 'bg-amber-600/15 border border-amber-500/20 text-amber-400' 
                                : 'bg-blue-600/15 border border-blue-500/20 text-blue-405'
                            }`}>
                              {plot.crop}
                            </span>
                          </div>
                          <div className="space-y-2 mt-3">
                            <div className="flex items-center text-[10px] text-slate-450">
                              <Landmark className="w-3.5 h-3.5 text-slate-600 mr-2 shrink-0" />
                              <span>{plot.areaHectares} Hectare(s)</span>
                            </div>
                            <div className="flex items-center text-[10px] text-slate-450">
                              <Calendar className="w-3.5 h-3.5 text-slate-600 mr-2 shrink-0" />
                              <span>Planted: {plot.plantingDate}</span>
                            </div>
                            <div className="flex items-center text-[10px] text-slate-450">
                              <MapPin className="w-3.5 h-3.5 text-slate-600 mr-2 shrink-0" />
                              <span className="truncate">{plot.locationText || 'No location coordinates'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px]">
                          <span className="text-slate-450 font-semibold">Stage: <span className="text-slate-200 font-bold">{plot.cropStage}</span></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-16 space-y-3">
              <Users className="w-10 h-10 text-slate-700" />
              <div className="text-center">
                <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">No Farmer Selected</p>
                <p className="text-[11px] mt-1 text-slate-600">Select a farmer from the sidebar registry to inspect details or register farm plots.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
