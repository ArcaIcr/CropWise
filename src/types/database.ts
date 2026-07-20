/**
 * Represents a Cooperative entity.
 */
export interface ICooperative {
  id: string;
  name: string;
  region: string;
  province: string;
  city: string;
  barangay: string;
  contactPerson: string;
  contactNumber: string;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
}

/**
 * Represents a User/Technician working in a cooperative.
 */
export interface IUser {
  id: string;
  cooperativeId: string;
  name: string;
  email: string;
  role: 'admin' | 'coop_officer' | 'field_technician' | 'viewer';
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
}

/**
 * Represents a Farmer registered under a cooperative.
 */
export interface IFarmer {
  id: string;
  cooperativeId: string;
  name: string;
  phone: string;
  barangay: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
}

/**
 * Represents a Plot owned/managed by a farmer.
 */
export interface IPlot {
  id: string;
  farmerId: string;
  cooperativeId: string;
  plotName: string;
  crop: string;
  areaHectares: number;
  locationText?: string;
  latitude?: number;
  longitude?: number;
  plantingDate: string; // YYYY-MM-DD
  cropStage: string;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
}

/**
 * Represents a Soil Reading captured for a specific plot.
 */
export interface ISoilReading {
  id: string;
  plotId: string;
  cooperativeId: string;
  source: 'manual' | 'hardware' | 'lab';
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture?: number;
  temperature?: number;
  electricalConductivity?: number;
  organicMatter?: number;
  collectedAt: number;
  syncedAt?: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
}

/**
 * Represents an agronomic rule used by the recommendation engine.
 */
export interface IRecommendationRule {
  id: string;
  crop: string;
  region: string;
  parameter: 'ph' | 'nitrogen' | 'phosphorus' | 'potassium';
  thresholdMin: number;
  thresholdMax: number;
  interpretation: string;
  recommendationText: string;
  fertilizerType: string;
  rateKgPerHectare: number;
  sourceReference: string;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
}

/**
 * Represents a generated Fertilizer Report.
 */
export interface IFertilizerReport {
  id: string;
  plotId: string;
  soilReadingId: string;
  cooperativeId: string;
  recommendationSummary: string;
  fertilizerTotalKg: number;
  reportStatus: 'draft' | 'finalized';
  generatedAt: number;
  generatedBy: string;
  pdfUrl?: string;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
}

/**
 * Represents physical IoT sensor devices leased/owned by the cooperative.
 */
export interface IDevice {
  id: string;
  cooperativeId: string;
  deviceSerial: string;
  firmwareVersion: string;
  calibrationStatus: string;
  lastSyncAt: number;
  assignedTo?: string;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
}

/**
 * Audit log of local-to-cloud synchronization events.
 */
export interface ISyncEvent {
  id: string;
  userId: string;
  deviceId?: string;
  localRecordId: string;
  tableName: string;
  syncStatus: 'pending' | 'success' | 'error';
  conflictStatus: 'none' | 'resolved_local' | 'resolved_remote' | 'manual_intervention';
  syncedAt: number;
}
