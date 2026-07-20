import Dexie, { type Table } from 'dexie';
import type {
  ICooperative,
  IUser,
  IFarmer,
  IPlot,
  ISoilReading,
  IRecommendationRule,
  IFertilizerReport,
  IDevice,
  ISyncEvent,
} from '../types/database';

/**
 * Custom Dexie database client for CropWise.
 * Configures offline stores and handles migration schemas.
 */
export class CropWiseDatabase extends Dexie {
  cooperatives!: Table<ICooperative, string>;
  users!: Table<IUser, string>;
  farmers!: Table<IFarmer, string>;
  plots!: Table<IPlot, string>;
  soilReadings!: Table<ISoilReading, string>;
  recommendationRules!: Table<IRecommendationRule, string>;
  fertilizerReports!: Table<IFertilizerReport, string>;
  devices!: Table<IDevice, string>;
  syncEvents!: Table<ISyncEvent, string>;

  constructor() {
    super('CropWiseDatabase');
    this.version(1).stores({
      cooperatives: 'id, name, region, isDeleted',
      users: 'id, cooperativeId, email, role, isDeleted',
      farmers: 'id, cooperativeId, name, phone, isDeleted',
      plots: 'id, farmerId, cooperativeId, crop, isDeleted',
      soilReadings: 'id, plotId, cooperativeId, source, isDeleted',
      recommendationRules: 'id, crop, region, parameter, isDeleted',
      fertilizerReports: 'id, plotId, soilReadingId, cooperativeId, isDeleted',
      devices: 'id, cooperativeId, deviceSerial, isDeleted',
      syncEvents: 'id, userId, localRecordId, tableName, syncStatus',
    });
  }
}

export const db = new CropWiseDatabase();

