import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Sparkles, Loader2, ImageIcon, ArrowRight } from 'lucide-react';
import { BackButton } from '@/components/v3/BackButton';
import V3BriefRecap from '@/components/v3public/V3BriefRecap';
import V3ApiKeysGate from '@/components/v3public/V3ApiKeysGate';

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

export default function V3CreatePage() {
  const [params] = useSearchParams();
  const importMode = params.get('import') === '1';
  const idea = params.get('idea');
  const genre = params.get('genre');
  const type = params.get('type');
  const sommaireIa = params.get('sommaire') === 'ia';

  const [showWizard, setShowWizard] = useState(false);
  const wizardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { seedHubConfig(idea, genre, type); }, [idea, genre, type]);

  // Arrivée depuis « Sommaire IA » : on descend directement sur le panneau.
  useEffect(() => {
    if (!sommaireIa) return;
    const t = setTimeout(() => {
      document.getElementById('sommaire-ia')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
    return () => clearTimeout(t);
  }, [sommaireIa]);



  const launchWorkflow = () => {
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
      <div className="max-w-4xl mx-auto">
        <BackButton />

        <div className="mt-6 text-center">
          <span className="v3-chip v3-chip-orange"><Sparkles className="w-3.5 h-3.5" /> Écrire un livre</span>
          <h1 className="v3-serif text-4xl font-bold mt-4" style={{ color: 'var(--v3-ink)' }}>Ton atelier d'écriture</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--v3-muted)' }}>
            Fiche du livre, Cible &amp; Promesse générées par l'IA, sommaire validé — puis le workflow des agents.
          </p>
        </div>

        {/* Sommaire IA — mise en avant */}
        <div className="mt-6 rounded-[22px] border p-5"
          style={{ borderColor: 'var(--v3-gold, #c9a84c)', background: 'linear-gradient(180deg, rgba(201,168,76,0.10), rgba(201,168,76,0.03))' }}>
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{ background: 'var(--v3-gold, #c9a84c)', color: '#1a1408' }}>
            <Sparkles className="h-3 w-3" /> Dernière nouveauté IA
          </span>
          <h2 className="v3-serif mt-3 text-2xl font-bold" style={{ color: 'var(--v3-ink)' }}>
            Sommaire IA — on le construit ensemble
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--v3-muted)' }}>
            Vous dialoguez avec l’IA : elle propose les chapitres, vous corrigez selon vos infos. Dès que le sommaire vous
            convient, l’IA rédige le livre via le workflow, jusqu’à l’export et la couverture.
          </p>
          <button
            type="button"
            onClick={() => document.getElementById('sommaire-ia')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="v3-btn v3-btn-primary mt-4"
          >
            <Sparkles className="h-4 w-4" /> Construire mon sommaire avec l’IA <ArrowRight className="h-4 w-4" />
          </button>
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

        {/* Clés API — encart partagé (alerte si aucune clé) */}
        <div className="mt-6">
          <V3ApiKeysGate context="Sans clé Gemini, le workflow d’écriture ne peut pas démarrer." />
        </div>


        {/* Fiche du livre + Cible & Promesse IA + Sommaire validé */}
        <div className="mt-6">
          <V3BriefRecap variant="full" onLaunch={launchWorkflow} outlineMode={sommaireIa ? 'guided' : undefined} />
        </div>

        {/* Workflow */}
        {showWizard && (
          <div ref={wizardRef} className="v3-card mt-8">
            <Suspense fallback={<div className="py-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--v3-orange)]" /></div>}>
              <V3CreateWizard />
            </Suspense>
          </div>
        )}
      </div>
    </section>
  );
}
