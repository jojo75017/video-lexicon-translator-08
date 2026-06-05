import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const TEAL = '#008296';

const MARKETS = [
  { id: 'us', label: '🇺🇸 États-Unis (EN-US)', lang: 'anglais américain' },
  { id: 'uk', label: '🇬🇧 Royaume-Uni (EN-GB)', lang: 'anglais britannique' },
  { id: 'de', label: '🇩🇪 Allemagne (DE)', lang: 'allemand' },
  { id: 'es', label: '🇪🇸 Espagne (ES)', lang: 'espagnol' },
];

const TranslationMarkets: React.FC = () => {
  const [market, setMarket] = useState(MARKETS[0]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (text.trim().length < 20) return toast.error('Colle un texte à traduire (titre, description ou extrait).');
    setLoading(true); setOutput('');
    try {
      const prompt = `Traduis et adapte culturellement le texte suivant en ${market.lang}, pour le marché Amazon correspondant.
Garde le ton marketing/éditorial, adapte les expressions idiomatiques et les unités si nécessaire. Ne traduis pas mot à mot : adapte pour que cela sonne naturel pour un lecteur local.

Texte source :
"""
${text.trim()}
"""

Réponds uniquement avec la traduction adaptée.`;
      const raw = await callAIWriting(prompt, { temperature: 0.6 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la traduction.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Traduis et adapte ton livre (titre, description, extraits) pour les marchés Amazon US, UK, DE et ES,
        avec ajustement culturel.
      </p>

      <div>
        <Label className="text-xs flex items-center gap-1"><Globe className="h-3 w-3" /> Marché cible</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {MARKETS.map((m) => (
            <Button key={m.id} size="sm" variant={market.id === m.id ? 'default' : 'outline'}
              style={market.id === m.id ? { background: TEAL, color: 'white' } : undefined}
              onClick={() => setMarket(m)}>
              {m.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-xs">Texte source (français)</Label>
        <Textarea rows={8} value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Colle le titre, la description ou un extrait à traduire…" />
      </div>

      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Traduire & adapter</span>
      </Button>

      {output && (
        <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-3">
          <Textarea rows={10} value={output} onChange={(e) => setOutput(e.target.value)} />
          <Button variant="outline" size="sm" className="gap-1.5"
            onClick={() => { navigator.clipboard.writeText(output); toast.success('Copié ✓'); }}>
            <Copy className="h-3.5 w-3.5" /> Copier
          </Button>
        </CardContent></Card>
      )}
    </div>
  );
};

export default TranslationMarkets;
