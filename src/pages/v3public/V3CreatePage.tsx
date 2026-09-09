import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Sparkles, Loader2, ImageIcon, ArrowRight, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { BackButton } from '@/components/v3/BackButton';
import V3BriefRecap from '@/components/v3public/V3BriefRecap';
import V3AmbiancePicker from '@/components/v3public/V3AmbiancePicker';
import V3KeyHint from '@/components/v3public/V3KeyHint';
import V3PipelinePanel from '@/components/v3public/V3PipelinePanel';

import V3GenieDialog from '@/components/v3public/V3GenieDialog';
import V3QuickActionsBar from '@/components/v3public/V3QuickActionsBar';
import V3ResumeBookCard from '@/components/v3public/V3ResumeBookCard';
import V3GenieOutlinePanel from '@/components/v3public/V3GenieOutlinePanel';
import V3BookActionsBar from '@/components/v3public/V3BookActionsBar';
import V3OutlineCoBuilder from '@/components/v3public/V3OutlineCoBuilder';
import V3PassageCorrector from '@/components/v3public/V3PassageCorrector';

import { BOOK_BRIEF_EVENT, readBookBrief, writeBookBrief, type BriefOutlineChapter } from '@/lib/v3/bookBrief';


const V3CreateWizard = lazy(() => import('@/components/v3public/V3CreateWizard'));
const V3ImportStudio = lazy(() => import('@/components/v3public/V3ImportStudio'));


/** Préremplit la fiche livre du hub à partir de query params afin que BookCreationStudio
 *  (qui lit `edition_book_config_v1`) parte avec le bon titre/genre/idée. */
function seedHubConfig(idea: string | null, genre: string | null, type: string | null) {
  try {
    const raw = localStorage.getItem('edition_book_config_v1');
    const prev = raw ? JSON.parse(raw) : {};
    const next = {
      ...prev,
      description: idea || prev.description || '',
      genre: genre || type || prev.genre || '',
    };
    localStorage.setItem('edition_book_config_v1', JSON.stringify(next));
  } catch { /* ignore */ }
}

type PageProps = {
  /** 'biography' = onglet « Biographie — Le récit de votre vie ». */
  mode?: 'book' | 'biography';
};

