import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { invokeImageFunction } from '@/lib/aiImageInvoke';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, Sparkles, Star, Check, Type, FileText, Image as ImageIcon, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

const AMBER = '#E8951E';
const AMBER_DEEP = '#C97A14';
const AMBER_SOFT = '#FFF3DF';
const INK = '#2A2118';
const GREEN = '#1f9d6b';
const SERIF = "'Instrument Serif', Georgia, 'Times New Roman', serif";

const CONFIG_KEY = 'edition_book_config_v1';

interface BookConfig {
  title: string; subtitle: string; author: string;
  description: string; genre: string; targetAudience: string;
}

function readConfig(): BookConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    const c = raw ? JSON.parse(raw) : {};
    return {
      title: c?.title || '', subtitle: c?.subtitle || '', author: c?.author || '',
      description: c?.description || '', genre: c?.genre || '', targetAudience: c?.targetAudience || '',
    };
  } catch {
    return { title: '', subtitle: '', author: '', description: '', genre: '', targetAudience: '' };
  }
}

function patchConfig(patch: Partial<BookConfig>) {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    const c = raw ? JSON.parse(raw) : {};
    localStorage.setItem(CONFIG_KEY, JSON.stringify({ ...c, ...patch }));
    window.dispatchEvent(new Event('edition_book_config_updated'));
  } catch { /* ignore */ }
}

interface TextVersion {
  label: string; angle: string;
  titre?: string; sousTitre?: string; texte?: string;
  argument: string;
}
interface TextReport {
  versions: TextVersion[];
  recommended: string;
  recommendation_reason: string;
}

