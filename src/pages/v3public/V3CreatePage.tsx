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

  const [showWizard, setShowWizard] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const wizardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { seedHubConfig(idea, genre, type); }, [idea, genre, type]);

  const openFloating = () => window.dispatchEvent(new CustomEvent('open-api-keys'));

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
          <V3BriefRecap variant="full" onLaunch={launchWorkflow} />
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
