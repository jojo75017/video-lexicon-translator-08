import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Loader2, Lock, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import useEbookLongFormAccess from '@/hooks/useEbookLongFormAccess';
import {
  LONG_FORM_MARKER,
  createLongFormProject,
  isLongFormProject,
  type LongFormProjectRow,
} from '@/lib/longform/longFormProjects';

const TONES = [
  { value: 'professionnel', label: 'Professionnel' },
  { value: 'chaleureux', label: 'Chaleureux' },
  { value: 'inspirant', label: 'Inspirant' },
  { value: 'pedagogique', label: 'Pédagogique' },
  { value: 'romanesque', label: 'Romanesque' },
];

export default function VersionLongueLibraryPage() {
  const navigate = useNavigate();
  const { loading: accessLoading, hasAccess } = useEbookLongFormAccess();
  const [projects, setProjects] = useState<LongFormProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('professionnel');
  const [languageCode, setLanguageCode] = useState('fr');
  const [chaptersCount, setChaptersCount] = useState(12);
  const [longChapters, setLongChapters] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('cs_projects')
      .select('*')
      .order('created_at', { ascending: false });
    setProjects(((data ?? []) as LongFormProjectRow[]).filter(isLongFormProject));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (hasAccess) void load();
    else if (!accessLoading) setLoading(false);
  }, [hasAccess, accessLoading, load]);

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error('Indiquez le titre du livre.');
      return;
    }
    setCreating(true);
    try {
      const project = await createLongFormProject({
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        target_audience: audience.trim() || null,
        tone,
        language_code: languageCode,
      });
      navigate(
        `/v3/version-longue/${project.id}?chapitres=${chaptersCount}&longueur=${longChapters ? 'longue' : 'standard'}&nouveau=1`,
      );
    } catch (error) {
      toast.error(`Création impossible : ${error instanceof Error ? error.message : 'erreur inconnue'}`);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce manuscrit et tous ses chapitres ?')) return;
    await supabase.from('cs_chapters').delete().eq('project_id', id);
    const { error } = await supabase.from('cs_projects').delete().eq('id', id);
    if (error) {
      toast.error(`Suppression impossible : ${error.message}`);
      return;
    }
    setProjects((list) => list.filter((p) => p.id !== id));
    toast.success('Manuscrit supprimé.');
  };

  if (accessLoading || loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center space-y-5">
        <Lock className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="text-2xl font-bold text-foreground">Outil Version Longue réservé</h1>
        <p className="text-[15px] text-muted-foreground">
          L’outil Version Longue est inclus avec l’offre à 47 € et avec les formules Plume et Édition.
        </p>
        <Link
          to="/v3/offre-version-longue"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Débloquer pour 47 €
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Ebook Version Longue
        </p>
        <h1 className="text-3xl font-bold text-foreground">Vos manuscrits longs</h1>
        <p className="max-w-2xl text-[14.5px] text-muted-foreground">
          Plan détaillé, rédaction chapitre par chapitre, couverture et exports Word, PDF et Markdown.
        </p>
      </header>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Nouveau manuscrit
        </button>
      )}

      {showForm && (
        <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Nouveau manuscrit</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-foreground">Titre du livre *</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Ex : Les Flammes du Passé"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-foreground">Sous-titre</span>
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-foreground">Public visé</span>
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-foreground">Ton</span>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                {TONES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-foreground">Langue</span>
              <select
                value={languageCode}
                onChange={(e) => setLanguageCode(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-foreground">
                Nombre de chapitres ({chaptersCount})
              </span>
              <input
                type="range"
                min={3}
                max={40}
                value={chaptersCount}
                onChange={(e) => setChaptersCount(Number(e.target.value))}
                className="w-full"
              />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={longChapters}
              onChange={(e) => setLongChapters(e.target.checked)}
            />
            Chapitres longs (environ 2 500 à 4 000 mots)
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCreate}
              disabled={creating}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
              Créer et générer le plan
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Aucun manuscrit pour l’instant. Créez votre premier livre long.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">{project.title}</h3>
                {project.subtitle && <p className="text-sm text-muted-foreground">{project.subtitle}</p>}
                <p className="text-xs text-muted-foreground">
                  Créé le {new Date(project.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Link
                  to={`/v3/version-longue/${project.id}`}
                  className="flex-1 rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Ouvrir
                </Link>
                <button
                  onClick={() => handleDelete(project.id)}
                  aria-label="Supprimer"
                  className="rounded-md border border-border p-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Marqueur interne des manuscrits longs : {LONG_FORM_MARKER}.
      </p>
    </div>
  );
}
