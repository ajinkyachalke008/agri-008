export interface SoilAnalysis {
  analysis: {
    soilType: string;
    color: string;
    texture: string;
    moisture: string;
    organicMatter: string;
    healthScore: number;
    healthStatus: string;
  };
  minerals: {
    nitrogen: { level: string; note: string };
    phosphorus: { level: string; recommendation?: string };
    potassium: { level: string; note: string };
    pH: { estimated: string; status: string };
  };
  recommendations: Array<{
    priority: string;
    action: string;
    details: string;
    timing: string;
  }>;
  organicInputs: {
    fertilizers: Array<{
      name: string;
      benefit: string;
      application: string;
      timing: string;
    }>;
    amendments: Array<{
      name: string;
      benefit: string;
      application: string;
    }>;
  };
  cropSuitability: Array<{
    crop: string;
    suitability: string;
    score: number;
  }>;
}

export interface DiseaseDetection {
  detection: {
    diseaseDetected: boolean;
    confidence: number;
    diseaseName: string;
    scientificName: string;
    severity: string;
    affectedParts: string[];
  };
  symptoms: string[];
  causes: string[];
  treatment: {
    immediate: Array<{
      step: number;
      action: string;
      urgency: string;
      safety?: string;
    }>;
    organicSolutions: Array<{
      name: string;
      type: string;
      preparation: string;
      application: string;
      frequency: string;
      safety: string;
    }>;
    biologicalControl: Array<{
      name: string;
      type: string;
      application: string;
      benefit: string;
    }>;
  };
  prevention: string[];
  organicPesticides: Array<{
    name: string;
    activeIngredient: string;
    usage: string;
    safety: string;
  }>;
  whenToSeekHelp: string;
  estimatedRecovery: string;
}

export interface ScanResult<T> {
  success: boolean;
  analysis?: T;
  detection?: T;
  processingTime: number;
  timestamp: string;
  error?: string;
}
