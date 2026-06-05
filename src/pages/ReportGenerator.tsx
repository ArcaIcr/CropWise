import React, { useState } from 'react';
import { db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  Printer, 
  Share2, 
  Globe, 
  FileText
} from 'lucide-react';
import type { IRecommendationResult } from '../services/recommendations';
import { ReportCertificate } from '../components/ReportCertificate';
import { SmsShareModal } from '../components/SmsShareModal';

// Multilingual translations database for seeding local languages offline
const translations: Record<string, Record<string, string>> = {
  tl: {
    // Interpretations
    'Highly Acidic Soil': 'Napaka-asim na Lupa',
    'Optimal Soil pH': 'Sapat na pH ng Lupa',
    'Optimal pH for Lowland Rice': 'Sapat na pH para sa Palayan',
    'Severe Nitrogen Deficiency': 'Malalang Kakulangan sa Nitrogen',
    'Moderate Nitrogen Level': 'Katamtamang Antas ng Nitrogen',
    'Phosphorus Deficient': 'Kulang sa Phosphorus',
    'Potassium Deficient': 'Kulang sa Potassium',
    // Recommendations
    'Apply agricultural lime (carbonate) at 2 to 3 tons per hectare. Work lime thoroughly into the top 15cm of soil at least 4 weeks before planting.':
      'Maglagay ng agricultural lime (apog) na 2 hanggang 3 tonelada bawat ektarya. Ihalo ito nang mabuti sa itaas na 15cm ng lupa, 4 na linggo bago magtanim.',
    'Soil acidity is optimal. Maintain current organic matter practices to stabilize pH.':
      'Ang asido ng lupa ay sapat. Panatilihin ang kasalukuyang paglalagay ng organikong materyal upang mapanatili ang pH.',
    'Apply 120 kg N/ha. Split application: 50% as basal during planting (Complete 14-14-14) and 50% as sidedress at 30 days after planting using Urea.':
      'Maglagay ng 120 kg N/ektarya. Hatiin ang paglalagay: 50% bilang basal habang nagtatanim (Complete 14-14-14) at 50% bilang sidedress 30 araw pagkatapos itanim gamit ang Urea.',
    'Apply 80 kg N/ha. Apply 40% basal and 60% sidedress during the active vegetative stage (V6-V8).':
      'Maglagay ng 80 kg N/ektarya. Ilagay ang 40% basal at 60% sidedress sa panahon ng paglaki ng halaman (V6-V8 stage).',
    'Apply 60 kg P2O5/ha as basal. Phosphorus is critical for early root development and seedling establishment.':
      'Maglagay ng 60 kg P2O5/ektarya bilang basal. Mahalaga ang Phosphorus para sa paglaki ng ugat at pagpapatibay ng halaman.',
    'Apply 60 kg K2O/ha. Apply 50% basal and 50% side-dress before tasseling. Potassium enhances drought tolerance and stalk strength.':
      'Maglagay ng 60 kg K2O/ektarya. Ilagay ang 50% basal at 50% sidedress bago sumibol. Ang Potassium ay nagpapalakas ng halaman laban sa tuyot.',
    'Apply agricultural lime at 1.5 to 2 tons per hectare during land preparation to increase nutrient availability.':
      'Maglagay ng agricultural lime (apog) na 1.5 hanggang 2 tonelada bawat ektarya habang naghahanda ng lupa upang mapataas ang sustansya nito.',
    'No lime required. Maintain flooding cycle to naturalize pH levels.':
      'Hindi kailangan ng apog. Panatilihin ang tamang pagbaha sa palayan upang kusa itong maging neutral.',
    'Apply 90 kg N/ha. Apply in three splits: basal, active tillering (21-25 DAT), and panicle initiation stage.':
      'Maglagay ng 90 kg N/ektarya sa tatlong hati: basal, panahon ng pagsibol ng mga bagong usbong (21-25 DAT), at bago mamulaklak.',
    'Apply 60 kg N/ha. Split application: 50% basal and 50% at panicle initiation.':
      'Maglagay ng 60 kg N/ektarya. Hatiin sa dalawang split: 50% basal at 50% bago sumibol ang bulaklak.',
    'Apply 40 kg P2O5/ha as basal complete (14-14-14) or Solophos. Essential for early root growth and tillering.':
      'Maglagay ng 40 kg P2O5/ektarya bilang basal na Complete (14-14-14) o Solophos. Kailangan ito para sa maagang pag-ugat at pagsibol.',
    'Apply 40 kg K2O/ha. Apply 50% basal and 50% at panicle initiation to prevent grain shattering and increase resistance to pests.':
      'Maglagay ng 40 kg K2O/ektarya. Maglagay ng 50% basal at 50% bago sumibol upang maiwasan ang pagkalagas ng butil at mapataas ang proteksyon laban sa peste.'
  },
  ceb: {
    // Interpretations
    'Highly Acidic Soil': 'Asido kaayo ang Yuta',
    'Optimal Soil pH': 'Husto ang pH sa Yuta',
    'Optimal pH for Lowland Rice': 'Husto ang pH sa Humayan',
    'Severe Nitrogen Deficiency': 'Kulang kaayo sa Nitrogen',
    'Moderate Nitrogen Level': 'Husto-husto nga Nitrogen',
    'Phosphorus Deficient': 'Kulang sa Phosphorus',
    'Potassium Deficient': 'Kulang sa Potassium',
    // Recommendations
    'Apply agricultural lime (carbonate) at 2 to 3 tons per hectare. Work lime thoroughly into the top 15cm of soil at least 4 weeks before planting.':
      'Butangi og agricultural lime (apog) nga 2 hangtod 3 ka tonelada matag ektarya. Isagol og maayo sa ibabaw nga 15cm sa yuta labing menos 4 ka semana sa dili pa magtanum.',
    'Soil acidity is optimal. Maintain current organic matter practices to stabilize pH.':
      'Husto ang acidity sa yuta. Ipadayon ang pagbutang og organic matter aron ma-stabilize ang pH.',
    'Apply 120 kg N/ha. Split application: 50% as basal during planting (Complete 14-14-14) and 50% as sidedress at 30 days after planting using Urea.':
      'Magbutang og 120 kg N/ektarya. Bahina ang pagbutang: 50% basal samtang nagtanom (Complete 14-14-14) ug 50% sidedress 30 ka adlaw human makatanom gamit ang Urea.',
    'Apply 80 kg N/ha. Apply 40% basal and 60% sidedress during the active vegetative stage (V6-V8).':
      'Magbutang og 80 kg N/ektarya. Ibutang ang 40% basal ug 60% sidedress sa panahon sa vegetative stage (V6-V8).',
    'Apply 60 kg P2O5/ha as basal. Phosphorus is critical for early root development and seedling establishment.':
      'Magbutang og 60 kg P2O5/ektarya isip basal. Importante ang Phosphorus para sa pagpatubo sa mga gamot sa tanom.',
    'Apply 60 kg K2O/ha. Apply 50% basal and 50% side-dress before tasseling. Potassium enhances drought tolerance and stalk strength.':
      'Magbutang og 60 kg K2O/ektarya. Ibutang ang 50% basal ug 50% sidedress sa dili pa mamulak. Ang Potassium nagpalig-on sa stalk batok sa hulaw.',
    'Apply agricultural lime at 1.5 to 2 tons per hectare during land preparation to increase nutrient availability.':
      'Butangi og agricultural lime (apog) nga 1.5 hangtod 2 ka tonelada matag ektarya samtang nag-andam sa yuta aron mas mosuhop ang sustansya.',
    'No lime required. Maintain flooding cycle to naturalize pH levels.':
      'Dili na kinahanglan og apog. Ipadayon ang pagbaha sa humayan aron ma-neutralize ang pH sa yuta.',
    'Apply 90 kg N/ha. Apply in three splits: basal, active tillering (21-25 DAT), and panicle initiation stage.':
      'Magbutang og 90 kg N/ektarya nga bahinon sa tulo: basal, panahon sa tillering (21-25 DAT), ug sa dili pa mamulak.',
    'Apply 60 kg N/ha. Split application: 50% basal and 50% at panicle initiation.':
      'Magbutang og 60 kg N/ektarya. Bahinon sa duha: 50% basal ug 50% sa dili pa mamulak.',
    'Apply 40 kg P2O5/ha as basal complete (14-14-14) or Solophos. Essential for early root growth and tillering.':
      'Magbutang og 40 kg P2O5/ektarya isip basal Complete (14-14-14) o Solophos. Importante kini para sa sayo nga pag-ugat ug pagpanaha.',
    'Apply 40 kg K2O/ha. Apply 50% basal and 50% at panicle initiation to prevent grain shattering and increase resistance to pests.':
      'Magbutang og 40 kg K2O/ektarya. Ibutang ang 50% basal ug 50% sa dili pa mamulak aron malikayan ang pagkatagak sa lugas ug maprotektahan batok sa peste.'
  }
};

