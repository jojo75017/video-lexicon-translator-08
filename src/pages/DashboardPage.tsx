import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  ArrowRight, Sparkles, LogOut, ChevronDown, LayoutDashboard, Shield,
  BookOpen, Rocket, Headphones, Activity, Search, PenTool, Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { getIsCurrentSessionAdmin } from '@/lib/adminAccess';

interface DashboardPageProps {
  subscriberEmail: string;
  onLogout: () => void;
}

const TEAL = '#008296';
const ORANGE = '#FF9E2D';
const TEXT = '#232F3E';

interface EbookRow {
  id: string;
  title: string | null;
  author_name: string | null;
  updated_at: string;
  chapters: unknown;
  ebook_images: unknown;
  cover_concepts: string | null;
  kdp_description: string | null;
  number_of_chapters: number | null;
}

interface AudioRow {
  id: string;
  title: string;
  status: string;
  cover_url: string | null;
  updated_at: string;
}

const PIPELINE_STEPS = ['Niche', 'Plan', 'Rédaction', 'Couverture', 'Export', 'Publier'] as const;

const computeSteps = (p: EbookRow, publishedTitles: Set<string>): boolean[] => {
  const chapters = Array.isArray(p.chapters) ? (p.chapters as Array<Record<string, unknown>>) : [];
  const images = Array.isArray(p.ebook_images) ? (p.ebook_images as unknown[]) : [];
  const hasWriting = chapters.some((c) => {
    const v = (c?.content ?? c?.text ?? '') as string;
    return typeof v === 'string' && v.trim().length > 50;
  });
  return [
    !!(p.title && p.title.trim()),                        // Niche
    chapters.length > 0 || !!p.number_of_chapters,        // Plan
    hasWriting,                                            // Rédaction
    images.length > 0 || !!(p.cover_concepts && p.cover_concepts.trim()), // Couverture
    !!(p.kdp_description && p.kdp_description.trim()),     // Export
    !!(p.title && publishedTitles.has(p.title.trim().toLowerCase())), // Publier
  ];
};

