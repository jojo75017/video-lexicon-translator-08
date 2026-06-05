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

const AmazonAdsGenerator: React.FC = () => {
  const [title, setTitle] = useState('');
  const [niche, setNiche] = useState('');
  const [audience, setAudience] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim() || !niche.trim()) return toast.error('Titre et niche requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Crée un plan de campagnes Amazon Ads (Amazon Advertising) pour un livre KDP, en français.
Livre : "${title}"
Niche : ${niche}
${audience ? `Public cible : ${audience}` : ''}
${budget ? `Budget quotidien : ${budget}` : ''}

Fournis :
1. CAMPAGNE SPONSORED PRODUCTS (Automatique) : recommandation d'enchère de départ.
2. CAMPAGNE SPONSORED PRODUCTS (Manuelle) :
   - 25 mots-clés ciblés (mix exact / phrase / large), avec enchère suggérée (€).
   - 10 mots-clés négatifs à exclure.
3. CAMPAGNE SPONSORED BRANDS : titre d'accroche (≤50 caractères) + 3 variantes.
4. Conseils d'optimisation (ACOS cible, quand ajuster les enchères).
Format texte clair avec sections, pas de HTML.`;
      const raw = await callAIWriting(prompt, { temperature: 0.6 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Génère des campagnes Sponsored Products / Brands avec mots-clés ciblés, négatifs et enchères suggérées.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Niche *</Label><Input value={niche} onChange={(e) => setNiche(e.target.value)} /></div>
        <div><Label className="text-xs">Public cible</Label><Input value={audience} onChange={(e) => setAudience(e.target.value)} /></div>
        <div><Label className="text-xs">Budget / jour</Label><Input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="10€…" /></div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer les campagnes</span>
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

export default AmazonAdsGenerator;
