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

const BookBubAdBuilder: React.FC = () => {
  const [title, setTitle] = useState('');
  const [niche, setNiche] = useState('');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState('BookBub + Facebook');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim() || !niche.trim()) return toast.error('Titre et niche requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Crée des annonces publicitaires pour ${platform}, en français.
Livre : "${title}"
Niche : ${niche}
${audience ? `Public cible : ${audience}` : ''}

Fournis :
1. BOOKBUB ADS : 4 variantes d'accroche courte (≤ 80 caractères) + idée de visuel pour chaque.
2. FACEBOOK / META ADS : 3 variantes complètes (texte principal, titre, description) optimisées conversion.
3. CIBLAGE : intérêts, auteurs comparables et audiences à viser.
4. 3 visuels recommandés (concept + texte à incruster).
5. Conseils budget de départ et test A/B.
Format texte clair par section, pas de HTML.`;
      const raw = await callAIWriting(prompt, { temperature: 0.75 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Génère accroches, textes d'annonces, ciblage et concepts visuels pour BookBub et Facebook Ads.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Niche *</Label><Input value={niche} onChange={(e) => setNiche(e.target.value)} /></div>
        <div><Label className="text-xs">Public cible</Label><Input value={audience} onChange={(e) => setAudience(e.target.value)} /></div>
        <div><Label className="text-xs">Plateformes</Label><Input value={platform} onChange={(e) => setPlatform(e.target.value)} /></div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer les annonces</span>
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

export default BookBubAdBuilder;
