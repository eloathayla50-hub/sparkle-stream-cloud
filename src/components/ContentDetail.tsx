import type { PlaylistItem } from "@/types/iptv";
import { ArrowLeft, Play } from "lucide-react";
import { useState } from "react";

interface ContentDetailProps {
  item: PlaylistItem;
  type: 'filmes' | 'series';
  onBack: () => void;
  onPlay: (url: string) => void;
}

export function ContentDetail({ item, type, onBack, onPlay }: ContentDetailProps) {
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  return (
    <div className="animate-slide-up space-y-4">
      <button onClick={onBack} className="btn-player w-10 h-10 bg-secondary">
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="glass-card-3d p-6">
        <div className="aspect-video bg-secondary/30 rounded-xl mb-4 flex items-center justify-center">
          <span className="text-4xl">{type === 'filmes' ? '🎬' : '📺'}</span>
        </div>

        <h2 className="font-display text-xl font-bold glow-text mb-2">
          {item.name}
        </h2>
        <p className="text-sm text-muted-foreground mb-4 font-body">
          {item.group} • Streaming Premium
        </p>

        <p className="text-sm text-foreground/80 mb-4 font-body leading-relaxed">
          Conteúdo premium disponível para reprodução imediata. Aproveite a qualidade Seven TV.
        </p>

        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {['Ator 1', 'Ator 2', 'Ator 3'].map((actor) => (
            <div key={actor} className="text-center shrink-0">
              <div className="w-12 h-12 rounded-full bg-secondary/50 mb-1 flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <p className="text-[10px] text-muted-foreground">{actor}</p>
            </div>
          ))}
        </div>

        {type === 'series' && (
          <div className="flex gap-2 mb-4">
            <select
              value={season}
              onChange={(e) => setSeason(Number(e.target.value))}
              className="bg-secondary text-foreground rounded-lg px-3 py-2 text-sm font-body border-none outline-none"
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <option key={s} value={s}>Temporada {s}</option>
              ))}
            </select>
            <select
              value={episode}
              onChange={(e) => setEpisode(Number(e.target.value))}
              className="bg-secondary text-foreground rounded-lg px-3 py-2 text-sm font-body border-none outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((ep) => (
                <option key={ep} value={ep}>Episódio {ep}</option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={() => onPlay(item.url)}
          className="w-full py-3 rounded-xl font-display text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          REPRODUZIR
        </button>
      </div>
    </div>
  );
}