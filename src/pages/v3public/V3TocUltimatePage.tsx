import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import TocUltimateGenerator, { type UltimateTocChapter } from '@/components/tools/TocUltimateGenerator';
import { sendTocToWorkflow } from '@/lib/v3/bookBrief';

export default function V3TocUltimatePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: 'var(--v3-paper, #fafafa)' }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/v3" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600">
            <ArrowLeft className="h-4 w-4" /> Retour au site
          </Link>
          <Link to="/v3/create" className="text-sm font-semibold text-orange-600 hover:underline">Créer un livre →</Link>
        </div>

        <header className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-700">
            <Sparkles className="h-3 w-3" /> Outil V3
          </span>
          <h1 className="v3-serif mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
            Générateur Ultime de<br/>Table des Matières
          </h1>
          <p className="mt-3 max-w-2xl text-base text-gray-600">
            Bâtissez un sommaire professionnel en quelques secondes. Genre, public, style, créativité — tout est modulable,
            puis éditable ligne par ligne, exportable, et surtout <strong>injectable directement dans le workflow</strong> de rédaction.
          </p>
        </header>

        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <TocUltimateGenerator
            applyLabel="Envoyer vers le workflow"
            onApply={(chapters: UltimateTocChapter[], meta) => {
              const ok = sendTocToWorkflow(chapters, { theme: meta.theme, genre: meta.genre, description: meta.description });
              if (!ok) {
                toast.error('Impossible d’enregistrer le sommaire sur cet appareil.');
                return;
              }
              toast.success(`Sommaire de ${chapters.length} chapitres envoyé au workflow ✓`);
              navigate('/v3/create?toc=ultime');
            }}
          />
        </div>
      </div>
    </div>
  );
}
