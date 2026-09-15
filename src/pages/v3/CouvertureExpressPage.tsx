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
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Loader2,
  Moon,
  Pencil,
  RefreshCw,
  Sparkles,
  Sun,
  Wand2,
} from 'lucide-react';
import { toast } from 'sonner';

import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  renderFrontCanvas,
  exportFrontPdf,
  exportFrontPng,
  safeFileName,
} from '@/lib/cover-editor/coverExports';
import { downloadBlob, renderKindleCoverJpeg } from '@/lib/cover-editor/kindleExport';
import SuggestInput from '@/components/cover-editor/SuggestInput';
import { coverDetailSuggestions } from '@/data/coverDetailSuggestions';
import { cn } from '@/lib/utils';

type Step = 1 | 2 | 3;
type FormatChoice = 'ebook' | 'paperback';

const STEP_LABELS: Record<Step, string> = {
  1: '1. Mon livre',
  2: '2. Mon style',
  3: '3. Mon fichier',
};

const STEP_HELP: Record<Step, string> = {
  1: 'Décrivez le livre, son public et les éléments indispensables : cette base empêchera l’image de partir sur une autre histoire.',
  2: 'Validez d’abord la scène proposée, puis créez l’illustration et choisissez une composition éditoriale.',
  3: 'Vérifiez la lisibilité, puis téléchargez ou ouvrez l’éditeur complet pour les retouches finales.',
};

const FORMAT_ID: Record<FormatChoice, string> = {
  ebook: 'ebook-kindle',
  paperback: 'broche-wrap',
};

