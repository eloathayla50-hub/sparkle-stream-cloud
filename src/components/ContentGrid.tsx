import { useState } from "react";
import type { PlaylistItem } from "@/types/iptv";
import { Loader2 } from "lucide-react";

interface ContentGridProps {
  items: PlaylistItem[];
  type: 'filmes' | 'series' | 'canais';
  onSelect: (item: PlaylistItem) => void;
}

export function ContentGrid({ items, type, onSelect }: ContentGridProps) {
  const [loadingItem, setLoadingItem] = useState<string | null>(null);

  const handleClick = (item: PlaylistItem) => {
    if (type === 'canais') {
      onSelect(item);
      return;
    }
    setLoadingItem(item.name);
    setTimeout(() => {
      setLoadingItem(null);
      onSelect(item);
    }, 1200);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="font-display text-lg">Nenhum conteúdo encontrado</p>
        <p className="text-sm mt-1">Carregue a playlist para ver o conteúdo</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map((item, idx) => (
        <div
          key={`${item.name}-${idx}`}
          className="content-card relative overflow-hidden"
          onClick={() => handleClick(item)}
          style={{ animationDelay: `${idx * 50}ms` }}
        >
          {loadingItem === item.name && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
              <div className="text-center">
                <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mb-1" />
                <p className="text-xs text-primary font-display">Baixando...</p>
              </div>
            </div>
          )}
          <div className="aspect-video bg-secondary/50 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
            <div className="glow-text font-display text-xs font-bold text-center px-2">
              {type === 'filmes' ? '🎬' : type === 'series' ? '📺' : '📡'}
            </div>
          </div>
          <p className="font-body text-xs font-semibold truncate text-foreground">
            {item.name}
          </p>
          <p className="text-[10px] text-muted-foreground truncate">
            {item.group}
          </p>
        </div>
      ))}
    </div>
  );
}