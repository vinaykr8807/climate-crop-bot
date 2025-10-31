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
    const { latitude, longitude, district } = await req.json();
    const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY');

    if (!OPENWEATHER_API_KEY) {
      throw new Error('OpenWeatherMap API key not configured');
    }

    // Fetch current weather and forecast
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl)
    ]);

    if (!weatherResponse.ok || !forecastResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    const result = {
      current: {
        temperature: weatherData.main.temp,
        feels_like: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        description: weatherData.weather[0].description,
        wind_speed: weatherData.wind.speed,
        clouds: weatherData.clouds.all,
      },
      forecast: forecastData.list.slice(0, 8).map((item: any) => ({
        datetime: item.dt_txt,
        temperature: item.main.temp,
        humidity: item.main.humidity,
        description: item.weather[0].description,
        rain_probability: item.pop * 100,
      })),
      location: {
        district: district || weatherData.name,
        coordinates: { latitude, longitude },
      },
    };

    console.log('Weather data fetched successfully for', district);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
