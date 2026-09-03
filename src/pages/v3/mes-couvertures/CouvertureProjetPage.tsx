/**
 * Étape 2 — fiche d'un projet de couverture (lecture seule).
 * L'éditeur graphique n'est pas branché à ce stade.
 */
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ImageIcon, Loader2, Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getCoverProject,
  getSignedCoverUrl,
  type CoverProject,
  type CoverType,
} from '@/lib/coverProjects';

const TYPE_LABEL: Record<CoverType, string> = {
  ebook: 'eBook Kindle',
  paperback: 'Broché',
  hardcover: 'Relié',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function CouvertureProjetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<CoverProject | null>(null);
  const [thumb, setThumb] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const row = await getCoverProject(id);
        if (!active) return;
        if (!row) {
          setError('Ce projet est introuvable ou ne vous appartient pas.');
          return;
        }
        setProject(row);
        if (row.thumbnail_path) {
          const url = await getSignedCoverUrl(row.thumbnail_path);
          if (active) setThumb(url);
        }
      } catch (e) {
        if (active) {
          setError(e instanceof Error ? e.message : 'Chargement impossible.');
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => navigate('/v3/mes-couvertures')}>
        <ArrowLeft className="h-4 w-4" /> Mes couvertures
      </Button>

      {loading && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && error && (
        <Card className="border-destructive/40">
          <CardContent className="space-y-3 p-8 text-center">
            <p className="text-foreground">{error}</p>
            <Button asChild variant="outline">
              <Link to="/v3/mes-couvertures">Retour à mes couvertures</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && project && (
        <>
          <header className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{TYPE_LABEL[project.cover_type] ?? project.cover_type}</Badge>
              <Badge variant="secondary">Brouillon</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {project.project_name}
            </h1>
            <p className="text-muted-foreground">
              {project.book_title || 'Titre du livre non renseigné'}
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-[240px,1fr]">
            <div className="aspect-[3/4] w-full overflow-hidden rounded-xl border border-border bg-muted">
              {thumb ? (
                <img
                  src={thumb}
                  alt={`Miniature de ${project.project_name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-xs">Pas encore d'illustration</span>
                </div>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations enregistrées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Type</span>
                  <span className="text-foreground">
                    {TYPE_LABEL[project.cover_type] ?? project.cover_type}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Format</span>
                  <span className="text-foreground">{project.format_id}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Nombre de pages</span>
                  <span className="text-foreground">
                    {project.cover_type === 'ebook'
                      ? 'Sans objet'
                      : project.page_count ?? 'Non renseigné'}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Créé le</span>
                  <span className="text-foreground">{formatDate(project.created_at)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Dernière modification</span>
                  <span className="text-foreground">{formatDate(project.updated_at)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Wand2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-foreground">
                L'éditeur professionnel sera disponible à l'étape suivante.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </main>
  );
}
