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
import { BookOpen, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { getSignedCoverUrl } from '@/lib/coverProjects';
import { cn } from '@/lib/utils';

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
    if (open) void loadBooks();
  }, [open, loadBooks]);

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

  /* ---- génération d'illustration(s) ------------------------------------- */
  const generate = async () => {
    setBusy(true);
    setError(null);
    const created: Proposal[] = [];
    try {
      for (let i = 0; i < count; i += 1) {
        setProgress({ done: i, total: count });
        const { data, error: fnError } = await supabase.functions.invoke('cover-pro-generate', {
          body: { projectId, genre, mood, palette, avoid, summary, artStyle },
        });
        if (fnError) throw fnError;
        if (data?.error) throw new Error(data.error);
        const path = data?.illustrationPath as string | undefined;
        if (!path) throw new Error('Aucune image renvoyée.');
        const url = await getSignedCoverUrl(path);
        created.push({ path, url });
        setProposals((prev) => [...created, ...prev.filter((p) => !created.some((c) => c.path === p.path))]);
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

  const noFunding = !loading && credits.remaining <= 0 && !key;
  const maxCount = key ? 4 : Math.max(1, Math.min(4, credits.remaining));

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

            {/* 3. Nombre de propositions */}
            <div className="flex flex-wrap items-center gap-2">
              <Label className="text-sm">Nombre de propositions :</Label>
              {[1, 2, 3, 4].map((n) => (
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
                Chaque proposition consomme une génération.
              </span>
            </div>

            {/* Propositions déjà générées */}
            {proposals.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Propositions de cette session</Label>
                <div className="grid grid-cols-4 gap-2">
                  {proposals.map((p) => (
                    <button
                      key={p.path}
                      type="button"
                      onClick={() => void chooseProposal(p)}
                      className="overflow-hidden rounded-lg border border-border transition hover:border-primary"
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
                  ))}
                </div>
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
              <Button onClick={() => void generate()} disabled={busy || noFunding}>
                {busy ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {progress ? `Génération ${progress.done + 1}/${progress.total}…` : 'Génération en cours…'}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {count > 1 ? `Générer ${count} propositions` : 'Générer l’image'}
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
