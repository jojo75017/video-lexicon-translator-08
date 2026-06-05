import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, FileDown, FileText, FileType2 } from 'lucide-react';
import { toast } from 'sonner';
import { exportEbookToPdf } from '@/lib/ebookPdfExporter';
import { exportEbookToDocx } from '@/lib/ebookDocxExporter';
import { parseManuscript, countWords } from '@/lib/manuscriptParser';

const TEAL = '#008296';

/**
 * Multi-format Express — exporte le manuscrit collé en PDF (KDP) et DOCX en un clic.
 */
const MultiFormatExport: React.FC = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [manuscript, setManuscript] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  const words = countWords(manuscript);
  const sections = parseManuscript(manuscript, title || 'Contenu');

  const slug = (title || 'mon-livre')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-').replace(/(^-|-$)/g, '').toLowerCase() || 'mon-livre';

  const exportPdf = async () => {
    if (!title.trim()) return toast.error('Indique un titre.');
    if (sections.length === 0) return toast.error('Colle ton manuscrit.');
    setBusy('pdf');
    try {
      await exportEbookToPdf({
        filename: `${slug}.pdf`,
        documentTitle: title,
        documentSubtitle: subtitle || undefined,
        sections: sections.map((s) => ({ title: s.title, blocks: s.blocks })),
      });
      toast.success('PDF généré ✓');
    } catch (e: any) {
      toast.error(e?.message || 'Échec export PDF');
    } finally { setBusy(null); }
  };

  const exportDocx = async () => {
    if (!title.trim()) return toast.error('Indique un titre.');
    if (sections.length === 0) return toast.error('Colle ton manuscrit.');
    setBusy('docx');
    try {
      await exportEbookToDocx({
        filename: `${slug}.docx`,
        documentTitle: title,
        documentSubtitle: subtitle || undefined,
        sections: sections.map((s) => ({ title: s.title, blocks: s.blocks })),
      });
      toast.success('DOCX généré ✓');
    } catch (e: any) {
      toast.error(e?.message || 'Échec export DOCX');
    } finally { setBusy(null); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Colle ton manuscrit (titres en <code>#</code>, <code>##</code> ou « Chapitre X ») puis exporte
        en PDF prêt pour KDP et en DOCX éditable, en un clic.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-xs">Titre du livre</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mon livre" />
        </div>
        <div>
          <Label className="text-xs">Sous-titre (optionnel)</Label>
          <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Sous-titre" />
        </div>
      </div>

      <div>
        <Label className="text-xs">Manuscrit</Label>
        <Textarea
          rows={10}
          value={manuscript}
          onChange={(e) => setManuscript(e.target.value)}
          placeholder={'# Chapitre 1\nTexte du premier chapitre…\n\n# Chapitre 2\nTexte du deuxième chapitre…'}
        />
        <div className="mt-1 text-[11px] text-joy-ink/50">
          {words.toLocaleString('fr-FR')} mots · {sections.length} section(s) détectée(s) · ≈ {Math.max(1, Math.round(words / 250))} pages
        </div>
      </div>

      <Card className="border-joy-ink/10">
        <CardContent className="flex flex-wrap gap-3 p-4">
          <Button onClick={exportPdf} disabled={!!busy} style={{ background: TEAL, color: 'white' }}>
            {busy === 'pdf' ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            <span className="ml-1.5">Exporter PDF (KDP)</span>
          </Button>
          <Button onClick={exportDocx} disabled={!!busy} variant="outline">
            {busy === 'docx' ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileType2 className="h-4 w-4" />}
            <span className="ml-1.5">Exporter DOCX</span>
          </Button>
          <div className="ml-auto flex items-center gap-1.5 text-[11px] text-joy-ink/50">
            <FileDown className="h-3.5 w-3.5" /> Téléchargement immédiat
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiFormatExport;
