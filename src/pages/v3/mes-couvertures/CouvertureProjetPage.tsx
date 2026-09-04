/**
 * Espace d'édition d'un projet de couverture.
 * Réorganisation d'interface uniquement : l'éditeur est visible immédiatement,
 * les informations enregistrées passent au-dessous. Aucun appel IA ici.
 */
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ImageIcon, Loader2 } from 'lucide-react';

import CoverFrontEditor from '@/components/cover-editor/CoverFrontEditor';
import CoverWrapEditor from '@/components/cover-editor/CoverWrapEditor';
import KdpPaperbackConfigPanel from '@/components/cover-editor/KdpPaperbackConfigPanel';
import IllustrationGeneratorPanel from '@/components/cover-editor/IllustrationGeneratorPanel';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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

type StepKey = 'illustration' | 'textes' | 'dos' | 'export';

const STEPS: { key: StepKey; label: string }[] = [
  { key: 'illustration', label: '1. Illustration' },
  { key: 'textes', label: '2. Textes' },
  { key: 'dos', label: '3. Dos et quatrième' },
  { key: 'export', label: '4. Export' },
];

/** Fait défiler vers le premier sélecteur trouvé et le met brièvement en évidence. */
const focusSection = (selectors: string[]) => {
  for (const sel of selectors) {
    const el = document.querySelector<HTMLElement>(sel);
    if (!el) continue;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('ring-2', 'ring-[#f47920]', 'ring-offset-2', 'rounded-lg');
    window.setTimeout(
      () => el.classList.remove('ring-2', 'ring-[#f47920]', 'ring-offset-2', 'rounded-lg'),
      1800,
    );
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) el.focus();
    return true;
  }
  return false;
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
    <main className="mx-auto w-full max-w-7xl px-4 py-4 space-y-4">
      {/* barre d'action toujours visible, sans défilement */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/v3/mes-couvertures')}>
          <ArrowLeft className="h-4 w-4" /> Retour à mes couvertures
        </Button>
        {project && (
          <IllustrationGeneratorPanel
            projectId={project.id}
            size="sm"
            className="gap-2"
            hasIllustration={Boolean(project.illustration_path)}
            onGenerated={async () => {
              const fresh = await getCoverProject(project.id);
              if (fresh) {
                setProject(fresh);
                if (fresh.thumbnail_path) {
                  setThumb(await getSignedCoverUrl(fresh.thumbnail_path));
                }
              }
            }}
          />
        )}
        {project && (
          <>
            <span className="ml-1 truncate text-sm font-semibold text-foreground">
              {project.project_name}
            </span>
            <Badge variant="outline">{TYPE_LABEL[project.cover_type] ?? project.cover_type}</Badge>
          </>
        )}
      </div>

      {/* parcours cliquable */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        {STEPS.map((step) => {
          const isDos = step.key === 'dos';
          const dosDisponible = project?.cover_type !== 'ebook';
          const disabled = !project || (isDos && !dosDisponible);
          return (
            <button
              key={step.key}
              type="button"
              disabled={disabled}
              onClick={() => goToStep(step.key)}
              className={
                disabled
                  ? 'cursor-not-allowed rounded-full border border-dashed border-border px-2.5 py-1 text-muted-foreground'
                  : 'rounded-full bg-muted px-2.5 py-1 font-medium text-foreground transition hover:bg-[#f47920] hover:text-white'
              }
              title={
                isDos && !dosDisponible
                  ? 'Réservé aux couvertures brochées ou reliées'
                  : `Aller à l’étape ${step.label}`
              }
            >
              {step.label}
              {isDos && !dosDisponible && ' · broché uniquement'}
            </button>
          );
        })}
      </div>


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
          {/* éditeur immédiatement visible */}
          {project.cover_type === 'paperback' ? (
            <>
              <CoverWrapEditor project={project} onProjectUpdated={setProject} />
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ChevronDown className="h-4 w-4" /> Réglages KDP (pages, papier, dos)
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <KdpPaperbackConfigPanel project={project} onProjectUpdated={setProject} />
                </CollapsibleContent>
              </Collapsible>
            </>
          ) : (
            <CoverFrontEditor project={project} onProjectUpdated={setProject} />
          )}

          {/* informations, repliées par défaut */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronDown className="h-4 w-4" /> Informations du projet
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="grid gap-4 md:grid-cols-[180px,1fr]">
                <div className="overflow-hidden rounded-xl border border-border bg-muted" style={{ maxWidth: 180, height: 270 }}>
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={`Miniature de ${project.project_name}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                      <ImageIcon className="h-7 w-7" />
                      <span className="text-xs">Pas encore d'illustration</span>
                    </div>
                  )}
                </div>
                <Card>
                  <CardContent className="space-y-3 p-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Titre du livre</span>
                      <span className="text-foreground">
                        {project.book_title || 'Non renseigné'}
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
            </CollapsibleContent>
          </Collapsible>
        </>
      )}
    </main>
  );
}
