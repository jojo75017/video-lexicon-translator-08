import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Search, Building2, AlertTriangle, Sparkles, Send, Info } from 'lucide-react';
import { toast } from 'sonner';

const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const AMBER_SOFT = '#FFF3DF';
const INK = '#2A2118';
const GREEN = '#1f9d6b';
const SERIF = "'Instrument Serif', Georgia, 'Times New Roman', serif";

const CONFIG_KEY = 'edition_book_config_v1';

interface BookConfig {
  title: string; genre: string; targetAudience: string; description: string;
}
function readConfig(): BookConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    const c = raw ? JSON.parse(raw) : {};
    return { title: c?.title || '', genre: c?.genre || '', targetAudience: c?.targetAudience || '', description: c?.description || '' };
  } catch {
    return { title: '', genre: '', targetAudience: '', description: '' };
  }
}

interface Publisher {
  name: string;
  match: string;
  editorial_line: string;
  why: string;
  alerts: string;
  submission_tip: string;
}
interface Report {
  publishers: Publisher[];
  summary: string;
  warnings: string[];
}

function matchColor(match: string): string {
  const m = (match || '').toLowerCase();
  if (m.includes('forte')) return GREEN;
  if (m.includes('bonne')) return AMBER;
  return '#8a7860';
}

const PublisherSelectionFinder: React.FC = () => {
  const [cfg] = useState<BookConfig>(() => readConfig());
  const [genre, setGenre] = useState(() => cfg.genre || '');
  const [subgenre, setSubgenre] = useState('');
  const [keywords, setKeywords] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [description, setDescription] = useState(() => cfg.description || '');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    if (!description && cfg.description) setDescription(cfg.description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = async () => {
    if (description.trim().length < 15 && genre.trim().length < 2 && keywords.trim().length < 2) {
      toast.error('Décris ton livre : genre, mots-clés ou un résumé.');
      return;
    }
    setLoading(true); setReport(null);
    try {
      const { data, error } = await supabase.functions.invoke('selection-publishers', {
        body: {
          title: cfg.title,
          genre: genre.trim(),
          subgenre: subgenre.trim(),
          audience: cfg.targetAudience,
          wordCount: wordCount.trim(),
          keywords: keywords.trim(),
          description: description.trim(),
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setReport(data.report as Report);
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la recherche de maisons d\'édition.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5" style={{ color: INK }}>
      <div className="rounded-2xl border p-4" style={{ borderColor: '#eadfc9', background: AMBER_SOFT }}>
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" style={{ color: AMBER_DEEP }} />
          <span className="text-sm font-bold">Le moteur de recherche de maisons d'édition</span>
        </div>
        <p className="mt-1 text-[12.5px]" style={{ color: '#6f5e47' }}>
          Trouvez les éditeurs les plus susceptibles d'éditer votre livre. <em>Sélection</em> identifie des maisons
          dont la ligne éditoriale est cohérente avec la description de votre livre. Arrêtez d'envoyer votre manuscrit à l'aveugle.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Input placeholder="Genre (ex. roman contemporain)" value={genre} onChange={(e) => setGenre(e.target.value)} />
        <Input placeholder="Sous-genre / niche (ex. dark romance)" value={subgenre} onChange={(e) => setSubgenre(e.target.value)} />
        <Input placeholder="Mots-clés / singularité (voix singulière…)" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
        <Input placeholder="Taille (ex. 80 000 mots)" value={wordCount} onChange={(e) => setWordCount(e.target.value)} />
      </div>
      <Textarea
        rows={4}
        placeholder="Décrivez votre livre : intrigue, ton, thèmes, ce qui le rend singulier…"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button onClick={run} disabled={loading} style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)`, color: '#fff' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        <span className="ml-1.5">Trouver mes maisons d'édition</span>
      </Button>

      {loading && <p className="text-sm" style={{ color: '#8a7860' }}>Sélection recherche les maisons dont la ligne éditoriale correspond…</p>}

      {report && (
        <div className="space-y-5 text-sm">
          <div className="rounded-xl border p-3" style={{ borderColor: `${AMBER}44`, background: '#fff' }}>
            <p className="flex items-center gap-1.5 font-semibold" style={{ color: AMBER_DEEP }}>
              <Sparkles className="h-4 w-4" />
              {report.publishers.length} maison{report.publishers.length > 1 ? 's' : ''} d'édition correspond{report.publishers.length > 1 ? 'ent' : ''} à votre recherche
            </p>
            <p className="mt-1" style={{ color: '#4a3f30' }}>{report.summary}</p>
          </div>

          <div className="space-y-2.5">
            {report.publishers.map((p, i) => (
              <div key={i} className="rounded-xl border p-3" style={{ borderColor: '#eadfc9', background: '#fff' }}>
                <div className="flex items-start justify-between gap-2">
                  <span className="flex items-center gap-1.5 font-semibold" style={{ color: INK, fontFamily: SERIF, fontSize: '1.05rem' }}>
                    <Building2 className="h-4 w-4" style={{ color: AMBER_DEEP }} />
                    {p.name}
                  </span>
                  <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                    style={{ background: `${matchColor(p.match)}22`, color: matchColor(p.match) }}>
                    {p.match}
                  </span>
                </div>
                <p className="mt-1 text-[12.5px] font-medium" style={{ color: '#6f5e47' }}>{p.editorial_line}</p>
                <p className="mt-1 text-[12.5px]" style={{ color: '#4a3f30' }}>{p.why}</p>
                {p.submission_tip && (
                  <p className="mt-1.5 flex items-start gap-1.5 text-[12px]" style={{ color: GREEN }}>
                    <Send className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {p.submission_tip}
                  </p>
                )}
                {p.alerts && (
                  <p className="mt-1 flex items-start gap-1.5 text-[12px]" style={{ color: '#c0392b' }}>
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {p.alerts}
                  </p>
                )}
              </div>
            ))}
          </div>

          {report.warnings?.length > 0 && (
            <div className="rounded-xl border p-3" style={{ borderColor: '#eadfc9', background: AMBER_SOFT }}>
              <p className="mb-1 flex items-center gap-1.5 font-semibold" style={{ color: AMBER_DEEP }}>
                <Info className="h-4 w-4" /> À savoir avant d'envoyer
              </p>
              <ul className="list-disc space-y-0.5 pl-5 text-[12.5px]" style={{ color: '#6f5e47' }}>
                {report.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PublisherSelectionFinder;
