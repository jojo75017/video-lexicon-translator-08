import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Download, Crown, Wand2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const GOLD = '#c9a84c';

const NICHES = [
  { value: 'auto', label: '✨ Auto (IA décide)', prompt: '' },
  { value: 'thriller', label: '🔪 Thriller / Suspense', prompt: 'Cinematic thriller cover — moody chiaroscuro, deep shadows, single dramatic light source, fog or rain, desaturated cold palette with one accent (blood red, neon blue), sense of dread, Fincher / Villeneuve cinematography.' },
  { value: 'business', label: '💼 Business / Productivité', prompt: 'Modern business book cover — sleek minimalist object photography, clean white or deep navy background, high-end editorial typography à la HBR / Penguin Business, premium matte texture, gold or copper accents, Atomic Habits / Sapiens energy.' },
  { value: 'fantasy', label: '🐉 Fantasy / SF', prompt: 'Epic fantasy cover — sweeping painted landscape, ancient ruins or ethereal forest, magical luminescence, dramatic sky, heroic silhouette, ornate medallion foreground, Brandon Sanderson / Tolkien edition style.' },
  { value: 'wellness', label: '🌿 Wellness / Spiritualité', prompt: 'Wellness book cover — serene natural photography, soft golden hour light, organic textures, warm earthy palette (sage, terracotta, cream), zen composition with breathing whitespace, Goop / Mindful aesthetic.' },
  { value: 'romance', label: '💕 Romance', prompt: 'Romance cover — soft cinematic portrait or evocative object, warm dusky lighting, dreamy bokeh, pastel pink/gold/burgundy palette, elegant script accent typography, intimate atmosphere.' },
  { value: 'memoir', label: '📖 Mémoire / Récit de vie', prompt: 'Literary memoir cover — single iconic photographic object or vintage portrait, faded film grain, muted nostalgic palette, classic serif typography, NYT bestseller feel.' },
  { value: 'cuisine', label: '🍴 Cuisine', prompt: 'Cookbook cover — top-down food photography, natural daylight, rustic surface, fresh ingredients, warm appetizing tones, Ottolenghi / Bon Appétit editorial style.' },
  { value: 'horror', label: '👻 Horror / Mystère', prompt: 'Horror cover — unsettling symbolic object, deep blacks, blood red or sickly green accent, decaying texture, gothic atmosphere, Stephen King paperback feel.' },
];

interface PremiumCover {
  url: string;
}

