import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy, Globe2 } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const OR = '#B8860B';

/**
 * Droits Étrangers — rights guide (pitch de cession des droits de traduction)
 * + repérage des marchés porteurs par genre.
 */
const ForeignRights: React.FC = () => {
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
      const prompt = `Tu es responsable des droits étrangers (foreign rights) dans une maison d'édition. Tu prépares la cession des droits de traduction d'un livre à l'international.

Livre : "${title}"
Auteur : ${author || 'non précisé'}
Genre / catégorie : ${genre || 'non précisé'}
Résumé :
${synopsis}

Produis en français, sans balises HTML :

1. RIGHTS GUIDE (FR) — fiche de cession professionnelle : pitch percutant en anglais ET en français, points de vente uniques, comparables internationaux, public.
2. PITCH ANGLAIS — un paragraphe de présentation en anglais, prêt pour un catalogue de droits ou un salon (type Frankfurt/London Book Fair).
3. MARCHÉS PORTEURS — 6 à 8 marchés/pays les plus pertinents pour ce genre, avec une justification courte par marché.
4. STRATÉGIE DE CESSION — conseils concrets : salons à viser, agents/scouts à approcher (types), priorités, erreurs à éviter.

Reste crédible ; n'invente pas de contrats ni de chiffres précis.`;
      const raw = await callAIWriting(prompt, { temperature: 0.6 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70 flex items-center gap-1.5">
        <Globe2 className="h-4 w-4" style={{ color: OR }} />
        Rights guide et repérage des marchés pour vendre vos droits de traduction.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Auteur</Label><Input value={author} onChange={(e) => setAuthor(e.target.value)} /></div>
        <div><Label className="text-xs">Genre / catégorie</Label><Input value={genre} onChange={(e) => setGenre(e.target.value)} /></div>
      </div>
      <div><Label className="text-xs">Résumé du livre *</Label><Textarea rows={4} value={synopsis} onChange={(e) => setSynopsis(e.target.value)} /></div>
      <Button onClick={run} disabled={loading} style={{ background: OR, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer le rights guide</span>
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

export default ForeignRights;
