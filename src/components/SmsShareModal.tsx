import React, { useState } from 'react';
import { Share2, CheckCircle, Copy, X } from 'lucide-react';

interface ISmsShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  smsText: string;
}

/**
 * Reusable SmsShareModal component.
 * Displays a modal dialog with generated SMS text and copy utilities.
 * 
 * @param props Props containing isOpen, onClose, and the pre-generated smsText.
 */
export const SmsShareModal: React.FC<ISmsShareModalProps> = ({
  isOpen,
  onClose,
  smsText,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  /**
   * Copies the SMS text to the system clipboard and displays a visual confirmation.
   */
  const copyToClipboard = () => {
    navigator.clipboard.writeText(smsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print transition-all duration-300">
      <div className="bg-slate-900 border border-white/5 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-950/20">
          <h3 className="font-bold text-xs text-slate-100 uppercase tracking-wider flex items-center">
            <Share2 className="w-4 h-4 text-emerald-500 mr-2 animate-pulse" /> Share SMS Summary
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-all duration-200 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-6 space-y-4">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Copy this formatted text to paste directly into SMS, Messenger, or WhatsApp to share with the farmer:
          </p>
          <textarea
            readOnly
            value={smsText}
            rows={10}
            className="w-full bg-slate-950 border border-white/5 focus:border-emerald-500/30 rounded-2xl p-4 text-xs text-slate-300 font-mono outline-none resize-none leading-relaxed transition-colors duration-200"
          />
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-slate-950/40 border-t border-white/5 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer shadow-md active:scale-95"
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
