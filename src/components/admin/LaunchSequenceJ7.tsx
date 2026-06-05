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

const LaunchSequenceJ7: React.FC = () => {
  const [title, setTitle] = useState('');
  const [niche, setNiche] = useState('');
  const [launchDate, setLaunchDate] = useState('');
  const [buyLink, setBuyLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim() || !niche.trim()) return toast.error('Titre et niche requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Crée un plan de lancement sur 7 jours (J-7 à J0) pour un livre Amazon KDP, en français.
Livre : "${title}"
Niche : ${niche}
${launchDate ? `Date de sortie : ${launchDate}` : ''}
${buyLink ? `Lien d'achat : ${buyLink}` : ''}

Pour CHAQUE jour (J-7, J-6, J-5, J-4, J-3, J-2, J-1, J0), fournis :
- 📧 EMAIL : objet + corps court (3-5 phrases) à envoyer à la liste
- 📱 POST SOCIAL : un post prêt à publier (avec 2-3 hashtags)
Construis une montée en tension (teasing → preuve → urgence → lancement).
Format texte clair avec séparateurs entre les jours, pas de HTML.`;
      const raw = await callAIWriting(prompt, { temperature: 0.7 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Génère une séquence complète J-7 → J0 : un email + un post social par jour pour orchestrer ton lancement.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Niche *</Label><Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Développement personnel…" /></div>
        <div><Label className="text-xs">Date de sortie</Label><Input type="date" value={launchDate} onChange={(e) => setLaunchDate(e.target.value)} /></div>
        <div><Label className="text-xs">Lien d'achat</Label><Input value={buyLink} onChange={(e) => setBuyLink(e.target.value)} placeholder="https://amazon.fr/dp/…" /></div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer la séquence J-7</span>
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

export default LaunchSequenceJ7;