interface IReportGeneratorProps {
  selectedReportId: string | null;
  setSelectedReportId: (id: string | null) => void;
}

/**
 * ReportGenerator Component. Displays history list of generated reports,
 * detailed diagnostic results, language translations, and sharing configurations.
 * Polished with a premium glassmorphic dark agricultural theme.
 * 
 * @param props Props containing the selected report identifiers.
 */
export const ReportGenerator: React.FC<IReportGeneratorProps> = ({ 
  selectedReportId, 
  setSelectedReportId 
}) => {
  const [lang, setLang] = useState<'en' | 'tl' | 'ceb'>('en');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  // Load all fertilizer reports
  const reports = useLiveQuery(
    async () => {
      const allReports = await db.fertilizerReports.toArray();
      return allReports.filter(r => !r.isDeleted).sort((a, b) => b.generatedAt - a.generatedAt);
    },
    []
  );

  // Load referenced plot, farmer, and reading for selected report
  const selectedReportDetails = useLiveQuery(
    async () => {
      if (!selectedReportId) return null;
      
      const report = await db.fertilizerReports.get(selectedReportId);
      if (!report) return null;

      const plot = await db.plots.get(report.plotId);
      const reading = await db.soilReadings.get(report.soilReadingId);
      
      let farmer = null;
      if (plot) {
        farmer = await db.farmers.get(plot.farmerId);
      }

      const coop = await db.cooperatives.get(report.cooperativeId);
      const user = await db.users.get(report.generatedBy);

      return { report, plot, farmer, reading, coop, user };
    },
    [selectedReportId]
  );

  /**
   * Translates a technical term or recommendation block to Tagalog or Cebuano.
   */
  const translate = (text: string): string => {
    if (lang === 'en') return text;
    return translations[lang]?.[text] || text;
  };

  /**
   * Generates a plain-text SMS summary of the recommendation details.
   */
  const getSmsText = (): string => {
    if (!selectedReportDetails) return '';
    const { report, farmer, plot } = selectedReportDetails;
    const parsedData: IRecommendationResult = JSON.parse(report.recommendationSummary);

    let text = `CROPWISE SOIL REPORT\n`;
    text += `Farmer: ${farmer?.name}\n`;
    text += `Plot: ${plot?.plotName} (${plot?.crop})\n`;
    text += `Date: ${new Date(report.generatedAt).toLocaleDateString()}\n\n`;
    text += `RECOMMENDATIONS:\n`;

    parsedData.recommendations.forEach(rec => {
      if (rec.rateKgPerHectare > 0) {
        text += `- ${rec.parameter.toUpperCase()}: ${translate(rec.interpretation)}. Apply ${rec.fertilizerType} at ${rec.rateKgPerHectare} kg/ha (Total: ${rec.totalBags} bags).\n`;
      } else {
        text += `- ${rec.parameter.toUpperCase()}: ${translate(rec.interpretation)}. (No fertilizer required)\n`;
      }
    });

    text += `\nTOTAL FERTILIZER:\n`;
    parsedData.totalFertilizers.forEach(tf => {
      text += `- ${tf.fertilizerType}: ${tf.totalBags} bags (${tf.totalKg} kg)\n`;
    });

    text += `\nShared by Coop Officer. Aligned with BSWM standards.`;
    return text;
  };


  const handlePrint = () => {
    window.print();
  };

  const selectedDetails = selectedReportDetails;

  return (
    <div className="space-y-6">
      {/* Printable CSS inject */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          aside, header, footer, button, .no-print {
            display: none !important;
          }
          main {
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
          }
          .print-card {
            border: 1px solid #ddd !important;
            background: white !important;
            color: black !important;
            border-radius: 0px !important;
            box-shadow: none !important;
          }
          .text-slate-100, .text-slate-200, .text-slate-350, .text-slate-300 {
            color: black !important;
          }
          .text-slate-450, .text-slate-400, .text-slate-500 {
            color: #555 !important;
          }
          .bg-slate-900, .bg-slate-950, .bg-slate-950/40, .bg-slate-900/40, .bg-slate-900/20, .bg-emerald-500/15 {
            background: white !important;
            border-color: #ddd !important;
          }
          .border-slate-800, .border-slate-850, .border-white/5 {
            border-color: #ddd !important;
          }
          .print-title {
            font-size: 24px !important;
            color: black !important;
          }
        }
      `}</style>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-100 m-0">Soil Diagnosis Reports</h2>
          <p className="text-slate-400 text-xs mt-1">Review, translate, and print fertilizer reports generated in the field.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: History List */}
        <div className="lg:col-span-1 space-y-4 no-print">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Report Archive</h4>
          
          <div className="bg-slate-950/20 border border-white/5 rounded-2xl overflow-hidden max-h-[440px] overflow-y-auto divide-y divide-white/5">
            {!reports || reports.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs space-y-2">
                <FileText className="w-7 h-7 text-slate-700 mx-auto" />
                <p>No reports generated yet.</p>
              </div>
            ) : (
              reports.map(rep => {
                const dateStr = new Date(rep.generatedAt).toLocaleDateString();
                
                return (
                  <div
                    key={rep.id}
                    onClick={() => {
                      setSelectedReportId(rep.id);
                      setLang('en');
                    }}
                    className={`p-4 transition cursor-pointer flex flex-col space-y-1.5 ${
                      selectedReportId === rep.id
                        ? 'bg-emerald-600/10 border-l-4 border-emerald-500'
                        : 'hover:bg-slate-800/15'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-200">
                        ID: #{rep.id.substring(0, 8).toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-500">{dateStr}</span>
                    </div>
                    <p className="text-[10px] text-slate-450">
                      Total fertilizer needed: <span className="text-slate-200 font-bold">{rep.fertilizerTotalKg} kg</span>
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Detailed View */}
        <div className="lg:col-span-2">
          {selectedDetails ? (
            <div className="space-y-6">
              
              {/* Detailed Actions Controls */}
              <div className="flex items-center justify-between bg-slate-900/50 backdrop-blur-md border border-white/5 p-3 rounded-2xl no-print">
                <div className="flex items-center space-x-1 bg-slate-950 border border-white/5 p-0.5 rounded-xl text-[10px]">
                  <button
                    onClick={() => setLang('en')}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider flex items-center space-x-1 transition cursor-pointer ${
                      lang === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>EN</span>
                  </button>
                  <button
                    onClick={() => setLang('tl')}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider flex items-center space-x-1 transition cursor-pointer ${
                      lang === 'tl' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Tagalog</span>
                  </button>
                  <button
                    onClick={() => setLang('ceb')}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider flex items-center space-x-1 transition cursor-pointer ${
                      lang === 'ceb' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Cebuano</span>
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer active:scale-95"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share SMS</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer active:scale-95 shadow-sm hover:scale-[1.01]"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Plan</span>
                  </button>
                </div>
              </div>
              <ReportCertificate
                report={selectedDetails.report}
                farmer={selectedDetails.farmer}
                plot={selectedDetails.plot}
                reading={selectedDetails.reading}
                coop={selectedDetails.coop}
                user={selectedDetails.user}
                translate={translate}
              />
            </div>
          ) : (
            <div className="bg-slate-900/10 border border-slate-800/80 rounded-3xl p-16 text-center text-slate-500 text-xs flex flex-col items-center justify-center space-y-3 min-h-[300px]">
              <FileText className="w-10 h-10 text-slate-700" />
              <div>
                <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">No Report Selected</p>
                <p className="text-[11px] mt-1 text-slate-600">Select a generated report from the history list, or log a new soil test to create one.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <SmsShareModal
        isOpen={showShareModal && !!selectedDetails}
        onClose={() => setShowShareModal(false)}
        smsText={getSmsText()}
      />
    </div>
  );
};
