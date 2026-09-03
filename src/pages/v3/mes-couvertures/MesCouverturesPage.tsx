/**
 * Étape 2 — « Mes couvertures ».
 *
 * Page indépendante des anciens générateurs : elle ne lit et n'écrit que via
 * `src/lib/coverProjects.ts` (table `cover_projects` + bucket privé `covers`).
 * Aucun appel IA, aucun calcul de dimensions, aucun ISBN.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  BookOpen,
  Copy,
  ImageIcon,
  Layers,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  BookCopy,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  createCoverProject,
  deleteCoverProject,
  getSignedCoverUrl,
  listCoverProjects,
  updateCoverProject,
  type CoverProject,
  type CoverType,
} from '@/lib/coverProjects';

const TYPE_META: Record<CoverType, { label: string; formatId: string; icon: typeof BookOpen }> = {
  ebook: { label: 'eBook Kindle', formatId: 'ebook-kindle', icon: BookOpen },
  paperback: { label: 'Broché', formatId: 'broche-wrap', icon: Layers },
  hardcover: { label: 'Relié', formatId: 'hardcover', icon: BookCopy },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function MesCouverturesPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<CoverProject[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Création
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<CoverType>('ebook');
  const [newPages, setNewPages] = useState('');

  // Renommage
  const [renameTarget, setRenameTarget] = useState<CoverProject | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Suppression
  const [deleteTarget, setDeleteTarget] = useState<CoverProject | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await listCoverProjects();
      setProjects(rows);

      // Miniatures : URL signées temporaires uniquement, jamais d'URL publique.
      const entries = await Promise.all(
        rows.map(async (p) => {
          if (!p.thumbnail_path) return null;
          const url = await getSignedCoverUrl(p.thumbnail_path);
          return url ? ([p.id, url] as const) : null;
        }),
      );
      setThumbs(Object.fromEntries(entries.filter(Boolean) as [string, string][]));
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Impossible de charger vos couvertures pour le moment.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const resetCreateForm = () => {
    setNewName('');
    setNewTitle('');
    setNewType('ebook');
    setNewPages('');
  };

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) {
      toast.error('Le nom du projet est obligatoire.');
      return;
    }
    setCreating(true);
    try {
      const pages = newType === 'ebook' ? null : newPages ? Number(newPages) : null;
      const created = await createCoverProject({
        project_name: name,
        book_title: newTitle.trim() || null,
        cover_type: newType,
        format_id: TYPE_META[newType].formatId,
        page_count: Number.isFinite(pages as number) ? (pages as number) : null,
      });
      toast.success('Couverture créée.');
      setCreateOpen(false);
      resetCreateForm();
      setProjects((prev) => [created, ...prev]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Création impossible.');
    } finally {
      setCreating(false);
    }
  };

  const handleRename = async () => {
    if (!renameTarget) return;
    const name = renameValue.trim();
    if (!name) {
      toast.error('Le nom du projet est obligatoire.');
      return;
    }
    setBusyId(renameTarget.id);
    try {
      const updated = await updateCoverProject(renameTarget.id, { project_name: name });
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      toast.success('Projet renommé.');
      setRenameTarget(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Renommage impossible.');
    } finally {
      setBusyId(null);
    }
  };

  /**
   * Duplication : métadonnées uniquement. `fabric_json`, `illustration_path` et
   * `thumbnail_path` restent vides — aucune URL signée n'est jamais recopiée.
   */
  const handleDuplicate = async (project: CoverProject) => {
    setBusyId(project.id);
    try {
      const copy = await createCoverProject({
        project_name: `${project.project_name} (copie)`,
        book_title: project.book_title,
        cover_type: project.cover_type,
        format_id: project.format_id,
        page_count: project.page_count,
        fabric_json: null,
        illustration_path: null,
        thumbnail_path: null,
      });
      setProjects((prev) => [copy, ...prev]);
      toast.success('Copie créée (métadonnées uniquement).');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Duplication impossible.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    try {
      await deleteCoverProject(deleteTarget.id);
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success('Couverture supprimée.');
      setDeleteTarget(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Suppression impossible.');
    } finally {
      setBusyId(null);
    }
  };

  const showPageCount = useMemo(() => newType !== 'ebook', [newType]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <Badge variant="secondary" className="uppercase tracking-wide">
            Couvertures
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Mes couvertures</h1>
          <p className="text-muted-foreground">
            Vos projets de couverture privés : Kindle, broché et relié. Vous seul y avez accès.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Créer une couverture
        </Button>
      </header>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!loading && error && (
        <Card className="border-destructive/40">
          <CardContent className="space-y-3 p-6 text-center">
            <p className="text-foreground">{error}</p>
            <Button variant="outline" onClick={() => void load()}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && projects.length === 0 && (
        <Card>
          <CardContent className="space-y-3 p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Aucun projet pour l'instant</h2>
            <p className="text-muted-foreground">
              Créez votre première couverture : vous pourrez la retrouver et la modifier ici.
            </p>
            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Créer une couverture
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const meta = TYPE_META[project.cover_type] ?? TYPE_META.ebook;
            const Icon = meta.icon;
            const thumb = thumbs[project.id];
            return (
              <Card key={project.id} className="flex flex-col overflow-hidden">
                <div className="aspect-[3/4] w-full bg-muted">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={`Miniature de ${project.project_name}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Icon className="h-8 w-8" />
                      <span className="text-xs">Pas encore d'illustration</span>
                    </div>
                  )}
                </div>
                <CardHeader className="space-y-1 pb-2">
                  <CardTitle className="text-base leading-tight">{project.project_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {project.book_title || 'Titre du livre non renseigné'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Badge variant="outline">{meta.label}</Badge>
                    <Badge variant="secondary">Brouillon</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 text-xs text-muted-foreground">
                  Modifié le {formatDate(project.updated_at)}
                </CardContent>
                <CardFooter className="mt-auto flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => navigate(`/v3/mes-couvertures/${project.id}`)}
                  >
                    Ouvrir
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    onClick={() => {
                      setRenameTarget(project);
                      setRenameValue(project.project_name);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" /> Renommer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    disabled={busyId === project.id}
                    onClick={() => void handleDuplicate(project)}
                  >
                    {busyId === project.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    Dupliquer
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1 text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(project)}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Supprimer
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Création */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une couverture</DialogTitle>
            <DialogDescription>
              Ces informations pourront être modifiées plus tard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cover-name">Nom du projet *</Label>
              <Input
                id="cover-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex. Couverture — Les Sentiers du Nord"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cover-title">Titre du livre</Label>
              <Input
                id="cover-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Titre tel qu'il apparaîtra sur la couverture"
              />
            </div>
            <div className="space-y-2">
              <Label>Type de couverture</Label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(TYPE_META) as CoverType[]).map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={newType === type ? 'default' : 'outline'}
                    onClick={() => setNewType(type)}
                    className="h-auto py-2 text-xs"
                  >
                    {TYPE_META[type].label}
                  </Button>
                ))}
              </div>
            </div>
            {showPageCount && (
              <div className="space-y-2">
                <Label htmlFor="cover-pages">Nombre de pages (facultatif)</Label>
                <Input
                  id="cover-pages"
                  type="number"
                  min={1}
                  value={newPages}
                  onChange={(e) => setNewPages(e.target.value)}
                  placeholder="Ex. 220"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => void handleCreate()} disabled={creating}>
              {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Renommage */}
      <Dialog open={!!renameTarget} onOpenChange={(open) => !open && setRenameTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renommer le projet</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rename-input">Nom du projet *</Label>
            <Input
              id="rename-input"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameTarget(null)}>
              Annuler
            </Button>
            <Button onClick={() => void handleRename()} disabled={busyId === renameTarget?.id}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suppression */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer cette couverture ?</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `« ${deleteTarget.project_name} » sera définitivement supprimé, ainsi que ses fichiers privés. Cette action est irréversible.`
                : ''}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => void handleDelete()}
              disabled={busyId === deleteTarget?.id}
            >
              {busyId === deleteTarget?.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
