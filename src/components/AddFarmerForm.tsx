import React, { useState } from 'react';

interface IAddFarmerFormProps {
  onSubmit: (farmerData: { name: string; phone: string; barangay: string; notes?: string }) => void;
  onCancel: () => void;
}

/**
 * Reusable AddFarmerForm component. 
 * Form inputs for registering smallholder farmers in the cooperative index.
 * 
 * @param props Props containing submit and cancel handlers.
 */
export const AddFarmerForm: React.FC<IAddFarmerFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [barangay, setBarangay] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !barangay) return;
    onSubmit({
      name,
      phone,
      barangay,
      notes: notes || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 sm:p-6 space-y-4 animate-fadeIn">
      <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">New Farmer Registration</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Farmer Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Full Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Juan dela Cruz"
            className="w-full bg-slate-950 border border-white/5 focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
          />
        </div>

        {/* Farmer Mobile */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Mobile Phone *</label>
          <input
            type="text"
            required
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="0917-XXX-XXXX"
            className="w-full bg-slate-950 border border-white/5 focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
          />
        </div>

        {/* Barangay Location */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Barangay Location *</label>
          <input
            type="text"
            required
            value={barangay}
            onChange={e => setBarangay(e.target.value)}
            placeholder="e.g. Sumpong"
            className="w-full bg-slate-950 border border-white/5 focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
          />
        </div>
      </div>

      {/* Optional Notes */}
      <div className="space-y-1.5">
        <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Internal Field Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="E.g., Farms corn split crop with rice. Soil has historic nitrogen deficiencies."
          rows={2}
          className="w-full bg-slate-950 border border-white/5 focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all resize-none"
        />
      </div>

      {/* Button controls */}
      <div className="flex items-center justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="bg-slate-800 hover:bg-slate-700 text-slate-350 font-semibold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-md shadow-emerald-950/20"
        >
          Save Farmer
        </button>
      </div>
    </form>
  );
};
