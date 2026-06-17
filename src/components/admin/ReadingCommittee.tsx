import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy, BookOpenCheck } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const BORDEAUX = '#9B2335';

/**
 * Comité de Lecture IA — fiche de lecture professionnelle façon maison d'édition.
 * Rend un verdict argumenté « accepté / à retravailler / refusé ».
 */
const ReadingCommittee: React.FC = () => {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim() || !synopsis.trim()) return toast.error('Titre et résumé requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es un membre senior d'un comité de lecture d'une maison d'édition. Tu rédiges une FICHE DE LECTURE professionnelle, lucide et exigeante (comme avant une décision de signature).

Livre : "${title}"
Genre / catégorie : ${genre || 'non précisé'}
Résumé fourni par l'auteur :
${synopsis}
${excerpt ? `\nExtrait fourni :\n${excerpt}` : ''}

Rédige en français une fiche structurée :

1. SYNOPSIS REFORMULÉ — résume l'œuvre en 4-6 lignes, avec l'angle et la promesse de lecture.
2. POINTS FORTS — 4 à 6 points concrets (concept, écriture, originalité, public).
3. POINTS FAIBLES / RISQUES — 4 à 6 points francs (clichés, marché saturé, structure, etc.).
4. PUBLIC CIBLE & POSITIONNEMENT — lecteur type, comparables (comp titles) crédibles.
5. POTENTIEL COMMERCIAL — estimation argumentée (préciser que c'est une estimation, pas une donnée officielle).
6. VERDICT — choisis clairement : « ACCEPTÉ », « À RETRAVAILLER » ou « REFUSÉ », avec 2-3 phrases de justification et, si « à retravailler », les conditions précises.

Format texte clair avec sauts de ligne, sans balises HTML.`;
      const raw = await callAIWriting(prompt, { temperature: 0.6 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70 flex items-center gap-1.5">
        <BookOpenCheck className="h-4 w-4" style={{ color: BORDEAUX }} />
        Fiche de lecture professionnelle avec verdict argumenté, comme en maison d'édition.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Genre / catégorie</Label><Input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Thriller, dév. perso…" /></div>
      </div>
      <div><Label className="text-xs">Résumé du livre *</Label><Textarea rows={4} value={synopsis} onChange={(e) => setSynopsis(e.target.value)} placeholder="Pitch, intrigue ou plan détaillé…" /></div>
      <div><Label className="text-xs">Extrait (optionnel)</Label><Textarea rows={4} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Colle ici les premières pages pour une analyse plus fine." /></div>
      <Button onClick={run} disabled={loading} style={{ background: BORDEAUX, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer la fiche de lecture</span>
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

export default ReadingCommittee;
