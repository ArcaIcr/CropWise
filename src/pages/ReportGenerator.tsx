import React, { useState } from 'react';
import { db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  Printer, 
  Share2, 
  Globe, 
  MapPin, 
  Calendar, 
  FileText,
  User,
  TrendingDown,
  Activity,
  CheckCircle,
  Copy
} from 'lucide-react';
import type { IRecommendationResult } from '../services/recommendations';

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
  const [copied, setCopied] = useState<boolean>(false);

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getSmsText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

              {/* Main Printed Report Container */}
              <div className="bg-slate-900/25 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 print-card shadow-xl">
                {/* Header logo / coop banner */}
                <div className="flex flex-col sm:flex-row justify-between items-start border-b border-white/5 pb-5 gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 print-title flex items-center">
                      <span className="text-emerald-400 mr-2">✓</span> CropWise Diagnostic Report
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1">{selectedDetails.coop?.name || 'Northern Mindanao Farmers Association'}</p>
                    <p className="text-[9px] text-slate-550 mt-0.5">{selectedDetails.coop?.barangay}, {selectedDetails.coop?.city}, {selectedDetails.coop?.province}</p>
                  </div>
                  <div className="text-left sm:text-right text-[10px] text-slate-450 space-y-1">
                    <p>Report ID: <span className="font-mono text-slate-300 font-bold">{selectedDetails.report.id.substring(0, 13).toUpperCase()}</span></p>
                    <p>Generated: <span className="text-slate-300 font-bold">{new Date(selectedDetails.report.generatedAt).toLocaleString()}</span></p>
                    <p>Field Officer: <span className="text-slate-300 font-bold">{selectedDetails.user?.name}</span></p>
                  </div>
                </div>

                {/* Farmer and Plot details row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/40 p-4 rounded-2xl border border-white/5 print-card">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-900 rounded-lg text-slate-450 border border-white/5">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase text-slate-500 tracking-wider font-bold">Farmer</p>
                      <h4 className="text-xs font-bold text-slate-200">{selectedDetails.farmer?.name}</h4>
                      <p className="text-[10px] text-slate-450">{selectedDetails.farmer?.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-900 rounded-lg text-slate-455 border border-white/5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase text-slate-500 tracking-wider font-bold">Cultivated Plot</p>
                      <h4 className="text-xs font-bold text-slate-200">{selectedDetails.plot?.plotName}</h4>
                      <p className="text-[10px] text-slate-450">{selectedDetails.plot?.areaHectares} Hectare(s) • {selectedDetails.plot?.crop}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-900 rounded-lg text-slate-455 border border-white/5">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase text-slate-500 tracking-wider font-bold">Crop Cycle</p>
                      <h4 className="text-xs font-bold text-slate-200">Stage: {selectedDetails.plot?.cropStage}</h4>
                      <p className="text-[10px] text-slate-455">Planted: {selectedDetails.plot?.plantingDate}</p>
                    </div>
                  </div>
                </div>

                {/* Input chemistry raw values */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center">
                    <Activity className="w-3.5 h-3.5 text-emerald-500 mr-2" />
                    Soil Chemistry Status
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-950/40 border border-white/5 p-3 rounded-2xl print-card text-center">
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Soil pH</span>
                      <span className="text-base font-bold text-slate-200 mt-1 block">{selectedDetails.reading?.ph}</span>
                    </div>
                    <div className="bg-slate-950/40 border border-white/5 p-3 rounded-2xl print-card text-center">
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Nitrogen (N)</span>
                      <span className="text-base font-bold text-slate-200 mt-1 block">{selectedDetails.reading?.nitrogen} ppm</span>
                    </div>
                    <div className="bg-slate-950/40 border border-white/5 p-3 rounded-2xl print-card text-center">
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Phosphorus (P)</span>
                      <span className="text-base font-bold text-slate-200 mt-1 block">{selectedDetails.reading?.phosphorus} ppm</span>
                    </div>
                    <div className="bg-slate-950/40 border border-white/5 p-3 rounded-2xl print-card text-center">
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Potassium (K)</span>
                      <span className="text-base font-bold text-slate-200 mt-1 block">{selectedDetails.reading?.potassium} ppm</span>
                    </div>
                  </div>
                </div>

                {/* Specific Soil deficiencies and actions list */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center">
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-500 mr-2" />
                    Diagnostic Interpretations & Steps
                  </h4>
                  <div className="space-y-3">
                    {(() => {
                      const recData: IRecommendationResult = JSON.parse(selectedDetails.report.recommendationSummary);
                      return recData.recommendations.map((rec, idx) => (
                        <div key={idx} className="bg-slate-950/30 border border-white/5 p-4 rounded-2xl print-card space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
                              {rec.parameter === 'ph' ? 'Soil pH' : rec.parameter.toUpperCase()} Parameter
                            </span>
                            <span className="text-[10px] font-bold text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                              {translate(rec.interpretation)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{translate(rec.recommendationText)}</p>
                          {rec.rateKgPerHectare > 0 && (
                            <div className="flex flex-wrap gap-4 pt-1 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                              <span>Rate: <strong className="text-slate-300">{rec.rateKgPerHectare} kg/Hectare</strong></span>
                              <span>•</span>
                              <span>Total needed: <strong className="text-emerald-450">{rec.totalNeededKg} kg ({rec.totalBags} bags)</strong></span>
                              <span>•</span>
                              <span>Fertilizer Type: <strong className="text-slate-300">{rec.fertilizerType}</strong></span>
                            </div>
                          )}
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Aggregate fertilizer summary block */}
                <div className="bg-emerald-600/5 border border-emerald-500/20 rounded-2xl p-5 print-card">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-3">Total fertilizer packages required</h4>
                  <div className="divide-y divide-emerald-500/10 space-y-2.5">
                    {(() => {
                      const recData: IRecommendationResult = JSON.parse(selectedDetails.report.recommendationSummary);
                      if (recData.totalFertilizers.length === 0) {
                        return <p className="text-xs text-slate-400 pt-2">No commercial fertilizer inputs required for this plot.</p>;
                      }
                      return recData.totalFertilizers.map((tf, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs pt-2.5 first:pt-0">
                          <span className="font-semibold text-slate-300">{tf.fertilizerType}</span>
                          <span className="font-bold text-emerald-450">{tf.totalBags} Bag(s) <span className="text-[10px] text-slate-500 font-normal">({tf.totalKg} kg)</span></span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Disclaimer/Standards note */}
                <div className="border-t border-white/5 pt-4 text-[9px] text-slate-550 text-center leading-relaxed">
                  <p>Disclaimer: This recommendation is rule-based and computed based on regional parameters published by the Philippine Bureau of Soils and Water Management (DA-BSWM) and Project SARAI. Consult a licensed agriculturist if crop health anomalies persist.</p>
                </div>
              </div>
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

      {/* SMS Share Dialog Overlay */}
      {showShareModal && selectedDetails && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
          <div className="bg-slate-900 border border-white/5 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-5 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-xs text-slate-100 uppercase tracking-wider flex items-center">
                <Share2 className="w-4 h-4 text-emerald-500 mr-2" /> Share SMS Summary
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Copy this formatted text to paste directly into SMS, Messenger, or WhatsApp to share with the farmer:
              </p>
              <textarea
                readOnly
                value={getSmsText()}
                rows={10}
                className="w-full bg-slate-950 border border-white/5 focus:border-emerald-500/30 rounded-2xl p-3.5 text-xs text-slate-350 font-mono outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="p-5 bg-slate-950/40 border-t border-white/5 flex justify-end space-x-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer shadow-md active:scale-95"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
