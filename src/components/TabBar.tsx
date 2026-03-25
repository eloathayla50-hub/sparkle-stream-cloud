import type { TabType } from "@/types/iptv";
import { Film, Tv, Radio, User, Bell } from "lucide-react";

interface TabBarProps {
  active: TabType;
  onChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'filmes', label: 'Filmes', icon: Film },
  { id: 'series', label: 'Séries', icon: Tv },
  { id: 'canais', label: 'Canais', icon: Radio },
  { id: 'conta', label: 'Conta', icon: User },
  { id: 'avisos', label: 'Avisos', icon: Bell },
];

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`tab-3d flex items-center gap-2 whitespace-nowrap ${active === tab.id ? 'active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}