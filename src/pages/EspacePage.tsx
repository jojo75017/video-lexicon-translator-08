import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowRight, Clock, Sparkles, FileText, Loader2, LogOut, ChevronDown, LayoutDashboard, Shield, Target } from 'lucide-react';
import { getIsCurrentSessionAdmin } from '@/lib/adminAccess';

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

type Tile = {
  emoji: string;
  title: string;
  desc: string;
  tint: string;     // pastel bg behind emoji
  ring: string;     // hover ring color
  action: () => void;
  featured?: boolean;
};

const EspacePage: React.FC<EspacePageProps> = ({ subscriberEmail, onLogout }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastTab, setLastTab] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getIsCurrentSessionAdmin().then((v) => { if (!cancelled) setIsAdmin(!!v); }).catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    try { setLastTab(localStorage.getItem('ebook_planner_active_tab')); } catch { void 0; }
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

  const cheers = useMemo(() => {
    const list = [
      'Belle journée pour publier ✨',
      'Prêt à faire vibrer des lecteurs ? 🚀',
      'Une page à la fois, ça compte 💫',
      'Bonne énergie créative aujourd\'hui 🌿',
    ];
    return list[new Date().getDate() % list.length];
  }, []);

  const goPlanner = (tab?: string) => {
    if (tab) { try { localStorage.setItem('ebook_planner_active_tab', tab); } catch { void 0; } }
    navigate('/ebook-planner');
  };

  // ───────── Bandes de tuiles ─────────
  const createTiles: Tile[] = [
    {
      emoji: '📖',
      title: 'Écrire un ebook',
      desc: 'Pipeline IA P1 → P15 (Amazon KDP)',
      tint: 'bg-joy-peach/40',
      ring: 'hover:ring-joy-peach',
      action: () => goPlanner('workflow-dashboard'),
      featured: true,
    },
    {
      emoji: '🎧',
      title: 'Audiobook',
      desc: 'Manuscrit → livre audio TTS pro',
      tint: 'bg-joy-mint/40',
      ring: 'hover:ring-joy-mint',
      action: () => goPlanner('audio'),
    },
    {
      emoji: '🎨',
      title: 'Coloriage KDP',
      desc: 'Cahier prêt à publier',
      tint: 'bg-joy-lavender/40',
      ring: 'hover:ring-joy-lavender',
      action: () => goPlanner('coloring'),
    },
    {
      emoji: '💬',
      title: 'BD / Comic',
      desc: 'Assembler une BD à partir de prompts',
      tint: 'bg-joy-sun/40',
      ring: 'hover:ring-joy-sun',
      action: () => navigate('/bd-studio'),
    },
  ];

  const boostTiles: Tile[] = [
    {
      emoji: '🔑',
      title: 'Mots-clés KDP',
      desc: 'Recherche & validation Amazon',
      tint: 'bg-joy-mint/40',
      ring: 'hover:ring-joy-mint',
      action: () => navigate('/kdp-keywords'),
    },
    {
      emoji: '📊',
      title: 'Plan marketing',
      desc: 'Stratégie complète de lancement',
      tint: 'bg-joy-peach/40',
      ring: 'hover:ring-joy-peach',
      action: () => navigate('/plan-marketing'),
    },
    {
      emoji: '🎯',
      title: 'Niches porteuses',
      desc: 'Best-sellers & opportunités 2026',
      tint: 'bg-joy-sun/40',
      ring: 'hover:ring-joy-sun',
      action: () => navigate('/niches'),
    },
  ];

  const learnTiles: Tile[] = [
    {
      emoji: '🎓',
      title: 'Formation',
      desc: 'Modules pas à pas',
      tint: 'bg-joy-lavender/40',
      ring: 'hover:ring-joy-lavender',
      action: () => navigate('/formation'),
    },
    {
      emoji: '🤝',
      title: 'Communauté',
      desc: 'Échanger avec les auteurs',
      tint: 'bg-joy-mint/40',
      ring: 'hover:ring-joy-mint',
      action: () => navigate('/communaute'),
    },
    {
      emoji: '🛠️',
      title: 'Guide des outils',
      desc: 'Comment tirer le meilleur de l\'atelier',
      tint: 'bg-joy-peach/40',
      ring: 'hover:ring-joy-peach',
      action: () => navigate('/guide-outils'),
    },
  ];

  const accountTiles: Tile[] = [
    {
      emoji: '🪪',
      title: 'Mon code & accès',
      desc: 'Retrouver son code',
      tint: 'bg-joy-cream',
      ring: 'hover:ring-joy-ink/20',
      action: () => navigate('/mon-code'),
    },
    {
      emoji: '❓',
      title: 'FAQ & assistance',
      desc: 'Réponses & contact',
      tint: 'bg-joy-cream',
      ring: 'hover:ring-joy-ink/20',
      action: () => navigate('/faq'),
    },
  ];

  const renderTile = (t: Tile, key: string, compact = false) => (
    <Card
      key={key}
      onClick={t.action}
      className={`group relative cursor-pointer rounded-3xl border bg-white transition-all duration-200 hover:-translate-y-1.5 ring-1 ring-transparent ${t.ring} hover:ring-2`}
      style={{
        borderColor: t.featured ? TEAL : 'hsl(var(--joy-ink) / 0.08)',
        boxShadow: 'var(--shadow-soft)',
      }}
    >
      {t.featured && (
        <Badge
          className="absolute -top-2 right-3 rounded-full text-[10px] px-2 py-0.5"
          style={{ background: TEAL, color: 'white' }}
        >
          Recommandé
        </Badge>
      )}
      <CardContent className={compact ? 'p-4' : 'p-5'}>
        <div className="flex items-start gap-3">
          <div
            className={`${t.tint} ${compact ? 'h-11 w-11 text-2xl' : 'h-14 w-14 text-3xl'} rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3`}
          >
            {t.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <div className={`font-semibold tracking-tight ${compact ? 'text-sm' : 'text-base'} text-joy-ink`}>
              {t.title}
            </div>
            <p className={`text-joy-ink/60 mt-0.5 ${compact ? 'text-[11px]' : 'text-xs'} line-clamp-2`}>
              {t.desc}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-joy-ink/25 group-hover:text-joy-ink/70 group-hover:translate-x-0.5 transition-all mt-2 shrink-0" />
        </div>
      </CardContent>
    </Card>
  );

  const renderBand = (label: string, tiles: Tile[], cols: string, compact = false) => (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-joy-ink/55">
          {label}
        </span>
        <span className="flex-1 h-px bg-joy-ink/10" />
      </div>
      <div className={`grid gap-3 sm:gap-4 ${cols}`}>
        {tiles.map((t, i) => renderTile(t, `${label}-${i}`, compact))}
      </div>
    </section>
  );

  const bannerDismissed = typeof window !== 'undefined' && localStorage.getItem('launch_vip_banner_dismissed_v1') === '1';

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA', color: TEXT }}>
      {!bannerDismissed && (
        <div className="w-full text-white text-sm" style={{ background: 'linear-gradient(90deg, #008296 0%, #FF9E2D 100%)' }}>
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2">
            <span className="text-lg" aria-hidden>🎉</span>
            <p className="flex-1 truncate font-medium">
              <span className="hidden sm:inline">Lancement en cours — </span>
              <strong>Tes 2 cadeaux abonné</strong> t'attendent : 30 min Zoom + −30 % à vie
            </p>
            <button
              onClick={() => navigate('/espace/lancement')}
              className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold whitespace-nowrap hover:bg-white"
              style={{ color: '#008296' }}
            >
              Voir mes cadeaux →
            </button>
            <button
                onClick={() => { try { localStorage.setItem('launch_vip_banner_dismissed_v1', '1'); } catch { void 0; } window.location.reload(); }}
              className="text-white/80 hover:text-white text-lg leading-none px-1"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        </div>
      )}
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
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/admin-cockpit')}
                className="rounded-full px-3 gap-1.5 border-2 hover:scale-[1.03] transition-all"
                style={{ borderColor: TEAL, color: TEAL }}
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Cockpit admin</span>
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => goPlanner('workflow-dashboard')}
              className="rounded-full px-4 gap-1.5 hover:opacity-90 hover:scale-[1.03] transition-all shadow-[0_2px_8px_rgba(0,130,150,0.25)]"
              style={{ background: TEAL, color: 'white' }}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Tableau de bord</span>
            </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-joy-ink/75 hover:text-joy-ink hover:bg-joy-ink/5 gap-1.5 px-3"
              >
                <div className="h-6 w-6 rounded-full bg-joy-cream flex items-center justify-center text-[11px] font-bold" style={{ color: TEAL }}>
                  {(firstName || subscriberEmail || '?').charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-xs max-w-[180px] truncate">{subscriberEmail}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-2 rounded-2xl">
              <div className="px-2 py-2 text-xs text-joy-ink/60 truncate border-b border-joy-ink/8 mb-1">
                {subscriberEmail}
              </div>
              <button
                onClick={() => navigate('/mon-code')}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-joy-cream text-sm text-joy-ink text-left"
              >
                🪪 Mon code d'accès
              </button>
              <button
                onClick={() => navigate('/faq')}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-joy-cream text-sm text-joy-ink text-left"
              >
                ❓ Aide & assistance
              </button>
              <div className="border-t border-joy-ink/8 my-1" />
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-joy-ink/5 text-sm text-joy-ink/75 text-left"
              >
                <LogOut className="h-3.5 w-3.5" /> Déconnexion
              </button>
            </PopoverContent>
          </Popover>
          </div>
        </div>
      </header>

      <section className="border-b border-joy-ink/10 bg-joy-cream">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <button
            onClick={() => navigate('/niches-600')}
            className="group flex w-full flex-col gap-3 rounded-3xl border border-joy-ink/10 bg-white p-4 text-left shadow-[var(--shadow-elevated)] transition-all hover:-translate-y-0.5 hover:border-joy-peach sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-joy-sun/45 text-joy-ink">
                <Target className="h-6 w-6" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-black uppercase tracking-widest text-joy-ink/55">Nouveau dans ton espace</span>
                <span className="block text-lg font-black tracking-tight text-joy-ink">600 niches KDP rentables 2026</span>
                <span className="block text-sm text-joy-ink/65">Accès direct à la liste complète avec mots-clés, BSR, concurrence et export CSV.</span>
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-joy-peach px-4 py-2 text-sm font-black text-joy-ink transition-transform group-hover:translate-x-1">
              Ouvrir les 600 niches <ArrowRight className="h-4 w-4" />
            </span>
          </button>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        {/* Hero */}
        <section className="space-y-1.5">
          <p className="text-xs uppercase tracking-widest text-joy-ink/50">{today}</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            Bonjour{firstName ? `, ${firstName}` : ''} <span className="inline-block animate-joy-wiggle">👋</span>
          </h1>
          <p className="text-joy-ink/65 text-base sm:text-lg">{cheers}</p>
        </section>

        {/* Bloc Reprendre */}
        <section>
          <Card
            className="border rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--joy-cream)) 0%, #ffffff 65%)',
              borderColor: 'hsl(var(--joy-ink) / 0.08)',
              boxShadow: 'var(--shadow-elevated)',
            }}
          >
            <CardContent className="p-6 sm:p-7">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4" style={{ color: TEAL }} />
                <span className="text-[11px] font-bold uppercase tracking-widest text-joy-ink/60">
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
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-joy-ink/55 flex items-center gap-2">
                <FileText className="h-3.5 w-3.5" /> Mes livres récents
              </span>
              <Button variant="ghost" size="sm" onClick={() => goPlanner('projects')} className="rounded-full text-xs">
                Voir tout <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {projects.slice(1, 4).map((p) => (
                <Card
                  key={p.id}
                  onClick={() => goPlanner()}
                  className="cursor-pointer rounded-2xl border transition-all duration-200 hover:-translate-y-0.5"
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

        {/* Bandes de tuiles : Mon atelier */}
        <div className="space-y-8">
          {renderBand('Créer', createTiles, 'sm:grid-cols-2 lg:grid-cols-4')}
          {renderBand('Booster mes ventes', boostTiles, 'sm:grid-cols-2 lg:grid-cols-3')}
          {renderBand('Apprendre & échanger', learnTiles, 'sm:grid-cols-2 lg:grid-cols-3')}
          {renderBand('Mon compte', accountTiles, 'sm:grid-cols-2', true)}
        </div>

        <footer className="text-center text-xs text-joy-ink/55 pt-6 pb-8 space-x-3">
          <button onClick={() => navigate('/faq')} className="underline hover:text-joy-ink">
            FAQ &amp; assistance
          </button>
          <span aria-hidden>·</span>
          <button onClick={() => navigate('/coaching-vip')} className="hover:text-joy-ink">
            Coaching VIP sur rendez-vous
          </button>
        </footer>
      </main>
    </div>
  );
};

export default EspacePage;
