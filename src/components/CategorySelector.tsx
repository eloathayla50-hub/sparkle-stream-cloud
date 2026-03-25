import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { PlaylistCategories } from "@/types/iptv";

interface CategorySelectorProps {
  categories: PlaylistCategories;
  selected: string;
  onChange: (category: string) => void;
  filterType: 'filmes' | 'series' | 'canais';
}

function filterCategories(categories: PlaylistCategories, type: string): string[] {
  const keys = Object.keys(categories);
  const typeLC = type.toLowerCase();

  return keys.filter((k) => {
    const kl = k.toLowerCase();
    if (typeLC === 'filmes') return kl.includes('filme') || kl.includes('movie') || kl.includes('lançamento');
    if (typeLC === 'series') return kl.includes('serie') || kl.includes('séri');
    if (typeLC === 'canais') return kl.includes('canal') || kl.includes('canai') || kl.includes('tv') || kl.includes('aberto') || kl.includes('globo') || kl.includes('sport') || kl.includes('hd') || kl.includes('fhd');
    return true;
  });
}

export function CategorySelector({ categories, selected, onChange, filterType }: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  
  let filteredKeys = filterCategories(categories, filterType);
  if (filteredKeys.length === 0) {
    filteredKeys = Object.keys(categories);
  }

  return (
    <div className="relative mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between glass-card px-4 py-3 text-sm font-body font-semibold"
      >
        <span className="truncate">{selected || 'Selecionar Categoria'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 glass-card max-h-60 overflow-y-auto z-20">
          {filteredKeys.map((cat) => (
            <button
              key={cat}
              className={`w-full text-left px-4 py-2.5 text-sm font-body hover:bg-secondary/50 transition-colors ${
                selected === cat ? 'text-primary font-bold' : 'text-foreground'
              }`}
              onClick={() => { onChange(cat); setOpen(false); }}
            >
              {cat} ({categories[cat]?.length || 0})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}