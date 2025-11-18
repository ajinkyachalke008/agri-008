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
    const { latitude, longitude, language = 'en' } = await req.json();

    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required');
    }

    const apiKey = Deno.env.get('OPENWEATHER_API_KEY');
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'OpenWeather API key not configured. Please add OPENWEATHER_API_KEY secret.',
          needsApiKey: true 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch weather data from OpenWeatherMap One Call API
    const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=metric&lang=${language}&appid=${apiKey}`;
    
    console.log('Fetching weather data for:', { latitude, longitude, language });
    
    const weatherResponse = await fetch(weatherUrl);
    
    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.text();
      console.error('OpenWeather API error:', errorData);
      throw new Error(`Weather API error: ${weatherResponse.status} - ${errorData}`);
    }

    const weatherData = await weatherResponse.json();

    // Transform the data to our format
    const transformedData = {
      current: {
        temp: Math.round(weatherData.current.temp),
        feels_like: Math.round(weatherData.current.feels_like),
        humidity: weatherData.current.humidity,
        wind_speed: Math.round(weatherData.current.wind_speed * 3.6), // Convert m/s to km/h
        weather: weatherData.current.weather,
        dt: weatherData.current.dt,
      },
      daily: weatherData.daily.slice(0, 7).map((day: any) => ({
        dt: day.dt,
        temp: {
          min: Math.round(day.temp.min),
          max: Math.round(day.temp.max),
        },
        weather: day.weather,
        humidity: day.humidity,
        wind_speed: Math.round(day.wind_speed * 3.6),
        rain: day.rain ? Math.round(day.rain) : 0,
        pop: Math.round(day.pop * 100), // Probability of precipitation
      })),
      hourly: weatherData.hourly.slice(0, 24).map((hour: any) => ({
        dt: hour.dt,
        temp: Math.round(hour.temp),
        weather: hour.weather,
        rain: hour.rain ? Math.round(hour.rain['1h'] || 0) : 0,
      })),
      alerts: weatherData.alerts || [],
    };

    console.log('Weather data fetched successfully');

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
