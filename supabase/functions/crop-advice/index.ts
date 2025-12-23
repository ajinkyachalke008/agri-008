import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Activity {
  activity: string;
  timing: string;
  recommendation: 'should_do' | 'avoid' | 'optimal';
  reason: string;
  details: string;
}

interface CropAdvice {
  activities: Activity[];
  goodFor: string[];
  avoid: string[];
  cropAdvice: string[];
  warnings: string[];
  summary: string;
  fullAdvice?: string;
}

// Safe JSON parse with validation for crop advice
function safeParseAdvice(content: string, weatherData: Record<string, unknown>): CropAdvice {
  try {
    // Extract JSON from the response (handle markdown code blocks)
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                      content.match(/```\s*([\s\S]*?)\s*```/) ||
                      [null, content];
    const jsonStr = jsonMatch[1] || content;
    const parsed = JSON.parse(jsonStr.trim());
    
    // Validate and sanitize activities
    const activities: Activity[] = Array.isArray(parsed.activities) 
      ? parsed.activities.slice(0, 10).map((item: Record<string, unknown>) => ({
          activity: typeof item.activity === 'string' ? String(item.activity).slice(0, 100) : 'Activity',
          timing: typeof item.timing === 'string' ? String(item.timing).slice(0, 100) : '',
          recommendation: ['should_do', 'avoid', 'optimal'].includes(String(item.recommendation)) 
            ? item.recommendation as 'should_do' | 'avoid' | 'optimal'
            : 'should_do',
          reason: typeof item.reason === 'string' ? String(item.reason).slice(0, 300) : '',
          details: typeof item.details === 'string' ? String(item.details).slice(0, 500) : ''
        }))
      : generateDefaultActivities(weatherData);
    
    return {
      activities,
      goodFor: Array.isArray(parsed.goodFor) 
        ? parsed.goodFor.filter((g: unknown) => typeof g === 'string').map((g: string) => String(g).slice(0, 200)).slice(0, 10)
        : [],
      avoid: Array.isArray(parsed.avoid) 
        ? parsed.avoid.filter((a: unknown) => typeof a === 'string').map((a: string) => String(a).slice(0, 200)).slice(0, 10)
        : [],
      cropAdvice: Array.isArray(parsed.cropAdvice) 
        ? parsed.cropAdvice.filter((c: unknown) => typeof c === 'string').map((c: string) => String(c).slice(0, 300)).slice(0, 10)
        : [],
      warnings: Array.isArray(parsed.warnings) 
        ? parsed.warnings.filter((w: unknown) => typeof w === 'string').map((w: string) => String(w).slice(0, 300)).slice(0, 10)
        : [],
      summary: typeof parsed.summary === 'string' ? String(parsed.summary).slice(0, 500) : '',
      fullAdvice: content
    };
  } catch (e) {
    console.log('Failed to parse JSON, using text extraction fallback:', e);
    // Fallback to text extraction if JSON parsing fails
    return {
      activities: generateDefaultActivities(weatherData),
      goodFor: extractSection(content, 'good'),
      avoid: extractSection(content, 'avoid'),
      cropAdvice: extractSection(content, 'advice'),
      warnings: extractSection(content, 'warning'),
      summary: content.substring(0, 200),
      fullAdvice: content,
    };
  }
}

function generateDefaultActivities(weatherData: Record<string, unknown>): Activity[] {
  const current = weatherData?.current as Record<string, unknown> | undefined;
  const temp = typeof current?.temp === 'number' ? current.temp : 25;
  const humidity = typeof current?.humidity === 'number' ? current.humidity : 60;
  const windSpeed = typeof current?.wind_speed === 'number' ? current.wind_speed : 10;
  const description = typeof current?.description === 'string' ? current.description : '';
  const isRainy = description.toLowerCase().includes('rain');

  const activities: Activity[] = [
    {
      activity: "Irrigation",
      timing: temp > 30 ? "Early morning 5-7 AM or Evening 5-7 PM" : "Morning 6-9 AM",
      recommendation: isRainy ? "avoid" : (humidity < 50 ? "optimal" : "should_do"),
      reason: isRainy ? "Rain expected, no irrigation needed" : (humidity < 50 ? "Low humidity, ideal for irrigation" : "Moderate conditions"),
      details: isRainy ? "Skip irrigation as rain is expected. Save water and let natural rainfall hydrate your crops." : "Apply water at the base of plants. Avoid wetting leaves to prevent fungal diseases."
    },
    {
      activity: "Pesticide Spraying",
      timing: windSpeed < 15 ? "Early morning 6-8 AM" : "Wait for calmer conditions",
      recommendation: windSpeed > 20 || isRainy ? "avoid" : "should_do",
      reason: windSpeed > 20 ? "High wind will cause spray drift" : (isRainy ? "Rain will wash off pesticides" : "Good conditions for spraying"),
      details: windSpeed > 20 ? "Postpone spraying. High winds will reduce effectiveness and may damage nearby crops." : "Use appropriate protective gear. Spray in the direction of wind for even coverage."
    },
    {
      activity: "Fertilizer Application",
      timing: "Morning 7-9 AM",
      recommendation: isRainy ? "optimal" : "should_do",
      reason: isRainy ? "Light rain helps fertilizer absorption" : "Apply before irrigation for best results",
      details: "Apply fertilizer evenly around the plant base. Water lightly after application to help nutrients reach the roots."
    },
    {
      activity: "Harvesting",
      timing: humidity < 60 ? "Morning 8-11 AM" : "Wait for drier conditions",
      recommendation: humidity > 80 || isRainy ? "avoid" : "optimal",
      reason: humidity > 80 ? "High moisture may damage harvested crops" : "Good conditions for harvesting",
      details: humidity > 80 ? "Wait for humidity to drop. Harvesting wet crops can lead to storage problems." : "Harvest when crops are dry. Store in cool, ventilated area."
    },
    {
      activity: "Weeding",
      timing: "Morning 7-10 AM",
      recommendation: temp > 35 ? "avoid" : "should_do",
      reason: temp > 35 ? "Too hot for field work" : "Good conditions for weeding",
      details: temp > 35 ? "Postpone to cooler hours to avoid heat stress." : "Remove weeds before they seed. Dispose of weeds away from the field."
    }
  ];

  return activities;
}

