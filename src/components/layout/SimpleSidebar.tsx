import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  Zap,
  Hand,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SimpleSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  /** Bascule vers la vue Trello (toutes les cartes / tous les outils). */
  onSwitchToTrello?: () => void;
}

interface StepItem {
  id: string;            // tabId envoyé au parent (point d'entrée par défaut de l'étape)
  label: string;
  hint: string;
  icon: LucideIcon;
  step?: string;         // numéro affiché ("1", "2"...)
  matchIds?: string[];   // tabIds qui doivent surligner cette étape
  badge?: 'workflow' | 'manuel';
}

/**
 * 5 étapes simples qui suivent l'ordre naturel de production d'un livre.
 * Chaque étape ouvre directement l'outil principal correspondant ; les outils
 * complémentaires restent accessibles depuis la vue Trello via "Tous les outils".
 */
const STEP_ITEMS: StepItem[] = [
  {
    id: 'projects',
    label: 'Accueil',
    hint: 'Mes projets',
    icon: Home,
    matchIds: ['projects', 'ebook-library'],
  },
  {
    id: 'planner',
    label: 'Démarrer un livre',
    hint: 'Plan & idée — manuel ou IA',
    icon: Sparkles,
    step: '1',
    matchIds: ['planner', 'characters', 'series', 'templates', 'doc-transform', 'url-import'],
    badge: 'workflow',
  },
  {
    id: 'writing',
    label: 'Écrire',
    hint: 'Rédaction manuelle (l\'IA est dans Workflow)',
    icon: PenTool,
    step: '2',
    matchIds: ['writing', 'aichat', 'strict-proofread'],
    badge: 'manuel',
  },
  {
    id: 'cover-design-editor',
    label: 'Habiller',
    hint: 'Couverture & visuels',
    icon: ImageIcon,
    step: '3',
    matchIds: ['cover-design-editor', 'cover', 'backcover', 'images'],
  },
  {
    id: 'export',
    label: 'Publier',
    hint: 'Export PDF & KDP',
    icon: Download,
    step: '4',
    matchIds: ['export', 'workflow-export', 'calibre-epub', 'kdp', 'kdp-prepublish-checklist', 'audit-pilot'],
  },
  {
    id: 'marketing',
    label: 'Vendre',
    hint: 'Marketing & lancement',
    icon: Megaphone,
    step: '5',
    matchIds: ['marketing', 'launch-plan', 'kdp-ads-guide'],
  },
];

export const SimpleSidebar: React.FC<SimpleSidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  onSwitchToTrello,
}) => {
  const navigate = useNavigate();

  const isStepActive = (item: StepItem) =>
    activeTab === item.id || !!item.matchIds?.includes(activeTab);

  return (
    <aside
      className={cn(
        'sticky top-0 h-screen bg-card border-r border-border transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="font-playfair text-xl font-bold text-foreground">Ebook Studio</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Suis les 5 étapes</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="ml-auto"
            aria-label={isCollapsed ? 'Déplier le menu' : 'Replier le menu'}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Étapes */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-thin">
        {/* Sélecteur de mode : Workflow IA vs Manuel */}
        {!isCollapsed && (
          <div className="mb-4 rounded-xl border border-border bg-muted/30 p-2.5">
            <p className="px-1 pb-2 text-[11px] uppercase tracking-wide text-muted-foreground/80 font-semibold">
              Comment veux-tu créer ?
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onTabChange('complete-workflow')}
                title="Workflow IA — 15 agents enchaînent toutes les étapes (P1 → P15)"
                className="group flex flex-col items-start gap-1 rounded-lg border border-primary/30 bg-primary/5 p-2.5 text-left transition-all hover:border-primary hover:bg-primary/10"
              >
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-bold text-primary">Workflow IA</span>
                </div>
                <span className="text-[10px] leading-tight text-muted-foreground">
                  15 agents auto · ~30 min
                </span>
              </button>
              <button
                onClick={() => onTabChange('planner')}
                title="Mode simple — tu pilotes manuellement chaque étape"
                className="group flex flex-col items-start gap-1 rounded-lg border border-border bg-card p-2.5 text-left transition-all hover:border-amber-500/50 hover:bg-amber-500/5"
              >
                <div className="flex items-center gap-1.5">
                  <Hand className="h-3.5 w-3.5 text-foreground" />
                  <span className="text-xs font-bold text-foreground">Mode simple</span>
                </div>
                <span className="text-[10px] leading-tight text-muted-foreground">
                  À ton rythme, manuel
                </span>
              </button>
            </div>
          </div>
        )}

        {STEP_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isStepActive(item);

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={`${item.label} — ${item.hint}`}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group text-left',
                active
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              {/* Numéro d'étape ou icône Accueil */}
              <div
                className={cn(
                  'flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm',
                  active ? 'bg-white/20 text-white' : 'bg-amber-500/10 text-amber-500'
                )}
              >
                {item.step ?? <Icon className="h-5 w-5" />}
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'font-inter font-semibold text-sm truncate',
                        active ? 'text-white' : 'text-foreground'
                      )}
                    >
                      {item.label}
                    </span>
                    {item.badge === 'workflow' && (
                      <span
                        className={cn(
                          'shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide',
                          active
                            ? 'bg-white/25 text-white'
                            : 'bg-primary/15 text-primary'
                        )}
                      >
                        IA
                      </span>
                    )}
                    {item.badge === 'manuel' && (
                      <span
                        className={cn(
                          'shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide',
                          active
                            ? 'bg-white/25 text-white'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        Manuel
                      </span>
                    )}
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

        {/* Séparateur "Avancé" */}
        {!isCollapsed && (
          <div className="pt-4 mt-4 border-t border-border">
            <p className="px-3 pb-2 text-[11px] uppercase tracking-wide text-muted-foreground/70 font-semibold">
              Avancé
            </p>
          </div>
        )}

        {/* Tous les outils → vue Trello */}
        <button
          onClick={() => onSwitchToTrello?.()}
          title="Voir tous les outils en mode tableau (kanban)"
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left',
            'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
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
};

export default SimpleSidebar;
