import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Copy, Library } from 'lucide-react';
import { toast } from 'sonner';
import { callAIWriting } from '@/services/aiWritingService';

const BORDEAUX = '#9B2335';

/**
 * Charte de Collection — définit une collection éditoriale cohérente
 * (ton, format, gabarit couverture, mentions) réutilisable sur plusieurs titres.
 */
const CollectionCharter: React.FC = () => {
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('');
  const [audience, setAudience] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const run = async () => {
    if (!theme.trim()) return toast.error('Indique au moins le thème de la collection.');
    setLoading(true); setOutput('');
    try {
      const prompt = `Tu es directeur de collection en maison d'édition. Tu rédiges une CHARTE DE COLLECTION : un document de référence qui garantit la cohérence de tous les titres d'une même collection.

${name ? `Nom de collection proposé : ${name}` : 'Propose 3 noms de collection percutants.'}
Thème / ligne éditoriale : ${theme}
${audience ? `Public visé : ${audience}` : ''}

Rends en français une charte structurée et réutilisable :

1. IDENTITÉ DE COLLECTION — nom${name ? '' : ' (3 propositions)'}, promesse de lecture en une phrase, manifeste court (3-4 lignes).
2. LIGNE ÉDITORIALE — thèmes acceptés / refusés, ton, niveau de langue, longueur cible.
3. GABARIT VISUEL — direction artistique de couverture commune (palette, typographie, composition, emplacement du logo de collection) pour qu'on reconnaisse la collection en rayon.
4. NORMES DE FABRICATION — format(s), structure type (préface, sommaire, pages de fin), mentions obligatoires.
5. CHARTE DE MÉTADONNÉES — schéma de titre/sous-titre, mots-clés et catégories types récurrents.
6. CHECKLIST D'ADMISSION — 6 critères pour valider qu'un nouveau titre entre dans la collection.

Format texte clair avec sauts de ligne, sans balises HTML.`;
      const raw = await callAIWriting(prompt, { temperature: 0.7 });
      setOutput(raw.trim());
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70 flex items-center gap-1.5">
        <Library className="h-4 w-4" style={{ color: BORDEAUX }} />
        Bâtis une collection éditoriale cohérente, réutilisable sur plusieurs titres.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Nom de collection (optionnel)</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Laisse vide pour des propositions" /></div>
        <div><Label className="text-xs">Public visé</Label><Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Entrepreneurs, ados, parents…" /></div>
      </div>
      <div><Label className="text-xs">Thème / ligne éditoriale *</Label><Textarea rows={4} value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Ex. : guides pratiques de productivité pour solopreneurs." /></div>
      <Button onClick={run} disabled={loading} style={{ background: BORDEAUX, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer la charte de collection</span>
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

export default CollectionCharter;
