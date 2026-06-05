import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const TEAL = '#008296';

const STYLES = ['professional', 'modern', 'literary', 'vintage', 'romance', 'thriller'];

interface Variant { id: number; style: string; url?: string; error?: boolean; }

const CoverVariantsThumbnail: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('non-fiction');
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);

  const run = async () => {
    if (!title.trim()) return toast.error('Indique le titre du livre.');
    setLoading(true);
    setVariants(STYLES.map((s, i) => ({ id: i + 1, style: s })));
    const openaiApiKey = localStorage.getItem('openai_real_api_key') || undefined;
    const openrouterKey = localStorage.getItem('openrouter_image_api_key') || undefined;

    await Promise.all(STYLES.map(async (style, idx) => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-front-cover', {
          body: { ebookTitle: title, authorName: author || 'Auteur', genre, style, variation: idx + 1,
                  coverType: 'front', useOpenAI: !!openaiApiKey, openaiApiKey, openrouterKey },
        });
        if (error || !data?.imageUrl) throw new Error(error?.message || 'Pas d’image');
        setVariants((prev) => prev.map((v) => v.id === idx + 1 ? { ...v, url: data.imageUrl } : v));
      } catch {
        setVariants((prev) => prev.map((v) => v.id === idx + 1 ? { ...v, error: true } : v));
      }
    }));
    setLoading(false);
    toast.success('Variantes générées — vérifie la lisibilité en miniature.');
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Génère 6 variantes de couverture et compare-les en miniature 200×300 px (taille réelle dans les
        résultats Amazon) pour valider la lisibilité du titre.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <div><Label className="text-xs">Titre *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label className="text-xs">Auteur</Label><Input value={author} onChange={(e) => setAuthor(e.target.value)} /></div>
        <div>
          <Label className="text-xs">Genre</Label>
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {['non-fiction', 'fiction', 'romance', 'thriller', 'développement personnel', 'jeunesse', 'cuisine'].map((g) =>
                <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={run} disabled={loading} style={{ background: TEAL, color: 'white' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer 6 variantes</span>
      </Button>

      {variants.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {variants.map((v) => (
            <Card key={v.id} className="border-joy-ink/10 overflow-hidden">
              <CardContent className="p-2">
                <div className="w-full aspect-[2/3] rounded bg-joy-ink/5 flex items-center justify-center overflow-hidden mb-1">
                  {v.url ? (
                    <img src={v.url} alt={`Variante ${v.id} (${v.style})`} className="w-full h-full object-cover" />
                  ) : v.error ? (
                    <span className="text-[10px] text-red-500 px-1 text-center">Échec</span>
                  ) : (
                    <Loader2 className="h-5 w-5 animate-spin text-joy-ink/30" />
                  )}
                </div>
                <div className="text-[10px] text-center text-joy-ink/60 capitalize">{v.style}</div>
                {v.url && (
                  <a href={v.url} download={`couverture-${v.style}.png`}
                    className="mt-1 flex items-center justify-center gap-1 text-[10px]" style={{ color: TEAL }}>
                    <Download className="h-3 w-3" /> Télécharger
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoverVariantsThumbnail;
