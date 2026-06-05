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

// Optimiseur Goodreads — IA (BYOK Gemini)
const GoodreadsOptimizer: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim()) return toast.error('Titre requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es expert en marketing littéraire sur Goodreads. Prépare une stratégie complète d'optimisation et d'animation Goodreads pour ce livre.
Titre : "${title}"
${author ? `Auteur : ${author}` : ''}
${genre ? `Genre : ${genre}` : ''}
${summary ? `Résumé : ${summary}` : ''}

Donne :
1. DESCRIPTION GOODREADS optimisée (différente d'Amazon, plus "communautaire", 150-250 mots).
2. ÉTAGÈRES (shelves) recommandées à cibler pour la découvrabilité.
3. PROFIL AUTEUR : conseils bio + sections à remplir.
4. PLAN D'ANIMATION 30 jours (giveaways, Ask the Author, listes, groupes pertinents).
5. STRATÉGIE D'AVIS : comment obtenir des premiers avis légitimes (ARC, amis lecteurs).
6. 5 GROUPES / LISTES Goodreads types à rejoindre selon le genre.
Réponds en français, concret et actionnable.`;
      const raw = await callAIWriting(prompt, { temperature: 0.6, maxTokens: 2800 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Optimise ta fiche et ton profil Goodreads, avec une description dédiée et un plan d'animation
        lecteurs pour gagner en visibilité et en avis.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Auteur</Label><Input value={author} onChange={(e) => setAuthor(e.target.value)} /></div>
        <div><Label className="text-xs">Genre</Label><Input value={genre} onChange={(e) => setGenre(e.target.value)} /></div>
        <div className="sm:col-span-2"><Label className="text-xs">Résumé</Label><Textarea rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} className="text-xs" /></div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Optimiser Goodreads</span>
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

export default GoodreadsOptimizer;
