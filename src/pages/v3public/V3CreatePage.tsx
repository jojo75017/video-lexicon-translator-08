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

/** Trois étapes seulement : on raconte, le sommaire se déduit, le livre se monte. */
const DESKS = [
  { id: 1 as const, label: 'J’écris', hint: 'Vous racontez comme vous parlez. Le Génie corrige chaque texte sans jamais le résumer. Aucun plan à faire.' },
  { id: 2 as const, label: 'Mon sommaire', hint: 'Le sommaire est déduit de ce que vous avez vraiment écrit : le nombre de chapitres suit votre volume de texte.' },
  { id: 3 as const, label: 'Mon livre', hint: 'Rédaction chapitre par chapitre, relecture, export Word ou PDF, couverture, KDP, traduction et audio.' },
];
type DeskId = 1 | 2 | 3;


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

  // Étape ouverte : on reprend là où l'auteur en était.
  const [desk, setDesk] = useState<DeskId>(() => {
    const b = readBookBrief() || {};
    if ((b.outline?.length ?? 0) > 0 && b.outlineValidated) return 3;
    if ((b.outline?.length ?? 0) > 0) return 2;
    return 1;
  });
  useEffect(() => { if (showWizard) setDesk(3); }, [showWizard]);

  // L'explication d'accueil reste ouverte tant que rien n'est écrit, puis s'efface.
  const [hasStory, setHasStory] = useState(() => Boolean((readBookBrief()?.sourceText || '').trim()));
  useEffect(() => {
    const sync = () => setHasStory(Boolean((readBookBrief()?.sourceText || '').trim()));
    sync();
    window.addEventListener(BOOK_BRIEF_EVENT, sync);
    return () => window.removeEventListener(BOOK_BRIEF_EVENT, sync);
  }, []);



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

        {/* Ma maison d'édition : on explique avant de faire */}
        {!openedBook && (
        <div className="mt-6">
          <div className="text-center">
            <span className="v3-chip v3-chip-orange">
              <Sparkles className="w-3.5 h-3.5" /> {biography ? 'Biographie — Le récit de votre vie' : 'Ma maison d’édition'}
            </span>
            <h1 className="v3-serif text-4xl md:text-5xl font-bold mt-4 leading-tight" style={{ color: 'var(--v3-ink)' }}>
              {biography ? 'Racontez votre vie, nous en faisons un livre' : 'Ici, vous racontez. Nous fabriquons le livre.'}
            </h1>
            <p className="mt-3 text-sm md:text-base" style={{ color: 'var(--v3-muted)' }}>
              Vous n’avez ni plan à préparer, ni mise en page à faire, ni peur de mal écrire.
              Vous écrivez comme vous parlez, et tout le reste se fabrique ici.
            </p>
          </div>

          {!hasStory && (
            <>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  {
                    n: '1', t: 'Vous racontez',
                    d: 'Vos mots, vos souvenirs, vos idées, dans l’ordre qui vous vient. Fautes et phrases longues : aucune importance. Aucun plan à faire à l’avance.',
                  },
                  {
                    n: '2', t: 'Le Génie corrige',
                    d: 'Il réécrit proprement, sans jamais résumer ni raccourcir : jamais moins de mots que vous. Vos mots d’origine restent visibles et récupérables.',
                  },
                  {
                    n: '3', t: 'Le livre se monte',
                    d: 'Le sommaire est déduit de VOTRE texte — pas l’inverse. Puis la rédaction, l’export Word ou PDF, la couverture, les données Amazon et l’audio.',
                  },
                ].map((c) => (
                  <div key={c.n} className="rounded-[22px] border p-4" style={{ borderColor: 'rgba(201,168,76,0.5)', background: '#fff' }}>
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold"
                      style={{ background: 'var(--v3-gold, #c9a84c)', color: '#1a1408' }}>{c.n}</span>
                    <h2 className="v3-serif mt-2 text-lg font-bold" style={{ color: 'var(--v3-ink)' }}>{c.t}</h2>
                    <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: 'var(--v3-muted)' }}>{c.d}</p>
                  </div>
                ))}
              </div>

              <p className="mt-4 rounded-[22px] border px-4 py-3 text-[12.5px] leading-relaxed"
                style={{ borderColor: 'rgba(15,107,74,0.35)', background: 'rgba(15,107,74,0.06)', color: 'var(--v3-ink)' }}>
                <strong>Vous pouvez arrêter à tout moment.</strong> Chaque texte envoyé est enregistré
                aussitôt, avec l’heure du dernier enregistrement affichée sous « Votre livre ». Vous
                fermez la page, vous revenez demain ou depuis un autre ordinateur, et vous reprenez
                exactement où vous en étiez. Vous n’avez rien à sauvegarder vous-même.
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Link to="/v3/create" className={`v3-btn text-xs ${biography ? 'v3-btn-outline' : 'v3-btn-primary'}`}>
                  <BookOpen className="w-3.5 h-3.5" /> Je raconte un livre
                </Link>
                <Link to="/v3/biographie" className={`v3-btn text-xs ${biography ? 'v3-btn-primary' : 'v3-btn-outline'}`}>
                  <Sparkles className="w-3.5 h-3.5" /> Je raconte ma vie
                </Link>
              </div>
            </>
          )}
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

        <div className="mt-5">
          <div className="min-w-0 v3-ambiance">
            {/* ① J'écris : je raconte, le Génie corrige */}
            {desk === 1 && !openedBook && (
              <>
                <V3GenieDialog
                  mode={biography ? 'biography' : 'book'}
                  initialIdea={idea || ''}
                  onReady={() => setDesk(2)}
                />
                <div className="mt-4">
                  <V3PassageCorrector
                    mode={biography ? 'biography' : 'book'}
                    onDone={() => setDesk(2)}
                  />
                </div>
              </>
            )}

            {/* ② Mon sommaire : déduit de ce qui a été écrit, 3 chapitres à la fois */}
            {desk === 2 && <V3OutlineCoBuilder />}

            {/* ③ Mon livre : rédaction, relecture, export, couverture, KDP, audio */}
            {desk === 3 && (
              <div className="space-y-4">
                {showWizard ? (
                  <div ref={wizardRef} className="v3-card">
                    <Suspense fallback={<div className="py-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--v3-orange)]" /></div>}>
                      <V3CreateWizard />
                    </Suspense>
                  </div>
                ) : (
                  <div className="v3-card">
                    <h2 className="v3-serif text-xl font-bold" style={{ color: 'var(--v3-ink)' }}>Votre livre</h2>
                    <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>
                      Validez votre sommaire, puis cliquez sur « Commencer la rédaction » : chaque chapitre
                      écrit se range tout seul à sa place, déjà corrigé. Ensuite, les boutons ci-dessous
                      vous donnent l’export Word ou PDF, la couverture, les données Amazon, la traduction
                      et l’audio.
                    </p>
                    <button type="button" onClick={launchWorkflow} className="v3-btn v3-btn-primary mt-4 text-xs">
                      <Sparkles className="w-3.5 h-3.5" /> Commencer la rédaction
                    </button>
                  </div>
                )}
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

            {/* Votre livre : replié sous l'étape en cours, jamais dans une colonne perdue */}
            <div id="sommaire-ia" className="mt-5">
              <V3GenieOutlinePanel key={briefKey} outlineMode={sommaireIa ? 'guided' : undefined} />
            </div>

            {/* Vos actions : toujours visibles, quelle que soit l'étape */}
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
        </div>




      </div>
    </section>
  );
}
