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

// Détecteur de niches rentables KU — estimation IA (BYOK Gemini)
const KuNicheDetector: React.FC = () => {
  const [niche, setNiche] = useState('');
  const [audience, setAudience] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!niche.trim()) return toast.error('Indique une niche à analyser.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es analyste du marché Kindle Unlimited (KU) sur Amazon. Évalue le potentiel de pages lues (KENP) de la niche suivante.
Niche : ${niche}
${audience ? `Public cible : ${audience}` : ''}

Donne une analyse structurée, basée sur ta connaissance du marché (pas de chiffres inventés présentés comme exacts — formule des estimations qualitatives + ordres de grandeur) :
1. POTENTIEL KU (Faible / Moyen / Élevé) + justification (lectrices/lecteurs gros consommateurs ? format série ?).
2. DEMANDE estimée (volume de recherche, saisonnalité).
3. CONCURRENCE (saturation, force des best-sellers, barrières à l'entrée).
4. LONGUEUR IDÉALE du livre pour maximiser les KENP.
5. 3 SOUS-NICHES plus faciles à pénétrer.
6. VERDICT : faut-il inscrire ce livre en KDP Select / KU ? Pourquoi.
Réponds en français, concis et actionnable.`;
      const raw = await callAIWriting(prompt, { temperature: 0.5 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Estime le potentiel de pages lues (KENP) d'une niche en KDP Select / Kindle Unlimited, croisant
        demande et concurrence, pour décider d'inscrire ou non ton livre.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Niche *</Label><Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="ex : romance fantasy young adult" /></div>
        <div><Label className="text-xs">Public cible</Label><Input value={audience} onChange={(e) => setAudience(e.target.value)} /></div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Analyser le potentiel KU</span>
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

export default KuNicheDetector;
