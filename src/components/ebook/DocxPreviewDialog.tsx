import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { saveAs } from 'file-saver';
import { Loader2, Download, FileText, AlertTriangle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { generateProfessionalDocx, getDocxOutline, validateDocxChapters, isGenericTitle, type DocxExportOptions, type DocxValidationResult } from '@/utils/docxExportEngine';
import { supabase } from '@/integrations/supabase/client';
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
  const [audit, setAudit] = useState<DocxValidationResult | null>(null);
  /** Titres générés par l'IA pour les chapitres sans titre (numéro → titre). */
  const [titleOverrides, setTitleOverrides] = useState<Record<number, string>>({});
  const [naming, setNaming] = useState(false);

  /** Options d'export enrichies des titres générés. */
  const resolveOptions = useCallback((): DocxExportOptions => {
    const options = getOptions();
    if (!Object.keys(titleOverrides).length) return options;
    return {
      ...options,
      chapters: (options.chapters || []).map((chapter, index) => {
        const override = titleOverrides[index + 1];
        return override ? { ...chapter, title: override } : chapter;
      }),
    };
  }, [getOptions, titleOverrides]);

  const missingTitles = useMemo(
    () => (audit?.chapters || []).filter((c) => isGenericTitle(c.title)).map((c) => c.number),
    [audit],
  );

  const handleGenerateTitles = async () => {
    const options = resolveOptions();
    const chapters = options.chapters || [];
    const payload = chapters
      .map((chapter, index) => ({ number: index + 1, chapter }))
      .filter(({ number }) => missingTitles.includes(number))
      .map(({ number, chapter }) => ({ number, excerpt: (chapter.content || '').slice(0, 900) }))
      .filter((c) => c.excerpt.trim().length > 50);

    if (!payload.length) {
      toast.info('Aucun chapitre à nommer.');
      return;
    }

    setNaming(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('v3-generate-chapter-titles', {
        body: { bookTitle: options.title, chapters: payload },
      });
      if (fnError) throw fnError;
      const titles: { number: number; title: string }[] = data?.titles || [];
      if (!titles.length) throw new Error("L'IA n'a renvoyé aucun titre");
      setTitleOverrides((prev) => {
        const next = { ...prev };
        titles.forEach((t) => {
          if (t?.title) next[t.number] = t.title;
        });
        return next;
      });
      toast.success(`${titles.length} titre(s) de chapitre généré(s)`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Génération des titres impossible');
    } finally {
      setNaming(false);
    }
  };


  useEffect(() => {
    if (!open) {
      setBlob(null);
      setError(null);
      setToc([]);
      setAudit(null);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const options = getOptions();
        const validation = validateDocxChapters(options.chapters || []);
        setAudit(validation);
        setToc(getDocxOutline(options.chapters || []).flatMap((entry) => [
          entry.title,
          ...entry.subChapters.map((sub) => `${sub.number}  ${sub.title}`),
        ]));
        // L'aperçu doit rester consultable même si l'audit trouve des défauts.
        // Le téléchargement final, lui, reste bloqué tant que le manuscrit n'est pas valide.
        const generated = await generateProfessionalDocx(options, true);
        if (cancelled) return;

        setBlob(generated);
        const safeName = (options.title || 'Mon-Ebook')
          .replace(/[^a-zA-Z0-9àâäéèêëïîôöùûüçÀ-ÿ\s-]/gi, '')
          .trim()
          .replace(/\s+/g, '_');
        setFileName(`${safeName || 'Mon-Ebook'}_KDP.docx`);

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
              <span className="text-sm font-medium">Contrôle des chapitres</span>
              <Badge variant={audit?.valid ? 'secondary' : 'destructive'}>
                {audit ? `${audit.readyCount}/${audit.totalCount} prêts` : toc.length}
              </Badge>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="p-3 space-y-2 text-xs">
                {audit?.chapters.map((chapter) => (
                  <div key={chapter.number} className={`rounded-md border p-2 ${chapter.valid ? 'border-border' : 'border-destructive/40 bg-destructive/5'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <strong className="leading-snug">{chapter.number}. {chapter.title}</strong>
                      <span className="whitespace-nowrap text-muted-foreground">{chapter.wordCount} mots</span>
                    </div>
                    {!chapter.valid && <p className="mt-1 text-destructive">{chapter.issues.join(' · ')}</p>}
                  </div>
                ))}
                {!audit?.chapters.length && !loading && <p className="text-muted-foreground">Aucun chapitre détecté.</p>}
              </div>
            </div>
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
            {!loading && !error && audit && !audit.valid && (
              <div className="sticky top-0 z-10 border-b border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-700">
                Chapitres signalés à compléter — le téléchargement reste disponible (mention « [Contenu à rédiger] »).
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
