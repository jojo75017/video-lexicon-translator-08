import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy, Newspaper } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const OR = '#B8860B';

/**
 * Service de Presse — dossier de presse, communiqué, liste-type de
 * journalistes/blogueurs par genre, et e-mail d'envoi SP.
 */
const PressService: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [angle, setAngle] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim() || !synopsis.trim()) return toast.error('Titre et résumé requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es attaché·e de presse dans une maison d'édition. Tu prépares le service de presse (SP) d'un livre.

Livre : "${title}"
Auteur : ${author || 'non précisé'}
Genre / catégorie : ${genre || 'non précisé'}
Angle / actualité : ${angle || 'aucun angle particulier fourni'}
Résumé :
${synopsis}

Produis en français, sans balises HTML :

1. COMMUNIQUÉ DE PRESSE — prêt à envoyer (titre accrocheur, chapô, corps avec l'angle, citation/extrait, infos pratiques : prix, format, ISBN à compléter, date).
2. DOSSIER DE PRESSE — éléments clés : pitch court, bio auteur, 3 angles éditoriaux exploitables par les médias, questions d'interview suggérées.
3. CIBLES MÉDIAS — liste-type de 8 à 12 catégories de journalistes/médias/blogueurs littéraires pertinents pour CE genre (rubriques, podcasts, comptes, blogs — types, pas de coordonnées inventées).
4. E-MAIL D'ENVOI SP — modèle court et personnalisable pour proposer le service de presse.

Reste crédible et professionnel ; n'invente pas de noms de personnes réelles ni de contacts.`;
      const raw = await callAIWriting(prompt, { temperature: 0.65 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70 flex items-center gap-1.5">
        <Newspaper className="h-4 w-4" style={{ color: OR }} />
        Communiqué, dossier de presse et cibles médias façon attaché·e de presse.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Auteur</Label><Input value={author} onChange={(e) => setAuthor(e.target.value)} /></div>
        <div><Label className="text-xs">Genre / catégorie</Label><Input value={genre} onChange={(e) => setGenre(e.target.value)} /></div>
        <div><Label className="text-xs">Angle / actualité</Label><Input value={angle} onChange={(e) => setAngle(e.target.value)} placeholder="ex. sujet de société, saison…" /></div>
      </div>
      <div><Label className="text-xs">Résumé du livre *</Label><Textarea rows={4} value={synopsis} onChange={(e) => setSynopsis(e.target.value)} /></div>
      <Button onClick={run} disabled={loading} style={{ background: OR, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer le service de presse</span>
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

export default PressService;
