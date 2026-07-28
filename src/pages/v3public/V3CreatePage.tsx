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
      {/* Bouton fixe d'accès rapide au mode illustré maternelle */}
      <div className="sticky top-20 z-50 max-w-4xl mx-auto mb-6">
        <Link
          to="/v3/create/illustre"
          className="flex items-center justify-center gap-2 w-full md:w-auto md:ml-auto rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-3 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all border-2 border-white"
        >
          <ImageIcon className="w-5 h-5" />
          <span>Livre illustré maternelle</span>
          <span className="text-[10px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">Nouveau</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="v3-chip v3-chip-orange"><Sparkles className="w-3.5 h-3.5" /> Choisis ton type de livre</span>
          <h1 className="v3-serif text-4xl font-bold mt-4">Ton atelier d'écriture</h1>
        </div>

        {/* Sélecteur de mode — 2 gros choix visibles */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="v3-card border-2 border-[var(--v3-emerald,#064e3b)]/40 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--v3-emerald,#064e3b)] text-white flex items-center justify-center"><Sparkles className="w-5 h-5" /></div>
              <h3 className="font-bold">Roman / non-fiction (texte)</h3>
            </div>
            <p className="text-xs text-[var(--v3-muted)] mb-3">Livre classique généré par les 15 agents. Chapitres longs, sans illustrations.</p>
            <p className="text-[11px] text-[var(--v3-emerald,#064e3b)] font-semibold">↓ Utilise le wizard ci-dessous</p>
          </div>

          <Link
            to="/v3/create/illustre"
            className="v3-card border-2 border-[#C97A14] bg-gradient-to-br from-amber-50 to-orange-100 hover:shadow-lg transition-all block relative"
          >
            <span className="absolute -top-2 -right-2 text-[10px] uppercase tracking-wide bg-[#C97A14] text-white px-2 py-0.5 rounded-full font-bold">Nouveau</span>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#C97A14] text-white flex items-center justify-center"><ImageIcon className="w-5 h-5" /></div>
              <h3 className="font-bold text-[#C97A14]">Livre illustré maternelle</h3>
            </div>
            <p className="text-xs text-[var(--v3-muted)] mb-3">Album carré 21×21 cm, 3-6 ans, illustrations IA cohérentes (même personnage à chaque page). Style "28 histoires pour la maternelle".</p>
            <p className="text-[11px] text-[#C97A14] font-semibold flex items-center gap-1">Ouvrir ce mode <ArrowRight className="w-3.5 h-3.5" /></p>
            <p className="text-[10px] text-[var(--v3-muted)] mt-1">Réservé Studio & Éditeur</p>
          </Link>
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