const formatRelative = (iso: string) => {
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const h = Math.floor(diffMin / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  return `il y a ${d} j`;
};

const DashboardPage: React.FC<DashboardPageProps> = ({ subscriberEmail, onLogout }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [ebooks, setEbooks] = useState<EbookRow[]>([]);
  const [audiobooks, setAudiobooks] = useState<AudioRow[]>([]);
  const [publishedTitles, setPublishedTitles] = useState<Set<string>>(new Set());
  const [usage, setUsage] = useState({ plans: 0, covers: 0 });

  useEffect(() => {
    let cancelled = false;
    getIsCurrentSessionAdmin().then((v) => { if (!cancelled) setIsAdmin(!!v); }).catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }
        const meta = (user.user_metadata || {}) as Record<string, string>;
        const fn = meta.first_name || meta.full_name?.split(' ')[0] || (subscriberEmail || '').split('@')[0];
        if (!cancelled && fn) setFirstName(fn.charAt(0).toUpperCase() + fn.slice(1));

        const [{ data: eb }, { data: ab }, { data: pb }, { data: sub }] = await Promise.all([
          supabase.from('ebook_projects')
            .select('id, title, author_name, updated_at, chapters, ebook_images, cover_concepts, kdp_description, number_of_chapters')
            .eq('user_id', user.id).order('updated_at', { ascending: false }).limit(24),
          supabase.from('audiobooks')
            .select('id, title, status, cover_url, updated_at')
            .eq('user_id', user.id).order('updated_at', { ascending: false }).limit(12),
          supabase.from('published_books').select('title').eq('user_id', user.id),
          supabase.from('subscribers').select('ebook_plans_generated, covers_generated').eq('email', subscriberEmail).maybeSingle(),
        ]);

        if (cancelled) return;
        setEbooks((eb as EbookRow[]) || []);
        setAudiobooks((ab as AudioRow[]) || []);
        setPublishedTitles(new Set(((pb as { title: string }[]) || []).map((r) => (r.title || '').trim().toLowerCase())));
        if (sub) setUsage({ plans: (sub as any).ebook_plans_generated || 0, covers: (sub as any).covers_generated || 0 });
      } catch (e) {
        console.warn('[Dashboard] load failed', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [subscriberEmail]);

  const goPlanner = (tab?: string) => {
    if (tab) { try { localStorage.setItem('ebook_planner_active_tab', tab); } catch { void 0; } }
    navigate('/ebook-planner');
  };

  const withProgress = useMemo(() => ebooks.map((p) => {
    const steps = computeSteps(p, publishedTitles);
    const done = steps.filter(Boolean).length;
    return { p, steps, pct: Math.round((done / steps.length) * 100) };
  }), [ebooks, publishedTitles]);

  const inProgress = useMemo(() => withProgress.filter((x) => x.pct < 100).slice(0, 4), [withProgress]);
  const recent = useMemo(() => withProgress.slice(0, 6), [withProgress]);

  const stats = useMemo(() => ({
    created: ebooks.length,
    published: publishedTitles.size,
    audio: audiobooks.length,
    inProgress: withProgress.filter((x) => x.pct < 100).length,
  }), [ebooks.length, publishedTitles.size, audiobooks.length, withProgress]);

  const usageBars = [
    { icon: BookOpen, label: 'Livres électroniques', value: Math.max(usage.plans, ebooks.length), max: 10, tint: 'bg-joy-mint/40' },
    { icon: Headphones, label: 'Livres audio', value: audiobooks.length, max: 10, tint: 'bg-joy-lavender/40' },
    { icon: ImageIcon, label: 'Modèles de couverture', value: usage.covers, max: 30, tint: 'bg-joy-peach/40' },
  ];

  const statCards = [
    { icon: BookOpen, label: 'Livres créés', value: stats.created, color: TEAL, tint: 'bg-joy-mint/40' },
    { icon: Rocket, label: 'Publié', value: stats.published, color: '#9b59d0', tint: 'bg-joy-lavender/40' },
    { icon: Headphones, label: 'Livres audio', value: stats.audio, color: '#3b82c4', tint: 'bg-joy-sun/40' },
    { icon: Activity, label: 'En cours', value: stats.inProgress, color: '#2db58a', tint: 'bg-joy-peach/40' },
  ];

  const quickActions = [
    { emoji: '🔎', icon: Search, title: 'Trouver un créneau', desc: 'Étude de marché par IA', tint: 'bg-joy-mint/40', action: () => navigate('/niches-600') },
    { emoji: '✍️', icon: PenTool, title: 'Générer un livre', desc: 'Écrivain IA', tint: 'bg-joy-lavender/40', action: () => goPlanner('workflow-dashboard') },
    { emoji: '🎨', icon: ImageIcon, title: 'Couverture du design', desc: 'Créateur de couvertures IA', tint: 'bg-joy-peach/40', action: () => goPlanner('cover') },
    { emoji: '🎧', icon: Headphones, title: 'Créer un livre audio', desc: 'Synthèse vocale par IA', tint: 'bg-joy-sun/40', action: () => goPlanner('audio') },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA', color: TEXT }}>
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md" style={{ backgroundColor: 'rgba(250,250,250,0.85)', borderBottom: '1px solid hsl(var(--joy-ink) / 0.08)' }}>
        <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center justify-between">
          <button onClick={() => navigate('/espace')} className="flex items-center gap-2 font-semibold tracking-tight">
            <Sparkles className="h-5 w-5" style={{ color: TEAL }} />
            <span>Tableau de bord</span>
          </button>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button size="sm" variant="outline" onClick={() => navigate('/admin-cockpit')} className="rounded-full px-3 gap-1.5 border-2 hover:scale-[1.03] transition-all" style={{ borderColor: TEAL, color: TEAL }}>
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Cockpit admin</span>
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => navigate('/espace')} className="rounded-full px-3 gap-1.5 hover:scale-[1.03] transition-all">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Mon espace</span>
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full text-joy-ink/75 hover:text-joy-ink hover:bg-joy-ink/5 gap-1.5 px-3">
                  <div className="h-6 w-6 rounded-full bg-joy-cream flex items-center justify-center text-[11px] font-bold" style={{ color: TEAL }}>
                    {(firstName || subscriberEmail || '?').charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-xs max-w-[180px] truncate">{subscriberEmail}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 p-2 rounded-2xl">
                <div className="px-2 py-2 text-xs text-joy-ink/60 truncate border-b border-joy-ink/8 mb-1">{subscriberEmail}</div>
                <button onClick={() => navigate('/mon-code')} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-joy-cream text-sm text-joy-ink text-left">🪪 Mon code d'accès</button>
                <button onClick={() => navigate('/faq')} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-joy-cream text-sm text-joy-ink text-left">❓ Aide &amp; assistance</button>
                <div className="border-t border-joy-ink/8 my-1" />
                <button onClick={onLogout} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-joy-ink/5 text-sm text-joy-ink/75 text-left">
                  <LogOut className="h-3.5 w-3.5" /> Déconnexion
                </button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Hero */}
        <section>
          <Card className="border rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(var(--joy-cream)) 0%, #ffffff 70%)', borderColor: 'hsl(var(--joy-ink) / 0.08)', boxShadow: 'var(--shadow-elevated)' }}>
            <CardContent className="p-7 sm:p-9">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest" style={{ background: `${TEAL}14`, color: TEAL }}>
                <Sparkles className="h-3.5 w-3.5" /> Accélérateur KDP
              </span>
              <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                Bienvenue à nouveau{firstName ? ', ' : ''}<span style={{ color: TEAL }}>{firstName}</span>
              </h1>
              <p className="mt-2 text-joy-ink/65 text-base sm:text-lg max-w-xl">
                Votre empire de l'édition vous attend. Reprenez vos livres ou commencez une nouvelle création.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => goPlanner('workflow-dashboard')} className="rounded-full px-6 gap-2 hover:opacity-90 hover:scale-[1.03] transition-all shadow-[0_4px_14px_rgba(0,130,150,0.3)]" style={{ background: TEAL, color: 'white' }}>
                  <Sparkles className="h-4 w-4" /> Créer un nouveau livre
                </Button>
                <Button size="lg" variant="outline" onClick={() => goPlanner('workflow-dashboard')} className="rounded-full px-6 gap-2 border-2 hover:scale-[1.03] transition-all" style={{ borderColor: TEAL, color: TEAL }}>
                  <Activity className="h-4 w-4" /> Voir le pipeline
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stat cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statCards.map((s) => (
            <Card key={s.label} className="rounded-2xl border bg-white" style={{ borderColor: 'hsl(var(--joy-ink) / 0.08)', boxShadow: 'var(--shadow-soft)' }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`${s.tint} h-10 w-10 rounded-xl flex items-center justify-center`}>
                    <s.icon className="h-5 w-5" style={{ color: s.color }} />
                  </div>
                  <Badge variant="outline" className="rounded-full text-[10px] gap-1 border-joy-ink/15 text-joy-ink/55">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#2db58a' }} /> En direct
                  </Badge>
                </div>
                <div className="mt-3 text-3xl font-bold" style={{ color: s.color }}>
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : s.value}
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-joy-ink/55 mt-1">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Usage */}
        <section>
          <Card className="rounded-3xl border bg-white" style={{ borderColor: 'hsl(var(--joy-ink) / 0.08)', boxShadow: 'var(--shadow-soft)' }}>
            <CardContent className="p-6">
              <div className="mb-4">
                <h2 className="font-bold tracking-tight">Utilisation mensuelle</h2>
                <p className="text-xs text-joy-ink/55">Réinitialisation le 1er de chaque mois</p>
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                {usageBars.map((u) => {
                  const pct = Math.min(100, Math.round((u.value / u.max) * 100));
                  return (
                    <div key={u.label}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`${u.tint} h-8 w-8 rounded-lg flex items-center justify-center`}>
                          <u.icon className="h-4 w-4" style={{ color: TEAL }} />
                        </div>
                        <span className="text-sm font-medium">{u.label}</span>
                      </div>
                      <div className="flex items-end justify-between mb-1">
                        <span className="text-lg font-bold">{u.value} <span className="text-sm font-normal text-joy-ink/45">/ {u.max}</span></span>
                        <span className="text-[11px] text-joy-ink/45">{Math.max(0, u.max - u.value)} restants</span>
                      </div>
                      <div className="h-2 rounded-full bg-joy-ink/8 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${TEAL}, ${ORANGE})` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Create */}
        <section className="grid sm:grid-cols-2 gap-3">
          <button onClick={() => goPlanner('workflow-dashboard')} className="group flex items-center gap-4 rounded-3xl border bg-white p-5 text-left transition-all hover:-translate-y-1 hover:border-joy-mint ring-1 ring-transparent hover:ring-2 hover:ring-joy-mint" style={{ borderColor: 'hsl(var(--joy-ink) / 0.08)', boxShadow: 'var(--shadow-soft)' }}>
            <div className="bg-joy-mint/40 h-14 w-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 transition-transform group-hover:scale-110">📖</div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold tracking-tight">Créer un ebook</div>
              <div className="text-xs text-joy-ink/55 mt-0.5">Niche → Plan → Chapitres → Couverture → Publier</div>
            </div>
            <ArrowRight className="h-5 w-5 text-joy-ink/25 group-hover:text-joy-ink/70 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
          <button onClick={() => goPlanner('audio')} className="group flex items-center gap-4 rounded-3xl border bg-white p-5 text-left transition-all hover:-translate-y-1 hover:border-joy-lavender ring-1 ring-transparent hover:ring-2 hover:ring-joy-lavender" style={{ borderColor: 'hsl(var(--joy-ink) / 0.08)', boxShadow: 'var(--shadow-soft)' }}>
            <div className="bg-joy-lavender/40 h-14 w-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 transition-transform group-hover:scale-110">🎧</div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold tracking-tight">Créer un livre audio</div>
              <div className="text-xs text-joy-ink/55 mt-0.5">Source → Voix → Générer → Exporter → Publier</div>
            </div>
            <ArrowRight className="h-5 w-5 text-joy-ink/25 group-hover:text-joy-ink/70 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        </section>

        {/* Quick actions */}
        <section>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-joy-ink/55">Actions rapides</span>
            <span className="flex-1 h-px bg-joy-ink/10" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((a) => (
              <Card key={a.title} onClick={a.action} className="group cursor-pointer rounded-2xl border bg-white transition-all duration-200 hover:-translate-y-1" style={{ borderColor: 'hsl(var(--joy-ink) / 0.08)', boxShadow: 'var(--shadow-soft)' }}>
                <CardContent className="p-4">
                  <div className={`${a.tint} h-11 w-11 rounded-2xl flex items-center justify-center text-2xl mb-3 transition-transform group-hover:scale-110`}>{a.emoji}</div>
                  <div className="font-semibold text-sm tracking-tight">{a.title}</div>
                  <p className="text-[11px] text-joy-ink/55 mt-0.5">{a.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Livres en cours */}
        {!loading && inProgress.length > 0 && (
          <section>
            <div className="mb-3">
              <h2 className="text-2xl font-bold tracking-tight">Livres en cours</h2>
              <p className="text-sm text-joy-ink/55">Reprenez là où vous vous êtes arrêté.</p>
            </div>
            <div className="space-y-3">
              {inProgress.map(({ p, steps, pct }) => (
                <Card key={p.id} className="rounded-2xl border bg-white" style={{ borderColor: 'hsl(var(--joy-ink) / 0.08)', boxShadow: 'var(--shadow-soft)' }}>
                  <CardContent className="p-4 flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex items-center gap-3 min-w-0 lg:w-72 shrink-0">
                      <div className="bg-joy-mint/40 h-10 w-10 rounded-xl flex items-center justify-center shrink-0">
                        <BookOpen className="h-5 w-5" style={{ color: TEAL }} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm line-clamp-1">{p.title || 'Sans titre'}</div>
                        <Badge className="mt-1 rounded-full text-[10px]" style={{ background: `${TEAL}1a`, color: TEAL }}>Livre électronique</Badge>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center gap-1 overflow-x-auto">
                      {PIPELINE_STEPS.map((label, i) => (
                        <React.Fragment key={label}>
                          <div className="flex flex-col items-center gap-1 shrink-0">
                            <span className="h-3 w-3 rounded-full" style={{ background: steps[i] ? '#2db58a' : 'hsl(var(--joy-ink) / 0.15)' }} />
                            <span className="text-[10px] text-joy-ink/55 whitespace-nowrap">{label}</span>
                          </div>
                          {i < PIPELINE_STEPS.length - 1 && (
                            <span className="h-0.5 flex-1 min-w-[16px] rounded-full" style={{ background: steps[i + 1] || steps[i] ? '#2db58a' : 'hsl(var(--joy-ink) / 0.12)' }} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-lg font-bold" style={{ color: TEAL }}>{pct} %</span>
                      <Button size="sm" onClick={() => goPlanner()} className="rounded-full px-4 gap-1.5 hover:opacity-90" style={{ background: TEAL, color: 'white' }}>
                        Continuer <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Livres récents */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-bold tracking-tight">Livres récents</h2>
            {recent.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => goPlanner('projects')} className="rounded-full text-xs">
                Voir tout <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            )}
          </div>
          {loading ? (
            <div className="flex items-center gap-2 text-joy-ink/55"><Loader2 className="h-4 w-4 animate-spin" /> Chargement…</div>
          ) : recent.length === 0 ? (
            <Card className="rounded-2xl border bg-white" style={{ borderColor: 'hsl(var(--joy-ink) / 0.08)' }}>
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-2">📚</div>
                <p className="text-joy-ink/65 mb-4">Aucun livre pour l'instant. Lancez votre première création.</p>
                <Button onClick={() => goPlanner('workflow-dashboard')} className="rounded-full px-6 gap-2" style={{ background: ORANGE, color: TEXT }}>
                  Créer mon premier livre <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {recent.map(({ p, pct }) => (
                <Card key={p.id} onClick={() => goPlanner()} className="group cursor-pointer rounded-2xl border bg-white overflow-hidden transition-all hover:-translate-y-1" style={{ borderColor: 'hsl(var(--joy-ink) / 0.08)', boxShadow: 'var(--shadow-soft)' }}>
                  <div className="relative aspect-[3/4] flex items-center justify-center bg-joy-cream">
                    <BookOpen className="h-10 w-10 text-joy-ink/20" />
                    <Badge className="absolute top-2 right-2 rounded-full text-[10px]" style={{ background: pct === 100 ? '#2db58a' : ORANGE, color: pct === 100 ? 'white' : TEXT }}>
                      {pct === 100 ? 'Publié' : 'Traitement'}
                    </Badge>
                  </div>
                  <CardContent className="p-3">
                    <div className="font-semibold text-xs line-clamp-2 leading-snug">{p.title || 'Sans titre'}</div>
                    <div className="text-[10px] text-joy-ink/50 mt-1">{formatRelative(p.updated_at)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Audiobooks récents */}
        {!loading && audiobooks.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-3">Livres audio</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {audiobooks.slice(0, 4).map((a) => (
                <Card key={a.id} onClick={() => goPlanner('audio')} className="group cursor-pointer rounded-2xl border bg-white overflow-hidden transition-all hover:-translate-y-1" style={{ borderColor: 'hsl(var(--joy-ink) / 0.08)', boxShadow: 'var(--shadow-soft)' }}>
                  <div className="relative aspect-[3/4] flex items-center justify-center bg-joy-lavender/30 overflow-hidden">
                    {a.cover_url ? <img src={a.cover_url} alt={a.title} className="h-full w-full object-cover" /> : <Headphones className="h-10 w-10 text-joy-ink/20" />}
                  </div>
                  <CardContent className="p-3">
                    <div className="font-semibold text-xs line-clamp-2 leading-snug">{a.title}</div>
                    <div className="text-[10px] text-joy-ink/50 mt-1 capitalize">{a.status}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <footer className="text-center text-xs text-joy-ink/55 pt-6 pb-8 space-x-3">
          <button onClick={() => navigate('/faq')} className="underline hover:text-joy-ink">FAQ &amp; assistance</button>
          <span aria-hidden>·</span>
          <button onClick={() => navigate('/espace')} className="hover:text-joy-ink">Mon espace</button>
        </footer>
      </main>
    </div>
  );
};

export default DashboardPage;
