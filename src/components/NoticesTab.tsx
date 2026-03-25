import type { Notice } from "@/types/iptv";
import { useState } from "react";
import { Bell, X, ChevronRight } from "lucide-react";

interface NoticesTabProps {
  notices: Notice[];
}

export function NoticesTab({ notices }: NoticesTabProps) {
  const [selected, setSelected] = useState<Notice | null>(null);

  if (selected) {
    return (
      <div className="animate-slide-up">
        <div className="glass-card-3d p-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setSelected(null)} className="btn-player w-8 h-8 bg-secondary">
              <X className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground">{selected.admin_name}</span>
          </div>
          <h3 className="font-display text-xl font-bold glow-text mb-3">
            {selected.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            {new Date(selected.created_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
          </p>
          <div className="bg-background/50 p-4 rounded-xl">
            <p className="font-body text-sm leading-relaxed text-foreground">
              {selected.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-slide-up">
      {notices.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-display">Nenhum aviso</p>
        </div>
      ) : (
        notices.map((notice) => (
          <div
            key={notice.id}
            className="notice-card flex items-center gap-3"
            onClick={() => setSelected(notice)}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm font-bold truncate">{notice.title}</p>
              <p className="text-xs text-muted-foreground">
                {notice.admin_name} • {new Date(notice.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </div>
        ))
      )}
    </div>
  );
}