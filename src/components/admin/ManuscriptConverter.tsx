import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';

const TEAL = '#008296';

/**
 * Convertisseur Manuscrit Universel.
 * Importe un texte (collé ou via .txt/.md/.docx en texte brut) et le nettoie
 * vers un format KDP propre : suppression des doubles espaces, normalisation
 * des sauts de ligne, suppression des numéros de page parasites et des artefacts.
 */
const cleanManuscript = (raw: string): string => {
  let t = raw.replace(/\r\n/g, '\n');
  // Lignes contenant uniquement un numéro de page (parasite d'export PDF)
  t = t.replace(/^\s*\d{1,4}\s*$/gm, '');
  // En-têtes/pieds de page répétés type "Page X sur Y"
  t = t.replace(/^\s*Page\s+\d+\s*(sur|\/)\s*\d+\s*$/gim, '');
  // Espaces multiples
  t = t.replace(/[ \t]{2,}/g, ' ');
  // Espaces avant ponctuation française -> espace insécable
  t = t.replace(/ ([;:!?])/g, '\u00A0$1');
  // Tirets de césure en fin de ligne
  t = t.replace(/(\w)-\n(\w)/g, '$1$2');
  // Plus de 2 sauts de ligne consécutifs -> 2
  t = t.replace(/\n{3,}/g, '\n\n');
  // Espaces en début/fin de ligne
  t = t.split('\n').map((l) => l.trimEnd()).join('\n');
  return t.trim();
};

const ManuscriptConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    setInput(text);
    toast.success('Fichier importé — colle/édite puis nettoie.');
  };

  const run = () => {
    if (!input.trim()) return toast.error('Importe ou colle un manuscrit.');
    setLoading(true);
    try {
      setOutput(cleanManuscript(input));
      toast.success('Manuscrit nettoyé ✓');
    } finally { setLoading(false); }
  };

  const download = () => {
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'manuscrit-kdp.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Importe ton manuscrit (.txt / .md, ou colle le texte d'un .docx/PDF) et obtiens une version
        nettoyée prête pour la mise en page KDP : sauts de page parasites, doubles espaces, césures et
        ponctuation française corrigés.
      </p>
      <div className="flex items-center gap-2">
        <input id="mc-file" type="file" accept=".txt,.md,.markdown" className="hidden" onChange={onFile} />
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => document.getElementById('mc-file')?.click()}>
          <Upload className="h-3.5 w-3.5" /> Importer un fichier
        </Button>
      </div>
      <div>
        <Label className="text-xs">Manuscrit source</Label>
        <Textarea rows={10} value={input} onChange={(e) => setInput(e.target.value)} className="text-xs" placeholder="Colle ton texte ici…" />
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        <span className="ml-1.5">Nettoyer pour KDP</span>
      </Button>
      {output && (
        <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-3">
          <Textarea rows={14} value={output} onChange={(e) => setOutput(e.target.value)} className="text-xs" />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5"
              onClick={() => { navigator.clipboard.writeText(output); toast.success('Copié ✓'); }}>
              <Copy className="h-3.5 w-3.5" /> Copier
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={download}>
              <Download className="h-3.5 w-3.5" /> Télécharger .txt
            </Button>
          </div>
        </CardContent></Card>
      )}
    </div>
  );
};

export default ManuscriptConverter;
