import React, { useEffect, useState } from 'react';
import { PenTool, Palette, Mic, BarChart3, Megaphone } from 'lucide-react';

const PILLARS = [
  { id: 'pilier-ecrire', icon: PenTool, label: 'Écrire', color: 'text-emerald-500' },
  { id: 'pilier-visuels', icon: Palette, label: 'Visuels', color: 'text-violet-500' },
  { id: 'pilier-audio', icon: Mic, label: 'Audio', color: 'text-blue-500' },
  { id: 'pilier-kdp', icon: BarChart3, label: 'KDP', color: 'text-kdp-orange' },
  { id: 'pilier-marketing', icon: Megaphone, label: 'Marketing', color: 'text-rose-500' },
];

const ToolsNavigationBar: React.FC = () => {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      // Highlight pilier currently in view
      let current: string | null = null;
      for (const p of PILLARS) {
        const el = document.getElementById(p.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < 200 && rect.bottom > 200) current = p.id;
        }
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="sticky top-[110px] z-40 bg-background/85 backdrop-blur-xl border-y border-border">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto">
        <span className="hidden md:inline text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-3">
          Explorer :
        </span>
        {PILLARS.map((p) => {
          const Icon = p.icon;
          const isActive = active === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handleClick(p.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-primary/10 text-primary scale-105'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : p.color}`} />
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ToolsNavigationBar;