const CoverStudioPro: React.FC = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [niche, setNiche] = useState('auto');
  const [customPrompt, setCustomPrompt] = useState('');
  const [count, setCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [covers, setCovers] = useState<PremiumCover[]>([]);
  const [artDirection, setArtDirection] = useState('');

  const generate = async () => {
    if (!title.trim()) {
      toast.error('Renseigne au moins le titre du livre.');
      return;
    }
    setLoading(true);
    setCovers([]);
    setArtDirection('');
    try {
      const selected = NICHES.find((n) => n.value === niche);
      const { data, error } = await supabase.functions.invoke('generate-premium-cover', {
        body: {
          title: title.trim(),
          subtitle: subtitle.trim(),
          author: author.trim(),
          genre,
          niche,
          registrePrompt: selected?.prompt || '',
          customPrompt: customPrompt.trim(),
          count,
          showAuthor: !!author.trim(),
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const urls: string[] = data?.covers || [];
      if (urls.length === 0) throw new Error('Aucune couverture générée.');
      setCovers(urls.map((url) => ({ url })));
      setArtDirection(data?.artDirection || '');
      toast.success(`${urls.length} couverture(s) premium générée(s) !`);
    } catch (e) {
      console.error(e);
      toast.error((e as Error).message || 'Erreur lors de la génération.');
    } finally {
      setLoading(false);
    }
  };

  const download = async (url: string, idx: number) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `couverture-premium-${idx + 1}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-5 text-white">
      <div
        className="rounded-2xl p-5 border"
        style={{ background: '#161616', borderColor: `${GOLD}33` }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Crown className="h-5 w-5" style={{ color: GOLD }} />
          <h3 className="text-base font-semibold" style={{ color: GOLD }}>
            Cover Studio Pro — Couvertures Premium IA
          </h3>
        </div>
        <p className="text-xs text-white/55">
          Direction artistique automatique + génération photoréaliste haut de gamme (OpenAI gpt-image-2).
          Plusieurs variations d'un coup, qualité « maison d'édition ».
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-white/80 text-xs">Titre du livre *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Le secret des marées" className="bg-[#1c1c1c] border-white/10 text-white" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-white/80 text-xs">Sous-titre</Label>
          <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="(optionnel)" className="bg-[#1c1c1c] border-white/10 text-white" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-white/80 text-xs">Auteur</Label>
          <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="(optionnel)" className="bg-[#1c1c1c] border-white/10 text-white" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-white/80 text-xs">Genre</Label>
          <Input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Thriller, Business, Romance…" className="bg-[#1c1c1c] border-white/10 text-white" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-white/80 text-xs">Direction artistique (preset bestseller)</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {NICHES.map((n) => (
            <button
              key={n.value}
              onClick={() => setNiche(n.value)}
              className="text-left rounded-xl px-3 py-2 text-xs border transition-all"
              style={{
                background: niche === n.value ? `${GOLD}1f` : '#1c1c1c',
                borderColor: niche === n.value ? GOLD : 'rgba(255,255,255,0.08)',
                color: niche === n.value ? GOLD : 'rgba(255,255,255,0.7)',
              }}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-white/80 text-xs flex items-center gap-1">
          <Wand2 className="h-3.5 w-3.5" /> Précisions créatives (optionnel)
        </Label>
        <Textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Ex: ambiance bord de mer breton, brume, phare au loin…"
          rows={2}
          className="bg-[#1c1c1c] border-white/10 text-white resize-none"
        />
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-1.5">
          <Label className="text-white/80 text-xs">Nombre de variations</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((c) => (
              <button
                key={c}
                onClick={() => setCount(c)}
                className="w-9 h-9 rounded-lg text-sm font-semibold border transition-all"
                style={{
                  background: count === c ? `${GOLD}1f` : '#1c1c1c',
                  borderColor: count === c ? GOLD : 'rgba(255,255,255,0.08)',
                  color: count === c ? GOLD : 'rgba(255,255,255,0.7)',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={generate}
          disabled={loading}
          className="ml-auto"
          style={{ background: GOLD, color: '#161616' }}
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Génération…</>
          ) : (
            <><Sparkles className="h-4 w-4 mr-2" /> Générer mes couvertures premium</>
          )}
        </Button>
      </div>

      {artDirection && (
        <div className="rounded-xl p-3 border text-xs text-white/60 italic" style={{ background: '#161616', borderColor: `${GOLD}22` }}>
          <span className="not-italic font-semibold" style={{ color: GOLD }}>Direction artistique : </span>
          {artDirection}
        </div>
      )}

      {covers.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {covers.map((c, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden border" style={{ background: '#161616', borderColor: `${GOLD}22` }}>
              <img src={c.url} alt={`Couverture premium ${idx + 1}`} className="w-full aspect-[2/3] object-cover" loading="lazy" />
              <div className="p-3 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Test miniature 200x300 (lisibilité Amazon) */}
                  <img src={c.url} alt="Miniature Amazon" className="w-[60px] h-[90px] object-cover rounded shadow" />
                  <div className="text-[10px] text-white/45 flex items-center gap-1">
                    <Eye className="h-3 w-3" /> Test miniature Amazon — le titre reste-t-il lisible ?
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => download(c.url, idx)}
                  className="w-full border-white/15 text-white hover:bg-white/10"
                >
                  <Download className="h-4 w-4 mr-2" /> Télécharger
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoverStudioPro;
