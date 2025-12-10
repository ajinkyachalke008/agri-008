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

    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');
    
    if (!deepseekApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'DeepSeek API key not configured',
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
- Temperature: ${weatherData.current?.temp}°C (Feels like: ${weatherData.current?.feels_like}°C)
- Humidity: ${weatherData.current?.humidity}%
- Wind Speed: ${weatherData.current?.wind_speed} km/h
- Conditions: ${weatherData.current?.weather?.[0]?.description || 'Unknown'}

7-Day Forecast Summary:
${weatherData.daily?.slice(0, 7).map((day: any, i: number) => 
  `Day ${i + 1}: ${day.temp?.min}°C - ${day.temp?.max}°C, ${day.weather?.[0]?.description || 'Unknown'}, Rain: ${day.rain || 0}mm, Humidity: ${day.humidity}%`
).join('\n')}
    ` : 'No weather data available.';

    const systemPrompt = language === 'mr' 
      ? `तुम्ही एक कृषी सल्लागार आहात. शेतकऱ्यांना हवामान आधारित सल्ला द्या. मराठीत उत्तर द्या. संक्षिप्त आणि व्यावहारिक सल्ला द्या.`
      : `You are an agricultural advisor helping farmers in Maharashtra, India. Provide weather-based farming recommendations. Be concise and practical.`;

    const userPrompt = language === 'mr'
      ? `${cropsText}

हवामान माहिती:
${weatherSummary}

कृपया खालील गोष्टींबद्दल सल्ला द्या:
1. आज कोणत्या कामांसाठी चांगला वेळ आहे (सिंचन, खत, फवारणी)
2. आज कोणती कामे टाळावी
3. पुढील ७ दिवसांसाठी पीक-विशिष्ट शिफारसी
4. कोणत्याही हवामान इशाऱ्या`
      : `${cropsText}

Weather Information:
${weatherSummary}

Please provide advice on:
1. What farming activities are good to do today (irrigation, fertilization, spraying)
2. What activities to avoid today
3. Crop-specific recommendations for the next 7 days
4. Any weather warnings or alerts`;

    console.log('Calling DeepSeek API for crop advice...');
    
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', response.status, errorText);
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const advice = data.choices?.[0]?.message?.content;

    if (!advice) {
      throw new Error('No advice generated');
    }

    // Parse the advice into structured recommendations
    const recommendations = {
      goodFor: extractSection(advice, language === 'mr' ? 'चांगला वेळ' : 'good to do'),
      avoid: extractSection(advice, language === 'mr' ? 'टाळावी' : 'avoid'),
      cropAdvice: extractSection(advice, language === 'mr' ? 'शिफारसी' : 'recommendations'),
      warnings: extractSection(advice, language === 'mr' ? 'इशाऱ्या' : 'warnings'),
      fullAdvice: advice,
    };

    console.log('Crop advice generated successfully');

    return new Response(
      JSON.stringify(recommendations),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
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
      if (line.match(/^\d+\.|^-|^•/)) {
        results.push(line.replace(/^\d+\.|^-|^•/, '').trim());
      } else if (line.trim() === '' || line.match(/^[A-Z]|^[अ-ह]/)) {
        capturing = false;
      }
    }
  }
  
  return results.slice(0, 5);
}
