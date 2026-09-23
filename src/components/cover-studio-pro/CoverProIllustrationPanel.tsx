import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Pencil, Sparkles, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSignedCoverUrl, listCoverProjects, type CoverProject } from '@/lib/coverProjects';
import MyBookPicker from '@/components/cover-editor/MyBookPicker';
import type { MyBookOption } from '@/lib/cover-editor/myBooks';

/** Bouton orange toujours visible pour ouvrir l'éditeur du projet sélectionné. */
function ContinueInEditorButton({ projectId }: { projectId: string }) {
  return (
    <Button asChild className="gap-1 bg-[#FF9E2D] font-semibold text-[#232F3E] hover:bg-[#FF8C00]">
      <Link to={`/v3/mes-couvertures/${projectId}`}>
        <Pencil className="h-4 w-4" /> Continuer dans l&rsquo;éditeur <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}

interface Props {
  remaining: number;
  hasKey: boolean;
  onGenerated: () => void;
}

/**
 * Génération de l'illustration (sans aucun texte) pour un projet privé.
 * Le serveur choisit le financement : générations incluses puis clé personnelle.
 */
export default function CoverProIllustrationPanel({ remaining, hasKey, onGenerated }: Props) {
  const [projects, setProjects] = useState<CoverProject[]>([]);
  const [projectId, setProjectId] = useState('');
  const [genre, setGenre] = useState('');
  const [summary, setSummary] = useState('');
  const [mood, setMood] = useState('');
  const [palette, setPalette] = useState('');
  const [avoid, setAvoid] = useState('');
  /** Cadrage complémentaire : rien n'est inventé, tout reste facultatif. */
  const [focalSubject, setFocalSubject] = useState('');
  const [era, setEra] = useState('');
  const [location, setLocation] = useState('');
  const [lighting, setLighting] = useState('');
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<{ url: string; width: number; height: number; funding: string } | null>(null);
  /** Titre du livre : sert uniquement de contexte, jamais écrit dans l'image. */
  const [bookTitle, setBookTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  /** Consigne visuelle sur-mesure déduite du synopsis, modifiable avant génération. */
  const [visualPrompt, setVisualPrompt] = useState('');
  const [visualBusy, setVisualBusy] = useState(false);

  /**
   * Demande à l'IA la consigne visuelle correspondant réellement au livre
   * (scène clé, décor, époque, couleurs). Analyse de texte : aucune image,
   * aucune génération consommée à cette étape.
   */
  const proposeVisualPrompt = async (source?: {
    summary?: string;
    genre?: string;
    bookTitle?: string;
    subtitle?: string;
  }) => {
    const text = (source?.summary ?? summary).trim();
    if (text.length < 20) {
      toast.error('Ajoutez d’abord le synopsis de votre livre (quelques phrases suffisent).');
      return;
    }
    setVisualBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke('cover-visual-prompt', {
        body: {
          summary: text,
          genre: source?.genre ?? genre,
          mood,
          palette,
          avoid,
          focalSubject,
          era,
          location,
          bookTitle: source?.bookTitle ?? bookTitle,
          subtitle: source?.subtitle ?? subtitle,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const proposed = data?.visualPrompt as string | undefined;
      if (!proposed) throw new Error('Consigne visuelle indisponible.');
      setVisualPrompt(proposed);
      toast.success('Consigne visuelle créée depuis votre livre : relisez-la, puis générez.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Consigne visuelle indisponible.');
    } finally {
      setVisualBusy(false);
    }
  };

  /** Reprend un livre enregistré : genre et synopsis, sans rien inventer. */
  const applyMyBook = (book: MyBookOption) => {
    if (book.genre) setGenre(book.genre);
    if (book.synopsis) setSummary(book.synopsis);
    setBookTitle(book.title);
    setSubtitle(book.subtitle);
    toast.success(`Livre chargé : ${book.title}`);
    if (book.synopsis && book.synopsis.trim().length >= 20) {
      void proposeVisualPrompt({
        summary: book.synopsis,
        genre: book.genre,
        bookTitle: book.title,
        subtitle: book.subtitle,
      });
    }
  };

  useEffect(() => {
    listCoverProjects()
      .then((list) => {
        setProjects(list);
        if (list.length && !projectId) setProjectId(list[0].id);
      })
      .catch(() => setProjects([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generate = async () => {
    if (!projectId) {
      toast.error('Choisissez d\u2019abord un projet de couverture.');
      return;
    }
    if (!visualPrompt.trim()) {
      toast.error('Créez d’abord la consigne visuelle depuis votre synopsis.');
      return;
    }
    setBusy(true);
    setPreview(null);
    try {
      const { data, error } = await supabase.functions.invoke('cover-pro-generate', {
        body: {
          projectId,
          genre,
          summary,
          mood,
          palette,
          avoid,
          lighting: 'bright',
          bookTitle,
          visualPrompt: visualPrompt.trim(),
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const signed = await getSignedCoverUrl(data.illustrationPath, 600);
      setPreview({
        url: signed ?? '',
        width: data.width,
        height: data.height,
        funding: data.funding,
      });
      toast.success(
        data.funding === 'ebookstudio'
          ? `Illustration générée. Générations incluses restantes : ${data.credits?.remaining ?? 0}.`
          : 'Illustration générée avec votre clé personnelle.',
      );
      onGenerated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Génération impossible');
    } finally {
      setBusy(false);
    }
  };

  const blocked = remaining <= 0 && !hasKey;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Wand2 className="h-4 w-4 text-primary" /> Illustration IA sans texte
        </CardTitle>
        <CardDescription>
          1. Illustration · 2. Textes dans l&rsquo;éditeur · 3. Téléchargement — le titre, le sous-titre et
          le nom d&rsquo;auteur sont ajoutés ensuite en calques modifiables : l&rsquo;image générée ne
          contient volontairement aucun mot.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge variant={remaining > 0 ? 'default' : 'secondary'}>
            {remaining} génération{remaining > 1 ? 's' : ''} incluse{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''}
          </Badge>
          {remaining <= 0 && (
            <span className="text-muted-foreground">
              {hasKey ? 'Les suivantes utilisent votre clé personnelle.' : 'Ajoutez votre clé pour continuer.'}
            </span>
          )}
        </div>

        {/* Reprendre un livre déjà enregistré : genre et synopsis préremplis. */}
        <MyBookPicker
          onSelect={applyMyBook}
          hint="Le genre et le synopsis se remplissent depuis votre livre. Vous pouvez tout corriger ensuite."
        />

        <div className="space-y-2">
          <Label htmlFor="cp-project">Projet de couverture</Label>
          <select
            id="cp-project"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            {projects.length === 0 && <option value="">Aucun projet — créez-en un dans « Mes couvertures »</option>}
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.project_name}</option>
            ))}
          </select>
        </div>

        {projectId && (
          <div className="flex flex-wrap items-center gap-2">
            <ContinueInEditorButton projectId={projectId} />
            <span className="text-xs text-muted-foreground">
              Ouvre l&rsquo;éditeur pour ajouter vos titres et finaliser la couverture.
            </span>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cp-genre">Genre</Label>
            <Input id="cp-genre" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Thriller, développement personnel…" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cp-mood">Ambiance</Label>
            <Input id="cp-mood" value={mood} onChange={(e) => setMood(e.target.value)} placeholder="Sombre, lumineuse, chaleureuse…" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cp-palette">Palette</Label>
            <Input id="cp-palette" value={palette} onChange={(e) => setPalette(e.target.value)} placeholder="Bleu nuit et or" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cp-avoid">À éviter</Label>
            <Input id="cp-avoid" value={avoid} onChange={(e) => setAvoid(e.target.value)} placeholder="Visages, animaux…" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cp-summary">Synopsis du livre (ou courte biographie)</Label>
          <Textarea
            id="cp-summary"
            rows={5}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Ex. : Biographie d'un chef de famille né en 1952, entre l'Algérie et la France, souvenirs d'enfance…"
          />
          <p className="text-xs text-muted-foreground">
            Résumez l&rsquo;histoire, les personnages, le lieu, l&rsquo;époque et l&rsquo;ambiance — ce texte
            guide l&rsquo;IA vers une illustration fidèle à votre livre.
          </p>
        </div>

        {/* Consigne visuelle sur-mesure : la scène réelle du livre, ses couleurs
            et son ambiance, relue et modifiable avant toute génération. */}
        <div className="space-y-2 rounded-lg border border-[#FF9E2D]/40 bg-[#FF9E2D]/5 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label htmlFor="cp-visual">Consigne visuelle sur-mesure (créée depuis votre livre)</Label>
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              disabled={visualBusy || busy || summary.trim().length < 20}
              onClick={() => void proposeVisualPrompt()}
            >
              {visualBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {visualPrompt ? 'Refaire la consigne' : 'Créer la consigne depuis mon synopsis'}
            </Button>
          </div>
          <Textarea
            id="cp-visual"
            rows={6}
            value={visualPrompt}
            onChange={(e) => setVisualPrompt(e.target.value)}
            placeholder="La scène de votre livre, son décor, son époque, sa lumière et ses couleurs apparaîtront ici."
          />
          <p className="text-xs text-muted-foreground">
            Cette consigne décrit la scène réelle de votre histoire, ses couleurs et son ambiance :
            c&rsquo;est elle qui donne une vraie couverture, et non une image passe-partout. Relisez-la,
            corrigez un détail si vous le souhaitez, puis générez. Votre titre, votre sous-titre et
            votre nom d&rsquo;auteur seront ensuite ajoutés sur l&rsquo;image dans l&rsquo;éditeur.
          </p>
        </div>

        <Button onClick={generate} disabled={busy || blocked || !projectId} className="w-full">
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          {busy ? 'Génération en cours…' : 'Générer l\u2019illustration'}
        </Button>

        {preview?.url && (
          <div className="space-y-2">
            <img
              src={preview.url}
              alt="Illustration de couverture générée, sans texte"
              className="mx-auto max-h-[520px] rounded-lg border"
            />
            <p className="text-center text-xs text-muted-foreground">
              {preview.width} × {preview.height} px ·{' '}
              {preview.funding === 'ebookstudio' ? 'génération incluse' : 'votre clé OpenAI'} · fichier privé
            </p>
            {projectId && (
              <div className="flex justify-center pt-1">
                <ContinueInEditorButton projectId={projectId} />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
