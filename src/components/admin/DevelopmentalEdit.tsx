import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy, LayoutList } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const BORDEAUX = '#9B2335';

/**
 * Édition Structurelle (Developmental Edit) — analyse de la structure narrative
 * ou argumentaire et suggestions de réorganisation.
 */
const DevelopmentalEdit: React.FC = () => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'fiction' | 'non-fiction'>('fiction');
  const [structure, setStructure] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim() || !structure.trim()) return toast.error('Titre et plan/structure requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es éditeur structurel (developmental editor) en maison d'édition. Tu réalises une ÉDITION STRUCTURELLE : tu analyses l'architecture de l'œuvre, pas l'orthographe.

Livre : "${title}"
Type : ${type === 'fiction' ? 'Fiction (roman, récit)' : 'Non-fiction (essai, guide, pratique)'}
Plan / structure fournie (chapitres, intrigue, progression) :
${structure}

Rends en français une analyse structurée :

1. DIAGNOSTIC GLOBAL — la promesse est-elle tenue ? La progression est-elle claire ?
2. RYTHME & ÉQUILIBRE — repère les longueurs, les zones creuses, les passages trop rapides, déséquilibres entre chapitres.
3. COHÉRENCE — ${type === 'fiction' ? 'arcs des personnages, tension dramatique, fils narratifs non résolus.' : 'logique argumentative, redites, chaînons manquants entre les idées.'}
4. SUGGESTIONS DE RÉORGANISATION — propositions concrètes : déplacer, fusionner, scinder ou couper des chapitres (liste actionnable).
5. PLAN RÉVISÉ RECOMMANDÉ — propose une table des matières / structure améliorée.
6. PRIORITÉS — les 3 chantiers les plus rentables à traiter en premier.

Format texte clair avec sauts de ligne, sans balises HTML.`;
      const raw = await callAIWriting(prompt, { temperature: 0.6 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70 flex items-center gap-1.5">
        <LayoutList className="h-4 w-4" style={{ color: BORDEAUX }} />
        Analyse de la structure et suggestions de réorganisation — au niveau d'un éditeur.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div>
          <Label className="text-xs">Type d'ouvrage</Label>
          <select value={type} onChange={(e) => setType(e.target.value as 'fiction' | 'non-fiction')}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="fiction">Fiction</option>
            <option value="non-fiction">Non-fiction</option>
          </select>
        </div>
      </div>
      <div><Label className="text-xs">Plan / structure *</Label><Textarea rows={8} value={structure} onChange={(e) => setStructure(e.target.value)} placeholder="Colle ta table des matières, le déroulé de l'intrigue ou le plan détaillé chapitre par chapitre." /></div>
      <Button onClick={run} disabled={loading} style={{ background: BORDEAUX, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Lancer l'édition structurelle</span>
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

export default DevelopmentalEdit;
