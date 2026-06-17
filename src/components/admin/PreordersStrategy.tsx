import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy, CalendarClock } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const OR = '#B8860B';

/**
 * Stratégie de Précommandes — plan et calendrier de précommande multi-plateformes
 * pour concentrer les ventes au lancement.
 */
const PreordersStrategy: React.FC = () => {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [launchDate, setLaunchDate] = useState('');
  const [audience, setAudience] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim()) return toast.error('Titre requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es responsable lancement dans une maison d'édition. Tu conçois une stratégie de précommande multi-plateformes pour concentrer les ventes le jour J et booster le classement.

Livre : "${title}"
Genre / catégorie : ${genre || 'non précisé'}
Date de lancement visée : ${launchDate || 'non précisée'}
Audience / liste actuelle : ${audience || 'non précisée'}

Produis en français, sans balises HTML :

1. STRATÉGIE GLOBALE — pourquoi et comment utiliser la précommande pour ce livre (Amazon vs wide, durée idéale de la fenêtre de précommande, objectifs).
2. CALENDRIER J-30 À J+7 — plan jour par jour / semaine par semaine : teasing, ouverture précommande, relances, jour de sortie, suivi. Format liste claire.
3. ACTIONS PAR CANAL — newsletter, réseaux sociaux, partenaires/ARC, publicité ; ce qu'il faut publier à chaque étape.
4. MESSAGES CLÉS — 5 accroches/hooks de précommande prêts à réutiliser.
5. INDICATEURS — quoi suivre pour mesurer le succès du lancement.

Sois concret, orienté action.`;
      const raw = await callAIWriting(prompt, { temperature: 0.6 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70 flex items-center gap-1.5">
        <CalendarClock className="h-4 w-4" style={{ color: OR }} />
        Plan et calendrier de précommande pour concentrer vos ventes au lancement.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Genre / catégorie</Label><Input value={genre} onChange={(e) => setGenre(e.target.value)} /></div>
        <div><Label className="text-xs">Date de lancement</Label><Input value={launchDate} onChange={(e) => setLaunchDate(e.target.value)} placeholder="ex. 15 octobre" /></div>
        <div><Label className="text-xs">Audience / liste</Label><Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="ex. 500 abonnés newsletter" /></div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: OR, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer la stratégie de précommande</span>
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

export default PreordersStrategy;
