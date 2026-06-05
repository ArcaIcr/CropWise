---
idea_slug: cropwise
document_type: merged_small_farmer_audit_build_plan
created_at: 2026-05-21
status: draft
---

# CropWise Small Farmer Audit and Build Plan

## 1. Clean Positioning

**CropWise is a cooperative-deployed soil diagnostic kit that helps small farmers make better fertilizer decisions without needing to use an app themselves. A trained field officer uses CropWise offline, collects or enters soil readings, and gives the farmer a crop-specific fertilizer report through print, SMS, Messenger, or verbal explanation.**

Short hackathon version:

> CropWise lets one trained field officer serve hundreds of small farmers with offline soil testing and AI-assisted, official-standard fertilizer reports.

## 2. Target Market Model

CropWise targets small farmers as the **beneficiaries**, not as the first app users.

| Role | Who It Is | What They Do |
|---|---|---|
| User | Cooperative officer, LGU agriculture worker, field technician | Operates the app and soil kit in the field |
| Beneficiary | Small farmer | Receives soil result and fertilizer recommendation |
| Buyer | Cooperative, LGU, NGO, agriculture school, input partner | Pays for or sponsors deployment |

Do not design the first version as a consumer app where every farmer installs CropWise. That is a weak fit for many Philippine smallholder contexts.

## 3. Why This Access Model Matters

Many small farmers in the Philippines may face:

- limited smartphone access;
- limited mobile data or unstable internet;
- low comfort with app dashboards;
- language barriers;
- low willingness to pay for subscriptions;
- stronger trust in known local people than software;
- preference for printed, verbal, SMS, or Messenger-based instructions.

The product can still benefit small farmers, but the system should be operated by a trusted local person.

Best delivery model:

> Technician-operated, farmer-benefiting, coop-funded.

## 4. Core Thesis

The first version should not be a full "AI agriculture ecosystem." That is too broad, too expensive, and too easy for judges to attack.

The stronger thesis:

1. Small farmers and cooperatives need better fertilizer decisions.
2. Existing recommendations often depend on lab tests, internet access, or generic advice.
3. Cooperatives, LGUs, and technicians are better first users than individual farmers.
4. A software-first system can prove the reporting workflow before full hardware deployment.
5. Hardware should become one input source later, not the entire product risk on day one.

## 5. Corrected Market Framing

### Risky Claim

Avoid saying:

> "TAM: 19.7M farmers in the Philippines."

That number is risky because PSA's 19.68M figure refers to **agricultural population**, not necessarily individual paying farmers.

### Safer Claim

Use:

> "The 2022 Census of Agriculture and Fisheries recorded millions of agricultural households/operators and about 19.68M agricultural population aged 18 and above in households with at least one agricultural operator."

### Recommended TAM / SAM / SOM Style

- **TAM:** Agricultural households/operators in the Philippines that need crop and fertilizer decisions.
- **SAM:** Farmer cooperatives, LGUs, agriculture offices, and organized farmer groups in Mindanao that can deploy shared diagnostic tools.
- **SOM:** Initial cooperative pilots in Northern Mindanao for one crop and one crop cycle.

The first customer is not "every Filipino farmer." The first customer is a cooperative, LGU agriculture office, agriculture school, NGO program, or input partner.

## 6. Source Library for Audit

### Official PH Data / Market Size