export default function V3CreatePage({ mode = 'book' }: PageProps) {
  const biography = mode === 'biography';
  const [params] = useSearchParams();
  const importMode = params.get('import') === '1';
  const idea = params.get('idea');
  const genre = params.get('genre');
  const type = params.get('type');
  const sommaireIa = params.get('sommaire') === 'ia';
  const projectId = params.get('projectId');

  const [showWizard, setShowWizard] = useState(false);
  const [openedBook, setOpenedBook] = useState<{ id: string; title: string; chapters: number } | null>(null);
  const [openingBook, setOpeningBook] = useState(false);
  const [briefKey, setBriefKey] = useState(0);
  const wizardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { seedHubConfig(idea, genre, type); }, [idea, genre, type]);

  // La nature du projet est portée par la fiche : biographie ou livre classique.
  useEffect(() => {
    const current = readBookBrief() || {};
    const wanted: 'book' | 'biography' = biography ? 'biography' : 'book';
    if (current.mode !== wanted) writeBookBrief({ ...current, mode: wanted });
  }, [biography]);

  // Ouverture d'un livre existant depuis « Mes livres » (?projectId=...)
  useEffect(() => {
    if (!projectId) { setOpenedBook(null); return; }
    let cancelled = false;
    (async () => {
      setOpeningBook(true);
      const { data, error } = await supabase
        .from('ebook_projects')
        .select('id,title,author_name,kdp_description,kdp_categories,tone,chapters,number_of_chapters')
        .eq('id', projectId)
        .maybeSingle();
      if (cancelled) return;
      setOpeningBook(false);
      if (error || !data) {
        toast.error("Ce livre est introuvable ou n'est plus accessible.");
        return;
      }
      const rawChapters = Array.isArray(data.chapters) ? (data.chapters as any[]) : [];
      const outline: BriefOutlineChapter[] = rawChapters.map((c, i) => ({
        numero: i + 1,
        titre: String(c?.title || c?.titre || `Chapitre ${i + 1}`),
        objectif: String(c?.objectif || c?.summary || ''),
      }));
      const category = Array.isArray(data.kdp_categories)
        ? String(data.kdp_categories[0] || '')
        : String(data.kdp_categories || '');
      const prev = readBookBrief() || {};
      writeBookBrief({
        ...prev,
        projectId: data.id,
        title: data.title || prev.title || '',
        author: data.author_name || prev.author || '',
        description: data.kdp_description || prev.description || '',
        category: category || prev.category || '',
        tone: data.tone || prev.tone || '',
        chapters: outline.length || Number(data.number_of_chapters) || prev.chapters,
        outline: outline.length ? outline : prev.outline,
        outlineValidated: outline.length ? true : prev.outlineValidated,
      });

      setOpenedBook({ id: data.id, title: data.title || 'Livre sans titre', chapters: outline.length });
      setBriefKey((k) => k + 1);
      setShowWizard(true);
      setTimeout(() => wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    })();
    return () => { cancelled = true; };
  }, [projectId]);

  // Arrivée depuis « Sommaire IA » : on descend directement sur le panneau.
  useEffect(() => {
    if (!sommaireIa) return;
    const t = setTimeout(() => {
      document.getElementById('sommaire-ia')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
    return () => clearTimeout(t);
  }, [sommaireIa]);
  // Rien ne démarre avant la validation du sommaire : si la fiche est effacée
  // ou le sommaire dévalidé, le workflow se referme.
  useEffect(() => {
    const sync = () => {
      const validated = Boolean(readBookBrief()?.outlineValidated);
      if (!validated) setShowWizard(false);
    };
    window.addEventListener(BOOK_BRIEF_EVENT, sync);
    return () => window.removeEventListener(BOOK_BRIEF_EVENT, sync);
  }, []);

  const launchWorkflow = () => {
    if (!readBookBrief()?.outlineValidated) {
      toast.info('Validez d’abord votre sommaire : la rédaction démarre juste après.');
      document.getElementById('sommaire-ia')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setShowWizard(true);
    setTimeout(() => wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
  };


  if (importMode) {
    return (
      <section className="min-h-[calc(100vh-4rem)] py-14 px-5 bg-[var(--v3-paper,#fbfaf6)]">
        <div className="max-w-6xl mx-auto px-4 pt-4"><BackButton /></div>
        <Suspense fallback={<div className="py-24 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--v3-emerald,#064e3b)]" /></div>}>
          <V3ImportStudio />
        </Suspense>
      </section>
    );
  }

  return (
    <section className="v3-halo-soft min-h-[calc(100vh-4rem)] py-10 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <BackButton />
          <V3QuickActionsBar />
        </div>


        {openingBook && (
          <div className="mt-6 v3-card flex items-center gap-3 text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-[var(--v3-orange)]" /> Ouverture de votre livre…
          </div>
        )}

        {openedBook && (
          <div className="mt-6 v3-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--v3-muted)' }}>Livre ouvert</div>
                <div className="v3-serif text-xl font-bold truncate">{openedBook.title}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--v3-muted)' }}>
                  {openedBook.chapters > 0 ? `${openedBook.chapters} chapitre(s) chargé(s) dans le workflow` : 'Aucun chapitre enregistré pour le moment'}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/v3/book/${openedBook.id}`} className="v3-btn v3-btn-outline text-xs">
                  <BookOpen className="w-3.5 h-3.5" /> Lire le livre
                </Link>
                <Link to="/v3/mes-livres" className="v3-btn v3-btn-ghost text-xs">Mes livres</Link>
              </div>
            </div>
          </div>
        )}

        {/* Hero « Ebookstudio-Génie » */}
        {!openedBook && (
        <div className="mt-6 text-center">
          <span className="v3-chip v3-chip-orange">
            <Sparkles className="w-3.5 h-3.5" /> {biography ? 'Biographie — Le récit de votre vie' : 'Ebookstudio-Génie'}
          </span>
          <h1 className="v3-serif text-4xl md:text-5xl font-bold mt-4 leading-tight" style={{ color: 'var(--v3-ink)' }}>
            {biography ? 'Racontez votre vie, nous en faisons un livre' : 'Commencez à créer votre livre'}
          </h1>
          <p className="mt-3 text-sm md:text-base" style={{ color: 'var(--v3-muted)' }}>
            {biography
              ? 'Une question à la fois, période après période. Vos mots sont conservés et corrigés, jamais résumés, et le sommaire suit l’ordre réel de votre vie.'
              : 'Parlez de votre projet à Ebookstudio-Génie. Il construit le sommaire avec vous, rédige les chapitres, puis va jusqu’à l’export et la couverture.'}
          </p>
        </div>
        )}

        {/* Reprendre un livre déjà commencé */}
        {!openedBook && (
          <div className="mt-6">
            <V3ResumeBookCard />
          </div>
        )}

        {/* Ma maison d'édition : 4 bureaux, un seul chemin */}
        <div className="mt-7 v3-card" style={{ borderColor: 'var(--v3-gold, #c9a84c)' }}>
          <div className="flex flex-wrap items-center gap-2">
            {DESKS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDesk(d.id)}
                className="rounded-full border px-3 py-1.5 text-[12px] font-semibold transition"
                style={{
                  borderColor: desk === d.id ? 'var(--v3-gold, #c9a84c)' : 'rgba(0,0,0,0.12)',
                  background: desk === d.id ? 'rgba(201,168,76,0.14)' : '#fff',
                  color: 'var(--v3-ink)',
                }}
              >
                {d.id}. {d.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs" style={{ color: 'var(--v3-muted)' }}>
            {DESKS.find((d) => d.id === desk)?.hint}
          </p>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_380px] items-start">
          <div className="min-w-0 v3-ambiance">
            {/* ① Mon récit : j'écris, le Génie corrige */}
            {desk === 1 && !openedBook && (
              <>
                <V3GenieDialog
                  mode={biography ? 'biography' : 'book'}
                  initialIdea={idea || ''}
                  onReady={() => setDesk(2)}
                />
                <div className="mt-4">
                  <V3PassageCorrector mode={biography ? 'biography' : 'book'} />
                </div>
              </>
            )}

            {/* ② Sommaire : 3 chapitres à la fois */}
            {desk === 2 && <V3OutlineCoBuilder />}

            {/* ③ Rédaction : le Génie écrit et range chaque chapitre */}
            {desk === 3 && (
              showWizard ? (
                <div ref={wizardRef} className="v3-card">
                  <Suspense fallback={<div className="py-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--v3-orange)]" /></div>}>
                    <V3CreateWizard />
                  </Suspense>
                </div>
              ) : (
                <div className="v3-card">
                  <h2 className="v3-serif text-xl font-bold" style={{ color: 'var(--v3-ink)' }}>La rédaction</h2>
                  <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>
                    Validez votre sommaire, puis cliquez sur « Commencer la rédaction » : chaque chapitre
                    écrit se range tout seul à sa place, déjà corrigé.
                  </p>
                  <button type="button" onClick={launchWorkflow} className="v3-btn v3-btn-primary mt-4 text-xs">
                    <Sparkles className="w-3.5 h-3.5" /> Commencer la rédaction
                  </button>
                </div>
              )
            )}

            {/* ④ Livre & couverture : lire, corriger, exporter, couvrir */}
            {desk === 4 && (
              <div className="space-y-4">
                <div className="v3-card">
                  <h2 className="v3-serif text-xl font-bold" style={{ color: 'var(--v3-ink)' }}>Votre livre, prêt à publier</h2>
                  <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>
                    Relisez chaque chapitre dans la colonne de droite, puis servez-vous des boutons
                    ci-dessous : correction, export Word ou PDF, couverture, données KDP, traduction et audio.
                  </p>
                </div>
                <V3AmbiancePicker />
                <V3KeyHint />
                <V3PipelinePanel />
                <details className="rounded-[22px] border p-4" style={{ borderColor: 'var(--v3-border)', background: '#fff' }}>
                  <summary className="cursor-pointer text-xs font-semibold" style={{ color: 'var(--v3-muted)' }}>
                    Modifier la fiche à la main (titre, auteur, catégorie, synopsis…)
                  </summary>
                  <div className="mt-4">
                    <V3BriefRecap key={briefKey} variant="full" formOnly hideBookForm={false} />
                  </div>
                </details>
              </div>
            )}

            {/* Vos actions : toujours visibles, quel que soit le bureau */}
            <div className="mt-5">
              <V3BookActionsBar onLaunch={launchWorkflow} />
            </div>

            {/* Modes illustrés — liens discrets */}
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Link to="/v3/create/illustre" className="v3-btn v3-btn-ghost text-xs">
                <ImageIcon className="w-3.5 h-3.5" /> Album maternelle 3-6 ans <ArrowRight className="w-3 h-3" />
              </Link>
              <Link to="/v3/create/illustre?preset=histoires-du-soir-3-7" className="v3-btn v3-btn-ghost text-xs">
                <ImageIcon className="w-3.5 h-3.5" /> Histoires du soir 3-7 ans <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Colonne « Votre livre en direct » : sommaire unique + texte écrit */}
          <aside id="sommaire-ia" className="order-first min-w-0 lg:order-last lg:sticky lg:top-24">
            <V3GenieOutlinePanel key={briefKey} outlineMode={sommaireIa ? 'guided' : undefined} />
          </aside>
        </div>



      </div>
    </section>
  );
}
