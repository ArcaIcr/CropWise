import type { ISoilReading, IRecommendationRule } from '../types/database';

/**
 * Represents a single evaluation record for a soil reading parameter.
 */
export interface IAppliedRecommendation {
  parameter: 'ph' | 'nitrogen' | 'phosphorus' | 'potassium';
  interpretation: string;
  recommendationText: string;
  fertilizerType: string;
  rateKgPerHectare: number;
  totalNeededKg: number;
  totalBags: number;
  sourceReference: string;
}

/**
 * Represents the aggregated results returned by the recommendation engine.
 */
export interface IRecommendationResult {
  rulesApplied: string[];
  recommendations: IAppliedRecommendation[];
  totalFertilizers: Array<{
    fertilizerType: string;
    totalKg: number;
    totalBags: number;
  }>;
}

/**
 * Evaluates soil readings against cooperative agronomic guidelines.
 * Calculates total requirements in kilograms and standard 50kg bags.
 * 
 * @param reading The raw soil reading properties (ph, N, P, K).
 * @param rules Agronomic guidelines fetched from the database.
 * @param crop Target crop species (e.g. "Corn", "Rice").
 * @param region Local farming region for localized soil guidelines.
 * @param areaHectares Area of target farming plot in hectares.
 */
export function generateRecommendation(
  reading: ISoilReading,
  rules: IRecommendationRule[],
  crop: string,
  region: string,
  areaHectares: number
): IRecommendationResult {
  const appliedRecommendations: IAppliedRecommendation[] = [];
  const rulesApplied: string[] = [];

  // Filter rules by target crop and region
  const activeRules = rules.filter(
    (rule) =>
      rule.crop.toLowerCase() === crop.toLowerCase() &&
      rule.region.toLowerCase() === region.toLowerCase()
  );

  const parameters: Array<'ph' | 'nitrogen' | 'phosphorus' | 'potassium'> = [
    'ph',
    'nitrogen',
    'phosphorus',
    'potassium',
  ];

  for (const param of parameters) {
    const value = reading[param];
    if (value === undefined) continue;

    // Find matching rule based on value threshold bounds
    const matchedRule = activeRules.find(
      (rule) =>
        rule.parameter === param &&
        value >= rule.thresholdMin &&
        value <= rule.thresholdMax
    );

    if (matchedRule) {
      rulesApplied.push(matchedRule.id);

      const totalNeededKg = matchedRule.rateKgPerHectare * areaHectares;
      const totalBags = Math.ceil((totalNeededKg / 50) * 10) / 10; // Round to nearest 0.1 bags

      appliedRecommendations.push({
        parameter: param,
        interpretation: matchedRule.interpretation,
        recommendationText: matchedRule.recommendationText,
        fertilizerType: matchedRule.fertilizerType,
        rateKgPerHectare: matchedRule.rateKgPerHectare,
        totalNeededKg,
        totalBags,
        sourceReference: matchedRule.sourceReference,
      });
    }
  }

  // Aggregate requirements by fertilizer brand/types
  const fertilizerMap = new Map<string, number>();
  for (const rec of appliedRecommendations) {
    if (rec.fertilizerType && rec.fertilizerType !== 'None' && rec.rateKgPerHectare > 0) {
      const current = fertilizerMap.get(rec.fertilizerType) || 0;
      fertilizerMap.set(rec.fertilizerType, current + rec.totalNeededKg);
    }
  }

  const totalFertilizers = Array.from(fertilizerMap.entries()).map(([type, kg]) => ({
    fertilizerType: type,
    totalKg: kg,
    totalBags: Math.ceil((kg / 50) * 10) / 10,
  }));

  return {
    rulesApplied,
    recommendations: appliedRecommendations,
    totalFertilizers,
  };
}
