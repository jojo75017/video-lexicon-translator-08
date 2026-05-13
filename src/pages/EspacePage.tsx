import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen, Headphones, Palette, MessageSquare, ArrowRight, Clock,
  Sparkles, GraduationCap, Users, BarChart3, Crown, FileText, Loader2, LogOut,
} from 'lucide-react';

interface EspacePageProps {
  subscriberEmail: string;
  onLogout: () => void;
}

interface ProjectRow {
  id: string;
  title: string | null;
  author_name: string | null;
  updated_at: string;
}

const TEAL = '#008296';
const ORANGE = '#FF9E2D';
const TEXT = '#232F3E';

const formatRelative = (iso: string) => {
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const h = Math.floor(diffMin / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  return `il y a ${d} j`;
};

const EspacePage: React.FC<EspacePageProps> = ({ subscriberEmail, onLogout }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastTab, setLastTab] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>('');

  useEffect(() => {
    try { setLastTab(localStorage.getItem('ebook_planner_active_tab')); } catch {}
    let cancelled = false;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setProjects([]); return; }
        const meta = (user.user_metadata || {}) as Record<string, string>;
        const fn = meta.first_name || meta.full_name?.split(' ')[0] || (subscriberEmail || '').split('@')[0];
        if (!cancelled && fn) setFirstName(fn.charAt(0).toUpperCase() + fn.slice(1));
        const { data } = await supabase
          .from('ebook_projects')
          .select('id, title, author_name, updated_at')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(6);
        if (!cancelled) setProjects((data as ProjectRow[]) || []);
      } catch (e) {
        console.warn('[Espace] load projects failed', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [subscriberEmail]);

  const lastProject = projects[0];
  const lastStepLabel = useMemo(() => {
    if (!lastTab) return null;
    if (lastTab.startsWith('P')) return `étape ${lastTab.toUpperCase()}`;
    if (lastTab === 'workflow-dashboard') return 'tableau de bord IA';
    if (lastTab === 'planner') return 'plan du livre';
    if (lastTab === 'cover' || lastTab.startsWith('images')) return 'studio image';
    return lastTab;
  }, [lastTab]);

  const today = useMemo(() => {
    return new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }, []);

  const goPlanner = (tab?: string) => {
    if (tab) { try { localStorage.setItem('ebook_planner_active_tab', tab); } catch {} }
    navigate('/ebook-planner');
  };

  const createCards = [
    {
      title: 'Écrire un ebook',
      desc: 'Pipeline IA P1 → P15 (Amazon KDP). Le chemin recommandé.',
      emoji: '📖',
      icon: BookOpen,
      tint: 'bg-joy-peach/30',
      action: () => goPlanner('workflow-dashboard'),
      cta: 'Démarrer',
      featured: true,
    },
    {
      title: 'Audiobook',
      desc: 'Transformer un manuscrit en livre audio TTS pro.',
      emoji: '🎧',
      icon: Headphones,
      tint: 'bg-joy-mint/30',
      action: () => goPlanner('audio'),
      cta: 'Créer',
    },
    {
      title: 'Coloriage',
      desc: 'Cahier KDP prêt à publier en quelques clics.',
      emoji: '🎨',
      icon: Palette,
      tint: 'bg-joy-lavender/30',
      action: () => goPlanner('coloring'),
      cta: 'Créer',
    },
    {
      title: 'BD / Comic',
      desc: 'Assembler une bande dessinée à partir de prompts.',
      emoji: '💬',
      icon: MessageSquare,
      tint: 'bg-joy-sun/30',
      action: () => navigate('/bd-studio'),
      cta: 'Ouvrir',
    },
  ];

  const secondaryLinks = [
    { icon: BarChart3, label: 'Plan marketing', to: '/plan-marketing' },
    { icon: Sparkles, label: 'KDP Keywords', to: '/kdp-keywords' },
    { icon: FileText, label: 'Niches porteuses', to: '/niches' },
    { icon: GraduationCap, label: 'Formations', to: '/formation' },
    { icon: Users, label: 'Communauté', to: '/communaute' },
    { icon: Crown, label: 'Coaching VIP', to: '/coaching-vip' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA', color: TEXT }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(250,250,250,0.85)',
          borderBottom: '1px solid hsl(var(--joy-ink) / 0.08)',
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center justify-between">
          <button onClick={() => navigate('/espace')} className="flex items-center gap-2 font-semibold tracking-tight">
            <Sparkles className="h-5 w-5" style={{ color: TEAL }} />
            <span>Mon espace</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-joy-ink/55 hidden sm:inline">{subscriberEmail}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              aria-label="Déconnexion"
              className="text-joy-ink/70 hover:text-joy-ink hover:bg-joy-ink/5 rounded-full h-9 w-9"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        {/* Hero */}
        <section className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-joy-ink/50">{today}</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Bonjour{firstName ? `, ${firstName}` : ''} <span className="inline-block animate-joy-wiggle">👋</span>
          </h1>
          <p className="text-joy-ink/65 text-base">Voici ton atelier — qu'est-ce qu'on crée aujourd'hui&nbsp;?</p>
        </section>

        {/* Bloc Reprendre */}
        <section>
          <Card
            className="border rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--joy-cream)) 0%, #ffffff 60%)',
              borderColor: 'hsl(var(--joy-ink) / 0.08)',
              boxShadow: 'var(--shadow-elevated)',
            }}
          >
            <CardContent className="p-6 sm:p-7">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4" style={{ color: TEAL }} />
                <span className="text-xs font-semibold uppercase tracking-wider text-joy-ink/60">
                  Reprendre où vous en étiez
                </span>
              </div>

              {loading ? (
                <div className="flex items-center gap-2 text-joy-ink/60">
                  <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
                </div>
              ) : lastProject ? (
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
                  <div className="min-w-0">
                    <div className="font-serif italic text-2xl text-joy-ink truncate">
                      {lastProject.title || 'Projet sans titre'}
                    </div>
                    <div className="text-sm text-joy-ink/60 mt-1">
                      {lastProject.author_name ? `par ${lastProject.author_name} · ` : ''}
                      modifié {formatRelative(lastProject.updated_at)}
                      {lastStepLabel ? ` · ${lastStepLabel}` : ''}
                    </div>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => goPlanner(lastTab || undefined)}
                    className="rounded-full px-6 hover:opacity-90 shrink-0"
                    style={{ background: TEAL, color: 'white' }}
                  >
                    Continuer <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div className="text-joy-ink/65">
                    Aucun projet en cours. Lancez votre premier livre en 1 clic.
                  </div>
                  <Button
                    size="lg"
                    onClick={() => goPlanner('workflow-dashboard')}
                    className="rounded-full px-6 hover:opacity-90 font-semibold shrink-0"
                    style={{ background: ORANGE, color: TEXT }}
                  >
                    Créer mon premier livre <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Bloc Mes livres */}
        {projects.length > 1 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                <FileText className="h-4 w-4" style={{ color: TEAL }} /> Mes livres
              </h2>
              <Button variant="ghost" size="sm" onClick={() => goPlanner('projects')} className="rounded-full">
                Voir tout <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {projects.slice(1, 4).map((p) => (
                <Card
                  key={p.id}
                  onClick={() => goPlanner()}
                  className="cursor-pointer rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    borderColor: 'hsl(var(--joy-ink) / 0.08)',
                    boxShadow: 'var(--shadow-soft)',
                  }}
                >
                  <CardContent className="p-4">
                    <div className="font-serif italic text-base text-joy-ink line-clamp-1">
                      {p.title || 'Sans titre'}
                    </div>
                    <div className="text-xs text-joy-ink/55 mt-1">{formatRelative(p.updated_at)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Bloc Créer du neuf */}
        <section>
          <h2 className="text-lg font-semibold tracking-tight mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4" style={{ color: ORANGE }} /> Créer du neuf
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {createCards.map((c) => (
              <Card
                key={c.title}
                onClick={c.action}
                className="relative cursor-pointer rounded-2xl border transition-all duration-200 hover:-translate-y-1 flex flex-col"
                style={{
                  borderColor: c.featured ? TEAL : 'hsl(var(--joy-ink) / 0.08)',
                  boxShadow: 'var(--shadow-soft)',
                }}
              >
                {c.featured && (
                  <Badge
                    className="absolute -top-2 right-3 rounded-full"
                    style={{ background: TEAL, color: 'white' }}
                  >
                    Recommandé
                  </Badge>
                )}
                <CardContent className="p-5 flex flex-col flex-1">
                  <div className={`h-14 w-14 rounded-2xl ${c.tint} flex items-center justify-center text-3xl mb-3`}>
                    {c.emoji}
                  </div>
                  <div className="font-semibold text-base tracking-tight">{c.title}</div>
                  <p className="text-xs text-joy-ink/60 mt-1 mb-4 flex-1">{c.desc}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full w-full border-joy-ink/20 hover:bg-joy-ink hover:text-white hover:border-joy-ink"
                    onClick={(e) => { e.stopPropagation(); c.action(); }}
                  >
                    {c.cta} <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Bloc Aller plus loin */}
        <section>
          <h2 className="text-lg font-semibold tracking-tight mb-4 text-joy-ink/80">
            Aller plus loin
          </h2>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {secondaryLinks.map((l) => (
              <button
                key={l.to}
                onClick={() => navigate(l.to)}
                className="group flex items-center gap-3 p-3.5 rounded-xl bg-white border transition-all hover:border-[#008296] hover:shadow-[var(--shadow-soft)] text-left"
                style={{ borderColor: 'hsl(var(--joy-ink) / 0.08)' }}
              >
                <div className="h-9 w-9 rounded-lg bg-joy-cream flex items-center justify-center">
                  <l.icon className="h-4 w-4" style={{ color: TEAL }} />
                </div>
                <span className="text-sm font-medium text-joy-ink flex-1">{l.label}</span>
                <ArrowRight className="h-4 w-4 text-joy-ink/30 group-hover:text-joy-ink/70 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </section>

        <footer className="text-center text-xs text-joy-ink/55 pt-6 pb-8">
          Besoin d'aide ?{' '}
          <button onClick={() => navigate('/faq')} className="underline hover:text-joy-ink">
            FAQ &amp; assistance
          </button>
        </footer>
      </main>
    </div>
  );
};

export default EspacePage;
