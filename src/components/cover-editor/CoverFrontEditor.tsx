/**
 * Étape 4A — éditeur de PREMIÈRE de couverture (socle sécurisé).
 *
 * Éditeur neuf et isolé (aucun ancien module de couverture, aucun code Fabric).
 * - fond = illustration privée chargée via URL signée temporaire ;
 * - 3 textes : titre, sous-titre, auteur ;
 * - annuler/rétablir, centrage, repères, remise à zéro ;
 * - enregistrement automatique temporisé dans `cover_projects.fabric_json` ;
 * - miniature privée régénérée après chaque enregistrement réussi ;
 * - aucun appel IA, aucun crédit consommé.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  Download,
  Italic,
  Loader2,
  Plus,
  Redo2,
  RotateCcw,
  Save,
  
  Trash2,
  TriangleAlert,
  Undo2,
} from 'lucide-react';

import IllustrationGeneratorPanel from '@/components/cover-editor/IllustrationGeneratorPanel';
import CoverProAccessBar from '@/components/cover-editor/CoverProAccessBar';


import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { cn } from '@/lib/utils';
import {
  getSignedCoverUrl,
  updateCoverProject,
  uploadCoverFile,
  removeCoverFile,
  type CoverProject,
} from '@/lib/coverProjects';
import {
  DEFAULT_FRONT_BACKGROUND,
  FRONT_FONTS,
  ROLE_LABEL,
  createComposition,
  defaultLayer,
  getFrontCanvasSize,
  parseComposition,
  renderCompositionThumbnail,
  serializeComposition,
  type FrontComposition,
  type FrontTextLayer,
  type TextAlign,
  type TextRole,
} from '@/lib/cover-editor/frontComposition';
import {
  downloadBlob,
  renderKindleCoverJpeg,
} from '@/lib/cover-editor/kindleExport';
import {
  exportFrontMockup,
  exportFrontPdf,
  exportFrontPng,
} from '@/lib/cover-editor/coverExports';

import {
  COVER_TEMPLATES,
  GENRE_LABEL,
  applyTemplate,
  type CoverGenre,
  type CoverTemplateId,
} from '@/lib/cover-editor/coverTemplates';
import {
  COVER_FONTS,
  FONT_CATEGORY_LABEL,
  ensureFontsReady,
  loadAllCoverFonts,
  type FontCategory,
} from '@/lib/cover-editor/coverFonts';
import { Switch } from '@/components/ui/switch';

/** Genres réellement présents dans la bibliothèque de modèles. */
const AVAILABLE_GENRES = Array.from(
  new Set(COVER_TEMPLATES.map((t) => t.genre)),
) as CoverGenre[];


type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

