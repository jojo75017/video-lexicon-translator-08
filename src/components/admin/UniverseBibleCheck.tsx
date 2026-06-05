import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const TEAL = '#008296';

// P23 — BIBLE : Cohérence Univers (IA, BYOK Gemini)
const UniverseBibleCheck: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!text.trim()) return toast.error('Colle le contenu à vérifier.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es éditeur spécialisé en cohérence d'univers (continuity editor). Analyse le texte (un ou plusieurs chapitres / tomes) et détecte les incohérences de l'univers.
Texte :
"""${text.slice(0, 12000)}"""

Produis une "bible" de cohérence :
1. PERSONNAGES : noms, orthographes variables, traits physiques contradictoires, relations.
2. LIEUX : noms et descriptions incohérents.
3. TIMELINE : incohérences temporelles, âges, ordre des événements.
4. OBJETS / RÈGLES DE L'UNIVERS : magie, technologie, règles non respectées.
5. INCOHÉRENCES DÉTECTÉES : liste précise (cite le passage), avec correction suggérée.
6. FICHE BIBLE récapitulative à conserver pour les prochains tomes.
Réponds en français, structuré.`;
      const raw = await callAIWriting(prompt, { temperature: 0.4, maxTokens: 3000 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Vérifie la continuité des noms, lieux, timeline et règles de l'univers sur un ou plusieurs
        chapitres, et génère une fiche "bible" à réutiliser pour les tomes suivants.
      </p>
      <div><Label className="text-xs">Contenu (chapitres / tomes)</Label><Textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} className="text-xs" /></div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Vérifier la cohérence</span>
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

export default UniverseBibleCheck;
