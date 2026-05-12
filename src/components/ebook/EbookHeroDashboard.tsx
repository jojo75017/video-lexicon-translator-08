import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Sparkles, Rocket, BookOpen, ArrowRight, TrendingUp, Star,
  PenLine, ImageIcon, FileText, Wand2, Trophy, CheckCircle2
} from 'lucide-react';
import { ebookExamples, type EbookExample } from '@/data/ebookExamples';
import type { Chapter } from '@/hooks/useSubscriptionGeneration';

// Palette mémoire KDP
const TEAL = '#008296';
const ORANGE = '#FF9E2D';
const TEXT = '#232F3E';

interface EbookHeroDashboardProps {
  ebookTitle: string;
  authorName: string;
  chapters: Chapter[];
  preface?: string;
  conclusion?: string;
  coverImageUrl?: string;
  kdpDescription?: string;
  kdpKeywords?: string;
  targetWordsPerChapter?: number;
  onNavigateToTab?: (tabId: string) => void;
  onApplyExample?: (example: EbookExample) => void;
  onStartAutoWorkflow?: () => void;
}

// Compteur animé simple (pas de lib)
const AnimatedNumber: React.FC<{ value: number; duration?: number; suffix?: string }> = ({
  value, duration = 900, suffix = ''
}) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const from = 0;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <span>{display.toLocaleString('fr-FR')}{suffix}</span>;
};

const wordCount = (t?: string) => (t ? t.trim().split(/\s+/).filter(Boolean).length : 0);

// Mini-couverture CSS pure (aucune image externe)
const MiniCover: React.FC<{ title: string; subtitle?: string; palette: { from: string; to: string; text: string }; tall?: boolean }> = ({
  title, subtitle, palette, tall
}) => (
  <div
    className={`relative rounded-md shadow-lg overflow-hidden ${tall ? 'aspect-[2/3]' : 'aspect-[3/4]'} flex flex-col justify-between p-3`}
    style={{ background: `linear-gradient(135deg, ${palette.from} 0%, ${palette.to} 100%)`, color: palette.text }}
  >
    <div className="text-[10px] uppercase tracking-widest opacity-80 font-semibold">Best-Seller</div>
    <div>
      <div className="font-bold text-sm leading-tight line-clamp-3" style={{ fontFamily: 'Georgia, serif' }}>{title}</div>
      {subtitle && <div className="text-[10px] mt-1 opacity-90 line-clamp-2">{subtitle}</div>}
    </div>
    <div className="text-[9px] opacity-70 border-t border-white/30 pt-1">EBOOKSTUDIO</div>
  </div>
);

