/**
 * Étape 4C — éditeur visuel COMPLET des couvertures brochées KDP.
 *
 * QUATRIÈME | DOS | PREMIÈRE
 *
 * - la géométrie provient exclusivement du moteur validé à l'étape 4B ;
 * - la composition est enregistrée en `version: 2` / `paperback_wrap`, avec des
 *   coordonnées normalisées par zone (aucune coordonnée absolue) ;
 * - repères non imprimables activables, jamais intégrés à la composition ni aux
 *   miniatures ;
 * - miniature de bibliothèque limitée à la première de couverture ;
 * - aucun export, aucun code-barres réel, aucun ISBN, aucun appel IA, aucun crédit.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  Eye,
  EyeOff,
  Italic,
  Loader2,
  Maximize,
  Plus,
  Redo2,
  RotateCcw,
  Trash2,
  TriangleAlert,
  Undo2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
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
import { FRONT_FONTS, parseComposition, type TextAlign } from '@/lib/cover-editor/frontComposition';
import {
  computePaperbackGeometry,
  defaultPaperbackConfig,
  formatIn,
  parsePaperbackConfig,
} from '@/lib/cover-editor/kdpPaperbackSpecs';
import {
  MIN_SPINE_FONT_PT,
  OPTIONAL_ROLES,
  ROLE_LABEL_WRAP,
  SPINE_SIDE_MARGIN_IN,
  ZONE_LABEL,
  computeWrapWarnings,
  createWrapComposition,
  defaultElement,
  fitSpineElements,
  fitSpineFontSize,

  elementBoxIn,
  inToPt,
  isWrapComposition,
  migrateFrontToWrap,
  parseWrapComposition,
  ptToIn,
  recenterSpineElements,
  renderWrapFrontThumbnail,
  serializeWrapComposition,
  spineTextConform,
  validateWrapPayload,
  zoneBox,
  type WrapComposition,
  type WrapRole,
  type WrapTextElement,
} from '@/lib/cover-editor/wrapComposition';

type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

const AUTOSAVE_DELAY_MS = 1500;
const ADDABLE_ROLES: WrapRole[] = [
  'title', 'subtitle', 'author',
  'spine-title', 'spine-author',
  'back-blurb', 'back-about', 'back-extra',
];

interface Props {
  project: CoverProject;
  onProjectUpdated?: (project: CoverProject) => void;
}

export default function CoverWrapEditor({ project, onProjectUpdated }: Props) {
  /* ------------------ géométrie (moteur 4B, jamais recalculée ici) --------- */
  const config = useMemo(
    () =>
      project.kdp_config
        ? parsePaperbackConfig(project.kdp_config, project.page_count ?? 120)
        : defaultPaperbackConfig(project.page_count ?? 120),
    [project.kdp_config, project.page_count],
  );
  const result = useMemo(() => computePaperbackGeometry(config), [config]);
  const geometry = result.geometry;

  /* ------------------ composition version 2 -------------------------------- */
  const [composition, setComposition] = useState<WrapComposition>(() => {
    const fallback = {
      illustrationPath: project.illustration_path,
      bookTitle: project.book_title,
    };
    const initialGeometry = computePaperbackGeometry(
      project.kdp_config
        ? parsePaperbackConfig(project.kdp_config, project.page_count ?? 120)
        : defaultPaperbackConfig(project.page_count ?? 120),
    ).geometry;

    if (isWrapComposition(project.fabric_json)) {
      // Composition existante : restaurée à l'identique, sans ajustement.
      return parseWrapComposition(project.fabric_json, fallback);
    }

    const fresh = project.fabric_json
      ? // Migration défensive version 1 (première seule) → version 2.
        migrateFrontToWrap(
          parseComposition(project.fabric_json, {
            formatId: project.format_id,
            illustrationPath: project.illustration_path,
            bookTitle: project.book_title,
          }),
          {
            formatId: project.format_id,
            trimWidthIn: initialGeometry?.trimWidthIn ?? 6,
            bookTitle: project.book_title,
          },
        )
      : createWrapComposition(fallback);

    return initialGeometry ? fitSpineElements(fresh, initialGeometry) : fresh;
  });


  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeZone, setActiveZone] = useState<'front' | 'spine' | 'back'>('front');

  const [status, setStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [bgSize, setBgSize] = useState<{ width: number; height: number } | null>(null);
  const [showGuides, setShowGuides] = useState(true);
  const [past, setPast] = useState<WrapComposition[]>([]);
  const [future, setFuture] = useState<WrapComposition[]>([]);

  const thumbPathRef = useRef<string | null>(project.thumbnail_path);
  const timerRef = useRef<number | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [fitPxPerIn, setFitPxPerIn] = useState(60);
  const [zoom, setZoom] = useState(1);

  const pxPerIn = fitPxPerIn * zoom;
  const selected = composition.elements.find((e) => e.id === selectedId) ?? null;

  // L'onglet de zone suit l'élément sélectionné sur le canevas.
  useEffect(() => {
    if (selected) setActiveZone(selected.zone);
  }, [selected]);

  const spine = geometry ? spineTextConform(geometry) : null;

  /* ------------------ illustration privée (URL signée éphémère) ------------ */
  useEffect(() => {
    let active = true;
    const path = composition.illustrationPath ?? project.illustration_path;
    if (!path) {
      setBgUrl(null);
      setBgSize(null);
      return;
    }
    void getSignedCoverUrl(path).then((url) => {
      if (!active) return;
      setBgUrl(url);
      if (url) {
        const img = new Image();
        img.onload = () => active && setBgSize({ width: img.naturalWidth, height: img.naturalHeight });
        img.src = url;
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [composition.illustrationPath, project.illustration_path]);

  /* ------------------ ajustement à l'écran -------------------------------- */
  const computeFit = useCallback(() => {
    const el = wrapRef.current;
    if (!el || !geometry) return;
    const available = Math.max(320, el.clientWidth - 8);
    const maxHeight = Math.max(280, window.innerHeight - 380);
    setFitPxPerIn(
      Math.min(available / geometry.fullWidthIn, maxHeight / geometry.fullHeightIn),
    );
  }, [geometry]);

  useLayoutEffect(() => {
    computeFit();
    window.addEventListener('resize', computeFit);
    return () => window.removeEventListener('resize', computeFit);
  }, [computeFit]);

  /* ------------------ historique + mutations ------------------------------- */
  const commit = useCallback(
    (updater: (prev: WrapComposition) => WrapComposition, snapshot = true) => {
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

  const patchElement = useCallback(
    (id: string, patch: Partial<WrapTextElement>, snapshot = true) => {
      commit(
        (prev) => ({
          ...prev,
          elements: prev.elements.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        }),
        snapshot,
      );
    },
    [commit],
  );

  const undo = () => {
    setPast((p) => {
      if (!p.length) return p;
      setFuture((f) => [composition, ...f]);
      setComposition(p[p.length - 1]);
      setStatus('dirty');
      return p.slice(0, -1);
    });
  };

  const redo = () => {
    setFuture((f) => {
      if (!f.length) return f;
      setPast((p) => [...p, composition]);
      setComposition(f[0]);
      setStatus('dirty');
      return f.slice(1);
    });
  };

  /* ------------------ recentrage du dos après changement de pages ---------- */
  const spineKey = geometry?.spineWidthIn ?? 0;
  const lastSpineKey = useRef<number | null>(null);
  const fitRef = useRef(computeFit);
  fitRef.current = computeFit;
  useEffect(() => {
    // Premier rendu : aucune modification, donc aucun enregistrement parasite.
    if (lastSpineKey.current === null || lastSpineKey.current === spineKey) {
      lastSpineKey.current = spineKey;
      return;
    }
    lastSpineKey.current = spineKey;
    // Seul le dos est recentré : la première et la quatrième ne bougent pas.
    setComposition((prev) => recenterSpineElements(prev));
    setStatus('dirty');
    fitRef.current();
  }, [spineKey]);


  /* ------------------ enregistrement automatique -------------------------- */
  const save = useCallback(async () => {
    if (!geometry) return;
    setStatus('saving');
    setSaveError(null);
    try {
      const illustrationPath = composition.illustrationPath ?? project.illustration_path ?? null;
      const payload = serializeWrapComposition(composition, illustrationPath);
      const check = validateWrapPayload(payload);
      if (!check.ok) throw new Error(check.errors[0]);

      const updated = await updateCoverProject(project.id, {
        fabric_json: payload as unknown as Record<string, unknown>,
      });

      let finalProject = updated;
      try {
        // Miniature de bibliothèque = PREMIÈRE uniquement, sans repères.
        const blob = await renderWrapFrontThumbnail(composition, geometry, bgUrl);
        const path = await uploadCoverFile({ projectId: project.id, kind: 'thumbnail', blob });
        const withThumb = await updateCoverProject(project.id, { thumbnail_path: path });
        const oldPath = thumbPathRef.current;
        thumbPathRef.current = path;
        if (oldPath && oldPath !== path) await removeCoverFile(oldPath);
        finalProject = withThumb;
      } catch {
        /* la composition reste enregistrée même si la miniature échoue */
      }

      onProjectUpdated?.(finalProject);
      setStatus('saved');
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Enregistrement impossible.');
      setStatus('error');
    }
  }, [bgUrl, composition, geometry, onProjectUpdated, project.id, project.illustration_path]);

  useEffect(() => {
    if (status !== 'dirty') return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => void save(), AUTOSAVE_DELAY_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, composition]);

  /* ------------------ interactions ---------------------------------------- */
  const startDrag = (event: React.PointerEvent, el: WrapTextElement) => {
    if (!geometry) return;
    event.preventDefault();
    event.stopPropagation();
    setSelectedId(el.id);
    setPast((p) => [...p.slice(-49), composition]);
    setFuture([]);
    const box = zoneBox(geometry, el.zone);
    const startX = event.clientX;
    const startY = event.clientY;
    const originX = el.nx;
    const originY = el.ny;

    const move = (e: PointerEvent) => {
      const dxIn = (e.clientX - startX) / pxPerIn;
      const dyIn = (e.clientY - startY) / pxPerIn;
      patchElement(
        el.id,
        {
          nx: Math.max(-0.2, Math.min(1.1, originX + dxIn / box.widthIn)),
          ny: Math.max(-0.05, Math.min(1.02, originY + dyIn / box.heightIn)),
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

  const startResize = (event: React.PointerEvent, el: WrapTextElement) => {
    if (!geometry) return;
    event.preventDefault();
    event.stopPropagation();
    setSelectedId(el.id);
    setPast((p) => [...p.slice(-49), composition]);
    setFuture([]);
    const box = zoneBox(geometry, el.zone);
    const start = el.zone === 'spine' ? event.clientY : event.clientX;
    const originWidth = el.nWidth;

    const move = (e: PointerEvent) => {
      const delta = (el.zone === 'spine' ? e.clientY - start : e.clientX - start) / pxPerIn;
      const span = el.zone === 'spine' ? box.heightIn : box.widthIn;
      patchElement(
        el.id,
        { nWidth: Math.max(0.05, Math.min(1.2, originWidth + delta / span)) },
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

  const addElement = (role: WrapRole) =>
    commit((prev) => {
      const fresh = defaultElement(role);
      // Un nouvel élément de dos est créé à une taille conforme (jamais sous 7 pt).
      if (fresh.zone === 'spine' && geometry) {
        fresh.fontSizeIn = fitSpineFontSize(geometry, fresh.fontSizeIn);
      }
      return { ...prev, elements: [...prev.elements, fresh] };
    });


  const removeElement = (id: string) => {
    commit((prev) => ({ ...prev, elements: prev.elements.filter((e) => e.id !== id) }));
    setSelectedId(null);
  };

  const centerElement = (el: WrapTextElement) =>
    el.zone === 'spine'
      ? patchElement(el.id, { nx: 0.5, ny: 0.5 })
      : patchElement(el.id, { nx: (1 - el.nWidth) / 2, align: 'center' });

  const resetElement = (el: WrapTextElement) => {
    const fresh = defaultElement(el.role, el.text);
    patchElement(el.id, { ...fresh, id: el.id });
  };

  const setBackground = (patch: Partial<WrapComposition['background']>) =>
    commit((prev) => ({ ...prev, background: { ...prev.background, ...patch } }));

  /* ------------------ avertissements -------------------------------------- */
  const warnings = useMemo(
    () => (geometry ? computeWrapWarnings(composition, geometry, bgSize) : []),
    [composition, geometry, bgSize],
  );
  const warningFor = (id: string) => warnings.filter((w) => w.elementId === id);

  if (!geometry) {
    return (
      <Card className="border-amber-500/40">
        <CardContent className="space-y-2 p-6 text-sm">
          <p className="font-medium text-foreground">
            Configuration KDP incomplète : l’éditeur de couverture complète attend une géométrie valide.
          </p>
          {result.issues.map((i) => (
            <p key={i.field + i.message} className="text-muted-foreground">
              • {i.message}
            </p>
          ))}
        </CardContent>
      </Card>
    );
  }

  const canvasW = geometry.fullWidthIn * pxPerIn;
  const canvasH = geometry.fullHeightIn * pxPerIn;
  const inPx = (inches: number) => inches * pxPerIn;
  const missingRoles = ADDABLE_ROLES.filter(
    (r) => !composition.elements.some((e) => e.role === r),
  );

  return (
    <div className="space-y-4">
      {/* barre d'outils */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={undo} disabled={!past.length} className="gap-1">
            <Undo2 className="h-4 w-4" /> Annuler
          </Button>
          <Button variant="outline" size="sm" onClick={redo} disabled={!future.length} className="gap-1">
            <Redo2 className="h-4 w-4" /> Rétablir
          </Button>
          <span className="mx-1 h-6 w-px bg-border" />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom((z) => Math.max(0.25, Number((z - 0.25).toFixed(2))))}
            aria-label="Zoom arrière"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="min-w-[3.5rem] text-center text-sm tabular-nums text-muted-foreground">
            {Math.round(zoom * 100)} %
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom((z) => Math.min(4, Number((z + 0.25).toFixed(2))))}
            aria-label="Zoom avant"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setZoom(1)} className="gap-1">
            <Maximize className="h-4 w-4" /> Ajuster
          </Button>
          <span className="mx-1 h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Switch id="wrap-guides" checked={showGuides} onCheckedChange={setShowGuides} />
            <Label htmlFor="wrap-guides" className="text-sm">Repères</Label>
          <span className="mx-1 h-6 w-px bg-border" />
          <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
            {(['front', 'spine', 'back'] as const).map((zone) => (
              <Button
                key={zone}
                size="sm"
                variant={activeZone === zone ? 'default' : 'ghost'}
                className="h-7 px-2 text-xs"
                onClick={() => setActiveZone(zone)}
              >
                {ZONE_LABEL[zone]}
              </Button>
            ))}
          </div>
        </div>

        </div>
        <StatusPill status={status} error={saveError} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        {/* canevas complet */}
        <div className="min-w-0 space-y-2">
          <div ref={wrapRef} className="min-w-0 overflow-auto rounded-lg border border-border bg-muted/40 p-1">
            <div
              className="relative shadow-sm"
              style={{ width: canvasW, height: canvasH }}
              onPointerDown={() => setSelectedId(null)}
            >
              {/* fond continu sur toute la couverture, fonds perdus inclus */}
              <div
                className="absolute inset-0"
                style={{ backgroundColor: composition.background.fullColor }}
              />
              {composition.background.mode === 'back-spine-color' && (
                <>
                  <div
                    className="absolute top-0 bottom-0"
                    style={{
                      left: 0,
                      width: inPx(geometry.bleedIn + geometry.trimWidthIn),
                      backgroundColor: composition.background.backColor,
                    }}
                  />
                  <div
                    className="absolute top-0 bottom-0"
                    style={{
                      left: inPx(geometry.zones.spine.xIn),
                      width: inPx(geometry.spineWidthIn),
                      backgroundColor: composition.background.spineColor,
                    }}
                  />
                </>
              )}

              {/* illustration : première + son fond perdu extérieur, sans déformation */}
              {bgUrl && (
                <img
                  src={bgUrl}
                  alt=""
                  aria-hidden
                  draggable={false}
                  className="absolute h-full object-cover"
                  style={{
                    left: inPx(geometry.zones.front.xIn),
                    top: 0,
                    width: inPx(geometry.trimWidthIn + geometry.bleedIn),
                    height: canvasH,
                  }}
                />
              )}

              {/* repères non imprimables */}
              {showGuides && (
                <div className="pointer-events-none absolute inset-0">
                  {/* fond perdu */}
                  <div
                    className="absolute border border-dashed border-rose-400/80"
                    style={{
                      left: inPx(geometry.bleedIn),
                      top: inPx(geometry.bleedIn),
                      width: inPx(geometry.fullWidthIn - geometry.bleedIn * 2),
                      height: inPx(geometry.fullHeightIn - geometry.bleedIn * 2),
                    }}
                  />
                  {/* zone de sécurité */}
                  <div
                    className="absolute border border-dotted border-emerald-400/80"
                    style={{
                      left: inPx(geometry.bleedIn + geometry.safetyMarginIn),
                      top: inPx(geometry.bleedIn + geometry.safetyMarginIn),
                      width: inPx(
                        geometry.fullWidthIn - (geometry.bleedIn + geometry.safetyMarginIn) * 2,
                      ),
                      height: inPx(
                        geometry.fullHeightIn - (geometry.bleedIn + geometry.safetyMarginIn) * 2,
                      ),
                    }}
                  />
                  {/* lignes de coupe des zones */}
                  {[geometry.zones.spine.xIn, geometry.zones.front.xIn].map((x) => (
                    <div
                      key={x}
                      className="absolute top-0 bottom-0 w-px bg-sky-400/90"
                      style={{ left: inPx(x) }}
                    />
                  ))}
                  {/* marges du texte de dos */}
                  {[
                    geometry.zones.spine.xIn + SPINE_SIDE_MARGIN_IN,
                    geometry.zones.spine.xIn + geometry.spineWidthIn - SPINE_SIDE_MARGIN_IN,
                  ].map((x, i) => (
                    <div
                      key={`m${i}`}
                      className="absolute top-0 bottom-0 w-px bg-amber-400/80"
                      style={{ left: inPx(x) }}
                    />
                  ))}
                  {/* réserve du code-barres */}
                  <div
                    className="absolute flex items-center justify-center border border-dashed border-slate-200/90 bg-slate-900/40 text-[9px] text-slate-100"
                    style={{
                      left: inPx(geometry.barcodeZone.xIn),
                      top: inPx(geometry.barcodeZone.yIn),
                      width: inPx(geometry.barcodeZone.widthIn),
                      height: inPx(geometry.barcodeZone.heightIn),
                    }}
                  >
                    Code-barres
                  </div>
                  {/* noms des zones */}
                  {(['back', 'spine', 'front'] as const).map((zone) => (
                    <span
                      key={zone}
                      className="absolute -translate-x-1/2 rounded bg-slate-900/70 px-1.5 py-0.5 text-[10px] font-medium text-slate-50"
                      style={{
                        left: inPx(geometry.zones[zone].xIn + geometry.zones[zone].widthIn / 2),
                        top: 2,
                      }}
                    >
                      {ZONE_LABEL[zone]}
                    </span>
                  ))}
                </div>
              )}

              {/* éléments texte */}
              {composition.elements.map((el) => {
                if (el.hidden) return null;
                const box = zoneBox(geometry, el.zone);
                const active = el.id === selectedId;
                const flagged = warningFor(el.id).length > 0;
                const fontPx = el.fontSizeIn * pxPerIn;

                if (el.zone === 'spine') {
                  const lengthPx = inPx(el.nWidth * box.heightIn);
                  return (
                    <div
                      key={el.id}
                      role="button"
                      tabIndex={0}
                      onPointerDown={(e) => startDrag(e, el)}
                      className={cn(
                        'absolute origin-center cursor-move select-none whitespace-nowrap',
                        active ? 'ring-2 ring-primary' : flagged ? 'ring-1 ring-amber-400' : 'ring-1 ring-transparent hover:ring-primary/40',
                      )}
                      style={{
                        left: inPx(box.xIn + el.nx * box.widthIn),
                        top: inPx(box.yIn + el.ny * box.heightIn),
                        width: lengthPx,
                        transform: 'translate(-50%, -50%) rotate(-90deg)',
                        fontFamily: el.fontFamily,
                        fontSize: fontPx,
                        lineHeight: el.lineHeight,
                        color: el.color,
                        textAlign: el.align,
                        fontWeight: el.bold ? 700 : 400,
                        fontStyle: el.italic ? 'italic' : 'normal',
                      }}
                      data-wrap-element={el.role}
                    >
                      {el.text}
                      {active && (
                        <span
                          onPointerDown={(e) => startResize(e, el)}
                          className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 cursor-ew-resize rounded-full border border-background bg-primary"
                          aria-label="Redimensionner"
                        />
                      )}
                    </div>
                  );
                }

                return (
                  <div
                    key={el.id}
                    role="button"
                    tabIndex={0}
                    onPointerDown={(e) => startDrag(e, el)}
                    className={cn(
                      'absolute cursor-move select-none',
                      active ? 'ring-2 ring-primary' : flagged ? 'ring-1 ring-amber-400' : 'ring-1 ring-transparent hover:ring-primary/40',
                    )}
                    style={{
                      left: inPx(box.xIn + el.nx * box.widthIn),
                      top: inPx(box.yIn + el.ny * box.heightIn),
                      width: inPx(el.nWidth * box.widthIn),
                      fontFamily: el.fontFamily,
                      fontSize: fontPx,
                      lineHeight: el.lineHeight,
                      color: el.color,
                      textAlign: el.align,
                      fontWeight: el.bold ? 700 : 400,
                      fontStyle: el.italic ? 'italic' : 'normal',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                    data-wrap-element={el.role}
                  >
                    {el.text}
                    {active && (
                      <span
                        onPointerDown={(e) => startResize(e, el)}
                        className="absolute -bottom-1.5 -right-1.5 h-3 w-3 cursor-se-resize rounded-full border border-background bg-primary"
                        aria-label="Redimensionner"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Couverture complète {formatIn(geometry.fullWidthIn)} × {formatIn(geometry.fullHeightIn)} ·
            dos {formatIn(geometry.spineWidthIn)} · {geometry.px300.fullWidth} × {geometry.px300.fullHeight} px à 300 DPI
          </p>

          {/* avertissements non bloquants */}
          {warnings.length > 0 && (
            <Card className="border-amber-500/40 bg-amber-500/5">
              <CardContent className="space-y-1.5 p-3 text-xs">
                <p className="flex items-center gap-1.5 font-medium text-foreground">
                  <TriangleAlert className="h-4 w-4 text-amber-500" /> Contrôles de conformité
                </p>
                {warnings.map((w) => (
                  <p key={w.id} className="text-muted-foreground">• {w.message}</p>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* panneaux latéraux */}
        <div className="space-y-4">
          {/* fonds */}
          <Card>
            <CardContent className="space-y-3 p-4">
              <p className="text-sm font-semibold text-foreground">Fond de la couverture</p>
              <Select
                value={composition.background.mode}
                onValueChange={(v) => setBackground({ mode: v as WrapComposition['background']['mode'] })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-color">Couleur unie sur toute la couverture</SelectItem>
                  <SelectItem value="back-spine-color">Couleurs distinctes quatrième et dos</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Couverture</Label>
                  <Input
                    type="color"
                    className="h-9 w-16 p-1"
                    value={composition.background.fullColor}
                    onChange={(e) => setBackground({ fullColor: e.target.value })}
                  />
                </div>
                {composition.background.mode === 'back-spine-color' && (
                  <>
                    <div className="space-y-1">
                      <Label className="text-xs">Quatrième</Label>
                      <Input
                        type="color"
                        className="h-9 w-16 p-1"
                        value={composition.background.backColor}
                        onChange={(e) => setBackground({ backColor: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Dos</Label>
                      <Input
                        type="color"
                        className="h-9 w-16 p-1"
                        value={composition.background.spineColor}
                        onChange={(e) => setBackground({ spineColor: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                L’illustration privée reste réservée à la première de couverture. Aucune image n’est
                générée ici et aucun crédit n’est débité.
              </p>
            </CardContent>
          </Card>

          {/* liste des éléments */}
          <Card>
            <CardContent className="space-y-2 p-4">
              <p className="text-sm font-semibold text-foreground">Éléments</p>
              {([activeZone] as const).map((zone) => (

                <div key={zone} className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {ZONE_LABEL[zone]}
                  </p>
                  {composition.elements.filter((e) => e.zone === zone).length === 0 && (
                    <p className="text-xs text-muted-foreground/70">Aucun élément</p>
                  )}
                  {composition.elements
                    .filter((e) => e.zone === zone)
                    .map((el) => (
                      <div
                        key={el.id}
                        className={cn(
                          'flex items-center justify-between gap-2 rounded-md border px-2 py-1.5 text-xs',
                          el.id === selectedId ? 'border-primary bg-primary/5' : 'border-border',
                        )}
                      >
                        <button
                          type="button"
                          className="min-w-0 flex-1 truncate text-left"
                          onClick={() => setSelectedId(el.id)}
                        >
                          {ROLE_LABEL_WRAP[el.role]}
                        </button>
                        {OPTIONAL_ROLES.includes(el.role) && (
                          <button
                            type="button"
                            aria-label={el.hidden ? 'Afficher' : 'Masquer'}
                            onClick={() => patchElement(el.id, { hidden: !el.hidden })}
                          >
                            {el.hidden ? (
                              <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                            ) : (
                              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              ))}
              {missingRoles.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {missingRoles.map((role) => (
                    <Button
                      key={role}
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 px-2 text-xs"
                      onClick={() => addElement(role)}
                    >
                      <Plus className="h-3.5 w-3.5" /> {ROLE_LABEL_WRAP[role]}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* édition de l'élément sélectionné */}
          <Card className="h-fit">
            <CardContent className="space-y-4 p-4">
              {!selected && (
                <p className="text-sm text-muted-foreground">
                  Sélectionnez un élément sur la couverture ou dans la liste pour le modifier.
                </p>
              )}

              {selected && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline">{ZONE_LABEL[selected.zone]}</Badge>
                      <Badge variant="secondary">{ROLE_LABEL_WRAP[selected.role]}</Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => resetElement(selected)} title="Remise à zéro">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeElement(selected.id)} title="Supprimer">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {selected.zone === 'spine' && spine && !spine.allowed && (
                    <p className="rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-foreground">
                      {spine.reason}. Le texte de dos ne sera pas conforme et n’est jamais réduit
                      automatiquement sous {MIN_SPINE_FONT_PT} points.
                    </p>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="wrap-text">Texte</Label>
                    <Textarea
                      id="wrap-text"
                      value={selected.text}
                      rows={selected.zone === 'back' ? 5 : 3}
                      onChange={(e) => patchElement(selected.id, { text: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Police</Label>
                    <Select
                      value={selected.fontFamily}
                      onValueChange={(v) => patchElement(selected.id, { fontFamily: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {FRONT_FONTS.map((f) => (
                          <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>
                      Taille : {inToPt(selected.fontSizeIn).toFixed(1)} pt
                      {selected.zone === 'spine' && ` (minimum ${MIN_SPINE_FONT_PT} pt)`}
                    </Label>
                    <Slider
                      min={selected.zone === 'spine' ? MIN_SPINE_FONT_PT : 6}
                      max={selected.zone === 'front' ? 160 : 48}
                      step={0.5}
                      value={[Number(inToPt(selected.fontSizeIn).toFixed(1))]}
                      onValueChange={([v]) => patchElement(selected.id, { fontSizeIn: ptToIn(v) }, false)}
                    />
                  </div>

                  <div className="flex items-end gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="wrap-color">Couleur</Label>
                      <Input
                        id="wrap-color"
                        type="color"
                        className="h-9 w-16 p-1"
                        value={selected.color}
                        onChange={(e) => patchElement(selected.id, { color: e.target.value })}
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
                          onClick={() => patchElement(selected.id, { align: value })}
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
                        onClick={() => patchElement(selected.id, { bold: !selected.bold })}
                        aria-label="Gras"
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={selected.italic ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => patchElement(selected.id, { italic: !selected.italic })}
                        aria-label="Italique"
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" onClick={() => centerElement(selected)}>
                    {selected.zone === 'spine' ? 'Centrer dans le dos' : 'Centrer horizontalement'}
                  </Button>

                  {warningFor(selected.id).map((w) => (
                    <p key={w.id} className="text-xs text-amber-600">{w.message}</p>
                  ))}

                  {selected.zone !== 'spine' && (
                    <p className="text-xs text-muted-foreground">
                      Position dans la zone : {(selected.nx * 100).toFixed(1)} % × {(selected.ny * 100).toFixed(1)} % ·
                      largeur {formatIn(elementBoxIn(selected, geometry).widthIn, 3)}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
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
