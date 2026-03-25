import { supabase } from "@/integrations/supabase/client";
import type { AccessData, PlaylistCategories } from "@/types/iptv";

export async function fetchPlaylist(username: string, password: string): Promise<PlaylistCategories> {
  const { data, error } = await supabase.functions.invoke('parse-playlist', {
    body: { username, password },
  });
  if (error) throw new Error(error.message);
  if (!data.success) throw new Error(data.error || 'Failed to fetch playlist');
  return data.categories;
}

export function getProxyUrl(streamUrl: string): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  return `${supabaseUrl}/functions/v1/proxy-stream?url=${encodeURIComponent(streamUrl)}`;
}

export async function getLatestAccess(): Promise<AccessData | null> {
  const { data } = await supabase
    .from('accesses')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  return data;
}

export async function saveAccess(access: Omit<AccessData, 'created_at'>): Promise<void> {
  const { error } = await supabase.functions.invoke('generate-access', {
    body: access,
  });
  if (error) console.error('Failed to save access:', error);
}

export async function getNotices() {
  const { data } = await supabase
    .from('notices')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
}