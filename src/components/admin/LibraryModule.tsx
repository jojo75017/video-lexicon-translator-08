import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BookOpen, Headphones, Pencil, Rocket, Download, Trash2, Loader2 } from 'lucide-react';

const slugify = (s: string) =>
  (s || 'livre')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-').replace(/(^-|-$)/g, '').toLowerCase() || 'livre';

const downloadText = (filename: string, content: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const TEAL = '#008296';
const INK = '#232F3E';

interface EbookRow {
  id: string;
  title: string;
  target_audience: string | null;
  book_summary: string | null;
  project_type: string | null;
}

interface AudioRow {
  id: string;
  title: string;
  author_name: string | null;
  description: string | null;
  status: string | null;
  duration_seconds: number | null;
}

export default function LibraryModule() {
  const [tab, setTab] = useState<'numeriques' | 'audio'>('numeriques');
  const [loading, setLoading] = useState(true);
  const [ebooks, setEbooks] = useState<EbookRow[]>([]);
  const [audios, setAudios] = useState<AudioRow[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const [{ data: eb }, { data: au }] = await Promise.all([
      supabase
        .from('ebook_projects')
        .select('id, title, target_audience, book_summary, project_type')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false }),
      supabase
        .from('audiobooks')
        .select('id, title, author_name, description, status, duration_seconds')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false }),
    ]);
    setEbooks((eb as EbookRow[]) ?? []);
    setAudios((au as AudioRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const deleteEbook = async (id: string) => {
    if (!confirm('Supprimer définitivement ce livre ?')) return;
    setDeleting(id);
    const { error } = await supabase.from('ebook_projects').delete().eq('id', id);
    setDeleting(null);
    if (error) {
      toast.error('Suppression impossible');
      return;
    }
    setEbooks((prev) => prev.filter((e) => e.id !== id));
    toast.success('Livre supprimé');
  };

  const deleteAudio = async (id: string) => {
    if (!confirm('Supprimer définitivement ce livre audio ?')) return;
    setDeleting(id);
    const { error } = await supabase.from('audiobooks').delete().eq('id', id);
    setDeleting(null);
    if (error) {
      toast.error('Suppression impossible');
      return;
    }
    setAudios((prev) => prev.filter((a) => a.id !== id));
    toast.success('Livre audio supprimé');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold" style={{ color: TEAL }}>
          Ma bibliothèque
        </h2>
        <p className="text-sm" style={{ color: `${INK}99` }}>
          Toutes vos créations au même endroit.
        </p>
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-lg border overflow-hidden" style={{ borderColor: '#E3E6E6' }}>
        <button
          onClick={() => setTab('numeriques')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors"
          style={tab === 'numeriques' ? { background: TEAL, color: '#fff' } : { background: '#fff', color: `${INK}99` }}
        >
          <BookOpen className="h-4 w-4" /> Livres numériques
          <span
            className="text-xs rounded-full px-1.5"
            style={tab === 'numeriques' ? { background: '#ffffff33' } : { background: '#F0F0F0' }}
          >
            {ebooks.length}
          </span>
        </button>
        <button
          onClick={() => setTab('audio')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors"
          style={tab === 'audio' ? { background: TEAL, color: '#fff' } : { background: '#fff', color: `${INK}99` }}
        >
          <Headphones className="h-4 w-4" /> Livres audio
          <span
            className="text-xs rounded-full px-1.5"
            style={tab === 'audio' ? { background: '#ffffff33' } : { background: '#F0F0F0' }}
          >
            {audios.length}
          </span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-12 justify-center" style={{ color: `${INK}80` }}>
          <Loader2 className="h-5 w-5 animate-spin" /> Chargement…
        </div>
      ) : tab === 'numeriques' ? (
        ebooks.length === 0 ? (
          <EmptyState label="Aucun livre numérique pour le moment." />
        ) : (
          <div className="space-y-4">
            {ebooks.map((b) => (
              <BookCard
                key={b.id}
                title={b.title}
                subtitle={b.target_audience}
                summary={b.book_summary}
                deleting={deleting === b.id}
                onDelete={() => deleteEbook(b.id)}
              />
            ))}
          </div>
        )
      ) : audios.length === 0 ? (
        <EmptyState label="Aucun livre audio pour le moment." />
      ) : (
        <div className="space-y-4">
          {audios.map((a) => (
            <BookCard
              key={a.id}
              title={a.title}
              subtitle={a.author_name}
              summary={a.description}
              status={a.status}
              deleting={deleting === a.id}
              onDelete={() => deleteAudio(a.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed p-10 text-center text-sm" style={{ borderColor: '#E3E6E6', color: `${INK}80` }}>
      {label}
    </div>
  );
}

function BookCard({
  title,
  subtitle,
  summary,
  status,
  deleting,
  onDelete,
}: {
  title: string;
  subtitle?: string | null;
  summary?: string | null;
  status?: string | null;
  deleting?: boolean;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-xl border p-4 flex gap-4 items-start" style={{ borderColor: '#E3E6E6', background: '#fff' }}>
      <div
        className="h-20 w-16 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${TEAL}14`, color: TEAL }}
      >
        <BookOpen className="h-7 w-7" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <h3 className="font-bold text-sm truncate" style={{ color: INK }}>
            {title}
          </h3>
          <span
            className="text-[10px] font-semibold rounded-md px-2 py-0.5 shrink-0"
            style={{ background: '#F0F0F0', color: `${INK}99` }}
          >
            {status === 'published' ? 'Publié' : 'Brouillon'}
          </span>
        </div>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: `${INK}99` }}>
            {subtitle}
          </p>
        )}
        {summary && (
          <p className="text-xs mt-1 line-clamp-2" style={{ color: `${INK}80` }}>
            {summary}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 shrink-0">
        <Button variant="outline" size="sm" className="justify-start" onClick={() => toast('Ouverture de l\'éditeur…')}>
          <Pencil className="h-3.5 w-3.5 mr-1.5" /> Modifier
        </Button>
        <Button size="sm" className="justify-start" style={{ background: '#FF9E2D', color: INK }} onClick={() => toast('Publication…')}>
          <Rocket className="h-3.5 w-3.5 mr-1.5" /> Publier
        </Button>
        <Button variant="outline" size="sm" className="justify-start" onClick={() => toast('Export en cours…')}>
          <Download className="h-3.5 w-3.5 mr-1.5" /> Exporter
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="justify-start"
          style={{ color: '#C0392B', borderColor: '#C0392B55' }}
          disabled={deleting}
          onClick={onDelete}
        >
          {deleting ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5 mr-1.5" />}
          Supprimer
        </Button>
      </div>
    </div>
  );
}