/** Convertit une couleur hexadécimale + opacité en rgba() pour l'aperçu. */
function hexWithAlpha(hex: string, opacity: number): string {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const n = Number.parseInt(full.slice(0, 6) || '000000', 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, opacity))})`;
}

const AUTOSAVE_DELAY_MS = 1500;

const ROLES: TextRole[] = ['title', 'subtitle', 'author'];


interface Props {
  project: CoverProject;
  onProjectUpdated?: (project: CoverProject) => void;
}

export default function CoverFrontEditor({ project, onProjectUpdated }: Props) {
  const size = useMemo(() => getFrontCanvasSize(project.format_id), [project.format_id]);

  const [composition, setComposition] = useState<FrontComposition>(() =>
    project.fabric_json
      ? parseComposition(project.fabric_json, {
          formatId: project.format_id,
          illustrationPath: project.illustration_path,
          bookTitle: project.book_title,
        })
      : createComposition({
          formatId: project.format_id,
          illustrationPath: project.illustration_path,
          bookTitle: project.book_title,
        }),
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [guides, setGuides] = useState(false);

  /* ---- exports (100 % local, sans IA ni crédit) -------------------------- */
  const [exportState, setExportState] = useState<'idle' | 'working' | 'done'>('idle');
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportLabel, setExportLabel] = useState<string | null>(null);

  /** Les polices du modèle sont chargées dès l'ouverture de l'éditeur. */
  useEffect(() => {
    loadAllCoverFonts();
  }, []);

  /** Réservé au format eBook Kindle avec une composition texte réellement remplie. */
  const canExportKindle =
    project.cover_type === 'ebook' &&
    composition.canvas.width > 0 &&
    composition.layers.some((l) => l.text.trim().length > 0);

  const hasText = composition.layers.some((l) => l.text.trim().length > 0);

  const runExport = async (
    label: string,
    task: () => Promise<{ blob: Blob; fileName: string }>,
  ) => {
    if (exportState === 'working') return; // anti double-clic
    setExportState('working');
    setExportLabel(label);
    setExportError(null);
    try {
      await ensureFontsReady(composition.layers.map((l) => l.fontFamily));
      const result = await task();
      downloadBlob(result.blob, result.fileName);
      setExportState('done');
      window.setTimeout(() => setExportState('idle'), 6000);
    } catch (e) {
      setExportState('idle');
      setExportError(e instanceof Error ? e.message : 'rendu impossible');
    }
  };

  const exportKindle = () =>
    runExport('Kindle', () => renderKindleCoverJpeg(composition, bgUrl, project.book_title));

  const exportPng = () =>
    runExport('PNG', () => exportFrontPng(composition, bgUrl, project.book_title));

  const exportPdf = () =>
    runExport('PDF', () =>
      exportFrontPdf(composition, bgUrl, { bookTitle: project.book_title }),
    );

  const exportMockup = () =>
    runExport('Mockup', () => exportFrontMockup(composition, bgUrl, project.book_title));


  const [past, setPast] = useState<FrontComposition[]>([]);
  const [future, setFuture] = useState<FrontComposition[]>([]);

  const thumbPathRef = useRef<string | null>(project.thumbnail_path);
  const timerRef = useRef<number | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.2);

  const selected = composition.layers.find((l) => l.id === selectedId) ?? null;

  // Le panneau de propriétés ne doit jamais être vide à l'ouverture.
  useEffect(() => {
    if (selectedId) return;
    const first =
      composition.layers.find((l) => l.role === 'title') ?? composition.layers[0] ?? null;
    if (first) setSelectedId(first.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [composition.layers.length]);

  /* ---------------- fond privé : URL signée recréée à chaque ouverture ------- */
  useEffect(() => {
    let active = true;
    const path = composition.illustrationPath ?? project.illustration_path;
    if (!path) {
      setBgUrl(null);
      return;
    }
    void getSignedCoverUrl(path).then((url) => {
      if (active) setBgUrl(url);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [composition.illustrationPath, project.illustration_path]);

  /* ---------------- réduction visuelle adaptée à l'écran -------------------- */
  useLayoutEffect(() => {
    const compute = () => {
      const el = wrapRef.current;
      if (!el) return;
      const available = el.clientWidth;
      const maxHeight = Math.max(360, window.innerHeight - 260);
      setScale(Math.min(available / size.width, maxHeight / size.height));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [size.width, size.height]);

  /* ---------------- mutations + historique ---------------------------------- */
  const commit = useCallback(
    (updater: (prev: FrontComposition) => FrontComposition, snapshot = true) => {
      setComposition((prev) => {
        const next = updater(prev);
        if (next === prev) return prev;
        if (snapshot) {
          setPast((p) => [...p.slice(-49), prev]);
          setFuture([]);
        }
        setStatus('dirty');
        return next;
      });
    },
    [],
  );

  const patchLayer = useCallback(
    (id: string, patch: Partial<FrontTextLayer>, snapshot = true) => {
      commit(
        (prev) => ({
          ...prev,
          layers: prev.layers.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        }),
        snapshot,
      );
    },
    [commit],
  );

  const undo = () => {
    setPast((p) => {
      if (!p.length) return p;
      const previous = p[p.length - 1];
      setFuture((f) => [composition, ...f]);
      setComposition(previous);
      setStatus('dirty');
      return p.slice(0, -1);
    });
  };

  const redo = () => {
    setFuture((f) => {
      if (!f.length) return f;
      const next = f[0];
      setPast((p) => [...p, composition]);
      setComposition(next);
      setStatus('dirty');
      return f.slice(1);
    });
  };

  /* ---------------- enregistrement automatique temporisé -------------------- */
  const save = useCallback(async () => {
    setStatus('saving');
    setSaveError(null);
    try {
      const illustrationPath = composition.illustrationPath ?? project.illustration_path ?? null;
      const payload = serializeComposition(composition, illustrationPath);

      const updated = await updateCoverProject(project.id, {
        fabric_json: payload as unknown as Record<string, unknown>,
      });

      // Miniature privée régénérée après une sauvegarde réussie.
      let finalProject = updated;
      try {
        const blob = await renderCompositionThumbnail(composition, bgUrl);
        const path = await uploadCoverFile({ projectId: project.id, kind: 'thumbnail', blob });
        const withThumb = await updateCoverProject(project.id, { thumbnail_path: path });
        const oldPath = thumbPathRef.current;
        thumbPathRef.current = path;
        if (oldPath && oldPath !== path) await removeCoverFile(oldPath);
        finalProject = withThumb;
      } catch {
        /* la composition est enregistrée même si la miniature échoue */
      }

      onProjectUpdated?.(finalProject);
      setStatus('saved');
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Enregistrement impossible.');
      setStatus('error');
    }
  }, [bgUrl, composition, onProjectUpdated, project.id, project.illustration_path]);

  useEffect(() => {
    if (status !== 'dirty') return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      void save();
    }, AUTOSAVE_DELAY_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, composition]);

  /* ---------------- déplacement / redimensionnement -------------------------- */
  const startDrag = (event: React.PointerEvent, layer: FrontTextLayer) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedId(layer.id);
    setGuides(true);
    setPast((p) => [...p.slice(-49), composition]);
    setFuture([]);
    const startX = event.clientX;
    const startY = event.clientY;
    const originX = layer.x;
    const originY = layer.y;

    const move = (e: PointerEvent) => {
      const dx = (e.clientX - startX) / scale;
      const dy = (e.clientY - startY) / scale;
      patchLayer(
        layer.id,
        {
          x: Math.round(Math.max(-layer.width / 2, Math.min(size.width - 40, originX + dx))),
          y: Math.round(Math.max(0, Math.min(size.height - 40, originY + dy))),
        },
        false,
      );
    };
    const up = () => {
      setGuides(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const startResize = (event: React.PointerEvent, layer: FrontTextLayer) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedId(layer.id);
    setPast((p) => [...p.slice(-49), composition]);
    setFuture([]);
    const startX = event.clientX;
    const originWidth = layer.width;
    const originFont = layer.fontSize;

    const move = (e: PointerEvent) => {
      const dx = (e.clientX - startX) / scale;
      const width = Math.round(Math.max(120, Math.min(size.width, originWidth + dx)));
      const ratio = width / originWidth;
      patchLayer(
        layer.id,
        {
          width,
          fontSize: Math.round(Math.max(12, Math.min(size.width * 0.3, originFont * ratio))),
        },
        false,
      );
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  /* ---------------- actions calque ------------------------------------------ */
  const addLayer = (role: TextRole) =>
    commit((prev) => ({
      ...prev,
      layers: [...prev.layers, defaultLayer(role, prev.canvas)],
    }));

  const removeLayer = (id: string) => {
    commit((prev) => ({ ...prev, layers: prev.layers.filter((l) => l.id !== id) }));
    setSelectedId(null);
  };

  const centerLayer = (layer: FrontTextLayer) =>
    patchLayer(layer.id, { x: Math.round((size.width - layer.width) / 2), align: 'center' });

  const resetLayer = (layer: FrontTextLayer) => {
    const fresh = defaultLayer(layer.role, composition.canvas, layer.text);
    patchLayer(layer.id, { ...fresh, id: layer.id });
  };

  /* ---------------- modèles professionnels ---------------------------------- */
  const [templateBackup, setTemplateBackup] = useState<FrontComposition | null>(null);
  const [genreFilter, setGenreFilter] = useState<CoverGenre | 'all'>('all');
  const [templateVariant, setTemplateVariant] = useState(0);

  const visibleTemplates = useMemo(
    () =>
      genreFilter === 'all'
        ? COVER_TEMPLATES
        : COVER_TEMPLATES.filter((t) => t.genre === genreFilter),
    [genreFilter],
  );

  const useTemplate = (id: CoverTemplateId, variantIndex = 0) => {
    setTemplateBackup(composition);
    setTemplateVariant(variantIndex);
    const tpl = COVER_TEMPLATES.find((t) => t.id === id);
    if (tpl) {
      void ensureFontsReady([tpl.title.fontFamily, tpl.subtitle.fontFamily, tpl.author.fontFamily]);
    }
    commit((prev) => applyTemplate(prev, id, variantIndex));
  };

  const cancelTemplate = () => {
    if (!templateBackup) return;
    const restore = templateBackup;
    setTemplateBackup(null);
    commit(() => restore);
  };


  const missingRoles = ROLES.filter((r) => !composition.layers.some((l) => l.role === r));


  /* ---------------- rendu -------------------------------------------------- */
  return (
    <div className="space-y-4">
      <CoverProAccessBar />

      {/* barre d'état */}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={undo} disabled={!past.length} className="gap-1">
            <Undo2 className="h-4 w-4" /> Annuler
          </Button>
          <Button variant="outline" size="sm" onClick={redo} disabled={!future.length} className="gap-1">
            <Redo2 className="h-4 w-4" /> Rétablir
          </Button>
          {missingRoles.map((role) => (
            <Button key={role} variant="ghost" size="sm" onClick={() => addLayer(role)} className="gap-1">
              <Plus className="h-4 w-4" /> {ROLE_LABEL[role]}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={status} error={saveError} />
          <Button size="sm" className="gap-1" onClick={() => void save()} disabled={status === 'saving'}>
            <Save className="h-4 w-4" /> Enregistrer
          </Button>
          {canExportKindle && (
            <Button
              size="sm"
              onClick={() => void exportKindle()}
              disabled={exportState === 'working'}
              className="gap-1 bg-[#f47920] text-white hover:bg-[#d96a15]"
            >
              {exportState === 'working' && exportLabel === 'Kindle' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Préparation…
                </>
              ) : exportState === 'done' && exportLabel === 'Kindle' ? (
                <>
                  <Check className="h-4 w-4" /> Couverture téléchargée
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" /> Télécharger la couverture Kindle
                </>
              )}
            </Button>
          )}

          {hasText && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                disabled={exportState === 'working'}
                onClick={() => void exportPng()}
                title="PNG haute définition"
              >
                {exportState === 'working' && exportLabel === 'PNG' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}{' '}
                PNG HD
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                disabled={exportState === 'working'}
                onClick={() => void exportPdf()}
                title="PDF 300 DPI avec fond perdu"
              >
                {exportState === 'working' && exportLabel === 'PDF' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}{' '}
                PDF 300 DPI
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                disabled={exportState === 'working'}
                onClick={() => void exportMockup()}
                title="Mockup de présentation pour vos pages de vente"
              >
                {exportState === 'working' && exportLabel === 'Mockup' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}{' '}
                Mockup
              </Button>
            </>
          )}

        </div>
      </div>

      {exportError && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Export impossible : {exportError}
        </p>
      )}

      {/* modèles professionnels */}
      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Modèles professionnels <Badge variant="secondary">{COVER_TEMPLATES.length} modèles</Badge>
              </p>
              <p className="text-xs text-muted-foreground">
                Le modèle conserve votre illustration et vos textes : il ne change que la mise en
                page, les polices et les styles. Tous les réglages restent modifiables ensuite.
              </p>
            </div>
            {templateBackup && (
              <Button variant="outline" size="sm" onClick={cancelTemplate} className="gap-1">
                <RotateCcw className="h-4 w-4" /> Annuler le modèle
              </Button>
            )}
          </div>

          {/* filtre par genre */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setGenreFilter('all')}
              className={cn(
                'rounded-full border px-3 py-1 text-xs transition',
                genreFilter === 'all'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary',
              )}
            >
              Tous
            </button>
            {AVAILABLE_GENRES.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => setGenreFilter(genre)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs transition',
                  genreFilter === genre
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-primary',
                )}
              >
                {GENRE_LABEL[genre]}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {visibleTemplates.map((tpl) => {
              const active = composition.templateId === tpl.id;
              const variantIndex = active ? templateVariant : 0;
              const variant = tpl.variants[variantIndex] ?? tpl.variants[0];
              return (
                <div
                  key={tpl.id}
                  className={cn(
                    'rounded-xl border p-2 text-left transition',
                    active ? 'border-primary ring-2 ring-primary/40' : 'border-border hover:border-primary',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => useTemplate(tpl.id, variantIndex)}
                    data-cover-template={tpl.id}
                    className="w-full text-left"
                  >
                    <div
                      className={cn(
                        'relative mb-2 flex h-40 w-full flex-col items-center overflow-hidden rounded-lg px-3 py-4 text-white',
                        variant.gradient,
                      )}
                    >
                      <div
                        className={cn(
                          'w-full rounded px-1 text-center',
                          tpl.preview.bandClass,
                          tpl.preview.titleClass,
                        )}
                      >
                        Titre du livre
                      </div>
                      <div className={cn('mt-2 w-full text-center', tpl.preview.subtitleClass)}>
                        Sous-titre
                      </div>
                      <div
                        className={cn(
                          'absolute bottom-3 left-0 w-full text-center',
                          tpl.preview.authorClass,
                        )}
                      >
                        Georges Boubet
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{tpl.label}</p>
                    <p className="text-xs text-muted-foreground">{tpl.description}</p>
                  </button>

                  {/* variantes de couleurs */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {tpl.variants.map((v, index) => (
                      <button
                        key={v.label}
                        type="button"
                        title={`Variante ${v.label}`}
                        onClick={() => useTemplate(tpl.id, index)}
                        className={cn(
                          'rounded border px-2 py-0.5 text-[11px] transition',
                          active && variantIndex === index
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:border-primary',
                        )}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>



      <div className="grid gap-4 lg:grid-cols-[280px_1fr_320px]">
        {/* outils toujours visibles */}
        <Card className="h-fit">
          <CardContent className="space-y-4 p-4">
            <p className="text-sm font-semibold text-foreground">Première de couverture</p>

            {ROLES.map((role) => {
              const layer = composition.layers.find((l) => l.role === role);
              return (
                <div key={role} className="space-y-1.5">
                  <Label htmlFor={`tool-${role}`}>{ROLE_LABEL[role]}</Label>
                  {layer ? (
                    <Input
                      id={`tool-${role}`}
                      value={layer.text}
                      placeholder={ROLE_LABEL[role]}
                      onFocus={() => setSelectedId(layer.id)}
                      onChange={(e) => patchLayer(layer.id, { text: e.target.value })}
                    />
                  ) : (
                    <Button variant="outline" size="sm" className="w-full gap-1" onClick={() => addLayer(role)}>
                      <Plus className="h-4 w-4" /> Ajouter {ROLE_LABEL[role].toLowerCase()}
                    </Button>
                  )}
                </div>
              );
            })}

            <div className="space-y-1.5">
              <Label htmlFor="tool-bg">Couleur de fond</Label>
              <Input
                id="tool-bg"
                type="color"
                className="h-9 w-16 p-1"
                value={composition.backgroundColor || DEFAULT_FRONT_BACKGROUND}
                onChange={(e) =>
                  commit((prev) => ({ ...prev, backgroundColor: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2 border-t border-border pt-3">
              <IllustrationGeneratorPanel
                projectId={project.id}
                hasIllustration={Boolean(composition.illustrationPath ?? project.illustration_path)}
                className="w-full gap-2"
                onGenerated={(path) => {
                  commit((prev) => ({ ...prev, illustrationPath: path }));
                }}
              />
              <div className="overflow-hidden rounded-lg border border-border bg-muted" style={{ height: 150 }}>
                {bgUrl ? (
                  <img src={bgUrl} alt="Illustration du projet" className="h-full w-full object-cover" />
                ) : (
                  <p className="flex h-full items-center justify-center px-2 text-center text-xs text-muted-foreground">
                    Aucune illustration pour l’instant
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* canevas */}
        <div ref={wrapRef} className="min-w-0">
          <div
            className="relative mx-auto overflow-hidden rounded-lg border border-border bg-muted shadow-sm"
            style={{
              width: size.width * scale,
              height: size.height * scale,
              backgroundColor: composition.backgroundColor || DEFAULT_FRONT_BACKGROUND,
            }}
            onPointerDown={() => setSelectedId(null)}
          >
            {bgUrl ? (
              <img
                src={bgUrl}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-xs text-white/70">
                Aucune illustration privée pour ce projet
              </div>
            )}

            {composition.overlay && composition.overlay.type !== 'none' && (
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    composition.overlay.type === 'full'
                      ? composition.overlay.color
                      : composition.overlay.type === 'top'
                        ? `linear-gradient(to bottom, ${composition.overlay.color} 0%, transparent 55%)`
                        : composition.overlay.type === 'bottom'
                          ? `linear-gradient(to top, ${composition.overlay.color} 0%, transparent 55%)`
                          : `linear-gradient(to bottom, ${composition.overlay.color} 0%, transparent 40%, transparent 60%, ${composition.overlay.color} 100%)`,
                  opacity: composition.overlay.opacity,
                }}
              />
            )}

            {guides && (
              <>
                <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-primary/70" />
                <div className="pointer-events-none absolute left-0 top-1/2 h-px w-full bg-primary/70" />
              </>
            )}

            {composition.layers.map((layer) => {
              const active = layer.id === selectedId;
              const padY = layer.band?.enabled ? (layer.band.padY ?? 0) * scale : 0;
              return (
                <div
                  key={layer.id}
                  role="button"
                  tabIndex={0}
                  onPointerDown={(e) => startDrag(e, layer)}
                  className={cn(
                    'absolute cursor-move select-none',
                    active ? 'ring-2 ring-primary' : 'ring-1 ring-transparent hover:ring-primary/40',
                  )}
                  style={{
                    left: layer.x * scale,
                    top: layer.y * scale - padY,
                    width: layer.width * scale,
                    paddingTop: padY,
                    paddingBottom: padY,
                    fontFamily: layer.fontFamily,
                    fontSize: layer.fontSize * scale,
                    lineHeight: layer.lineHeight,
                    color: layer.color,
                    textAlign: layer.align,
                    fontWeight: layer.bold ? 700 : 400,
                    fontStyle: layer.italic ? 'italic' : 'normal',
                    opacity: layer.opacity ?? 1,
                    letterSpacing: (layer.letterSpacing ?? 0) * scale,
                    backgroundColor: layer.band?.enabled
                      ? hexWithAlpha(layer.band.color, layer.band.opacity)
                      : undefined,
                    textShadow: layer.shadow?.enabled
                      ? `0 ${(layer.shadow.offsetY ?? 0) * scale}px ${(layer.shadow.blur ?? 0) * scale}px ${layer.shadow.color}`
                      : undefined,
                    WebkitTextStrokeWidth: layer.outline?.enabled
                      ? (layer.outline.width ?? 0) * scale
                      : undefined,
                    WebkitTextStrokeColor: layer.outline?.enabled ? layer.outline.color : undefined,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                  data-cover-layer={layer.role}
                >
                  {layer.text}

                  {active && (
                    <span
                      onPointerDown={(e) => startResize(e, layer)}
                      className="absolute -bottom-1.5 -right-1.5 h-3 w-3 cursor-se-resize rounded-full border border-background bg-primary"
                      aria-label="Redimensionner"
                    />
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {size.label} · affichage à {Math.round(scale * 100)} %
          </p>
        </div>

        {/* panneau d'édition */}
        <Card className="h-fit">
          <CardContent className="space-y-4 p-4">
            {!selected && (
              <p className="text-sm text-muted-foreground">
                Sélectionnez un texte sur la couverture pour le modifier.
              </p>
            )}

            {selected && (
              <>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{ROLE_LABEL[selected.role]}</Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => resetLayer(selected)}
                      title="Remise à zéro"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLayer(selected.id)}
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cover-text">Texte</Label>
                  <Textarea
                    id="cover-text"
                    value={selected.text}
                    rows={3}
                    onChange={(e) => patchLayer(selected.id, { text: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Police professionnelle</Label>
                  <Select
                    value={selected.fontFamily}
                    onValueChange={(v) => {
                      void ensureFontsReady([v]);
                      patchLayer(selected.id, { fontFamily: v });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {(['serif', 'sans', 'display'] as FontCategory[]).map((cat) => (
                        <SelectGroup key={cat}>
                          <SelectLabel>{FONT_CATEGORY_LABEL[cat]}</SelectLabel>
                          {COVER_FONTS.filter((f) => f.category === cat).map((f) => (
                            <SelectItem key={f.value} value={f.value}>
                              <span style={{ fontFamily: f.value }}>{f.label}</span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </div>


                <div className="space-y-1.5">
                  <Label>Taille : {selected.fontSize} px</Label>
                  <Slider
                    min={16}
                    max={Math.round(size.width * 0.3)}
                    step={2}
                    value={[selected.fontSize]}
                    onValueChange={([v]) => patchLayer(selected.id, { fontSize: v }, false)}
                  />
                </div>

                <div className="flex items-end gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="cover-color">Couleur</Label>
                    <Input
                      id="cover-color"
                      type="color"
                      className="h-9 w-16 p-1"
                      value={selected.color}
                      onChange={(e) => patchLayer(selected.id, { color: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-1">
                    {(
                      [
                        ['left', AlignLeft],
                        ['center', AlignCenter],
                        ['right', AlignRight],
                      ] as [TextAlign, typeof AlignLeft][]
                    ).map(([value, Icon]) => (
                      <Button
                        key={value}
                        variant={selected.align === value ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => patchLayer(selected.id, { align: value })}
                        aria-label={`Aligner ${value}`}
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant={selected.bold ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => patchLayer(selected.id, { bold: !selected.bold })}
                      aria-label="Gras"
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={selected.italic ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => patchLayer(selected.id, { italic: !selected.italic })}
                      aria-label="Italique"
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Interligne : {selected.lineHeight.toFixed(2)}</Label>
                  <Slider
                    min={0.9}
                    max={2}
                    step={0.02}
                    value={[selected.lineHeight]}
                    onValueChange={([v]) => patchLayer(selected.id, { lineHeight: v }, false)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Espacement des lettres : {selected.letterSpacing ?? 0} px</Label>
                  <Slider
                    min={-10}
                    max={40}
                    step={1}
                    value={[selected.letterSpacing ?? 0]}
                    onValueChange={([v]) => patchLayer(selected.id, { letterSpacing: v }, false)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Opacité : {Math.round((selected.opacity ?? 1) * 100)} %</Label>
                  <Slider
                    min={0.1}
                    max={1}
                    step={0.05}
                    value={[selected.opacity ?? 1]}
                    onValueChange={([v]) => patchLayer(selected.id, { opacity: v }, false)}
                  />
                </div>

                {/* ombre */}
                <div className="space-y-2 rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <Label>Ombre portée</Label>
                    <Switch
                      checked={!!selected.shadow?.enabled}
                      onCheckedChange={(on) =>
                        patchLayer(selected.id, {
                          shadow: {
                            enabled: on,
                            color: selected.shadow?.color ?? '#000000',
                            blur: selected.shadow?.blur ?? 30,
                            offsetY: selected.shadow?.offsetY ?? 6,
                          },
                        })
                      }
                    />
                  </div>
                  {selected.shadow?.enabled && (
                    <>
                      <Label className="text-xs">Flou : {selected.shadow.blur} px</Label>
                      <Slider
                        min={0}
                        max={80}
                        step={2}
                        value={[selected.shadow.blur]}
                        onValueChange={([v]) =>
                          patchLayer(selected.id, { shadow: { ...selected.shadow!, blur: v } }, false)
                        }
                      />
                      <Input
                        type="color"
                        className="h-9 w-16 p-1"
                        value={selected.shadow.color}
                        onChange={(e) =>
                          patchLayer(selected.id, {
                            shadow: { ...selected.shadow!, color: e.target.value },
                          })
                        }
                      />
                    </>
                  )}
                </div>

                {/* contour */}
                <div className="space-y-2 rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <Label>Contour</Label>
                    <Switch
                      checked={!!selected.outline?.enabled}
                      onCheckedChange={(on) =>
                        patchLayer(selected.id, {
                          outline: {
                            enabled: on,
                            color: selected.outline?.color ?? '#000000',
                            width: selected.outline?.width ?? 6,
                          },
                        })
                      }
                    />
                  </div>
                  {selected.outline?.enabled && (
                    <>
                      <Label className="text-xs">Épaisseur : {selected.outline.width} px</Label>
                      <Slider
                        min={1}
                        max={24}
                        step={1}
                        value={[selected.outline.width]}
                        onValueChange={([v]) =>
                          patchLayer(
                            selected.id,
                            { outline: { ...selected.outline!, width: v } },
                            false,
                          )
                        }
                      />
                      <Input
                        type="color"
                        className="h-9 w-16 p-1"
                        value={selected.outline.color}
                        onChange={(e) =>
                          patchLayer(selected.id, {
                            outline: { ...selected.outline!, color: e.target.value },
                          })
                        }
                      />
                    </>
                  )}
                </div>

                {/* bandeau */}
                <div className="space-y-2 rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <Label>Bandeau derrière le texte</Label>
                    <Switch
                      checked={!!selected.band?.enabled}
                      onCheckedChange={(on) =>
                        patchLayer(selected.id, {
                          band: {
                            enabled: on,
                            color: selected.band?.color ?? '#000000',
                            opacity: selected.band?.opacity ?? 0.45,
                            padY: selected.band?.padY ?? Math.round(size.height * 0.02),
                          },
                        })
                      }
                    />
                  </div>
                  {selected.band?.enabled && (
                    <>
                      <Label className="text-xs">
                        Opacité du bandeau : {Math.round(selected.band.opacity * 100)} %
                      </Label>
                      <Slider
                        min={0.05}
                        max={1}
                        step={0.05}
                        value={[selected.band.opacity]}
                        onValueChange={([v]) =>
                          patchLayer(selected.id, { band: { ...selected.band!, opacity: v } }, false)
                        }
                      />
                      <Input
                        type="color"
                        className="h-9 w-16 p-1"
                        value={selected.band.color}
                        onChange={(e) =>
                          patchLayer(selected.id, {
                            band: { ...selected.band!, color: e.target.value },
                          })
                        }
                      />
                    </>
                  )}
                </div>

                {/* voile global */}
                <div className="space-y-2 rounded-lg border border-border p-3">
                  <Label>Voile global sur l'illustration</Label>
                  <Select
                    value={composition.overlay?.type ?? 'none'}
                    onValueChange={(v) =>
                      commit((prev) => ({
                        ...prev,
                        overlay: {
                          type: v as NonNullable<FrontComposition['overlay']>['type'],
                          color: prev.overlay?.color ?? '#000000',
                          opacity: prev.overlay?.opacity ?? 0.4,
                        },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>
                      <SelectItem value="top">Haut</SelectItem>
                      <SelectItem value="bottom">Bas</SelectItem>
                      <SelectItem value="both">Haut et bas</SelectItem>
                      <SelectItem value="full">Uniforme</SelectItem>
                    </SelectContent>
                  </Select>
                  {composition.overlay && composition.overlay.type !== 'none' && (
                    <>
                      <Label className="text-xs">
                        Intensité : {Math.round(composition.overlay.opacity * 100)} %
                      </Label>
                      <Slider
                        min={0.05}
                        max={0.9}
                        step={0.05}
                        value={[composition.overlay.opacity]}
                        onValueChange={([v]) =>
                          commit((prev) => ({
                            ...prev,
                            overlay: { ...prev.overlay!, opacity: v },
                          }))
                        }
                      />
                    </>
                  )}
                </div>

                <Button variant="outline" className="w-full" onClick={() => centerLayer(selected)}>
                  Centrer horizontalement
                </Button>

              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusPill({ status, error }: { status: SaveStatus; error: string | null }) {
  if (status === 'saving')
    return (
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground" data-cover-status="saving">
        <Loader2 className="h-4 w-4 animate-spin" /> Enregistrement…
      </span>
    );
  if (status === 'dirty')
    return (
      <span className="text-sm text-muted-foreground" data-cover-status="dirty">
        Modification en cours
      </span>
    );
  if (status === 'saved')
    return (
      <span className="flex items-center gap-1.5 text-sm text-emerald-600" data-cover-status="saved">
        <Check className="h-4 w-4" /> Enregistré
      </span>
    );
  if (status === 'error')
    return (
      <span className="flex items-center gap-1.5 text-sm text-destructive" data-cover-status="error">
        <TriangleAlert className="h-4 w-4" /> Erreur d’enregistrement{error ? ` : ${error}` : ''}
      </span>
    );
  return (
    <span className="text-sm text-muted-foreground" data-cover-status="idle">
      Prêt
    </span>
  );
}
