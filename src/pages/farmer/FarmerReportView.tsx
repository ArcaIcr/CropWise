import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { FarmerLayout } from '../../components/farmer/FarmerLayout';
import { useFarmerData } from '../../hooks/useFarmerData';
import { ReportCertificate } from '../../components/ReportCertificate';
import { FileText, ChevronRight, ArrowLeft } from 'lucide-react';

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
      'Ang asido ng lupa ay sapat. Panatilihin ang kasalukuyang paglalagay ng organikong materyal upang mapatahkim ang pH.',
    'Apply 120 kg N/ha. Split application: 50% as basal during planting (Complete 14-14-14) and 50% as sidedress at 30 days after planting using Urea.':
      'Maglagay ng 120 kg N/ektarya. Hatiin ang paglalagay: 50% bilang basal habang nagtatanim (Complete 14-14-14) at 50% bilang sidedress 30 araw pagkatapos itanim gamit ang Urea.',
    'Apply 80 kg N/ha. Apply 40% basal and 60% sidedress during the active vegetative stage (V6-V8).':
      'Maglagay ng 80 kg N/ektarya. Ilagay ang 40% basal at 60% sidedress sa panahon ng paglaki ng halaman (V6-V8 stage).',
    'Apply 60 kg P2O5/ha as basal. Phosphorus is critical for early root development and seedling establishment.':
      'Maglagay ng 60 kg P2O5/ektarya bilang basal. Mahalaga ang Phosphorus para sa paglaki ng ugat at pagpapatibay ng halaman.',
    'Apply 60 kg K2O/ha. Apply 50% basal and 50% side-dress before tasseling. Potassium enhances drought tolerance and stalk strength.':
      'Maglagay ng 60 kg K2O/ektarya. Ilagay ang 50% basal ug 50% sidedress bago sumibol. Ang Potassium ay nagpapalakas ng halaman laban sa tuyot.',
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

export const FarmerReportView: React.FC = () => {
  const { reportId } = useParams<{ reportId?: string }>();
  const navigate = useNavigate();
  const { plots, loading } = useFarmerData();
  const [lang, setLang] = useState<'en' | 'tl' | 'ceb'>('en');

  // Load referenced plot, farmer, and reading for selected report
  const selectedReportDetails = useLiveQuery(
    async () => {
      if (!reportId) return null;
      
      const report = await db.fertilizerReports.get(reportId);
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
    [reportId]
  );

  const translate = (text: string): string => {
    if (lang === 'en') return text;
    return translations[lang]?.[text] || text;
  };

  if (loading) {
    return (
      <FarmerLayout title="My Reports">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </FarmerLayout>
    );
  }

  // Render detail view if reportId is active
  if (reportId) {
    if (!selectedReportDetails) {
      return (
        <FarmerLayout title="Soil Report Details">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-zinc-300 dark:text-zinc-650 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Report Not Found</h3>
            <button 
              onClick={() => navigate('/farmer/reports')}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Reports List</span>
            </button>
          </div>
        </FarmerLayout>
      );
    }

    return (
      <FarmerLayout title="Soil Report Details">
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-2xl">
            <button 
              onClick={() => navigate('/farmer/reports')}
              className="flex items-center space-x-1.5 text-zinc-500 hover:text-zinc-350 text-xs font-semibold cursor-pointer py-1.5 px-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <ArrowLeft className="w-4 h-4 animate-pulse" />
              <span>Back</span>
            </button>

            <div className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-0.5 rounded-xl text-[10px]">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition cursor-pointer min-h-[36px] ${
                  lang === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('tl')}
                className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition cursor-pointer min-h-[36px] ${
                  lang === 'tl' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Tagalog
              </button>
              <button
                onClick={() => setLang('ceb')}
                className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition cursor-pointer min-h-[36px] ${
                  lang === 'ceb' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Cebuano
              </button>
            </div>
          </div>

          <ReportCertificate
            report={selectedReportDetails.report}
            farmer={selectedReportDetails.farmer}
            plot={selectedReportDetails.plot}
            reading={selectedReportDetails.reading}
            coop={selectedReportDetails.coop}
            user={selectedReportDetails.user}
            translate={translate}
          />
        </div>
      </FarmerLayout>
    );
  }

  // Otherwise render lists
  const allReports = plots.flatMap(plot => 
    plot.latestReport ? [{ ...plot.latestReport, plotName: plot.plotName, crop: plot.crop }] : []
  ).sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());

  return (
    <FarmerLayout title="My Reports">
      {allReports.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-zinc-300 dark:text-zinc-650 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">No Reports Yet</h3>
          <p className="text-zinc-500 dark:text-zinc-400">Your field officer will generate reports after soil testing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allReports.map((report) => (
            <button 
              key={report.id} 
              onClick={() => navigate(`/farmer/reports/${report.id}`)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">{report.plotName}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {report.crop} • {new Date(report.generatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full">
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