const EditionVariantStudio: React.FC = () => {
  const [cfg, setCfg] = useState<BookConfig>(() => readConfig());

  useEffect(() => {
    const refresh = () => setCfg(readConfig());
    window.addEventListener('edition_book_config_updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('edition_book_config_updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return (
    <div className="space-y-5" style={{ color: INK }}>
      <div className="rounded-2xl border p-4" style={{ borderColor: '#eadfc9', background: AMBER_SOFT }}>
        <div className="flex items-center gap-2">
          <Wand2 className="h-4 w-4" style={{ color: AMBER_DEEP }} />
          <span className="text-sm font-bold">Studio A/B/C — comparez 3 versions, gardez la meilleure</span>
        </div>
        <p className="mt-1 text-[12.5px]" style={{ color: '#6f5e47' }}>
          L'IA propose 3 versions (A · B · C), en recommande une, et vous choisissez celle à garder.
          {cfg.title ? <> Livre en cours : <strong style={{ color: AMBER_DEEP }}>{cfg.title}</strong>.</> : ' Renseignez d\'abord la fiche du livre dans le Parcours.'}
        </p>
      </div>

      <Tabs defaultValue="title">
        <TabsList>
          <TabsTrigger value="title"><Type className="h-4 w-4 mr-1.5" /> Titre & sous-titre</TabsTrigger>
          <TabsTrigger value="blurb"><FileText className="h-4 w-4 mr-1.5" /> 4e de couverture</TabsTrigger>
          <TabsTrigger value="cover"><ImageIcon className="h-4 w-4 mr-1.5" /> Couverture</TabsTrigger>
        </TabsList>

        <TabsContent value="title" className="mt-4">
          <TextVariants mode="title" cfg={cfg} />
        </TabsContent>
        <TabsContent value="blurb" className="mt-4">
          <TextVariants mode="blurb" cfg={cfg} />
        </TabsContent>
        <TabsContent value="cover" className="mt-4">
          <CoverVariants cfg={cfg} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

/* ─────────── Onglets texte (titre / blurb) ─────────── */
const TextVariants: React.FC<{ mode: 'title' | 'blurb'; cfg: BookConfig }> = ({ mode, cfg }) => {
  const [summary, setSummary] = useState(cfg.description || '');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<TextReport | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);

  useEffect(() => { setSummary(cfg.description || ''); }, [cfg.description]);

  const run = async () => {
    if ((summary.trim().length < 20) && cfg.title.trim().length < 2) {
      toast.error('Renseigne au moins le titre et un résumé/sujet.');
      return;
    }
    setLoading(true); setReport(null); setChosen(null);
    try {
      const { data, error } = await supabase.functions.invoke('edition-variants', {
        body: {
          mode,
          title: cfg.title, subtitle: cfg.subtitle, genre: cfg.genre,
          audience: cfg.targetAudience, summary: summary.trim(),
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setReport(data.report as TextReport);
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération.');
    } finally {
      setLoading(false);
    }
  };

  const choose = (v: TextVersion) => {
    if (mode === 'title') {
      patchConfig({ title: v.titre || '', subtitle: v.sousTitre || '' });
      toast.success('Titre & sous-titre enregistrés dans la fiche du livre.');
    } else {
      patchConfig({ description: v.texte || '' });
      toast.success('4e de couverture enregistrée dans la fiche du livre.');
    }
    setChosen(v.label);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold" style={{ color: INK }}>Sujet / résumé du livre</label>
        <Textarea
          className="mt-1"
          rows={4}
          placeholder="De quoi parle le livre ? Promesse, thèmes, ton…"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>
      <Button onClick={run} disabled={loading} style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)`, color: '#fff' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        <span className="ml-1.5">Générer les versions A / B / C</span>
      </Button>

      {report && (
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            {report.versions.map((v) => {
              const isReco = v.label === report.recommended;
              const isChosen = v.label === chosen;
              return (
                <div key={v.label} className="rounded-2xl border p-3.5 flex flex-col"
                  style={{ borderColor: isChosen ? `${GREEN}88` : isReco ? `${AMBER}88` : '#eadfc9', background: isChosen ? `${GREEN}0d` : '#fff' }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="grid h-7 w-7 place-items-center rounded-full text-sm font-black text-white" style={{ background: AMBER_DEEP }}>{v.label}</span>
                    {isReco && (
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: AMBER_SOFT, color: AMBER_DEEP }}>
                        <Star className="h-3 w-3 fill-current" /> Recommandé
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-wide mb-1.5" style={{ color: '#a18a6c' }}>{v.angle}</div>
                  {mode === 'title' ? (
                    <div className="flex-1">
                      <div className="text-[15px] font-bold leading-tight" style={{ fontFamily: SERIF, color: INK }}>{v.titre}</div>
                      <div className="text-[13px] mt-0.5" style={{ color: '#6f5e47' }}>{v.sousTitre}</div>
                    </div>
                  ) : (
                    <p className="flex-1 text-[12.5px] leading-snug whitespace-pre-line" style={{ color: '#4a3f30' }}>{v.texte}</p>
                  )}
                  <p className="mt-2 text-[11px] italic" style={{ color: '#8a7860' }}>{v.argument}</p>
                  <Button size="sm" className="mt-3" onClick={() => choose(v)}
                    style={{ background: isChosen ? GREEN : AMBER_DEEP, color: '#fff' }}>
                    {isChosen ? <><Check className="h-3.5 w-3.5 mr-1" /> Choisi</> : 'Choisir cette version'}
                  </Button>
                </div>
              );
            })}
          </div>
          <div className="rounded-xl border p-3 text-[12.5px]" style={{ borderColor: `${AMBER}44`, background: AMBER_SOFT, color: '#6f5e47' }}>
            <strong style={{ color: AMBER_DEEP }}>Pourquoi la version {report.recommended} ?</strong> {report.recommendation_reason}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────── Onglet couverture (3 pistes visuelles) ─────────── */
const CoverVariants: React.FC<{ cfg: BookConfig }> = ({ cfg }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<(string | null)[]>([null, null, null]);

  const run = useCallback(async () => {
    if (cfg.title.trim().length < 2) {
      toast.error('Renseigne le titre du livre dans la fiche.');
      return;
    }
    setLoading(true);
    setImages([null, null, null]);
    try {
      const results = await Promise.all([1, 2, 3].map((variation) =>
        invokeImageFunction<{ imageUrl?: string; error?: string }>('generate-front-cover', {
          ebookTitle: cfg.title,
          subtitle: cfg.subtitle,
          authorName: cfg.author || 'Auteur',
          genre: cfg.genre || 'non-fiction',
          coverType: 'front',
          variation,
        }),
      ));
      const urls = results.map((r) => (r.error ? null : r.data?.imageUrl || null));
      if (urls.every((u) => !u)) throw new Error('Aucune couverture générée.');
      setImages(urls);
    } catch (e: any) {
      toast.error(e?.message || 'Échec de la génération des couvertures.');
    } finally {
      setLoading(false);
    }
  }, [cfg]);

  return (
    <div className="space-y-4">
      <p className="text-[12.5px]" style={{ color: '#6f5e47' }}>
        3 pistes de couverture (A · B · C) pour <strong style={{ color: AMBER_DEEP }}>{cfg.title || 'votre livre'}</strong>. Choisissez votre préférée, puis affinez-la dans le Directeur Artistique.
      </p>
      <Button onClick={run} disabled={loading} style={{ background: `linear-gradient(90deg, ${AMBER}, #FFB44D)`, color: '#fff' }}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
        <span className="ml-1.5">Générer 3 couvertures</span>
      </Button>
      <div className="grid gap-3 sm:grid-cols-3">
        {['A', 'B', 'C'].map((label, i) => (
          <div key={label} className="rounded-2xl border overflow-hidden" style={{ borderColor: '#eadfc9', background: '#fff' }}>
            <div className="flex items-center gap-2 px-3 py-2">
              <span className="grid h-6 w-6 place-items-center rounded-full text-[12px] font-black text-white" style={{ background: AMBER_DEEP }}>{label}</span>
              <span className="text-[12px] font-semibold" style={{ color: INK }}>Piste {label}</span>
            </div>
            <div className="aspect-[2/3] grid place-items-center" style={{ background: AMBER_SOFT }}>
              {images[i] ? (
                <img src={images[i] as string} alt={`Couverture piste ${label}`} className="h-full w-full object-cover" />
              ) : loading ? (
                <Loader2 className="h-6 w-6 animate-spin" style={{ color: AMBER_DEEP }} />
              ) : (
                <ImageIcon className="h-8 w-8 opacity-30" style={{ color: AMBER_DEEP }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditionVariantStudio;
