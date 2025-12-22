import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { weatherData, crops, language = 'en' } = await req.json();

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
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

    const weatherSummary = weatherData ? `
Current Weather:
- Temperature: ${weatherData.current?.temp || 'N/A'}°C (Feels like: ${weatherData.current?.feels_like || 'N/A'}°C)
- Humidity: ${weatherData.current?.humidity || 'N/A'}%
- Wind Speed: ${weatherData.current?.wind_speed || 'N/A'} km/h
- Conditions: ${weatherData.current?.description || 'Unknown'}

7-Day Forecast Summary:
${weatherData.daily?.slice(0, 7).map((day: any, i: number) => 
  `Day ${i + 1}: ${day.temp?.min || 'N/A'}°C - ${day.temp?.max || 'N/A'}°C, ${day.description || 'Unknown'}, Rain: ${day.rain || 0}mm, Humidity: ${day.humidity || 'N/A'}%`
).join('\n') || 'No forecast available'}
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

    console.log('Raw AI response:', adviceText);

    // Try to parse JSON from the response
    let recommendations;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = adviceText.match(/```json\s*([\s\S]*?)\s*```/) || 
                        adviceText.match(/```\s*([\s\S]*?)\s*```/) ||
                        [null, adviceText];
      const jsonStr = jsonMatch[1] || adviceText;
      recommendations = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.log('Failed to parse JSON, using text extraction fallback');
      // Fallback to text extraction if JSON parsing fails
      recommendations = {
        activities: generateDefaultActivities(weatherData),
        goodFor: extractSection(adviceText, 'good'),
        avoid: extractSection(adviceText, 'avoid'),
        cropAdvice: extractSection(adviceText, 'advice'),
        warnings: extractSection(adviceText, 'warning'),
        summary: adviceText.substring(0, 200),
        fullAdvice: adviceText,
      };
    }

    // Ensure all expected fields exist
    recommendations = {
      activities: recommendations.activities || generateDefaultActivities(weatherData),
      goodFor: recommendations.goodFor || [],
      avoid: recommendations.avoid || [],
      cropAdvice: recommendations.cropAdvice || [],
      warnings: recommendations.warnings || [],
      summary: recommendations.summary || '',
      fullAdvice: adviceText,
    };

    console.log('Crop advice generated successfully');

    return new Response(
      JSON.stringify(recommendations),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in crop-advice function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function generateDefaultActivities(weatherData: any) {
  const temp = weatherData?.current?.temp || 25;
  const humidity = weatherData?.current?.humidity || 60;
  const windSpeed = weatherData?.current?.wind_speed || 10;
  const isRainy = weatherData?.current?.description?.toLowerCase().includes('rain');

  const activities = [
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
      recommendation: isRainy ? "optimal" : (humidity > 70 ? "should_do" : "should_do"),
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
        results.push(line.replace(/^\d+\.|^-|^•|^\*/, '').trim());
      } else if (line.trim() === '' || line.match(/^[A-Z]|^[अ-ह]/)) {
        capturing = false;
      }
    }
  }
  
  return results.slice(0, 5);
}
