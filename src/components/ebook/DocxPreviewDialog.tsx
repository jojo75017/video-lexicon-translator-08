import { useEffect, useRef, useState } from 'react';
import { saveAs } from 'file-saver';
import { Loader2, Download, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { generateProfessionalDocx, type DocxExportOptions } from '@/utils/docxExportEngine';
import { toast } from 'sonner';

interface DocxPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Options d'export : évaluées à l'ouverture du dialogue. */
  getOptions: () => DocxExportOptions;
}

/**
 * Aperçu fidèle du DOCX (pages, marges, sommaire) avant téléchargement.
 * Le rendu utilise le même fichier que celui qui sera téléchargé.
 */
export function DocxPreviewDialog({ open, onOpenChange, getOptions }: DocxPreviewDialogProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState('Mon-Ebook_KDP.docx');
  const [error, setError] = useState<string | null>(null);
  const [toc, setToc] = useState<string[]>([]);

  useEffect(() => {
    if (!open) {
      setBlob(null);
      setError(null);
      setToc([]);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const options = getOptions();
        const generated = await generateProfessionalDocx(options);
        if (cancelled) return;

        setBlob(generated);
        const safeName = (options.title || 'Mon-Ebook')
          .replace(/[^a-zA-Z0-9àâäéèêëïîôöùûüçÀ-ÿ\s-]/gi, '')
          .trim()
          .replace(/\s+/g, '_');
        setFileName(`${safeName || 'Mon-Ebook'}_KDP.docx`);

        setToc(
          (options.chapters || []).map((ch, i) => {
            const t = (ch.title || '').trim();
            return t && !/^chapitre\s*\d+$/i.test(t) ? `Chapitre ${i + 1} – ${t}` : `Chapitre ${i + 1}`;
          })
        );

        const { renderAsync } = await import('docx-preview');
        // Laisse le temps au conteneur d'être monté
        await new Promise((r) => setTimeout(r, 0));
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = '';
        await renderAsync(generated, containerRef.current, undefined, {
          className: 'docx-preview',
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          breakPages: true,
          experimental: true,
          useBase64URL: true,
        });
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Impossible de générer l'aperçu");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, getOptions]);

  const handleDownload = () => {
    if (!blob) return;
    saveAs(blob, fileName);
    toast.success('Fichier DOCX téléchargé');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Aperçu avant téléchargement
          </DialogTitle>
          <DialogDescription>
            Vérifiez le sommaire, la numérotation des chapitres et le cadrage des pages. C'est exactement le fichier
            qui sera téléchargé.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[260px_1fr]">
          {/* Sommaire de contrôle */}
          <div className="border-r hidden lg:flex flex-col min-h-0">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <span className="text-sm font-medium">Sommaire détecté</span>
              <Badge variant="secondary">{toc.length}</Badge>
            </div>
            <ScrollArea className="flex-1">
              <ul className="p-4 space-y-2 text-xs text-muted-foreground">
                {toc.map((line, i) => (
                  <li key={i} className="leading-snug">
                    {line}
                  </li>
                ))}
                {!toc.length && !loading && <li>Aucun chapitre détecté.</li>}
              </ul>
            </ScrollArea>
          </div>

          {/* Rendu du document */}
          <div className="min-h-0 overflow-auto bg-muted/40">
            {loading && (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm">Génération de l'aperçu…</span>
              </div>
            )}
            {error && (
              <div className="h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            <div ref={containerRef} className={`flex justify-center py-6 ${loading || error ? 'hidden' : ''}`} />
          </div>
        </div>

        <div className="p-4 border-t flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <Button onClick={handleDownload} disabled={!blob || loading} className="gap-2">
            <Download className="h-4 w-4" />
            Télécharger le DOCX
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DocxPreviewDialog;
