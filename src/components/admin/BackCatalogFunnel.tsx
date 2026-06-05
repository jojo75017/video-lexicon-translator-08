import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const TEAL = '#008296';

const BackCatalogFunnel: React.FC = () => {
  const [books, setBooks] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    const list = books.split(/\n/).map((b) => b.trim()).filter(Boolean);
    if (list.length < 2) return toast.error('Liste au moins 2 titres (1 par ligne).');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es stratège read-through pour auteurs KDP. Voici le catalogue de l'auteur (1 titre par ligne) :
${list.map((b, i) => `${i + 1}. ${b}`).join('\n')}

Construis un TUNNEL DE BACK-CATALOGUE pour maximiser le read-through (lecture en chaîne) et les ventes croisées :
1. ORDRE de lecture conseillé et logique de parcours.
2. Pour chaque titre : un encart "Vous avez aimé ? Lisez ensuite…" à insérer en fin de livre (texte + titre recommandé).
3. Suggestions de LIENS CROISÉS (mention dans la description, séries reliées).
4. Idée de BUNDLE ou offre d'appel pour faire entrer le lecteur dans le catalogue.
Réponds en français, structuré et actionnable.`;
      const raw = await callAIWriting(prompt, { temperature: 0.7 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Génère des liens croisés entre tes titres pour maximiser le read-through et les ventes en chaîne.
      </p>
      <div><Label className="text-xs">Ton catalogue (1 titre par ligne) *</Label>
        <Textarea rows={6} value={books} onChange={(e) => setBooks(e.target.value)} placeholder={'Tome 1 — …\nTome 2 — …\nGuide pratique — …'} />
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer le tunnel</span>
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

export default BackCatalogFunnel;
