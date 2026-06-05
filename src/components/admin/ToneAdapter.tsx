import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const TEAL = '#008296';

const TARGETS: Record<string, string> = {
  ados: 'adolescents (13-17 ans) : vocabulaire actuel, phrases courtes, dynamique, sans être infantilisant',
  jeunes: 'jeunes adultes (18-30 ans) : ton vivant, références contemporaines, rythme soutenu',
  grandpublic: 'grand public adulte : clair, accessible, fluide, ni trop simple ni trop technique',
  pro: 'professionnels / experts : précis, structuré, vocabulaire spécialisé, crédible',
  enfants: 'enfants (6-10 ans) : phrases très simples, mots concrets, ton chaleureux et imagé',
  senior: 'seniors : clair, rythme posé, vocabulaire riche mais accessible, exemples parlants',
};

// P25 — CAMÉLÉON : Adaptation de ton par public (IA, BYOK Gemini)
const ToneAdapter: React.FC = () => {
  const [text, setText] = useState('');
  const [target, setTarget] = useState('grandpublic');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!text.trim()) return toast.error('Colle le passage à adapter.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es un écrivain caméléon capable d'adapter un ton à n'importe quel public. Réécris le passage suivant pour le public cible, en gardant le sens et les informations, mais en ajustant vocabulaire, longueur de phrases, rythme et registre.
Public cible : ${TARGETS[target]}

Passage original :
"""${text.slice(0, 8000)}"""

Donne :
1. VERSION ADAPTÉE (texte complet réécrit).
2. NOTE D'ADAPTATION : 3-4 changements clés que tu as opérés et pourquoi.
Réponds en français.`;
      const raw = await callAIWriting(prompt, { temperature: 0.7, maxTokens: 3000 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Réécrit un passage en adaptant le ton et le vocabulaire au public visé, tout en conservant le
        sens.
      </p>
      <div className="grid gap-3">
        <div>
          <Label className="text-xs">Public cible</Label>
          <Select value={target} onValueChange={setTarget}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="enfants">Enfants (6-10 ans)</SelectItem>
              <SelectItem value="ados">Adolescents (13-17 ans)</SelectItem>
              <SelectItem value="jeunes">Jeunes adultes (18-30 ans)</SelectItem>
              <SelectItem value="grandpublic">Grand public adulte</SelectItem>
              <SelectItem value="pro">Professionnels / experts</SelectItem>
              <SelectItem value="senior">Seniors</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label className="text-xs">Passage à adapter</Label><Textarea rows={9} value={text} onChange={(e) => setText(e.target.value)} className="text-xs" /></div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Adapter le ton</span>
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

export default ToneAdapter;