export default function CouvertureExpressPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { credits, key, refresh } = useCoverProAccess();

  const [step, setStep] = useState<Step>(1);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [genreId, setGenreId] = useState('roman');
  const [format, setFormat] = useState<FormatChoice>('ebook');
  const [targetAudience, setTargetAudience] = useState('');
  const [era, setEra] = useState('');
  const [location, setLocation] = useState('');
  const [focalSubject, setFocalSubject] = useState('');
  const [emotion, setEmotion] = useState('');
  const [mustInclude, setMustInclude] = useState('');
  const [mustAvoid, setMustAvoid] = useState('');
  const [visualPrompt, setVisualPrompt] = useState('');
  const [directionBusy, setDirectionBusy] = useState(false);
  const [directionConfirmed, setDirectionConfirmed] = useState(false);
  const [lighting, setLighting] = useState('bright');

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
  const prefilled = useRef(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const formatId = FORMAT_ID[format];

  useEffect(() => {
    if (prefilled.current) return;
    prefilled.current = true;

    const queryTitle = searchParams.get('title')?.trim();
    const querySubtitle = searchParams.get('subtitle')?.trim();
    const queryAuthor = searchParams.get('author')?.trim();
    const querySynopsis = searchParams.get('synopsis')?.trim();
    const queryGenre = searchParams.get('genre')?.trim().toLocaleLowerCase('fr');

    if (queryTitle) setTitle(queryTitle);
    if (querySubtitle) setSubtitle(querySubtitle);
    if (queryAuthor) setAuthor(queryAuthor);
    if (querySynopsis) setSynopsis(querySynopsis);
    if (queryGenre) {
      const match = EXPRESS_GENRES.find((item) =>
        item.id === queryGenre ||
        item.label.toLocaleLowerCase('fr').includes(queryGenre) ||
        queryGenre.includes(item.id),
      );
      if (match) setGenreId(match.id);
    }
  }, [searchParams]);

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
    const visibleTitle = (titleInputRef.current?.value ?? title).trim();
    if (!visibleTitle) {
      toast.error('Indiquez au moins le titre de votre livre.');
      return;
    }
    if (visibleTitle !== title) setTitle(visibleTitle);
    if (projectId) {
      setDownloaded(false);
      setStep(2);
      const composition = chosen ? compositionFor(chosen, lightness) : null;
      void updateCoverProject(projectId, {
        project_name: visibleTitle.slice(0, 80),
        book_title: visibleTitle,
        cover_type: format,
        format_id: formatId,
        page_count: format === 'paperback' ? 120 : null,
        ...(composition
          ? { fabric_json: serializeComposition(composition, illustrationPath) }
          : {}),
      })
        .then(() => toast.success('Les informations et la couverture ont été actualisées.'))
        .catch(() => toast.error('La couverture est actualisée à l’écran, mais son enregistrement a échoué.'));
      return;
    }
    setCreating(true);
    try {
      const created = await createCoverProject({
        project_name: visibleTitle.slice(0, 80),
        book_title: visibleTitle,
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

  const prepareDirection = async () => {
    if (synopsis.trim().length < 20) {
      toast.error('Ajoutez un synopsis assez précis pour obtenir une image fidèle.');
      return;
    }
    const genre = getExpressGenre(genreId);
    setDirectionBusy(true);
    setDirectionConfirmed(false);
    try {
      const { data, error } = await supabase.functions.invoke('cover-visual-prompt', {
        body: {
          summary: synopsis,
          genre: genre.brief.genre,
          mood: emotion || genre.brief.mood,
          palette: genre.brief.palette,
          bookTitle: title,
          subtitle,
          targetAudience,
          era,
          location,
          focalSubject,
          emotion,
          include: mustInclude,
          avoid: mustAvoid,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setVisualPrompt(data?.visualPrompt ?? '');
      toast.success('Direction artistique prête : relisez-la avant de générer.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Direction artistique indisponible.');
    } finally {
      setDirectionBusy(false);
    }
  };

  /* ---- illustration (fonction sécurisée existante) --------------------- */
  const generateIllustration = async () => {
    if (!projectId) return;
    if (!visualPrompt.trim() || !directionConfirmed) {
      toast.error('Préparez puis validez d’abord la direction artistique.');
      return;
    }
    const genre = getExpressGenre(genreId);
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('cover-pro-generate', {
        body: {
          projectId,
          genre: genre.brief.genre,
          mood: genre.brief.mood,
          palette: genre.brief.palette,
          avoid: [mustAvoid, 'texte, lettres, logo, bandeau, encart sombre'].filter(Boolean).join(', '),
          include: mustInclude,
          summary:
            [title.trim(), subtitle.trim()].filter(Boolean).join(' — ') +
            (synopsis.trim() ? `\n\nSynopsis du livre : ${synopsis.trim()}` : ''),
          artStyle: genre.brief.artStyle,
          // Par défaut une image claire : les rendus sombres étaient le principal défaut.
          lighting,
          visualPrompt,
          targetAudience,
          era,
          location,
          focalSubject,
          emotion,
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

  /** Image PNG haute définition de la couverture complète (rendu local). */
  const downloadPng = async () => {
    if (!chosen) return;
    setExporting(true);
    try {
      const composition = compositionFor(chosen, lightness);
      const result = await exportFrontPng(composition, illustrationUrl, title.trim());
      downloadBlob(result.blob, result.fileName);
      toast.success(`Image téléchargée : ${result.fileName}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Téléchargement impossible.');
    } finally {
      setExporting(false);
    }
  };

  /** Illustration seule, sans les textes. */
  const downloadIllustration = async () => {
    if (!illustrationUrl) return;
    setExporting(true);
    try {
      const response = await fetch(illustrationUrl);
      if (!response.ok) throw new Error('Illustration inaccessible.');
      const blob = await response.blob();
      const ext = blob.type.includes('jpeg') ? 'jpg' : 'png';
      downloadBlob(blob, safeFileName(title.trim(), 'illustration', ext));
      toast.success('Illustration téléchargée.');
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

  const goBack = () => {
    if (step === 3) {
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(1);
      return;
    }
    navigate(-1);
  };

  /* ---------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-16">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Retour
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

        {step > 1 && (
          <div className="mb-5 flex justify-start">
            <Button
              type="button"
              className="v3-btn-action-orange gap-2"
              onClick={() => setStep(1)}
            >
              <Pencil className="h-4 w-4" /> Modifier les informations du livre
            </Button>
          </div>
        )}

        {/* ------------------------- Étape 1 ------------------------------ */}
        {step === 1 && (
          <Card className="mx-auto max-w-xl">
            <CardContent className="space-y-4 p-5">
              <div className="space-y-1.5">
                <Label htmlFor="ex-title">Titre de votre livre</Label>
                <Input
                  id="ex-title"
                  ref={titleInputRef}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Les Flammes du Passé"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="ex-audience">Lecteurs visés</Label>
                  <Input id="ex-audience" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="Adultes, enfants de 8 à 12 ans…" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ex-era">Époque</Label>
                  <Input id="ex-era" value={era} onChange={(e) => setEra(e.target.value)} placeholder="Aujourd’hui, années 1940…" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ex-location">Lieu principal</Label>
                  <Input id="ex-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Paris, bord de mer, forêt…" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ex-focus">Personnage ou objet central</Label>
                  <Input id="ex-focus" value={focalSubject} onChange={(e) => setFocalSubject(e.target.value)} placeholder="Une femme de dos, une clé ancienne…" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ex-emotion">Émotion recherchée</Label>
                  <Input id="ex-emotion" value={emotion} onChange={(e) => setEmotion(e.target.value)} placeholder="Curiosité, tension, espoir…" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ex-include">Éléments obligatoires</Label>
                  <Input id="ex-include" value={mustInclude} onChange={(e) => setMustInclude(e.target.value)} placeholder="Ce qui doit apparaître" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="ex-avoid">Éléments interdits</Label>
                  <Input id="ex-avoid" value={mustAvoid} onChange={(e) => setMustAvoid(e.target.value)} placeholder="Ce qui ne doit surtout pas apparaître" />
                </div>
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
                <Label htmlFor="ex-synopsis">Synopsis du livre (ou courte biographie)</Label>
                <Textarea
                  id="ex-synopsis"
                  rows={5}
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  placeholder="Ex. : Biographie d’un chef de famille né en 1952, entre l’Algérie et la France, souvenirs d’enfance, ambiance chaleureuse et nostalgique…"
                />
                <p className="text-xs text-muted-foreground">
                  Résumez l’histoire, les personnages, le lieu, l’époque et l’ambiance : ce texte
                  guide l’image vers une couverture fidèle à votre livre.
                </p>
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
            <Card>
              <CardContent className="space-y-4 p-5">
                <div>
                  <h2 className="text-lg font-semibold text-[#232F3E]">Direction artistique de votre couverture</h2>
                  <p className="text-sm text-muted-foreground">Cette préparation ne consomme aucune génération. L’image ne sera créée qu’après votre confirmation.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
                  <Button variant="outline" onClick={() => void prepareDirection()} disabled={directionBusy || synopsis.trim().length < 20} className="gap-2">
                    {directionBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                    {visualPrompt ? 'Repréparer la direction' : 'Préparer la direction artistique'}
                  </Button>
                  <Select value={lighting} onValueChange={setLighting}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bright">Lumineuse</SelectItem>
                      <SelectItem value="balanced">Équilibrée</SelectItem>
                      <SelectItem value="dark">Dramatique lisible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea rows={5} value={visualPrompt} onChange={(e) => { setVisualPrompt(e.target.value); setDirectionConfirmed(false); }} placeholder="La scène précise, le cadrage, la lumière et le point focal apparaîtront ici avant la génération." />
                <div className="flex items-start gap-2 rounded-lg border border-[#008296]/30 bg-[#008296]/5 p-3">
                  <Checkbox id="express-direction-confirm" checked={directionConfirmed} onCheckedChange={(value) => setDirectionConfirmed(value === true)} />
                  <Label htmlFor="express-direction-confirm" className="cursor-pointer leading-5">Oui, cette scène correspond bien à mon livre. Je peux utiliser une génération.</Label>
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-white p-3 text-sm">
              <Badge variant={credits.remaining > 0 ? 'default' : 'secondary'}>
                {credits.remaining} image(s) incluse(s) restante(s)
              </Badge>
              {generating && (
                <span className="flex items-center gap-2 text-[#232F3E]">
                  <Loader2 className="h-4 w-4 animate-spin" /> Votre illustration est en cours de
                  création (environ 30 secondes)…
                </span>
              )}
              {!generating && illustrationPath && (
                <span className="text-muted-foreground">
                  Illustration appliquée aux trois propositions.
                </span>
              )}
              {!generating && !illustrationPath && credits.remaining > 0 && (
                <span className="text-muted-foreground">
                  Aucune illustration pour l’instant : cliquez sur « Créer mon illustration ».
                </span>
              )}
              {!generating && !illustrationPath && credits.remaining <= 0 && !key && (
                <span className="text-muted-foreground">
                  Vous n’avez plus d’image incluse. Ajoutez votre clé personnelle depuis{' '}
                  <Link to="/v3/cover-pro" className="underline">
                    cette page
                  </Link>{' '}
                  pour obtenir une illustration.
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
              <Button
                disabled={generating || !directionConfirmed || !visualPrompt.trim()}
                onClick={() => void generateIllustration()}
                className="bg-[#f47920] text-white hover:bg-[#d96812]"
              >
                {generating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {illustrationPath ? 'Créer une autre illustration fidèle' : 'Créer mon illustration validée'}
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

            <div className="flex justify-center">
              <Button
                type="button"
                className="v3-btn-action-orange gap-2"
                onClick={() => void openAdvanced()}
              >
                <Pencil className="h-4 w-4" /> Ouvrir l’éditeur complet
              </Button>
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

              <Button
                variant="outline"
                className="w-full"
                disabled={exporting}
                onClick={() => void downloadPng()}
              >
                <Download className="mr-2 h-4 w-4" /> Télécharger l’image (PNG)
              </Button>

              <Button
                variant="outline"
                className="w-full"
                disabled={exporting || !illustrationUrl}
                onClick={() => void downloadIllustration()}
              >
                <Download className="mr-2 h-4 w-4" /> Télécharger l’illustration seule
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
                <Button className="v3-btn-action-orange gap-2" onClick={() => void openAdvanced()}>
                  <Pencil className="h-4 w-4" /> Ouvrir l’éditeur complet
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
