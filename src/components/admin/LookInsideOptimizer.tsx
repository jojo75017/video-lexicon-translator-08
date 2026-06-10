import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const TEAL = '#008296';

/**
 * Optimiseur « Look Inside » (Regard à l'intérieur Amazon).
 * Analyse / propose l'ordre des premières pages pour maximiser la conversion
 * avant le seuil de prévisualisation (~10% du livre).
 */
const LookInsideOptimizer: React.FC = () => {
  const [title, setTitle] = useState('');
  const [niche, setNiche] = useState('');
  const [format, setFormat] = useState<'ebook' | 'broche'>('ebook');
  const [opening, setOpening] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim() || !niche.trim()) return toast.error('Titre et niche requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es expert en conversion Amazon KDP. Optimise l'aperçu « Regard à l'intérieur » (Look Inside) d'un livre pour maximiser le taux d'achat.

Le « Look Inside » affiche environ les 10 premiers % du livre. L'objectif : accrocher le lecteur AVANT le seuil de prévisualisation pour qu'il achète.

Livre : "${title}"
Niche : ${niche}
Format : ${format === 'ebook' ? 'Ebook Kindle' : 'Livre broché'}
${opening ? `Ouverture actuelle envisagée : ${opening}` : ''}

Donne, en français, une réponse structurée :

1. ORDRE OPTIMAL DES PAGES (liste numérotée) — quoi mettre, dans quel ordre, sur les premières pages visibles (couverture, page de titre, TOC, dédicace, intro/préface, chapitre 1…). Précise ce qui DOIT apparaître AVANT le seuil ~10% et ce qu'il faut repousser après.
2. ACCROCHE D'OUVERTURE — propose 2 ouvertures de chapitre 1 (1er paragraphe) percutantes qui donnent envie de lire la suite.
3. ERREURS À ÉVITER — ce qui gaspille l'espace d'aperçu (longues mentions légales, TOC interminable, remerciements en début…).
4. CHECKLIST FINALE — 5 points à vérifier.

Format texte clair avec sauts de ligne, sans balises HTML.`;
      const raw = await callAIWriting(prompt, { temperature: 0.7 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70 flex items-center gap-1.5">
        <Eye className="h-4 w-4" style={{ color: TEAL }} />
        Optimise les premières pages de l'aperçu Amazon pour convertir avant le seuil de prévisualisation.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Niche *</Label><Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Développement personnel, thriller…" /></div>
        <div>
          <Label className="text-xs">Format</Label>
          <select value={format} onChange={(e) => setFormat(e.target.value as 'ebook' | 'broche')}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="ebook">Ebook Kindle</option>
            <option value="broche">Livre broché</option>
          </select>
        </div>
        <div><Label className="text-xs">Ouverture envisagée</Label><Input value={opening} onChange={(e) => setOpening(e.target.value)} placeholder="optionnel" /></div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Optimiser le Look Inside</span>
      </Button>
      {output && (
        <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-3">
          <Textarea rows={18} value={output} onChange={(e) => setOutput(e.target.value)} className="text-xs" />
          <Button variant="outline" size="sm" className="gap-1.5"
            onClick={() => { navigator.clipboard.writeText(output); toast.success('Copié ✓'); }}>
            <Copy className="h-3.5 w-3.5" /> Copier
          </Button>
        </CardContent></Card>
      )}
    </div>
  );
};

export default LookInsideOptimizer;
