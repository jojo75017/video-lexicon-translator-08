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

const LeadMagnetBuilder: React.FC = () => {
  const [title, setTitle] = useState('');
  const [niche, setNiche] = useState('');
  const [promise, setPromise] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim() || !niche.trim()) return toast.error('Titre et niche requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es expert en acquisition d'emails pour auteurs KDP. Crée un lead magnet complet en français pour bâtir une liste de lecteurs.
Livre : "${title}"
Niche : ${niche}
${promise ? `Promesse : ${promise}` : ''}

Génère :
1. IDÉE de lead magnet irrésistible (chapitre offert, checklist, guide bonus…) avec un titre accrocheur.
2. TEXTE de la page de capture : titre, sous-titre, 3 bulletpoints de bénéfices, bouton CTA.
3. EMAIL de livraison automatique (objet + corps) qui envoie le cadeau et invite à acheter le livre complet.
4. SÉQUENCE de 3 emails de suivi (objet + idée de contenu) pour convertir le lecteur en acheteur.
Format texte clair structuré, pas de HTML.`;
      const raw = await callAIWriting(prompt, { temperature: 0.75 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Crée un chapitre/guide offert + le tunnel de capture email pour transformer tes lecteurs en liste fidèle.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre du livre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Niche *</Label><Input value={niche} onChange={(e) => setNiche(e.target.value)} /></div>
        <div className="sm:col-span-2"><Label className="text-xs">Promesse principale</Label><Input value={promise} onChange={(e) => setPromise(e.target.value)} /></div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer le lead magnet</span>
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

export default LeadMagnetBuilder;
