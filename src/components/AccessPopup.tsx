import { Check } from "lucide-react";
import type { AccessData } from "@/types/iptv";

interface AccessPopupProps {
  access: AccessData;
  onClose: () => void;
}

export function AccessPopup({ access, onClose }: AccessPopupProps) {
  const expiresDate = new Date(access.expires_at).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center animate-pulse-glow">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h2 className="font-display text-2xl font-bold glow-text">
            Acesso Gerado!
          </h2>
          <p className="text-muted-foreground text-sm mt-1 font-body">
            Seven TV Premium
          </p>
        </div>

        <div className="space-y-3 bg-background/50 p-4 rounded-xl mb-6">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Usuário</span>
            <span className="font-display text-sm text-primary font-bold">
              {access.username}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Expira em</span>
            <span className="font-body text-sm text-destructive font-bold">
              {expiresDate}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-display text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          ENTRAR
        </button>
      </div>
    </div>
  );
}