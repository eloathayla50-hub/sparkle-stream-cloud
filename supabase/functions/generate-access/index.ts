import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { username, password, host, port, expires_at } = body;

    if (!username || !password) {
      throw new Error('Username and password required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase.from('accesses').insert({
      username,
      password,
      host: host || 'cdnflash.top',
      port: port || 80,
      expires_at: expires_at || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
    });

    if (dbError) {
      throw new Error(`DB error: ${dbError.message}`);
    }

    return new Response(JSON.stringify({
      success: true,
      username,
      password,
      host: host || 'cdnflash.top',
      port: port || 80,
      expires_at: expires_at || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});