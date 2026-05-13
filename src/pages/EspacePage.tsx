import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
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

  useEffect(() => {
    try { setLastTab(localStorage.getItem('ebook_planner_active_tab')); } catch {}
    let cancelled = false;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setProjects([]); return; }
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
  }, []);

  const lastProject = projects[0];
  const lastStepLabel = useMemo(() => {
    if (!lastTab) return null;
    if (lastTab.startsWith('P')) return `étape ${lastTab.toUpperCase()}`;
    if (lastTab === 'workflow-dashboard') return 'tableau de bord IA';
    if (lastTab === 'planner') return 'plan du livre';
    if (lastTab === 'cover' || lastTab.startsWith('images')) return 'studio image';
    return lastTab;
  }, [lastTab]);

  const goPlanner = (tab?: string) => {
    if (tab) { try { localStorage.setItem('ebook_planner_active_tab', tab); } catch {} }
    navigate('/ebook-planner');
  };

  const createCards = [
    {
      title: 'Écrire un ebook',
      desc: 'Pipeline IA P1 → P15 (Amazon KDP). Le chemin recommandé.',
      icon: BookOpen,
      bg: 'bg-joy-peach',
      action: () => goPlanner('workflow-dashboard'),
      cta: 'Démarrer un livre',
      featured: true,
    },
    {
      title: 'Audiobook',
      desc: 'Transformer un manuscrit en livre audio TTS pro.',
      icon: Headphones,
      bg: 'bg-joy-mint',
      action: () => goPlanner('audio'),
      cta: "Créer l'audio",
    },
    {
      title: 'Livre de coloriage',
      desc: 'Générer un cahier KDP prêt à publier en quelques clics.',
      icon: Palette,
      bg: 'bg-joy-lavender',
      action: () => goPlanner('coloring'),
      cta: 'Créer un coloriage',
    },
    {
      title: 'BD / Comic',
      desc: 'Assembler une bande dessinée à partir de prompts.',
      icon: MessageSquare,
      bg: 'bg-joy-sun',
      action: () => navigate('/bd-studio'),
      cta: 'Ouvrir BD Studio',
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#FAFAFA', color: TEXT }}>
      {/* Header simple */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/espace')} className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5" style={{ color: TEAL }} />
            <span>Mon espace</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">{subscriberEmail}</span>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-1" /> Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Bloc Reprendre */}
        <section>
          <Card className="border-2" style={{ borderColor: TEAL }}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" style={{ color: TEAL }} />
                <CardTitle className="text-xl">Reprendre où vous en étiez</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
                </div>
              ) : lastProject ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div>
                    <div className="font-semibold text-lg">{lastProject.title || 'Projet sans titre'}</div>
                    <div className="text-sm text-muted-foreground">
                      {lastProject.author_name ? `par ${lastProject.author_name} · ` : ''}
                      modifié {formatRelative(lastProject.updated_at)}
                      {lastStepLabel ? ` · dernière étape : ${lastStepLabel}` : ''}
                    </div>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => goPlanner(lastTab || undefined)}
                    style={{ background: TEAL, color: 'white' }}
                    className="hover:opacity-90"
                  >
                    Continuer <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div className="text-muted-foreground">
                    Aucun projet en cours. Lancez votre premier livre en 1 clic.
                  </div>
                  <Button
                    size="lg"
                    onClick={() => goPlanner('workflow-dashboard')}
                    style={{ background: ORANGE, color: TEXT }}
                    className="hover:opacity-90 font-semibold"
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
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" style={{ color: TEAL }} /> Mes livres
              </h2>
              <Button variant="ghost" size="sm" onClick={() => goPlanner('projects')}>
                Voir tout <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {projects.slice(1, 4).map((p) => (
                <Card key={p.id} className="hover:shadow-md transition cursor-pointer" onClick={() => goPlanner()}>
                  <CardContent className="p-4">
                    <div className="font-medium line-clamp-1">{p.title || 'Sans titre'}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatRelative(p.updated_at)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Bloc Créer du neuf */}
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5" style={{ color: ORANGE }} /> Créer du neuf
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {createCards.map((c) => (
              <Card
                key={c.title}
                className={`${c.bg} border-2 cursor-pointer hover:shadow-lg transition relative`}
                style={{ borderColor: c.featured ? TEAL : 'transparent' }}
                onClick={c.action}
              >
                {c.featured && (
                  <Badge className="absolute -top-2 right-3" style={{ background: TEAL, color: 'white' }}>
                    Recommandé
                  </Badge>
                )}
                <CardHeader className="pb-2">
                  <c.icon className="h-7 w-7" style={{ color: TEXT }} />
                  <CardTitle className="text-base mt-2">{c.title}</CardTitle>
                  <CardDescription className="text-xs" style={{ color: TEXT, opacity: 0.75 }}>
                    {c.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size="sm" variant="secondary" className="w-full" onClick={(e) => { e.stopPropagation(); c.action(); }}>
                    {c.cta} <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Bloc Aller plus loin */}
        <section>
          <Accordion type="single" collapsible>
            <AccordionItem value="more" className="border rounded-lg bg-white px-4">
              <AccordionTrigger className="text-base font-semibold">
                Aller plus loin (marketing, KDP, formations…)
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                  <SecondaryLink icon={BarChart3} label="Plan marketing" onClick={() => navigate('/plan-marketing')} />
                  <SecondaryLink icon={Sparkles} label="KDP Keywords" onClick={() => navigate('/kdp-keywords')} />
                  <SecondaryLink icon={FileText} label="Niches porteuses" onClick={() => navigate('/niches')} />
                  <SecondaryLink icon={GraduationCap} label="Formations" onClick={() => navigate('/formation')} />
                  <SecondaryLink icon={Users} label="Communauté" onClick={() => navigate('/communaute')} />
                  <SecondaryLink icon={Crown} label="Coaching VIP" onClick={() => navigate('/coaching-vip')} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <footer className="text-center text-xs text-muted-foreground pt-4 pb-8">
          Besoin d'aide ? <button onClick={() => navigate('/faq')} className="underline">FAQ & assistance</button>
        </footer>
      </main>
    </div>
  );
};

const SecondaryLink: React.FC<{ icon: React.ElementType; label: string; onClick: () => void }> = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 p-3 rounded-md border hover:border-[#008296] hover:bg-[#0082960d] transition text-left"
  >
    <Icon className="h-4 w-4" style={{ color: TEAL }} />
    <span className="text-sm">{label}</span>
    <ArrowRight className="h-4 w-4 ml-auto opacity-50" />
  </button>
);

export default EspacePage;
