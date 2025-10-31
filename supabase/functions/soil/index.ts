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

    // Using NASA POWER API for soil moisture and agricultural data
    // This is a free API that provides solar and meteorological data
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date();
    
    const dateFormat = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    const soilUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOTCORR,RH2M,T2M,ALLSKY_SFC_SW_DWN&community=AG&longitude=${longitude}&latitude=${latitude}&start=${dateFormat(startDate)}&end=${dateFormat(endDate)}&format=JSON`;

    console.log('Fetching soil data from NASA POWER API');
    const response = await fetch(soilUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch soil data');
    }

    const data = await response.json();
    const parameters = data.properties.parameter;

    // Calculate averages with type safety
    const calcAvg = (obj: Record<string, number>) => {
      const values = Object.values(obj);
      return values.reduce((a, b) => a + b, 0) / values.length;
    };

    const avgTemp = calcAvg(parameters.T2M as Record<string, number>);
    const avgHumidity = calcAvg(parameters.RH2M as Record<string, number>);
    const avgPrecip = calcAvg(parameters.PRECTOTCORR as Record<string, number>);
    const avgSolar = calcAvg(parameters.ALLSKY_SFC_SW_DWN as Record<string, number>);

    // Estimate soil moisture based on precipitation and humidity
    const estimatedMoisture = Math.min(100, (avgPrecip * 10 + avgHumidity) / 2);

    const result = {
      location: {
        district: district,
        coordinates: { latitude, longitude },
      },
      soil: {
        moisture_percentage: Math.round(estimatedMoisture * 10) / 10,
        temperature: Math.round(avgTemp * 10) / 10,
        status: estimatedMoisture > 70 ? 'Wet' : estimatedMoisture > 40 ? 'Moderate' : 'Dry',
      },
      climate: {
        avg_precipitation_mm: Math.round(avgPrecip * 10) / 10,
        avg_humidity_percent: Math.round(avgHumidity * 10) / 10,
        avg_solar_radiation: Math.round(avgSolar * 10) / 10,
      },
      recommendation: estimatedMoisture < 40 
        ? 'Soil is dry. Consider irrigation for optimal crop growth.'
        : estimatedMoisture > 70 
        ? 'Soil has high moisture. Ensure proper drainage to prevent waterlogging.'
        : 'Soil moisture is at optimal levels for most crops.',
    };

    console.log('Soil data processed successfully for', district);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching soil data:', error);
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
