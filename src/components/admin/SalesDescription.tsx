import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const TEAL = '#008296';

const SalesDescription: React.FC = () => {
  const [title, setTitle] = useState('');
  const [niche, setNiche] = useState('');
  const [audience, setAudience] = useState('');
  const [benefits, setBenefits] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim() || !niche.trim()) return toast.error('Titre et niche requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Rédige une description Amazon KDP "vendeuse" en français, style page de vente, en 5 parties :
1. ACCROCHE forte (1-2 phrases qui captent)
2. AGITATION du problème du lecteur
3. PROMESSE / transformation apportée par le livre
4. 5 à 7 BÉNÉFICES concrets en puces (avec emoji ✓)
5. APPEL À L'ACTION clair

Livre : "${title}"
Niche : ${niche}
${audience ? `Public cible : ${audience}` : ''}
${benefits ? `Points clés à inclure : ${benefits}` : ''}

Utilise des mots de conversion (découvrez, enfin, garanti, simple, rapide…). Longueur 1500–2500 caractères. Format texte avec sauts de ligne, pas de balises HTML.`;
      const raw = await callAIWriting(prompt, { temperature: 0.75 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Génère une description Amazon en 5 parties (accroche, agitation, promesse, bénéfices, CTA) optimisée conversion.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Niche *</Label><Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Développement personnel, cuisine…" /></div>
        <div><Label className="text-xs">Public cible</Label><Input value={audience} onChange={(e) => setAudience(e.target.value)} /></div>
        <div><Label className="text-xs">Points clés</Label><Input value={benefits} onChange={(e) => setBenefits(e.target.value)} placeholder="séparés par des virgules" /></div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer la description</span>
      </Button>
      {output && (
        <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-3">
          <Textarea rows={16} value={output} onChange={(e) => setOutput(e.target.value)} className="text-xs" />
          <Button variant="outline" size="sm" className="gap-1.5"
            onClick={() => { navigator.clipboard.writeText(output); toast.success('Copié ✓'); }}>
            <Copy className="h-3.5 w-3.5" /> Copier
          </Button>
        </CardContent></Card>
      )}
    </div>
  );
};

export default SalesDescription;
