/**
 * Panneau de génération d'illustration intégré au NOUVEL éditeur
 * (`/v3/mes-couvertures/:id`).
 *
 * Il n'utilise QUE le système sécurisé de l'étape 3 :
 *  - fonction serveur `cover-pro-generate` (OpenAI gpt-image-2) ;
 *  - crédits `cover_pro_credits` (débit confirmé côté serveur uniquement après
 *    enregistrement privé réussi, restauration automatique sinon) ;
 *  - clé personnelle chiffrée si les générations incluses sont épuisées ;
 *  - image privée écrite dans `covers/<user>/<projet>/`.
 *
 * IA guidée : le brief peut être proposé automatiquement depuis un livre
 * EbookStudio (`cover-brief`, analyse de texte uniquement, sans crédit image).
 *
 * Aucun autre moteur, aucune clé locale, aucune navigation vers un ancien module.
 */
import { useCallback, useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Download, History, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useCoverProAccess from '@/hooks/useCoverProAccess';
import { getSignedCoverUrl, listCoverIllustrationHistory } from '@/lib/coverProjects';
import { downloadIllustration } from '@/lib/cover-editor/illustrationDownload';
import { cn } from '@/lib/utils';

/** Directions artistiques disponibles (doivent rester alignées sur cover-pro-generate). */
const ART_STYLES = [
  { value: 'illustration-editoriale', label: 'Illustration peinte best-seller (recommandé)' },
  { value: 'fantasy-doree', label: 'Fantasy / historique doré (peinture à l’huile)' },
  { value: 'photo-cinema', label: 'Photo cinématographique hyperréaliste' },
  { value: 'non-fiction-pro', label: 'Non-fiction pro (photo + aplats graphiques)' },
  { value: 'minimal-graphique', label: 'Minimaliste graphique premium' },
] as const;

interface Props {

  projectId: string;
  /** Chemin privé de la nouvelle illustration après une génération réussie. */
  onGenerated: (illustrationPath: string) => void | Promise<void>;
  hasIllustration?: boolean;
  className?: string;
  size?: 'sm' | 'default';
}

interface BookOption {
  id: string;
  title: string;
  kind: 'ebook' | 'book';
}

interface Proposal {
  path: string;
  url: string | null;
}

export default function IllustrationGeneratorPanel({
  projectId,
  onGenerated,
  hasIllustration = false,
  className,
  size = 'default',
}: Props) {
  const { hasAccess, credits, key, loading, refresh } = useCoverProAccess();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [briefBusy, setBriefBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('');
  const [palette, setPalette] = useState('');
  const [avoid, setAvoid] = useState('');
  const [summary, setSummary] = useState('');
  const [artStyle, setArtStyle] = useState('illustration-editoriale');
  /** Exposition demandée : par défaut une image claire, jamais trop sombre. */
  const [lighting, setLighting] = useState('bright');
  /** Consigne visuelle issue de la description, modifiable avant génération. */
  const [visualPrompt, setVisualPrompt] = useState('');
  const [visualBusy, setVisualBusy] = useState(false);
  const [directionConfirmed, setDirectionConfirmed] = useState(false);
  const [targetAudience, setTargetAudience] = useState('');
  const [era, setEra] = useState('');
  const [location, setLocation] = useState('');
  const [focalSubject, setFocalSubject] = useState('');
  const [emotion, setEmotion] = useState('');
  const [symbol, setSymbol] = useState('');
  const [include, setInclude] = useState('');


  const [books, setBooks] = useState<BookOption[]>([]);
  const [bookId, setBookId] = useState<string>('');
  const [count, setCount] = useState(1);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  /* ---- mes livres (source du brief) ------------------------------------- */
  const loadBooks = useCallback(async () => {
    const [ebooks, projects] = await Promise.all([
      supabase.from('ebook_projects').select('id, title').order('updated_at', { ascending: false }).limit(50),
      supabase.from('book_projects').select('id, title').order('updated_at', { ascending: false }).limit(50),
    ]);
    const options: BookOption[] = [
      ...(ebooks.data ?? []).map((b) => ({ id: b.id as string, title: (b.title as string) || 'Sans titre', kind: 'ebook' as const })),
      ...(projects.data ?? []).map((b) => ({ id: b.id as string, title: (b.title as string) || 'Sans titre', kind: 'book' as const })),
    ];
    setBooks(options);
  }, []);

  useEffect(() => {
    if (!open) return;
    void loadBooks();
    const saved = window.localStorage.getItem(`cover-creative-brief:${projectId}`);
    if (saved) {
      try {
        const brief = JSON.parse(saved) as Record<string, string>;
        setGenre(brief.genre ?? ''); setMood(brief.mood ?? ''); setPalette(brief.palette ?? '');
        setAvoid(brief.avoid ?? ''); setSummary(brief.summary ?? ''); setArtStyle(brief.artStyle ?? 'illustration-editoriale');
        setLighting(brief.lighting ?? 'bright'); setVisualPrompt(brief.visualPrompt ?? '');
        setTargetAudience(brief.targetAudience ?? ''); setEra(brief.era ?? ''); setLocation(brief.location ?? '');
        setFocalSubject(brief.focalSubject ?? ''); setEmotion(brief.emotion ?? ''); setSymbol(brief.symbol ?? '');
        setInclude(brief.include ?? '');
      } catch { /* ancienne donnée locale illisible : ignorée */ }
    }
    void listCoverIllustrationHistory(projectId).then((items) => setProposals(items));
  }, [open, loadBooks, projectId]);

  useEffect(() => {
    if (!open) return;
    window.localStorage.setItem(`cover-creative-brief:${projectId}`, JSON.stringify({
      genre, mood, palette, avoid, summary, artStyle, lighting, visualPrompt,
      targetAudience, era, location, focalSubject, emotion, symbol, include,
    }));
  }, [open, projectId, genre, mood, palette, avoid, summary, artStyle, lighting, visualPrompt, targetAudience, era, location, focalSubject, emotion, symbol, include]);

  /* ---- brief proposé par IA (aucun crédit image) ------------------------ */
  const proposeBrief = async () => {
    const selected = books.find((b) => b.id === bookId);
    setBriefBusy(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('cover-brief', {
        body: selected
          ? { sourceKind: selected.kind, bookId: selected.id }
          : { sourceKind: 'manual', text: summary },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      const brief = (data?.brief ?? {}) as Record<string, string>;
      if (brief.genre) setGenre(brief.genre);
      if (brief.mood) setMood(brief.mood);
      if (brief.palette) setPalette(brief.palette);
      if (brief.avoid) setAvoid(brief.avoid);
      const scene = [brief.scene, brief.style, brief.include].filter(Boolean).join(' — ');
      if (scene) setSummary(scene);
      toast.success('Brief proposé : modifiez-le librement avant de générer.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Brief indisponible pour le moment.';
      setError(message);
      toast.error(message);
    } finally {
      setBriefBusy(false);
    }
  };

  /* ---- consigne visuelle depuis la description (aucun crédit image) ----- */
  const proposeVisualPrompt = async () => {
    setVisualBusy(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('cover-visual-prompt', {
        body: { summary, genre, mood, palette, targetAudience, era, location, focalSubject, emotion, symbol, include, avoid },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      const proposed = data?.visualPrompt as string | undefined;
      if (!proposed) throw new Error('Consigne visuelle indisponible.');
      setVisualPrompt(proposed);
      setDirectionConfirmed(false);
      toast.success('Consigne visuelle proposée : modifiez-la si besoin, puis générez.');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Consigne visuelle indisponible pour le moment.';
      setError(message);
      toast.error(message);
    } finally {
      setVisualBusy(false);
    }
  };

  /* ---- génération d'illustration(s) ------------------------------------- */
  const generate = async () => {
    if (!visualPrompt.trim()) {
      setError('Faites d’abord préparer la direction visuelle à partir du synopsis.');
      return;
    }
    if (!directionConfirmed) {
      setError('Confirmez que la direction visuelle correspond bien à votre livre.');
      return;
    }
    setBusy(true);
    setError(null);
    const created: Proposal[] = [];
    try {
      for (let i = 0; i < count; i += 1) {
        setProgress({ done: i, total: count });
        const { data, error: fnError } = await supabase.functions.invoke('cover-pro-generate', {
          body: {
            projectId,
            genre,
            mood,
            palette,
            avoid,
            include,
            summary,
            artStyle,
            lighting,
            visualPrompt: visualPrompt.trim() || undefined,
            targetAudience,
            era,
            location,
            focalSubject,
            emotion,
            symbol,
          },
        });
        if (fnError) throw fnError;
        if (data?.error) throw new Error(data.error);
        const path = data?.illustrationPath as string | undefined;
        if (!path) throw new Error('Aucune image renvoyée.');
        const url = await getSignedCoverUrl(path);
        created.push({ path, url });
        setProposals((prev) => [...created, ...prev.filter((p) => !created.some((c) => c.path === p.path))].slice(0, 12));
      }

      // La dernière image générée devient l'illustration active ; les autres
      // restent proposées et sélectionnables d'un clic.
      const last = created[created.length - 1];
      if (last) await onGenerated(last.path);
      await refresh();
      toast.success(
        created.length > 1
          ? `${created.length} propositions générées : choisissez celle que vous préférez.`
          : 'Illustration ajoutée.',
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Génération impossible pour le moment.';
      setError(message);
      toast.error(message);
    } finally {
      setProgress(null);
      setBusy(false);
    }
  };

  const chooseProposal = async (proposal: Proposal) => {
    await onGenerated(proposal.path);
    toast.success('Illustration appliquée à la couverture.');
  };

  /** Téléchargement local de l'image seule : aucun crédit, aucune copie publique. */
  const saveImageToLibrary = async (proposal: Proposal) => {
    try {
      const fileName = await downloadIllustration(proposal.path);
      toast.success(`Image téléchargée : ${fileName}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Téléchargement impossible.');
    }
  };

  const noFunding = !loading && credits.remaining <= 0 && !key;
  const maxCount = key ? 3 : Math.max(1, Math.min(3, credits.remaining));

  return (
    <Dialog open={open} onOpenChange={(v) => !busy && setOpen(v)}>
      <DialogTrigger asChild>
        <Button size={size} className={className}>
          <Sparkles className="mr-2 h-4 w-4" />
          {hasIllustration ? 'Régénérer l’illustration' : 'Générer l’illustration'}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Illustration IA guidée (sans aucun texte)</DialogTitle>
          <DialogDescription>
            L’image est générée en portrait haute résolution et enregistrée dans votre espace
            privé. Vos titres restent des calques modifiables par-dessus.
          </DialogDescription>
        </DialogHeader>

        {!hasAccess && !loading ? (
          <div className="space-y-3 text-sm">
            <p className="rounded-lg border border-border bg-muted/40 p-3">
              La génération d’illustration fait partie de Cover Studio KDP Pro (67 €, paiement
              unique). Les modèles, les textes et les exports restent utilisables sans achat.
            </p>
            <Button asChild variant="outline" className="w-full">
              <a href="/v3/cover-pro">Débloquer Cover Studio KDP Pro</a>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge variant={credits.remaining > 0 ? 'default' : 'secondary'}>
                {credits.remaining} génération(s) incluse(s) restante(s)
              </Badge>
              {credits.remaining <= 0 && (
                <span className="text-muted-foreground">
                  {key
                    ? 'Les suivantes utilisent votre clé personnelle.'
                    : 'Ajoutez votre clé personnelle pour continuer.'}
                </span>
              )}
            </div>

            {/* 1. Partir d'un de mes livres */}
            <div className="space-y-2 rounded-lg border border-border p-3">
              <Label className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" /> Partir d’un de mes livres
              </Label>
              <div className="flex flex-wrap gap-2">
                <Select value={bookId} onValueChange={setBookId}>
                  <SelectTrigger className="min-w-[220px] flex-1">
                    <SelectValue placeholder="Choisir un livre (facultatif)" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {books.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Aucun livre trouvé
                      </SelectItem>
                    ) : (
                      books.map((b) => (
                        <SelectItem key={`${b.kind}-${b.id}`} value={b.id}>
                          {b.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  disabled={briefBusy || busy || (!bookId && summary.trim().length < 20)}
                  onClick={() => void proposeBrief()}
                >
                  {briefBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                  Proposer un brief
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                L’analyse lit uniquement le texte de votre livre pour préremplir le brief. Aucune
                génération d’image, aucun crédit consommé à cette étape.
              </p>
            </div>

            {/* 2. Brief modifiable */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="ill-genre">Genre</Label>
                <Input
                  id="ill-genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  placeholder="Thriller, développement personnel…"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ill-mood">Ambiance</Label>
                <Input
                  id="ill-mood"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  placeholder="Sombre, lumineuse, chaleureuse…"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ill-palette">Palette</Label>
                <Input
                  id="ill-palette"
                  value={palette}
                  onChange={(e) => setPalette(e.target.value)}
                  placeholder="Bleu nuit et or"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ill-avoid">Éléments à éviter</Label>
                <Input
                  id="ill-avoid"
                  value={avoid}
                  onChange={(e) => setAvoid(e.target.value)}
                  placeholder="Visages, animaux…"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ill-audience">Lecteurs visés</Label>
                <Input id="ill-audience" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="Adultes, enfants de 8 à 12 ans…" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ill-era">Époque</Label>
                <Input id="ill-era" value={era} onChange={(e) => setEra(e.target.value)} placeholder="Aujourd’hui, années 1940…" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ill-location">Lieu principal</Label>
                <Input id="ill-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Paris, bord de mer, château…" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ill-focus">Personnage ou objet central</Label>
                <Input id="ill-focus" value={focalSubject} onChange={(e) => setFocalSubject(e.target.value)} placeholder="Une femme de dos, une montre ancienne…" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ill-emotion">Émotion à provoquer</Label>
                <Input id="ill-emotion" value={emotion} onChange={(e) => setEmotion(e.target.value)} placeholder="Curiosité, tension, espoir…" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ill-symbol">Symbole important</Label>
                <Input id="ill-symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="Une lettre brûlée, une clé…" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="ill-include">Éléments obligatoires</Label>
                <Input id="ill-include" value={include} onChange={(e) => setInclude(e.target.value)} placeholder="Ce qui doit absolument apparaître" />
              </div>
            </div>

            {/* Direction artistique (qualité best-seller) */}
            <div className="space-y-1.5">
              <Label>Style de rendu</Label>
              <Select value={artStyle} onValueChange={setArtStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ART_STYLES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Chaque style applique une direction artistique professionnelle (lumière, matières,
                niveau de détail) pour un rendu de couverture vendue en librairie.
              </p>
            </div>



            {/* Lumière de l'image (évite les rendus trop sombres) */}
            <div className="space-y-1.5">
              <Label>Lumière de l'image</Label>
              <Select value={lighting} onValueChange={setLighting}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bright">Lumineuse (recommandé)</SelectItem>
                  <SelectItem value="balanced">Équilibrée</SelectItem>
                  <SelectItem value="dark">Sombre et dramatique</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                « Lumineuse » demande une image claire et bien exposée : c'est le réglage à garder si
                vos images sortent trop sombres.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ill-summary">Sujet du livre et scène souhaitée</Label>
              <Textarea
                id="ill-summary"
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Décrivez en quelques phrases le sujet et la scène souhaitée."
              />
            </div>

            {/* Consigne visuelle : traduit votre description en instruction d'image */}
            <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor="ill-visual">Ce que l’image va représenter</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  disabled={visualBusy || busy || summary.trim().length < 12}
                  onClick={() => void proposeVisualPrompt()}
                >
                  {visualBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  {visualPrompt ? 'Régénérer la description visuelle' : 'Proposer la description visuelle'}
                </Button>
              </div>
              <Textarea
                id="ill-visual"
                rows={4}
                value={visualPrompt}
                onChange={(e) => { setVisualPrompt(e.target.value); setDirectionConfirmed(false); }}
                placeholder="Consigne visuelle : sujet principal, décor, époque, cadrage, lumière…"
              />
              <p className="text-xs text-muted-foreground">
                Cette consigne est ce que l’image suivra vraiment. Vous pouvez la corriger mot à mot.
                Si vous la laissez vide, elle est déduite automatiquement de votre description.
                Cette étape ne consomme aucune génération.
              </p>
              <div className="flex items-start gap-2 rounded-md border border-primary/30 bg-primary/5 p-3">
                <Checkbox id="ill-confirm-direction" checked={directionConfirmed} onCheckedChange={(value) => setDirectionConfirmed(value === true)} />
                <Label htmlFor="ill-confirm-direction" className="cursor-pointer leading-5">
                  Oui, c’est bien l’image de mon livre. Les éléments indiqués sont fidèles au synopsis.
                </Label>
              </div>
            </div>

            {/* 3. Nombre de propositions */}
            <div className="flex flex-wrap items-center gap-2">
              <Label className="text-sm">Nombre de propositions :</Label>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  disabled={n > maxCount || busy}
                  onClick={() => setCount(n)}
                  className={cn(
                    'h-8 w-8 rounded-md border text-sm transition disabled:opacity-40',
                    count === n ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                  )}
                >
                  {n}
                </button>
              ))}
              <span className="text-xs text-muted-foreground">
                {count} proposition{count > 1 ? 's' : ''} = {count} génération{count > 1 ? 's' : ''}.
              </span>
            </div>

            {/* Propositions déjà générées */}
            {proposals.length > 0 && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm"><History className="h-4 w-4" /> Illustrations privées de ce projet</Label>
                <div className="grid grid-cols-4 gap-2">
                  {proposals.map((p) => (
                    <div key={p.path} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => void chooseProposal(p)}
                        className="w-full overflow-hidden rounded-lg border border-border transition hover:border-primary"
                        title="Utiliser cette illustration"
                      >
                        {p.url ? (
                          <img src={p.url} alt="Proposition d’illustration" className="h-32 w-full object-cover" />
                        ) : (
                          <span className="flex h-32 items-center justify-center text-xs text-muted-foreground">
                            Aperçu indisponible
                          </span>
                        )}
                      </button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 w-full gap-1 px-1 text-[11px]"
                        onClick={() => void saveImageToLibrary(p)}
                      >
                        <Download className="h-3 w-3" /> Télécharger
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Chaque image est déjà enregistrée dans votre espace privé. « Télécharger »
                  récupère l’image seule, sans titre ni texte par-dessus.
                </p>
              </div>
            )}

            {noFunding && (
              <div className="space-y-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
                <p className="font-semibold text-foreground">
                  Vos {credits.granted} générations incluses sont épuisées
                </p>
                <p className="text-muted-foreground">
                  Pour continuer à générer des illustrations, ajoutez votre clé OpenAI personnelle
                  (bouton « Ajouter ma clé OpenAI » dans le bandeau en haut de l’éditeur). Vos
                  images déjà générées, vos modèles et vos exports restent disponibles.
                </p>
              </div>
            )}

            {error && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </p>
            )}


            <DialogFooter className="gap-2 sm:justify-between">
              <Button variant="ghost" onClick={() => setOpen(false)} disabled={busy}>
                Fermer et continuer l’édition
              </Button>
              <Button onClick={() => void generate()} disabled={busy || noFunding || !visualPrompt.trim() || !directionConfirmed}>
                {busy ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {progress ? `Génération ${progress.done + 1}/${progress.total}…` : 'Génération en cours…'}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {count > 1 ? `Générer ${count} propositions validées` : 'Générer l’image validée'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
