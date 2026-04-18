import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Star } from 'lucide-react';
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

export const SidebarFavorites: React.FC<SidebarFavoritesProps> = ({
  items,
  activeTab,
  onItemClick,
  isCollapsed,
}) => {
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

  return (
    <div className="px-2 pb-2 border-b border-border">
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        <Star className="w-3 h-3 text-kdp-orange fill-kdp-orange" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Favoris
        </span>
      </div>
      <div className="space-y-0.5">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all text-left group',
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
                  'text-sm flex-1 truncate',
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
    </div>
  );
};
