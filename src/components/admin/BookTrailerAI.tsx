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

const BookTrailerAI: React.FC = () => {
  const [title, setTitle] = useState('');
  const [niche, setNiche] = useState('');
  const [pitch, setPitch] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim() || !niche.trim()) return toast.error('Titre et niche requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Crée un book trailer (vidéo promo courte ~30-45s) pour un livre, en français.
Livre : "${title}"
Niche : ${niche}
${pitch ? `Pitch : ${pitch}` : ''}

Fournis un story-board en 6-8 plans. Pour CHAQUE plan :
- ⏱️ Timing (ex : 0-4s)
- 🎬 VISUEL : description précise de l'image/animation à montrer
- 📝 TEXTE À L'ÉCRAN : phrase courte percutante
- 🎙️ VOIX OFF : ce qui est dit (texte naturel pour TTS)
- 🎵 Ambiance musicale suggérée
Termine par un appel à l'action + suggestion de musique libre de droits.
Format texte clair, un bloc par plan, pas de HTML.`;
      const raw = await callAIWriting(prompt, { temperature: 0.75 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Génère un story-board complet de book trailer : plans, textes à l'écran, voix off et ambiance musicale.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Niche *</Label><Input value={niche} onChange={(e) => setNiche(e.target.value)} /></div>
        <div className="sm:col-span-2"><Label className="text-xs">Pitch / promesse</Label><Textarea rows={2} value={pitch} onChange={(e) => setPitch(e.target.value)} /></div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer le book trailer</span>
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

export default BookTrailerAI;
