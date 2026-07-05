import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Download, Crown, Wand2, Eye, BookOpen, CheckCircle2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getOpenRouterImageKey, setOpenRouterImageKey } from '@/lib/ebookExportOptions';

const GOLD = '#a8842c';

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

interface BookRow {
  id: string;
  title: string;
  author_name: string | null;
  book_summary: string | null;
  target_audience: string | null;
  tone: string | null;
  kdp_categories: string | null;
}

const CoverStudioPro: React.FC = () => {
  const [books, setBooks] = useState<BookRow[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [loadingBooks, setLoadingBooks] = useState(true);

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
  const [orKey, setOrKey] = useState(getOpenRouterImageKey());
  const [useOpenRouter, setUseOpenRouter] = useState(!!getOpenRouterImageKey());

  const applyBook = (b: BookRow) => {
    setTitle(b.title || '');
    setAuthor((b.author_name || '').trim());
    setGenre((b.kdp_categories?.split(/[,;•\n]/)[0] || b.target_audience || '').trim());
    setCustomPrompt((b.book_summary || '').trim());
  };

  // Charge automatiquement les livres de l'utilisateur (données pré-remplies).
  useEffect(() => {
    (async () => {
      setLoadingBooks(true);
      try {
        const { data, error } = await supabase
          .from('ebook_projects')
          .select('id, title, author_name, book_summary, target_audience, tone, kdp_categories')
          .order('updated_at', { ascending: false })
          .limit(30);
        if (error) throw error;
        const rows = (data || []).filter((b) => b.title?.trim()) as BookRow[];
        setBooks(rows);
        if (rows.length > 0) {
          setSelectedBookId(rows[0].id);
          applyBook(rows[0]);
        }
      } catch {
        // silencieux : l'utilisateur peut toujours saisir manuellement
      } finally {
        setLoadingBooks(false);
      }
    })();
  }, []);

  const onSelectBook = (id: string) => {
    setSelectedBookId(id);
    const b = books.find((x) => x.id === id);
    if (b) applyBook(b);
  };

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
          openrouterKey: useOpenRouter ? orKey.trim() : undefined,
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
      let href = url;
      let isBlob = false;
      if (url.startsWith('http')) {
        // Ajoute un cache-buster pour éviter les soucis de cache CORS.
        const res = await fetch(url, { mode: 'cors', cache: 'no-store' });
        if (!res.ok) throw new Error('fetch failed');
        const blob = await res.blob();
        href = URL.createObjectURL(blob);
        isBlob = true;
      } else if (url.startsWith('data:')) {
        const res = await fetch(url);
        const blob = await res.blob();
        href = URL.createObjectURL(blob);
        isBlob = true;
      }
      const link = document.createElement('a');
      link.href = href;
      link.download = `couverture-premium-${idx + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (isBlob) setTimeout(() => URL.revokeObjectURL(href), 4000);
    } catch {
      window.open(url, '_blank');
      toast.info("Ouverture dans un nouvel onglet — clic droit puis « Enregistrer l'image ».");
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-5 border border-border bg-muted/40">
        <div className="flex items-center gap-2 mb-1">
          <Crown className="h-5 w-5" style={{ color: GOLD }} />
          <h3 className="text-base font-semibold" style={{ color: GOLD }}>
            Cover Studio Pro — Couvertures Premium IA
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Direction artistique automatique + génération photoréaliste haut de gamme (OpenAI gpt-image-2).
          Plusieurs variations d'un coup, qualité « maison d'édition ».
        </p>
      </div>

      {/* Sélecteur de livre — données pré-remplies automatiquement */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <Label className="text-xs font-medium flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" style={{ color: GOLD }} />
          Livre à habiller — les informations sont récupérées automatiquement
        </Label>
        {loadingBooks ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Chargement de tes livres…
          </div>
        ) : books.length > 0 ? (
          <>
            <Select value={selectedBookId} onValueChange={onSelectBook}>
              <SelectTrigger>
                <SelectValue placeholder="Choisis un livre" />
              </SelectTrigger>
              <SelectContent>
                {books.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Titre, genre et résumé chargés. Vérifie juste le nom de l'auteur.
            </p>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            Aucun livre trouvé — saisis les informations manuellement ci-dessous.
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Titre du livre *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Le secret des marées" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Sous-titre</Label>
          <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="(optionnel)" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs flex items-center gap-1">
            Nom de l'auteur
            <span className="text-[10px]" style={{ color: GOLD }}>← à compléter</span>
          </Label>
          <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Ton nom d'auteur" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Genre</Label>
          <Input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Thriller, Business, Romance…" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Direction artistique (preset bestseller)</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {NICHES.map((n) => (
            <button
              key={n.value}
              onClick={() => setNiche(n.value)}
              className={`text-left rounded-xl px-3 py-2 text-xs border transition-all ${
                niche === n.value
                  ? 'border-transparent'
                  : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted'
              }`}
              style={
                niche === n.value
                  ? { background: `${GOLD}1f`, borderColor: GOLD, color: GOLD }
                  : undefined
              }
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs flex items-center gap-1">
          <Wand2 className="h-3.5 w-3.5" /> Résumé / précisions créatives
        </Label>
        <Textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Ex: ambiance bord de mer breton, brume, phare au loin…"
          rows={3}
          className="resize-none"
        />
        <p className="text-[11px] text-muted-foreground">
          Pré-rempli avec le résumé de ton livre — l'IA s'en sert pour la direction artistique.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-1.5">
          <Label className="text-xs">Nombre de variations</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((c) => (
              <button
                key={c}
                onClick={() => setCount(c)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold border transition-all ${
                  count === c ? 'border-transparent' : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted'
                }`}
                style={count === c ? { background: `${GOLD}1f`, borderColor: GOLD, color: GOLD } : undefined}
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
          style={{ background: GOLD, color: '#fff' }}
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Génération…</>
          ) : (
            <><Sparkles className="h-4 w-4 mr-2" /> Générer mes couvertures premium</>
          )}
        </Button>
      </div>

      {artDirection && (
        <div className="rounded-xl p-3 border border-border bg-muted/40 text-xs text-muted-foreground italic">
          <span className="not-italic font-semibold" style={{ color: GOLD }}>Direction artistique : </span>
          {artDirection}
        </div>
      )}

      {covers.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {covers.map((c, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden border border-border bg-card">
              <img src={c.url} alt={`Couverture premium ${idx + 1}`} className="w-full aspect-[2/3] object-cover" loading="lazy" />
              <div className="p-3 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={c.url} alt="Miniature Amazon" className="w-[60px] h-[90px] object-cover rounded shadow" />
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Eye className="h-3 w-3" /> Test miniature Amazon — le titre reste-t-il lisible ?
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => download(c.url, idx)}
                  className="w-full"
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
