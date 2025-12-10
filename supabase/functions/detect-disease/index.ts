import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const detection = JSON.parse(detectionText);
    
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
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
