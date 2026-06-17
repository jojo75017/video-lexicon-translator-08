import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy, CheckCircle2, FileCode } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const BLEU = '#1D4ED8';

const STATIC_CHECKS = [
  'Métadonnées OPF complètes (titre, auteur, langue, identifiant, date)',
  'Table des matières navigable (nav.xhtml EPUB 3 + NCX de secours)',
  'Couverture déclarée (properties="cover-image") et < 5 Mo',
  'Hiérarchie des titres cohérente (h1 unique, h2/h3 imbriqués)',
  'Pas de styles inline excessifs — CSS externe propre',
  'Images en JPG/PNG optimisées, avec attribut alt',
  'Langue déclarée (xml:lang) sur <html> et passages étrangers',
  'Aucune police DRM/non-embarquable problématique',
  'Validation EPUBCheck sans erreur bloquante',
];

/**
 * Export EPUB Normé — checklist EPUB 3 + audit IA d'un sommaire/structure collés.
 */
const EpubNormalizer: React.FC = () => {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [structure, setStructure] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const toggle = (i: number) => setChecked((c) => ({ ...c, [i]: !c[i] }));
  const doneCount = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneCount / STATIC_CHECKS.length) * 100);

  const run = async () => {
    if (!structure.trim()) return toast.error('Colle la structure / le sommaire à analyser.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es expert en conformité EPUB 3. Analyse la structure de livre numérique suivante (sommaire / arborescence / métadonnées collées par l'utilisateur) et signale les problèmes de conformité EPUB 3 pour une diffusion wide.

STRUCTURE FOURNIE :
${structure}

Réponds en français, sans HTML :
1. PROBLÈMES DÉTECTÉS — liste des non-conformités probables (hiérarchie de titres, sommaire, métadonnées manquantes, etc.).
2. CORRECTIFS CONCRETS — pour chaque problème, l'action précise à faire.
3. SOMMAIRE NORMALISÉ — propose une table des matières propre et hiérarchisée prête pour EPUB 3.
4. VERDICT — « Conforme », « À corriger » ou « Non conforme » avec une phrase de justification.`;
      const raw = await callAIWriting(prompt, { temperature: 0.4 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-joy-ink/70 flex items-center gap-1.5">
        <FileCode className="h-4 w-4" style={{ color: BLEU }} />
        Vérifiez la conformité EPUB 3 exigée par les plateformes wide.
      </p>

      <Card className="border-joy-ink/10">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold">Checklist EPUB 3</span>
            <span style={{ color: BLEU }}>{doneCount}/{STATIC_CHECKS.length} · {pct}%</span>
          </div>
          <div className="h-1.5 rounded bg-joy-ink/10 overflow-hidden">
            <div className="h-full" style={{ width: `${pct}%`, background: BLEU }} />
          </div>
          <ul className="space-y-1.5 pt-1">
            {STATIC_CHECKS.map((c, i) => (
              <li key={i}>
                <button onClick={() => toggle(i)} className="flex items-start gap-2 text-xs text-left w-full">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: checked[i] ? BLEU : '#cbd5e1' }} />
                  <span className={checked[i] ? 'line-through text-joy-ink/50' : ''}>{c}</span>
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div>
        <Label className="text-xs">Structure / sommaire / métadonnées à auditer</Label>
        <Textarea rows={6} value={structure} onChange={(e) => setStructure(e.target.value)}
          placeholder="Colle ici ton sommaire, l'arborescence des chapitres ou tes métadonnées…" />
      </div>
      <Button onClick={run} disabled={loading} style={{ background: BLEU, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Auditer la conformité EPUB 3</span>
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

export default EpubNormalizer;
