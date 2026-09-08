import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Loader2, Sparkles, Download, Crown, Wand2, Eye, BookOpen, CheckCircle2, KeyRound,
  Type, ImageIcon, AlertTriangle, Save, ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  getOpenRouterImageKey,
  setOpenRouterImageKey,
  getIdeogramKey,
  setIdeogramKey,
} from '@/lib/ebookExportOptions';
import {
  buildStudioComposition,
  COVER_IMAGE_STYLES,
  getImageStyle,
  TEXT_PLACEMENTS,
  type TextPlacement,
} from '@/lib/cover-editor/studioProCover';
import { exportFrontPng, renderFrontCanvas, safeFileName } from '@/lib/cover-editor/coverExports';

const GOLD = '#a8842c';

const NICHES = [
  { value: 'auto', label: '✨ Auto (IA décide)', prompt: '' },
  { value: 'thriller', label: '🔪 Thriller / Suspense', prompt: 'Cinematic thriller cover — moody chiaroscuro, deep shadows, single dramatic light source, fog or rain, desaturated cold palette with one accent (blood red, neon blue), sense of dread, Fincher / Villeneuve cinematography.' },
  { value: 'policier', label: '🕵️ Policier / Enquête', prompt: 'Crime and detective novel cover — nocturnal city street or clue-laden object, wet asphalt reflections, street-lamp glow, cold blue-grey palette with a single warm accent, investigative tension, classic Série Noire elegance.' },
  { value: 'business', label: '💼 Business / Productivité', prompt: 'Modern business book cover — sleek minimalist object photography, clean white or deep navy background, high-end editorial typography à la HBR / Penguin Business, premium matte texture, gold or copper accents, Atomic Habits / Sapiens energy.' },
  { value: 'devperso', label: '🚀 Développement personnel', prompt: 'Personal-growth book cover — luminous uplifting composition, single strong metaphorical symbol (path, sunrise, open door), bright confident palette with gold accent, large calm areas for typography, best-seller self-help clarity.' },
  { value: 'fantasy', label: '🐉 Fantasy / SF', prompt: 'Epic fantasy cover — sweeping painted landscape, ancient ruins or ethereal forest, magical luminescence, dramatic sky, heroic silhouette, ornate medallion foreground, Brandon Sanderson / Tolkien edition style.' },
  { value: 'historique', label: '🏛️ Historique', prompt: 'Historical novel cover — period-accurate setting and costume, museum-quality painted rendering, aged parchment and sepia tones with deep crimson or navy accent, monumental architecture or landscape, dignified literary atmosphere.' },
  { value: 'jeunesse', label: '🧒 Jeunesse / album enfants', prompt: 'Children picture-book cover — endearing expressive character, warm cheerful palette, soft rounded shapes, gentle depth, wonder and safety, ages 3 to 8, absolutely no frightening element.' },
  { value: 'wellness', label: '🌿 Wellness / Spiritualité', prompt: 'Wellness book cover — serene natural photography, soft golden hour light, organic textures, warm earthy palette (sage, terracotta, cream), zen composition with breathing whitespace, Goop / Mindful aesthetic.' },
  { value: 'sante', label: '💪 Santé / Sport', prompt: 'Health and fitness book cover — energetic clean composition, healthy natural light, fresh vivid palette (green, white, deep blue), motion or vitality suggested, modern sports-science credibility, no clutter.' },
  { value: 'romance', label: '💕 Romance', prompt: 'Romance cover — soft cinematic portrait or evocative object, warm dusky lighting, dreamy bokeh, pastel pink/gold/burgundy palette, elegant script accent typography, intimate atmosphere.' },
  { value: 'memoir', label: '📖 Mémoire / Récit de vie', prompt: 'Literary memoir cover — single iconic photographic object or vintage portrait, faded film grain, muted nostalgic palette, classic serif typography, NYT bestseller feel.' },
  { value: 'cuisine', label: '🍴 Cuisine', prompt: 'Cookbook cover — top-down food photography, natural daylight, rustic surface, fresh ingredients, warm appetizing tones, Ottolenghi / Bon Appétit editorial style.' },
  { value: 'horror', label: '👻 Horror / Mystère', prompt: 'Horror cover — unsettling symbolic object, deep blacks, blood red or sickly green accent, decaying texture, gothic atmosphere, Stephen King paperback feel.' },
];

