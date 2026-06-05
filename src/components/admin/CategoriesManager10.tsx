import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Copy, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const TEAL = '#008296';

interface CatResult {
  large?: { path: string; reason: string };
  specific?: { path: string; reason: string };
  extras?: string[];
}

const CategoriesManager10: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CatResult | null>(null);

  const run = async () => {
    if (!topic.trim()) return toast.error('Décris le sujet du livre.');
    setLoading(true); setResult(null);
    try {
      const prompt = `Tu es un expert Amazon KDP. Pour un livre sur "${topic}"${audience ? ` (public : ${audience})` : ''}, propose la stratégie de catégorisation KDP optimale.
Réponds UNIQUEMENT en JSON valide :
{
  "large": { "path": "Chemin > Catégorie > Large", "reason": "pourquoi" },
  "specific": { "path": "Chemin > Catégorie > Spécifique", "reason": "pourquoi" },
  "extras": ["8 catégories supplémentaires pertinentes à demander au support KDP, sous forme de chemins complets"]
}`;
      const raw = await callAIWriting(prompt, { jsonMode: true, temperature: 0.5 });
      const json = JSON.parse(raw.replace(/```json|```/g, '').trim());
      setResult(json);
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  const supportText = result
    ? `Bonjour,\n\nJe souhaite ajouter mon livre aux catégories suivantes (en plus des 2 catégories déjà définies lors de la publication) :\n\n${(result.extras || []).map((e, i) => `${i + 1}. ${e}`).join('\n')}\n\nMerci pour votre aide.\nCordialement.`
    : '';

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Choisis 2 catégories optimales (1 large + 1 spécifique) puis prépare la demande des 8 catégories
        supplémentaires à envoyer au support KDP.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Sujet du livre *</Label><Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ex : développement personnel, finance…" /></div>
        <div><Label className="text-xs">Public cible (optionnel)</Label><Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Ex : débutants, entrepreneurs…" /></div>
      </div>

      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer la stratégie de catégories</span>
      </Button>

      {result && (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {result.large && (
              <Card className="border-joy-ink/10"><CardContent className="p-4">
                <Badge style={{ background: TEAL, color: 'white' }} className="mb-2">Catégorie large</Badge>
                <div className="text-sm font-semibold">{result.large.path}</div>
                <p className="text-xs text-joy-ink/60 mt-1">{result.large.reason}</p>
              </CardContent></Card>
            )}
            {result.specific && (
              <Card className="border-joy-ink/10"><CardContent className="p-4">
                <Badge style={{ background: '#FF9E2D', color: 'white' }} className="mb-2">Catégorie spécifique</Badge>
                <div className="text-sm font-semibold">{result.specific.path}</div>
                <p className="text-xs text-joy-ink/60 mt-1">{result.specific.reason}</p>
              </CardContent></Card>
            )}
          </div>

          {result.extras && result.extras.length > 0 && (
            <Card className="border-joy-ink/10"><CardContent className="p-4">
              <h4 className="text-sm font-bold mb-2 flex items-center gap-1.5"><Layers className="h-4 w-4" /> 8 catégories à demander au support</h4>
              <ol className="list-decimal list-inside space-y-1 text-xs text-joy-ink/70">
                {result.extras.map((e, i) => <li key={i}>{e}</li>)}
              </ol>
              <Button variant="outline" size="sm" className="mt-3 gap-1.5"
                onClick={() => { navigator.clipboard.writeText(supportText); toast.success('Message copié ✓'); }}>
                <Copy className="h-3.5 w-3.5" /> Copier le message pour le support KDP
              </Button>
            </CardContent></Card>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesManager10;
