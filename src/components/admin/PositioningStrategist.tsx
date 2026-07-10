import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Compass, Tag, KeyRound, Swords, AlertTriangle, Target } from 'lucide-react';
import { toast } from 'sonner';

const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const AMBER_SOFT = '#FFF3DF';
const INK = '#2A2118';
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

interface Category { path: string; difficulty: string; target_rank: string; why: string; }
interface Keyword { keyword: string; intent: string; }
interface Report {
  categories: Category[];
  keywords: Keyword[];
  competitive: { angle: string; gaps: string[]; watchouts: string[] };
  summary: string;
}

const diffColor: Record<string, string> = { faible: '#1f9d6b', moyen: AMBER, fort: '#E94E77' };

const PositioningStrategist: React.FC = () => {
  const [cfg, setCfg] = useState<BookConfig>(() => readConfig());
  const [niche, setNiche] = useState('');
  const [market, setMarket] = useState('Amazon.fr');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    const refresh = () => setCfg(readConfig());
    window.addEventListener('edition_book_config_updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('edition_book_config_updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const run = async () => {
    if (cfg.title.trim().length < 2 && niche.trim().length < 2 && cfg.description.trim().length < 20) {
      toast.error('Renseigne le titre (fiche du livre) ou une niche.');
      return;
    }
    setLoading(true); setReport(null);
    try {
      const { data, error } = await supabase.functions.invoke('book-positioning', {
        body: {
          title: cfg.title, genre: cfg.genre, audience: cfg.targetAudience,
          summary: cfg.description, niche: niche.trim(), market,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setReport(data.report as Report);
    } catch (e: any) {
      toast.error(e?.message || 'Échec de l\'analyse de positionnement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5" style={{ color: INK }}>
      <div className="rounded-2xl border p-4" style={{ borderColor: '#eadfc9', background: AMBER_SOFT }}>
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4" style={{ color: AMBER_DEEP }} />
          <span className="text-sm font-bold">Meilleures positions pour votre livre</span>
        </div>
        <p className="mt-1 text-[12.5px]" style={{ color: '#6f5e47' }}>
          Catégories KDP atteignables, 7 mots-clés porteurs et angle concurrentiel.
          {cfg.title ? <> Livre : <strong style={{ color: AMBER_DEEP }}>{cfg.title}</strong>.</> : ' Renseignez la fiche du livre dans le Parcours ou une niche ci-dessous.'}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input placeholder="Niche précise (optionnel — ex. sommeil du nourrisson)" value={niche} onChange={(e) => setNiche(e.target.value)} />
        <Input className="sm:w-40" value={market} onChange={(e) => setMarket(e.target.value)} placeholder="Marché" />
        <Button onClick={run} disabled={loading} style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)`, color: '#fff' }}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Compass className="h-4 w-4" />}
          <span className="ml-1.5">Analyser</span>
        </Button>
      </div>

      {loading && <p className="text-sm" style={{ color: '#8a7860' }}>Le Stratège cherche les meilleures positions…</p>}

      {report && (
        <div className="space-y-5 text-sm">
          <div className="rounded-xl border p-3" style={{ borderColor: `${AMBER}44`, background: '#fff' }}>
            <p style={{ color: '#4a3f30' }}>{report.summary}</p>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 font-semibold"><Tag className="h-4 w-4" style={{ color: AMBER_DEEP }} /> Meilleures catégories KDP</p>
            <div className="space-y-2">
              {report.categories.map((c, i) => (
                <div key={i} className="rounded-lg border p-2.5" style={{ borderColor: '#eadfc9' }}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium" style={{ color: INK }}>{c.path}</span>
                    <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                      style={{ background: `${diffColor[c.difficulty] || AMBER}22`, color: diffColor[c.difficulty] || AMBER }}>
                      {c.difficulty} · {c.target_rank}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12.5px]" style={{ color: '#6f5e47' }}>{c.why}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 font-semibold"><KeyRound className="h-4 w-4" style={{ color: AMBER_DEEP }} /> 7 mots-clés KDP</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {report.keywords.map((k, i) => (
                <div key={i} className="rounded-lg border p-2.5" style={{ borderColor: '#eadfc9' }}>
                  <div className="flex items-center gap-2">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-black" style={{ background: AMBER_SOFT, color: AMBER_DEEP }}>{i + 1}</span>
                    <span className="font-medium" style={{ color: INK }}>{k.keyword}</span>
                  </div>
                  <p className="mt-0.5 text-[12px]" style={{ color: '#8a7860' }}>{k.intent}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 font-semibold"><Swords className="h-4 w-4" style={{ color: AMBER_DEEP }} /> Positionnement concurrentiel</p>
            <div className="rounded-lg border p-2.5 mb-2" style={{ borderColor: `${AMBER}44`, background: AMBER_SOFT }}>
              <span className="text-[11px] font-bold uppercase" style={{ color: AMBER_DEEP }}>Angle à prendre</span>
              <p className="text-[13px]" style={{ color: '#4a3f30' }}>{report.competitive.angle}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border p-2.5" style={{ borderColor: '#eadfc9' }}>
                <span className="text-[11px] font-bold uppercase" style={{ color: '#1f9d6b' }}>Manques à exploiter</span>
                <ul className="mt-1 list-disc pl-4 text-[12.5px]" style={{ color: '#6f5e47' }}>
                  {report.competitive.gaps.map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              </div>
              <div className="rounded-lg border p-2.5" style={{ borderColor: '#eadfc9' }}>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase" style={{ color: '#E94E77' }}><AlertTriangle className="h-3 w-3" /> À surveiller</span>
                <ul className="mt-1 list-disc pl-4 text-[12.5px]" style={{ color: '#6f5e47' }}>
                  {report.competitive.watchouts.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositioningStrategist;
