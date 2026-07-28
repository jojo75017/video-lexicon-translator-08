import { lazy, Suspense, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Sparkles, Loader2, ImageIcon, ArrowRight } from 'lucide-react';
import ApiProviderQuickSettings from '@/components/ebook/ApiProviderQuickSettings';

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

  useEffect(() => { seedHubConfig(idea, genre, type); }, [idea, genre, type]);

  const openFloating = () => window.dispatchEvent(new CustomEvent('open-api-keys'));

  if (importMode) {
    return (
      <section className="min-h-[calc(100vh-4rem)] py-14 px-5 bg-[var(--v3-paper,#fbfaf6)]">
        <Suspense fallback={<div className="py-24 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[var(--v3-emerald,#064e3b)]" /></div>}>
          <V3ImportStudio />
        </Suspense>
      </section>
    );
  }

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

        {/* Carte "Livre illustré maternelle" — Studio & Éditeur */}
        <Link
          to="/v3/create/illustre"
          className="block mb-6 v3-card border-2 border-[#C97A14]/40 bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#C97A14] text-white flex items-center justify-center flex-shrink-0">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-[#C97A14]">Nouveau · Livre illustré maternelle</h3>
                <span className="text-[10px] uppercase tracking-wide bg-[#C97A14] text-white px-1.5 py-0.5 rounded">Studio & Éditeur</span>
              </div>
              <p className="text-xs text-[var(--v3-muted)]">
                Album carré 21×21 cm avec illustrations IA cohérentes (même personnage sur toutes les pages). Type "28 histoires pour la maternelle".
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#C97A14]" />
          </div>
        </Link>

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