function extractSection(text: string, keyword: string): string[] {
  const lines = text.split('\n');
  const results: string[] = [];
  let capturing = false;
  
  for (const line of lines) {
    if (line.toLowerCase().includes(keyword.toLowerCase())) {
      capturing = true;
      continue;
    }
    if (capturing) {
      if (line.match(/^\d+\.|^-|^•|^\*/)) {
        results.push(line.replace(/^\d+\.|^-|^•|^\*/, '').trim().slice(0, 200));
      } else if (line.trim() === '' || line.match(/^[A-Z]|^[अ-ह]/)) {
        capturing = false;
      }
    }
  }
  
  return results.slice(0, 5);
}

// Input validation helpers
function sanitizeCrops(crops: unknown): string[] {
  if (!Array.isArray(crops)) return [];
  return crops
    .filter((c): c is string => typeof c === 'string')
    .map(c => c.trim().slice(0, 50).replace(/[<>{}[\]\\]/g, ''))
    .filter(c => c.length > 0)
    .slice(0, 20);
}

function sanitizeWeatherData(data: unknown): Record<string, unknown> | null {
  if (typeof data !== 'object' || data === null) return null;
  // Accept weather data as-is since it comes from our own weather function
  // but limit the size to prevent abuse
  const jsonStr = JSON.stringify(data);
  if (jsonStr.length > 50000) return null;
  return data as Record<string, unknown>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    // Verify user
    const supabaseAuth = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      global: { headers: { Authorization: authHeader } }
    });
    
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Authenticated user:', user.id);

    const body = await req.json();
    
    // Validate and sanitize inputs
    const weatherData = sanitizeWeatherData(body.weatherData);
    const crops = sanitizeCrops(body.crops);
    const language = ['en', 'mr'].includes(body.language) ? body.language : 'en';

    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          error: 'AI service not configured',
          needsApiKey: true 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const cropsText = crops && crops.length > 0 
      ? `The farmer is growing: ${crops.join(', ')}.` 
      : 'No specific crops mentioned.';

    const current = weatherData?.current as Record<string, unknown> | undefined;
    const daily = weatherData?.daily as Array<Record<string, unknown>> | undefined;
    
    const weatherSummary = weatherData ? `
Current Weather:
- Temperature: ${current?.temp ?? 'N/A'}°C (Feels like: ${current?.feels_like ?? 'N/A'}°C)
- Humidity: ${current?.humidity ?? 'N/A'}%
- Wind Speed: ${current?.wind_speed ?? 'N/A'} km/h
- Conditions: ${current?.description ?? 'Unknown'}

7-Day Forecast Summary:
${daily?.slice(0, 7).map((day, i: number) => {
  const temp = day.temp as Record<string, unknown> | undefined;
  return `Day ${i + 1}: ${temp?.min ?? 'N/A'}°C - ${temp?.max ?? 'N/A'}°C, ${day.description ?? 'Unknown'}, Rain: ${day.rain ?? 0}mm, Humidity: ${day.humidity ?? 'N/A'}%`;
}).join('\n') || 'No forecast available'}
    ` : 'No weather data available.';

    const systemPrompt = language === 'mr' 
      ? `तुम्ही महाराष्ट्रातील शेतकऱ्यांसाठी कृषी सल्लागार आहात. हवामान आधारित शेती सल्ला द्या. प्रतिसाद JSON स्वरूपात द्या.`
      : `You are an agricultural advisor for farmers in Maharashtra, India. Provide detailed weather-based farming recommendations. 

IMPORTANT: Respond ONLY with a valid JSON object in this exact format:
{
  "activities": [
    {
      "activity": "Activity name (e.g., Irrigation, Spraying, Harvesting, Fertilizing)",
      "timing": "Best time today (e.g., Early morning 6-8 AM)",
      "recommendation": "should_do" | "avoid" | "optimal",
      "reason": "Brief reason based on weather",
      "details": "Detailed instructions for this activity"
    }
  ],
  "goodFor": ["List of activities good for today"],
  "avoid": ["List of activities to avoid today"],
  "cropAdvice": ["Crop-specific advice items"],
  "warnings": ["Weather warnings if any"],
  "summary": "Brief overall summary for the day"
}`;

    const userPrompt = language === 'mr'
      ? `${cropsText}

हवामान माहिती:
${weatherSummary}

कृपया JSON स्वरूपात सल्ला द्या.`
      : `${cropsText}

Weather Information:
${weatherSummary}

Provide detailed farming activity recommendations including:
1. Best times for irrigation based on temperature and humidity
2. Optimal spraying schedule considering wind and rain
3. Harvesting recommendations
4. Fertilizer application timing
5. Any weather warnings

Respond with a valid JSON object only.`;

    console.log('Calling Lovable AI for crop advice...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const adviceText = data.choices?.[0]?.message?.content;

    if (!adviceText) {
      throw new Error('No advice generated');
    }

    console.log('AI response received');

    // Parse and validate the advice with fallbacks
    const recommendations = safeParseAdvice(adviceText, weatherData || {});

    console.log('Crop advice generated successfully');

    return new Response(
      JSON.stringify(recommendations),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in crop-advice function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