// Seed initial system data when database is first initialized.
db.on('populate', () => {
  const defaultCoopId = 'coop-default-uuid';
  const defaultUserId = 'tech-default-uuid';

  const defaultCoop: ICooperative = {
    id: defaultCoopId,
    name: 'Northern Mindanao Farmers Association',
    region: 'Northern Mindanao',
    province: 'Bukidnon',
    city: 'Malaybalay',
    barangay: 'Sumpong',
    contactPerson: 'Gabriel Agila',
    contactNumber: '0917-555-0199',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDeleted: false,
  };

  const defaultUser: IUser = {
    id: defaultUserId,
    cooperativeId: defaultCoopId,
    name: 'Officer Gabriel Agila',
    email: 'gabriel.agila@cropwise.org',
    role: 'field_technician',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDeleted: false,
  };

  const defaultRules: IRecommendationRule[] = [
    // --- CORN RULES ---
    {
      id: 'rule-corn-ph-low',
      crop: 'Corn',
      region: 'Northern Mindanao',
      parameter: 'ph',
      thresholdMin: 0,
      thresholdMax: 5.4,
      interpretation: 'Highly Acidic Soil',
      recommendationText: 'Apply agricultural lime (carbonate) at 2 to 3 tons per hectare. Work lime thoroughly into the top 15cm of soil at least 4 weeks before planting.',
      fertilizerType: 'Agricultural Lime',
      rateKgPerHectare: 2500,
      sourceReference: 'DA-BSWM Soil Quality Guidelines for Corn Production',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false,
    },
    {
      id: 'rule-corn-ph-optimal',
      crop: 'Corn',
      region: 'Northern Mindanao',
      parameter: 'ph',
      thresholdMin: 5.5,
      thresholdMax: 7.0,
      interpretation: 'Optimal Soil pH',
      recommendationText: 'Soil acidity is optimal. Maintain current organic matter practices to stabilize pH.',
      fertilizerType: 'None',
      rateKgPerHectare: 0,
      sourceReference: 'DA-BSWM Soil Quality Guidelines for Corn Production',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false,
    },
    {
      id: 'rule-corn-n-low',
      crop: 'Corn',
      region: 'Northern Mindanao',
      parameter: 'nitrogen',
      thresholdMin: 0,
      thresholdMax: 20,
      interpretation: 'Severe Nitrogen Deficiency',
      recommendationText: 'Apply 120 kg N/ha. Split application: 50% as basal during planting (Complete 14-14-14) and 50% as sidedress at 30 days after planting using Urea.',
      fertilizerType: 'Urea (46-0-0)',
      rateKgPerHectare: 260,
      sourceReference: 'Project SARAI Agronomic Guidelines for Corn',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false,
    },
    {
      id: 'rule-corn-n-medium',
      crop: 'Corn',
      region: 'Northern Mindanao',
      parameter: 'nitrogen',
      thresholdMin: 21,
      thresholdMax: 40,
      interpretation: 'Moderate Nitrogen Level',
      recommendationText: 'Apply 80 kg N/ha. Apply 40% basal and 60% sidedress during the active vegetative stage (V6-V8).',
      fertilizerType: 'Urea (46-0-0)',
      rateKgPerHectare: 175,
      sourceReference: 'Project SARAI Agronomic Guidelines for Corn',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false,
    },
    {
      id: 'rule-corn-p-low',
      crop: 'Corn',
      region: 'Northern Mindanao',
      parameter: 'phosphorus',
      thresholdMin: 0,
      thresholdMax: 6,
      interpretation: 'Phosphorus Deficient',
      recommendationText: 'Apply 60 kg P2O5/ha as basal. Phosphorus is critical for early root development and seedling establishment.',
      fertilizerType: 'Solophos (0-20-0)',
      rateKgPerHectare: 300,
      sourceReference: 'DA-BSWM FertRight Soil Diagnostic Manual',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false,
    },
    {
      id: 'rule-corn-k-low',
      crop: 'Corn',
      region: 'Northern Mindanao',
      parameter: 'potassium',
      thresholdMin: 0,
      thresholdMax: 60,
      interpretation: 'Potassium Deficient',
      recommendationText: 'Apply 60 kg K2O/ha. Apply 50% basal and 50% side-dress before tasseling. Potassium enhances drought tolerance and stalk strength.',
      fertilizerType: 'Muriate of Potash (0-0-60)',
      rateKgPerHectare: 100,
      sourceReference: 'DA-BSWM FertRight Soil Diagnostic Manual',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false,
    },

    // --- RICE RULES ---
    {
      id: 'rule-rice-ph-low',
      crop: 'Rice',
      region: 'Northern Mindanao',
      parameter: 'ph',
      thresholdMin: 0,
      thresholdMax: 5.0,
      interpretation: 'Highly Acidic Soil',
      recommendationText: 'Apply agricultural lime at 1.5 to 2 tons per hectare during land preparation to increase nutrient availability.',
      fertilizerType: 'Agricultural Lime',
      rateKgPerHectare: 1500,
      sourceReference: 'PhilRice Fertilizer Management Guidelines',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false,
    },
    {
      id: 'rule-rice-ph-optimal',
      crop: 'Rice',
      region: 'Northern Mindanao',
      parameter: 'ph',
      thresholdMin: 5.1,
      thresholdMax: 6.5,
      interpretation: 'Optimal Soil pH',
      recommendationText: 'No lime required. Maintain flooding cycle to naturalize pH levels.',
      fertilizerType: 'None',
      rateKgPerHectare: 0,
      sourceReference: 'PhilRice Fertilizer Management Guidelines',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false,
    },
    {
      id: 'rule-rice-n-low',
      crop: 'Rice',
      region: 'Northern Mindanao',
      parameter: 'nitrogen',
      thresholdMin: 0,
      thresholdMax: 15,
      interpretation: 'Severe Nitrogen Deficiency',
      recommendationText: 'Apply 90 kg N/ha. Apply in three splits: basal, active tillering (21-25 DAT), and panicle initiation stage.',
      fertilizerType: 'Urea (46-0-0)',
      rateKgPerHectare: 195,
      sourceReference: 'PhilRice LCC Nitrogen Chart Recommendations',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false,
    },
    {
      id: 'rule-rice-n-medium',
      crop: 'Rice',
      region: 'Northern Mindanao',
      parameter: 'nitrogen',
      thresholdMin: 16,
      thresholdMax: 30,
      interpretation: 'Moderate Nitrogen Level',
      recommendationText: 'Apply 60 kg N/ha. Split application: 50% basal and 50% at panicle initiation.',
      fertilizerType: 'Urea (46-0-0)',
      rateKgPerHectare: 130,
      sourceReference: 'PhilRice LCC Nitrogen Chart Recommendations',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false,
    },
    {
      id: 'rule-rice-p-low',
      crop: 'Rice',
      region: 'Northern Mindanao',
      parameter: 'phosphorus',
      thresholdMin: 0,
      thresholdMax: 8,
      interpretation: 'Phosphorus Deficient',
      recommendationText: 'Apply 40 kg P2O5/ha as basal complete (14-14-14) or Solophos. Essential for early root growth and tillering.',
      fertilizerType: 'Solophos (0-20-0)',
      rateKgPerHectare: 200,
      sourceReference: 'PhilRice Soil Diagnostic Manual',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false,
    },
    {
      id: 'rule-rice-k-low',
      crop: 'Rice',
      region: 'Northern Mindanao',
      parameter: 'potassium',
      thresholdMin: 0,
      thresholdMax: 50,
      interpretation: 'Potassium Deficient',
      recommendationText: 'Apply 40 kg K2O/ha. Apply 50% basal and 50% at panicle initiation to prevent grain shattering and increase resistance to pests.',
      fertilizerType: 'Muriate of Potash (0-0-60)',
      rateKgPerHectare: 67,
      sourceReference: 'PhilRice Soil Diagnostic Manual',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false,
    }
  ];

  db.cooperatives.add(defaultCoop);
  db.users.add(defaultUser);
  db.recommendationRules.bulkAdd(defaultRules);

  // Seed default farmer for presentation
  const defaultFarmer: IFarmer = {
    id: 'farmer-juan-santos',
    cooperativeId: defaultCoopId,
    name: 'Juan Carlos Santos',
    phone: '0917-234-5678',
    barangay: 'Gusa',
    notes: 'A dedicated farmer aiming for organic vegetable rotation.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDeleted: false
  };

  const defaultPlots: IPlot[] = [
    {
      id: 'plot-kalinawan',
      farmerId: 'farmer-juan-santos',
      cooperativeId: defaultCoopId,
      plotName: 'Kalinawan Farm',
      crop: 'Corn',
      areaHectares: 10.5,
      locationText: 'Cagayan De Oro, Misamis Oriental',
      plantingDate: '2025-08-01',
      cropStage: 'Vegetative',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false
    },
    {
      id: 'plot-malasag',
      farmerId: 'farmer-juan-santos',
      cooperativeId: defaultCoopId,
      plotName: 'Malasag Organic Farm',
      crop: 'Tomato',
      areaHectares: 8.2,
      locationText: 'Malaybalay, Bukidnon',
      plantingDate: '2025-08-15',
      cropStage: 'Land Preparation',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false
    }
  ];

  const defaultReadings: ISoilReading[] = [
    {
      id: 'reading-kalinawan-1',
      plotId: 'plot-kalinawan',
      cooperativeId: defaultCoopId,
      source: 'hardware',
      ph: 6.8,
      nitrogen: 45,
      phosphorus: 12,
      potassium: 85,
      moisture: 80,
      temperature: 27.5,
      electricalConductivity: 1.2,
      organicMatter: 2.2,
      collectedAt: Date.now(),
      createdBy: defaultUserId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false
    },
    {
      id: 'reading-malasag-1',
      plotId: 'plot-malasag',
      cooperativeId: defaultCoopId,
      source: 'manual',
      ph: 5.2,
      nitrogen: 25,
      phosphorus: 5,
      potassium: 40,
      moisture: 45,
      temperature: 28.2,
      electricalConductivity: 0.5,
      organicMatter: 1.2,
      collectedAt: Date.now(),
      createdBy: defaultUserId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false
    }
  ];

  db.farmers.add(defaultFarmer);
  db.plots.bulkAdd(defaultPlots);
  db.soilReadings.bulkAdd(defaultReadings);
});
