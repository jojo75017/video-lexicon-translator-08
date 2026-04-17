import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Lightbulb,
  Sparkles,
  Image as ImageIcon,
  Upload,
  Megaphone,
  ArrowRight,
  Compass,
  PenLine,
  Package,
  ShoppingCart,
  Settings,
  Map,
  HelpCircle,
  Wand2,
  BookOpen,
  Headphones,
  FileText,
  Search,
  Target,
  CheckCircle2,
} from 'lucide-react';

interface JourneyStep {
  number: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  cta: string;
  action: () => void;
}

interface PillarInfo {
  emoji: string;
  label: string;
  color: string; // tailwind classes for accent
  description: string;
  keyTools: string[];
  tabId?: string; // first tab to open
}

interface UseCase {
  question: string;
  answer: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

const ToolsGuidePage: React.FC = () => {
  const navigate = useNavigate();

  // Helper: navigate to ebook-planner with a specific active tab preselected
  const goToTool = (tabId: string) => {
    try {
      localStorage.setItem('ebook_planner_activeTab', tabId);
    } catch {}
    navigate('/ebook-planner');
  };

  const journey: JourneyStep[] = [
    {
      number: 1,
      title: 'Idée',
      subtitle: 'Trouve ta niche rentable',
      description: 'Recherche une niche KDP porteuse et identifie les bons mots-clés avant d’écrire.',
      icon: Lightbulb,
      cta: 'Recherche Mots-clés KDP',
      action: () => navigate('/kdp-keywords'),
    },
    {
      number: 2,
      title: 'Création',
      subtitle: 'Workflow IA P1 → P15',
      description: 'Le seul outil à utiliser pour écrire ton livre : 15 agents IA en pipeline complet.',
      icon: Sparkles,
      cta: 'Lancer le Workflow IA',
      action: () => goToTool('complete-workflow'),
    },
    {
      number: 3,
      title: 'Habillage',
      subtitle: 'Couverture + Description',
      description: 'Crée une couverture pro avec l’IA et rédige une description Amazon irrésistible.',
      icon: ImageIcon,
      cta: 'Studio Couverture IA',
      action: () => goToTool('cover'),
    },
    {
      number: 4,
      title: 'Publication',
      subtitle: 'Export KDP + Checklist',
      description: 'Exporte ton manuscrit aux normes KDP et valide la checklist pré-publication.',
      icon: Upload,
      cta: 'Export Pro KDP',
      action: () => goToTool('export'),
    },
    {
      number: 5,
      title: 'Vente',
      subtitle: 'KDP Ads + Marketing',
      description: 'Apprends à promouvoir ton livre sans te faire arnaquer par Amazon Ads.',
      icon: Megaphone,
      cta: 'Guide KDP Ads',
      action: () => navigate('/kdp-ads-guide'),
    },
  ];

  const pillars: PillarInfo[] = [
    {
      emoji: '🤖',
      label: 'Workflow IA',
      color: 'text-blue-600 border-blue-200 bg-blue-50',
      description: 'Le pipeline 15 agents pour produire un livre complet, du plan au verdict final.',
      keyTools: ['Pipeline complet', 'Architecte de contenu', 'Romancier expert', 'Verdict ultime'],
      tabId: 'complete-workflow',
    },
    {
      emoji: '✍️',
      label: 'Écriture',
      color: 'text-emerald-600 border-emerald-200 bg-emerald-50',
      description: 'Plan, chapitres, personnages, séries — l’atelier d’écriture manuel et assisté.',
      keyTools: ['Planificateur', 'Écriture', 'Personnages', 'Correcteur strict'],
      tabId: 'planner',
    },
    {
      emoji: '📦',
      label: 'Publier',
      color: 'text-amber-600 border-amber-200 bg-amber-50',
      description: 'Exports KDP-ready (PDF, EPUB), couvertures pro et conformité Amazon.',
      keyTools: ['Export Pro KDP', 'Studio Couverture', 'Checklist KDP', 'Audio Express'],
      tabId: 'export',
    },
    {
      emoji: '📣',
      label: 'Vendre',
      color: 'text-rose-600 border-rose-200 bg-rose-50',
      description: 'Marketing, plan de lancement et publicité Amazon Ads sécurisée.',
      keyTools: ['Marketing', 'Plan de lancement', 'Guide KDP Ads'],
      tabId: 'marketing',
    },
    {
      emoji: '⚙️',
      label: 'Mon Compte',
      color: 'text-slate-600 border-slate-200 bg-slate-50',
      description: 'Tes projets, ta bibliothèque, ton abonnement et tes paramètres.',
      keyTools: ['Projets', 'Bibliothèque', 'Abonnement', 'Paramètres'],
      tabId: 'projects',
    },
  ];

  const useCases: UseCase[] = [
    {
      question: 'Je débute, je veux écrire mon 1er livre',
      answer: 'Workflow IA P1 → P15 (pipeline complet)',
      icon: Wand2,
      action: () => goToTool('complete-workflow'),
    },
    {
      question: 'Je veux trouver une niche rentable',
      answer: 'Recherche Mots-clés KDP + Analyse de marché',
      icon: Target,
      action: () => navigate('/kdp-keywords'),
    },
    {
      question: 'J’ai un livre déjà écrit, je veux l’améliorer',
      answer: 'Réécriture Naturelle + Correcteur Strict',
      icon: PenLine,
      action: () => goToTool('natural-rewrite'),
    },
    {
      question: 'Je veux créer une couverture',
      answer: 'Studio Couverture IA',
      icon: ImageIcon,
      action: () => goToTool('cover'),
    },
    {
      question: 'Je veux faire de la pub Amazon sans me ruiner',
      answer: 'Guide KDP Ads (anti-arnaque)',
      icon: Megaphone,
      action: () => navigate('/kdp-ads-guide'),
    },
    {
      question: 'Je veux convertir mon livre en audio',
      answer: 'Audio Express',
      icon: Headphones,
      action: () => goToTool('audio-express'),
    },
    {
      question: 'Je veux exporter pour KDP',
      answer: 'Export Pro KDP + Checklist Pré-publication',
      icon: FileText,
      action: () => goToTool('export'),
    },
    {
      question: 'Je veux écrire une série en plusieurs tomes',
      answer: 'Bible de Série',
      icon: BookOpen,
      action: () => goToTool('series'),
    },
  ];

  const advancedTools = [
    'Génération de posts sociaux',
    'Importateur d’URL',
    'Transformateur de documents (.docx)',
    'Multi-traducteur',
    'Calibre EPUB',
    'BD Studio',
    'Forum communautaire',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Map className="w-7 h-7 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Guide des outils</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Ta carte au trésor pour ne jamais te perdre dans EbookStudio. Suis le parcours, ou clique
            directement sur le cas d’usage qui te concerne.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-14">
        {/* Section 1 — Parcours recommandé */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Compass className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Le parcours recommandé</h2>
            <Badge variant="secondary">Happy path</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {journey.map((step) => {
              const Icon = step.icon;
              return (
                <button
                  key={step.number}
                  onClick={step.action}
                  className="text-left group relative bg-card border border-border rounded-xl p-5 hover:border-primary hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-5xl font-black text-primary/15 leading-none group-hover:text-primary/30 transition-colors">
                      {step.number}
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-bold text-foreground">{step.title}</h3>
                  <p className="text-xs font-medium text-primary mb-2">{step.subtitle}</p>
                  <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                    {step.cta}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 2 — Les 5 piliers */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Les 5 piliers expliqués</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pillars.map((p) => (
              <Card key={p.label} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="text-2xl">{p.emoji}</span>
                    <span>{p.label}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{p.description}</p>
                  <ul className="space-y-1.5 mb-4">
                    {p.keyTools.map((t) => (
                      <li key={t} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                  {p.tabId && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => goToTool(p.tabId!)}
                    >
                      Ouvrir ce pilier
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 3 — Je veux faire X */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Je veux faire…</h2>
            <Badge variant="secondary">FAQ pratique</Badge>
          </div>

          <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
            {useCases.map((uc, idx) => {
              const Icon = uc.icon;
              return (
                <button
                  key={idx}
                  onClick={uc.action}
                  className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground italic">« {uc.question} »</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">→ {uc.answer}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 4 — Outils avancés */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-muted-foreground">
              Outils avancés (à découvrir plus tard)
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Une fois les bases maîtrisées, tu pourras explorer ces outils spécialisés.
          </p>
          <div className="flex flex-wrap gap-2">
            {advancedTools.map((t) => (
              <Badge key={t} variant="outline" className="text-xs font-normal">
                {t}
              </Badge>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center py-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Prêt à te lancer ?</p>
          <Button size="lg" onClick={() => goToTool('complete-workflow')}>
            <Sparkles className="w-4 h-4 mr-2" />
            Démarrer le Workflow IA
          </Button>
        </section>
      </div>
    </div>
  );
};

export default ToolsGuidePage;
