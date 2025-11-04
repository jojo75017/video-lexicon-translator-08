import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  FileText, 
  PenTool, 
  Wrench, 
  BookMarked, 
  Briefcase, 
  Megaphone, 
  DollarSign, 
  Download, 
  List, 
  Image, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  badge?: string;
}

interface MagazineSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const sidebarItems: SidebarItem[] = [
  { id: 'planner', label: 'Planificateur', icon: BookOpen, color: 'coral-pink' },
  { id: 'templates', label: 'Templates', icon: FileText, color: 'cobalt-blue' },
  { id: 'writing', label: 'Rédaction', icon: PenTool, color: 'honey-gold' },
  { id: 'tools', label: 'Outils', icon: Wrench, color: 'royal-purple' },
  { id: 'kdp', label: 'KDP', icon: BookMarked, color: 'emerald-500' },
  { id: 'back-cover', label: '4ème Couverture', icon: FileText, color: 'royal-purple', badge: 'IA' },
  { id: 'advanced', label: 'Business', icon: Briefcase, color: 'cobalt-blue' },
  { id: 'marketing', label: 'Marketing', icon: Megaphone, color: 'coral-pink' },
  { id: 'monetization', label: 'Monétisation', icon: DollarSign, color: 'honey-gold' },
  { id: 'export', label: 'Export', icon: Download, color: 'royal-purple' },
  { id: 'toc', label: 'Sommaire', icon: List, color: 'cobalt-blue' },
  { id: 'images', label: 'Images', icon: Image, color: 'coral-pink' },
  { id: 'settings', label: 'Paramètres', icon: Settings, color: 'gray-400' },
];

export function MagazineSidebar({ 
  activeTab, 
  onTabChange, 
  isCollapsed = false,
  onToggleCollapse 
}: MagazineSidebarProps) {
  return (
    <aside 
      className={cn(
        "sticky top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="font-playfair text-xl font-bold text-navy-deep">Ebook Studio</h2>
              <p className="text-xs text-gray-cool mt-1">Création professionnelle</p>
            </div>
          )}
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="ml-auto"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive
                  ? `bg-gradient-magazine text-white shadow-lg shadow-${item.color}/20`
                  : "text-gray-700 hover:bg-gray-50 hover:text-navy-deep"
              )}
            >
              {/* Background gradient on hover */}
              {!isActive && (
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity",
                  `from-${item.color} to-transparent`
                )} />
              )}
              
              {/* Icon */}
              <div className={cn(
                "relative z-10 flex-shrink-0",
                isActive && "animate-in zoom-in-50 duration-200"
              )}>
                <Icon className={cn(
                  "h-5 w-5 transition-transform group-hover:scale-110",
                  isActive ? "text-white" : `text-${item.color}`
                )} />
              </div>
              
              {/* Label */}
              {!isCollapsed && (
                <span className={cn(
                  "relative z-10 font-inter font-medium text-sm transition-all",
                  isActive ? "text-white" : "text-gray-700 group-hover:text-navy-deep"
                )}>
                  {item.label}
                </span>
              )}
              
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
              )}
              
              {/* Badge */}
              {item.badge && !isCollapsed && (
                <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-white/20 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Progress */}
      {!isCollapsed && (
        <div className="p-6 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">Progression</span>
              <span className="text-primary font-bold">42%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-magazine rounded-full transition-all duration-500"
                style={{ width: '42%' }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Continuez pour terminer votre ebook
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
