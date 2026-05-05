import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Home,
  Sparkles,
  PenTool,
  Image as ImageIcon,
  Download,
  Megaphone,
  Wrench,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Shield,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MagazineSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface StepItem {
  id: string;       // tabId envoyé à onTabChange (point d'entrée par défaut de l'étape)
  label: string;
  hint: string;
  icon: React.ElementType;
  step?: string;    // numéro affiché ("1", "2"...)
  matchIds?: string[]; // tabIds qui doivent surligner cette étape
  badge?: string;
}

// 5 étapes claires + accueil. Chaque étape ouvre l'outil principal de l'étape.
// L'utilisateur découvre les outils complémentaires depuis la vue de l'outil
// (ou via le bouton "Tous les outils" en bas).
const STEP_ITEMS: StepItem[] = [
  {
    id: 'projects',
    label: 'Accueil',
    hint: 'Mes projets',
    icon: Home,
    matchIds: ['projects'],
  },
  {
    id: 'planner',
    label: 'Démarrer un livre',
    hint: 'Plan, idée, personnages',
    icon: Sparkles,
    step: '1',
    matchIds: ['planner', 'characters', 'templates'],
  },
  {
    id: 'writing',
    label: 'Écrire',
    hint: 'Rédaction & relecture',
    icon: PenTool,
    step: '2',
    matchIds: ['writing', 'strict-proofread', 'toc', 'aichat'],
  },
  {
    id: 'images',
    label: 'Habiller',
    hint: 'Couverture & visuels',
    icon: ImageIcon,
    step: '3',
    matchIds: ['images', 'cover', 'cover-design-editor', 'back-cover', 'backcover'],
  },
  {
    id: 'export',
    label: 'Publier',
    hint: 'Export PDF & KDP',
    icon: Download,
    step: '4',
    matchIds: ['export', 'kdp', 'kdp-prepublish-checklist'],
  },
  {
    id: 'marketing',
    label: 'Vendre',
    hint: 'Marketing & monétisation',
    icon: Megaphone,
    step: '5',
    matchIds: ['marketing', 'monetization', 'advanced', 'launch-plan'],
  },
];

export function MagazineSidebar({
  activeTab,
  onTabChange,
  isCollapsed = false,
  onToggleCollapse,
}: MagazineSidebarProps) {
  const navigate = useNavigate();

  const isStepActive = (item: StepItem) =>
    item.id === activeTab || item.matchIds?.includes(activeTab);

  return (
    <aside
      className={cn(
        'sticky top-0 h-screen bg-card border-r border-border transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="font-playfair text-xl font-bold text-foreground">Ebook Studio</h2>
              <p className="text-xs text-muted-foreground mt-1">Suis les 5 étapes</p>
            </div>
          )}
          {onToggleCollapse && (
            <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="ml-auto">
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Étapes */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-thin">
        {STEP_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isStepActive(item);

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative text-left',
                active
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              {/* Numéro d'étape ou icône Accueil */}
              <div
                className={cn(
                  'flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm',
                  active
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-500/10 text-amber-500'
                )}
              >
                {item.step ? item.step : <Icon className="h-5 w-5" />}
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      'font-inter font-semibold text-sm truncate',
                      active ? 'text-white' : 'text-foreground'
                    )}
                  >
                    {item.label}
                  </div>
                  <div
                    className={cn(
                      'text-xs truncate',
                      active ? 'text-white/80' : 'text-muted-foreground'
                    )}
                  >
                    {item.hint}
                  </div>
                </div>
              )}

              {item.step && !isCollapsed && (
                <Icon
                  className={cn(
                    'h-4 w-4 flex-shrink-0',
                    active ? 'text-white/80' : 'text-muted-foreground/60'
                  )}
                />
              )}
            </button>
          );
        })}

        {/* Séparateur */}
        {!isCollapsed && (
          <div className="pt-4 mt-4 border-t border-border">
            <p className="px-3 pb-2 text-[11px] uppercase tracking-wide text-muted-foreground/70 font-semibold">
              Avancé
            </p>
          </div>
        )}

        {/* Mots-clés KDP → page dédiée */}
        <button
          onClick={() => navigate('/kdp-keywords')}
          title="Recherche de mots-clés Amazon KDP par IA"
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left',
            'text-muted-foreground hover:bg-accent/15 hover:text-accent'
          )}
        >
          <Search className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Mots-clés KDP</span>}
        </button>

        {/* Tous les outils (vue Trello) */}
        <button
          onClick={() => onTabChange('all-tools')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left',
            activeTab === 'all-tools'
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          )}
        >
          <Wrench className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Tous les outils</span>}
        </button>

        {/* Paramètres */}
        <button
          onClick={() => onTabChange('settings')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left',
            activeTab === 'settings'
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          )}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Paramètres</span>}
        </button>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border space-y-2">
          <Button
            onClick={() => navigate('/subscription')}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Mon Abonnement
          </Button>
          <Button onClick={() => navigate('/admin')} variant="outline" size="sm" className="w-full">
            <Shield className="w-3.5 h-3.5 mr-2" />
            Admin
          </Button>
        </div>
      )}
    </aside>
  );
}
