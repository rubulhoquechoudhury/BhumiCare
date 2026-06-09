// Ideal soil parameters for tea (Camellia sinensis) cultivation
export const TEA_SOIL_STANDARDS = {
  ph: {
    label: "Soil pH",
    unit: "",
    min: 4.5,
    max: 5.5,
    ideal: 5.0,
    description: "Tea plants prefer acidic soil",
  },
  moisture: {
    label: "Soil Moisture",
    unit: "%",
    min: 60,
    max: 80,
    ideal: 70,
    description: "Adequate moisture for root health",
  },
  nitrogen: {
    label: "Nitrogen (N)",
    unit: "mg/kg",
    min: 280,
    max: 560,
    ideal: 420,
    description: "Essential for leaf growth and chlorophyll",
  },
  phosphorus: {
    label: "Phosphorus (P)",
    unit: "mg/kg",
    min: 30,
    max: 60,
    ideal: 45,
    description: "Supports root development and energy",
  },
  potassium: {
    label: "Potassium (K)",
    unit: "mg/kg",
    min: 100,
    max: 200,
    ideal: 150,
    description: "Improves disease resistance and flavor",
  },
} as const;

export const DEMO_SOIL_DATA = {
  ph: 5.2,
  moisture: 72,
  nitrogen: 310,
  phosphorus: 42,
  potassium: 165,
};

export type SoilParamKey = keyof typeof TEA_SOIL_STANDARDS;
