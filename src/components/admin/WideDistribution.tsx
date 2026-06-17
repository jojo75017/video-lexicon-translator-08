import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const BLEU = '#1D4ED8';

/**
 * Assistant Distribution Multi-Plateformes — guide + métadonnées formatées
 * pour diffuser au-delà d'Amazon (Kobo, Apple Books, Google Play, Fnac, agrégateurs).
 */
const WideDistribution: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim() || !synopsis.trim()) return toast.error('Titre et résumé requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es un responsable de distribution numérique dans une maison d'édition. Tu prépares la mise en diffusion "wide" (au-delà d'Amazon KDP) d'un livre sur Kobo, Apple Books, Google Play, Fnac/ePagine via des agrégateurs (Draft2Digital, StreetLib).

Livre : "${title}"
Auteur : ${author || 'non précisé'}
Genre / catégorie : ${genre || 'non précisé'}
Prix TTC souhaité : ${price || 'non précisé'}
Résumé :
${synopsis}

Produis en français, sans balises HTML :

1. STRATÉGIE DE DIFFUSION — recommande la voie la plus pertinente (agrégateur unique vs comptes directs), avantages/inconvénients pour CE livre.
2. MÉTADONNÉES FORMATÉES — fournis un bloc prêt à copier : Titre, Sous-titre suggéré, Auteur, Langue, Description marketing (≈400-600 caractères, optimisée), 7 mots-clés, 2-3 catégories BISAC suggérées.
3. CHECKLIST PAR PLATEFORME — Kobo, Apple Books, Google Play, Fnac/ePagine : exigences clés (format, couverture, prix, particularités) en puces courtes.
4. CALENDRIER & EXCLUSIVITÉ — conseille sur KDP Select (exclusivité) vs wide, et un ordre de mise en ligne.
5. ERREURS À ÉVITER — 4-5 pièges fréquents en distribution wide.

Sois concret et actionnable.`;
      const raw = await callAIWriting(prompt, { temperature: 0.6 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70 flex items-center gap-1.5">
        <Globe className="h-4 w-4" style={{ color: BLEU }} />
        Préparez la diffusion au-delà d'Amazon : métadonnées formatées et checklist par plateforme.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Auteur</Label><Input value={author} onChange={(e) => setAuthor(e.target.value)} /></div>
        <div><Label className="text-xs">Genre / catégorie</Label><Input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Thriller, dév. perso…" /></div>
        <div><Label className="text-xs">Prix TTC souhaité</Label><Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="ex. 4,99 €" /></div>
      </div>
      <div><Label className="text-xs">Résumé du livre *</Label><Textarea rows={4} value={synopsis} onChange={(e) => setSynopsis(e.target.value)} placeholder="Pitch ou 4e de couverture…" /></div>
      <Button onClick={run} disabled={loading} style={{ background: BLEU, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer le plan de distribution</span>
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

export default WideDistribution;
