import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy, Store } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const OR = '#B8860B';

/**
 * Libraires & Salons — argumentaire libraire, fiche office, et préparation
 * des salons / séances de dédicaces.
 */
const BooksellersFairs: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim() || !synopsis.trim()) return toast.error('Titre et résumé requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es représentant·e commercial·e d'une maison d'édition auprès des libraires. Tu prépares la mise en avant d'un livre en librairie et sur les salons.

Livre : "${title}"
Auteur : ${author || 'non précisé'}
Genre / catégorie : ${genre || 'non précisé'}
Résumé :
${synopsis}

Produis en français, sans balises HTML :

1. ARGUMENTAIRE LIBRAIRE — pitch commercial percutant (pourquoi le mettre en table/vitrine), comparables, public, atouts de vente.
2. FICHE OFFICE — éléments synthétiques : pitch en 2 lignes, public cible, mise en avant conseillée, période idéale.
3. PRÉPARATION SALON / DÉDICACE — pitch oral de 30 secondes, 5 phrases d'accroche pour aborder les visiteurs, liste du matériel/supports à prévoir, conseils logistiques.
4. PARTENARIATS LIBRAIRIES — 5 idées d'animations ou d'opérations (rencontres, vitrines thématiques, clubs lecture).

Sois concret et orienté vente.`;
      const raw = await callAIWriting(prompt, { temperature: 0.65 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70 flex items-center gap-1.5">
        <Store className="h-4 w-4" style={{ color: OR }} />
        Argumentaire libraire, fiche office et préparation des salons / dédicaces.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Auteur</Label><Input value={author} onChange={(e) => setAuthor(e.target.value)} /></div>
        <div><Label className="text-xs">Genre / catégorie</Label><Input value={genre} onChange={(e) => setGenre(e.target.value)} /></div>
      </div>
      <div><Label className="text-xs">Résumé du livre *</Label><Textarea rows={4} value={synopsis} onChange={(e) => setSynopsis(e.target.value)} /></div>
      <Button onClick={run} disabled={loading} style={{ background: OR, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer les supports libraires & salons</span>
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

export default BooksellersFairs;
