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

// P26 — PRONOSTIC : Score de potentiel commercial (IA, BYOK Gemini)
const CommercialScore: React.FC = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [niche, setNiche] = useState('');
  const [hook, setHook] = useState('');
  const [coverDesc, setCoverDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim() || !niche.trim()) return toast.error('Titre et niche requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es analyste éditorial et expert du marché Amazon KDP. Évalue le potentiel commercial de ce projet de livre. Sois honnête et critique.
Titre : "${title}"
${subtitle ? `Sous-titre : ${subtitle}` : ''}
Niche : ${niche}
${hook ? `Hook / promesse : ${hook}` : ''}
${coverDesc ? `Description de la couverture : ${coverDesc}` : ''}

Note chaque critère sur 20 et donne une explication :
1. TITRE (clarté, accroche, SEO Amazon).
2. NICHE (demande vs concurrence, rentabilité).
3. HOOK / PROMESSE (force du bénéfice, différenciation).
4. COUVERTURE (lisibilité miniature, codes du genre) — d'après la description.
5. POTENTIEL DE READ-THROUGH / série.

Puis :
- SCORE GLOBAL sur 100.
- VERDICT (Go / À retravailler / Risqué) en une phrase.
- 3 AMÉLIORATIONS PRIORITAIRES concrètes.
Réponds en français, structuré.`;
      const raw = await callAIWriting(prompt, { temperature: 0.5, maxTokens: 2500 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Évalue le potentiel commercial de ton projet (titre, niche, hook, couverture) avec un score sur
        100 et des priorités d'amélioration.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Sous-titre</Label><Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></div>
        <div><Label className="text-xs">Niche *</Label><Input value={niche} onChange={(e) => setNiche(e.target.value)} /></div>
        <div><Label className="text-xs">Hook / promesse</Label><Input value={hook} onChange={(e) => setHook(e.target.value)} /></div>
        <div className="sm:col-span-2"><Label className="text-xs">Description de la couverture</Label><Textarea rows={2} value={coverDesc} onChange={(e) => setCoverDesc(e.target.value)} className="text-xs" /></div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Calculer le score</span>
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

export default CommercialScore;
