import React, { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Star, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export interface FavoriteMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarFavoritesProps {
  items: FavoriteMenuItem[];
  activeTab: string;
  onItemClick: (id: string) => void;
  isCollapsed: boolean;
}

const STORAGE_KEY = 'sidebar_favorites_open_v2';
const MAX_VISIBLE = 5;

export const SidebarFavorites: React.FC<SidebarFavoritesProps> = ({
  items,
  activeTab,
  onItemClick,
  isCollapsed,
}) => {
  // ⚠️ Replié par défaut pour ne pas écraser les 4 onglets de catégories
  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) === '1';
  });
  const [showAll, setShowAll] = useState(false);

  if (items.length === 0) return null;

  if (isCollapsed) {
    return (
      <div className="px-2 pt-1 pb-2 space-y-1 border-b border-border">
        {items.slice(0, 5).map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onItemClick(item.id)}
                  className={cn(
                    'w-full flex items-center justify-center p-2 rounded-xl transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-card text-muted-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                ⭐ {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    );
  }

  const toggle = () => {
    const next = !open;
    setOpen(next);
    localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
  };

  const visibleItems = showAll ? items : items.slice(0, MAX_VISIBLE);
  const hasMore = items.length > MAX_VISIBLE;

  return (
    <div className="px-2 pb-1.5 border-b border-border">
      <button
        onClick={toggle}
        className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-card/60 transition-colors"
      >
        <Star className="w-3 h-3 text-kdp-orange fill-kdp-orange flex-shrink-0" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex-1 text-left">
          Favoris
        </span>
        <span className="text-[10px] font-semibold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
          {items.length}
        </span>
        <ChevronDown className={cn(
          "w-3 h-3 text-muted-foreground transition-transform",
          open ? "rotate-0" : "-rotate-90"
        )} />
      </button>
      {open && (
        <div className="space-y-0 mt-0.5">
          {visibleItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-all text-left group',
                  isActive
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-card/80'
                )}
              >
                <Icon
                  className={cn(
                    'w-3.5 h-3.5 flex-shrink-0',
                    isActive ? 'text-kdp-orange' : 'text-muted-foreground'
                  )}
                />
                <span
                  className={cn(
                    'text-[12.5px] flex-1 truncate leading-tight',
                    isActive
                      ? 'font-semibold text-kdp-orange'
                      : 'text-foreground group-hover:text-kdp-orange'
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
          {hasMore && (
            <button
              onClick={() => setShowAll(s => !s)}
              className="w-full text-[10.5px] text-muted-foreground hover:text-kdp-orange py-1 transition-colors"
            >
              {showAll ? '− Réduire' : `+ ${items.length - MAX_VISIBLE} de plus`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
