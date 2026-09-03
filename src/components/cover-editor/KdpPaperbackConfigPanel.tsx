/**
 * Étape 4B — section « Configuration KDP » pour les projets BROCHÉS.
 *
 * Périmètre strict : configuration, calculs officiels, validation, persistance.
 * Aucun dos éditable, aucune 4ᵉ de couverture, aucun export, aucun ISBN,
 * aucun code-barres réel, aucun appel IA, aucun crédit.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Info, Loader2, TriangleAlert } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateCoverProject, type CoverProject } from '@/lib/coverProjects';
import {
  FINISH_LABEL,
  INK_LABEL,
  KDP_CUSTOM_TRIM_LIMITS,
  KDP_INK_PAPER_COMBINATIONS,
  KDP_RULES_VERSION,
  KDP_SPINE_TEXT_MIN_PAGES,
  KDP_TRIM_SIZES,
  PAPER_LABEL,
  allowedPapersFor,
  computePaperbackGeometry,
  defaultPaperbackConfig,
  findCombination,
  formatIn,
  formatMm,
  parsePaperbackConfig,
  type CoverFinish,
  type InkType,
  type KdpPaperbackConfig,
  type PaperType,
} from '@/lib/cover-editor/kdpPaperbackSpecs';

type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

const INK_OPTIONS = Array.from(new Set(KDP_INK_PAPER_COMBINATIONS.map((c) => c.ink)));

interface Props {
  project: CoverProject;
  onProjectUpdated?: (project: CoverProject) => void;
}

export default function KdpPaperbackConfigPanel({ project, onProjectUpdated }: Props) {
  const [config, setConfig] = useState<KdpPaperbackConfig>(() =>
    project.kdp_config
      ? parsePaperbackConfig(project.kdp_config, project.page_count ?? 120)
      : defaultPaperbackConfig(project.page_count ?? 120),
  );
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const timer = useRef<number | null>(null);
  const firstRender = useRef(true);

  const result = useMemo(() => computePaperbackGeometry(config), [config]);
  const geometry = result.geometry;

  const patch = useCallback((next: Partial<KdpPaperbackConfig>) => {
    setConfig((prev) => {
      const merged = { ...prev, ...next };
      // Si le papier n'est plus autorisé pour l'encre choisie, on retombe sur le blanc.
      if (next.ink && !findCombination(merged.ink, merged.paper)) merged.paper = 'white';
      return merged;
    });
    setSaveState('dirty');
  }, []);

  /** Enregistrement temporisé (pas de requête à chaque frappe). */
  const save = useCallback(async () => {
    setSaveState('saving');
    try {
      const updated = await updateCoverProject(project.id, {
        page_count: config.pageCount,
        kdp_config: { ...config, rulesVersion: KDP_RULES_VERSION },
        kdp_geometry: geometry,
        kdp_rules_version: KDP_RULES_VERSION,
      });
      onProjectUpdated?.(updated);
      setSaveState('saved');
    } catch {
      setSaveState('error');
    }
  }, [config, geometry, project.id, onProjectUpdated]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => void save(), 1200);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const trimIsCustom = config.trimId === 'custom';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-lg">Configuration KDP (livre broché)</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Règles Amazon du {KDP_RULES_VERSION.split('-').reverse().join('/')}
          </Badge>
          <SaveBadge state={saveState} />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Paramètres */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Format de coupe</Label>
            <Select value={config.trimId} onValueChange={(v) => patch({ trimId: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {KDP_TRIM_SIZES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Format personnalisé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="kdp-pages">Nombre définitif de pages</Label>
            <Input
              id="kdp-pages"
              type="number"
              min={1}
              value={config.pageCount}
              onChange={(e) => patch({ pageCount: Math.round(Number(e.target.value) || 0) })}
            />
          </div>

          {trimIsCustom && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="kdp-cw">Largeur personnalisée (pouces)</Label>
                <Input
                  id="kdp-cw"
                  type="number"
                  step="0.01"
                  value={config.customTrimWidthIn ?? ''}
                  onChange={(e) => patch({ customTrimWidthIn: Number(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">
                  De {KDP_CUSTOM_TRIM_LIMITS.minWidthIn} à {KDP_CUSTOM_TRIM_LIMITS.maxWidthIn} po
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kdp-ch">Hauteur personnalisée (pouces)</Label>
                <Input
                  id="kdp-ch"
                  type="number"
                  step="0.01"
                  value={config.customTrimHeightIn ?? ''}
                  onChange={(e) => patch({ customTrimHeightIn: Number(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">
                  De {KDP_CUSTOM_TRIM_LIMITS.minHeightIn} à {KDP_CUSTOM_TRIM_LIMITS.maxHeightIn} po
                </p>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <Label>Impression</Label>
            <Select value={config.ink} onValueChange={(v) => patch({ ink: v as InkType })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INK_OPTIONS.map((ink) => (
                  <SelectItem key={ink} value={ink}>
                    {INK_LABEL[ink]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Papier</Label>
            <Select value={config.paper} onValueChange={(v) => patch({ paper: v as PaperType })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allowedPapersFor(config.ink).map((paper) => (
                  <SelectItem key={paper} value={paper}>
                    {PAPER_LABEL[paper]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Seules les combinaisons autorisées par KDP sont proposées.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>Finition de couverture</Label>
            <Select value={config.finish} onValueChange={(v) => patch({ finish: v as CoverFinish })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matte">{FINISH_LABEL.matte}</SelectItem>
                <SelectItem value="glossy">{FINISH_LABEL.glossy}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Sens de lecture</Label>
            <Input value="Gauche vers droite" readOnly className="bg-muted" />
          </div>
        </div>

        {/* Validation */}
        {result.valid ? (
          <div className="flex items-start gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm">
            <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
            <span className="font-medium text-foreground">Configuration valide</span>
          </div>
        ) : (
          <div className="space-y-1 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <TriangleAlert className="h-4 w-4 text-destructive" /> Configuration à corriger
            </div>
            <ul className="ml-6 list-disc text-muted-foreground">
              {result.issues.map((i, idx) => (
                <li key={idx}>{i.message}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Résultats */}
        {geometry && (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric
                title="Livre fini"
                main={`${formatIn(geometry.trimWidthIn, 2)} × ${formatIn(geometry.trimHeightIn, 2)}`}
                sub={`${formatMm(geometry.trimWidthIn * 25.4)} × ${formatMm(geometry.trimHeightIn * 25.4)}`}
              />
              <Metric
                title="Largeur du dos"
                main={formatIn(geometry.spineWidthIn)}
                sub={`${formatMm(geometry.mm.spineWidth)} · ${geometry.px300.spineWidth} px @ 300 DPI`}
              />
              <Metric
                title="Fichier complet"
                main={`${formatIn(geometry.fullWidthIn)} × ${formatIn(geometry.fullHeightIn)}`}
                sub={`${formatMm(geometry.mm.fullWidth)} × ${formatMm(geometry.mm.fullHeight)} · ${geometry.px300.fullWidth} × ${geometry.px300.fullHeight} px @ 300 DPI`}
              />
            </div>

            {/* Schéma non éditable : quatrième | dos | première */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Schéma du fichier complet (non éditable)
              </p>
              <div
                className="relative w-full overflow-hidden rounded-lg border-2 border-dashed border-destructive/50 bg-muted"
                style={{ aspectRatio: `${geometry.fullWidthIn} / ${geometry.fullHeightIn}` }}
              >
                <div className="absolute inset-y-0 flex" style={{ left: 0, right: 0 }}>
                  <div style={{ width: `${(geometry.bleedIn / geometry.fullWidthIn) * 100}%` }} />
                  <div
                    className="flex items-center justify-center border-x border-border bg-background/60 text-[10px] font-medium"
                    style={{ width: `${(geometry.zones.back.widthIn / geometry.fullWidthIn) * 100}%` }}
                  >
                    QUATRIÈME
                  </div>
                  <div
                    className="flex items-center justify-center bg-amber-500/25 text-[9px] font-semibold"
                    style={{
                      width: `${(geometry.zones.spine.widthIn / geometry.fullWidthIn) * 100}%`,
                    }}
                  >
                    DOS
                  </div>
                  <div
                    className="flex items-center justify-center border-x border-border bg-background/60 text-[10px] font-medium"
                    style={{
                      width: `${(geometry.zones.front.widthIn / geometry.fullWidthIn) * 100}%`,
                    }}
                  >
                    PREMIÈRE
                  </div>
                </div>
                {/* Réserve du code-barres sur la quatrième */}
                <div
                  className="absolute rounded border border-foreground/40 bg-foreground/10 text-[8px] leading-tight flex items-center justify-center text-center"
                  style={{
                    left: `${(geometry.barcodeZone.xIn / geometry.fullWidthIn) * 100}%`,
                    top: `${(geometry.barcodeZone.yIn / geometry.fullHeightIn) * 100}%`,
                    width: `${(geometry.barcodeZone.widthIn / geometry.fullWidthIn) * 100}%`,
                    height: `${(geometry.barcodeZone.heightIn / geometry.fullHeightIn) * 100}%`,
                  }}
                >
                  Réserve code-barres
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Contour rouge = fond perdu de {formatIn(geometry.bleedIn, 3)} sur chaque bord
                extérieur. Zone de sécurité conseillée : {formatIn(geometry.safetyMarginIn, 2)} à
                l’intérieur des bords. Réserve code-barres :{' '}
                {formatIn(geometry.barcodeZone.widthIn, 2)} ×{' '}
                {formatIn(geometry.barcodeZone.heightIn, 2)} en bas de la quatrième.
              </p>
            </div>

            {/* Règle du texte sur le dos */}
            <div
              className={
                geometry.spineTextAllowed
                  ? 'flex items-start gap-2 rounded-lg border border-border bg-muted/50 p-3 text-sm'
                  : 'flex items-start gap-2 rounded-lg border border-amber-500/50 bg-amber-500/10 p-3 text-sm'
              }
            >
              <Info className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {geometry.spineTextAllowed
                  ? `Texte sur le dos autorisé (à partir de ${KDP_SPINE_TEXT_MIN_PAGES} pages), sous réserve de respecter la zone de sécurité du dos.`
                  : `Texte sur le dos désactivé : en dessous de ${KDP_SPINE_TEXT_MIN_PAGES} pages, KDP risque de refuser un texte sur un dos trop étroit. Le calcul du dos reste effectué (${formatIn(geometry.spineWidthIn)}).`}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Metric({ title, main, sub }: { title: string; main: string; sub: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{title}</p>
      <p className="text-base font-semibold text-foreground">{main}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function SaveBadge({ state }: { state: SaveState }) {
  if (state === 'saving')
    return (
      <Badge variant="secondary" className="gap-1 text-xs">
        <Loader2 className="h-3 w-3 animate-spin" /> Enregistrement…
      </Badge>
    );
  if (state === 'saved')
    return (
      <Badge className="gap-1 bg-emerald-600 text-xs text-white hover:bg-emerald-600">
        <Check className="h-3 w-3" /> Enregistré
      </Badge>
    );
  if (state === 'dirty')
    return (
      <Badge variant="outline" className="text-xs">
        Modification en cours
      </Badge>
    );
  if (state === 'error')
    return (
      <Badge variant="destructive" className="gap-1 text-xs">
        <TriangleAlert className="h-3 w-3" /> Erreur d’enregistrement
      </Badge>
    );
  return null;
}
