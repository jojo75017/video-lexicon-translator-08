import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const TEAL = '#008296';

const AutoPricingAI: React.FC = () => {
  const [title, setTitle] = useState('');
  const [niche, setNiche] = useState('');
  const [pages, setPages] = useState('');
  const [format, setFormat] = useState('ebook');
  const [competitors, setCompetitors] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim() || !niche.trim()) return toast.error('Titre et niche requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es expert en pricing Amazon KDP. Recommande le prix de vente optimal en euros pour ce livre, en tenant compte de la royaltie (70% entre 2,99€ et 9,99€ pour l'ebook Kindle ; coût d'impression pour le broché).
Livre : "${title}"
Niche : ${niche}
Format : ${format}
${pages ? `Nombre de pages : ${pages}` : ''}
${competitors ? `Prix de la concurrence observés : ${competitors}` : ''}

Donne :
1. PRIX RECOMMANDÉ (un chiffre précis, ex 6,99€) et pourquoi.
2. FOURCHETTE acceptable (min – max).
3. ROYALTIE estimée par vente.
4. STRATÉGIE de lancement (prix d'appel les premiers jours puis prix cible).
5. 2 conseils de pricing psychologique.
Réponds en français, concis et structuré.`;
      const raw = await callAIWriting(prompt, { temperature: 0.5 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Obtiens un prix optimal estimé par IA selon la niche, le format, la longueur et la concurrence.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Niche *</Label><Input value={niche} onChange={(e) => setNiche(e.target.value)} /></div>
        <div>
          <Label className="text-xs">Format</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ebook">Ebook Kindle</SelectItem>
              <SelectItem value="broché">Broché</SelectItem>
              <SelectItem value="grand format relié">Relié</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label className="text-xs">Pages</Label><Input type="number" value={pages} onChange={(e) => setPages(e.target.value)} /></div>
        <div className="sm:col-span-2"><Label className="text-xs">Prix concurrents</Label><Input value={competitors} onChange={(e) => setCompetitors(e.target.value)} placeholder="ex : 4,99€ ; 7,99€ ; 9,99€" /></div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Calculer le prix optimal</span>
      </Button>
      {output && (
        <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-3">
          <Textarea rows={14} value={output} onChange={(e) => setOutput(e.target.value)} className="text-xs" />
          <Button variant="outline" size="sm" className="gap-1.5"
            onClick={() => { navigator.clipboard.writeText(output); toast.success('Copié ✓'); }}>
            <Copy className="h-3.5 w-3.5" /> Copier
          </Button>
        </CardContent></Card>
      )}
    </div>
  );
};

export default AutoPricingAI;
