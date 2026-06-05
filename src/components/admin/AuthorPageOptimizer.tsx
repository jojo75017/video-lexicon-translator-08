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

const AuthorPageOptimizer: React.FC = () => {
  const [authorName, setAuthorName] = useState('');
  const [niche, setNiche] = useState('');
  const [books, setBooks] = useState('');
  const [tone, setTone] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!authorName.trim() || !niche.trim()) return toast.error('Nom et niche requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Optimise une page Amazon Author Central, en français.
Auteur : "${authorName}"
Niche : ${niche}
${books ? `Livres publiés : ${books}` : ''}
${tone ? `Ton souhaité : ${tone}` : ''}

Fournis :
1. BIO COURTE (≤ 150 caractères) pour les aperçus.
2. BIO LONGUE (200-300 mots) à la 3e personne, qui crée la confiance et la connexion, avec un appel à suivre l'auteur.
3. 10 MOTS-CLÉS / thèmes pour le référencement de la page auteur.
4. Conseils PHOTO (style, cadrage).
5. Stratégie de MISE EN AVANT des titres (ordre, accroche par livre).
6. Checklist de configuration Author Central.
Format texte clair, pas de HTML.`;
      const raw = await callAIWriting(prompt, { temperature: 0.7 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Optimise ta page Amazon Author Central : bio courte/longue, mots-clés, photo et mise en avant des titres.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Nom auteur *</Label><Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} /></div>
        <div><Label className="text-xs">Niche *</Label><Input value={niche} onChange={(e) => setNiche(e.target.value)} /></div>
        <div><Label className="text-xs">Livres publiés</Label><Input value={books} onChange={(e) => setBooks(e.target.value)} placeholder="séparés par des virgules" /></div>
        <div><Label className="text-xs">Ton</Label><Input value={tone} onChange={(e) => setTone(e.target.value)} placeholder="inspirant, expert…" /></div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Optimiser la page auteur</span>
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

export default AuthorPageOptimizer;
