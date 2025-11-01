import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language, location } = await req.json();
    
    const OLLAMA_API_KEY = Deno.env.get('OLLAMA_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!OLLAMA_API_KEY) {
      throw new Error('Ollama API key not configured');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log('Processing chat request for language:', language);

    // Fetch weather and soil data in parallel
    const [weatherResponse, soilResponse] = await Promise.all([
      fetch(`${SUPABASE_URL}/functions/v1/weather`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify(location),
      }),
      fetch(`${SUPABASE_URL}/functions/v1/soil`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify(location),
      }),
    ]);

    const weatherData = await weatherResponse.json();
    const soilData = await soilResponse.json();

    // Translate user message to English if needed
    let translatedMessage = message;
    if (language !== 'en') {
      const translateResponse = await fetch(`${SUPABASE_URL}/functions/v1/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ text: message, from: language, to: 'en' }),
      });
      const translateData = await translateResponse.json();
      translatedMessage = translateData.translated_text;
    }

    // Create context for LLM
    const context = `
You are AgriGenius AI, an expert agricultural assistant helping farmers in India.

Current weather conditions for ${location.district}:
- Temperature: ${weatherData.current?.temperature}°C
- Humidity: ${weatherData.current?.humidity}%
- Weather: ${weatherData.current?.description}
- Wind Speed: ${weatherData.current?.wind_speed} m/s

Soil conditions:
- Moisture: ${soilData.soil?.moisture_percentage}%
- Status: ${soilData.soil?.status}
- Temperature: ${soilData.soil?.temperature}°C
- Recommendation: ${soilData.recommendation}

Farmer's question: ${translatedMessage}

Provide practical, actionable agricultural advice based on the current weather and soil conditions. Be concise and farmer-friendly.
`;

    // Call Ollama Cloud API
    console.log('Calling Ollama API...');
    const ollamaResponse = await fetch('https://ollama.com/api/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OLLAMA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-oss:20b-cloud',
        messages: [
          { role: 'system', content: 'You are an expert agricultural advisor. Keep answers safe and practical.' },
          { role: 'user', content: context }
        ],
        stream: false,
      }),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error('Ollama API error:', errorText);
      throw new Error('Failed to get AI response');
    }

    const ollamaData = await ollamaResponse.json();
    console.log('Ollama response received:', ollamaData);
    
    // Handle different response formats from Ollama
    let aiResponse: string;
    if (ollamaData.choices && ollamaData.choices[0]?.message?.content) {
      aiResponse = ollamaData.choices[0].message.content;
    } else if (ollamaData.message?.content) {
      aiResponse = ollamaData.message.content;
    } else if (ollamaData.response) {
      aiResponse = ollamaData.response;
    } else if (ollamaData.content) {
      aiResponse = ollamaData.content;
    } else {
      console.error('Unexpected Ollama response format:', ollamaData);
      aiResponse = JSON.stringify(ollamaData).substring(0, 1500);
    }

    // Translate response back to user's language if needed
    let translatedResponse = aiResponse;
    if (language !== 'en') {
      const translateBackResponse = await fetch(`${SUPABASE_URL}/functions/v1/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ text: aiResponse, from: 'en', to: language }),
      });
      const translateBackData = await translateBackResponse.json();
      translatedResponse = translateBackData.translated_text;
    }

    // Store chat history
    await supabase.from('chat_history').insert({
      user_message: message,
      translated_message: translatedMessage,
      llm_response: aiResponse,
      translated_response: translatedResponse,
      weather: weatherData,
      soil: soilData,
      source: 'web',
    });

    console.log('Chat processed successfully');

    return new Response(
      JSON.stringify({
        response: translatedResponse,
        weather: weatherData,
        soil: soilData,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Chat error:', error);
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
