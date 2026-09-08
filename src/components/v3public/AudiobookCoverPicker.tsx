import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageIcon, Loader2, Download, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  listCoverProjects,
  getSignedCoverUrl,
  type CoverProject,
} from '@/lib/coverProjects';

type Props = {
  onSelected?: (info: { projectId: string; title: string | null; url: string | null }) => void;
};

/**
 * Sélection d'une couverture déjà enregistrée (bucket privé `covers`).
 * Aucune URL publique : uniquement des URL signées temporaires.
 */
export default function AudiobookCoverPicker({ onSelected }: Props) {
  const [projects, setProjects] = useState<CoverProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await listCoverProjects();
        if (!alive) return;
        setProjects(list.filter((p) => p.illustration_path || p.thumbnail_path));
      } catch {
        if (alive) setError('Connectez-vous pour retrouver vos couvertures enregistrées.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const select = async (id: string) => {
    setSelectedId(id);
    const project = projects.find((p) => p.id === id) || null;
    const path = project?.illustration_path || project?.thumbnail_path || null;
    const url = path ? await getSignedCoverUrl(path) : null;
    setPreviewUrl(url);
    onSelected?.({ projectId: id, title: project?.book_title || project?.project_name || null, url });
  };

  return (
    <Card className="p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <ImageIcon className="h-4 w-4 text-[#008296]" />
        <h2 className="font-semibold text-[#232F3E]">Couverture du livre audio</h2>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Chargement de vos couvertures…
        </div>
      ) : error ? (
        <p className="text-sm text-slate-600">{error}</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-slate-600">
          Aucune couverture enregistrée pour l'instant.{' '}
          <Link to="/v3/mes-couvertures" className="text-[#008296] underline">
            Créer ou enregistrer une couverture
          </Link>
        </p>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex-1">
            <label className="text-sm text-slate-600" htmlFor="audiobook-cover-select">
              Choisissez la couverture à associer
            </label>
            <select
              id="audiobook-cover-select"
              value={selectedId}
              onChange={(e) => select(e.target.value)}
              className="w-full mt-1 border rounded-md p-2 bg-white"
            >
              <option value="">— Aucune —</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.book_title || p.project_name}
                </option>
              ))}
            </select>

            <div className="mt-3 flex flex-wrap gap-2">
              {previewUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={previewUrl} download="couverture-livre-audio.jpg">
                    <Download className="h-4 w-4 mr-2" /> Télécharger l'image
                  </a>
                </Button>
              )}
              {selectedId && (
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/v3/mes-couvertures/${selectedId}`}>
                    <ExternalLink className="h-4 w-4 mr-2" /> Ouvrir dans l'éditeur
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="w-[150px] h-[225px] shrink-0 rounded-md border bg-slate-50 overflow-hidden flex items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Couverture sélectionnée pour le livre audio"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-slate-400 px-2 text-center">Aucune image sélectionnée</span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
