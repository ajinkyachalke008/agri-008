import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SoilAnalysis {
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
  recommendations: Array<{ priority: string; action: string; details: string; timing: string }>;
  organicInputs: {
    fertilizers: Array<{ name: string; benefit: string; application: string; timing: string }>;
    amendments: Array<{ name: string; benefit: string; application: string }>;
  };
  cropSuitability: Array<{ crop: string; suitability: string; score: number }>;
}

// Safe JSON parse with validation for soil analysis
function safeParseAnalysis(jsonStr: string): SoilAnalysis | null {
  try {
    const parsed = JSON.parse(jsonStr);
    
    // Validate required analysis fields
    const analysis = parsed?.analysis;
    if (!analysis || typeof analysis !== 'object') {
      console.warn('Missing or invalid analysis object');
      return null;
    }
    
    // Sanitize and validate the analysis data
    const sanitized: SoilAnalysis = {
      analysis: {
        soilType: typeof analysis.soilType === 'string' 
          ? String(analysis.soilType).slice(0, 100) 
          : 'Unknown',
        color: typeof analysis.color === 'string' 
          ? String(analysis.color).slice(0, 200) 
          : 'Not determined',
        texture: ['Fine', 'Medium', 'Coarse'].includes(analysis.texture) 
          ? analysis.texture 
          : 'Medium',
        moisture: ['Adequate', 'Dry', 'Waterlogged'].includes(analysis.moisture) 
          ? analysis.moisture 
          : 'Unknown',
        organicMatter: ['High', 'Medium', 'Low'].includes(analysis.organicMatter) 
          ? analysis.organicMatter 
          : 'Unknown',
        healthScore: typeof analysis.healthScore === 'number' 
          ? Math.min(100, Math.max(0, Math.round(analysis.healthScore))) 
          : 50,
        healthStatus: ['Healthy', 'Fair', 'Poor'].includes(analysis.healthStatus) 
          ? analysis.healthStatus 
          : 'Unknown'
      },
      minerals: {
        nitrogen: {
          level: ['High', 'Medium', 'Low'].includes(parsed.minerals?.nitrogen?.level) 
            ? parsed.minerals.nitrogen.level 
            : 'Unknown',
          note: typeof parsed.minerals?.nitrogen?.note === 'string' 
            ? String(parsed.minerals.nitrogen.note).slice(0, 300) 
            : ''
        },
        phosphorus: {
          level: ['High', 'Medium', 'Low'].includes(parsed.minerals?.phosphorus?.level) 
            ? parsed.minerals.phosphorus.level 
            : 'Unknown',
          recommendation: typeof parsed.minerals?.phosphorus?.recommendation === 'string' 
            ? String(parsed.minerals.phosphorus.recommendation).slice(0, 300) 
            : undefined
        },
        potassium: {
          level: ['High', 'Medium', 'Low'].includes(parsed.minerals?.potassium?.level) 
            ? parsed.minerals.potassium.level 
            : 'Unknown',
          note: typeof parsed.minerals?.potassium?.note === 'string' 
            ? String(parsed.minerals.potassium.note).slice(0, 300) 
            : ''
        },
        pH: {
          estimated: typeof parsed.minerals?.pH?.estimated === 'string' 
            ? String(parsed.minerals.pH.estimated).slice(0, 50) 
            : 'Unknown',
          status: typeof parsed.minerals?.pH?.status === 'string' 
            ? String(parsed.minerals.pH.status).slice(0, 100) 
            : 'Unknown'
        }
      },
      recommendations: Array.isArray(parsed.recommendations) 
        ? parsed.recommendations.slice(0, 10).map((item: Record<string, unknown>) => ({
            priority: ['high', 'medium', 'low'].includes(String(item.priority).toLowerCase()) 
              ? String(item.priority).toLowerCase() 
              : 'medium',
            action: typeof item.action === 'string' ? String(item.action).slice(0, 200) : '',
            details: typeof item.details === 'string' ? String(item.details).slice(0, 500) : '',
            timing: typeof item.timing === 'string' ? String(item.timing).slice(0, 100) : ''
          }))
        : [],
      organicInputs: {
        fertilizers: Array.isArray(parsed.organicInputs?.fertilizers) 
          ? parsed.organicInputs.fertilizers.slice(0, 10).map((item: Record<string, unknown>) => ({
              name: typeof item.name === 'string' ? String(item.name).slice(0, 100) : '',
              benefit: typeof item.benefit === 'string' ? String(item.benefit).slice(0, 200) : '',
              application: typeof item.application === 'string' ? String(item.application).slice(0, 300) : '',
              timing: typeof item.timing === 'string' ? String(item.timing).slice(0, 100) : ''
            }))
          : [],
        amendments: Array.isArray(parsed.organicInputs?.amendments) 
          ? parsed.organicInputs.amendments.slice(0, 10).map((item: Record<string, unknown>) => ({
              name: typeof item.name === 'string' ? String(item.name).slice(0, 100) : '',
              benefit: typeof item.benefit === 'string' ? String(item.benefit).slice(0, 200) : '',
              application: typeof item.application === 'string' ? String(item.application).slice(0, 300) : ''
            }))
          : []
      },
      cropSuitability: Array.isArray(parsed.cropSuitability) 
        ? parsed.cropSuitability.slice(0, 10).map((item: Record<string, unknown>) => ({
            crop: typeof item.crop === 'string' ? String(item.crop).slice(0, 100) : '',
            suitability: ['Excellent', 'Good', 'Fair', 'Poor'].includes(String(item.suitability)) 
              ? String(item.suitability) 
              : 'Unknown',
            score: typeof item.score === 'number' 
              ? Math.min(100, Math.max(0, Math.round(item.score))) 
              : 50
          }))
        : []
    };
    
    return sanitized;
  } catch (e) {
    console.error('Failed to parse analysis data:', e);
    return null;
  }
}

