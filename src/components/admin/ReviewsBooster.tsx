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

const ReviewsBooster: React.FC = () => {
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim()) return toast.error('Titre requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Crée une séquence d'emails post-achat pour obtenir des avis Amazon LÉGITIMES (conformes aux règles Amazon : jamais d'avis contre rémunération, jamais d'incitation, demande honnête), en français.
Livre : "${title}"
${authorName ? `Auteur : ${authorName}` : ''}
${niche ? `Niche : ${niche}` : ''}

Fournis 4 emails dans une séquence (pour lecteurs inscrits à la liste / lead magnet, PAS via Amazon) :
- EMAIL 1 (J+2) : remerciement + valeur ajoutée
- EMAIL 2 (J+7) : prise de nouvelles + question d'engagement
- EMAIL 3 (J+10) : demande d'avis honnête avec lien, sans pression
- EMAIL 4 (J+15) : relance douce + bonus
Pour chaque email : objet + corps. Ton chaleureux et authentique.
Ajoute un rappel des règles Amazon à respecter. Format texte, pas de HTML.`;
      const raw = await callAIWriting(prompt, { temperature: 0.7 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Séquence d'emails post-achat pour obtenir des avis Amazon légitimes (conforme aux règles Amazon).
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Auteur</Label><Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} /></div>
        <div className="sm:col-span-2"><Label className="text-xs">Niche</Label><Input value={niche} onChange={(e) => setNiche(e.target.value)} /></div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer la séquence</span>
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

export default ReviewsBooster;
