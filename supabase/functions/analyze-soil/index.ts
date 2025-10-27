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
    const { image, location, context } = await req.json();
    
    if (!image) {
      return new Response(
        JSON.stringify({ error: 'Image is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an expert soil scientist with decades of experience analyzing soil health for Indian farmers. Analyze the soil image carefully and provide detailed, actionable insights in JSON format.

Your analysis should include:
1. Soil type, color, texture, moisture level, and organic matter content
2. Estimated mineral levels (N, P, K, pH)
3. Health score (0-100) and status
4. Priority-ranked recommendations with specific amounts and timing
5. Organic fertilizer and amendment suggestions with application rates
6. Top 3 crop recommendations with suitability scores

Be practical, specific, and focus on organic, sustainable solutions suitable for Indian agriculture.`;

    const userPrompt = `Analyze this soil image and provide detailed health assessment.
${context ? `Additional observations: ${context}` : ''}
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

    console.log('Calling OpenRouter API for soil analysis...');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://farm-advisory.lovable.app',
        'X-Title': 'Farm Advisory System'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: systemPrompt },
              { type: 'image_url', image_url: { url: image } },
              { type: 'text', text: userPrompt }
            ]
          }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
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

    const analysis = JSON.parse(analysisText);
    
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
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
