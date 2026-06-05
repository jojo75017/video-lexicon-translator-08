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

const AuthorNewsletter: React.FC = () => {
  const [authorName, setAuthorName] = useState('');
  const [niche, setNiche] = useState('');
  const [frequency, setFrequency] = useState('Bimensuelle');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!niche.trim()) return toast.error('Niche requise.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Crée un plan de newsletter auteur pour fidéliser les lecteurs, en français.
${authorName ? `Auteur : ${authorName}` : ''}
Niche : ${niche}
Fréquence : ${frequency}

Fournis :
1. CALENDRIER éditorial sur 8 envois (thème + objectif de chaque email).
2. 3 TEMPLATES d'emails prêts à personnaliser (email de bienvenue, email de valeur, email de promotion) avec objet + corps.
3. 10 IDÉES de contenus récurrents (coulisses, conseils, recommandations…).
4. Conseils pour faire grandir la liste et limiter les désinscriptions.
Ton chaleureux et personnel. Format texte clair, pas de HTML.`;
      const raw = await callAIWriting(prompt, { temperature: 0.7 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Calendrier + templates d'emails pour fidéliser ta communauté de lecteurs et garder le contact.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Auteur</Label><Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} /></div>
        <div><Label className="text-xs">Niche *</Label><Input value={niche} onChange={(e) => setNiche(e.target.value)} /></div>
        <div className="sm:col-span-2"><Label className="text-xs">Fréquence</Label><Input value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="Hebdomadaire, bimensuelle…" /></div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer la newsletter</span>
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

export default AuthorNewsletter;
