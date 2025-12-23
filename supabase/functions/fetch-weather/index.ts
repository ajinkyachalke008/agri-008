import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Weather code to description mapping for Open-Meteo
const weatherCodeToDescription: Record<number, { main: string; description: string; icon: string }> = {
  0: { main: 'Clear', description: 'Clear sky', icon: '01d' },
  1: { main: 'Clear', description: 'Mainly clear', icon: '01d' },
  2: { main: 'Clouds', description: 'Partly cloudy', icon: '02d' },
  3: { main: 'Clouds', description: 'Overcast', icon: '03d' },
  45: { main: 'Fog', description: 'Fog', icon: '50d' },
  48: { main: 'Fog', description: 'Depositing rime fog', icon: '50d' },
  51: { main: 'Drizzle', description: 'Light drizzle', icon: '09d' },
  53: { main: 'Drizzle', description: 'Moderate drizzle', icon: '09d' },
  55: { main: 'Drizzle', description: 'Dense drizzle', icon: '09d' },
  61: { main: 'Rain', description: 'Slight rain', icon: '10d' },
  63: { main: 'Rain', description: 'Moderate rain', icon: '10d' },
  65: { main: 'Rain', description: 'Heavy rain', icon: '10d' },
  71: { main: 'Snow', description: 'Slight snow', icon: '13d' },
  73: { main: 'Snow', description: 'Moderate snow', icon: '13d' },
  75: { main: 'Snow', description: 'Heavy snow', icon: '13d' },
  80: { main: 'Rain', description: 'Slight rain showers', icon: '09d' },
  81: { main: 'Rain', description: 'Moderate rain showers', icon: '09d' },
  82: { main: 'Rain', description: 'Violent rain showers', icon: '09d' },
  95: { main: 'Thunderstorm', description: 'Thunderstorm', icon: '11d' },
  96: { main: 'Thunderstorm', description: 'Thunderstorm with hail', icon: '11d' },
  99: { main: 'Thunderstorm', description: 'Thunderstorm with heavy hail', icon: '11d' },
};

function getWeatherFromCode(code: number) {
  const weather = weatherCodeToDescription[code] || { main: 'Unknown', description: 'Unknown', icon: '01d' };
  return [weather];
}

// Input validation for coordinates
function validateCoordinate(value: unknown, min: number, max: number): number | null {
  const num = typeof value === 'number' ? value : parseFloat(String(value));
  if (isNaN(num) || num < min || num > max) return null;
  return Math.round(num * 10000) / 10000; // 4 decimal precision
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate and sanitize inputs
    const latitude = validateCoordinate(body.latitude, -90, 90);
    const longitude = validateCoordinate(body.longitude, -180, 180);
    const language = ['en', 'mr', 'hi'].includes(body.language) ? body.language : 'en';

    if (latitude === null || longitude === null) {
      return new Response(
        JSON.stringify({ error: 'Invalid latitude or longitude. Latitude must be -90 to 90, longitude -180 to 180.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching weather data from Open-Meteo for:', { latitude, longitude, language });

    // Fetch weather data from Open-Meteo API (free, no API key required)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_days=7`;
    
    const weatherResponse = await fetch(weatherUrl);
    
    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.text();
      console.error('Open-Meteo API error:', errorData);
      throw new Error(`Weather API error: ${weatherResponse.status} - ${errorData}`);
    }

    const weatherData = await weatherResponse.json();
    console.log('Open-Meteo response received');

    // Transform the data to match our expected format
    const transformedData = {
      current: {
        temp: Math.round(weatherData.current.temperature_2m),
        feels_like: Math.round(weatherData.current.apparent_temperature),
        humidity: weatherData.current.relative_humidity_2m,
        wind_speed: Math.round(weatherData.current.wind_speed_10m),
        weather: getWeatherFromCode(weatherData.current.weather_code),
        dt: Math.floor(new Date().getTime() / 1000),
      },
      daily: weatherData.daily.time.map((time: string, index: number) => ({
        dt: Math.floor(new Date(time).getTime() / 1000),
        temp: {
          min: Math.round(weatherData.daily.temperature_2m_min[index]),
          max: Math.round(weatherData.daily.temperature_2m_max[index]),
        },
        weather: getWeatherFromCode(weatherData.daily.weather_code[index]),
        humidity: 0, // Open-Meteo doesn't provide daily humidity
        wind_speed: Math.round(weatherData.daily.wind_speed_10m_max[index]),
        rain: Math.round(weatherData.daily.precipitation_sum[index] || 0),
        pop: weatherData.daily.precipitation_probability_max[index] || 0,
      })),
      hourly: weatherData.hourly.time.slice(0, 24).map((time: string, index: number) => ({
        dt: Math.floor(new Date(time).getTime() / 1000),
        temp: Math.round(weatherData.hourly.temperature_2m[index]),
        weather: getWeatherFromCode(weatherData.hourly.weather_code[index]),
        rain: Math.round(weatherData.hourly.precipitation[index] || 0),
      })),
      alerts: [], // Open-Meteo free tier doesn't include alerts
    };

    console.log('Weather data transformed successfully');

    return new Response(
      JSON.stringify(transformedData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in fetch-weather function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
