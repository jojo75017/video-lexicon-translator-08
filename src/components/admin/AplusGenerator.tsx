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

const AplusGenerator: React.FC = () => {
  const [title, setTitle] = useState('');
  const [niche, setNiche] = useState('');
  const [highlights, setHighlights] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim()) return toast.error('Titre requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Génère le contenu A+ (Amazon A+ Content) pour un livre KDP, en français, prêt à coller bloc par bloc dans le gestionnaire A+ d'Amazon.
Livre : "${title}"
${niche ? `Niche : ${niche}` : ''}
${highlights ? `Points forts : ${highlights}` : ''}

Structure le contenu en 4 modules A+ recommandés par Amazon :
- Module 1 — Bannière standard avec texte (titre accrocheur + sous-titre)
- Module 2 — Image + texte en colonnes (3 bénéfices avec sous-titres et descriptions)
- Module 3 — Texte enrichi (présentation de l'auteur / de la promesse)
- Module 4 — Tableau de comparaison (4 lignes mettant en avant ce que ce livre apporte)

Pour chaque module : indique [TITRE DU MODULE], le texte exact à coller, et une suggestion de visuel entre crochets. Pas de HTML, texte clair structuré.`;
      const raw = await callAIWriting(prompt, { temperature: 0.7 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Génère le contenu A+ Amazon en 4 modules (bannière, colonnes, texte enrichi, tableau comparatif) prêt à coller.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Niche</Label><Input value={niche} onChange={(e) => setNiche(e.target.value)} /></div>
        <div className="sm:col-span-2"><Label className="text-xs">Points forts</Label><Input value={highlights} onChange={(e) => setHighlights(e.target.value)} placeholder="séparés par des virgules" /></div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer le contenu A+</span>
      </Button>
      {output && (
        <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-3">
          <Textarea rows={16} value={output} onChange={(e) => setOutput(e.target.value)} className="text-xs font-mono" />
          <Button variant="outline" size="sm" className="gap-1.5"
            onClick={() => { navigator.clipboard.writeText(output); toast.success('Copié ✓'); }}>
            <Copy className="h-3.5 w-3.5" /> Copier
          </Button>
        </CardContent></Card>
      )}
    </div>
  );
};

export default AplusGenerator;
