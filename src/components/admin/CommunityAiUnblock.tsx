import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy, Wand2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const TEAL = '#008296';

/**
 * Assistant IA Débloquage KDP.
 * À partir du blocage décrit par l'abonné, génère une solution KDP concrète
 * (étapes + modèle d'email au support si besoin) et propose l'outil interne adapté.
 */

// Mapping mots-clés -> outil interne du générateur.
const TOOL_ROUTES: { keywords: RegExp; label: string; to: string }[] = [
  { keywords: /conformit|interdit|bloqu|refus.*contenu|policy|enfreint/i, label: 'Vérificateur de Conformité Contenu', to: '/hub-v3' },
  { keywords: /couvertur|cover|jaquette|dos|spine/i, label: 'Couverture KDP Exacte', to: '/couverture-kdp' },
  { keywords: /prix|pricing|royalt|redevance|paiement/i, label: 'Auto-Pricing & Royalties', to: '/hub-v3' },
  { keywords: /mot.?cl|keyword|catégor|ranking|référenc/i, label: 'Recherche de mots-clés', to: '/kdp-keywords' },
  { keywords: /mise en forme|format|epub|manuscrit|conversion/i, label: 'Convertisseur Manuscrit', to: '/hub-v3' },
  { keywords: /niche|marché|idée|sujet/i, label: 'Explorer les niches', to: '/niches' },
];

function pickTool(text: string) {
  return TOOL_ROUTES.find((t) => t.keywords.test(text)) || null;
}

const CommunityAiUnblock: React.FC = () => {
  const navigate = useNavigate();
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [tool, setTool] = useState<{ label: string; to: string } | null>(null);

  const run = async () => {
    if (problem.trim().length < 8) return toast.error('Décris ton blocage (au moins quelques mots).');
    setLoading(true); setOutput(''); setTool(null);
    try {
      const prompt = `Tu es un expert Amazon KDP qui aide un auteur à débloquer une situation. Réponds en français, de façon concrète et actionnable.

Blocage décrit par l'auteur :
"""${problem.trim()}"""

Donne :
1. DIAGNOSTIC — en 1-2 phrases, ce qui se passe probablement.
2. SOLUTION ÉTAPE PAR ÉTAPE — liste numérotée d'actions précises à faire dans KDP.
3. MODÈLE D'EMAIL AU SUPPORT KDP — uniquement si un contact support est pertinent (sinon écris « Pas besoin de contacter le support »). Email court, poli, en français, prêt à copier.
4. POUR ÉVITER QUE ÇA SE REPRODUISE — 2 conseils.

Format texte clair avec sauts de ligne, sans balises HTML.`;
      const raw = await callAIWriting(prompt, { temperature: 0.6 });
      setOutput(raw.trim());
      setTool(pickTool(problem));
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70 flex items-center gap-1.5">
        <Wand2 className="h-4 w-4" style={{ color: TEAL }} />
        Décris ton blocage KDP : l'IA génère une solution concrète (étapes + email support) et te dirige vers le bon outil.
      </p>
      <div>
        <Label className="text-xs">Ton blocage / ta question KDP *</Label>
        <Textarea
          rows={4}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Ex : Mon livre a été bloqué pour « contenu non conforme » et je ne comprends pas pourquoi…"
        />
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Débloquer avec l'IA</span>
      </Button>
      {output && (
        <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-3">
          <Textarea rows={16} value={output} onChange={(e) => setOutput(e.target.value)} className="text-xs" />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-1.5"
              onClick={() => { navigator.clipboard.writeText(output); toast.success('Copié ✓'); }}>
              <Copy className="h-3.5 w-3.5" /> Copier
            </Button>
            {tool && (
              <Button size="sm" className="gap-1.5" style={{ background: TEAL, color: 'white' }}
                onClick={() => navigate(tool.to)}>
                {tool.label} <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </CardContent></Card>
      )}
    </div>
  );
};

export default CommunityAiUnblock;