export const EbookHeroDashboard: React.FC<EbookHeroDashboardProps> = ({
  ebookTitle,
  authorName,
  chapters,
  preface = '',
  conclusion = '',
  coverImageUrl,
  kdpDescription = '',
  kdpKeywords = '',
  targetWordsPerChapter = 2000,
  onNavigateToTab,
  onApplyExample,
  onStartAutoWorkflow,
}) => {
  const [selectedExample, setSelectedExample] = useState<EbookExample | null>(null);

  // ─── État réel du projet ─────────────────────────
  const stats = useMemo(() => {
    const totalWords =
      chapters.reduce((s, c) => s + wordCount(c.content), 0) +
      wordCount(preface) + wordCount(conclusion);
    const writtenChapters = chapters.filter(c => wordCount(c.content) >= 200).length;
    const target = Math.max(1, chapters.length || 8) * targetWordsPerChapter;
    const progress = Math.min(100, Math.round((totalWords / target) * 100));
    const hasCover = !!coverImageUrl;
    const hasKdp = kdpDescription.length >= 200 && kdpKeywords.length > 5;

    let level: 'idée' | 'brouillon' | 'manuscrit' | 'prêt KDP' = 'idée';
    if (ebookTitle && chapters.length > 0) level = 'brouillon';
    if (progress >= 50) level = 'manuscrit';
    if (progress >= 90 && hasCover && hasKdp) level = 'prêt KDP';

    return { totalWords, writtenChapters, totalChapters: chapters.length, progress, hasCover, hasKdp, level };
  }, [chapters, preface, conclusion, coverImageUrl, kdpDescription, kdpKeywords, ebookTitle, targetWordsPerChapter]);

  const isEmpty = !ebookTitle.trim() && chapters.length === 0;

  // ─── 3 prochaines étapes intelligentes ───────────
  const nextSteps = useMemo(() => {
    const steps: Array<{ id: string; tab: string; icon: React.ElementType; title: string; desc: string; color: string; eta: string }> = [];

    if (!ebookTitle.trim()) {
      steps.push({ id: 'title', tab: 'planner', icon: BookOpen, title: 'Définir votre titre & angle', desc: 'Le bon titre attire le bon lecteur sur Amazon.', color: TEAL, eta: '5 min' });
    }
    if (chapters.length < 3) {
      steps.push({ id: 'plan', tab: 'planner', icon: PenLine, title: 'Construire votre plan de chapitres', desc: 'Une structure claire = un manuscrit qui s’écrit tout seul.', color: TEAL, eta: '10 min' });
    }
    if (chapters.length >= 3 && stats.progress < 90) {
      steps.push({ id: 'write', tab: 'complete-workflow', icon: Wand2, title: 'Lancer le workflow IA 15 agents', desc: 'Rédaction complète assistée chapitre par chapitre.', color: ORANGE, eta: '30-60 min' });
    }
    if (stats.progress >= 50 && !stats.hasCover) {
      steps.push({ id: 'cover', tab: 'cover', icon: ImageIcon, title: 'Créer votre couverture KDP', desc: 'Couverture pro générée par IA aux dimensions Amazon.', color: TEAL, eta: '5 min' });
    }
    if (stats.progress >= 70 && !stats.hasKdp) {
      steps.push({ id: 'kdp', tab: 'kdp', icon: FileText, title: 'Préparer votre fiche Amazon KDP', desc: 'Description vendeuse + 7 mots-clés optimisés.', color: TEAL, eta: '10 min' });
    }
    if (stats.progress >= 90 && stats.hasCover && stats.hasKdp) {
      steps.push({ id: 'export', tab: 'export', icon: Rocket, title: 'Exporter & publier sur Amazon', desc: 'Fichiers KDP prêts (PDF intérieur + couverture + ePub).', color: ORANGE, eta: '5 min' });
    }

    // Compléter à 3 si moins
    while (steps.length < 3) {
      if (!steps.find(s => s.id === 'cover')) steps.push({ id: 'cover', tab: 'cover', icon: ImageIcon, title: 'Imaginer votre couverture', desc: 'Inspirez-vous des best-sellers.', color: TEAL, eta: '5 min' });
      else if (!steps.find(s => s.id === 'kdp')) steps.push({ id: 'kdp', tab: 'kdp', icon: FileText, title: 'Brouillon de description Amazon', desc: 'Préparez votre pitch vendeur.', color: TEAL, eta: '10 min' });
      else break;
    }
    return steps.slice(0, 3);
  }, [ebookTitle, chapters.length, stats]);

  // ─── Handlers ────────────────────────────────────
  const handleApply = (ex: EbookExample) => {
    onApplyExample?.(ex);
    setSelectedExample(null);
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ color: TEXT }}>
      {/* ════════ A. HERO ════════ */}
      <Card className="border-0 overflow-hidden shadow-xl">
        <div
          className="relative p-8 md:p-10"
          style={{
            background: `linear-gradient(135deg, ${TEAL} 0%, #006B7D 50%, ${ORANGE} 130%)`,
            color: '#FFFFFF',
          }}
        >
          {/* Étoiles décoratives */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <Star
                key={i}
                className="absolute opacity-20 animate-pulse"
                style={{
                  top: `${10 + i * 14}%`,
                  left: `${(i * 17) % 90}%`,
                  width: 16 + (i % 3) * 8,
                  height: 16 + (i % 3) * 8,
                  animationDelay: `${i * 0.3}s`,
                }}
                fill="white"
              />
            ))}
          </div>

          <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <Badge className="mb-3 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur">
                <Sparkles className="h-3 w-3 mr-1" /> Niveau : {stats.level}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                {isEmpty
                  ? 'Créez votre prochain best-seller Amazon KDP'
                  : <>Votre livre <span className="italic">"{ebookTitle}"</span> est à <span style={{ color: ORANGE }}><AnimatedNumber value={stats.progress} suffix="%" /></span> - continuons !</>}
              </h1>
              <p className="mt-3 text-white/90 text-base md:text-lg max-w-2xl">
                {isEmpty
                  ? 'Inspirez-vous des structures qui cartonnent, laissez l\'IA rédiger, publiez en quelques heures.'
                  : <>Déjà <strong><AnimatedNumber value={stats.totalWords} /></strong> mots écrits • <strong>{stats.writtenChapters}/{stats.totalChapters || '?'}</strong> chapitres rédigés.</>}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-white hover:bg-orange-50 font-semibold shadow-lg hover-scale"
                  style={{ color: TEAL }}
                  onClick={() => {
                    const next = nextSteps[0];
                    if (next) onNavigateToTab?.(next.tab);
                  }}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  {isEmpty ? 'Démarrer maintenant' : 'Continuer maintenant'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 font-semibold backdrop-blur"
                  onClick={() => onStartAutoWorkflow?.() ?? onNavigateToTab?.('complete-workflow')}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Workflow IA 15 Agents
                </Button>
              </div>
            </div>

            {/* Mockup couverture */}
            <div className="hidden md:block w-40">
              <div className="transform rotate-3 hover:rotate-0 transition-transform duration-500 hover-scale">
                <MiniCover
                  title={ebookTitle || 'Votre Best-Seller'}
                  subtitle={authorName ? `par ${authorName}` : 'Démarrez ici'}
                  palette={{ from: '#FFFFFF', to: '#FFE8C2', text: TEXT }}
                  tall
                />
              </div>
            </div>
          </div>

          {/* Barre progression */}
          {!isEmpty && (
            <div className="relative mt-6">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur">
                <div
                  className="h-full transition-all duration-1000 rounded-full"
                  style={{ width: `${stats.progress}%`, background: `linear-gradient(90deg, ${ORANGE}, #FFD580)` }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* ════════ B. INSPIREZ-VOUS - exemples concrets ════════ */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: TEXT }}>
                <Trophy className="h-5 w-5" style={{ color: ORANGE }} />
                Inspirez-vous de structures qui marchent
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Cliquez sur un livre pour pré-remplir titre, plan et description en un clic.
              </p>
            </div>
            <Badge variant="outline" className="hidden md:inline-flex">
              {ebookExamples.length} exemples
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {ebookExamples.map((ex) => (
              <button
                key={ex.id}
                onClick={() => setSelectedExample(ex)}
                className="text-left group"
              >
                <div className="hover-scale transition-transform">
                  <MiniCover title={ex.title} subtitle={ex.subtitle} palette={ex.palette} tall />
                </div>
                <div className="mt-2">
                  <div className="text-xs font-semibold line-clamp-1" style={{ color: TEXT }}>{ex.title}</div>
                  <div className="text-[10px] text-muted-foreground line-clamp-1">{ex.niche}</div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ════════ C. 3 PROCHAINES ÉTAPES ════════ */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-1" style={{ color: TEXT }}>
            🎯 Vos 3 prochaines étapes
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Calculées automatiquement depuis l’état réel de votre projet.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {nextSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => onNavigateToTab?.(step.tab)}
                  className="text-left p-5 rounded-xl border-2 bg-white hover:shadow-xl transition-all hover-scale group"
                  style={{ borderColor: `${step.color}40` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md"
                      style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}DD)` }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="text-[10px]">Étape {i + 1} • {step.eta}</Badge>
                  </div>
                  <h3 className="font-bold text-base mb-1" style={{ color: TEXT }}>{step.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{step.desc}</p>
                  <div className="flex items-center text-sm font-semibold group-hover:gap-2 transition-all" style={{ color: step.color }}>
                    Y aller <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ════════ D. KPI WHAOOUH ════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Mots écrits', value: stats.totalWords, suffix: '', color: TEAL, icon: FileText },
          { label: 'Chapitres rédigés', value: stats.writtenChapters, suffix: `/${stats.totalChapters || '?'}` as any, color: ORANGE, icon: BookOpen, raw: true },
          { label: 'Avancement', value: stats.progress, suffix: '%', color: TEAL, icon: TrendingUp },
          { label: 'Score KDP', value: (stats.hasCover ? 50 : 0) + (stats.hasKdp ? 50 : 0), suffix: '/100', color: ORANGE, icon: CheckCircle2 },
        ].map((kpi) => (
          <Card key={kpi.label} className="overflow-hidden">
            <CardContent className="pt-6 pb-5 relative">
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 -mr-6 -mt-6" style={{ background: kpi.color }} />
              <kpi.icon className="h-5 w-5 mb-2" style={{ color: kpi.color }} />
              <div className="text-3xl font-bold" style={{ color: TEXT, fontFamily: 'Georgia, serif' }}>
                {kpi.raw ? <>{kpi.value}{kpi.suffix}</> : <AnimatedNumber value={kpi.value} suffix={String(kpi.suffix)} />}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{kpi.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ════════ MODALE EXEMPLE ════════ */}
      <Dialog open={!!selectedExample} onOpenChange={(o) => !o && setSelectedExample(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedExample && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl" style={{ color: TEXT, fontFamily: 'Georgia, serif' }}>
                  {selectedExample.title}
                </DialogTitle>
                <DialogDescription>{selectedExample.subtitle}</DialogDescription>
              </DialogHeader>

              <div className="grid md:grid-cols-[180px_1fr] gap-6 mt-2">
                <div>
                  <MiniCover title={selectedExample.title} subtitle={selectedExample.subtitle} palette={selectedExample.palette} tall />
                  <div className="mt-3 space-y-1 text-xs">
                    <div><strong>Niche :</strong> {selectedExample.niche}</div>
                    <div><strong>Audience :</strong> {selectedExample.audience}</div>
                    <div><strong>Genre :</strong> {selectedExample.genre}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2" style={{ color: TEAL }}>📖 Plan en {selectedExample.numberOfChapters} chapitres</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                      {selectedExample.chapters.map((c, i) => <li key={i}>{c}</li>)}
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2" style={{ color: TEAL }}>📝 Description type Amazon</h4>
                    <p className="text-sm text-muted-foreground italic">{selectedExample.kdpDescription}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2" style={{ color: TEAL }}>🔑 Mots-clés</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedExample.keywords.map(k => <Badge key={k} variant="secondary" className="text-[10px]">{k}</Badge>)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t">
                <Button
                  className="flex-1 font-semibold"
                  style={{ background: ORANGE, color: '#FFFFFF' }}
                  onClick={() => handleApply(selectedExample)}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Démarrer un projet similaire
                </Button>
                <Button variant="outline" onClick={() => setSelectedExample(null)}>Fermer</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EbookHeroDashboard;
