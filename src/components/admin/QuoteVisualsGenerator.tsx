import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const TEAL = '#008296';
const BGS = ['#008296', '#232F3E', '#FF9E2D', '#0F766E', '#7C3AED', '#B45309'];

// Générateur de visuels citations : extrait les phrases fortes via IA et les affiche en cartes partageables
const QuoteVisualsGenerator: React.FC = () => {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState<string[]>([]);

  const run = async () => {
    if (!text.trim()) return toast.error('Colle un extrait du manuscrit.');
    setLoading(true); setQuotes([]);
    try {
      const prompt = `Extrais de ce texte les 6 phrases les plus fortes, marquantes et "partageables" (citations percutantes pour les réseaux sociaux). Chaque citation doit être autonome, courte (max 200 caractères), et fidèle au texte (tu peux légèrement raccourcir sans déformer).
Texte :
"""${text.slice(0, 6000)}"""

Réponds UNIQUEMENT avec les 6 citations, une par ligne, sans numérotation ni guillemets.`;
      const raw = await callAIWriting(prompt, { temperature: 0.6 });
      const lines = raw.split('\n').map((l) => l.replace(/^["'\d.\-)\s]+/, '').replace(/["']\s*$/, '').trim()).filter((l) => l.length > 10);
      setQuotes(lines.slice(0, 6));
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Extrait les phrases les plus fortes de ton manuscrit et les présente en visuels carrés prêts à
        partager (capture d'écran ou clic droit pour enregistrer).
      </p>
      <div className="grid gap-3">
        <div><Label className="text-xs">Extrait du manuscrit *</Label><Textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} className="text-xs" /></div>
        <div><Label className="text-xs">Nom de l'auteur (signature)</Label><input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={author} onChange={(e) => setAuthor(e.target.value)} /></div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer les visuels citations</span>
      </Button>
      {quotes.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quotes.map((q, i) => (
            <div key={i} className="relative aspect-square rounded-xl p-5 flex flex-col justify-center text-center"
              style={{ background: BGS[i % BGS.length] }}>
              <p className="text-white font-semibold leading-snug" style={{ fontSize: q.length > 120 ? '0.85rem' : '1rem' }}>“{q}”</p>
              {author && <p className="text-white/70 text-xs mt-3">— {author}</p>}
              <button
                onClick={() => { navigator.clipboard.writeText(q); toast.success('Citation copiée ✓'); }}
                className="absolute top-2 right-2 rounded-md bg-white/20 p-1.5 hover:bg-white/30">
                <Copy className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuoteVisualsGenerator;
