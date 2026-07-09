import React, { useCallback, useRef, useState } from 'react';
import { Upload, FileText, Loader2, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { importManuscript } from '@/lib/bookperfect/importManuscript';
import type { Manuscript } from '@/lib/bookperfect/types';

interface Props {
  onImported: (m: Manuscript) => void;
}

export const BookPerfectDashboard: React.FC<Props> = ({ onImported }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setLoading(true);
    try {
      const m = await importManuscript(file);
      toast.success(`Manuscrit importé : ${m.chapters.length} chapitres, ~${m.pageEstimate} pages.`);
      onImported(m);
    } catch (e: any) {
      toast.error(e?.message || "Impossible d'importer ce fichier.");
    } finally {
      setLoading(false);
    }
  }, [onImported]);

  return (
    <Card className="border-2 border-dashed">
      <CardContent className="p-8">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          className={`flex flex-col items-center justify-center text-center py-12 rounded-lg transition-colors ${dragOver ? 'bg-primary/5' : ''}`}
        >
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            {loading ? <Loader2 className="h-8 w-8 text-primary animate-spin" /> : <BookOpen className="h-8 w-8 text-primary" />}
          </div>
          <h2 className="text-xl font-semibold mb-1">Importez votre manuscrit</h2>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            Glissez-déposez votre roman au format <strong>.docx</strong> (Word), ou <strong>.md</strong> / <strong>.txt</strong>.
            BookPerfect AI le découpe en chapitres et l'analyse un chapitre à la fois, sans jamais modifier votre texte original.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".docx,.md,.txt"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          <Button onClick={() => inputRef.current?.click()} disabled={loading} className="gap-2">
            <Upload className="h-4 w-4" />
            {loading ? 'Import en cours…' : 'Choisir un fichier'}
          </Button>
          <div className="flex items-center gap-2 mt-6 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            Prise en charge des longs manuscrits (400+ pages) — analyse résiliente avec reprise.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
