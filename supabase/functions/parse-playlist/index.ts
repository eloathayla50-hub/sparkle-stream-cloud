import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlaylistItem {
  name: string;
  url: string;
  logo: string;
  group: string;
  tvgId: string;
  tvgName: string;
}

function parseM3U(content: string): PlaylistItem[] {
  const lines = content.split('\n');
  const items: PlaylistItem[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#EXTINF:')) {
      const logoMatch = line.match(/tvg-logo="([^"]*)"/);
      const groupMatch = line.match(/group-title="([^"]*)"/);
      const tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
      const tvgNameMatch = line.match(/tvg-name="([^"]*)"/);
      const nameMatch = line.match(/,(.+)$/);
      
      const nextLine = lines[i + 1]?.trim();
      if (nextLine && !nextLine.startsWith('#') && nextLine.length > 0) {
        items.push({
          name: nameMatch?.[1] || 'Unknown',
          url: nextLine,
          logo: logoMatch?.[1] || '',
          group: groupMatch?.[1] || 'Outros',
          tvgId: tvgIdMatch?.[1] || '',
          tvgName: tvgNameMatch?.[1] || '',
        });
      }
    }
  }
  
  return items;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      throw new Error('Username and password required');
    }

    const m3uUrl = `http://cdnflash.top:80/get.php?username=${username}&password=${password}&type=m3u_plus&output=mpegts`;
    
    const res = await fetch(m3uUrl);
    if (!res.ok) {
      throw new Error(`M3U fetch failed: ${res.status}`);
    }

    const content = await res.text();
    const items = parseM3U(content);

    const categories: Record<string, PlaylistItem[]> = {};
    for (const item of items) {
      if (!categories[item.group]) {
        categories[item.group] = [];
      }
      categories[item.group].push(item);
    }

    return new Response(JSON.stringify({
      success: true,
      total: items.length,
      categories,
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