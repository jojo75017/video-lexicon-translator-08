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
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<{ url: string; width: number; height: number; funding: string } | null>(null);

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
    setBusy(true);
    setPreview(null);
    try {
      const { data, error } = await supabase.functions.invoke('cover-pro-generate', {
        body: { projectId, genre, summary, mood, palette, avoid },
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
          Le titre, le sous-titre et le nom d'auteur seront ajoutés plus tard en calques modifiables :
          l'image générée ne contient volontairement aucun mot.
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
          <Label htmlFor="cp-summary">Sujet du livre</Label>
          <Textarea
            id="cp-summary"
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Décrivez en quelques phrases le sujet et la scène souhaitée."
          />
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
