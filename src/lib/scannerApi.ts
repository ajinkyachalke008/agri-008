import { supabase } from "@/integrations/supabase/client";
import type { SoilAnalysis, DiseaseDetection, ScanResult } from "@/types/scanner";

export const analyzeSoil = async (
  image: string,
  context?: { location?: { lat: number; lon: number }; observations?: string }
): Promise<ScanResult<SoilAnalysis>> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-soil', {
      body: {
        image,
        location: context?.location,
        context: context?.observations
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Soil analysis error:', error);
    throw error;
  }
};

export const detectDisease = async (
  image: string,
  plantType?: string,
  symptoms?: string
): Promise<ScanResult<DiseaseDetection>> => {
  try {
    const { data, error } = await supabase.functions.invoke('detect-disease', {
      body: {
        image,
        plantType,
        symptoms
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Disease detection error:', error);
    throw error;
  }
};
