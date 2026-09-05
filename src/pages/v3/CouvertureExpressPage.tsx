/**
 * Assistant « Ma couverture en 3 étapes » (/v3/couverture-express).
 *
 * Parcours volontairement minimal pour un abonné qui n'y connaît rien :
 *   1. Mon livre → 2. Mon style → 3. Mon fichier.
 *
 * Rien de neuf côté technique : réutilise `cover_projects`, les modèles de
 * référence, le moteur de rendu partagé, l'export Kindle et l'export PDF
 * existants, ainsi que la fonction sécurisée `cover-pro-generate`.
 * Aucun changement de base, de sécurité, de calcul KDP ni de paiement.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Loader2,
  Moon,
  RefreshCw,
  Sparkles,
  Sun,
} from 'lucide-react';
import { toast } from 'sonner';

import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useCoverProAccess from '@/hooks/useCoverProAccess';
import {
  createCoverProject,
  getSignedCoverUrl,
  updateCoverProject,
} from '@/lib/coverProjects';
import {
  serializeComposition,
  type FrontComposition,
} from '@/lib/cover-editor/frontComposition';
import { REFERENCE_TEMPLATES, type ReferenceTemplateId } from '@/lib/cover-editor/referenceTemplates';
import {
  buildExpressComposition,
  EXPRESS_GENRES,
  getExpressGenre,
  proposalOrder,
} from '@/lib/cover-editor/expressCover';
import { renderFrontCanvas, exportFrontPdf } from '@/lib/cover-editor/coverExports';
import { downloadBlob, renderKindleCoverJpeg } from '@/lib/cover-editor/kindleExport';
import { cn } from '@/lib/utils';

type Step = 1 | 2 | 3;
type FormatChoice = 'ebook' | 'paperback';

const STEP_LABELS: Record<Step, string> = {
  1: '1. Mon livre',
  2: '2. Mon style',
  3: '3. Mon fichier',
};

const STEP_HELP: Record<Step, string> = {
  1: 'Dites-nous simplement de quel livre il s’agit. Rien à régler, cinq réponses suffisent.',
  2: 'Choisissez la couverture qui vous plaît le plus. Elle est déjà complète, votre titre est dedans.',
  3: 'Votre couverture est prête. Téléchargez le fichier, c’est celui que vous déposerez sur Amazon.',
};

const FORMAT_ID: Record<FormatChoice, string> = {
  ebook: 'ebook-kindle',
  paperback: 'broche-wrap',
};

export default function CouvertureExpressPage() {
  const navigate = useNavigate();
  const { credits, key, refresh } = useCoverProAccess();

  const [step, setStep] = useState<Step>(1);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genreId, setGenreId] = useState('roman');
  const [format, setFormat] = useState<FormatChoice>('ebook');

  const [projectId, setProjectId] = useState<string | null>(null);
  const [illustrationPath, setIllustrationPath] = useState<string | null>(null);
  const [illustrationUrl, setIllustrationUrl] = useState<string | null>(null);

  const [chosen, setChosen] = useState<ReferenceTemplateId | null>(null);
  const [lightness, setLightness] = useState(0);
  const [variantSeed, setVariantSeed] = useState(0);

  const [creating, setCreating] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [bigPreview, setBigPreview] = useState<string | null>(null);
  const renderToken = useRef(0);

  const formatId = FORMAT_ID[format];

  /** Trois propositions : le modèle conseillé pour le genre, puis les autres. */
  const proposals = useMemo(() => {
    const order = proposalOrder(genreId);
    return order.map((id, index) => ({
      id,
      label: REFERENCE_TEMPLATES.find((t) => t.id === id)?.label ?? 'Modèle',
      lightness: index === 0 ? lightness : lightness + (variantSeed % 3) - 1,
    }));
  }, [genreId, lightness, variantSeed]);

  const compositionFor = useCallback(
    (templateId: ReferenceTemplateId, light: number): FrontComposition =>
      buildExpressComposition({
        formatId,
        title: title.trim(),
        subtitle: subtitle.trim(),
        author: author.trim(),
        illustrationPath,
        templateId,
        lightness: light,
      }),
    [formatId, title, subtitle, author, illustrationPath],
  );

  /* ---- aperçus des trois propositions ---------------------------------- */
  useEffect(() => {
    if (step !== 2) return;
    const token = ++renderToken.current;
    (async () => {
      const next: Record<string, string> = {};
      for (const p of proposals) {
        const canvas = await renderFrontCanvas(
          compositionFor(p.id, p.lightness),
          illustrationUrl,
          420,
          672,
        );
        next[p.id] = canvas.toDataURL('image/jpeg', 0.86);
      }
      if (token === renderToken.current) setPreviews(next);
    })().catch(() => undefined);
  }, [step, proposals, compositionFor, illustrationUrl]);

  /* ---- grand aperçu de l'étape 3 --------------------------------------- */
  useEffect(() => {
    if (step !== 3 || !chosen) return;
    const token = ++renderToken.current;
    (async () => {
      const canvas = await renderFrontCanvas(
        compositionFor(chosen, lightness),
        illustrationUrl,
        640,
        1024,
      );
      if (token === renderToken.current) setBigPreview(canvas.toDataURL('image/jpeg', 0.9));
    })().catch(() => undefined);
  }, [step, chosen, lightness, compositionFor, illustrationUrl]);

  /* ---- étape 1 → 2 : création du projet -------------------------------- */
  const goToStyles = async () => {
    if (!title.trim()) {
      toast.error('Indiquez au moins le titre de votre livre.');
      return;
    }
    if (projectId) {
      setStep(2);
      return;
    }
    setCreating(true);
    try {
      const created = await createCoverProject({
        project_name: title.trim().slice(0, 80),
        book_title: title.trim(),
        cover_type: format,
        format_id: formatId,
        page_count: format === 'paperback' ? 120 : null,
      });
      setProjectId(created.id);
      setStep(2);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Impossible de démarrer la couverture.');
    } finally {
      setCreating(false);
    }
  };

  /* ---- illustration (fonction sécurisée existante) --------------------- */
  const generateIllustration = async () => {
    if (!projectId) return;
    const genre = getExpressGenre(genreId);
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('cover-pro-generate', {
        body: {
          projectId,
          genre: genre.brief.genre,
          mood: genre.brief.mood,
          palette: genre.brief.palette,
          avoid: 'texte, lettres, logo',
          summary: [title.trim(), subtitle.trim()].filter(Boolean).join(' — '),
          artStyle: genre.brief.artStyle,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const path = data?.illustrationPath as string | undefined;
      if (!path) throw new Error('Aucune image reçue.');
      setIllustrationPath(path);
      setIllustrationUrl(await getSignedCoverUrl(path));
      await refresh();
      toast.success('Nouvelle image appliquée à vos trois propositions.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Image indisponible pour le moment.');
    } finally {
      setGenerating(false);
    }
  };

  /* Première illustration lancée automatiquement dès l'arrivée à l'étape 2. */
  const autoTried = useRef(false);
  useEffect(() => {
    if (step !== 2 || autoTried.current) return;
    if (!projectId || illustrationPath || generating) return;
    if (credits.remaining <= 0 && !key) return;
    autoTried.current = true;
    void generateIllustration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, projectId, illustrationPath, generating, credits.remaining, key]);


  /* ---- enregistrement ---------------------------------------------------- */
  const persist = useCallback(
    async (templateId: ReferenceTemplateId) => {
      if (!projectId) return;
      const composition = compositionFor(templateId, lightness);
      await updateCoverProject(projectId, {
        book_title: title.trim() || null,
        fabric_json: serializeComposition(composition, illustrationPath),
        illustration_path: illustrationPath,
      });
    },
    [projectId, compositionFor, lightness, title, illustrationPath],
  );

  const chooseProposal = async (templateId: ReferenceTemplateId, light: number) => {
    setChosen(templateId);
    setLightness(light);
    setStep(3);
    try {
      await persist(templateId);
    } catch {
      /* l'enregistrement est retenté au téléchargement */
    }
  };

  /* ---- téléchargement --------------------------------------------------- */
  const download = async () => {
    if (!chosen) return;
    setExporting(true);
    try {
      const composition = compositionFor(chosen, lightness);
      const result =
        format === 'ebook'
          ? await renderKindleCoverJpeg(composition, illustrationUrl, title.trim())
          : await exportFrontPdf(composition, illustrationUrl, { bookTitle: title.trim() });
      downloadBlob(result.blob, result.fileName);
      setDownloaded(true);
      await persist(chosen).catch(() => undefined);
      toast.success(`Fichier téléchargé : ${result.fileName}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Téléchargement impossible.');
    } finally {
      setExporting(false);
    }
  };

  const saveForLater = async () => {
    if (!chosen || !projectId) return;
    try {
      await persist(chosen);
      toast.success('Couverture enregistrée dans « Mes couvertures ».');
      navigate('/v3/mes-couvertures');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Enregistrement impossible.');
    }
  };

  const openAdvanced = async () => {
    if (!projectId) return;
    if (chosen) await persist(chosen).catch(() => undefined);
    navigate(`/v3/mes-couvertures/${projectId}`);
  };

  /* ---------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-16">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/v3">
              <ArrowLeft className="mr-1 h-4 w-4" /> Retour
            </Link>
          </Button>
          <h1 className="text-lg font-semibold text-[#232F3E]">Ma couverture en 3 étapes</h1>
          <div className="ml-auto flex flex-wrap items-center gap-1.5 text-xs">
            {([1, 2, 3] as Step[]).map((s) => (
              <span
                key={s}
                className={cn(
                  'rounded-full px-2.5 py-1 font-medium',
                  s === step ? 'bg-[#f47920] text-white' : 'bg-muted text-muted-foreground',
                )}
              >
                {STEP_LABELS[s]}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <p className="mb-5 text-sm text-muted-foreground">{STEP_HELP[step]}</p>

        {/* ------------------------- Étape 1 ------------------------------ */}
        {step === 1 && (
          <Card className="mx-auto max-w-xl">
            <CardContent className="space-y-4 p-5">
              <div className="space-y-1.5">
                <Label htmlFor="ex-title">Titre de votre livre</Label>
                <Input
                  id="ex-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Les Flammes du Passé"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ex-subtitle">Sous-titre (facultatif)</Label>
                <Input
                  id="ex-subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Roman"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ex-author">Votre nom d’auteur</Label>
                <Input
                  id="ex-author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Georges Boubet"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Genre du livre</Label>
                <Select value={genreId} onValueChange={setGenreId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {EXPRESS_GENRES.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Format</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {(
                    [
                      { value: 'ebook' as FormatChoice, label: 'eBook Kindle' },
                      { value: 'paperback' as FormatChoice, label: 'Livre broché' },
                    ]
                  ).map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => setFormat(f.value)}
                      className={cn(
                        'rounded-lg border px-3 py-2 text-sm font-medium transition',
                        format === f.value
                          ? 'border-[#f47920] bg-[#f47920]/10 text-[#232F3E]'
                          : 'border-border hover:border-[#f47920]/60',
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full bg-[#f47920] text-white hover:bg-[#d96812]"
                disabled={creating}
                onClick={() => void goToStyles()}
              >
                {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Étape suivante
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ------------------------- Étape 2 ------------------------------ */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-white p-3 text-sm">
              <Badge variant={credits.remaining > 0 ? 'default' : 'secondary'}>
                {credits.remaining} image(s) incluse(s) restante(s)
              </Badge>
              {credits.remaining <= 0 && !key && (
                <span className="text-muted-foreground">
                  Vous pouvez continuer sans image, ou ajouter votre clé personnelle depuis{' '}
                  <Link to="/v3/cover-pro" className="underline">
                    cette page
                  </Link>
                  .
                </span>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {proposals.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => void chooseProposal(p.id, p.lightness)}
                  className="group overflow-hidden rounded-xl border-2 border-transparent bg-white shadow-sm transition hover:border-[#f47920]"
                >
                  {previews[p.id] ? (
                    <img
                      src={previews[p.id]}
                      alt={`Proposition de couverture : ${p.label}`}
                      className="h-auto w-full"
                    />
                  ) : (
                    <span className="flex h-[420px] items-center justify-center text-sm text-muted-foreground">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Préparation…
                    </span>
                  )}
                  <span className="block px-3 py-2 text-sm font-medium text-[#232F3E] group-hover:text-[#f47920]">
                    Choisir cette couverture
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button variant="outline" disabled={generating} onClick={() => void generateIllustration()}>
                {generating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Changer l’illustration
              </Button>
              <Button variant="outline" onClick={() => setVariantSeed((v) => v + 1)}>
                <RefreshCw className="mr-2 h-4 w-4" /> Autres propositions
              </Button>
              <Button variant="outline" onClick={() => setLightness((l) => Math.min(2, l + 1))}>
                <Sun className="mr-2 h-4 w-4" /> Plus clair
              </Button>
              <Button variant="outline" onClick={() => setLightness((l) => Math.max(-2, l - 1))}>
                <Moon className="mr-2 h-4 w-4" /> Plus foncé
              </Button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => void openAdvanced()}
                className="text-xs text-muted-foreground underline hover:text-[#f47920]"
              >
                Régler chaque détail moi-même
              </button>
            </div>
          </div>
        )}

        {/* ------------------------- Étape 3 ------------------------------ */}
        {step === 3 && (
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-xl border bg-white p-3">
              {bigPreview ? (
                <img src={bigPreview} alt="Votre couverture" className="mx-auto h-auto w-full max-w-[420px]" />
              ) : (
                <span className="flex h-96 items-center justify-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Préparation de l’aperçu…
                </span>
              )}
            </div>

            <div className="space-y-3">
              <Button
                className="w-full bg-[#f47920] text-white hover:bg-[#d96812]"
                disabled={exporting}
                onClick={() => void download()}
              >
                {exporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : downloaded ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                {exporting
                  ? 'Préparation…'
                  : downloaded
                    ? 'Couverture téléchargée'
                    : 'Télécharger ma couverture'}
              </Button>

              <Button variant="outline" className="w-full" onClick={() => void saveForLater()}>
                Enregistrer et continuer plus tard
              </Button>

              <p className="rounded-lg border bg-white p-3 text-xs text-muted-foreground">
                {format === 'ebook'
                  ? 'Le fichier est une image au format demandé par Amazon pour un livre Kindle. Vous le déposez dans la rubrique « Couverture » lors de la mise en ligne de votre livre.'
                  : 'Le fichier est un PDF prêt pour l’impression. Vous le déposez dans la rubrique « Couverture » de votre livre broché.'}{' '}
                Vous le retrouverez toujours dans « Mes couvertures ».
              </p>

              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-1 h-4 w-4" /> Changer de style
                </Button>
                <Button variant="ghost" size="sm" onClick={() => void openAdvanced()}>
                  Régler chaque détail
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
