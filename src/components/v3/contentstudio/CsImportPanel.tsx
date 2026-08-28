import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Film, Link2, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { extractTextFromPdf } from '@/lib/import/importFromPdf';
import { buildManuscriptFromText } from '@/lib/import/buildManuscriptFromText';
import type { Manuscript } from '@/lib/bookperfect/types';

type SourceKind = 'book' | 'article' | 'video';

const TABS: { kind: SourceKind; label: string; hint: string; icon: typeof FileText }[] = [
  { kind: 'book', label: 'Un livre / document', hint: 'PDF, TXT ou Markdown', icon: FileText },
  { kind: 'article', label: 'Un article de blog', hint: 'Collez l’adresse de la page', icon: Link2 },
  { kind: 'video', label: 'Une vidéo / un audio', hint: 'MP4, MP3, M4A, WAV (max 20 Mo)', icon: Film },
];

/** Convertit un fichier en base64 pour la transcription côté serveur. */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const idx = result.indexOf(',');
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.onerror = () => reject(new Error('Lecture du fichier impossible.'));
    reader.readAsDataURL(file);
  });
}

export default function CsImportPanel({ onImported }: { onImported?: () => void }) {
  const navigate = useNavigate();
  const [kind, setKind] = useState<SourceKind>('book');
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const mediaRef = useRef<HTMLInputElement>(null);

  /** Étape commune : texte source → projet ContentStudio + chapitres. */
  const createProjectFromText = async (rawText: string, fallbackName: string, sourceKind: SourceKind) => {
    setBusy('Analyse du contenu…');
    const manuscript: Manuscript = await buildManuscriptFromText(rawText, fallbackName);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Vous devez être connecté.');

    const { data: meta } = await supabase.functions.invoke('cs-import-source', {
      body: { text: manuscript.rawText.slice(0, 12000), source_kind: sourceKind, language_code: 'fr' },
    });

    setBusy('Création du projet…');
    const { data: project, error: pErr } = await supabase
      .from('cs_projects')
      .insert({
        user_id: user.id,
        title: (meta?.title || manuscript.title || fallbackName).slice(0, 160),
        subtitle: meta?.subtitle || null,
        target_audience: meta?.target_audience || null,
        tone: meta?.tone || 'informative',
        language_code: 'fr',
      })
      .select()
      .single();
    if (pErr || !project) throw new Error(pErr?.message || 'Création du projet impossible.');

    const chapters = manuscript.chapters.slice(0, 40).map((c, i) => ({
      project_id: project.id,
      chapter_number: i + 1,
      title: c.title || `Chapitre ${i + 1}`,
      content_markdown: c.content || null,
      key_takeaways: [],
      status: c.content && c.content.trim().length > 200 ? 'completed' : 'draft',
    }));
    const { error: cErr } = await supabase.from('cs_chapters').insert(chapters);
    if (cErr) throw new Error(cErr.message);

    toast.success(`Import réussi : ${chapters.length} chapitre(s) récupéré(s).`);
    onImported?.();
    navigate(`/v3/contentstudio/${project.id}`);
  };

  const run = async (fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Import impossible.');
    } finally {
      setBusy(null);
    }
  };

  const handleFile = (file?: File | null) =>
    run(async () => {
      if (!file) return;
      setBusy('Lecture du fichier…');
      let text = '';
      if (/\.pdf$/i.test(file.name)) {
        text = await extractTextFromPdf(file);
        if (!text) throw new Error('Ce PDF semble scanné : aucun texte extractible.');
      } else {
        text = await file.text();
      }
      await createProjectFromText(text, file.name.replace(/\.[a-z0-9]+$/i, ''), 'book');
    });

  const handleUrl = () =>
    run(async () => {
      if (!/^https?:\/\//i.test(url.trim())) throw new Error('Adresse invalide (elle doit commencer par https://).');
      setBusy('Récupération de l’article…');
      const { data, error } = await supabase.functions.invoke('import-from-url', { body: { url: url.trim() } });
      if (error) throw new Error(error.message || 'Impossible de lire cette page.');
      if (!data?.content) throw new Error('Aucun contenu lisible sur cette page.');
      await createProjectFromText(data.content, data.title || 'Article importé', 'article');
    });

  const handleMedia = (file?: File | null) =>
    run(async () => {
      if (!file) return;
      if (file.size > 20 * 1024 * 1024) throw new Error('Fichier trop volumineux (max 20 Mo).');
      setBusy('Transcription en cours (cela peut prendre 1 à 2 minutes)…');
      const base64 = await fileToBase64(file);
      const { data, error } = await supabase.functions.invoke('import-from-media', {
        body: { fileName: file.name, mimeType: file.type || 'audio/mpeg', base64 },
      });
      if (error) throw new Error(error.message || 'Transcription impossible.');
      if (!data?.transcript) throw new Error('Aucune transcription reçue.');
      await createProjectFromText(data.transcript, file.name.replace(/\.[a-z0-9]+$/i, ''), 'video');
    });

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Importer une source existante</h2>
        <p className="text-[13px] text-muted-foreground">
          Partez d’un livre, d’une vidéo ou d’un article de blog : le contenu est découpé en chapitres,
          prêt à devenir un livre KDP puis une formation vidéo.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = kind === t.kind;
          return (
            <button
              key={t.kind}
              onClick={() => setKind(t.kind)}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors ${
                active
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      <p className="text-[12px] text-muted-foreground">{TABS.find((t) => t.kind === kind)?.hint}</p>

      {kind === 'book' && (
        <>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.txt,.md,.markdown"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={!!busy}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            <Upload className="h-4 w-4" /> Choisir un fichier
          </button>
        </>
      )}

      {kind === 'article' && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://mon-blog.fr/mon-article"
            className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            onClick={handleUrl}
            disabled={!!busy || !url.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            <Link2 className="h-4 w-4" /> Importer l’article
          </button>
        </div>
      )}

      {kind === 'video' && (
        <>
          <input
            ref={mediaRef}
            type="file"
            accept="audio/*,video/*"
            className="hidden"
            onChange={(e) => handleMedia(e.target.files?.[0])}
          />
          <button
            onClick={() => mediaRef.current?.click()}
            disabled={!!busy}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            <Film className="h-4 w-4" /> Choisir une vidéo ou un audio
          </button>
        </>
      )}

      {busy && (
        <p className="inline-flex items-center gap-2 text-[13px] font-medium text-primary">
          <Loader2 className="h-4 w-4 animate-spin" /> {busy}
        </p>
      )}
    </div>
  );
}
