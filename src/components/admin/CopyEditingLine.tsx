import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy, PenLine } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const BORDEAUX = '#9B2335';

/**
 * Copy-editing & Ligne Éditoriale — passe d'édition phrase à phrase
 * (style, registre, fluidité, répétitions) dans le respect du fond et de la voix.
 */
const CopyEditingLine: React.FC = () => {
  const [register, setRegister] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!text.trim()) return toast.error('Colle le passage à éditer.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es correcteur-rédacteur (copy editor) en maison d'édition. Tu fais une passe de COPY-EDITING & LIGNE ÉDITORIALE : tu améliores le style phrase à phrase (fluidité, registre, répétitions, lourdeurs, rythme) SANS jamais changer le fond, les idées, ni la voix de l'auteur. Tu n'inventes rien et tu ne réécris pas tout : tu corriges avec retenue.

${register ? `Registre / ton à respecter : ${register}` : ''}

Passage à éditer :
"""
${text}
"""

Rends en français, dans cet ordre :

1. VERSION ÉDITÉE — le texte corrigé, propre et prêt à l'emploi (respecte la voix de l'auteur).
2. JOURNAL DES MODIFICATIONS — liste les principaux changements (répétition supprimée, phrase allégée, registre ajusté…) avec une courte justification éditoriale pour chacun.
3. RECOMMANDATIONS DE LIGNE ÉDITORIALE — 3 à 5 conseils de style transverses pour homogénéiser l'ensemble du manuscrit.

Format texte clair avec sauts de ligne, sans balises HTML.`;
      const raw = await callAIWriting(prompt, { temperature: 0.5 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70 flex items-center gap-1.5">
        <PenLine className="h-4 w-4" style={{ color: BORDEAUX }} />
        Édition de style phrase à phrase, sans toucher au fond ni à la voix de l'auteur.
      </p>
      <div><Label className="text-xs">Registre / ton à respecter (optionnel)</Label><Input value={register} onChange={(e) => setRegister(e.target.value)} placeholder="Littéraire soutenu, oral et complice, expert et sobre…" /></div>
      <div><Label className="text-xs">Passage à éditer *</Label><Textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder="Colle ici un passage (idéalement 1 à 3 pages) à faire éditer." /></div>
      <Button onClick={run} disabled={loading} style={{ background: BORDEAUX, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Éditer le passage</span>
      </Button>
      {output && (
        <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-3">
          <Textarea rows={20} value={output} onChange={(e) => setOutput(e.target.value)} className="text-xs" />
          <Button variant="outline" size="sm" className="gap-1.5"
            onClick={() => { navigator.clipboard.writeText(output); toast.success('Copié ✓'); }}>
            <Copy className="h-3.5 w-3.5" /> Copier
          </Button>
        </CardContent></Card>
      )}
    </div>
  );
};

export default CopyEditingLine;