// Input sanitization helpers
function sanitizeTextInput(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength).replace(/[<>{}[\]\\]/g, '');
}

function validateCoordinate(value: unknown, min: number, max: number): number | null {
  if (typeof value !== 'number') return null;
  if (isNaN(value) || value < min || value > max) return null;
  return Math.round(value * 10000) / 10000;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate and sanitize inputs
    const image = body.image;
    const context = sanitizeTextInput(body.context, 500);
    const location = body.location && typeof body.location === 'object' ? {
      lat: validateCoordinate(body.location.lat, -90, 90),
      lon: validateCoordinate(body.location.lon, -180, 180)
    } : null;
    
    if (!image || typeof image !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Image is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Basic image data validation (should be base64 or URL)
    if (image.length > 10000000) { // ~10MB limit
      return new Response(
        JSON.stringify({ error: 'Image too large' }),
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

    const systemPrompt = `You are an expert soil scientist with decades of experience analyzing soil health for Indian farmers. Analyze the soil description and provide detailed, actionable insights in JSON format.

Your analysis should include:
1. Soil type, color, texture, moisture level, and organic matter content
2. Estimated mineral levels (N, P, K, pH)
3. Health score (0-100) and status
4. Priority-ranked recommendations with specific amounts and timing
5. Organic fertilizer and amendment suggestions with application rates
6. Top 3 crop recommendations with suitability scores

Be practical, specific, and focus on organic, sustainable solutions suitable for Indian agriculture.`;

    const userPrompt = `Based on the soil image provided, analyze and provide detailed health assessment.
${context ? `Additional observations from farmer: ${context}` : 'The farmer has submitted a soil sample image for analysis.'}
${location ? `Location context: Lat ${location.lat}, Lon ${location.lon}` : ''}

Return a JSON object with this exact structure:
{
  "analysis": {
    "soilType": "string",
    "color": "string (with interpretation)",
    "texture": "Fine/Medium/Coarse",
    "moisture": "Adequate/Dry/Waterlogged",
    "organicMatter": "High/Medium/Low",
    "healthScore": number (0-100),
    "healthStatus": "Healthy/Fair/Poor"
  },
  "minerals": {
    "nitrogen": { "level": "High/Medium/Low", "note": "string" },
    "phosphorus": { "level": "High/Medium/Low", "recommendation": "string (if low)" },
    "potassium": { "level": "High/Medium/Low", "note": "string" },
    "pH": { "estimated": "string range", "status": "string" }
  },
  "recommendations": [
    {
      "priority": "high/medium/low",
      "action": "string",
      "details": "string",
      "timing": "string"
    }
  ],
  "organicInputs": {
    "fertilizers": [
      {
        "name": "string",
        "benefit": "string",
        "application": "string with rates",
        "timing": "string"
      }
    ],
    "amendments": [
      {
        "name": "string",
        "benefit": "string",
        "application": "string with rates"
      }
    ]
  },
  "cropSuitability": [
    { "crop": "string", "suitability": "Excellent/Good/Fair/Poor", "score": number (0-100) }
  ]
}`;

    console.log('Calling DeepSeek API for soil analysis...');
    
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
    const analysisText = data.choices?.[0]?.message?.content;
    
    if (!analysisText) {
      console.error('No analysis returned from API');
      return new Response(
        JSON.stringify({ error: 'No analysis generated' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate the analysis data
    const analysis = safeParseAnalysis(analysisText);
    
    if (!analysis) {
      console.error('Failed to parse valid analysis data');
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Soil analysis completed successfully');
    
    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        processingTime: data.usage?.total_tokens ? data.usage.total_tokens / 1000 : 0,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-soil function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
