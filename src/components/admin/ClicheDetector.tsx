import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const TEAL = '#008296';

// P24 — Détecteur de clichés & répétitions (IA, BYOK Gemini)
const ClicheDetector: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!text.trim()) return toast.error('Colle le texte à analyser.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es relecteur stylistique exigeant. Analyse ce texte et repère les faiblesses d'écriture.
Texte :
"""${text.slice(0, 10000)}"""

Produis :
1. CLICHÉS & FORMULES TOUTES FAITES : liste-les avec une reformulation plus originale.
2. RÉPÉTITIONS : mots/expressions revenant trop souvent (donne le nombre approximatif et des synonymes).
3. TICS D'ÉCRITURE : adverbes en -ment excessifs, "il/elle" en début de phrase, verbes faibles (être/avoir/faire), filtres ("il vit que", "elle sentit que").
4. PHRASES À RALLONGE à scinder.
5. SCORE DE FRAÎCHEUR (sur 100) + 3 priorités d'amélioration.
Réponds en français, concret, avec exemples cités du texte.`;
      const raw = await callAIWriting(prompt, { temperature: 0.5, maxTokens: 2800 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Repère les clichés, répétitions et tics d'écriture d'un passage, avec reformulations et un score
        de fraîcheur stylistique.
      </p>
      <div><Label className="text-xs">Texte à analyser</Label><Textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} className="text-xs" /></div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Analyser le style</span>
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

export default ClicheDetector;
