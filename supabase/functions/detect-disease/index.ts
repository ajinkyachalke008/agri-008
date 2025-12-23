import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DiseaseDetection {
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
    immediate: Array<{ step: number; action: string; urgency: string; safety?: string }>;
    organicSolutions: Array<{ name: string; type: string; preparation: string; application: string; frequency: string; safety: string }>;
    biologicalControl: Array<{ name: string; type: string; application: string; benefit: string }>;
  };
  prevention: string[];
  organicPesticides: Array<{ name: string; activeIngredient: string; usage: string; safety: string }>;
  whenToSeekHelp: string;
  estimatedRecovery: string;
}

// Safe JSON parse with validation for disease detection
function safeParseDetection(jsonStr: string): DiseaseDetection | null {
  try {
    const parsed = JSON.parse(jsonStr);
    
    // Validate required detection fields
    const detection = parsed?.detection;
    if (!detection || typeof detection !== 'object') {
      console.warn('Missing or invalid detection object');
      return null;
    }
    
    // Sanitize and validate the detection data
    const sanitized: DiseaseDetection = {
      detection: {
        diseaseDetected: Boolean(detection.diseaseDetected),
        confidence: typeof detection.confidence === 'number' 
          ? Math.min(100, Math.max(0, detection.confidence)) 
          : 0,
        diseaseName: typeof detection.diseaseName === 'string' 
          ? String(detection.diseaseName).slice(0, 200) 
          : 'Unknown',
        scientificName: typeof detection.scientificName === 'string' 
          ? String(detection.scientificName).slice(0, 200) 
          : '',
        severity: ['Mild', 'Moderate', 'Severe'].includes(detection.severity) 
          ? detection.severity 
          : 'Unknown',
        affectedParts: Array.isArray(detection.affectedParts) 
          ? detection.affectedParts.filter((p: unknown) => typeof p === 'string').map((p: string) => String(p).slice(0, 100)).slice(0, 10)
          : []
      },
      symptoms: Array.isArray(parsed.symptoms) 
        ? parsed.symptoms.filter((s: unknown) => typeof s === 'string').map((s: string) => String(s).slice(0, 200)).slice(0, 20)
        : [],
      causes: Array.isArray(parsed.causes) 
        ? parsed.causes.filter((c: unknown) => typeof c === 'string').map((c: string) => String(c).slice(0, 200)).slice(0, 10)
        : [],
      treatment: {
        immediate: Array.isArray(parsed.treatment?.immediate) 
          ? parsed.treatment.immediate.slice(0, 10).map((item: Record<string, unknown>) => ({
              step: typeof item.step === 'number' ? item.step : 0,
              action: typeof item.action === 'string' ? String(item.action).slice(0, 500) : '',
              urgency: typeof item.urgency === 'string' ? String(item.urgency).slice(0, 50) : 'medium',
              safety: typeof item.safety === 'string' ? String(item.safety).slice(0, 200) : undefined
            }))
          : [],
        organicSolutions: Array.isArray(parsed.treatment?.organicSolutions) 
          ? parsed.treatment.organicSolutions.slice(0, 10).map((item: Record<string, unknown>) => ({
              name: typeof item.name === 'string' ? String(item.name).slice(0, 100) : '',
              type: typeof item.type === 'string' ? String(item.type).slice(0, 50) : '',
              preparation: typeof item.preparation === 'string' ? String(item.preparation).slice(0, 500) : '',
              application: typeof item.application === 'string' ? String(item.application).slice(0, 500) : '',
              frequency: typeof item.frequency === 'string' ? String(item.frequency).slice(0, 100) : '',
              safety: typeof item.safety === 'string' ? String(item.safety).slice(0, 200) : ''
            }))
          : [],
        biologicalControl: Array.isArray(parsed.treatment?.biologicalControl) 
          ? parsed.treatment.biologicalControl.slice(0, 10).map((item: Record<string, unknown>) => ({
              name: typeof item.name === 'string' ? String(item.name).slice(0, 100) : '',
              type: typeof item.type === 'string' ? String(item.type).slice(0, 50) : '',
              application: typeof item.application === 'string' ? String(item.application).slice(0, 500) : '',
              benefit: typeof item.benefit === 'string' ? String(item.benefit).slice(0, 200) : ''
            }))
          : []
      },
      prevention: Array.isArray(parsed.prevention) 
        ? parsed.prevention.filter((p: unknown) => typeof p === 'string').map((p: string) => String(p).slice(0, 300)).slice(0, 10)
        : [],
      organicPesticides: Array.isArray(parsed.organicPesticides) 
        ? parsed.organicPesticides.slice(0, 10).map((item: Record<string, unknown>) => ({
            name: typeof item.name === 'string' ? String(item.name).slice(0, 100) : '',
            activeIngredient: typeof item.activeIngredient === 'string' ? String(item.activeIngredient).slice(0, 100) : '',
            usage: typeof item.usage === 'string' ? String(item.usage).slice(0, 300) : '',
            safety: typeof item.safety === 'string' ? String(item.safety).slice(0, 200) : ''
          }))
        : [],
      whenToSeekHelp: typeof parsed.whenToSeekHelp === 'string' 
        ? String(parsed.whenToSeekHelp).slice(0, 500) 
        : 'Consult an agricultural expert if symptoms persist.',
      estimatedRecovery: typeof parsed.estimatedRecovery === 'string' 
        ? String(parsed.estimatedRecovery).slice(0, 200) 
        : 'Varies depending on severity.'
    };
    
    return sanitized;
  } catch (e) {
    console.error('Failed to parse detection data:', e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, plantType, symptoms } = await req.json();
    
    if (!image) {
      return new Response(
        JSON.stringify({ error: 'Image is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');
    if (!DEEPSEEK_API_KEY) {
      console.error('DEEPSEEK_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an expert plant pathologist specializing in crop diseases common to Indian agriculture. Analyze plant/leaf descriptions to detect diseases, identify causes, and recommend organic treatment solutions.

Your analysis should include:
1. Disease detection with confidence level and severity assessment
2. Visible symptoms and underlying causes
3. Step-by-step immediate treatment actions
4. Detailed organic solutions with preparation and application methods
5. Biological control options
6. Prevention strategies for future crops
7. Safety guidelines for all treatments

Focus on organic, farmer-friendly solutions using locally available materials. Be specific with measurements, timing, and application methods.`;

    const userPrompt = `Analyze this plant for disease detection and diagnosis.
${plantType ? `Plant type: ${plantType}` : 'Unknown plant type'}
${symptoms ? `Observed symptoms: ${symptoms}` : 'Farmer has submitted a plant image for disease analysis.'}

Based on the information provided, return a JSON object with this exact structure:
{
  "detection": {
    "diseaseDetected": boolean,
    "confidence": number (0-100),
    "diseaseName": "string",
    "scientificName": "string",
    "severity": "Mild/Moderate/Severe",
    "affectedParts": ["string array"]
  },
  "symptoms": ["string array of visible symptoms"],
  "causes": ["string array of contributing factors"],
  "treatment": {
    "immediate": [
      {
        "step": number,
        "action": "string",
        "urgency": "high/medium/low",
        "safety": "string (optional)"
      }
    ],
    "organicSolutions": [
      {
        "name": "string",
        "type": "Spray/Drench/Powder/etc",
        "preparation": "string with exact measurements",
        "application": "string with method and frequency",
        "frequency": "string",
        "safety": "string"
      }
    ],
    "biologicalControl": [
      {
        "name": "string",
        "type": "string",
        "application": "string",
        "benefit": "string"
      }
    ]
  },
  "prevention": ["string array of prevention tips"],
  "organicPesticides": [
    {
      "name": "string",
      "activeIngredient": "string",
      "usage": "string",
      "safety": "string"
    }
  ],
  "whenToSeekHelp": "string",
  "estimatedRecovery": "string"
}

If no disease is detected, set diseaseDetected to false and provide general plant health observations.`;

    console.log('Calling DeepSeek API for disease detection...');
    
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `AI analysis failed: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const detectionText = data.choices?.[0]?.message?.content;
    
    if (!detectionText) {
      console.error('No detection returned from API');
      return new Response(
        JSON.stringify({ error: 'No detection generated' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate the detection data
    const detection = safeParseDetection(detectionText);
    
    if (!detection) {
      console.error('Failed to parse valid detection data');
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Disease detection completed successfully');
    
    return new Response(
      JSON.stringify({
        success: true,
        detection,
        processingTime: data.usage?.total_tokens ? data.usage.total_tokens / 1000 : 0,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in detect-disease function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
