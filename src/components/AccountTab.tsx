import type { AccessData } from "@/types/iptv";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface AccountTabProps {
  access: AccessData;
}

export function AccountTab({ access }: AccountTabProps) {
  const [showCredentials, setShowCredentials] = useState(false);

  const expiresDate = new Date(access.expires_at).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });
  const createdDate = new Date(access.created_at).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="glass-card-3d p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold glow-text">Minha Conta</h3>
          <button
            onClick={() => setShowCredentials(!showCredentials)}
            className="btn-player w-8 h-8 bg-secondary"
          >
            {showCredentials ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-background/50 p-4 rounded-xl space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Usuário</span>
              <span className={`font-mono text-sm font-bold text-primary ${!showCredentials ? 'obfuscated' : ''}`}>
                {access.username}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Senha</span>
              <span className={`font-mono text-sm font-bold text-primary ${!showCredentials ? 'obfuscated' : ''}`}>
                {access.password}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Host</span>
              <span className={`font-mono text-sm font-bold text-accent ${!showCredentials ? 'obfuscated' : ''}`}>
                {access.host}:{access.port}
              </span>
            </div>
          </div>

          <div className="bg-background/50 p-4 rounded-xl space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Criado em</span>
              <span className="text-sm font-body">{createdDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Expira em</span>
              <span className="text-sm font-bold text-destructive">{expiresDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}