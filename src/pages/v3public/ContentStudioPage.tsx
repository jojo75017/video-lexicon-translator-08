import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Film, BookOpen, Trash2, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import CsImportPanel from '@/components/v3/contentstudio/CsImportPanel';
import type { CsProject, CsTone } from '@/types/contentStudio';
import { CS_TONE_LABELS } from '@/types/contentStudio';


export default function ContentStudioPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<CsProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);

  // Formulaire
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState<CsTone>('professional');
  const [languageCode, setLanguageCode] = useState('fr');
  const [chaptersCount, setChaptersCount] = useState(12);

  const loadProjects = useCallback(async () => {
    const { data, error } = await supabase
      .from('cs_projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('load projects', error);
      toast.error(`Chargement impossible : ${error.message}`);
      return;
    }
    setProjects((data as CsProject[]) || []);
  }, []);

  useEffect(() => {
    loadProjects().finally(() => setLoading(false));
  }, [loadProjects]);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setCreating(false);
      toast.error('Vous devez être connecté pour créer un projet.');
      return;
    }
    const { data, error } = await supabase
      .from('cs_projects')
      .insert({
        user_id: user.id,
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        target_audience: targetAudience.trim() || null,
        tone,
        language_code: languageCode,
      })
      .select()
      .single();
    if (error) {
      console.error('create project', error);
      setCreating(false);
      toast.error(`Création impossible : ${error.message}`);
      return;
    }

    // Génère le plan de chapitres
    try {
      const { data: outline, error: oErr } = await supabase.functions.invoke('cs-generate-outline', {
        body: { title: title.trim(), subtitle, target_audience: targetAudience, tone, language_code: languageCode, chapters_count: chaptersCount },
      });
      if (oErr || !outline?.chapters?.length) throw new Error(oErr?.message || outline?.error || 'Plan vide');
      const rows = outline.chapters.map((c: any) => ({
        project_id: data.id,
        chapter_number: c.chapter_number,
        title: c.title,
        key_takeaways: c.key_takeaways || [],
        status: 'draft',
      }));
      const { error: insErr } = await supabase.from('cs_chapters').insert(rows);
      if (insErr) throw new Error(insErr.message);
      toast.success(`Plan généré : ${rows.length} chapitres.`);
    } catch (e) {
      console.error('outline', e);
      toast.error(`Plan IA indisponible : ${e instanceof Error ? e.message : 'erreur inconnue'}. Vous pouvez le relancer depuis le projet.`);
    }

    setCreating(false);
    navigate(`/v3/contentstudio/${data.id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce projet ContentStudio et tous ses chapitres ?')) return;
    await supabase.from('cs_chapters').delete().eq('project_id', id);
    await supabase.from('cs_projects').delete().eq('id', id);
    setProjects((p) => p.filter((x) => x.id !== id));
  };

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          ContentStudio Engine
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          🎬 Transformez votre livre en formation vidéo
        </h1>
        <p className="max-w-2xl text-[14.5px] text-muted-foreground">
          Créez un ebook conforme aux normes Amazon KDP, puis déclinez-le en formation vidéo
          (scripts, slides, voix off, sous-titres, MP4 monté). Tout est inclus, aucune clé API à fournir.
        </p>
      </header>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Nouveau projet
        </button>
      )}

      {showForm && (
        <div className="rounded-lg border border-border bg-card p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Nouveau projet ContentStudio</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Titre du livre *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Ex : Le Guide Complet du Marketing Digital"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Sous-titre</label>
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Ex : De zéro à expert en 30 jours"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Public cible</label>
              <input
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Ex : Entrepreneurs débutants en marketing"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Ton</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as CsTone)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                {Object.entries(CS_TONE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Langue</label>
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
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Nombre de chapitres ({chaptersCount})
              </label>
              <input
                type="range"
                min={3}
                max={40}
                value={chaptersCount}
                onChange={(e) => setChaptersCount(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              disabled={!title.trim() || creating}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {creating ? 'Création + plan IA…' : 'Créer & générer le plan'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {projects.length === 0 && !showForm && (
        <div className="rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
          <Film className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            Aucun projet ContentStudio. Cliquez sur « Nouveau projet » pour commencer.
          </p>
        </div>
      )}

      {projects.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="group rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <button onClick={() => navigate(`/v3/contentstudio/${p.id}`)} className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground group-hover:text-primary">{p.title}</h3>
                  {p.subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{p.subtitle}</p>}
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  <BookOpen className="h-3 w-3" /> {CS_TONE_LABELS[p.tone as CsTone] || p.tone}
                </span>
                {p.video_unlocked && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                    <Film className="h-3 w-3" /> Vidéo débloquée
                  </span>
                )}
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Créé le {new Date(p.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
