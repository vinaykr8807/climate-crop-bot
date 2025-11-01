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
    const { text, from, to } = await req.json();

    // If source and target language are the same, return original text
    if (from === to) {
      return new Response(JSON.stringify({ translated_text: text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Translating from ${from} to ${to} using LibreTranslate`);

    // Use LibreTranslate (free, no API key needed, supports Hindi and Indian languages)
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: from === 'auto' ? 'auto' : from,
        target: to,
        format: 'text',
      }),
    });

    if (!response.ok) {
      console.error('LibreTranslate API error:', response.status);
      throw new Error('Translation failed');
    }

    const data = await response.json();
    const translatedText = data.translatedText || text;

    console.log(`Translated successfully: ${text.substring(0, 50)}... -> ${translatedText.substring(0, 50)}...`);

    return new Response(
      JSON.stringify({ translated_text: translatedText }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Translation error:', error);
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
