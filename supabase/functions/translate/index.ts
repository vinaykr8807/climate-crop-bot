import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

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
    
    const IFLYTEK_APP_ID = Deno.env.get('IFLYTEK_APP_ID');
    const IFLYTEK_API_KEY = Deno.env.get('IFLYTEK_API_KEY');

    if (!IFLYTEK_APP_ID || !IFLYTEK_API_KEY) {
      throw new Error('iFlytek API credentials not configured');
    }

    // If source and target language are the same, return original text
    if (from === to) {
      return new Response(JSON.stringify({ translated_text: text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate timestamp and signature for iFlytek API
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(IFLYTEK_APP_ID + timestamp);
    const hashBuffer = await crypto.subtle.digest('MD5', encodedData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const checkSum = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const url = 'https://itrans.xfyun.cn/v2/its';
    
    const requestBody = {
      common: { app_id: IFLYTEK_APP_ID },
      business: {
        from: from,
        to: to,
      },
      data: {
        text: btoa(text),
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appid': IFLYTEK_APP_ID,
        'X-CurTime': timestamp,
        'X-CheckSum': checkSum,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error('iFlytek API error:', await response.text());
      throw new Error('Translation failed');
    }

    const responseData = await response.json();
    
    if (responseData.code !== 0) {
      throw new Error(`Translation error: ${responseData.message}`);
    }

    const translatedText = atob(responseData.data.result.trans_result.dst);

    console.log(`Translated from ${from} to ${to}`);

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
