import React, { useMemo, useState } from 'react';
import { FileDown, FileText, RefreshCw, BookOpen, Star, Ruler, Hash, Rocket, Type, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  exportCorrectedDocx, exportCorrectedPdf, exportKdpPackage, exportReportDocx,
  KDP_FORMATS, KDP_FONTS, getKdpFormat, getKdpMargins, estimateKdpPageCount, runKdpFinalCheck,
  DEFAULT_KDP_OPTIONS,
} from '@/lib/bookperfect/exporters';
import type { KdpExportOptions, KdpFormatId } from '@/lib/bookperfect/exporters';
import { CATEGORY_LABELS } from '@/lib/bookperfect/types';
import type { Analysis, IssueCategory, Manuscript } from '@/lib/bookperfect/types';

interface Props {
  manuscript: Manuscript;
  analysis: Analysis;
  onRelaunchFailed: () => void;
}

export const RapportFinalTab: React.FC<Props> = ({ manuscript, analysis, onRelaunchFailed }) => {
  const failed = analysis.chapterResults.filter((r) => r.status === 'failed').length;
  const appliedCount = analysis.issues.filter((i) => i.status === 'applied').length;
  const [kdpOpen, setKdpOpen] = useState(false);
  const [options, setOptions] = useState<KdpExportOptions>(DEFAULT_KDP_OPTIONS);
  const [busy, setBusy] = useState(false);

  const stat = (cat: IssueCategory) => analysis.issues.filter((i) => i.category === cat).length;

  const check = useMemo(() => runKdpFinalCheck(manuscript, analysis), [manuscript, analysis]);
  const preview = getKdpFormat(options.formatId);

  const dxaToInch = (v: number) => v / 1440;
  const dxaToMm = (v: number) => (v / 1440) * 25.4;
  const fmtIn = (v: number) => dxaToInch(v).toLocaleString('fr-FR', { maximumFractionDigits: 2 });
  const fmtMm = (v: number) => dxaToMm(v).toLocaleString('fr-FR', { maximumFractionDigits: 0 });
  const kdpPageEstimate = estimateKdpPageCount(manuscript, options);
  const margins = getKdpMargins(options, kdpPageEstimate);

  const setOpt = <K extends keyof KdpExportOptions>(k: K, v: KdpExportOptions[K]) =>
    setOptions((o) => ({ ...o, [k]: v }));

  const doOneClick69 = async () => {
    try {
      setBusy(true);
      toast.loading('Création du pack KDP 6 × 9 (Word + PDF + fiche marges)…', { id: 'bp-kdp1' });
      await exportKdpPackage(manuscript, analysis, { ...DEFAULT_KDP_OPTIONS, formatId: '6x9' }, true);
      toast.success('Pack KDP 6 × 9 exporté : Word + PDF + fiche marges ✓', { id: 'bp-kdp1' });
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la préparation KDP.', { id: 'bp-kdp1' });
    } finally {
      setBusy(false);
    }
  };

  const doPackage = async () => {
    try {
      setBusy(true);
      toast.loading('Préparation Amazon KDP (Word + PDF + fiche marges)…', { id: 'bp-kdp' });
      await exportKdpPackage(manuscript, analysis, options, true);
      toast.success('Pack Amazon KDP exporté : Word + PDF + fiche marges ✓', { id: 'bp-kdp' });
      setKdpOpen(false);
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la préparation KDP.', { id: 'bp-kdp' });
    } finally {
      setBusy(false);
    }
  };

  const doExportOne = async (kind: 'docx' | 'pdf') => {
    try {
      setBusy(true);
      toast.loading(kind === 'docx' ? 'Génération du Word mis en page…' : 'Génération du PDF impression…', { id: 'bp-one' });
      if (kind === 'docx') await exportCorrectedDocx(manuscript, analysis, true, options);
      else await exportCorrectedPdf(manuscript, analysis, options, true);
      toast.success(kind === 'docx' ? 'Word exporté ✓' : 'PDF exporté ✓', { id: 'bp-one' });
    } catch (e: any) {
      toast.error(e?.message || 'Échec de l\'export.', { id: 'bp-one' });
    } finally {
      setBusy(false);
    }
  };

  const doExportReport = async () => {
    try {
      toast.loading('Génération du rapport…', { id: 'bp-report' });
      await exportReportDocx(manuscript, analysis);
      toast.success('Rapport éditorial exporté (.docx) ✓', { id: 'bp-report' });
    } catch (e: any) {
      toast.error(e?.message || 'Échec de l\'export du rapport.', { id: 'bp-report' });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Rapport final & export
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['traces-ia', 'orthographe', 'style', 'kdp'] as IssueCategory[]).map((cat) => (
              <div key={cat} className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold text-primary">{stat(cat)}</div>
                <div className="text-xs text-muted-foreground">{CATEGORY_LABELS[cat]}</div>
              </div>
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            {appliedCount} correction(s) validée(s) seront appliquées à l'export. Les corrections non validées
            restent signalées mais n'altèrent pas le texte. La typographie française (guillemets « », espaces
            insécables, apostrophes) est appliquée automatiquement.
          </div>

          {failed > 0 && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 flex items-center gap-3 text-sm">
              <span className="text-amber-600">⚠️ {failed} chapitre(s) n'ont pas pu être analysés par l'IA.</span>
              <Button size="sm" variant="outline" onClick={onRelaunchFailed} className="gap-1 ml-auto">
                <RefreshCw className="h-3.5 w-3.5" /> Relancer les chapitres en échec
              </Button>
            </div>
          )}

          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold">Préparer pour Amazon KDP</div>
                <div className="text-sm text-muted-foreground">
                  En un clic : format 6 × 9, marges officielles, police roman, chapitres sur nouvelle page,
                  table des matières, pagination — export <strong>Word mis en page</strong> + <strong>PDF prêt à imprimer</strong> + fiche marges.
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Button onClick={doOneClick69} className="gap-2" disabled={busy}>
                  <BookOpen className="h-4 w-4" /> 📖 Préparer pour Amazon KDP (6 × 9)
                </Button>
                <Button onClick={() => setKdpOpen(true)} variant="outline" size="sm" className="gap-2">
                  <Rocket className="h-3.5 w-3.5" /> Personnaliser…
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Button onClick={() => doExportOne('docx')} variant="outline" className="gap-2" disabled={busy}>
              <FileDown className="h-4 w-4" /> Word corrigé (6 × 9)
            </Button>
            <Button onClick={doExportReport} variant="outline" className="gap-2">
              <FileText className="h-4 w-4" /> Rapport éditorial (Word)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={kdpOpen} onOpenChange={(o) => !busy && setKdpOpen(o)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Préparer pour Amazon KDP
            </DialogTitle>
            <DialogDescription>
              Réglez la mise en page, puis obtenez en un clic le pack prêt à publier : Word + PDF + fiche marges.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Contrôle final KDP */}
            <div className={`rounded-lg border p-3 ${check.ready && check.warnings.length === 0 ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-amber-500/40 bg-amber-500/5'}`}>
              <div className="flex items-center gap-2 text-sm font-medium">
                {check.ready && check.warnings.length === 0
                  ? <><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Aucune erreur KDP détectée — prêt à publier.</>
                  : <><AlertTriangle className="h-4 w-4 text-amber-600" /> Contrôle final avant impression</>}
              </div>
              {(check.blockers.length > 0 || check.warnings.length > 0) && (
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground list-disc pl-5">
                  {check.blockers.map((b) => <li key={b} className="text-red-600">{b}</li>)}
                  {check.warnings.map((w) => <li key={w}>{w}</li>)}
                </ul>
              )}
            </div>

            {/* Format */}
            <div className="space-y-1.5">
              <Label className="text-xs">Format de page</Label>
              <div className="grid grid-cols-1 gap-2">
                {KDP_FORMATS.map((f) => {
                  const active = options.formatId === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setOpt('formatId', f.id)}
                      className={`w-full flex items-center justify-between rounded-lg border p-2.5 text-left transition-colors ${
                        active ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-sm flex items-center gap-1.5">
                          {f.label}
                          {f.recommended && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                        </div>
                        <div className="text-xs text-muted-foreground">{f.description}</div>
                      </div>
                      <span className={`text-xs font-medium ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                        {active ? 'Sélectionné' : 'Choisir'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Police + taille */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1"><Type className="h-3.5 w-3.5" /> Police (roman)</Label>
                <Select value={options.fontFamily} onValueChange={(v) => setOpt('fontFamily', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {KDP_FONTS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Taille : {options.fontSize} pt</Label>
                <div className="pt-2.5">
                  <Slider
                    min={9} max={14} step={0.5}
                    value={[options.fontSize]}
                    onValueChange={([v]) => setOpt('fontSize', v)}
                  />
                </div>
              </div>
            </div>

            {/* Options de mise en page */}
            <div className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Table des matières</Label>
                <Switch checked={options.toc} onCheckedChange={(v) => setOpt('toc', v)} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Pagination (numéros de page)</Label>
                <Switch checked={options.pageNumbers} onCheckedChange={(v) => setOpt('pageNumbers', v)} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">En-têtes (titre en haut de page)</Label>
                <Switch checked={options.headers} onCheckedChange={(v) => setOpt('headers', v)} />
              </div>
            </div>

            {/* Aperçu */}
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <div className="text-sm font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" /> Aperçu — {preview.label}
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="relative shrink-0 rounded-sm border-2 border-foreground/40 bg-background"
                  style={{ width: 72, height: 72 * (preview.height / preview.width) }}
                >
                  <div
                    className="absolute border border-dashed border-primary/60 bg-primary/5"
                    style={{
                      top: `${(margins.topTwips / preview.height) * (72 * (preview.height / preview.width))}px`,
                      right: `${(margins.outsideTwips / preview.width) * 72}px`,
                      bottom: `${(margins.bottomTwips / preview.height) * (72 * (preview.height / preview.width))}px`,
                      left: `${(margins.insideTwips / preview.width) * 72}px`,
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Taille (trim) :</span>
                    <span className="font-medium">
                      {fmtIn(preview.width)} × {fmtIn(preview.height)} po
                      <span className="text-muted-foreground"> ({fmtMm(preview.width)} × {fmtMm(preview.height)} mm)</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Marge reliure (KDP) :</span>
                    <span className="font-medium">
                      {margins.insideInches.toLocaleString('fr-FR', { maximumFractionDigits: 3 })} po (~{kdpPageEstimate} pages)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Extérieur / haut / bas :</span>
                    <span className="font-medium">{margins.outsideInches.toLocaleString('fr-FR', { maximumFractionDigits: 3 })} po</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Pagination :</span>
                    <span className="font-medium">{options.pageNumbers ? 'Numéros centrés' : 'Désactivée'}</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Marges no-bleed Amazon KDP : intérieur selon nombre de pages, extérieur/haut/bas à 0,25 po pour les formats KDP.
                Chaque chapitre démarre sur une nouvelle page. La police est conservée dans le Word ;
                le PDF utilise un rendu serif équivalent pour l'impression.
              </p>
            </div>

            <div className="space-y-2">
              <Button onClick={doPackage} disabled={busy || !check.ready} className="w-full gap-2">
                <Rocket className="h-4 w-4" /> Préparer le pack (Word + PDF) en un clic
              </Button>
              {!check.ready && (
                <p className="text-xs text-red-600 text-center">Corrigez les blocages ci-dessus avant l'export.</p>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => doExportOne('docx')} variant="outline" size="sm" className="gap-1.5" disabled={busy || !check.ready}>
                  <FileDown className="h-3.5 w-3.5" /> Word seul
                </Button>
                <Button onClick={() => doExportOne('pdf')} variant="outline" size="sm" className="gap-1.5" disabled={busy || !check.ready}>
                  <FileDown className="h-3.5 w-3.5" /> PDF seul
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
