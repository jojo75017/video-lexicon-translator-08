import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy, Quote } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const TEAL = '#008296';

/**
 * Avis Éditoriaux (Editorial Reviews).
 * Génère des citations d'avis professionnels pour la section « Editorial Reviews »
 * de la fiche Amazon — distincte des avis lecteurs.
 */
const EditorialReviews: React.FC = () => {
  const [title, setTitle] = useState('');
  const [niche, setNiche] = useState('');
  const [summary, setSummary] = useState('');
  const [count, setCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!title.trim() || !niche.trim()) return toast.error('Titre et niche requis.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es éditeur professionnel. Rédige ${count} citations d'avis éditoriaux ("Editorial Reviews") pour la fiche Amazon d'un livre. Ce sont des avis professionnels (presse, experts, blogs spécialisés, pairs), DISTINCTS des avis lecteurs.

Livre : "${title}"
Niche : ${niche}
${summary ? `Résumé / angle : ${summary}` : ''}

Pour chaque avis :
- 2 à 4 phrases percutantes, ton crédible et professionnel
- Met en avant un bénéfice ou une qualité différente à chaque fois
- Signe avec un attributaire RÉALISTE et générique (ex : « — Magazine spécialisé en [domaine] », « — Auteur à succès du genre », « — Blog de référence [thème] »). N'invente JAMAIS de vraie personne ni de vrai média existant.

Termine par une note : « ⚠️ Ces citations sont des modèles. Faites-les valider/attribuer par de vrais relecteurs ou partenaires avant publication sur Amazon. »

Format texte clair avec sauts de ligne, sans balises HTML.`;
      const raw = await callAIWriting(prompt, { temperature: 0.8 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70 flex items-center gap-1.5">
        <Quote className="h-4 w-4" style={{ color: TEAL }} />
        Génère des citations d'avis professionnels pour la section « Editorial Reviews » (≠ avis lecteurs).
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Niche *</Label><Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Cuisine, fantasy, finance…" /></div>
        <div className="sm:col-span-2"><Label className="text-xs">Résumé / angle</Label><Input value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="optionnel" /></div>
        <div>
          <Label className="text-xs">Nombre d'avis</Label>
          <select value={count} onChange={(e) => setCount(Number(e.target.value))}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
            {[3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer les avis éditoriaux</span>
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

export default EditorialReviews;
