export interface AccessData {
  username: string;
  password: string;
  host: string;
  port: number;
  expires_at: string;
  created_at: string;
}

export interface PlaylistItem {
  name: string;
  url: string;
  logo: string;
  group: string;
  tvgId: string;
  tvgName: string;
}

export interface PlaylistCategories {
  [category: string]: PlaylistItem[];
}

export interface Notice {
  id: string;
  title: string;
  message: string;
  admin_name: string;
  created_at: string;
}

export type TabType = 'filmes' | 'series' | 'canais' | 'conta' | 'avisos';