1. **[PSA 2022 Census of Agriculture and Fisheries statistical tables](https://psa.gov.ph/statistics/caf/stat-tables)**  
   Use for official market sizing and agriculture household/operator data.

2. **[PSA agricultural population page](https://psa.gov.ph/content/2022-census-agriculture-and-fisheries-agricultural-population-ownership-or-secure-rights)**  
   Use to explain the 19.68M agricultural population figure correctly.

3. **[PSA farm and parcel characteristics](https://rssomimaropa.psa.gov.ph/content/2022-census-agriculture-and-fisheries-agriculture-farm-and-parcel-characteristics)**  
   Use for farm/parcel count context.

### Soil / Fertilizer / Crop Advisory References

4. **[DA-BSWM FertRight / Fertilizer Recommendation App](https://www.bswm.da.gov.ph/download/bswm-fertilizer-recommendation/)**  
   Key reference and competitor. It proves official fertilizer recommendation logic already exists.

5. **[Project SARAI](https://www.sarai.ph/)**  
   Use for crop advisories, weather-based recommendations, drought forecasting, and science-backed agriculture decision support.

6. **[PIDS paper mentioning SARAI and PH digital agriculture programs](https://pidswebs.pids.gov.ph/CDN/document/pidsdps2329.pdf)**  
   Use for policy and digital-agriculture background.

### Academic / Technical Papers

7. **[Soil nitrogen and fertilizer recommendations for irrigated rice in the Philippines](https://www.sciencedirect.com/science/article/pii/0308521X87900011/pdf)**  
   Use as technical background for soil-specific fertilizer recommendation research. Access may vary.

8. **[Soil Test Kit as an Extension Tool in the Philippines](https://jmds.upou.edu.ph/index.php/journal/article/view/6)**  
   Highly relevant because CropWise is a modernized soil-test and recommendation workflow.

9. **[Nutrient-deficient irrigated lowland rice soils](https://journal.wvsu.edu.ph/index.php/journals/article/view/69)**  
   Useful for explaining why fertilizer recommendation needs field-level diagnosis.

### Competitors / Adjacent Tools

10. **[Syngenta Tiwala / Cropwise ecosystem](https://www.tiwala.com.ph/)**  
    Important competitor. They already cover crop programs, pest maps, e-commerce, and product recommendations.

11. **[Farmtri AI](https://farmtri.ai/)**  
    Adjacent PH agri-AI competitor.

## 7. Competitive Reality

Do not claim:

> "No one gives fertilizer recommendations."

Existing relevant tools:

- DA-BSWM FertRight gives fertilizer recommendations using soil test values.
- Syngenta Tiwala / Cropwise provides crop programs, pest maps, product recommendations, and e-commerce.
- Project SARAI provides crop advisories and weather-based decision support.
- Farmtri AI is already positioned around agri-AI and crop damage prevention.

### Actual Defensible Gap

CropWise should claim:

> Existing solutions either require separate soil test inputs, internet access, institutional context, or vendor-specific ecosystems. CropWise focuses on offline field data capture and technician-assisted fertilizer reports for small farmers.

## 8. AI Positioning

CropWise is still AI-powered, but the safest framing is:

> AI-assisted, not AI-dependent.

The fertilizer recommendation should come from traceable rules, official-standard references, and soil reading values. AI should help make the output understandable and usable for small farmers.

### Rule-Based Core

Use rules for:

- soil status interpretation;
- deficiency flags;
- fertilizer calculations;
- kg/hectare estimates;
- crop-stage notes;
- warning messages when data is missing.

This keeps the system auditable and easier to trust.

### AI Assistance Layer

Use AI for:

- explaining recommendations in plain language;
- translating report notes into Filipino, Cebuano, or another local language;
- creating SMS or Messenger summaries;
- helping technicians write field observations;
- flagging unusual or incomplete data for review.

Do not use AI to invent fertilizer recipes without a source.

## 9. Small Farmer Field Workflow

### Technician Workflow

1. Technician visits the farm or cooperative collection point.
2. Technician selects farmer and plot in CropWise.
3. Technician enters soil readings manually or syncs from hardware.
4. CropWise generates a fertilizer report.
5. Technician explains the recommendation.
6. Farmer receives printed, SMS, Messenger, or verbal guidance.

### Farmer Experience

The farmer should only need to answer simple questions:

- What crop are you planting?
- How large is the plot?
- When did you plant?
- What fertilizer do you currently use?
- Do you want a printed or phone-based copy?

The farmer should not need to:

- create an account;
- install an app;
- understand dashboards;
- manage device syncing;
- interpret raw soil values;
- troubleshoot internet problems.

## 10. Accessibility Design Principles

### 10.1 No Farmer Login Required

The system should allow a technician to create and manage farmer records. Farmer login can be added later, but it should not be required for the first version.

### 10.2 Offline-First Field Use

The technician must be able to:

- open assigned farmers offline;
- enter soil readings offline;
- generate draft recommendations offline;
- sync later when internet returns.

### 10.3 Local Language First

Reports should support plain-language explanations in:

- English;
- Filipino/Tagalog;
- Cebuano or another local language if piloting in Mindanao.

Avoid technical terms unless explained clearly.

Instead of:

> "Soil pH is below optimal threshold."

Use:

> "The soil is too acidic for this crop. This may reduce fertilizer effectiveness."

### 10.4 Printed and Shareable Reports

The most important output is not the dashboard. It is the report.

Reports should be:

- printable;
- easy to read;
- short;
- crop-specific;
- dated;
- signed or labeled by the technician;
- shareable through Messenger or SMS.

### 10.5 Big Buttons and Low Typing

The field app should use:

- large buttons;
- dropdowns;
- presets;
- numeric inputs;
- saved farmer records;
- minimal free-text typing.

This helps technicians work faster in field conditions.

### 10.6 Technician-Assisted Trust

Farmers are more likely to trust CropWise if a known local person explains it.

Trust path:

> Coop/LGU technician uses CropWise -> farmer sees soil result -> technician explains recommendation -> farmer receives report.

This is stronger than:

> Farmer downloads app -> farmer enters data alone -> app gives recommendation.

## 11. Software-First System Plan

The software should be built before full hardware integration. Treat hardware as a future data source.

### Core Product Flow

1. Coop officer or technician logs in.
2. Adds cooperative profile.
3. Adds farmers and plots.
4. Selects crop, location, area, and crop stage.
5. Inputs soil readings manually.
6. System generates soil status and fertilizer recommendation.
7. System exports a report.
8. Data syncs when internet becomes available.

### Hardware Later

Hardware should eventually write into the same soil reading table as manual and lab entries.

Important field:

```typescript
type SoilReadingSource = "manual" | "hardware" | "lab";
```

This keeps the system flexible.

## 12. Recommended Software Modules

### 12.1 Coop Dashboard

Purpose:

- manage cooperatives;
- manage users;
- manage farmers;
- manage farms/plots;
- see soil test history;
- view generated reports.

Minimum fields:

- cooperative name;
- region/province/city/barangay;
- contact person;
- role;
- assigned technician.

### 12.2 Farmer and Plot Registry

Purpose:

- track who owns or manages each plot;
- track crop, area, location, and planting data.

Minimum fields:

- farmer name;
- phone number;
- barangay;
- plot name;
- crop;
- area in hectares;
- planting date;
- crop stage.

### 12.3 Soil Reading Module

Start with manual input.

Possible fields:

- pH;
- nitrogen;
- phosphorus;
- potassium;
- moisture;
- temperature;
- electrical conductivity;
- date collected;
- collection method;
- source: manual, hardware, or lab.

Do not wait for the hardware to finish before building this.

### 12.4 Recommendation Engine

Start rule-based.

Inputs:

- crop;
- region;
- soil reading values;
- plot size;
- crop stage;
- target yield, if available.

Outputs:

- soil status;
- deficiency flags;
- fertilizer recommendation;
- kg/hectare calculation;
- total kg needed for the plot;
- timing notes;
- caution notes.

Position it as:

> official-standard aligned

Do not overclaim:

> AI knows the perfect fertilizer recipe.

### 12.5 Report Generator

This is one of the most important modules because it creates the artifact farmers actually receive.

Report should include:

- cooperative name;
- farmer name;
- plot details;
- crop;
- area;
- soil readings;
- interpretation;
- fertilizer recommendation;
- total fertilizer estimate;
- date tested;
- technician name;
- disclaimer.

Export formats:

- PDF;
- printable page;
- SMS/Messenger-ready summary;
- shareable image later.

### 12.6 Offline-First Field App

The field app should support:

- viewing assigned farmers/plots offline;
- entering readings offline;
- generating draft reports offline;
- syncing when online;
- conflict handling.

Recommended web approach:

- PWA;
- IndexedDB;
- Dexie.js;
- Supabase sync when online.

## 13. Recommended Tech Stack

Use your current strengths.

- Frontend: React + TypeScript
- Styling: Tailwind CSS
- Icons: lucide-react
- Backend/database: Supabase
- Auth: Supabase Auth
- Offline storage: IndexedDB with Dexie.js
- PDF: react-pdf or server-side PDF generation
- Hosting: Vercel or similar

Do not introduce complex infrastructure early.

## 14. Suggested Database Tables

To support offline-first sync with Supabase and IndexedDB (via Dexie.js), all synced tables should include `updated_at` and `is_deleted` (for soft deletes). This enables tombstoning and accurate conflict resolution based on timestamps.

### cooperatives

- `id`: uuid (Primary Key)
- `name`: varchar
- `region`: varchar
- `province`: varchar
- `city`: varchar
- `barangay`: varchar
- `contact_person`: varchar
- `contact_number`: varchar
- `created_at`: timestamp
- `updated_at`: timestamp
- `is_deleted`: boolean (default false, for soft delete sync)

### users

- `id`: uuid (Primary Key, matches Supabase Auth user ID)
- `cooperative_id`: uuid (Foreign Key -> cooperatives.id)
- `name`: varchar
- `email`: varchar
- `role`: varchar (admin, coop_officer, field_technician, viewer)
- `created_at`: timestamp
- `updated_at`: timestamp
- `is_deleted`: boolean (default false)

### farmers

- `id`: uuid (Primary Key, generated client-side or server-side)
- `cooperative_id`: uuid (Foreign Key -> cooperatives.id)
- `name`: varchar
- `phone`: varchar
- `barangay`: varchar
- `notes`: text
- `created_at`: timestamp
- `updated_at`: timestamp
- `is_deleted`: boolean (default false)

### plots

- `id`: uuid (Primary Key)
- `farmer_id`: uuid (Foreign Key -> farmers.id)
- `cooperative_id`: uuid (Foreign Key -> cooperatives.id)
- `plot_name`: varchar
- `crop`: varchar (e.g., "corn", "rice")
- `area_hectares`: numeric(10, 2)
- `location_text`: text
- `latitude`: numeric(9, 6) (nullable)
- `longitude`: numeric(9, 6) (nullable)
- `planting_date`: date
- `crop_stage`: varchar
- `created_at`: timestamp
- `updated_at`: timestamp
- `is_deleted`: boolean (default false)

### soil_readings

- `id`: uuid (Primary Key)
- `plot_id`: uuid (Foreign Key -> plots.id)
- `cooperative_id`: uuid (Foreign Key -> cooperatives.id)
- `source`: varchar (manual, hardware, lab)
- `ph`: numeric(4, 2)
- `nitrogen`: numeric(5, 2)
- `phosphorus`: numeric(5, 2)
- `potassium`: numeric(5, 2)
- `moisture`: numeric(5, 2)
- `temperature`: numeric(5, 2)
- `electrical_conductivity`: numeric(5, 2)
- `collected_at`: timestamp
- `synced_at`: timestamp (nullable, filled on sync completion)
- `created_by`: uuid (Foreign Key -> users.id)
- `created_at`: timestamp
- `updated_at`: timestamp
- `is_deleted`: boolean (default false)

### recommendation_rules

- `id`: uuid (Primary Key)
- `crop`: varchar
- `region`: varchar
- `soil_parameter`: varchar (e.g., "pH", "N", "P", "K")
- `threshold_min`: numeric(5, 2)
- `threshold_max`: numeric(5, 2)
- `interpretation`: text
- `recommendation_text`: text
- `fertilizer_type`: varchar
- `rate_kg_per_hectare`: numeric(10, 2)
- `source_reference`: text
- `created_at`: timestamp
- `updated_at`: timestamp
- `is_deleted`: boolean (default false)

### fertilizer_reports

- `id`: uuid (Primary Key)
- `plot_id`: uuid (Foreign Key -> plots.id)
- `soil_reading_id`: uuid (Foreign Key -> soil_readings.id)
- `cooperative_id`: uuid (Foreign Key -> cooperatives.id)
- `recommendation_summary`: text
- `fertilizer_total_kg`: numeric(10, 2)
- `report_status`: varchar (draft, finalized)
- `generated_at`: timestamp
- `generated_by`: uuid (Foreign Key -> users.id)
- `pdf_url`: varchar
- `created_at`: timestamp
- `updated_at`: timestamp
- `is_deleted`: boolean (default false)

### devices

*Later integration stage*

- `id`: uuid (Primary Key)
- `cooperative_id`: uuid (Foreign Key -> cooperatives.id)
- `device_serial`: varchar
- `firmware_version`: varchar
- `calibration_status`: varchar
- `last_sync_at`: timestamp
- `assigned_to`: uuid (Foreign Key -> users.id, nullable)
- `created_at`: timestamp
- `updated_at`: timestamp
- `is_deleted`: boolean (default false)

### sync_events

- `id`: uuid (Primary Key)
- `user_id`: uuid (Foreign Key -> users.id)
- `device_id`: uuid (Foreign Key -> devices.id, nullable)
- `local_record_id`: uuid (The ID of the client-side record synced)
- `table_name`: varchar (The table being synced)
- `sync_status`: varchar (pending, success, error)
- `conflict_status`: varchar (none, resolved_local, resolved_remote, manual_intervention)
- `synced_at`: timestamp

## 15. Build Roadmap

### Phase 0: Paper and Workflow Validation

Goal:

Prove coops, technicians, and farmers want the report before building the full system.

Tasks:

1. Create a one-page sample CropWise fertilizer report.
2. Show it to 10 coop officers, LGU agriculture staff, agriculture students, or technicians.
3. Show the farmer-facing version to 10-20 small farmers if possible.
4. Ask if the report is understandable and useful.
5. Ask what crop and soil values they actually track.
6. Ask if they would join a pilot.

Pass condition:

- At least 3 serious pilot commitments.
- At least 1 dated field deployment or small refundable deposit.
- Most farmers shown the sample report understand the recommendation without needing a dashboard.

### Phase 1: Software MVP Without Hardware

Goal:

Build the complete software workflow using manual soil input.

Features:

- Auth
- Coop dashboard
- Farmer registry
- Plot registry
- Manual soil readings
- Rule-based recommendations
- PDF report export
- SMS/Messenger-ready summaries
- Basic offline draft saving

Do not build:

- IoT live dashboard
- sensor calibration module
- farmer mobile app
- farmer login
- social features
- complex maps
- AI chatbot for farmers
- multi-crop full recommendation system

### Phase 2: Offline-First Field Workflow

Goal:

Make field use realistic.

Features:

- PWA install
- offline plot list
- offline reading entry
- offline report draft
- sync queue
- sync conflict handling

Pass condition:

- A technician can complete a field reading workflow without internet.

### Phase 3: Hardware Integration

Goal:

Connect the soil probe as a reading source.

Features:

- device registry
- Bluetooth/USB/manual import, depending on hardware
- device reading parser
- calibration status
- reading source: hardware
- device sync logs

Pass condition:

- Hardware reading creates the same type of soil_reading record as manual input.

### Phase 4: AI-Assisted Decision Support

Goal:

Improve communication quality without making AI the source of truth.

Possible upgrades:

- crop-specific rule sets;
- region-specific rule sets;
- official source references per recommendation;
- warning labels when data is incomplete;
- AI summary that explains the rule-based output in local language;
- SMS/Messenger advisory generator;
- technician observation assistant.

Important:

AI should explain and summarize. The core recommendation should remain traceable to rules and references.

### Phase 5: Pilot Reporting and Business Model

Goal:

Prove value to payer and beneficiary.

Metrics:

- number of farmers served;
- number of plots tested;
- reports generated;
- time per soil test workflow;
- percentage of farmers who understand the recommendation;
- percentage of farmers who say they would follow the recommendation;
- recommendation adoption rate;
- fertilizer cost change;
- yield change, if available;
- technician time saved;
- repeat usage after first report;
- coop willingness to pay or sponsor deployment.

Possible pricing:

- pilot fee per cooperative;
- monthly cooperative subscription;
- device lease plus software;
- LGU/NGO sponsored deployment;
- agriculture school research deployment.

## 16. Recommendation Engine: Safe First Version

Use rule-based logic first. The recommendation engine parses soil reading inputs against official regional thresholds to generate crop-specific recommendations.

Below is the type-safe TypeScript representation of the recommendation execution model:

```typescript
/**
 * Represents raw soil reading parameters collected from manual entry, lab reports, or sensors.
 */
export interface ISoilReading {
  ph: number;
  nitrogen: number;      // in mg/kg or ppm
  phosphorus: number;    // in mg/kg or ppm
  potassium: number;     // in mg/kg or ppm
}

/**
 * Represents a predefined agronomic recommendation rule based on official standards.
 */
export interface IRecommendationRule {
  id: string;
  crop: string;
  region: string;
  parameter: keyof ISoilReading;
  thresholdMin: number;
  thresholdMax: number;
  interpretation: string;
  recommendationText: string;
  fertilizerType: string;
  rateKgPerHectare: number;
  sourceReference: string;
}

/**
 * Represents the structured result generated by the recommendation engine.
 */
export interface IRecommendationResult {
  rulesApplied: string[];
  recommendations: Array<{
    parameter: keyof ISoilReading;
    interpretation: string;
    recommendationText: string;
    fertilizerType: string;
    rateKgPerHectare: number;
    totalNeededKg: number;
    sourceReference: string;
  }>;
}

/**
 * Evaluates active recommendation rules against a soil reading.
 * 
 * @param reading The current soil readings.
 * @param rules The full set of available recommendation rules.
 * @param crop Target crop name.
 * @param region Target region name.
 * @param areaHectares Plot size in hectares.
 */
export function generateRecommendation(
  reading: ISoilReading,
  rules: IRecommendationRule[],
  crop: string,
  region: string,
  areaHectares: number
): IRecommendationResult {
  const recommendations: IRecommendationResult["recommendations"] = [];
  const rulesApplied: string[] = [];

  const matchedRules = rules.filter(
    (rule) =>
      rule.crop.toLowerCase() === crop.toLowerCase() &&
      rule.region.toLowerCase() === region.toLowerCase()
  );

  for (const rule of matchedRules) {
    const value = reading[rule.parameter];
    if (value >= rule.thresholdMin && value <= rule.thresholdMax) {
      rulesApplied.push(rule.id);
      recommendations.push({
        parameter: rule.parameter,
        interpretation: rule.interpretation,
        recommendationText: rule.recommendationText,
        fertilizerType: rule.fertilizerType,
        rateKgPerHectare: rule.rateKgPerHectare,
        totalNeededKg: rule.rateKgPerHectare * areaHectares,
        sourceReference: rule.sourceReference,
      });
    }
  }

  return {
    rulesApplied,
    recommendations,
  };
}
```

Every generated recommendation should store:

- rule used (audit trail);
- source reference;
- input values;
- timestamp;
- generated_by (technician user ID).

This makes the system auditable, and ensures recommendations can be validated back to their official-standard source reference (e.g., DA-BSWM guidelines).

## 17. Pitch Language

Use this:

> CropWise lets one trained field officer serve hundreds of small farmers with offline soil testing and printable fertilizer recommendations.

Avoid this:

> Every farmer downloads CropWise and manages their own soil health dashboard.

Use this:

> We bring the technology to the farmer through trusted cooperatives and local field workers.

Avoid this:

> Farmers will self-manage everything through our app.

Use this:

> Our recommendation engine is rule-based and auditable, while AI converts technical results into farmer-friendly guidance in local language.

Avoid this:

> AI knows the perfect fertilizer recipe.

## 18. Suggested Slide Structure

1. Problem: small farmers often make fertilizer decisions with incomplete soil data.
2. Access reality: many farmers should not be forced to install or operate another app.
3. Customer: cooperatives and LGUs need a practical way to serve many farmers.
4. Solution: technician-operated offline soil diagnostic kit + report generator.
5. Workflow: test plot, enter/read soil values, generate report, advise farmer.
6. AI: rule-based recommendation core, AI-assisted local-language explanation.
7. Differentiation: offline, coop-deployed, official-standard aligned, farmer-accessible.
8. Pilot: one crop, one region, one crop cycle.
9. Business model: coop/device bundle or sponsored deployment.
10. Validation ask: pilot commitments from cooperatives.

## 19. Do's

- Do make the technician the primary app user.
- Do make the small farmer the beneficiary.
- Do sell to cooperatives or institutions first, not individual farmers.
- Do support offline use.
- Do create printed reports.
- Do support SMS or Messenger summaries.
- Do use plain language.
- Do use local languages where possible.
- Do build manual soil input before hardware integration.
- Do make every recommendation traceable to a rule or source.
- Do use official-standard aligned wording.
- Do make the workflow work without farmer smartphones.
- Do validate with coop officers, LGU agriculture staff, and small farmers.
- Do design for field conditions: sunlight, gloves, dirt, poor signal, limited time.
- Do track source of readings: manual, lab, or hardware.
- Do treat hardware as a data input, not the whole product.
- Do measure adoption and willingness to pay before scaling.

## 20. Don'ts

- Do not require farmers to install the app.
- Do not require farmers to create accounts.
- Do not assume farmers will understand raw soil values.
- Do not depend on constant internet.
- Do not use complex dashboards as the farmer-facing output.
- Do not charge individual farmers first.
- Do not claim 19.7M farmers as the direct TAM.
- Do not claim no one else does fertilizer recommendations.
- Do not pitch a generic "AI for farmers" app.
- Do not build for every crop immediately.
- Do not make recommendations black-box.
- Do not build real-time IoT dashboards before validating report usage.
- Do not make the system dependent on expensive hardware before proving the report workflow.
- Do not ignore hardware calibration and maintenance cost.
- Do not price it like a normal consumer app.
- Do not promise yield increases before field proof.

## 21. Validation Checklist Before Building Hardware

Complete these before spending heavily on hardware:

- [ ] Identify first crop.
- [ ] Identify first region.
- [ ] Identify 20 target cooperatives or agriculture offices.
- [ ] Create sample technician-facing report.
- [ ] Create sample farmer-facing report.
- [ ] Get feedback from at least 10 coop/LGU/technician users.
- [ ] Get feedback from at least 10-20 small farmers if possible.
- [ ] Get 3 signed LOIs.
- [ ] Get 1 paid deposit or dated deployment schedule.
- [ ] Define hardware bill of materials.
- [ ] Define sensor calibration method.
- [ ] Define who maintains the device.
- [ ] Define who pays if hardware breaks.

## 22. Practical Pilot Setup

- 1 cooperative
- 1 field technician
- 1 crop
- 20-50 small farmers
- 1 crop cycle

Pilot success means:

- the technician can complete the workflow offline;
- farmers understand the report;
- the cooperative wants to keep using the system;
- at least one payer is willing to fund continued deployment.

## 23. Kill Criteria

Stop or pivot if:

- fewer than 3 of 20 cooperatives sign LOIs;
- no cooperative will pay even a small refundable pilot deposit;
- no one agrees to a dated field deployment;
- farmers shown the report do not understand or trust it;
- target users say the report is not useful;
- soil readings cannot be trusted enough for fertilizer advice;
- hardware cost makes the payback period unrealistic.

## 24. Pivot If Needed

If hardware is too risky, pivot to:

> CropWise Soil Reports: a software-only cooperative tool that turns existing lab, BSWM, or manual soil test values into printable fertilizer reports for small farmers.

This keeps the useful part of CropWise while removing hardware risk.

## 25. Current Verdict

**Verdict:** Test  
**Score:** 60/100  
**Confidence:** Medium

CropWise has a real problem and a strong hackathon story, but the next step is not building the full ecosystem. The next step is proving that cooperatives and field workers can deliver the workflow to small farmers in a way farmers actually understand and trust.

## 26. Immediate Next Action

Within 14 days:

1. Pick one crop.
2. Pick one region.
3. Create one technician-facing fertilizer report.
4. Create one farmer-facing simplified version.
5. Approach 20 cooperatives or agriculture offices.
6. Show the farmer-facing report to 10-20 small farmers if possible.
7. Ask for LOI, deposit, or dated deployment.

Pass:

- 3 signed LOIs
- 1 paid deposit or dated deployment
- majority of farmers shown the report understand the recommendation

Fail:

- Pivot to software-only soil-test reporting.
