import { lazy, Suspense, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Loader2 } from 'lucide-react';
import ApiProviderQuickSettings from '@/components/ebook/ApiProviderQuickSettings';

const V3CreateWizard = lazy(() => import('@/components/v3public/V3CreateWizard'));

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
  const idea = params.get('idea');
  const genre = params.get('genre');
  const type = params.get('type');

  useEffect(() => { seedHubConfig(idea, genre, type); }, [idea, genre, type]);

  const openFloating = () => window.dispatchEvent(new CustomEvent('open-api-keys'));

  return (
    <section className="v3-halo-soft min-h-[calc(100vh-4rem)] py-14 px-5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="v3-chip v3-chip-orange"><Sparkles className="w-3.5 h-3.5" /> Écrire un livre</span>
          <h1 className="v3-serif text-4xl font-bold mt-4">Ton atelier d'écriture</h1>
          <p className="text-sm text-[var(--v3-muted)] mt-2 max-w-lg mx-auto">
            Choisis ton fournisseur d'IA (Gemini, Claude, OpenAI ou OpenRouter), colle ta clé et valide-la avant de lancer les 15 agents.
          </p>
        </div>

        {/* Panneau clés API & modèles — TOUJOURS visible ici, admin ou non */}
        <div className="v3-card mb-6">
          <ApiProviderQuickSettings onOpenAdvanced={openFloating} />
        </div>

        <div className="v3-card">
          <Suspense fallback={<div className="py-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--v3-orange)]" /></div>}>
            <V3CreateWizard />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
