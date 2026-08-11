import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle2, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { BookChapter, BibleContent, MasterSheetDraft } from '@/types/studioPro';
import { exportProfessionalDocx, type DocxChapter } from '@/utils/docxExportEngine';
import { exportEbookToPdf, type PdfSection } from '@/lib/ebookPdfExporter';

interface Props {
  sheet: MasterSheetDraft;
  bible: BibleContent | null;
  chapters: BookChapter[];
  contents: Record<string, string>;
}

const countWords = (t: string) => t.split(/\s+/).filter(Boolean).length;

/** Découpe le texte en paragraphes propres pour l'export PDF. */
const toParagraphs = (text: string) =>
  text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+\n/g, ' ').trim())
    .filter(Boolean);

/**
 * Export du livre écrit dans le Studio Pro (Word KDP + PDF).
 * Branche les tables Studio Pro sur les moteurs d'export existants :
 * un abonné ne peut plus rédiger un livre sans pouvoir le télécharger.
 */
const StudioProExport: React.FC<Props> = ({ sheet, bible, chapters, contents }) => {
  const [busy, setBusy] = useState<'docx' | 'pdf' | null>(null);

  const sorted = useMemo(() => [...chapters].sort((a, b) => a.position - b.position), [chapters]);
  const ready = sorted.filter((c) => (contents[c.id] || '').trim().length > 200);
  const missing = sorted.filter((c) => !((contents[c.id] || '').trim().length > 200));
  const totalWords = ready.reduce((sum, c) => sum + countWords(contents[c.id] || ''), 0);

  const title = sheet.title || 'Mon livre';

  const docxChapters: DocxChapter[] = ready.map((c) => ({
    title: c.title || `Chapitre ${c.position}`,
    content: (contents[c.id] || '').trim(),
    subChapters: [],
  }));

  const handleDocx = async () => {
    setBusy('docx');
    try {
      await exportProfessionalDocx({
        title,
        preface: bible?.synopsis || undefined,
        chapters: docxChapters,
        includeTableOfContents: true,
        styledToc: true,
        includeCoverPage: true,
        includePageNumbers: true,
        includeCopyrightPage: true,
        pageFormat: '6x9',
        expectedChapterCount: docxChapters.length,
      });
      toast.success('Word (prêt KDP) téléchargé');
    } catch (e: any) {
      console.error('[StudioPro] export docx', e);
      toast.error(e?.message || "L'export Word a échoué");
    } finally {
      setBusy(null);
    }
  };

  const handlePdf = async () => {
    setBusy('pdf');
    try {
      const sections: PdfSection[] = ready.map((c) => ({
        title: c.title || `Chapitre ${c.position}`,
        blocks: toParagraphs(contents[c.id] || '').map((text) => ({ kind: 'paragraph' as const, text })),
      }));
      await exportEbookToPdf({
        filename: `${title.replace(/[^\w\sÀ-ÿ-]/g, '').trim().replace(/\s+/g, '_') || 'livre'}.pdf`,
        documentTitle: title,
        documentSubtitle: sheet.subtitle || undefined,
        sections,
      });
      toast.success('PDF téléchargé');
    } catch (e: any) {
      console.error('[StudioPro] export pdf', e);
      toast.error(e?.message || "L'export PDF a échoué");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex flex-wrap items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Export du livre
            <Badge variant="outline">
              {ready.length}/{sorted.length} chapitres · {totalWords.toLocaleString('fr-FR')} mots
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sorted.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Validez la Bible puis rédigez au moins un chapitre pour activer l’export.
            </p>
          ) : (
            <>
              {missing.length > 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <span className="font-medium">
                      {missing.length} chapitre{missing.length > 1 ? 's' : ''} encore vide
                      {missing.length > 1 ? 's' : ''}
                    </span>{' '}
                    — ils seront simplement absents du document :{' '}
                    {missing.map((c) => `ch. ${c.position}`).join(', ')}.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Livre complet : tous les chapitres contiennent du texte, l’export est prêt pour KDP.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleDocx} disabled={!!busy || ready.length === 0}>
                  {busy === 'docx' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                  Télécharger en Word (prêt KDP)
                </Button>
                <Button variant="outline" onClick={handlePdf} disabled={!!busy || ready.length === 0}>
                  {busy === 'pdf' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                  Télécharger en PDF
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Sommaire stylé, page de titre et pagination inclus. Les chapitres sont exportés dans
                l’ordre du plan validé.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudioProExport;
