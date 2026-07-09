import React from 'react';
import { FileDown, FileText, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { exportCorrectedDocx, exportReportDocx } from '@/lib/bookperfect/exporters';
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

  const stat = (cat: IssueCategory) => analysis.issues.filter((i) => i.category === cat).length;

  const doExportDocx = async () => {
    try {
      toast.loading('Génération du Word corrigé…', { id: 'bp-docx' });
      await exportCorrectedDocx(manuscript, analysis, true);
      toast.success('Manuscrit corrigé exporté (.docx) ✓', { id: 'bp-docx' });
    } catch (e: any) {
      toast.error(e?.message || 'Échec de l\'export Word.', { id: 'bp-docx' });
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

          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={doExportDocx} className="gap-2">
              <FileDown className="h-4 w-4" /> Exporter le manuscrit corrigé (Word)
            </Button>
            <Button onClick={doExportReport} variant="outline" className="gap-2">
              <FileText className="h-4 w-4" /> Exporter le rapport éditorial (Word)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