// Modèles d'images disponibles via OpenRouter (BYOK).
const OR_IMAGE_MODELS = [
  { id: 'google/gemini-3-pro-image', label: '⭐ Gemini 3 Pro Image (meilleure qualité)' },
  { id: 'google/gemini-3.1-flash-image', label: '⚡ Gemini 3.1 Flash Image (rapide, très bon)' },
  { id: 'google/gemini-3.1-flash-lite-image', label: '💸 Gemini 3.1 Flash Lite Image (le moins cher)' },
];
const OR_MODEL_LS = 'openrouter_image_model';
const isKnownOrModel = (id: string) => OR_IMAGE_MODELS.some((m) => m.id === id);

type TextMode = 'app' | 'ai';

interface PremiumCover {
  url: string;
  /** Aperçu composé localement (illustration + textes nets). */
  composedPreview?: string;
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

/** Récupère l'image en local pour pouvoir dessiner dessus sans blocage CORS. */
const toLocalUrl = async (url: string): Promise<string> => {
  if (url.startsWith('blob:')) return url;
  const res = await fetch(url, { mode: 'cors', cache: 'no-store' });
  if (!res.ok) throw new Error('illustration inaccessible');
  return URL.createObjectURL(await res.blob());
};

const triggerDownload = (blob: Blob, fileName: string) => {
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(href), 4000);
};

