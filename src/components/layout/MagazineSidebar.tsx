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
  ChevronRight,
  CreditCard,
  Shield,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  { id: 'projects', label: 'Mes Projets', icon: BookOpen, color: 'emerald-500', badge: 'NEW' },
  { id: 'planner', label: 'Planificateur', icon: BookOpen, color: 'coral-pink' },
  { id: 'templates', label: 'Templates', icon: FileText, color: 'cobalt-blue' },
  { id: 'settings', label: 'Paramètres', icon: Settings, color: 'gray-400' },
  { id: 'characters', label: 'Personnages', icon: Users, color: 'emerald-500', badge: 'IA' },
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
  { id: 'strict-proofread', label: 'Correcteur Strict', icon: Shield, color: 'emerald-500', badge: 'NEW' },
];

export function MagazineSidebar({ 
  activeTab, 
  onTabChange, 
  isCollapsed = false,
  onToggleCollapse 
}: MagazineSidebarProps) {
  const navigate = useNavigate();

  return (
    <aside 
      className={cn(
        "sticky top-0 h-screen bg-card border-r border-border transition-all duration-300 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="font-playfair text-xl font-bold text-foreground">Ebook Studio</h2>
              <p className="text-xs text-muted-foreground mt-1">Création professionnelle</p>
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
                  ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {/* Background gradient on hover */}
              {!isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 to-transparent opacity-0 group-hover:opacity-10 transition-opacity" />
              )}
              
              {/* Icon */}
              <div className={cn(
                "relative z-10 flex-shrink-0",
                isActive && "animate-in zoom-in-50 duration-200"
              )}>
                <Icon className={cn(
                  "h-5 w-5 transition-transform group-hover:scale-110",
                  isActive ? "text-white" : "text-amber-400"
                )} />
              </div>
              
              {/* Label */}
              {!isCollapsed && (
                <span className={cn(
                  "relative z-10 font-inter font-medium text-sm transition-all",
                  isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
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

      {/* Footer - Subscription & Admin Buttons */}
      {!isCollapsed && (
        <div className="p-6 border-t border-border space-y-2">
          <Button
            onClick={() => navigate('/subscription')}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Mon Abonnement
          </Button>
          <Button
            onClick={() => navigate('/admin')}
            variant="outline"
            className="w-full"
          >
            <Shield className="w-4 h-4 mr-2" />
            Admin Panel
          </Button>
        </div>
      )}
    </aside>
  );
}
