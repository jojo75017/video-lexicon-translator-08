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

const STORAGE_KEY = 'sidebar_favorites_open_v1';

export const SidebarFavorites: React.FC<SidebarFavoritesProps> = ({
  items,
  activeTab,
  onItemClick,
  isCollapsed,
}) => {
  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return items.length > 0;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === '0') return false;
    if (saved === '1') return true;
    return items.length > 0;
  });

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

  return (
    <div className="px-2 pb-2 border-b border-border">
      <button
        onClick={toggle}
        className="w-full flex items-center gap-1.5 px-2 py-2 rounded-md hover:bg-card/60 transition-colors"
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
        <div className="space-y-0.5 mt-1">
          {items.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left group',
                  isActive
                    ? 'bg-primary/10 border border-primary/20 shadow-sm'
                    : 'hover:bg-card/80'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 flex-shrink-0',
                    isActive ? 'text-kdp-orange' : 'text-muted-foreground'
                  )}
                />
                <span
                  className={cn(
                    'text-[14px] flex-1 truncate',
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
        </div>
      )}
    </div>
  );
};