const CoverStudioPro: React.FC = () => {
  const [books, setBooks] = useState<BookRow[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [loadingBooks, setLoadingBooks] = useState(true);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [niche, setNiche] = useState('auto');
  const [imageStyle, setImageStyle] = useState('photo');
  const [textMode, setTextMode] = useState<TextMode>('app');
  const [placement, setPlacement] = useState<TextPlacement>('top');
  const [customPrompt, setCustomPrompt] = useState('');
  const [count, setCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [covers, setCovers] = useState<PremiumCover[]>([]);
  const [artDirection, setArtDirection] = useState('');
  const [orKey, setOrKey] = useState(getOpenRouterImageKey());
  const [useOpenRouter, setUseOpenRouter] = useState(!!getOpenRouterImageKey());
  const [orModel, setOrModel] = useState<string>(() => {
    const saved = localStorage.getItem(OR_MODEL_LS) || '';
    return isKnownOrModel(saved) ? saved : OR_IMAGE_MODELS[0].id;
  });
  const [orStatus, setOrStatus] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle');
  const [ideoKey, setIdeoKey] = useState(getIdeogramKey());
  const [engineUsed, setEngineUsed] = useState('');
  const [composing, setComposing] = useState(false);
  const [composeError, setComposeError] = useState('');
  const [orCredits, setOrCredits] = useState<string>('');
  const [savedIds, setSavedIds] = useState<Record<number, string>>({});
  const [savingIdx, setSavingIdx] = useState<number | null>(null);
  const navigate = useNavigate();


  /** URLs locales des illustrations, pour composer et exporter sans CORS. */
  const localUrls = useRef<Record<string, string>>({});

  const noText = textMode === 'app';

  const testOpenRouterKey = async () => {
    const key = orKey.trim();
    if (!key.startsWith('sk-or-')) {
      setOrStatus('invalid');
      toast.error('La clé doit commencer par sk-or-');
      return;
    }
    setOrStatus('testing');
    setOrCredits('');
    try {
      const res = await fetch('https://openrouter.ai/api/v1/key', {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (!res.ok) {
        setOrStatus('invalid');
        toast.error('Clé OpenRouter invalide ou refusée.');
        return;
      }
      const json = await res.json();
      const limit = json?.data?.limit;
      const usage = json?.data?.usage;
      if (typeof limit === 'number' && typeof usage === 'number') {
        setOrCredits(`$${Math.max(0, limit - usage).toFixed(2)} restants`);
      } else if (json?.data?.is_free_tier) {
        setOrCredits('Compte gratuit');
      }
      setOrStatus('valid');
      toast.success('Clé OpenRouter valide ✔');
    } catch {
      setOrStatus('invalid');
      toast.error('Impossible de vérifier la clé (réseau).');
    }
  };

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

  /** Illustration locale (mémorisée) pour composer et exporter. */
  const ensureLocalUrl = useCallback(async (url: string): Promise<string> => {
    const cached = localUrls.current[url];
    if (cached) return cached;
    const local = await toLocalUrl(url);
    localUrls.current[url] = local;
    return local;
  }, []);

  /** Recompose les aperçus (illustration + textes nets) en mode « texte posé par l'app ». */
  useEffect(() => {
    if (covers.length === 0) return;
    if (textMode !== 'app') {
      setCovers((prev) => prev.map((c) => ({ url: c.url })));
      setComposeError('');
      return;
    }
    let cancelled = false;
    (async () => {
      setComposing(true);
      setComposeError('');
      try {
        const composition = buildStudioComposition({ title, subtitle, author, placement });
        const previews = await Promise.all(
          covers.map(async (c) => {
            const local = await ensureLocalUrl(c.url);
            const canvas = await renderFrontCanvas(composition, local, 600, 960);
            return canvas.toDataURL('image/jpeg', 0.9);
          }),
        );
        if (cancelled) return;
        setCovers((prev) => prev.map((c, i) => ({ ...c, composedPreview: previews[i] })));
      } catch {
        if (!cancelled) {
          setComposeError(
            "L'aperçu avec les textes n'a pas pu être calculé. Téléchargez l'illustration seule, puis posez les textes dans l'éditeur de couverture.",
          );
        }
      } finally {
        if (!cancelled) setComposing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [covers.length, textMode, placement, title, subtitle, author, ensureLocalUrl]);

  const generate = async () => {
    if (!title.trim()) {
      toast.error('Renseigne au moins le titre du livre.');
      return;
    }
    setLoading(true);
    setCovers([]);
    setArtDirection('');
    setComposeError('');
    try {
      const selected = NICHES.find((n) => n.value === niche);
      const style = getImageStyle(imageStyle);
      const registrePrompt = [selected?.prompt || '', style.prompt].filter(Boolean).join(' ');
      const { data, error } = await supabase.functions.invoke('generate-premium-cover', {
        body: {
          title: title.trim(),
          subtitle: subtitle.trim(),
          author: author.trim(),
          genre,
          niche,
          registrePrompt,
          customPrompt: customPrompt.trim(),
          count,
          showAuthor: !!author.trim(),
          openrouterKey: useOpenRouter ? orKey.trim() : undefined,
          openrouterModel: useOpenRouter ? orModel : undefined,
          ideogramKey: ideoKey.trim() || undefined,
          noText,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const urls: string[] = data?.covers || [];
      if (urls.length === 0) throw new Error('Aucune couverture générée.');
      setCovers(urls.map((url) => ({ url })));
      setArtDirection(data?.artDirection || '');
      setEngineUsed(data?.engine || '');
      toast.success(
        data?.engine === 'ideogram'
          ? `${urls.length} couverture(s) générée(s) en qualité pro (Ideogram) !`
          : `${urls.length} couverture(s) premium générée(s) !`,
      );
    } catch (e) {
      console.error(e);
      toast.error((e as Error).message || 'Erreur lors de la génération.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Enregistre l'image dans « Mes couvertures » (stockage privé + projet).
   * Renvoie aussi un lien signé, utilisable pour le téléchargement.
   */
  const saveToLibrary = async (
    url: string,
    idx: number,
    opts?: { silent?: boolean },
  ): Promise<{ projectId: string; signedUrl: string | null } | null> => {
    setSavingIdx(idx);
    try {
      const { data, error } = await supabase.functions.invoke('cover-studio-save-image', {
        body: {
          imageUrl: url,
          projectId: savedIds[idx] || undefined,
          bookTitle: title.trim(),
          projectName: title.trim() || `Couverture premium ${idx + 1}`,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const projectId = data?.projectId as string;
      setSavedIds((prev) => ({ ...prev, [idx]: projectId }));
      if (!opts?.silent) toast.success('Image enregistrée dans « Mes couvertures ».');
      return { projectId, signedUrl: (data?.signedUrl as string) || null };
    } catch (e) {
      if (!opts?.silent) {
        toast.error((e as Error).message || "L'image n'a pas pu être enregistrée.");
      }
      return null;
    } finally {
      setSavingIdx(null);
    }
  };

  /** Illustration seule, telle que produite par le moteur. */
  const downloadIllustration = async (url: string, idx: number) => {
    const fileName = `illustration-couverture-${idx + 1}.png`;
    try {
      const res = await fetch(url, { mode: 'cors', cache: 'no-store' });
      if (!res.ok) throw new Error('fetch failed');
      triggerDownload(await res.blob(), fileName);
      return;
    } catch {
      /* lien du moteur inaccessible : on passe par une copie enregistrée */
    }
    const saved = await saveToLibrary(url, idx, { silent: true });
    if (saved?.signedUrl) {
      try {
        const res = await fetch(saved.signedUrl, { cache: 'no-store' });
        if (!res.ok) throw new Error('fetch failed');
        triggerDownload(await res.blob(), fileName);
        toast.success('Image téléchargée et enregistrée dans « Mes couvertures ».');
        return;
      } catch {
        /* on tente l'ouverture directe ci-dessous */
      }
      window.open(saved.signedUrl, '_blank');
      toast.info("Ouverture dans un nouvel onglet — clic droit puis « Enregistrer l'image ».");
      return;
    }
    toast.error("L'image n'a pas pu être récupérée. Relancez la génération.");
  };


  /** Couverture finale : illustration + titre, sous-titre et auteur en typographie nette. */
  const downloadComposed = async (url: string) => {
    try {
      const local = await ensureLocalUrl(url);
      const composition = buildStudioComposition({ title, subtitle, author, placement });
      const result = await exportFrontPng(composition, local, title);
      triggerDownload(result.blob, safeFileName(title, 'couverture-premium', 'png'));
      toast.success(`Couverture téléchargée · ${result.width} × ${result.height} px`);
    } catch {
      toast.error("Le fichier n'a pas pu être créé. Téléchargez l'illustration seule.");
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
          L'IA dessine l'illustration, l'application pose votre titre, votre sous-titre et votre nom
          d'auteur en typographie parfaitement nette. Plusieurs variations d'un coup, qualité
          « maison d'édition ».
        </p>
      </div>

      {/* 1. Textes du livre — bien visibles, en premier */}
      <div className="rounded-xl border-2 p-4 space-y-4" style={{ borderColor: GOLD }}>
        <Label className="text-sm font-semibold flex items-center gap-1.5" style={{ color: GOLD }}>
          <Type className="h-4 w-4" /> 1. Les textes de votre couverture
        </Label>

        {loadingBooks ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Chargement de vos livres…
          </div>
        ) : books.length > 0 ? (
          <div className="space-y-1.5">
            <Label className="text-xs flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" style={{ color: GOLD }} /> Livre à habiller
            </Label>
            <Select value={selectedBookId} onValueChange={onSelectBook}>
              <SelectTrigger>
                <SelectValue placeholder="Choisissez un livre" />
              </SelectTrigger>
              <SelectContent>
                {books.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Titre, genre et résumé chargés automatiquement.
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Aucun livre trouvé — saisissez les informations ci-dessous.
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Titre du livre *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Le secret des marées" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Sous-titre</Label>
            <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="(optionnel)" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Nom de l'auteur</Label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Georges Boubet" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Genre</Label>
            <Input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Thriller, Business, Romance…" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Qui écrit les textes sur l'image ?</Label>
          <div className="grid sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTextMode('app')}
              className={`text-left rounded-xl px-3 py-2.5 text-xs border transition-all ${
                textMode === 'app' ? 'border-transparent' : 'border-border bg-muted/40 hover:bg-muted'
              }`}
              style={textMode === 'app' ? { background: `${GOLD}1f`, borderColor: GOLD } : undefined}
            >
              <span className="font-semibold block">Texte posé par l'app (recommandé)</span>
              <span className="text-muted-foreground">
                Typographie nette, jamais déformée. Aperçu et téléchargement immédiats.
              </span>
            </button>
            <button
              type="button"
              onClick={() => setTextMode('ai')}
              className={`text-left rounded-xl px-3 py-2.5 text-xs border transition-all ${
                textMode === 'ai' ? 'border-transparent' : 'border-border bg-muted/40 hover:bg-muted'
              }`}
              style={textMode === 'ai' ? { background: `${GOLD}1f`, borderColor: GOLD } : undefined}
            >
              <span className="font-semibold block">Texte dessiné par l'IA</span>
              <span className="text-muted-foreground">
                Les lettres sont souvent tordues, sauf avec une clé Ideogram.
              </span>
            </button>
          </div>
          {textMode === 'ai' && (
            <p className="text-[11px] flex items-start gap-1.5 text-amber-600">
              <AlertTriangle className="h-3.5 w-3.5 mt-px shrink-0" />
              En mode « texte dessiné par l'IA », les lettres peuvent être fausses ou illisibles.
              Ideogram est le seul moteur fiable pour ce mode.
            </p>
          )}
        </div>

        {textMode === 'app' && (
          <div className="space-y-2">
            <Label className="text-xs font-medium">Mise en place des textes</Label>
            <div className="flex gap-2 flex-wrap">
              {TEXT_PLACEMENTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlacement(p.id)}
                  className={`rounded-xl px-3 py-2 text-xs border transition-all ${
                    placement === p.id ? 'border-transparent' : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted'
                  }`}
                  style={placement === p.id ? { background: `${GOLD}1f`, borderColor: GOLD, color: GOLD } : undefined}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Catégorie + sorte d'image */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
        <Label className="text-sm font-semibold flex items-center gap-1.5" style={{ color: GOLD }}>
          <ImageIcon className="h-4 w-4" /> 2. Univers du livre et style de dessin
        </Label>

        <div className="space-y-2">
          <Label className="text-xs">Catégorie du livre</Label>
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

        <div className="space-y-2">
          <Label className="text-xs">Sorte d'image</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {COVER_IMAGE_STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setImageStyle(s.id)}
                className={`text-left rounded-xl px-3 py-2 text-xs border transition-all ${
                  imageStyle === s.id
                    ? 'border-transparent'
                    : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted'
                }`}
                style={
                  imageStyle === s.id
                    ? { background: `${GOLD}1f`, borderColor: GOLD, color: GOLD }
                    : undefined
                }
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            La catégorie décrit l'univers du livre, la sorte d'image décrit le style de dessin.
          </p>
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
        </div>
      </div>

      {/* 3. Moteurs d'images — une clé par moteur */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
        <div>
          <Label className="text-sm font-semibold flex items-center gap-1.5" style={{ color: GOLD }}>
            <KeyRound className="h-4 w-4" /> 3. Moteurs d'images
          </Label>
          <p className="text-[11px] text-muted-foreground mt-1">
            Ordre de priorité : Ideogram si une clé est enregistrée, sinon OpenRouter si activé,
            sinon le moteur inclus. Vos clés restent sur votre appareil et ne sont jamais partagées.
          </p>
        </div>

        {/* Ideogram */}
        <div className="rounded-lg border p-3 space-y-2" style={{ borderColor: GOLD, background: 'rgba(168,132,44,0.06)' }}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold" style={{ color: GOLD }}>
              1 · Ideogram — écrit un titre net dans l'image (≈ 0,06 € / couverture)
            </p>
            {ideoKey.trim().length > 20 ? (
              <span className="text-[11px] text-emerald-600 flex items-center gap-1 whitespace-nowrap">
                <CheckCircle2 className="h-3.5 w-3.5" /> Clé enregistrée
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                <KeyRound className="h-3.5 w-3.5" /> Aucune clé
              </span>
            )}
          </div>
          <Input
            type="password"
            value={ideoKey}
            onChange={(e) => {
              setIdeoKey(e.target.value);
              setIdeogramKey(e.target.value);
            }}
            placeholder="Clé Ideogram (ideogram.ai/manage-api)"
            autoComplete="off"
          />
          <p className="text-[11px] text-muted-foreground">
            Utile surtout en mode « texte dessiné par l'IA ».{' '}
            <a
              href="https://ideogram.ai/manage-api"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium"
              style={{ color: GOLD }}
            >
              Obtenir une clé
            </a>
          </p>
        </div>

        {/* OpenRouter */}
        <div className="rounded-lg border border-border p-3 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold">2 · OpenRouter — le plus économique</p>
            <button
              type="button"
              role="switch"
              aria-checked={useOpenRouter}
              onClick={() => setUseOpenRouter((v) => !v)}
              className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${useOpenRouter ? '' : 'bg-muted'}`}
              style={useOpenRouter ? { background: GOLD } : undefined}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  useOpenRouter ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          {useOpenRouter && (
            <>
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">Modèle d'image</Label>
                <Select
                  value={orModel}
                  onValueChange={(v) => {
                    setOrModel(v);
                    localStorage.setItem(OR_MODEL_LS, v);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez un modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    {OR_IMAGE_MODELS.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="password"
                  value={orKey}
                  onChange={(e) => {
                    setOrKey(e.target.value);
                    setOpenRouterImageKey(e.target.value);
                    setOrStatus('idle');
                  }}
                  placeholder="sk-or-..."
                  autoComplete="off"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={testOpenRouterKey}
                  disabled={orStatus === 'testing'}
                  className="shrink-0"
                >
                  {orStatus === 'testing' ? (
                    <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Test…</>
                  ) : (
                    <>Tester</>
                  )}
                </Button>
              </div>

              {orStatus === 'valid' && (
                <p className="text-[11px] text-emerald-600 flex items-center gap-1.5 font-medium">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Clé valide {orCredits && `· ${orCredits}`}
                </p>
              )}
              {orStatus === 'invalid' && (
                <p className="text-[11px] text-red-600 flex items-center gap-1.5 font-medium">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
                  Clé invalide ou refusée
                </p>
              )}
            </>
          )}
        </div>

        {/* Moteur inclus */}
        <div className="rounded-lg border border-border p-3">
          <p className="text-xs font-semibold">3 · Moteur inclus — aucune clé nécessaire</p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Sans clé personnelle, la génération fonctionne avec le moteur inclus dans votre
            abonnement.
          </p>
          {engineUsed && (
            <p className="text-[11px] text-muted-foreground mt-2">
              Dernière génération :{' '}
              <strong>{engineUsed === 'ideogram' ? 'Ideogram (qualité pro)' : engineUsed}</strong>
            </p>
          )}
        </div>
      </div>

      {/* 4. Génération */}
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

      {composing && (
        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Mise en place des textes…
        </p>
      )}
      {composeError && (
        <p className="text-[11px] text-amber-600 flex items-start gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 mt-px shrink-0" /> {composeError}
        </p>
      )}

      {covers.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {covers.map((c, idx) => {
            const display = textMode === 'app' && c.composedPreview ? c.composedPreview : c.url;
            return (
              <div key={idx} className="rounded-xl overflow-hidden border border-border bg-card">
                <img
                  src={display}
                  alt={`Couverture premium ${idx + 1}`}
                  className="w-full aspect-[2/3] object-cover"
                  loading="lazy"
                />
                <div className="p-3 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={display} alt="Miniature Amazon" className="w-[60px] h-[90px] object-cover rounded shadow" />
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Eye className="h-3 w-3" /> Test miniature Amazon — le titre reste-t-il lisible ?
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => saveToLibrary(c.url, idx)}
                    disabled={savingIdx === idx}
                    className="w-full"
                    style={{ background: '#c2410c', color: '#fff' }}
                  >
                    {savingIdx === idx ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enregistrement…</>
                    ) : (
                      <><Save className="h-4 w-4 mr-2" /> Enregistrer cette image</>
                    )}
                  </Button>
                  {savedIds[idx] && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate(`/v3/mes-couvertures/${savedIds[idx]}`)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" /> Ouvrir dans l'éditeur
                    </Button>
                  )}
                  {textMode === 'app' && (
                    <Button
                      size="sm"
                      onClick={() => downloadComposed(c.url)}
                      className="w-full"
                      style={{ background: GOLD, color: '#fff' }}
                    >
                      <Download className="h-4 w-4 mr-2" /> Télécharger la couverture
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadIllustration(c.url, idx)}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {textMode === 'app' ? "Télécharger l'illustration seule" : 'Télécharger'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CoverStudioPro;
